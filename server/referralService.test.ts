import { describe, it, expect, beforeEach, beforeAll } from "vitest";
import { ReferralService } from "./referralService";
import { CreditService } from "./creditService";
import { getDb } from "./db";
import { users, referrals } from "../drizzle/schema";
import { eq, and } from "drizzle-orm";

// Check if database is available
let dbAvailable = false;

beforeAll(async () => {
  const db = await getDb();
  dbAvailable = !!db;
});

describe.skipIf(!dbAvailable)("ReferralService", () => {
  let referrerUserId: number;
  let refereeUserId: number;

  beforeEach(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    // Create referrer user with 50 credits (starter)
    const [referrer] = await db.insert(users).values({
      openId: `test-referrer-${Date.now()}`,
      name: "Referrer User",
      email: "referrer@example.com",
      credits: 50,
    });
    referrerUserId = referrer.insertId;

    // Create referee user with 50 credits (starter)
    const [referee] = await db.insert(users).values({
      openId: `test-referee-${Date.now()}-${Math.random()}`,
      name: "Referee User",
      email: "referee@example.com",
      credits: 50,
    });
    refereeUserId = referee.insertId;
  });

  describe("generateReferralCode", () => {
    it("should generate a code in format HOUSTON-{userId}-{random5}", async () => {
      const code = await ReferralService.generateReferralCode(referrerUserId);

      expect(code).toMatch(/^HOUSTON-\d+-[A-Z0-9]{5}$/);
      expect(code).toContain(`HOUSTON-${referrerUserId}-`);
    });

    it("should save the referral code to the user", async () => {
      const code = await ReferralService.generateReferralCode(referrerUserId);

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const [user] = await db
        .select({ referralCode: users.referralCode })
        .from(users)
        .where(eq(users.id, referrerUserId))
        .limit(1);

      expect(user.referralCode).toBe(code);
    });
  });

  describe("getOrCreateReferralCode", () => {
    it("should return existing code if user already has one", async () => {
      // First call creates the code
      const code1 =
        await ReferralService.getOrCreateReferralCode(referrerUserId);

      // Second call should return the same code
      const code2 =
        await ReferralService.getOrCreateReferralCode(referrerUserId);

      expect(code1).toBe(code2);
    });

    it("should create a new code if user has none", async () => {
      const code =
        await ReferralService.getOrCreateReferralCode(referrerUserId);

      expect(code).toMatch(/^HOUSTON-\d+-[A-Z0-9]{5}$/);
    });
  });

  describe("trackReferral", () => {
    it("should create a pending referral record", async () => {
      const code = await ReferralService.generateReferralCode(referrerUserId);

      await ReferralService.trackReferral(code, refereeUserId);

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const [referral] = await db
        .select()
        .from(referrals)
        .where(
          and(
            eq(referrals.referrerId, referrerUserId),
            eq(referrals.refereeId, refereeUserId),
          ),
        )
        .limit(1);

      expect(referral).toBeDefined();
      expect(referral.status).toBe("pending");
      expect(referral.bonusCredits).toBe(25);
    });

    it("should prevent self-referral", async () => {
      const code = await ReferralService.generateReferralCode(referrerUserId);

      // Try to refer self - should silently fail
      await ReferralService.trackReferral(code, referrerUserId);

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const referralRecords = await db
        .select()
        .from(referrals)
        .where(eq(referrals.referrerId, referrerUserId));

      // No referral record should exist for self-referral
      expect(referralRecords.length).toBe(0);
    });

    it("should not create duplicate referral for same referee", async () => {
      const code = await ReferralService.generateReferralCode(referrerUserId);

      // Track first time
      await ReferralService.trackReferral(code, refereeUserId);

      // Track second time (should be ignored)
      await ReferralService.trackReferral(code, refereeUserId);

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const referralRecords = await db
        .select()
        .from(referrals)
        .where(
          and(
            eq(referrals.referrerId, referrerUserId),
            eq(referrals.refereeId, refereeUserId),
          ),
        );

      // Should only have one referral record
      expect(referralRecords.length).toBe(1);
    });

    it("should handle invalid referral code gracefully", async () => {
      // Should not throw, just log warning
      await ReferralService.trackReferral("INVALID-CODE-12345", refereeUserId);

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const referralRecords = await db
        .select()
        .from(referrals)
        .where(eq(referrals.refereeId, refereeUserId));

      expect(referralRecords.length).toBe(0);
    });
  });

  describe("completeReferral", () => {
    it("should grant 25 bonus credits to both users", async () => {
      const code = await ReferralService.generateReferralCode(referrerUserId);
      await ReferralService.trackReferral(code, refereeUserId);

      // Get initial balances
      const referrerBalanceBefore =
        await CreditService.getBalance(referrerUserId);
      const refereeBalanceBefore =
        await CreditService.getBalance(refereeUserId);

      const result = await ReferralService.completeReferral(refereeUserId);

      expect(result.success).toBe(true);
      expect(result.bonusCredits).toBe(25);

      // Verify credit grants
      const referrerBalanceAfter =
        await CreditService.getBalance(referrerUserId);
      const refereeBalanceAfter = await CreditService.getBalance(refereeUserId);

      expect(referrerBalanceAfter).toBe(referrerBalanceBefore + 25);
      expect(refereeBalanceAfter).toBe(refereeBalanceBefore + 25);
    });

    it("should update referral status to rewarded", async () => {
      const code = await ReferralService.generateReferralCode(referrerUserId);
      await ReferralService.trackReferral(code, refereeUserId);

      await ReferralService.completeReferral(refereeUserId);

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const [referral] = await db
        .select()
        .from(referrals)
        .where(eq(referrals.refereeId, refereeUserId))
        .limit(1);

      expect(referral.status).toBe("rewarded");
      expect(referral.rewardedAt).toBeDefined();
    });

    it("should return failure when no pending referral exists", async () => {
      const result = await ReferralService.completeReferral(refereeUserId);

      expect(result.success).toBe(false);
    });

    it("should set referredBy field on referee user", async () => {
      const code = await ReferralService.generateReferralCode(referrerUserId);
      await ReferralService.trackReferral(code, refereeUserId);

      await ReferralService.completeReferral(refereeUserId);

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const [referee] = await db
        .select({ referredBy: users.referredBy })
        .from(users)
        .where(eq(users.id, refereeUserId))
        .limit(1);

      expect(referee.referredBy).toBe(referrerUserId);
    });
  });

  describe("referral limit (max 100)", () => {
    it("should block rewards when referrer has 100 completed referrals", async () => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const code = await ReferralService.generateReferralCode(referrerUserId);

      // Insert 100 completed referrals directly
      for (let i = 0; i < 100; i++) {
        await db.insert(referrals).values({
          referrerId: referrerUserId,
          refereeId: null, // Use null to avoid creating 100 users
          referralCode: code,
          status: "rewarded",
          bonusCredits: 25,
        });
      }

      // Now try to complete a new referral
      await ReferralService.trackReferral(code, refereeUserId);
      const result = await ReferralService.completeReferral(refereeUserId);

      // Should fail due to limit
      expect(result.success).toBe(false);
    });
  });

  describe("getReferralStats", () => {
    it("should return correct stats", async () => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const code = await ReferralService.generateReferralCode(referrerUserId);

      // Create some referrals: 2 pending, 3 rewarded
      await db.insert(referrals).values([
        {
          referrerId: referrerUserId,
          refereeId: null,
          referralCode: code,
          status: "pending",
          bonusCredits: 25,
        },
        {
          referrerId: referrerUserId,
          refereeId: null,
          referralCode: code,
          status: "pending",
          bonusCredits: 25,
        },
        {
          referrerId: referrerUserId,
          refereeId: null,
          referralCode: code,
          status: "rewarded",
          bonusCredits: 25,
        },
        {
          referrerId: referrerUserId,
          refereeId: null,
          referralCode: code,
          status: "rewarded",
          bonusCredits: 25,
        },
        {
          referrerId: referrerUserId,
          refereeId: null,
          referralCode: code,
          status: "rewarded",
          bonusCredits: 25,
        },
      ]);

      const stats = await ReferralService.getReferralStats(referrerUserId);

      expect(stats.totalReferrals).toBe(5);
      expect(stats.pendingReferrals).toBe(2);
      expect(stats.completedReferrals).toBe(3);
      expect(stats.totalCreditsEarned).toBe(75); // 3 * 25
    });

    it("should return zero stats for user with no referrals", async () => {
      const stats = await ReferralService.getReferralStats(referrerUserId);

      expect(stats.totalReferrals).toBe(0);
      expect(stats.pendingReferrals).toBe(0);
      expect(stats.completedReferrals).toBe(0);
      expect(stats.totalCreditsEarned).toBe(0);
    });
  });

  describe("getReferralList", () => {
    it("should return list of referrals for user", async () => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const code = await ReferralService.generateReferralCode(referrerUserId);
      await ReferralService.trackReferral(code, refereeUserId);

      const list = await ReferralService.getReferralList(referrerUserId);

      expect(list.length).toBe(1);
      expect(list[0].refereeId).toBe(refereeUserId);
      expect(list[0].status).toBe("pending");
      expect(list[0].bonusCredits).toBe(25);
    });

    it("should return empty list for user with no referrals", async () => {
      const list = await ReferralService.getReferralList(referrerUserId);

      expect(list).toEqual([]);
    });
  });
});
