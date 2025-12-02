/**
 * Stripe Product Definitions
 * 
 * Diese Datei definiert alle Produkte und Preise für OrbitCoach.
 */

export const PRODUCTS = {
  ROCKET_MONTHLY: {
    name: "Rocket Plan",
    description: "Unbegrenzter Zugriff auf alle Features",
    priceId: process.env.NODE_ENV === "production" 
      ? "price_live_rocket_monthly" // TODO: Replace with actual Stripe Price ID
      : "price_test_rocket_monthly", // TODO: Replace with actual Stripe Price ID
    amount: 4900, // €49.00 in cents
    currency: "eur",
    interval: "month" as const,
    features: [
      "3 Workspaces",
      "200 Chats pro Monat",
      "Unbegrenzte Ziele",
      "Unbegrenzte To-dos",
      "Prioritäts-Support",
    ],
  },
} as const;

export type ProductKey = keyof typeof PRODUCTS;
