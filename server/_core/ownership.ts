import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { workspaces, goals, todos, chatSessions } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";

/**
 * Ownership Verification Utilities
 * 
 * These functions verify that users can only access their own resources.
 * They throw TRPCError with FORBIDDEN code if access is denied.
 */

/**
 * Verify that a workspace belongs to the specified user
 * @throws TRPCError if workspace doesn't exist or doesn't belong to user
 */
export async function verifyWorkspaceOwnership(
  workspaceId: number,
  userId: number
): Promise<void> {
  const db = await getDb();
  if (!db) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Database not available",
    });
  }

  const [workspace] = await db
    .select({ userId: workspaces.userId })
    .from(workspaces)
    .where(eq(workspaces.id, workspaceId))
    .limit(1);

  if (!workspace) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Workspace not found",
    });
  }

  if (workspace.userId !== userId) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You do not have access to this workspace",
    });
  }
}

/**
 * Verify that a goal belongs to a workspace owned by the user
 * @throws TRPCError if goal doesn't exist or user doesn't have access
 */
export async function verifyGoalOwnership(
  goalId: number,
  userId: number
): Promise<{ workspaceId: number }> {
  const db = await getDb();
  if (!db) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Database not available",
    });
  }

  const [goal] = await db
    .select({ workspaceId: goals.workspaceId })
    .from(goals)
    .where(eq(goals.id, goalId))
    .limit(1);

  if (!goal) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Goal not found",
    });
  }

  // Verify the workspace belongs to the user
  await verifyWorkspaceOwnership(goal.workspaceId, userId);

  return { workspaceId: goal.workspaceId };
}

/**
 * Verify that a todo belongs to a workspace owned by the user
 * @throws TRPCError if todo doesn't exist or user doesn't have access
 */
export async function verifyTodoOwnership(
  todoId: number,
  userId: number
): Promise<{ workspaceId: number }> {
  const db = await getDb();
  if (!db) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Database not available",
    });
  }

  const [todo] = await db
    .select({ workspaceId: todos.workspaceId })
    .from(todos)
    .where(eq(todos.id, todoId))
    .limit(1);

  if (!todo) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Todo not found",
    });
  }

  // Verify the workspace belongs to the user
  await verifyWorkspaceOwnership(todo.workspaceId, userId);

  return { workspaceId: todo.workspaceId };
}

/**
 * Verify that a chat session belongs to a workspace owned by the user
 * @throws TRPCError if session doesn't exist or user doesn't have access
 */
export async function verifyChatSessionOwnership(
  sessionId: number,
  userId: number
): Promise<{ workspaceId: number }> {
  const db = await getDb();
  if (!db) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Database not available",
    });
  }

  const [session] = await db
    .select({ workspaceId: chatSessions.workspaceId })
    .from(chatSessions)
    .where(eq(chatSessions.id, sessionId))
    .limit(1);

  if (!session) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Chat session not found",
    });
  }

  // Verify the workspace belongs to the user
  await verifyWorkspaceOwnership(session.workspaceId, userId);

  return { workspaceId: session.workspaceId };
}

/**
 * Get workspace ID and verify ownership in one call
 * Useful when you need the workspace for further operations
 */
export async function getWorkspaceWithOwnershipCheck(
  workspaceId: number,
  userId: number
): Promise<typeof workspaces.$inferSelect> {
  const db = await getDb();
  if (!db) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Database not available",
    });
  }

  const [workspace] = await db
    .select()
    .from(workspaces)
    .where(eq(workspaces.id, workspaceId))
    .limit(1);

  if (!workspace) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Workspace not found",
    });
  }

  if (workspace.userId !== userId) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You do not have access to this workspace",
    });
  }

  return workspace;
}
