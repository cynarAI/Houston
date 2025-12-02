import { getDb } from "./db";
import { users, creditTransactions, creditPlans, userSubscriptions } from "../drizzle/schema";
import { eq, and, desc, gte } from "drizzle-orm";

/**
 * Credit System Errors
 */
export enum CreditError {
  INSUFFICIENT_CREDITS = "insufficient_credits",
  USER_NOT_FOUND = "user_not_found",
  INVALID_AMOUNT = "invalid_amount",
  TRANSACTION_FAILED = "transaction_failed",
}

/**
 * Feature Credit Costs Configuration
 */
export const CREDIT_COSTS = {
  // Free features (0 credits)
  CHAT_BASIC: 0,
  VIEW_CONTENT: 0,
  
  // Low-cost features (1-3 credits)
  CHAT_DEEP_ANALYSIS: 3,
  PDF_EXPORT: 2,
  AI_INSIGHTS: 3,
  
  // Medium-cost features (5-8 credits)
  GOALS_GENERATION: 5,
  STRATEGY_ANALYSIS: 8,
  CAMPAIGN_BLUEPRINT: 7,
  
  // High-cost features (10+ credits)
  MARKETING_AUDIT: 15,
  COMPETITOR_ANALYSIS: 12,
  CONTENT_CALENDAR: 10,
} as const;

export type FeatureKey = keyof typeof CREDIT_COSTS;

/**
 * Credit Service - Central service for all credit operations
 */
export class CreditService {
  /**
   * Get current credit balance for a user
   */
  static async getBalance(userId: number): Promise<number> {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    
    const result = await db.select({ credits: users.credits }).from(users).where(eq(users.id, userId)).limit(1);

    if (result.length === 0) {
      throw new Error(CreditError.USER_NOT_FOUND);
    }

    return result[0].credits;
  }

  /**
   * Check if user can afford a specific amount
   */
  static async canAfford(userId: number, amount: number): Promise<boolean> {
    const balance = await this.getBalance(userId);
    return balance >= amount;
  }

  /**
   * Charge credits from user (atomic operation with logging)
   */
  static async charge(
    userId: number,
    featureKey: string,
    amount: number,
    metadata?: Record<string, any>
  ): Promise<{
    success: boolean;
    newBalance: number;
    transactionId?: number;
    error?: string;
  }> {
    // Validate amount
    if (amount < 0) {
      return {
        success: false,
        newBalance: 0,
        error: CreditError.INVALID_AMOUNT,
      };
    }

    // Skip if amount is 0 (free feature)
    if (amount === 0) {
      const balance = await this.getBalance(userId);
      return {
        success: true,
        newBalance: balance,
      };
    }

    try {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      // Get current balance
      const userResult = await db
        .select({ credits: users.credits, lifetimeCreditsUsed: users.lifetimeCreditsUsed })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (userResult.length === 0) {
        return {
          success: false,
          newBalance: 0,
          error: CreditError.USER_NOT_FOUND,
        };
      }

      const user = userResult[0];
      const balanceBefore = user.credits;

      // Check if user can afford
      if (balanceBefore < amount) {
        return {
          success: false,
          newBalance: balanceBefore,
          error: CreditError.INSUFFICIENT_CREDITS,
        };
      }

      const balanceAfter = balanceBefore - amount;

      // Atomic update: deduct credits and update lifetime usage
      await db
        .update(users)
        .set({
          credits: balanceAfter,
          lifetimeCreditsUsed: user.lifetimeCreditsUsed + amount,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));

      // Log transaction
      const [transaction] = await db.insert(creditTransactions).values({
        userId,
        featureKey,
        creditsSpent: -amount, // Negative for deductions
        balanceBefore,
        balanceAfter,
        metadata: metadata ? JSON.stringify(metadata) : null,
      });

      // Send low credit notification if balance drops below 20
      if (balanceAfter < 20 && balanceBefore >= 20) {
        try {
          const { NotificationService } = await import("./notificationService");
          await NotificationService.createNotification({
            userId,
            type: "credit_warning",
            title: "Low Credit Balance",
            message: `Your credit balance is now ${balanceAfter} credits. Consider purchasing more credits to continue using premium features.`,
            metadata: { creditAmount: balanceAfter },
          });
        } catch (notifError) {
          console.error("Failed to send low credit notification:", notifError);
        }
      }

      return {
        success: true,
        newBalance: balanceAfter,
        transactionId: transaction.insertId,
      };
    } catch (error) {
      console.error("Credit charge failed:", error);
      return {
        success: false,
        newBalance: 0,
        error: CreditError.TRANSACTION_FAILED,
      };
    }
  }

