import { getDb } from "./db";
import { users, referrals } from "../drizzle/schema";
import { eq, and, sql } from "drizzle-orm";
import { CreditService } from "./creditService";

/**
 * Referral Service - Handles referral code generation, tracking, and rewards
 */
export class ReferralService {
  /**
   * Generate a unique referral code for a user
   * Format: HOUSTON-{userId}-{random5}
   */
  static async generateReferralCode(userId: number): Promise<string> {
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    const code = `HOUSTON-${userId}-${random}`;
    
    const db = await getDb();
    if (!db) {
      throw new Error("Database not available");
    }

    // Update user with referral code
    await db
      .update(users)
      .set({ referralCode: code })
      .where(eq(users.id, userId));

    return code;
  }

  /**
   * Get or create referral code for a user
   */
  static async getOrCreateReferralCode(userId: number): Promise<string> {
    const db = await getDb();
    if (!db) {
      throw new Error("Database not available");
    }

    // Check if user already has a referral code
    const [user] = await db
      .select({ referralCode: users.referralCode })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (user?.referralCode) {
      return user.referralCode;
    }

    // Generate new code
    return await this.generateReferralCode(userId);
  }

  /**
   * Track a referral when someone clicks a referral link
   */
  static async trackReferral(referralCode: string, refereeId?: number): Promise<void> {
    const db = await getDb();
    if (!db) {
      throw new Error("Database not available");
    }

    // Find referrer by code
    const [referrer] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.referralCode, referralCode))
      .limit(1);

    if (!referrer) {
      console.warn(`[Referral] Invalid referral code: ${referralCode}`);
      return;
    }

    // Don't allow self-referral
    if (refereeId && referrer.id === refereeId) {
      console.warn(`[Referral] Self-referral attempt by user ${refereeId}`);
      return;
    }

    // Check if referral already exists
    if (refereeId) {
      const [existing] = await db
        .select()
        .from(referrals)
        .where(
          and(
            eq(referrals.referrerId, referrer.id),
            eq(referrals.refereeId, refereeId)
          )
        )
        .limit(1);

      if (existing) {
        console.log(`[Referral] Referral already exists for user ${refereeId}`);
        return;
      }
    }

    // Create referral record
    await db.insert(referrals).values({
      referrerId: referrer.id,
      refereeId: refereeId || null,
      referralCode,
      status: "pending",
      bonusCredits: 25,
    });

    console.log(`[Referral] Tracked referral: ${referralCode} -> user ${refereeId || "pending"}`);
  }

  /**
   * Complete a referral and grant bonus credits to both users
   */
  static async completeReferral(refereeId: number): Promise<{
    success: boolean;
    referrerId?: number;
    bonusCredits?: number;
  }> {
    const db = await getDb();
    if (!db) {
      throw new Error("Database not available");
    }

    // Find pending referral for this referee
    const [referral] = await db
      .select()
      .from(referrals)
      .where(
        and(
          eq(referrals.refereeId, refereeId),
          eq(referrals.status, "pending")
        )
      )
      .limit(1);

    if (!referral) {
      console.log(`[Referral] No pending referral found for user ${refereeId}`);
      return { success: false };
    }

    // Check referral limit (max 100 per user)
    const referralCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(referrals)
      .where(
        and(
          eq(referrals.referrerId, referral.referrerId),
          eq(referrals.status, "rewarded")
        )
      );

    if (referralCount[0]?.count >= 100) {
      console.warn(`[Referral] User ${referral.referrerId} has reached referral limit`);
      return { success: false };
    }

    // Grant bonus credits to both users
    const bonusCredits = referral.bonusCredits;

    // Grant to referrer
    await CreditService.grant(
      referral.referrerId,
      bonusCredits,
      `Referral bonus: invited user ${refereeId}`,
      { refereeId }
    );

    // Grant to referee
    await CreditService.grant(
      refereeId,
      bonusCredits,
      `Referral bonus: signed up via ${referral.referralCode}`,
      { referrerId: referral.referrerId }
    );

    // Update referral status
    await db
      .update(referrals)
      .set({
        status: "rewarded",
        rewardedAt: new Date(),
      })
      .where(eq(referrals.id, referral.id));

    // Update referee's referredBy field
    await db
      .update(users)
      .set({ referredBy: referral.referrerId })
      .where(eq(users.id, refereeId));

    // Send referral reward notifications
    try {
      const { NotificationService } = await import("./notificationService");
      
      // Notify referrer
      await NotificationService.createNotification({
        userId: referral.referrerId,
        type: "referral_reward",
        title: "Referral Reward Earned!",
        message: `You've earned ${bonusCredits} credits for referring a new user! Keep sharing to earn more.`,
        metadata: {
          creditAmount: bonusCredits,
          refereeId,
          referralCode: referral.referralCode,
        },
      });

      // Notify referee
      await NotificationService.createNotification({
        userId: refereeId,
        type: "referral_reward",
        title: "Welcome Bonus!",
        message: `You've received ${bonusCredits} bonus credits for signing up via referral code ${referral.referralCode}!`,
        metadata: {
          creditAmount: bonusCredits,
          referrerId: referral.referrerId,
          referralCode: referral.referralCode,
        },
      });
    } catch (notifError) {
      console.error("Failed to send referral notifications:", notifError);
    }

    console.log(`[Referral] Completed referral: ${referral.referralCode}, granted ${bonusCredits} credits to both users`);

    return {
      success: true,
      referrerId: referral.referrerId,
      bonusCredits,
    };
  }

  /**
   * Get referral stats for a user
   */
  static async getReferralStats(userId: number): Promise<{
    totalReferrals: number;
    pendingReferrals: number;
    completedReferrals: number;
    totalCreditsEarned: number;
  }> {
    const db = await getDb();
    if (!db) {
      return {
        totalReferrals: 0,
        pendingReferrals: 0,
        completedReferrals: 0,
        totalCreditsEarned: 0,
      };
    }

    const allReferrals = await db
      .select()
      .from(referrals)
      .where(eq(referrals.referrerId, userId));

    const totalReferrals = allReferrals.length;
    const pendingReferrals = allReferrals.filter((r) => r.status === "pending").length;
    const completedReferrals = allReferrals.filter((r) => r.status === "rewarded").length;
    const totalCreditsEarned = allReferrals
      .filter((r) => r.status === "rewarded")
      .reduce((sum, r) => sum + r.bonusCredits, 0);

    return {
      totalReferrals,
      pendingReferrals,
      completedReferrals,
      totalCreditsEarned,
    };
  }

  /**
   * Get referral list for a user
   */
  static async getReferralList(userId: number): Promise<Array<{
    id: number;
    refereeId: number | null;
    refereeName: string | null;
    status: string;
    bonusCredits: number;
    createdAt: Date;
    rewardedAt: Date | null;
  }>> {
    const db = await getDb();
    if (!db) {
      return [];
    }

    const referralList = await db
      .select({
        id: referrals.id,
        refereeId: referrals.refereeId,
        refereeName: users.name,
        status: referrals.status,
        bonusCredits: referrals.bonusCredits,
        createdAt: referrals.createdAt,
        rewardedAt: referrals.rewardedAt,
      })
      .from(referrals)
      .leftJoin(users, eq(referrals.refereeId, users.id))
      .where(eq(referrals.referrerId, userId))
      .orderBy(sql`${referrals.createdAt} DESC`);

    return referralList;
  }
}
