import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import * as db from "../db";
import { verifyWorkspaceOwnership, getWorkspaceWithOwnershipCheck } from "../_core/ownership";

export const workspacesRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return await db.getWorkspacesByUserId(ctx.user.id);
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      // Verify user owns this workspace
      return await getWorkspaceWithOwnershipCheck(input.id, ctx.user.id);
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(255),
        description: z.string().max(5000).optional(),
        industry: z.string().max(100).optional(),
        companySize: z.string().max(50).optional(),
        targetAudience: z.string().max(2000).optional(),
        products: z.string().max(2000).optional(),
        marketingChannels: z.string().max(1000).optional(),
        monthlyBudget: z.string().max(50).optional(),
        challenges: z.string().max(2000).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check workspace limit BEFORE creating
      const plan = await db.getPlanLimitByUserId(ctx.user.id);
      if (plan) {
        const workspaceCount = await db.countWorkspacesByUserId(ctx.user.id);
        if (workspaceCount >= plan.maxWorkspaces) {
          throw new Error(`Workspace limit reached! You have ${plan.maxWorkspaces} workspaces on your plan. Upgrade to Houston Pro for more workspaces.`);
        }
      }

      const id = await db.createWorkspace({
        userId: ctx.user.id,
        ...input,
      });
      return { id };
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).max(255).optional(),
        description: z.string().max(5000).optional(),
        industry: z.string().max(100).optional(),
        companySize: z.string().max(50).optional(),
        targetAudience: z.string().max(2000).optional(),
        products: z.string().max(2000).optional(),
        marketingChannels: z.string().max(1000).optional(),
        monthlyBudget: z.string().max(50).optional(),
        challenges: z.string().max(2000).optional(),
        onboardingCompleted: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify user owns this workspace before updating
      await verifyWorkspaceOwnership(input.id, ctx.user.id);
      const { id, ...data } = input;
      await db.updateWorkspace(id, data);
      return { success: true };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // Verify user owns this workspace before deleting
      await verifyWorkspaceOwnership(input.id, ctx.user.id);
      await db.deleteWorkspace(input.id);
      return { success: true };
    }),
});
