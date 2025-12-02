import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { NotificationService } from "../notificationService";

export const notificationsRouter = router({
  /**
   * Get all notifications for the current user
   */
  getAll: protectedProcedure
    .input(
      z
        .object({
          limit: z.number().optional(),
          unreadOnly: z.boolean().optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      return await NotificationService.getNotifications(ctx.user.id, input);
    }),

  /**
   * Get count of unread notifications
   */
  getUnreadCount: protectedProcedure.query(async ({ ctx }) => {
    return await NotificationService.getUnreadCount(ctx.user.id);
  }),

  /**
   * Mark a notification as read
   */
  markAsRead: protectedProcedure
    .input(z.object({ notificationId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await NotificationService.markAsRead(input.notificationId, ctx.user.id);
      return { success: true };
    }),

  /**
   * Mark all notifications as read
   */
  markAllAsRead: protectedProcedure.mutation(async ({ ctx }) => {
    await NotificationService.markAllAsRead(ctx.user.id);
    return { success: true };
  }),

  /**
   * Delete a notification
   */
  delete: protectedProcedure
    .input(z.object({ notificationId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await NotificationService.deleteNotification(
        input.notificationId,
        ctx.user.id
      );
      return { success: true };
    }),

  /**
   * Delete all read notifications
   */
  deleteAllRead: protectedProcedure.mutation(async ({ ctx }) => {
    await NotificationService.deleteAllRead(ctx.user.id);
    return { success: true };
  }),
});
