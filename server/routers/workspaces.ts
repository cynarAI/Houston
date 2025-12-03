import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import * as db from "../db";
import { TRPCError } from "@trpc/server";
import { verifyWorkspaceOwnership } from "../_core/ownership";

export const workspaceRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return await db.getWorkspacesByUserId(ctx.user.id);
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      // Verify ownership
      await verifyWorkspaceOwnership(input.id, ctx.user.id);
      const workspace = await db.getWorkspaceById(input.id);

      if (!workspace) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Workspace not found",
        });
      }

      return workspace;
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        industry: z.string().optional(),
        companySize: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Check plan limits
      const limits = await db.getPlanLimitByUserId(ctx.user.id);
      const maxWorkspaces = limits?.maxWorkspaces ?? 1;

      // Count existing workspaces
      const workspaceCount = await db.countWorkspacesByUserId(ctx.user.id);

      if (workspaceCount >= maxWorkspaces) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: `Workspace limit reached! You have ${maxWorkspaces} workspaces available on your plan. Upgrade to Houston Pro for more.`,
        });
      }

      const id = await db.createWorkspace({
        userId: ctx.user.id,
        name: input.name,
        industry: input.industry ?? null,
        companySize: input.companySize ?? null,
      });

      return { id };
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        industry: z.string().optional(),
        companySize: z.string().optional(),
        logoUrl: z.string().url().optional().or(z.literal("")),
        onboardingCompleted: z.number().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Verify ownership
      await verifyWorkspaceOwnership(input.id, ctx.user.id);

      const updateData: Parameters<typeof db.updateWorkspace>[1] = {};
      if (input.name !== undefined) updateData.name = input.name;
      if (input.industry !== undefined)
        updateData.industry = input.industry ?? null;
      if (input.companySize !== undefined)
        updateData.companySize = input.companySize ?? null;
      if (input.logoUrl !== undefined)
        updateData.logoUrl = input.logoUrl || null;
      if (input.onboardingCompleted !== undefined)
        updateData.onboardingCompleted = input.onboardingCompleted;

      await db.updateWorkspace(input.id, updateData);

      return { success: true };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // Verify ownership
      await verifyWorkspaceOwnership(input.id, ctx.user.id);

      await db.deleteWorkspace(input.id);

      return { success: true };
    }),

  // Add a procedure to get usage stats for the dashboard
  getUsageStats: protectedProcedure.query(async ({ ctx }) => {
    // Get limits
    const limits = await db.getPlanLimitByUserId(ctx.user.id);
    const maxWorkspaces = limits?.maxWorkspaces ?? 1;

    // Count used
    const workspaceCount = await db.countWorkspacesByUserId(ctx.user.id);

    return {
      workspacesUsed: workspaceCount,
      workspacesLimit: maxWorkspaces,
    };
  }),
});
