# Houston Architecture

Technical architecture overview for developers.

---

## Project Structure

```
houston/
├── client/                 # React frontend (Vite)
│   └── src/
│       ├── components/     # UI components
│       │   └── ui/         # shadcn/ui primitives
│       ├── pages/          # Route pages
│       ├── locales/        # i18n translations (de.json, en.json)
│       ├── lib/            # Utilities (trpc, i18n, analytics)
│       ├── hooks/          # Custom React hooks
│       └── contexts/       # React contexts
├── server/                 # Express + tRPC backend
│   ├── routers/            # tRPC route handlers
│   ├── _core/              # Core utilities (auth, llm, stripe, oauth)
│   └── webhooks/           # Stripe webhook handler
├── shared/                 # Shared types and constants
│   ├── types.ts            # Re-exports from drizzle schema
│   └── products.ts         # Stripe product definitions
└── drizzle/                # Database
    ├── schema.ts           # Table definitions
    └── migrations/         # SQL migrations
```

---

## Main Domains

### 1. Houston Coach (AI Chat)

The core feature - AI marketing assistant.

| File                         | Purpose                         |
| ---------------------------- | ------------------------------- |
| `server/routers/chat.ts`     | Chat session & message handling |
| `server/_core/llm.ts`        | Manus LLM API integration       |
| `client/src/pages/Chats.tsx` | Chat UI                         |

### 2. Goals & Todos

SMART goal management and task tracking.

| File                         | Purpose                       |
| ---------------------------- | ----------------------------- |
| `server/routers/goals.ts`    | Goals CRUD, progress tracking |
| `server/routers/todos.ts`    | Todos CRUD, status management |
| `client/src/pages/Goals.tsx` | Goals UI with views           |
| `client/src/pages/Todos.tsx` | Todos UI with Kanban          |

### 3. Strategy

Marketing strategy management.

| File                            | Purpose         |
| ------------------------------- | --------------- |
| `server/routers/strategy.ts`    | Strategy CRUD   |
| `client/src/pages/Strategy.tsx` | Strategy editor |

### 4. Credits (Billing)

Credit-based billing system.

| File                           | Purpose                                    |
| ------------------------------ | ------------------------------------------ |
| `server/creditService.ts`      | Core credit logic (charge, grant, balance) |
| `server/routers/credits.ts`    | Credit API endpoints                       |
| `server/routers/stripe.ts`     | Stripe checkout sessions                   |
| `server/webhooks/stripe.ts`    | Stripe webhook handler                     |
| `client/src/pages/Credits.tsx` | Credits & plans UI                         |

### 5. Referrals

User referral program.

| File                             | Purpose                             |
| -------------------------------- | ----------------------------------- |
| `server/referralService.ts`      | Referral code generation & tracking |
| `server/routers/referrals.ts`    | Referral API endpoints              |
| `client/src/pages/Referrals.tsx` | Referral dashboard                  |

### 6. Workspaces

Multi-workspace support per user.

| File                           | Purpose                                  |
| ------------------------------ | ---------------------------------------- |
| `server/routers/workspaces.ts` | Workspace CRUD                           |
| `drizzle/schema.ts`            | Workspace table (stores onboarding data) |

---

## Data Flow

```
┌─────────────┐     tRPC      ┌─────────────┐     Drizzle    ┌─────────┐
│   React     │ ──────────►   │   Express   │ ────────────►  │  MySQL  │
│  Frontend   │ ◄──────────   │   Backend   │ ◄────────────  │  TiDB   │
└─────────────┘               └─────────────┘                └─────────┘
       │                             │
       │                             │ HTTP
       ▼                             ▼
┌─────────────┐               ┌─────────────┐
│   Stripe    │               │  Manus LLM  │
│  (Payments) │               │    (AI)     │
└─────────────┘               └─────────────┘
```

### Frontend → Backend

- tRPC client (`client/src/lib/trpc.ts`) calls server routers
- Type-safe API with automatic inference
- TanStack Query handles caching & refetching

### Backend → Database

- Drizzle ORM with MySQL driver
- Schema defined in `drizzle/schema.ts`
- Migrations via `pnpm db:push`

### AI Integration

- Server calls Manus LLM API (`server/_core/llm.ts`)
- Streaming responses for chat
- System prompts include workspace context

---

## Credit System

### Cost Configuration

Edit `server/creditService.ts`:

```typescript
export const CREDIT_COSTS = {
  // Free features
  CHAT_BASIC: 0,
  VIEW_CONTENT: 0,

  // Low-cost (1-3 credits)
  CHAT_DEEP_ANALYSIS: 3,
  PDF_EXPORT: 2,
  AI_INSIGHTS: 3,

  // Medium-cost (5-8 credits)
  GOALS_GENERATION: 5,
  STRATEGY_ANALYSIS: 8,
  CAMPAIGN_BLUEPRINT: 7,

  // High-cost (10+ credits)
  MARKETING_AUDIT: 15,
  COMPETITOR_ANALYSIS: 12,
  CONTENT_CALENDAR: 10,
} as const;
```

### Plans & Pricing

Plans are stored in database tables:

- `creditPlans` - Subscription plans (Orbit, Galaxy)
- `creditTopups` - One-time purchases (Mission Boosters)

To modify pricing:

1. Update DB records directly, or
2. Seed via migration in `drizzle/migrations/`

### Credit Flow

```
User Action → Router checks cost → CreditService.charge() → DB update → Response
```

Key methods in `CreditService`:

