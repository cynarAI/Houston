# Houston Credit System Architecture

## Overview
This document describes the credit-based billing system that replaces the previous Free/Paid plan model with a flexible, transparent credit system similar to Manus' own model.

## Credit Definition
A **credit** is the atomic billing unit for resource-intensive actions in Houston.

**Credit Balance Storage:**
- `users.credits` - Current credit balance (integer)
- `users.lifetimeCreditsUsed` - Total credits consumed (for analytics)
- `users.lastTopupAt` - Last time credits were added

## Feature Credit Costs

### Free Features (0 Credits)
- Basic chat messages with Houston
- Viewing existing content (goals, todos, strategy)
- Dashboard and navigation
- Settings management

### Low-Cost Features (1-3 Credits)
- **Chat Deep Analysis** (3 credits) - When Houston performs detailed analysis
- **PDF Export** (2 credits) - Export goals, chats, or strategy to PDF
- **AI Insights Generation** (3 credits) - Dashboard insights and recommendations

### Medium-Cost Features (5-8 Credits)
- **SMART Goals Generation** (5 credits) - AI-generated SMART goals from user input
- **Strategy Analysis** (8 credits) - Comprehensive marketing strategy generation
- **Campaign Blueprint** (7 credits) - Complete campaign plan with timeline

### High-Cost Features (10+ Credits)
- **Full Marketing Audit** (15 credits) - Deep analysis of all marketing activities
- **Competitor Analysis** (12 credits) - Detailed competitor research and positioning
- **Content Calendar Generation** (10 credits) - 30-day content calendar with posts

## Credit Packs & Plans

### Starter Credits
- **Houston Launch Pack**: 50 free credits for new users
- Automatically granted on account creation
- Clearly marked as "free starter credits" in UI

### Recurring Subscriptions
1. **Orbit Pack** - €29/month
   - 200 credits/month
   - Suitable for: Solo entrepreneurs, small businesses
   - Auto-renews monthly

2. **Galaxy Pack** - €99/month
   - 800 credits/month
   - Suitable for: Growing teams, agencies
   - Auto-renews monthly
   - Priority support

### One-Time Top-Ups (Mission Boosters)
1. **Mini Booster**: 100 credits - €15
2. **Power Booster**: 300 credits - €39
3. **Mega Booster**: 1000 credits - €119

## Data Model

### New Tables

#### `creditTransactions`
Logs all credit changes for audit and analytics.

```typescript
{
  id: int (primary key)
  userId: int (foreign key → users.id)
  featureKey: string (e.g., "chat_deep_analysis", "goals_generation")
  creditsSpent: int (negative for deductions, positive for grants)
  balanceBefore: int
  balanceAfter: int
  metadata: json (optional context: sessionId, goalId, etc.)
  createdAt: timestamp
}
```

#### `creditPlans`
Defines available subscription plans.

```typescript
{
  id: int (primary key)
  key: string (unique, e.g., "orbit_pack", "galaxy_pack")
  name: string (display name)
  description: text
  monthlyCredits: int
  priceMonthly: int (in cents)
  isRecurring: boolean (true for subscriptions)
  recommendedFor: text
  features: json (array of feature descriptions)
  active: boolean
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### `creditTopups`
Defines one-time credit purchases.

```typescript
{
  id: int (primary key)
  key: string (unique, e.g., "mini_booster")
  name: string
  credits: int
  price: int (in cents)
  active: boolean
  createdAt: timestamp
}
```

#### `userSubscriptions`
Tracks user's active subscriptions.

```typescript
{
  id: int (primary key)
  userId: int (foreign key → users.id)
  planId: int (foreign key → creditPlans.id)
  status: enum ("active", "canceled", "expired")
  currentPeriodStart: timestamp
  currentPeriodEnd: timestamp
  cancelAtPeriodEnd: boolean
  stripeSubscriptionId: string (nullable)
  createdAt: timestamp
  updatedAt: timestamp
}
```

### Modified Tables

#### `users` (add columns)
```typescript
{
  // ... existing columns ...
  credits: int (default 50) // Current credit balance
  lifetimeCreditsUsed: int (default 0) // Total credits consumed
  lastTopupAt: timestamp (nullable) // Last credit addition
}
```

#### Remove/Deprecate
- `planLimits` table (replaced by credit system)
- All Free/Paid plan logic

## CreditService API

### Core Methods

```typescript
class CreditService {
  // Get current balance
  async getBalance(userId: number): Promise<number>
  
