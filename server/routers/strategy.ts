import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import * as db from "../db";

export const strategyRouter = router({
  getByWorkspace: protectedProcedure
    .input(z.object({ workspaceId: z.number() }))
    .query(async ({ input }) => {
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
    .mutation(async ({ input }) => {
      const id = await db.createOrUpdateStrategy(input);
      return { id };
    }),
});
