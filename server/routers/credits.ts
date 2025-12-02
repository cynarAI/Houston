import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { CreditService, CREDIT_COSTS, FeatureKey } from "../creditService";
import { getDb } from "../db";
import { creditPlans, creditTopups } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const creditsRouter = router({
  /**
   * Get current credit balance
   */
  getBalance: protectedProcedure.query(async ({ ctx }) => {
    return await CreditService.getBalance(ctx.user.id);
  }),

  /**
   * Check if user can afford a specific amount
   */
  canAfford: protectedProcedure
    .input(z.object({ amount: z.number() }))
    .query(async ({ ctx, input }) => {
      return await CreditService.canAfford(ctx.user.id, input.amount);
    }),

  /**
   * Get usage history
   */
  getUsageHistory: protectedProcedure
    .input(
      z.object({
        limit: z.number().optional(),
        since: z.date().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await CreditService.getUsageHistory(ctx.user.id, input);
    }),

  /**
   * Get monthly usage statistics
   */
  getMonthlyUsage: protectedProcedure.query(async ({ ctx }) => {
    return await CreditService.getMonthlyUsage(ctx.user.id);
  }),

  /**
   * Get active subscription
   */
  getActiveSubscription: protectedProcedure.query(async ({ ctx }) => {
    return await CreditService.getActiveSubscription(ctx.user.id);
  }),

  /**
   * Check if user has low credits
   */
  hasLowCredits: protectedProcedure.query(async ({ ctx }) => {
    return await CreditService.hasLowCredits(ctx.user.id);
  }),

  /**
   * Get all available credit plans
   */
  getPlans: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    
    return await db
      .select()
      .from(creditPlans)
      .where(eq(creditPlans.active, 1));
  }),

  /**
   * Get all available credit topups
   */
  getTopups: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    
    return await db
      .select()
      .from(creditTopups)
      .where(eq(creditTopups.active, 1));
  }),

  /**
   * Get credit cost for a feature
   */
  getCost: publicProcedure
    .input(z.object({ featureKey: z.string() }))
    .query(({ input }) => {
      return CreditService.getCost(input.featureKey as FeatureKey);
    }),

  /**
   * Get all credit costs
   */
  getAllCosts: publicProcedure.query(() => {
    return CREDIT_COSTS;
  }),

  /**
   * Get usage statistics (total used, average per day, most active feature)
   */
  getUsageStats: protectedProcedure.query(async ({ ctx }) => {
    return await CreditService.getUsageStats(ctx.user.id);
  }),

  /**
   * Get daily usage history for the last 30 days
   */
  getDailyUsageHistory: protectedProcedure
    .input(z.object({ days: z.number().default(30) }))
    .query(async ({ ctx, input }) => {
      return await CreditService.getDailyUsageHistory(ctx.user.id, input.days);
    }),

  /**
   * Get top features by credit consumption
   */
  getTopFeatures: protectedProcedure
    .input(z.object({ limit: z.number().default(5) }))
    .query(async ({ ctx, input }) => {
      return await CreditService.getTopFeatures(ctx.user.id, input.limit);
    }),

  /**
   * Get paginated transaction history
   */
  getTransactionHistory: protectedProcedure
    .input(
      z.object({
        page: z.number().default(1),
        pageSize: z.number().default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      return await CreditService.getTransactionHistory(
        ctx.user.id,
        input.page,
        input.pageSize
      );
    }),
});
