import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import * as db from "../db";

export const goalsRouter = router({
  listByWorkspace: protectedProcedure
    .input(z.object({ workspaceId: z.number() }))
    .query(async ({ input }) => {
      return await db.getGoalsByWorkspaceId(input.workspaceId);
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return await db.getGoalById(input.id);
    }),

  create: protectedProcedure
    .input(
      z.object({
        workspaceId: z.number(),
        title: z.string().min(1).max(255),
        description: z.string().optional(),
        specific: z.string().optional(),
        measurable: z.string().optional(),
        achievable: z.string().optional(),
        relevant: z.string().optional(),
        timeBound: z.string().optional(),
        priority: z.enum(["low", "medium", "high"]).default("medium"),
      })
    )
    .mutation(async ({ input }) => {
      const id = await db.createGoal(input);
      return { id };
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1).max(255).optional(),
        description: z.string().optional(),
        specific: z.string().optional(),
        measurable: z.string().optional(),
        achievable: z.string().optional(),
        relevant: z.string().optional(),
        timeBound: z.string().optional(),
        progress: z.number().min(0).max(100).optional(),
        priority: z.enum(["low", "medium", "high"]).optional(),
        status: z.enum(["active", "completed", "archived"]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await db.updateGoal(id, data);
      return { success: true };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.deleteGoal(input.id);
      return { success: true };
    }),
});
