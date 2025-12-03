# Stripe Payment, Analytics & Referral System Architecture

## Overview

This document outlines the architecture for three new features:

1. **Stripe Payment Integration** - Enable users to purchase credit packs
2. **Credit Usage Analytics** - Show detailed breakdown of credit consumption
3. **Referral Program** - Reward users for inviting friends

---

## 1. Stripe Payment Integration

### Database Schema Extensions

```typescript
// New table: stripePayments
export const stripePayments = mysqlTable("stripePayments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  stripeSessionId: varchar("stripeSessionId", { length: 255 })
    .notNull()
    .unique(),
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 255 }),
  amount: int("amount").notNull(), // Amount in cents (e.g., 999 for €9.99)
  currency: varchar("currency", { length: 3 }).default("eur").notNull(),
  credits: int("credits").notNull(), // Credits purchased
  productType: mysqlEnum("productType", ["plan", "topup"]).notNull(),
  productKey: varchar("productKey", { length: 50 }).notNull(), // e.g., "orbit_pack", "mini_booster"
  status: mysqlEnum("status", ["pending", "completed", "failed"])
    .default("pending")
    .notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
});
```

### Stripe Checkout Flow

1. **User clicks "Get Orbit Pack"** → Frontend calls `trpc.stripe.createCheckoutSession.useMutation()`
2. **Backend creates Stripe Checkout Session** with:
   - `line_items`: Credit pack details (name, price, quantity)
   - `metadata`: `{ userId, productType, productKey, credits }`
   - `success_url`: `/app/credits?success=true`
   - `cancel_url`: `/app/credits?canceled=true`
3. **User completes payment** → Stripe redirects to success_url
4. **Stripe webhook fires** `checkout.session.completed` → Backend:
   - Verifies webhook signature
   - Extracts metadata (userId, credits, productKey)
   - Grants credits via `CreditService.grant()`
   - Creates payment record in `stripePayments`
   - If subscription: creates/updates `userSubscriptions`

### Stripe Product Configuration

**Credit Plans (Subscriptions):**

- `orbit_pack`: €9.99/month, 100 credits, recurring
- `galaxy_pack`: €39.99/month, 500 credits, recurring

**Mission Boosters (One-time):**

- `mini_booster`: €5.99, 50 credits
- `power_booster`: €14.99, 150 credits
- `mega_booster`: €24.99, 300 credits

### Implementation Files

- `server/routers/stripe.ts` - tRPC router for Stripe operations
- `server/_core/stripe.ts` - Stripe client initialization
- `server/webhooks/stripe.ts` - Webhook handler (Express route)
- `client/src/pages/Credits.tsx` - Update with Stripe checkout buttons

---

## 2. Credit Usage Analytics

### Data Aggregation

Analytics are computed from `creditTransactions` table:

```sql
-- Monthly usage breakdown by feature
SELECT
  featureUsed,
  SUM(amount) as totalCredits,
  COUNT(*) as usageCount
FROM creditTransactions
WHERE userId = ?
  AND type = 'deduct'
  AND createdAt >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY featureUsed
ORDER BY totalCredits DESC;
```

### Analytics Metrics

1. **Total Credits Used (This Month)** - Sum of all deductions in last 30 days
2. **Feature Breakdown** - Percentage by feature:
   - Deep Analysis (chat): X%
   - AI Insights: Y%
   - PDF Exports: Z%
   - etc.
3. **Daily Usage Trend** - Line chart showing credits/day over last 30 days
4. **Credits Saved** - Compare current month vs previous month

### Dashboard Widget

**Location:** `/app/dashboard` - New card in insights section

**UI Components:**

- Donut Chart: Feature breakdown with percentages
- Stat Cards: Total used, Most used feature, Credits saved
- Mini Line Chart: 7-day trend
- Link to full analytics page

### Implementation Files

- `server/routers/analytics.ts` - tRPC router for analytics queries
- `client/src/components/CreditAnalyticsWidget.tsx` - Dashboard widget
- `client/src/pages/Analytics.tsx` - Full analytics page (optional)

---

## 3. Referral Program

### Database Schema Extensions

