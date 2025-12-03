import Stripe from "stripe";
import { ENV } from "./env";

// Lazy initialization of Stripe client to allow tests to run without STRIPE_SECRET_KEY
let _stripe: Stripe | null = null;

function getStripe(): Stripe {
  if (!_stripe) {
    if (!ENV.stripeSecretKey) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    _stripe = new Stripe(ENV.stripeSecretKey, {
      apiVersion: "2025-11-17.clover",
      typescript: true,
    });
  }
  return _stripe;
}

// Export a proxy that lazily initializes Stripe
export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    return (getStripe() as any)[prop];
  },
});

/**
 * Credit pack product configurations
 * These should match the products created in Stripe Dashboard
 */
export const CREDIT_PRODUCTS = {
  // Subscription Plans
  orbit_pack: {
    key: "orbit_pack",
    name: "Orbit Pack",
    credits: 100,
    price: 999, // €9.99 in cents
    currency: "eur",
    type: "plan" as const,
    interval: "month" as const,
  },
  galaxy_pack: {
    key: "galaxy_pack",
    name: "Galaxy Pack",
    credits: 500,
    price: 3999, // €39.99 in cents
    currency: "eur",
    type: "plan" as const,
    interval: "month" as const,
  },
  // One-time Topups (Mission Boosters)
  mini_booster: {
    key: "mini_booster",
    name: "Mini Booster",
    credits: 50,
    price: 599, // €5.99 in cents
    currency: "eur",
    type: "topup" as const,
  },
  power_booster: {
    key: "power_booster",
    name: "Power Booster",
    credits: 150,
    price: 1499, // €14.99 in cents
    currency: "eur",
    type: "topup" as const,
  },
  mega_booster: {
    key: "mega_booster",
    name: "Mega Booster",
    credits: 300,
    price: 2499, // €24.99 in cents
    currency: "eur",
    type: "topup" as const,
  },
} as const;

export type CreditProductKey = keyof typeof CREDIT_PRODUCTS;

/**
 * Create a Stripe Checkout Session for credit packs
 */
export async function createCreditCheckoutSession(params: {
  userId: number;
  userEmail: string;
  userName: string;
  productKey: CreditProductKey;
  successUrl: string;
  cancelUrl: string;
}) {
  const product = CREDIT_PRODUCTS[params.productKey];
  
  const session = await stripe.checkout.sessions.create({
    mode: product.type === "plan" ? "subscription" : "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: product.currency,
          product_data: {
            name: product.name,
            description: `${product.credits} credits${product.type === "plan" ? "/month" : ""}`,
          },
          unit_amount: product.price,
          ...(product.type === "plan" && {
            recurring: {
              interval: product.interval,
            },
          }),
        },
        quantity: 1,
      },
    ],
    customer_email: params.userEmail,
    client_reference_id: params.userId.toString(),
    metadata: {
      userId: params.userId.toString(),
      productKey: params.productKey,
      productType: product.type,
      credits: product.credits.toString(),
    },
    allow_promotion_codes: true,
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
  });

  return session;
}

/**
 * Create a Stripe Checkout Session for upgrading to Rocket Plan (DEPRECATED - use createCreditCheckoutSession)
 */
export async function createCheckoutSession(params: {
  userId: number;
  userEmail: string;
  userName: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}) {
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: params.priceId,
        quantity: 1,
      },
    ],
    customer_email: params.userEmail,
    client_reference_id: params.userId.toString(),
    metadata: {
      user_id: params.userId.toString(),
      customer_email: params.userEmail,
      customer_name: params.userName,
    },
    allow_promotion_codes: true,
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
  });

  return session;
}

/**
 * Verify webhook signature and construct event
 */
export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string
): Stripe.Event {
  if (!ENV.stripeWebhookSecret) {
    throw new Error("STRIPE_WEBHOOK_SECRET is not set");
  }

  return stripe.webhooks.constructEvent(
    payload,
    signature,
    ENV.stripeWebhookSecret
  );
}
