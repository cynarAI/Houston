import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import * as db from "../db";
import { verifyWorkspaceOwnership, verifyGoalOwnership } from "../_core/ownership";
import { NotificationService } from "../notificationService";

export const goalsRouter = router({
  listByWorkspace: protectedProcedure
    .input(z.object({ workspaceId: z.number() }))
    .query(async ({ ctx, input }) => {
      // Verify user owns the workspace
      await verifyWorkspaceOwnership(input.workspaceId, ctx.user.id);
      return await db.getGoalsByWorkspaceId(input.workspaceId);
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      // Verify user has access to this goal
      await verifyGoalOwnership(input.id, ctx.user.id);
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
    .mutation(async ({ ctx, input }) => {
      // Verify user owns the workspace before creating goal
      await verifyWorkspaceOwnership(input.workspaceId, ctx.user.id);
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
    .mutation(async ({ ctx, input }) => {
      // Verify user has access to this goal
      await verifyGoalOwnership(input.id, ctx.user.id);
      const { id, ...data } = input;
      await db.updateGoal(id, data);
      return { success: true };
    }),

  updateProgress: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        progress: z.number().min(0).max(100),
        note: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify user has access to this goal
      await verifyGoalOwnership(input.id, ctx.user.id);
      
      await db.updateGoal(input.id, { progress: input.progress });

      if (input.note) {
        const goal = await db.getGoalById(input.id);
        await NotificationService.createNotification({
          userId: ctx.user.id,
          type: "system_message",
          title: `Check-in: ${goal?.title || "Ziel"}`,
          message: `Fortschritt aktualisiert auf ${input.progress}%. Notiz: ${input.note}`,
          metadata: {
            goalId: input.id,
            progress: input.progress,
            note: input.note
          }
        });
      }
      
      return { success: true };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // Verify user has access to this goal before deleting
      await verifyGoalOwnership(input.id, ctx.user.id);
      await db.deleteGoal(input.id);
      return { success: true };
    }),
});
