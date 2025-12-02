import { describe, it, expect, beforeEach } from "vitest";
import { CreditService, CREDIT_COSTS } from "./creditService";
import { getDb } from "./db";
import { users } from "../drizzle/schema";
import { eq } from "drizzle-orm";

describe("CreditService", () => {
  let testUserId: number;

  beforeEach(async () => {
    // Create a test user with 50 credits
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const [result] = await db.insert(users).values({
      openId: `test-${Date.now()}`,
      name: "Test User",
      email: "test@example.com",
      credits: 50,
      lifetimeCreditsUsed: 0,
    });

    testUserId = result.insertId;
  });

  describe("getBalance", () => {
    it("should return current credit balance", async () => {
      const balance = await CreditService.getBalance(testUserId);
      expect(balance).toBe(50);
    });

    it("should throw error for non-existent user", async () => {
      await expect(CreditService.getBalance(99999)).rejects.toThrow();
    });
  });

  describe("canAfford", () => {
    it("should return true when user has enough credits", async () => {
      const canAfford = await CreditService.canAfford(testUserId, 10);
      expect(canAfford).toBe(true);
    });

    it("should return false when user does not have enough credits", async () => {
      const canAfford = await CreditService.canAfford(testUserId, 100);
      expect(canAfford).toBe(false);
    });

    it("should return true for exact balance", async () => {
      const canAfford = await CreditService.canAfford(testUserId, 50);
      expect(canAfford).toBe(true);
    });
  });

  describe("charge", () => {
    it("should successfully deduct credits", async () => {
      const result = await CreditService.charge(testUserId, "TEST_FEATURE", 10);
      
      expect(result.success).toBe(true);
      expect(result.newBalance).toBe(40);
      expect(result.transactionId).toBeDefined();
    });

    it("should fail when insufficient credits", async () => {
      const result = await CreditService.charge(testUserId, "TEST_FEATURE", 100);
      
      expect(result.success).toBe(false);
      expect(result.error).toBe("insufficient_credits");
      expect(result.newBalance).toBe(50); // Balance unchanged
    });

    it("should handle zero-cost features", async () => {
      const result = await CreditService.charge(testUserId, "FREE_FEATURE", 0);
      
      expect(result.success).toBe(true);
      expect(result.newBalance).toBe(50); // Balance unchanged
    });

    it("should reject negative amounts", async () => {
      const result = await CreditService.charge(testUserId, "TEST_FEATURE", -10);
      
      expect(result.success).toBe(false);
      expect(result.error).toBe("invalid_amount");
    });

    it("should update lifetime credits used", async () => {
      await CreditService.charge(testUserId, "TEST_FEATURE", 10);
      
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const user = await db.select().from(users).where(eq(users.id, testUserId)).limit(1);
      expect(user[0].lifetimeCreditsUsed).toBe(10);
    });

    it("should log transaction with metadata", async () => {
      const metadata = { feature: "test", sessionId: 123 };
      const result = await CreditService.charge(testUserId, "TEST_FEATURE", 5, metadata);
      
      expect(result.success).toBe(true);
      
      const history = await CreditService.getUsageHistory(testUserId, { limit: 1 });
      expect(history[0].metadata).toEqual(metadata);
    });
  });

  describe("grant", () => {
    it("should successfully add credits", async () => {
      const result = await CreditService.grant(testUserId, 100, "test_topup");
      
      expect(result.success).toBe(true);
      expect(result.newBalance).toBe(150);
      expect(result.transactionId).toBeDefined();
    });

    it("should reject zero or negative amounts", async () => {
      const result1 = await CreditService.grant(testUserId, 0, "test");
      expect(result1.success).toBe(false);
      expect(result1.error).toBe("invalid_amount");

      const result2 = await CreditService.grant(testUserId, -10, "test");
      expect(result2.success).toBe(false);
      expect(result2.error).toBe("invalid_amount");
    });

    it("should update lastTopupAt timestamp", async () => {
      await CreditService.grant(testUserId, 50, "test_topup");
      
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const user = await db.select().from(users).where(eq(users.id, testUserId)).limit(1);
      expect(user[0].lastTopupAt).toBeDefined();
    });
  });

  describe("getUsageHistory", () => {
    it("should return transaction history", async () => {
      await CreditService.charge(testUserId, "FEATURE_1", 5);
      await CreditService.charge(testUserId, "FEATURE_2", 10);
      await CreditService.grant(testUserId, 20, "topup");
      
      const history = await CreditService.getUsageHistory(testUserId);
      
      expect(history.length).toBe(3);
      // History is ordered by createdAt DESC, but execution order matters
      // Check that all transactions are present
      const credits = history.map(h => h.creditsSpent).sort((a, b) => b - a);
      expect(credits).toEqual([20, -5, -10]); // Sorted: grant, then deductions
    });

    it("should respect limit parameter", async () => {
      await CreditService.charge(testUserId, "FEATURE_1", 5);
      await CreditService.charge(testUserId, "FEATURE_2", 10);
      await CreditService.charge(testUserId, "FEATURE_3", 3);
      
      const history = await CreditService.getUsageHistory(testUserId, { limit: 2 });
      
      expect(history.length).toBe(2);
    });
  });

  describe("getMonthlyUsage", () => {
    it("should calculate monthly credit usage", async () => {
      await CreditService.charge(testUserId, "CHAT_DEEP_ANALYSIS", 3);
      await CreditService.charge(testUserId, "PDF_EXPORT", 2);
      await CreditService.charge(testUserId, "CHAT_DEEP_ANALYSIS", 3);
      
      const usage = await CreditService.getMonthlyUsage(testUserId);
      
      expect(usage.totalSpent).toBe(8);
      expect(usage.byFeature["CHAT_DEEP_ANALYSIS"]).toBe(6);
      expect(usage.byFeature["PDF_EXPORT"]).toBe(2);
    });

    it("should not count granted credits in usage", async () => {
      await CreditService.charge(testUserId, "TEST_FEATURE", 10);
      await CreditService.grant(testUserId, 50, "topup");
      
      const usage = await CreditService.getMonthlyUsage(testUserId);
      
      expect(usage.totalSpent).toBe(10); // Only deductions
    });
  });

  describe("hasLowCredits", () => {
    it("should return true when credits < 20", async () => {
      // Set balance to 15
      await CreditService.charge(testUserId, "TEST", 35);
      
      const isLow = await CreditService.hasLowCredits(testUserId);
      expect(isLow).toBe(true);
    });

    it("should return false when credits >= 20", async () => {
      const isLow = await CreditService.hasLowCredits(testUserId);
      expect(isLow).toBe(false);
    });
  });

  describe("hasNoCredits", () => {
    it("should return true when credits = 0", async () => {
      // Spend all credits
      await CreditService.charge(testUserId, "TEST", 50);
      
      const isEmpty = await CreditService.hasNoCredits(testUserId);
      expect(isEmpty).toBe(true);
    });

    it("should return false when credits > 0", async () => {
      const isEmpty = await CreditService.hasNoCredits(testUserId);
      expect(isEmpty).toBe(false);
    });
  });

  describe("getCost", () => {
    it("should return correct cost for known features", () => {
      expect(CreditService.getCost("CHAT_DEEP_ANALYSIS")).toBe(3);
      expect(CreditService.getCost("PDF_EXPORT")).toBe(2);
      expect(CreditService.getCost("GOALS_GENERATION")).toBe(5);
      expect(CreditService.getCost("STRATEGY_ANALYSIS")).toBe(8);
    });

    it("should return 0 for free features", () => {
      expect(CreditService.getCost("CHAT_BASIC")).toBe(0);
      expect(CreditService.getCost("VIEW_CONTENT")).toBe(0);
    });
  });

  describe("CREDIT_COSTS", () => {
    it("should have all required feature costs defined", () => {
      expect(CREDIT_COSTS.CHAT_BASIC).toBe(0);
      expect(CREDIT_COSTS.CHAT_DEEP_ANALYSIS).toBe(3);
      expect(CREDIT_COSTS.PDF_EXPORT).toBe(2);
      expect(CREDIT_COSTS.AI_INSIGHTS).toBe(3);
      expect(CREDIT_COSTS.GOALS_GENERATION).toBe(5);
      expect(CREDIT_COSTS.STRATEGY_ANALYSIS).toBe(8);
      expect(CREDIT_COSTS.CAMPAIGN_BLUEPRINT).toBe(7);
      expect(CREDIT_COSTS.MARKETING_AUDIT).toBe(15);
      expect(CREDIT_COSTS.COMPETITOR_ANALYSIS).toBe(12);
      expect(CREDIT_COSTS.CONTENT_CALENDAR).toBe(10);
    });
  });
});