  /**
   * Grant credits to user (top-up, subscription renewal, admin)
   */
  static async grant(
    userId: number,
    amount: number,
    reason: string,
    metadata?: Record<string, any>
  ): Promise<{
    success: boolean;
    newBalance: number;
    transactionId?: number;
    error?: string;
  }> {
    // Validate amount
    if (amount <= 0) {
      return {
        success: false,
        newBalance: 0,
        error: CreditError.INVALID_AMOUNT,
      };
    }

    try {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      // Get current balance
      const userResult = await db
        .select({ credits: users.credits })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (userResult.length === 0) {
        return {
          success: false,
          newBalance: 0,
          error: CreditError.USER_NOT_FOUND,
        };
      }

      const user = userResult[0];
      const balanceBefore = user.credits;
      const balanceAfter = balanceBefore + amount;

      // Atomic update: add credits
      await db
        .update(users)
        .set({
          credits: balanceAfter,
          lastTopupAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));

      // Log transaction
      const [transaction] = await db.insert(creditTransactions).values({
        userId,
        featureKey: reason, // e.g., "subscription_start", "topup_purchase", "admin_grant"
        creditsSpent: amount, // Positive for grants
        balanceBefore,
        balanceAfter,
        metadata: metadata ? JSON.stringify(metadata) : null,
      });

      return {
        success: true,
        newBalance: balanceAfter,
        transactionId: transaction.insertId,
      };
    } catch (error) {
      console.error("Credit grant failed:", error);
      return {
        success: false,
        newBalance: 0,
        error: CreditError.TRANSACTION_FAILED,
      };
    }
  }

  /**
   * Get usage history for a user
   */
  static async getUsageHistory(
    userId: number,
    options?: {
      limit?: number;
      since?: Date;
      featureKey?: string;
    }
  ): Promise<Array<{
    id: number;
    featureKey: string;
    creditsSpent: number;
    balanceBefore: number;
    balanceAfter: number;
    metadata: any;
    createdAt: Date;
  }>> {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    
    const transactions = await db
      .select()
      .from(creditTransactions)
      .where(eq(creditTransactions.userId, userId))
      .orderBy(desc(creditTransactions.createdAt))
      .limit(options?.limit || 50);

    // Parse metadata JSON
    return transactions.map((t) => ({
      ...t,
      metadata: t.metadata ? JSON.parse(t.metadata) : null,
    }));
  }

  /**
   * Get active subscription for a user
   */
  static async getActiveSubscription(userId: number): Promise<{
    subscription: any;
    plan: any;
  } | null> {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    
    const subscriptionResult = await db
      .select()
      .from(userSubscriptions)
      .where(and(
        eq(userSubscriptions.userId, userId),
        eq(userSubscriptions.status, "active")
      ))
      .limit(1);

    if (subscriptionResult.length === 0) {
      return null;
    }

    const subscription = subscriptionResult[0];

    const planResult = await db
      .select()
      .from(creditPlans)
      .where(eq(creditPlans.id, subscription.planId))
      .limit(1);

    return {
      subscription,
      plan: planResult.length > 0 ? planResult[0] : null,
    };
  }

  /**
   * Calculate monthly credit usage for a user
   */
  static async getMonthlyUsage(userId: number): Promise<{
    totalSpent: number;
    byFeature: Record<string, number>;
  }> {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const transactions = await db
      .select()
      .from(creditTransactions)
      .where(and(
        eq(creditTransactions.userId, userId),
        gte(creditTransactions.createdAt, monthStart)
      ));

    // Calculate total spent (only negative transactions = deductions)
    const totalSpent = transactions
      .filter((t) => t.creditsSpent < 0)
      .reduce((sum, t) => sum + Math.abs(t.creditsSpent), 0);

    // Group by feature
    const byFeature: Record<string, number> = {};
    transactions
      .filter((t) => t.creditsSpent < 0)
      .forEach((t) => {
        const key = t.featureKey;
        byFeature[key] = (byFeature[key] || 0) + Math.abs(t.creditsSpent);
      });

    return {
      totalSpent,
      byFeature,
    };
  }

  /**
   * Check if user has low credits (< 20)
   */
  static async hasLowCredits(userId: number): Promise<boolean> {
    const balance = await this.getBalance(userId);
    return balance < 20;
  }

  /**
   * Check if user has no credits (= 0)
   */
  static async hasNoCredits(userId: number): Promise<boolean> {
    const balance = await this.getBalance(userId);
    return balance === 0;
  }

  /**
   * Get credit cost for a feature
   */
  static getCost(featureKey: FeatureKey): number {
    return CREDIT_COSTS[featureKey] || 0;
  }

