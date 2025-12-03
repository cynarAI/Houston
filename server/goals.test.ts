import { describe, expect, it, beforeAll } from "vitest";
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

describe("goals router", () => {
  let testWorkspaceId: number;

  beforeAll(async () => {
    // Create a test workspace
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Upgrade to rocket plan to allow multiple workspaces in tests

    const workspace = await caller.workspaces.create({
      name: "Test Workspace for Goals",
    });
    testWorkspaceId = workspace.id;
  });

  it("should create a new goal", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const goal = await caller.goals.create({
      workspaceId: testWorkspaceId,
      title: "Test Goal",
      description: "Test goal description",
      specific: "Increase leads by 50%",
      measurable: "Track via CRM",
      achievable: "With current resources",
      relevant: "Aligns with business goals",
      timeBound: "Within 3 months",
      priority: "high",
      status: "active",
    });

    expect(goal).toBeDefined();
    expect(goal.id).toBeGreaterThan(0);
  });

  it("should list goals by workspace", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const goals = await caller.goals.listByWorkspace({
      workspaceId: testWorkspaceId,
    });

    expect(goals).toBeDefined();
    expect(Array.isArray(goals)).toBe(true);
  });

  it("should update a goal", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Create goal
    const goal = await caller.goals.create({
      workspaceId: testWorkspaceId,
      title: "Test Goal for Update",
      description: "Test",
      specific: "Test",
      measurable: "Test",
      achievable: "Test",
      relevant: "Test",
      timeBound: "Test",
      priority: "medium",
    });

    // Update goal
    await caller.goals.update({
      id: goal.id,
      progress: 50,
    });

    // Verify update
    const updated = await caller.goals.getById({ id: goal.id });
    expect(updated).toBeDefined();
    expect(updated?.progress).toBe(50);
  });

  it("should delete a goal", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Create goal
    const goal = await caller.goals.create({
      workspaceId: testWorkspaceId,
      title: "Test Goal for Delete",
      description: "Test",
      specific: "Test",
      measurable: "Test",
      achievable: "Test",
      relevant: "Test",
      timeBound: "Test",
      priority: "low",
      status: "active",
    });

    // Delete goal
    await caller.goals.delete({ id: goal.id });

    // Verify deletion
    const goals = await caller.goals.listByWorkspace({
      workspaceId: testWorkspaceId,
    });

    const deletedGoal = goals.find((g: any) => g.id === goal.id);
    expect(deletedGoal).toBeUndefined();
  });

  describe("progress updates", () => {
    it("should update progress from 0 to 50", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      // Create goal with default progress (0)
      const goal = await caller.goals.create({
        workspaceId: testWorkspaceId,
        title: "Progress Test Goal",
        description: "Testing progress updates",
        specific: "Test",
        measurable: "Test",
        achievable: "Test",
        relevant: "Test",
        timeBound: "Test",
        priority: "medium",
        status: "active",
      });

      // Initial progress should be 0
      const initial = await caller.goals.getById({ id: goal.id });
      expect(initial?.progress).toBe(0);

      // Update progress to 50
      await caller.goals.update({
        id: goal.id,
        progress: 50,
      });

      // Verify progress update
      const updated = await caller.goals.getById({ id: goal.id });
      expect(updated?.progress).toBe(50);
    });

    it("should update progress to 100", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const goal = await caller.goals.create({
        workspaceId: testWorkspaceId,
        title: "Complete Goal Test",
        description: "Testing 100% progress",
        specific: "Test",
        measurable: "Test",
        achievable: "Test",
        relevant: "Test",
        timeBound: "Test",
        priority: "high",
        status: "active",
      });

      // Update progress to 100
      await caller.goals.update({
        id: goal.id,
        progress: 100,
      });

      const updated = await caller.goals.getById({ id: goal.id });
      expect(updated?.progress).toBe(100);
    });

    it("should allow status change to completed", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const goal = await caller.goals.create({
        workspaceId: testWorkspaceId,
        title: "Status Change Test",
        description: "Testing status change",
        specific: "Test",
        measurable: "Test",
        achievable: "Test",
        relevant: "Test",
        timeBound: "Test",
        priority: "medium",
        status: "active",
      });

      // Update status to completed along with 100% progress
      await caller.goals.update({
        id: goal.id,
        progress: 100,
        status: "completed",
      });

      const updated = await caller.goals.getById({ id: goal.id });
      expect(updated?.status).toBe("completed");
      expect(updated?.progress).toBe(100);
    });

    it("should track incremental progress updates", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const goal = await caller.goals.create({
        workspaceId: testWorkspaceId,
        title: "Incremental Progress Test",
        description: "Testing incremental updates",
        specific: "Test",
        measurable: "Test",
        achievable: "Test",
        relevant: "Test",
        timeBound: "Test",
        priority: "low",
        status: "active",
      });

      // Update progress incrementally: 0 -> 25 -> 50 -> 75 -> 100
      const progressSteps = [25, 50, 75, 100];

      for (const progress of progressSteps) {
        await caller.goals.update({
          id: goal.id,
          progress,
        });

        const current = await caller.goals.getById({ id: goal.id });
        expect(current?.progress).toBe(progress);
      }
    });
  });
});
