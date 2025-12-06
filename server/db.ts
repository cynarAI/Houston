import { eq, desc, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "../drizzle/schema";
import {
  InsertUser,
  users,
  workspaces,
  InsertWorkspace,
  goals,
  InsertGoal,
  strategies,
  InsertStrategy,
  todos,
  InsertTodo,
  chatSessions,
  InsertChatSession,
  chatMessages,
  InsertChatMessage,
  planLimits,
  InsertPlanLimit,
  onboardingData,
  InsertOnboardingData,
  contentLibrary,
  InsertContentLibraryItem,
  aiTasks,
  InsertAiTask,
  usageCounters,
  InsertUsageCounter,
  assets,
  InsertAsset,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL, { schema, mode: "default" });
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return null;
  }

  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

/**
 * Delete a user and all associated data (GDPR Art. 17 - Right to Erasure)
 * CASCADE constraints handle: workspaces, goals, todos, chatSessions, chatMessages,
 * planLimits, onboardingData, creditTransactions, userSubscriptions, stripePayments,
 * referrals, notifications
 */
export async function deleteUser(userId: number): Promise<void> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    await db.delete(users).where(eq(users.id, userId));
  } catch (error) {
    console.error("[Database] Failed to delete user:", error);
    throw error;
  }
}

// ============ Workspace Queries ============

export async function createWorkspace(workspace: InsertWorkspace) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(workspaces).values(workspace);
  return Number(result[0].insertId);
}

export async function getWorkspacesByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(workspaces)
    .where(eq(workspaces.userId, userId));
}

export async function getWorkspaceById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db
    .select()
    .from(workspaces)
    .where(eq(workspaces.id, id))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateWorkspace(
  id: number,
  data: Partial<InsertWorkspace>,
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(workspaces).set(data).where(eq(workspaces.id, id));
}

export async function deleteWorkspace(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(workspaces).where(eq(workspaces.id, id));
}

// ============ AI Tasks & Usage ============

export async function upsertAiTask(task: InsertAiTask) {
  const db = await getDb();
  if (!db) return;
  await db
    .insert(aiTasks)
    .values(task)
    .onDuplicateKeyUpdate({
      set: {
        status: task.status,
        resultRef: task.resultRef,
        errorCode: task.errorCode,
        webhookPayload: task.webhookPayload,
        updatedAt: new Date(),
      },
    });
}

type RateLimitPlan = "free" | "pro";
const RATE_LIMITS: Record<
  RateLimitPlan,
  Record<string, { maxCalls: number }>
> = {
  free: {
    text: { maxCalls: 50 },
    image: { maxCalls: 10 },
    tts: { maxCalls: 20 },
    stt: { maxCalls: 20 },
  },
  pro: {
    text: { maxCalls: 500 },
    image: { maxCalls: 50 },
    tts: { maxCalls: 200 },
    stt: { maxCalls: 200 },
  },
};

export async function getRateLimitPlan(userId: number): Promise<RateLimitPlan> {
  const plan = await getPlanLimitByUserId(userId);
  if (!plan) return "free";
  return plan.plan === "rocket" ? "pro" : "free";
}

export async function isUsageAllowed(params: {
  userId: number;
  modality: InsertUsageCounter["modality"];
  plan?: RateLimitPlan;
  window?: string;
}) {
  const db = await getDb();
  if (!db) return { allowed: true, remaining: undefined };
  const window = params.window ?? new Date().toISOString().slice(0, 10);
  const planKey = params.plan ?? (await getRateLimitPlan(params.userId));
  const rule = RATE_LIMITS[planKey]?.[params.modality];
  if (!rule) return { allowed: true, remaining: undefined };

  const existing = await db
    .select()
    .from(usageCounters)
    .where(
      and(
        eq(usageCounters.userId, params.userId),
        eq(usageCounters.window, window),
        eq(usageCounters.modality, params.modality),
      ),
    )
    .limit(1);

  const used = existing[0]?.count ?? 0;
  const remaining = rule.maxCalls - used;
  return { allowed: remaining > 0, remaining };
}

export async function incrementUsageCounter(params: {
  userId: number;
  modality: InsertUsageCounter["modality"];
  delta?: number;
  promptTokens?: number;
  completionTokens?: number;
  window?: string;
}) {
  const db = await getDb();
  if (!db) return;
  const window = params.window ?? new Date().toISOString().slice(0, 10);
  const existing = await db
    .select()
    .from(usageCounters)
    .where(
      and(
        eq(usageCounters.userId, params.userId),
        eq(usageCounters.window, window),
        eq(usageCounters.modality, params.modality),
      ),
    )
    .limit(1);

  if (existing.length === 0) {
    await db.insert(usageCounters).values({
      userId: params.userId,
      modality: params.modality,
      window,
      count: params.delta ?? 1,
      promptTokens: params.promptTokens,
      completionTokens: params.completionTokens,
    });
    return;
  }

  const row = existing[0];
  await db
    .update(usageCounters)
    .set({
      count: row.count + (params.delta ?? 1),
      promptTokens: (row.promptTokens ?? 0) + (params.promptTokens ?? 0),
      completionTokens:
        (row.completionTokens ?? 0) + (params.completionTokens ?? 0),
    })
    .where(eq(usageCounters.id, row.id));
}