  // Check if user can afford an action
  async canAfford(userId: number, amount: number): Promise<boolean>
  
  // Charge credits (atomic, with logging)
  async charge(userId: number, featureKey: string, amount: number, metadata?: object): Promise<{
    success: boolean
    newBalance: number
    transactionId: number
    error?: string
  }>
  
  // Grant credits (top-up, subscription renewal, admin)
  async grant(userId: number, amount: number, reason: string, metadata?: object): Promise<{
    success: boolean
    newBalance: number
    transactionId: number
  }>
  
  // Get usage history
  async getUsageHistory(userId: number, options?: {
    limit?: number
    since?: Date
    featureKey?: string
  }): Promise<CreditTransaction[]>
  
  // Get current subscription
  async getActiveSubscription(userId: number): Promise<UserSubscription | null>
  
  // Calculate monthly credit usage
  async getMonthlyUsage(userId: number): Promise<{
    totalSpent: number
    byFeature: Record<string, number>
  }>
}
```

### Error Handling

```typescript
enum CreditError {
  INSUFFICIENT_CREDITS = "insufficient_credits"
  USER_NOT_FOUND = "user_not_found"
  INVALID_AMOUNT = "invalid_amount"
  TRANSACTION_FAILED = "transaction_failed"
}
```

## UX Integration

### Global Credit Indicator
- **Location**: Top bar, next to user profile
- **Display**: Pill badge showing "Credits: 124"
- **Behavior**: Click opens Credits & Plans drawer
- **Mobile**: Compact badge in hamburger menu

### Credit Confirmation Dialogs
Before executing high-cost actions (≥5 credits):
```
┌─────────────────────────────────────┐
│ Strategie-Analyse starten?          │
│                                      │
│ Diese Analyse kostet 8 Credits      │
│ Aktuelles Guthaben: 124 Credits     │
│                                      │
│ [ ] Nicht mehr anzeigen              │
│                                      │
│ [Abbrechen]  [Analyse starten]       │
└─────────────────────────────────────┘
```

### Low Credit Warnings
When balance < 20 credits:
```
⚠️ Deine Credits werden knapp!
Noch 18 Credits verfügbar. Lade jetzt auf, um alle Features nutzen zu können.
[Credits aufladen]
```

### Empty State (0 Credits)
```
🚀 Keine Credits mehr

Du hast alle deine Credits verbraucht. Lade jetzt auf, um weiter mit Houston zu arbeiten.

