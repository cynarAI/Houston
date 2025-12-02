import { describe, expect, it, beforeEach, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext } {
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

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

describe("chat.sendMessage", () => {
  beforeEach(() => {
    // Mock LLM invocation to avoid actual API calls
    vi.mock("./_core/llm", () => ({
      invokeLLM: vi.fn().mockResolvedValue({
        choices: [{ message: { content: "Mocked AI response" } }],
      }),
    }));
  });

  it("should create a message and return AI response", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // First create a workspace
    const workspace = await caller.workspaces.create({
      name: "Test Workspace",
    });

    // Then create a chat session
    const session = await caller.chat.createSession({
      workspaceId: workspace.id,
      title: "Test Chat",
    });

    // Send a message
    const result = await caller.chat.sendMessage({
      sessionId: session.id,
      content: "Hello Houston",
      language: "en",
    });

    // Verify the response
    expect(result).toHaveProperty("content");
    expect(typeof result.content).toBe("string");
    expect(result.content.length).toBeGreaterThan(0);
  });

  it("should fail when session does not exist", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.chat.sendMessage({
        sessionId: 99999,
        content: "Test message",
        language: "en",
      })
    ).rejects.toThrow();
  });
});
