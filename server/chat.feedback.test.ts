import { describe, it, expect, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("Chat Feedback & Regenerate", () => {
  describe("sendFeedback", () => {
    it("should accept positive feedback", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.chat.sendFeedback({
        messageId: 1,
        feedback: "positive",
      });

      expect(result.success).toBe(true);
    });

    it("should accept negative feedback", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.chat.sendFeedback({
        messageId: 1,
        feedback: "negative",
      });

      expect(result.success).toBe(true);
    });

    it("should reject invalid feedback type", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.chat.sendFeedback({
          messageId: 1,
          // @ts-expect-error - testing invalid input
          feedback: "invalid",
        })
      ).rejects.toThrow();
    });
  });

  describe("regenerateResponse procedure exists", () => {
    it("should have regenerateResponse procedure defined", () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      // Just check that the procedure exists
      expect(caller.chat.regenerateResponse).toBeDefined();
      expect(typeof caller.chat.regenerateResponse).toBe("function");
    });
  });
});
