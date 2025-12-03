import { describe, it, expect, beforeEach, beforeAll } from "vitest";
import { getDb } from "./db";
import {
  users,
  workspaces,
  goals,
  todos,
  chatSessions,
} from "../drizzle/schema";
import {
  verifyWorkspaceOwnership,
  verifyGoalOwnership,
  verifyTodoOwnership,
  verifyChatSessionOwnership,
  getWorkspaceWithOwnershipCheck,
} from "./_core/ownership";
import { TRPCError } from "@trpc/server";

// Check if database is available
let dbAvailable = false;

beforeAll(async () => {
  const db = await getDb();
  dbAvailable = !!db;
});

describe.skipIf(!dbAvailable)("Ownership Verification", () => {
  let user1Id: number;
  let user2Id: number;
  let workspace1Id: number;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let workspace2Id: number;
  let goal1Id: number;
  let todo1Id: number;
  let session1Id: number;

  beforeEach(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    // Create two test users
    const [user1Result] = await db.insert(users).values({
      openId: `test-owner-1-${Date.now()}`,
      name: "Owner 1",
      email: "owner1@test.com",
    });
    user1Id = user1Result.insertId;

    const [user2Result] = await db.insert(users).values({
      openId: `test-owner-2-${Date.now()}`,
      name: "Owner 2",
      email: "owner2@test.com",
    });
    user2Id = user2Result.insertId;

    // Create workspace for user1
    const [workspace1Result] = await db.insert(workspaces).values({
      userId: user1Id,
      name: "User 1 Workspace",
    });
    workspace1Id = workspace1Result.insertId;

    // Create workspace for user2
    const [workspace2Result] = await db.insert(workspaces).values({
      userId: user2Id,
      name: "User 2 Workspace",
    });
    workspace2Id = workspace2Result.insertId;

    // Create goal in user1's workspace
    const [goal1Result] = await db.insert(goals).values({
      workspaceId: workspace1Id,
      title: "Test Goal",
    });
    goal1Id = goal1Result.insertId;

    // Create todo in user1's workspace
    const [todo1Result] = await db.insert(todos).values({
      workspaceId: workspace1Id,
      title: "Test Todo",
    });
    todo1Id = todo1Result.insertId;

    // Create chat session in user1's workspace
    const [session1Result] = await db.insert(chatSessions).values({
      workspaceId: workspace1Id,
      title: "Test Chat",
    });
    session1Id = session1Result.insertId;
  });

  describe("verifyWorkspaceOwnership", () => {
    it("should allow access to own workspace", async () => {
      await expect(
        verifyWorkspaceOwnership(workspace1Id, user1Id),
      ).resolves.toBeUndefined();
    });

    it("should deny access to another user's workspace", async () => {
      await expect(
        verifyWorkspaceOwnership(workspace1Id, user2Id),
      ).rejects.toThrow(TRPCError);

      try {
        await verifyWorkspaceOwnership(workspace1Id, user2Id);
      } catch (error) {
        expect(error).toBeInstanceOf(TRPCError);
        expect((error as TRPCError).code).toBe("FORBIDDEN");
      }
    });

    it("should throw NOT_FOUND for non-existent workspace", async () => {
      await expect(verifyWorkspaceOwnership(99999, user1Id)).rejects.toThrow(
        TRPCError,
      );

      try {
        await verifyWorkspaceOwnership(99999, user1Id);
      } catch (error) {
        expect(error).toBeInstanceOf(TRPCError);
        expect((error as TRPCError).code).toBe("NOT_FOUND");
      }
    });
  });

  describe("verifyGoalOwnership", () => {
    it("should allow access to goal in own workspace", async () => {
      const result = await verifyGoalOwnership(goal1Id, user1Id);
      expect(result.workspaceId).toBe(workspace1Id);
    });

    it("should deny access to goal in another user's workspace", async () => {
      await expect(verifyGoalOwnership(goal1Id, user2Id)).rejects.toThrow(
        TRPCError,
      );

      try {
        await verifyGoalOwnership(goal1Id, user2Id);
      } catch (error) {
        expect(error).toBeInstanceOf(TRPCError);
        expect((error as TRPCError).code).toBe("FORBIDDEN");
      }
    });

    it("should throw NOT_FOUND for non-existent goal", async () => {
      try {
        await verifyGoalOwnership(99999, user1Id);
      } catch (error) {
        expect(error).toBeInstanceOf(TRPCError);
        expect((error as TRPCError).code).toBe("NOT_FOUND");
      }
    });
  });

  describe("verifyTodoOwnership", () => {
    it("should allow access to todo in own workspace", async () => {
      const result = await verifyTodoOwnership(todo1Id, user1Id);
      expect(result.workspaceId).toBe(workspace1Id);
    });

    it("should deny access to todo in another user's workspace", async () => {
      await expect(verifyTodoOwnership(todo1Id, user2Id)).rejects.toThrow(
        TRPCError,
      );

      try {
        await verifyTodoOwnership(todo1Id, user2Id);
      } catch (error) {
        expect(error).toBeInstanceOf(TRPCError);
        expect((error as TRPCError).code).toBe("FORBIDDEN");
      }
    });
  });

  describe("verifyChatSessionOwnership", () => {
    it("should allow access to session in own workspace", async () => {
      const result = await verifyChatSessionOwnership(session1Id, user1Id);
      expect(result.workspaceId).toBe(workspace1Id);
    });

    it("should deny access to session in another user's workspace", async () => {
      await expect(
        verifyChatSessionOwnership(session1Id, user2Id),
      ).rejects.toThrow(TRPCError);

      try {
        await verifyChatSessionOwnership(session1Id, user2Id);
      } catch (error) {
        expect(error).toBeInstanceOf(TRPCError);
        expect((error as TRPCError).code).toBe("FORBIDDEN");
      }
    });
  });

  describe("getWorkspaceWithOwnershipCheck", () => {
    it("should return workspace data for owner", async () => {
      const workspace = await getWorkspaceWithOwnershipCheck(
        workspace1Id,
        user1Id,
      );
      expect(workspace.id).toBe(workspace1Id);
      expect(workspace.userId).toBe(user1Id);
      expect(workspace.name).toBe("User 1 Workspace");
    });

    it("should throw FORBIDDEN for non-owner", async () => {
      try {
        await getWorkspaceWithOwnershipCheck(workspace1Id, user2Id);
      } catch (error) {
        expect(error).toBeInstanceOf(TRPCError);
        expect((error as TRPCError).code).toBe("FORBIDDEN");
      }
    });
  });
});
