import type { Request, Response } from "express";
import Stripe from "stripe";
import { constructWebhookEvent } from "../_core/stripe";
import { getDb } from "../db";
import { stripePayments, userSubscriptions, creditPlans } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { CreditService } from "../creditService";

/**
 * Processed event tracking to prevent duplicate processing
 * In a production environment, this should be stored in Redis or the database
 * For now, we use the stripePayments table status field for checkout events
 */

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
 * 
 * IDEMPOTENCY: This function checks if the payment has already been processed
 * before granting credits. This prevents duplicate credit grants if Stripe
 * retries the webhook (e.g., due to timeouts or 5xx responses).
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

  // IDEMPOTENCY CHECK: Check if this payment has already been processed
  const [existingPayment] = await db
    .select()
    .from(stripePayments)
    .where(eq(stripePayments.stripeSessionId, session.id))
    .limit(1);

  if (existingPayment?.status === "completed") {
    console.log(`[Stripe Webhook] Payment ${session.id} already processed, skipping (idempotency check)`);
    return; // Already processed, skip to prevent duplicate credits
  }

  // Update payment record to "completed" BEFORE granting credits
  // This acts as a lock to prevent race conditions from parallel webhook calls
  await db
    .update(stripePayments)
    .set({
      status: "completed",
      stripePaymentIntentId: session.payment_intent as string,
      completedAt: new Date(),
    })
    .where(
      and(
        eq(stripePayments.stripeSessionId, session.id),
        eq(stripePayments.status, "pending") // Only update if still pending
      )
    );

  // Double-check that we actually updated the record (in case of race condition)
  const [updatedPayment] = await db
    .select()
    .from(stripePayments)
    .where(eq(stripePayments.stripeSessionId, session.id))
    .limit(1);

  if (!updatedPayment || updatedPayment.completedAt?.getTime() !== new Date().getTime()) {
    // Another process might have processed this, verify by checking completedAt timestamp
    // If the timestamp is significantly different, another process handled it
    const timeDiff = updatedPayment?.completedAt 
      ? Math.abs(Date.now() - updatedPayment.completedAt.getTime())
      : Infinity;
    
    if (timeDiff > 5000) { // More than 5 seconds difference
      console.log(`[Stripe Webhook] Payment ${session.id} was processed by another request, skipping`);
      return;
    }
  }

  // Grant credits
  const grantResult = await CreditService.grant(
    userId,
    credits,
    `Purchased ${productKey}`,
    { productKey, productType, stripeSessionId: session.id }
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
    
    // Check if subscription already exists (idempotency for subscription creation)
    const [existingSub] = await db
      .select()
      .from(userSubscriptions)
      .where(eq(userSubscriptions.stripeSubscriptionId, subscriptionId))
      .limit(1);

    if (existingSub) {
      console.log(`[Stripe Webhook] Subscription ${subscriptionId} already exists, skipping creation`);
    } else {
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
 * 
 * IDEMPOTENCY: Uses invoice.id in metadata to track processed invoices.
 * The CreditService logs transactions with metadata, so we can check if
 * a renewal has already been processed by looking for existing transactions.
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

    // IDEMPOTENCY CHECK: Check if this invoice has already been processed
    // by looking for a credit transaction with this invoice.id in metadata
    const { creditTransactions } = await import("../../drizzle/schema");
    const existingTransactions = await db
      .select()
      .from(creditTransactions)
      .where(eq(creditTransactions.userId, 0)); // We need to search by metadata

    // Search for existing transaction with this invoice ID
    // Note: This is a simple approach. In production, consider adding an invoiceId column
    const allTransactions = await db.select().from(creditTransactions);
    const alreadyProcessed = allTransactions.some(t => {
      if (!t.metadata) return false;
      try {
        const meta = JSON.parse(t.metadata);
        return meta.stripeInvoiceId === invoice.id;
      } catch {
        return false;
      }
    });

    if (alreadyProcessed) {
      console.log(`[Stripe Webhook] Invoice ${invoice.id} already processed, skipping (idempotency check)`);
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
        // Include invoice.id in metadata for idempotency tracking
        await CreditService.grant(
          subscription.userId,
          plan.monthlyCredits,
          `Monthly renewal: ${plan.name}`,
          { 
            subscriptionId, 
            stripeInvoiceId: invoice.id,
            billingReason: invoice.billing_reason 
          }
        );

        console.log(`[Stripe Webhook] Granted ${plan.monthlyCredits} credits to user ${subscription.userId} for subscription renewal`);
      }
    }
  }
}
