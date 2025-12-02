import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import * as db from "../db";

export const workspacesRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return await db.getWorkspacesByUserId(ctx.user.id);
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return await db.getWorkspaceById(input.id);
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(255),
        description: z.string().optional(),
        industry: z.string().optional(),
        companySize: z.string().optional(),
        targetAudience: z.string().optional(),
        products: z.string().optional(),
        marketingChannels: z.string().optional(),
        monthlyBudget: z.string().optional(),
        challenges: z.string().optional(),
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
        description: z.string().optional(),
        industry: z.string().optional(),
        companySize: z.string().optional(),
        targetAudience: z.string().optional(),
        products: z.string().optional(),
        marketingChannels: z.string().optional(),
        monthlyBudget: z.string().optional(),
        challenges: z.string().optional(),
        onboardingCompleted: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await db.updateWorkspace(id, data);
      return { success: true };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.deleteWorkspace(input.id);
      return { success: true };
    }),
});
