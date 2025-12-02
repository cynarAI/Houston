import { eq, and, desc } from "drizzle-orm";
import { getDb } from "./db";
import { notifications, type InsertNotification } from "../drizzle/schema";

export type NotificationType = 
  | "credit_warning"
  | "purchase_success"
  | "referral_reward"
  | "goal_reminder"
  | "system_message";

export interface NotificationMetadata {
  creditAmount?: number;
  goalId?: number;
  purchaseAmount?: number;
  referralCode?: string;
  [key: string]: any;
}

export class NotificationService {
  /**
   * Create a new notification for a user
   */
  static async createNotification(params: {
    userId: number;
    type: NotificationType;
    title: string;
    message: string;
    metadata?: NotificationMetadata;
  }): Promise<void> {
    const db = await getDb();
    if (!db) {
      throw new Error("Database not available");
    }

    await db.insert(notifications).values({
      userId: params.userId,
      type: params.type,
      title: params.title,
      message: params.message,
      metadata: params.metadata ? JSON.stringify(params.metadata) : null,
      isRead: 0,
    });
  }

  /**
   * Get all notifications for a user
   */
  static async getNotifications(
    userId: number,
    options?: { limit?: number; unreadOnly?: boolean }
  ): Promise<any[]> {
    const db = await getDb();
    if (!db) {
      return [];
    }

    const whereConditions = options?.unreadOnly
      ? and(
          eq(notifications.userId, userId),
          eq(notifications.isRead, 0)
        )
      : eq(notifications.userId, userId);

    let query = db
      .select()
      .from(notifications)
      .where(whereConditions)
      .orderBy(desc(notifications.createdAt));

    if (options?.limit) {
      query = query.limit(options.limit) as any;
    }

    const results = await query;

    // Parse metadata JSON
    return results.map((notification: any) => ({
      ...notification,
      metadata: notification.metadata
        ? JSON.parse(notification.metadata)
        : null,
    }));
  }

  /**
   * Get count of unread notifications
   */
  static async getUnreadCount(userId: number): Promise<number> {
    const db = await getDb();
    if (!db) {
      return 0;
    }

    const results = await db
      .select()
      .from(notifications)
      .where(
        and(
          eq(notifications.userId, userId),
          eq(notifications.isRead, 0)
        )
      );

    return results.length;
  }

  /**
   * Mark a notification as read
   */
  static async markAsRead(notificationId: number, userId: number): Promise<void> {
    const db = await getDb();
    if (!db) {
      throw new Error("Database not available");
    }

    await db
      .update(notifications)
      .set({
        isRead: 1,
        readAt: new Date(),
      })
      .where(
        and(
          eq(notifications.id, notificationId),
          eq(notifications.userId, userId)
        )
      );
  }

  /**
   * Mark all notifications as read for a user
   */
  static async markAllAsRead(userId: number): Promise<void> {
    const db = await getDb();
    if (!db) {
      throw new Error("Database not available");
    }

    await db
      .update(notifications)
      .set({
        isRead: 1,
        readAt: new Date(),
      })
      .where(
        and(
          eq(notifications.userId, userId),
          eq(notifications.isRead, 0)
        )
      );
  }

  /**
   * Delete a notification
   */
  static async deleteNotification(
    notificationId: number,
    userId: number
  ): Promise<void> {
    const db = await getDb();
    if (!db) {
      throw new Error("Database not available");
    }

    await db
      .delete(notifications)
      .where(
        and(
          eq(notifications.id, notificationId),
          eq(notifications.userId, userId)
        )
      );
  }

  /**
   * Delete all read notifications for a user
   */
  static async deleteAllRead(userId: number): Promise<void> {
    const db = await getDb();
    if (!db) {
      throw new Error("Database not available");
    }

    await db
      .delete(notifications)
      .where(
        and(
          eq(notifications.userId, userId),
          eq(notifications.isRead, 1)
        )
      );
  }
}
