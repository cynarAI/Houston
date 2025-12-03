import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import {
  workspaces,
  users,
  planLimits,
  userSubscriptions,
} from "../../drizzle/schema";
import { eq, and, count } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const workspaceRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select()
      .from(workspaces)
      .where(eq(workspaces.userId, ctx.user.id));
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const [workspace] = await ctx.db
        .select()
        .from(workspaces)
        .where(
          and(eq(workspaces.id, input.id), eq(workspaces.userId, ctx.user.id)),
        )
        .limit(1);

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
      const [limits] = await ctx.db
        .select()
        .from(planLimits)
        .where(eq(planLimits.userId, ctx.user.id))
        .limit(1);

      // Default limits if no record found (fallback to free tier)
      const maxWorkspaces = limits?.maxWorkspaces ?? 1;

      // Count existing workspaces
      const [workspaceCount] = await ctx.db
        .select({ count: count() })
        .from(workspaces)
        .where(eq(workspaces.userId, ctx.user.id));

      if (workspaceCount.count >= maxWorkspaces) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: `Workspace limit reached! You have ${maxWorkspaces} workspaces available on your plan. Upgrade to Houston Pro for more.`,
        });
      }

      const [result] = await ctx.db.insert(workspaces).values({
        userId: ctx.user.id,
        name: input.name,
        industry: input.industry,
        companySize: input.companySize,
      });

      return { id: result.insertId };
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
      const [workspace] = await ctx.db
        .select()
        .from(workspaces)
        .where(
          and(eq(workspaces.id, input.id), eq(workspaces.userId, ctx.user.id)),
        )
        .limit(1);

      if (!workspace) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Workspace not found",
        });
      }

      await ctx.db
        .update(workspaces)
        .set({
          name: input.name,
          industry: input.industry,
          companySize: input.companySize,
          logoUrl: input.logoUrl,
          onboardingCompleted: input.onboardingCompleted,
          updatedAt: new Date(),
        })
        .where(eq(workspaces.id, input.id));

      return { success: true };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const [workspace] = await ctx.db
        .select()
        .from(workspaces)
        .where(
          and(eq(workspaces.id, input.id), eq(workspaces.userId, ctx.user.id)),
        )
        .limit(1);

      if (!workspace) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Workspace not found",
        });
      }

      await ctx.db.delete(workspaces).where(eq(workspaces.id, input.id));

      return { success: true };
    }),

  // Add a procedure to get usage stats for the dashboard
  getUsageStats: protectedProcedure.query(async ({ ctx }) => {
    // Get limits
    const [limits] = await ctx.db
      .select()
      .from(planLimits)
      .where(eq(planLimits.userId, ctx.user.id))
      .limit(1);

    const maxWorkspaces = limits?.maxWorkspaces ?? 1;

    // Count used
    const [workspaceCount] = await ctx.db
      .select({ count: count() })
      .from(workspaces)
      .where(eq(workspaces.userId, ctx.user.id));

    return {
      workspacesUsed: workspaceCount.count,
      workspacesLimit: maxWorkspaces,
    };
  }),
});
