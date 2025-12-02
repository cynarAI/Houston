import { describe, it, expect, beforeEach } from "vitest";
import { NotificationService } from "./notificationService";
import { getDb } from "./db";
import { notifications, users } from "../drizzle/schema";
import { eq } from "drizzle-orm";

describe("Notification System", () => {
  let testUserId: number;

  beforeEach(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    // Create test user
    const [user] = await db.insert(users).values({
      openId: `test-notif-${Date.now()}`,
      name: "Test User",
      email: "test@example.com",
      credits: 100,
    });
    testUserId = user.insertId;
  });

  describe("NotificationService.createNotification", () => {
    it("should create a notification", async () => {
      await NotificationService.createNotification({
        userId: testUserId,
        type: "credit_warning",
        title: "Low Credit Balance",
        message: "Your credit balance is low",
        metadata: { creditAmount: 15 },
      });

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const result = await db
        .select()
        .from(notifications)
        .where(eq(notifications.userId, testUserId));

      expect(result.length).toBe(1);
      expect(result[0].type).toBe("credit_warning");
      expect(result[0].title).toBe("Low Credit Balance");
      expect(result[0].isRead).toBe(0);
    });

    it("should store metadata as JSON", async () => {
      const metadata = { creditAmount: 15, threshold: 20 };
      
      await NotificationService.createNotification({
        userId: testUserId,
        type: "credit_warning",
        title: "Test",
        message: "Test message",
        metadata,
      });

      const result = await NotificationService.getNotifications(testUserId);
      expect(result[0].metadata).toEqual(metadata);
    });
  });

  describe("NotificationService.getNotifications", () => {
    beforeEach(async () => {
      // Create multiple notifications
      await NotificationService.createNotification({
        userId: testUserId,
        type: "credit_warning",
        title: "Notification 1",
        message: "Message 1",
      });

      await NotificationService.createNotification({
        userId: testUserId,
        type: "purchase_success",
        title: "Notification 2",
        message: "Message 2",
      });
    });

    it("should get all notifications for a user", async () => {
      const result = await NotificationService.getNotifications(testUserId);
      expect(result.length).toBe(2);
    });

    it("should limit results", async () => {
      const result = await NotificationService.getNotifications(testUserId, {
        limit: 1,
      });
      expect(result.length).toBe(1);
    });

    it("should filter unread notifications", async () => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Mark first notification as read
      const allNotifs = await db
        .select()
        .from(notifications)
        .where(eq(notifications.userId, testUserId));

      await db
        .update(notifications)
        .set({ isRead: 1 })
        .where(eq(notifications.id, allNotifs[0].id));

      const result = await NotificationService.getNotifications(testUserId, {
        unreadOnly: true,
      });
      expect(result.length).toBe(1);
      expect(result[0].isRead).toBe(0);
    });
  });

  describe("NotificationService.getUnreadCount", () => {
    it("should return 0 when no notifications", async () => {
      const count = await NotificationService.getUnreadCount(testUserId);
      expect(count).toBe(0);
    });

    it("should count unread notifications", async () => {
      await NotificationService.createNotification({
        userId: testUserId,
        type: "credit_warning",
        title: "Test 1",
        message: "Message 1",
      });

      await NotificationService.createNotification({
        userId: testUserId,
        type: "purchase_success",
        title: "Test 2",
        message: "Message 2",
      });

      const count = await NotificationService.getUnreadCount(testUserId);
      expect(count).toBe(2);
    });
  });

  describe("NotificationService.markAsRead", () => {
    it("should mark a notification as read", async () => {
      await NotificationService.createNotification({
        userId: testUserId,
        type: "credit_warning",
        title: "Test",
        message: "Test message",
      });

      const notifs = await NotificationService.getNotifications(testUserId);
      const notifId = notifs[0].id;

      await NotificationService.markAsRead(notifId, testUserId);

      const updated = await NotificationService.getNotifications(testUserId);
      expect(updated[0].isRead).toBe(1);
      expect(updated[0].readAt).toBeTruthy();
    });
  });

  describe("NotificationService.markAllAsRead", () => {
    it("should mark all notifications as read", async () => {
      await NotificationService.createNotification({
        userId: testUserId,
        type: "credit_warning",
        title: "Test 1",
        message: "Message 1",
      });

      await NotificationService.createNotification({
        userId: testUserId,
        type: "purchase_success",
        title: "Test 2",
        message: "Message 2",
      });

      await NotificationService.markAllAsRead(testUserId);

      const count = await NotificationService.getUnreadCount(testUserId);
      expect(count).toBe(0);
    });
  });

  describe("NotificationService.deleteNotification", () => {
    it("should delete a notification", async () => {
      await NotificationService.createNotification({
        userId: testUserId,
        type: "credit_warning",
        title: "Test",
        message: "Test message",
      });

      const notifs = await NotificationService.getNotifications(testUserId);
      const notifId = notifs[0].id;

      await NotificationService.deleteNotification(notifId, testUserId);

      const remaining = await NotificationService.getNotifications(testUserId);
      expect(remaining.length).toBe(0);
    });
  });

  describe("NotificationService.deleteAllRead", () => {
    it("should delete only read notifications", async () => {
      await NotificationService.createNotification({
        userId: testUserId,
        type: "credit_warning",
        title: "Test 1",
        message: "Message 1",
      });

      await NotificationService.createNotification({
        userId: testUserId,
        type: "purchase_success",
        title: "Test 2",
        message: "Message 2",
      });

      const notifs = await NotificationService.getNotifications(testUserId);
      await NotificationService.markAsRead(notifs[0].id, testUserId);

      await NotificationService.deleteAllRead(testUserId);

      const remaining = await NotificationService.getNotifications(testUserId);
      expect(remaining.length).toBe(1);
      expect(remaining[0].isRead).toBe(0);
    });
  });
});
