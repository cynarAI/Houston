import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import * as db from "../db";
import { verifyWorkspaceOwnership } from "../_core/ownership";

export const strategyRouter = router({
  getByWorkspace: protectedProcedure
    .input(z.object({ workspaceId: z.number() }))
    .query(async ({ ctx, input }) => {
      // Verify user owns the workspace
      await verifyWorkspaceOwnership(input.workspaceId, ctx.user.id);
      return await db.getStrategyByWorkspaceId(input.workspaceId);
    }),

  createOrUpdate: protectedProcedure
    .input(
      z.object({
        workspaceId: z.number(),
        positioning: z.string().optional(),
        personas: z.string().optional(), // JSON string
        coreMessages: z.string().optional(), // JSON string
        channels: z.string().optional(), // JSON string
        contentPillars: z.string().optional(), // JSON string
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify user owns the workspace before updating strategy
      await verifyWorkspaceOwnership(input.workspaceId, ctx.user.id);
      const id = await db.createOrUpdateStrategy(input);
      return { id };
    }),
});