- `getBalance(userId)` - Current balance
- `canAfford(userId, amount)` - Check before action
- `charge(userId, featureKey, amount)` - Deduct credits
- `grant(userId, amount, reason)` - Add credits (purchases, referrals)

### Stripe Integration

```
Checkout → Stripe → Webhook → CreditService.grant() → Notification
```

Webhook endpoint: `POST /api/stripe/webhook`

---

## Design System

### CSS Variables

Design tokens in `client/src/index.css`:

```css
:root {
  /* Core colors */
  --primary: 217 91% 60%;
  --background: 0 0% 100%;
  --foreground: 0 0% 9%;

  /* AIstronaut brand */
  --aistronaut-cyan: 192 100% 50%; /* #00D4FF */
  --aistronaut-purple: 258 87% 65%; /* #8B5CF6 */
  --aistronaut-pink: 340 100% 70%; /* #FF6B9D */

  /* Gradients */
  --gradient-aistronaut: linear-gradient(
    135deg,
    #ff6b9d 0%,
    #8b5cf6 50%,
    #00d4ff 100%
  );
}
```

### UI Components

- Location: `client/src/components/ui/`
- Library: shadcn/ui (Radix primitives + Tailwind)
- Add components: Copy from [ui.shadcn.com](https://ui.shadcn.com)

### Tailwind Config

- File: `tailwind.config.js`
- Colors reference CSS variables
- Custom utilities in `index.css`

---

## Localization (i18n)

### Files

```
client/src/locales/
├── de.json    # German (default)
└── en.json    # English
```

### Configuration

`client/src/lib/i18n.ts`:

```typescript
i18n.init({
  fallbackLng: "de",
  supportedLngs: ["de", "en"],
});
```

### Usage in Components

```tsx
import { useTranslation } from "react-i18next";

function MyComponent() {
  const { t } = useTranslation();
  return <h1>{t("landing.hero.title")}</h1>;
}
```

### Adding Translations

1. Add key to both `de.json` and `en.json`
2. Use nested structure: `"section.subsection.key": "value"`
3. Interpolation: `"greeting": "Hello {{name}}"`

### Language Switcher

Component: `client/src/components/LanguageSwitcher.tsx`

---

## Database Schema

Key tables in `drizzle/schema.ts`:

| Table                | Purpose                                      |
| -------------------- | -------------------------------------------- |
| `users`              | User accounts, credit balance, referral code |
| `workspaces`         | User workspaces with business info           |
| `goals`              | SMART goals                                  |
| `todos`              | Tasks linked to goals                        |
| `strategies`         | Marketing strategies                         |
| `chatSessions`       | Chat conversation sessions                   |
| `chatMessages`       | Individual messages                          |
| `creditTransactions` | Credit usage log                             |
| `creditPlans`        | Subscription plans                           |
| `creditTopups`       | One-time purchases                           |
| `userSubscriptions`  | Active subscriptions                         |
| `stripePayments`     | Payment records                              |
| `referrals`          | Referral tracking                            |
| `notifications`      | User notifications                           |

### Schema Changes

```bash
# 1. Edit drizzle/schema.ts
# 2. Generate and apply migration
pnpm db:push
```

---

## Authentication

### OAuth Flow

1. User clicks login → Redirect to Manus OAuth
2. Manus authenticates → Redirect back with code
3. Server exchanges code for token (`server/_core/oauth.ts`)
4. JWT session cookie set

### Auth Check

```typescript
// In tRPC router
import { protectedProcedure } from "./_core/trpc";

protectedProcedure.query(({ ctx }) => {
  const userId = ctx.user.id; // Guaranteed to exist
});
```

---

## Common Tasks

### Add New Feature with Credits

1. Add cost to `CREDIT_COSTS` in `creditService.ts`
2. In router, check credits before action:

```typescript
const cost = CreditService.getCost("FEATURE_KEY");
const canAfford = await CreditService.canAfford(userId, cost);
if (!canAfford) throw new TRPCError({ code: "FORBIDDEN" });
await CreditService.charge(userId, "FEATURE_KEY", cost);
```

### Add New Translation Key

1. Add to `client/src/locales/de.json`
2. Add to `client/src/locales/en.json`
3. Use `t("key.path")` in component

### Add New Page

1. Create `client/src/pages/NewPage.tsx`
2. Add route in `client/src/App.tsx`
3. Add menu item in `client/src/components/DashboardLayout.tsx`

### Add New tRPC Endpoint

1. Create/edit router in `server/routers/`
2. Register in `server/routers.ts`
3. Call from frontend via `trpc.routerName.procedureName`

---

## Environment-Specific Behavior

```typescript
// Check environment
if (process.env.NODE_ENV === "development") {
  // Dev-only code
}

// Stripe keys differ by env
const stripeKey =
  process.env.NODE_ENV === "production" ? "price_live_xxx" : "price_test_xxx";
```

---

## Key Files Reference

| What             | Where                                       |
| ---------------- | ------------------------------------------- |
| Credit costs     | `server/creditService.ts:18-37`             |
| DB schema        | `drizzle/schema.ts`                         |
| tRPC routers     | `server/routers.ts`                         |
| i18n setup       | `client/src/lib/i18n.ts`                    |
| CSS tokens       | `client/src/index.css:4-58`                 |
| Stripe webhook   | `server/webhooks/stripe.ts`                 |
| LLM integration  | `server/_core/llm.ts`                       |
| OAuth flow       | `server/_core/oauth.ts`                     |
| Main app routes  | `client/src/App.tsx`                        |
| Dashboard layout | `client/src/components/DashboardLayout.tsx` |