[Credits aufladen]  [Pläne ansehen]
```

### Post-Action Feedback
After credit-consuming action:
```
Toast: "✓ Analyse erstellt – 8 Credits abgebucht. Verbleibend: 116 Credits"
```

## Houston AI Integration

### Credit Awareness
Houston can reference credits in responses:
- "Diese tiefe Analyse würde 8 Credits kosten. Möchtest du fortfahren?"
- "Ich kann dir eine schnelle Übersicht geben (kostenlos) oder eine detaillierte Analyse erstellen (5 Credits)."

### Proactive Suggestions
When credits < 30:
- "Du hast noch 24 Credits. Für deine nächsten Schritte empfehle ich ein kleines Upgrade, damit wir deine Kampagne fertig planen können."
- Throttled to max 1x per session

### Alternative Suggestions
When user requests high-cost action with low credits:
- "Diese Funktion kostet 15 Credits, aber du hast nur noch 12. Ich kann dir stattdessen [alternative] anbieten (5 Credits)."

## Migration Strategy

### Phase 1: Add Credit System (Parallel)
1. Add new credit tables to database
2. Add `credits` column to users (default 50)
3. Implement CreditService
4. Build Credit UI components
5. Keep existing planLimits system active

### Phase 2: Integrate Credits
1. Add credit checks to features (alongside existing checks)
2. Log all credit transactions
3. Test credit flow end-to-end
4. Migrate existing users:
   - Free plan users: 50 credits
   - Paid plan users: 200 credits + active Orbit Pack subscription

### Phase 3: Deprecate Old System
1. Remove planLimits checks from features
2. Mark planLimits table as deprecated
3. Update all documentation
4. Announce migration to users

## Configuration

### Feature Costs Config
```typescript
// server/config/creditCosts.ts
export const CREDIT_COSTS = {
  CHAT_DEEP_ANALYSIS: 3,
  PDF_EXPORT: 2,
  AI_INSIGHTS: 3,
  GOALS_GENERATION: 5,
  STRATEGY_ANALYSIS: 8,
  CAMPAIGN_BLUEPRINT: 7,
  MARKETING_AUDIT: 15,
  COMPETITOR_ANALYSIS: 12,
  CONTENT_CALENDAR: 10,
} as const;
```

### Plan Pricing Config
```typescript
// server/config/creditPlans.ts
export const CREDIT_PLANS = {
  ORBIT_PACK: {
    key: "orbit_pack",
    name: "Orbit Pack",
    monthlyCredits: 200,
    priceMonthly: 2900, // €29.00
    features: ["200 Credits/Monat", "Alle Features", "Email Support"],
  },
  GALAXY_PACK: {
    key: "galaxy_pack",
    name: "Galaxy Pack",
    monthlyCredits: 800,
    priceMonthly: 9900, // €99.00
    features: ["800 Credits/Monat", "Priority Support", "Team Features"],
  },
} as const;
```

## Testing Requirements

### Unit Tests
- [ ] CreditService.charge() - successful deduction
- [ ] CreditService.charge() - insufficient credits error
- [ ] CreditService.grant() - successful credit addition
- [ ] CreditService.getBalance() - accurate balance retrieval
- [ ] CreditService.canAfford() - correct affordability check
- [ ] Transaction logging - all changes logged correctly
- [ ] Atomic operations - no race conditions

### Integration Tests
- [ ] Feature integration - credits deducted when feature used
- [ ] Subscription renewal - credits auto-granted monthly
- [ ] Payment flow - credits granted after successful payment
- [ ] Migration - existing users migrated correctly
- [ ] UI flow - credit indicator updates in real-time

## Payment Integration

### Stripe Integration Points
1. **Subscription Creation**: User selects plan → Stripe checkout → webhook grants credits
2. **Subscription Renewal**: Stripe webhook → grant monthly credits
3. **One-Time Purchase**: User buys booster → Stripe checkout → webhook grants credits
4. **Subscription Cancellation**: Stripe webhook → mark subscription as canceled

### Webhook Handlers
```typescript
// Handle successful subscription creation
stripe.webhooks.on("checkout.session.completed", async (session) => {
  const { userId, planId } = session.metadata;
  await CreditService.grant(userId, plan.monthlyCredits, "subscription_start");
  await createSubscription(userId, planId);
});

// Handle subscription renewal
stripe.webhooks.on("invoice.paid", async (invoice) => {
  const subscription = await getSubscriptionByStripeId(invoice.subscription);
  await CreditService.grant(subscription.userId, subscription.plan.monthlyCredits, "subscription_renewal");
});

// Handle one-time purchase
stripe.webhooks.on("payment_intent.succeeded", async (paymentIntent) => {
  const { userId, topupId } = paymentIntent.metadata;
  const topup = await getTopup(topupId);
  await CreditService.grant(userId, topup.credits, "topup_purchase");
});
```

## Analytics & Monitoring

### Key Metrics
- Average credits per user per month
- Most expensive features (by total credits consumed)
- Conversion rate: free credits → paid subscription
- Churn indicators: users with 0 credits for >7 days
- Revenue per credit (total revenue / total credits granted)

### Dashboards
- Real-time credit balance distribution
- Feature usage by credit cost
- Subscription retention rates
- Top-up purchase patterns

## Future Enhancements
- [ ] Credit gifting between users
- [ ] Referral bonuses (earn credits)
- [ ] Seasonal promotions (bonus credits)
- [ ] Enterprise plans with custom credit pools
- [ ] API access with credit-based rate limiting
- [ ] Credit rollover (unused credits carry over 1 month)
