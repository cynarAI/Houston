import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { protectedProcedure, router } from "../_core/trpc";
import { createCreditCheckoutSession, CREDIT_PRODUCTS, type CreditProductKey } from "../_core/stripe";
import { getDb } from "../db";
import { stripePayments } from "../../drizzle/schema";

export const stripeRouter = router({
  /**
   * Create a Stripe Checkout Session for purchasing credit packs
   */
  createCheckoutSession: protectedProcedure
    .input(
      z.object({
        productKey: z.enum([
          "orbit_pack",
          "galaxy_pack",
          "mini_booster",
          "power_booster",
          "mega_booster",
        ]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.user;
      const product = CREDIT_PRODUCTS[input.productKey as CreditProductKey];

      const origin = ctx.req.headers.origin || "http://localhost:3000";

      // Create Stripe Checkout Session
      const session = await createCreditCheckoutSession({
        userId: user.id,
        userEmail: user.email || "",
        userName: user.name || "",
        productKey: input.productKey as CreditProductKey,
        successUrl: `${origin}/app/credits?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${origin}/app/credits?canceled=true`,
      });

      // Create pending payment record
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }
      await db.insert(stripePayments).values({
        userId: user.id,
        stripeSessionId: session.id,
        amount: product.price,
        currency: product.currency,
        credits: product.credits,
        productType: product.type,
        productKey: input.productKey,
        status: "pending",
      });

      return {
        sessionId: session.id,
        url: session.url,
      };
    }),

  /**
   * Get payment history for the current user
   */
  getPaymentHistory: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) {
      return [];
    }
    const payments = await db
      .select()
      .from(stripePayments)
      .where(eq(stripePayments.userId, ctx.user.id))
      .orderBy(desc(stripePayments.createdAt))
      .limit(50);

    return payments.map((payment: any) => ({
      id: payment.id,
      amount: payment.amount / 100, // Convert cents to euros
      currency: payment.currency,
      credits: payment.credits,
      productKey: payment.productKey,
      productType: payment.productType,
      status: payment.status,
      createdAt: payment.createdAt,
      completedAt: payment.completedAt,
    }));
  }),

  /**
   * Get available credit products
   */
  getProducts: protectedProcedure.query(async () => {
    return Object.entries(CREDIT_PRODUCTS).map(([key, product]) => ({
      key,
      name: product.name,
      credits: product.credits,
      price: product.price / 100, // Convert cents to euros
      currency: product.currency,
      type: product.type,
      interval: "interval" in product ? product.interval : undefined,
    }));
  }),

  /**
   * Get current subscription status
   */
  getSubscriptionStatus: protectedProcedure.query(async ({ ctx }) => {
    // TODO: Implement subscription status check from userSubscriptions table
    // For now, return basic info
    return {
      hasActiveSubscription: false,
      plan: "starter" as const,
    };
  }),
});