```typescript
// New table: referrals
export const referrals = mysqlTable("referrals", {
  id: int("id").autoincrement().primaryKey(),
  referrerId: int("referrerId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  refereeId: int("refereeId").references(() => users.id, {
    onDelete: "set null",
  }), // null if not signed up yet
  referralCode: varchar("referralCode", { length: 20 }).notNull().unique(), // e.g., "HOUSTON-ABC123"
  status: mysqlEnum("status", ["pending", "completed", "rewarded"])
    .default("pending")
    .notNull(),
  bonusCredits: int("bonusCredits").default(25).notNull(),
  rewardedAt: timestamp("rewardedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Add to users table:
// referralCode: varchar("referralCode", { length: 20 }).unique() // User's own referral code
// referredBy: int("referredBy").references(() => users.id) // Who referred this user
```

### Referral Flow

1. **User generates referral link** → `/app/referrals`
   - System generates unique code: `HOUSTON-{userId}-{random5}`
   - Link: `https://houston.app/?ref=HOUSTON-ABC123`

2. **Friend clicks referral link** → Landing page
   - URL param `?ref=HOUSTON-ABC123` is stored in localStorage
   - User signs up via OAuth

3. **After signup** → Backend checks localStorage for `ref` param
   - Creates `referrals` record: `{ referrerId, refereeId, status: 'completed' }`
   - Grants 25 credits to **both** referrer and referee
   - Updates status to `'rewarded'`

### Referral Dashboard

**Location:** `/app/referrals`

**Features:**

- **Referral Link** - Copy button, QR code
- **Stats** - Total referrals, Pending, Completed, Total credits earned
- **Referral List** - Table showing all referrals with status
- **Share Buttons** - Twitter, Facebook, Email, WhatsApp

### Bonus Credit Rules

- **Referrer** gets 25 credits when referee signs up
- **Referee** gets 25 credits on signup (in addition to 50 starter credits = 75 total)
- **Limit:** Max 100 referrals per user (prevent abuse)
- **Fraud Detection:** Same IP/device within 24h = flagged for review

### Implementation Files

- `server/routers/referrals.ts` - tRPC router for referral operations
- `client/src/pages/Referrals.tsx` - Referral dashboard page
- `client/src/components/ReferralLinkCard.tsx` - Referral link UI
- `server/_core/referralService.ts` - Referral logic (generate code, track, reward)

---

## Implementation Order

1. **Phase 1:** Database schema extensions (stripePayments, referrals)
2. **Phase 2:** Stripe integration (checkout, webhook, payment tracking)
3. **Phase 3:** Analytics widget (queries, UI component, dashboard integration)
4. **Phase 4:** Referral system (code generation, tracking, rewards, dashboard)
5. **Phase 5:** Testing (Stripe webhook, referral flow, analytics calculations)

---

## Security Considerations

### Stripe

- Webhook signature verification (STRIPE_WEBHOOK_SECRET)
- Never expose Stripe secret key to frontend
- Validate all metadata before granting credits

### Referrals

- Rate limiting on referral link generation (max 10/hour)
- Fraud detection: Same IP/device flagging
- Admin dashboard to review suspicious referrals
- Max referral limit per user (100)

### Analytics

- Only show user's own analytics data
- No aggregated data across users (privacy)
- Cache analytics queries (5min TTL) to reduce DB load

---

## Testing Strategy

### Stripe

- Use Stripe Test Mode for development
- Test webhook locally with Stripe CLI: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
- Test scenarios: successful payment, failed payment, duplicate webhook

### Referrals

- Test referral code generation uniqueness
- Test bonus credit granting (both referrer and referee)
- Test fraud detection (same IP within 24h)

### Analytics

- Seed test data with various transaction types
- Verify percentage calculations
- Test edge cases (no transactions, single transaction)

---

## Metrics & Monitoring

### Stripe

- Payment success rate (target: >95%)
- Average time to credit grant after payment (<5 seconds)
- Webhook processing errors (alert if >1% fail)

### Referrals

- Referral conversion rate (signups / link clicks)
- Average referrals per user
- Fraud detection rate

### Analytics

- Query performance (<500ms for dashboard widget)
- Cache hit rate (target: >80%)

---

## Future Enhancements

1. **Stripe Subscriptions Management** - Allow users to upgrade/downgrade/cancel
2. **Analytics Export** - Download CSV of credit usage
3. **Referral Leaderboard** - Gamification (top referrers)
4. **Credit Gifting** - Send credits to other users
5. **Enterprise Plans** - Custom pricing for teams
