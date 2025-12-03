import { z } from "zod";
import { eq, and, desc, gte, sql, lt } from "drizzle-orm";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { creditTransactions, users } from "../../drizzle/schema";

export const analyticsRouter = router({
  /**
   * Get credit usage breakdown by feature for the last 30 days
   */
  getCreditUsageBreakdown: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) {
      return { breakdown: [], totalUsed: 0 };
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get all deduction transactions in last 30 days (creditsSpent < 0)
    const transactions = await db
      .select()
      .from(creditTransactions)
      .where(
        and(
          eq(creditTransactions.userId, ctx.user.id),
          lt(creditTransactions.creditsSpent, 0), // Negative = deduction
          gte(creditTransactions.createdAt, thirtyDaysAgo)
        )
      )
      .orderBy(desc(creditTransactions.createdAt));

    // Aggregate by feature
    const featureMap = new Map<string, number>();
    let totalUsed = 0;

    for (const tx of transactions) {
      const feature = tx.featureKey || "unknown";
      const amount = Math.abs(tx.creditsSpent); // Convert negative to positive
      featureMap.set(feature, (featureMap.get(feature) || 0) + amount);
      totalUsed += amount;
    }

    // Convert to array and calculate percentages
    const breakdown: Array<{ feature: string; credits: number; percentage: number }> = [];
    featureMap.forEach((credits, feature) => {
      breakdown.push({
        feature,
        credits,
        percentage: totalUsed > 0 ? Math.round((credits / totalUsed) * 100) : 0,
      });
    });

    breakdown.sort((a, b) => b.credits - a.credits); // Sort by credits descending

    return {
      breakdown,
      totalUsed,
    };
  }),

  /**
   * Get daily credit usage for the last 7 days
   */
  getDailyUsageTrend: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) {
      return [];
    }

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Get all deduction transactions in last 7 days
    const transactions = await db
      .select()
      .from(creditTransactions)
      .where(
        and(
          eq(creditTransactions.userId, ctx.user.id),
          lt(creditTransactions.creditsSpent, 0),
          gte(creditTransactions.createdAt, sevenDaysAgo)
        )
      )
      .orderBy(creditTransactions.createdAt);

    // Group by day
    const dayMap = new Map<string, number>();

    for (const tx of transactions) {
      const date = tx.createdAt.toISOString().split("T")[0]; // YYYY-MM-DD
      const amount = Math.abs(tx.creditsSpent);
      dayMap.set(date, (dayMap.get(date) || 0) + amount);
    }

    // Fill in missing days with 0
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      result.push({
        date: dateStr,
        credits: dayMap.get(dateStr) || 0,
      });
    }

    return result;
  }),

  /**
   * Get credit usage stats (total, this month, last month, savings)
   */
  getUsageStats: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) {
      return {
        totalLifetime: 0,
        thisMonth: 0,
        lastMonth: 0,
        creditsSaved: 0,
      };
    }

    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    // Get this month's usage
    const thisMonthTxs = await db
      .select()
      .from(creditTransactions)
      .where(
        and(
          eq(creditTransactions.userId, ctx.user.id),
          lt(creditTransactions.creditsSpent, 0),
          gte(creditTransactions.createdAt, thisMonthStart)
        )
      );

    const thisMonth = thisMonthTxs.reduce((sum, tx) => sum + Math.abs(tx.creditsSpent), 0);

    // Get last month's usage
    const lastMonthTxs = await db
      .select()
      .from(creditTransactions)
      .where(
        and(
          eq(creditTransactions.userId, ctx.user.id),
          lt(creditTransactions.creditsSpent, 0),
          gte(creditTransactions.createdAt, lastMonthStart),
          sql`${creditTransactions.createdAt} <= ${lastMonthEnd}`
        )
      );

    const lastMonth = lastMonthTxs.reduce((sum, tx) => sum + Math.abs(tx.creditsSpent), 0);

    // Calculate savings (if usage decreased)
    const creditsSaved = lastMonth > thisMonth ? lastMonth - thisMonth : 0;

    // Get lifetime usage from user record (fetch from DB, ctx.user may not have this field)
    const [user] = await db
      .select({ lifetimeCreditsUsed: users.lifetimeCreditsUsed })
      .from(users)
      .where(eq(users.id, ctx.user.id))
      .limit(1);
    const totalLifetime = user?.lifetimeCreditsUsed || 0;

    return {
      totalLifetime,
      thisMonth,
      lastMonth,
      creditsSaved,
    };
  }),

  /**
   * Get most used feature
   */
  getMostUsedFeature: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) {
      return { feature: "none", credits: 0 };
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const transactions = await db
      .select()
      .from(creditTransactions)
      .where(
        and(
          eq(creditTransactions.userId, ctx.user.id),
          lt(creditTransactions.creditsSpent, 0),
          gte(creditTransactions.createdAt, thirtyDaysAgo)
        )
      );

    // Aggregate by feature
    const featureMap = new Map<string, number>();

    for (const tx of transactions) {
      const feature = tx.featureKey || "unknown";
      const amount = Math.abs(tx.creditsSpent);
      featureMap.set(feature, (featureMap.get(feature) || 0) + amount);
    }

    // Find most used
    let mostUsedFeature = "none";
    let maxCredits = 0;

    featureMap.forEach((credits, feature) => {
      if (credits > maxCredits) {
        maxCredits = credits;
        mostUsedFeature = feature;
      }
    });

    return {
      feature: mostUsedFeature,
      credits: maxCredits,
    };
  }),
});
