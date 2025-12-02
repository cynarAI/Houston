import { describe, expect, it } from "vitest";
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
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

describe("workspaces router", () => {
  it("should list workspaces for authenticated user", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Upgrade to rocket plan to allow multiple workspaces in tests

    const workspaces = await caller.workspaces.list();

    expect(workspaces).toBeDefined();
    expect(Array.isArray(workspaces)).toBe(true);
  });

  it("should create a new workspace", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Upgrade to rocket plan to allow multiple workspaces in tests

    const workspace = await caller.workspaces.create({
      name: "Test Workspace",
    });

    expect(workspace).toBeDefined();
    expect(workspace.id).toBeGreaterThan(0);
  });

  it("should get workspace by id", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Upgrade to rocket plan to allow multiple workspaces in tests

    // Create workspace first
    const created = await caller.workspaces.create({
      name: "Test Workspace for Get",
    });

    // Get workspace
    const workspace = await caller.workspaces.getById({
      id: created.id,
    });

    expect(workspace).toBeDefined();
    expect(workspace?.id).toBe(created.id);
    expect(workspace?.name).toBe("Test Workspace for Get");
  });
});
