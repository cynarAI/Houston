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
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

describe("todos.create", () => {
  it("should create a new todo", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Upgrade to rocket plan to allow multiple workspaces in tests

    // First create a workspace
    const workspace = await caller.workspaces.create({
      name: "Test Workspace",
    });

    // Create a todo
    const todo = await caller.todos.create({
      workspaceId: workspace.id,
      title: "Test Todo",
      description: "Test Description",
      priority: "medium",
      status: "todo",
    });

    // Verify the todo
    expect(todo).toHaveProperty("id");
    expect(typeof todo.id).toBe("number");
    expect(todo.id).toBeGreaterThan(0);
  });

  it("should list todos by workspace", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Upgrade to rocket plan to allow multiple workspaces in tests

    // Create workspace
    const workspace = await caller.workspaces.create({
      name: "Test Workspace",
    });

    // Create multiple todos
    await caller.todos.create({
      workspaceId: workspace.id,
      title: "Todo 1",
      priority: "high",
      status: "todo",
    });

    await caller.todos.create({
      workspaceId: workspace.id,
      title: "Todo 2",
      priority: "low",
      status: "done",
    });

    // List todos
    const todos = await caller.todos.listByWorkspace({
      workspaceId: workspace.id,
    });

    expect(todos).toHaveLength(2);
    expect(todos[0]?.title).toBe("Todo 1");
    expect(todos[1]?.title).toBe("Todo 2");
  });

  it("should update todo status", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Upgrade to rocket plan to allow multiple workspaces in tests

    // Create workspace and todo
    const workspace = await caller.workspaces.create({
      name: "Test Workspace",
    });

    const todo = await caller.todos.create({
      workspaceId: workspace.id,
      title: "Test Todo",
      priority: "medium",
      status: "todo",
    });

    // Update status
    const updated = await caller.todos.update({
      id: todo.id,
      status: "done",
    });

    expect(updated.success).toBe(true);
    
    // Verify the update by fetching the todo
    const fetched = await caller.todos.getById({ id: todo.id });
    expect(fetched?.status).toBe("done");
  });
});
