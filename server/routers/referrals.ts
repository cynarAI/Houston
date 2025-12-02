import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { ReferralService } from "../referralService";

export const referralsRouter = router({
  /**
   * Get or create referral code for current user
   */
  getMyReferralCode: protectedProcedure.query(async ({ ctx }) => {
    const code = await ReferralService.getOrCreateReferralCode(ctx.user.id);
    return { code };
  }),

  /**
   * Get referral stats for current user
   */
  getMyStats: protectedProcedure.query(async ({ ctx }) => {
    const stats = await ReferralService.getReferralStats(ctx.user.id);
    return stats;
  }),

  /**
   * Get referral list for current user
   */
  getMyReferrals: protectedProcedure.query(async ({ ctx }) => {
    const referrals = await ReferralService.getReferralList(ctx.user.id);
    return referrals;
  }),

  /**
   * Track a referral (called when someone clicks a referral link)
   */
  trackReferral: protectedProcedure
    .input(
      z.object({
        referralCode: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ReferralService.trackReferral(input.referralCode, ctx.user.id);
      return { success: true };
    }),

  /**
   * Complete a referral and grant bonus credits
   * (called after new user signs up)
   */
  completeReferral: protectedProcedure.mutation(async ({ ctx }) => {
    const result = await ReferralService.completeReferral(ctx.user.id);
    return result;
  }),
});