export async function createAsset(asset: InsertAsset) {
  const db = await getDb();
  if (!db) return;
  await db.insert(assets).values(asset);
}

// ============ Goal Queries ============

export async function createGoal(goal: InsertGoal) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(goals).values(goal);
  return Number(result[0].insertId);
}

export async function getGoalsByWorkspaceId(workspaceId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(goals)
    .where(eq(goals.workspaceId, workspaceId));
}

export async function getGoalById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(goals).where(eq(goals.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateGoal(id: number, data: Partial<InsertGoal>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(goals).set(data).where(eq(goals.id, id));
}

export async function deleteGoal(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(goals).where(eq(goals.id, id));
}

// ============ Strategy Queries ============

export async function createOrUpdateStrategy(strategy: InsertStrategy) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await db
    .select()
    .from(strategies)
    .where(eq(strategies.workspaceId, strategy.workspaceId))
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(strategies)
      .set(strategy)
      .where(eq(strategies.workspaceId, strategy.workspaceId));
    return existing[0].id;
  } else {
    const result = await db.insert(strategies).values(strategy);
    return Number(result[0].insertId);
  }
}

export async function getStrategyByWorkspaceId(workspaceId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db
    .select()
    .from(strategies)
    .where(eq(strategies.workspaceId, workspaceId))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}

// ============ Todo Queries ============

export async function createTodo(todo: InsertTodo) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(todos).values(todo);
  return Number(result[0].insertId);
}

export async function getTodosByWorkspaceId(workspaceId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(todos)
    .where(eq(todos.workspaceId, workspaceId));
}

export async function getTodoById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(todos).where(eq(todos.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateTodo(id: number, data: Partial<InsertTodo>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(todos).set(data).where(eq(todos.id, id));
}

export async function deleteTodo(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(todos).where(eq(todos.id, id));
}

// ============ Chat Session Queries ============

export async function createChatSession(session: InsertChatSession) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(chatSessions).values(session);
  return Number(result[0].insertId);
}

export async function getChatSessionsByWorkspaceId(workspaceId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(chatSessions)
    .where(eq(chatSessions.workspaceId, workspaceId));
}

export async function getChatSessionById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db
    .select()
    .from(chatSessions)
    .where(eq(chatSessions.id, id))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function deleteChatSession(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(chatSessions).where(eq(chatSessions.id, id));
}

// ============ Chat Message Queries ============

export async function createChatMessage(message: InsertChatMessage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(chatMessages).values(message);
  return Number(result[0].insertId);
}

export async function getChatMessagesBySessionId(sessionId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(chatMessages)
    .where(eq(chatMessages.sessionId, sessionId));
}

// ============ Plan Limit Queries ============

export async function createPlanLimit(limit: InsertPlanLimit) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(planLimits).values(limit);
  return Number(result[0].insertId);
}

export async function getPlanLimitByUserId(userId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db
    .select()
    .from(planLimits)
    .where(eq(planLimits.userId, userId))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updatePlanLimit(
  userId: number,
  data: Partial<InsertPlanLimit>,
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(planLimits).set(data).where(eq(planLimits.userId, userId));
}

export async function incrementChatUsage(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const limit = await getPlanLimitByUserId(userId);
  if (!limit) throw new Error("Plan limit not found");

  await db
    .update(planLimits)
    .set({ chatsUsedThisMonth: limit.chatsUsedThisMonth + 1 })
    .where(eq(planLimits.userId, userId));
}

export async function getPlanLimitById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db
    .select()
    .from(planLimits)
    .where(eq(planLimits.id, id))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function countWorkspacesByUserId(userId: number) {
  const db = await getDb();
  if (!db) return 0;
  const result = await db
    .select()
    .from(workspaces)
    .where(eq(workspaces.userId, userId));
  return result.length;
}

export async function resetChatCounter(planId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const now = new Date();
  const periodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

  await db
    .update(planLimits)
    .set({
      chatsUsedThisMonth: 0,
      periodStart: now,
      periodEnd: periodEnd,
    })
    .where(eq(planLimits.id, planId));
}

// ============= Onboarding Data =============

export async function getOnboardingDataByUserId(userId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db
    .select()
    .from(onboardingData)
    .where(eq(onboardingData.userId, userId))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createOnboardingData(data: InsertOnboardingData) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(onboardingData).values(data);
  return { id: Number((result as any).insertId) };
}

export async function updateOnboardingData(
  id: number,
  data: Partial<InsertOnboardingData>,
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(onboardingData).set(data).where(eq(onboardingData.id, id));
}

// ============ Content Library Queries ============

export async function createContentLibraryItem(item: InsertContentLibraryItem) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(contentLibrary).values(item);
  return Number(result[0].insertId);
}

export async function getContentLibraryByWorkspaceId(workspaceId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(contentLibrary)
    .where(eq(contentLibrary.workspaceId, workspaceId))
    .orderBy(desc(contentLibrary.createdAt));
}

export async function deleteContentLibraryItem(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(contentLibrary).where(eq(contentLibrary.id, id));
}
