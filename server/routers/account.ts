import { COOKIE_NAME } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { getSessionCookieOptions } from "../_core/cookies";
import { protectedProcedure, router } from "../_core/trpc";
import { deleteUser, getWorkspacesByUserId } from "../db";
import { getDb } from "../db";
import { 
  users, goals, todos, chatSessions, chatMessages, strategies,
  creditTransactions, onboardingData, planLimits
} from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const accountRouter = router({
  /**
   * Delete user account and all associated data (GDPR Art. 17 - Right to Erasure)
   * This permanently deletes:
   * - User profile (name, email, openId)
   * - All workspaces
   * - All goals, todos, strategies
   * - All chat sessions and messages
   * - All credit transactions and plan limits
   * - All onboarding data
   * - All notifications and referrals
   */
  deleteAccount: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.user.id;

    if (!userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not authenticated",
      });
    }

    try {
      // Delete user - CASCADE will handle all related data
      await deleteUser(userId);

      // Clear session cookie
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });

      return {
        success: true,
        message: "Account and all associated data have been permanently deleted",
      };
    } catch (error) {
      console.error("[Account] Failed to delete account:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to delete account. Please try again or contact support.",
      });
    }
  }),

  /**
   * Export all user data (GDPR Art. 20 - Right to Data Portability)
   * Returns all personal data in a structured JSON format
   */
  exportAllData: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.user.id;
    const db = await getDb();

    if (!db) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Database not available",
      });
    }

    try {
      // Collect all user data
      const workspaces = await getWorkspacesByUserId(userId);
      
      const allGoals = [];
      const allTodos = [];
      const allStrategies = [];
      const allChatSessions = [];
      const allChatMessages = [];

      for (const workspace of workspaces) {
        const workspaceGoals = await db.select().from(goals).where(eq(goals.workspaceId, workspace.id));
        allGoals.push(...workspaceGoals);

        const workspaceTodos = await db.select().from(todos).where(eq(todos.workspaceId, workspace.id));
        allTodos.push(...workspaceTodos);

        const workspaceStrategies = await db.select().from(strategies).where(eq(strategies.workspaceId, workspace.id));
        allStrategies.push(...workspaceStrategies);

        const sessions = await db.select().from(chatSessions).where(eq(chatSessions.workspaceId, workspace.id));
        allChatSessions.push(...sessions);

        for (const session of sessions) {
          const messages = await db.select().from(chatMessages).where(eq(chatMessages.sessionId, session.id));
          allChatMessages.push(...messages);
        }
      }

      // Get credit transactions
      const transactions = await db.select().from(creditTransactions).where(eq(creditTransactions.userId, userId));

      // Get onboarding data
      const onboarding = await db.select().from(onboardingData).where(eq(onboardingData.userId, userId));

      // Get plan limits
      const limits = await db.select().from(planLimits).where(eq(planLimits.userId, userId));

      // Get full user data from database (ctx.user may not have all fields)
      const [fullUser] = await db.select().from(users).where(eq(users.id, userId)).limit(1);

      const exportData = {
        exportedAt: new Date().toISOString(),
        user: {
          id: fullUser?.id ?? ctx.user.id,
          name: fullUser?.name ?? ctx.user.name,
          email: fullUser?.email ?? ctx.user.email,
          createdAt: fullUser?.createdAt ?? ctx.user.createdAt,
          credits: fullUser?.credits ?? 0,
          lifetimeCreditsUsed: fullUser?.lifetimeCreditsUsed ?? 0,
        },
        workspaces: workspaces.map(w => ({
          id: w.id,
          name: w.name,
          description: w.description,
          industry: w.industry,
          companySize: w.companySize,
          targetAudience: w.targetAudience,
          products: w.products,
          marketingChannels: w.marketingChannels,
          monthlyBudget: w.monthlyBudget,
          challenges: w.challenges,
          createdAt: w.createdAt,
        })),
        goals: allGoals.map(g => ({
          id: g.id,
          title: g.title,
          description: g.description,
          status: g.status,
          priority: g.priority,
          progress: g.progress,
          deadline: g.deadline,
          createdAt: g.createdAt,
        })),
        todos: allTodos.map(t => ({
          id: t.id,
          title: t.title,
          description: t.description,
          status: t.status,
          priority: t.priority,
          dueDate: t.dueDate,
          createdAt: t.createdAt,
        })),
        strategies: allStrategies.map(s => ({
          id: s.id,
          positioning: s.positioning,
          personas: s.personas,
          coreMessages: s.coreMessages,
          channels: s.channels,
          contentPillars: s.contentPillars,
          createdAt: s.createdAt,
        })),
        chatHistory: allChatMessages.map(m => ({
          id: m.id,
          role: m.role,
          content: m.content,
          createdAt: m.createdAt,
        })),
        creditTransactions: transactions.map(t => ({
          id: t.id,
          featureKey: t.featureKey,
          creditsSpent: t.creditsSpent,
          balanceBefore: t.balanceBefore,
          balanceAfter: t.balanceAfter,
          createdAt: t.createdAt,
        })),
        onboardingData: onboarding[0] ? {
          companyName: onboarding[0].companyName,
          industry: onboarding[0].industry,
          companySize: onboarding[0].companySize,
          website: onboarding[0].website,
          primaryGoal: onboarding[0].primaryGoal,
          monthlyBudget: onboarding[0].monthlyBudget,
          completedAt: onboarding[0].completedAt,
        } : null,
        planLimits: limits[0] ? {
          plan: limits[0].plan,
          maxWorkspaces: limits[0].maxWorkspaces,
          maxChatsPerMonth: limits[0].maxChatsPerMonth,
          maxGoals: limits[0].maxGoals,
          maxTodos: limits[0].maxTodos,
        } : null,
      };

      return {
        filename: `houston-data-export-${Date.now()}.json`,
        data: JSON.stringify(exportData, null, 2),
      };
    } catch (error) {
      console.error("[Account] Failed to export data:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to export data. Please try again.",
      });
    }
  }),
});