  /**
   * Get usage statistics (total used, average per day, most active feature)
   */
  static async getUsageStats(userId: number): Promise<{
    totalCreditsUsed: number;
    averagePerDay: number;
    mostActiveFeature: string | null;
    mostActiveFeatureCredits: number;
  }> {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    // Get user's lifetime credits used
    const [user] = await db
      .select({ lifetimeCreditsUsed: users.lifetimeCreditsUsed, createdAt: users.createdAt })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      return {
        totalCreditsUsed: 0,
        averagePerDay: 0,
        mostActiveFeature: null,
        mostActiveFeatureCredits: 0,
      };
    }

    // Calculate days since account creation
    const daysSinceCreation = Math.max(
      1,
      Math.floor(
        (Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)
      )
    );

    const averagePerDay = user.lifetimeCreditsUsed / daysSinceCreation;

    // Get most active feature
    const transactions = await db
      .select()
      .from(creditTransactions)
      .where(
        and(
          eq(creditTransactions.userId, userId),
          // Only count negative transactions (spending, not grants)
          // creditsSpent is negative for deductions
        )
      );

    // Group by feature and sum credits
    const featureMap = new Map<string, number>();
    transactions.forEach((t) => {
      if (t.creditsSpent < 0) {
        // Only count spending
        const current = featureMap.get(t.featureKey) || 0;
        featureMap.set(t.featureKey, current + Math.abs(t.creditsSpent));
      }
    });

    let mostActiveFeature: string | null = null;
    let mostActiveFeatureCredits = 0;

    featureMap.forEach((credits, feature) => {
      if (credits > mostActiveFeatureCredits) {
        mostActiveFeature = feature;
        mostActiveFeatureCredits = credits;
      }
    });

    return {
      totalCreditsUsed: user.lifetimeCreditsUsed,
      averagePerDay: Math.round(averagePerDay * 10) / 10,
      mostActiveFeature,
      mostActiveFeatureCredits,
    };
  }

  /**
   * Get daily usage history for the last N days
   */
  static async getDailyUsageHistory(
    userId: number,
    days: number = 30
  ): Promise<Array<{ date: string; credits: number }>> {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const transactions = await db
      .select()
      .from(creditTransactions)
      .where(
        and(
          eq(creditTransactions.userId, userId),
          gte(creditTransactions.createdAt, startDate)
        )
      );

    // Group by date
    const dailyMap = new Map<string, number>();

    // Initialize all days with 0
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      dailyMap.set(dateStr, 0);
    }

    // Sum credits spent per day (only negative transactions)
    transactions.forEach((t) => {
      if (t.creditsSpent < 0) {
        const dateStr = new Date(t.createdAt).toISOString().split("T")[0];
        const current = dailyMap.get(dateStr) || 0;
        dailyMap.set(dateStr, current + Math.abs(t.creditsSpent));
      }
    });

    // Convert to array and sort by date
    return Array.from(dailyMap.entries())
      .map(([date, credits]) => ({ date, credits }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  /**
   * Get top features by credit consumption
   */
  static async getTopFeatures(
    userId: number,
    limit: number = 5
  ): Promise<Array<{ featureKey: string; credits: number; percentage: number }>> {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const transactions = await db
      .select()
      .from(creditTransactions)
      .where(eq(creditTransactions.userId, userId));

    // Group by feature and sum credits (only spending)
    const featureMap = new Map<string, number>();
    let totalSpent = 0;

    transactions.forEach((t) => {
      if (t.creditsSpent < 0) {
        const credits = Math.abs(t.creditsSpent);
        const current = featureMap.get(t.featureKey) || 0;
        featureMap.set(t.featureKey, current + credits);
        totalSpent += credits;
      }
    });

    // Convert to array and sort by credits
    const features = Array.from(featureMap.entries())
      .map(([featureKey, credits]) => ({
        featureKey,
        credits,
        percentage: totalSpent > 0 ? Math.round((credits / totalSpent) * 100) : 0,
      }))
      .sort((a, b) => b.credits - a.credits)
      .slice(0, limit);

    return features;
  }

  /**
   * Get paginated transaction history
   */
  static async getTransactionHistory(
    userId: number,
    page: number = 1,
    pageSize: number = 10
  ): Promise<{
    transactions: Array<any>;
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    // Get total count
    const allTransactions = await db
      .select()
      .from(creditTransactions)
      .where(eq(creditTransactions.userId, userId));

    const total = allTransactions.length;
    const totalPages = Math.ceil(total / pageSize);

    // Get paginated results
    const offset = (page - 1) * pageSize;
    const transactions = await db
      .select()
      .from(creditTransactions)
      .where(eq(creditTransactions.userId, userId))
      .orderBy(desc(creditTransactions.createdAt))
      .limit(pageSize)
      .offset(offset);

    // Parse metadata
    const parsedTransactions = transactions.map((t) => ({
      ...t,
      metadata: t.metadata ? JSON.parse(t.metadata) : null,
    }));

    return {
      transactions: parsedTransactions,
      total,
      page,
      pageSize,
      totalPages,
    };
  }
}
