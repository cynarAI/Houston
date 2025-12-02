import type { Request, Response } from "express";
import Stripe from "stripe";
import { constructWebhookEvent } from "../_core/stripe";
import { getDb } from "../db";
import { stripePayments, userSubscriptions, creditPlans } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { CreditService } from "../creditService";

/**
 * Stripe Webhook Handler
 * Handles checkout.session.completed events to grant credits after successful payment
 * Route: POST /api/stripe/webhook
 */
export async function handleStripeWebhook(req: Request, res: Response) {
  const signature = req.headers["stripe-signature"];

  if (!signature || typeof signature !== "string") {
    console.error("[Stripe Webhook] Missing or invalid stripe-signature header");
    return res.status(400).json({ error: "Missing stripe-signature header" });
  }

  let event: Stripe.Event;

  try {
    // Verify webhook signature
    event = constructWebhookEvent(req.body, signature);
  } catch (err: any) {
    console.error("[Stripe Webhook] Signature verification failed:", err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  console.log(`[Stripe Webhook] Received event: ${event.type} (${event.id})`);

  // Handle test events
  if (event.id.startsWith("evt_test_")) {
    console.log("[Stripe Webhook] Test event detected, returning verification response");
    return res.json({ verified: true });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case "invoice.paid":
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;

      case "invoice.payment_failed":
        console.log(`[Stripe Webhook] Invoice payment failed: ${(event.data.object as Stripe.Invoice).id}`);
        break;

      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error: any) {
    console.error(`[Stripe Webhook] Error processing event:`, error);
    res.status(500).json({ error: error.message });
  }
}

/**
 * Handle successful checkout session
 */
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log(`[Stripe Webhook] Processing checkout.session.completed: ${session.id}`);

  const metadata = session.metadata;
  if (!metadata) {
    console.error("[Stripe Webhook] Missing metadata in session");
    return;
  }

  const userId = parseInt(metadata.userId);
  const productKey = metadata.productKey;
  const productType = metadata.productType as "plan" | "topup";
  const credits = parseInt(metadata.credits);

  if (!userId || !productKey || !productType || !credits) {
    console.error("[Stripe Webhook] Invalid metadata:", metadata);
    return;
  }

  const db = await getDb();
  if (!db) {
    console.error("[Stripe Webhook] Database not available");
    return;
  }

  // Update payment record
  await db
    .update(stripePayments)
    .set({
      status: "completed",
      stripePaymentIntentId: session.payment_intent as string,
      completedAt: new Date(),
    })
    .where(eq(stripePayments.stripeSessionId, session.id));

  // Grant credits
  const grantResult = await CreditService.grant(
    userId,
    credits,
    `Purchased ${productKey}`,
    { productKey, productType }
  );

  // Send purchase success notification
  if (grantResult.success) {
    try {
      const { NotificationService } = await import("../notificationService");
      await NotificationService.createNotification({
        userId,
        type: "purchase_success",
        title: "Purchase Successful!",
        message: `You've successfully purchased ${credits} credits. Your new balance is ${grantResult.newBalance} credits.`,
        metadata: {
          creditAmount: credits,
          newBalance: grantResult.newBalance,
          productKey,
        },
      });
    } catch (notifError) {
      console.error("Failed to send purchase notification:", notifError);
    }
  }

  // If it's a subscription, create/update subscription record
  if (productType === "plan" && session.subscription) {
    const subscriptionId = session.subscription as string;
    
    // Find the plan
    const [plan] = await db
      .select()
      .from(creditPlans)
      .where(eq(creditPlans.key, productKey))
      .limit(1);

    if (plan) {
      // Create subscription record
      const now = new Date();
      const nextMonth = new Date(now);
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      await db.insert(userSubscriptions).values({
        userId,
        planId: plan.id,
        status: "active",
        currentPeriodStart: now,
        currentPeriodEnd: nextMonth,
        cancelAtPeriodEnd: 0,
        stripeSubscriptionId: subscriptionId,
      });

      console.log(`[Stripe Webhook] Created subscription for user ${userId}, plan ${productKey}`);
    }
  }

  console.log(`[Stripe Webhook] Granted ${credits} credits to user ${userId}`);
}

/**
 * Handle subscription deletion
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log(`[Stripe Webhook] Processing customer.subscription.deleted: ${subscription.id}`);

  const db = await getDb();
  if (!db) {
    console.error("[Stripe Webhook] Database not available");
    return;
  }

  // Update subscription status
  await db
    .update(userSubscriptions)
    .set({
      status: "canceled",
    })
    .where(eq(userSubscriptions.stripeSubscriptionId, subscription.id));

  console.log(`[Stripe Webhook] Canceled subscription ${subscription.id}`);
}

/**
 * Handle subscription update
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log(`[Stripe Webhook] Processing customer.subscription.updated: ${subscription.id}`);

  const db = await getDb();
  if (!db) {
    console.error("[Stripe Webhook] Database not available");
    return;
  }

  // Update subscription period
  await db
    .update(userSubscriptions)
    .set({
      currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
      currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
      status: subscription.status === "active" ? "active" : "canceled",
    })
    .where(eq(userSubscriptions.stripeSubscriptionId, subscription.id));

  console.log(`[Stripe Webhook] Updated subscription ${subscription.id}`);
}

/**
 * Handle invoice paid (recurring subscription renewal)
 */
async function handleInvoicePaid(invoice: Stripe.Invoice) {
  console.log(`[Stripe Webhook] Processing invoice.paid: ${invoice.id}`);

  // For recurring subscriptions, grant credits on renewal
  // Only process subscription cycle renewals
  if (invoice.billing_reason === "subscription_cycle") {
    // Extract subscription ID from invoice metadata or lines
    const subscriptionId = invoice.lines.data[0]?.subscription as string | undefined;
    
    if (!subscriptionId) {
      console.log(`[Stripe Webhook] No subscription ID found in invoice ${invoice.id}`);
      return;
    }
    
    const db = await getDb();
    if (!db) {
      console.error("[Stripe Webhook] Database not available");
      return;
    }
    
    // Find subscription
    const [subscription] = await db
      .select()
      .from(userSubscriptions)
      .where(eq(userSubscriptions.stripeSubscriptionId, subscriptionId))
      .limit(1);

    if (subscription) {
      // Find plan to get credit amount
      const [plan] = await db
        .select()
        .from(creditPlans)
        .where(eq(creditPlans.id, subscription.planId))
        .limit(1);

      if (plan) {
        // Grant monthly credits (use monthlyCredits field)
        await CreditService.grant(
          subscription.userId,
          plan.monthlyCredits,
          `Monthly renewal: ${plan.name}`,
          { subscriptionId }
        );

        console.log(`[Stripe Webhook] Granted ${plan.monthlyCredits} credits to user ${subscription.userId} for subscription renewal`);
      }
    }
  }
}
