# Houston Backend Architecture Overview

**Version:** 1.0  
**Last Updated:** December 2024  
**Status:** Production Ready

---

## Table of Contents

1. [Technology Stack](#technology-stack)
2. [Architecture Overview](#architecture-overview)
3. [Request Flow](#request-flow)
4. [Module Responsibilities](#module-responsibilities)
5. [Database Schema](#database-schema)
6. [API Endpoints](#api-endpoints)
7. [Security](#security)
8. [Error Handling](#error-handling)
9. [Environment Variables](#environment-variables)
10. [Local Development](#local-development)
11. [Testing](#testing)

---

## Technology Stack

| Component     | Technology       | Version | Purpose             |
| ------------- | ---------------- | ------- | ------------------- |
| **Runtime**   | Node.js          | 20+     | JavaScript runtime  |
| **Framework** | Express          | 4.21.2  | HTTP server         |
| **API Layer** | tRPC             | 11.6.0  | Type-safe RPC       |
| **Database**  | MySQL/TiDB       | -       | Relational storage  |
| **ORM**       | Drizzle          | 0.44.5  | Type-safe DB access |
| **Auth**      | Manus OAuth      | -       | SSO integration     |
| **LLM**       | Gemini 2.5 Flash | -       | AI coach responses  |
| **Payments**  | Stripe           | 20.0.0  | Credit purchases    |
| **Build**     | esbuild          | 0.25.0  | Server bundling     |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client (React)                          │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Express Server (index.ts)                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │ OAuth Routes│  │ Stripe Hook │  │      tRPC Middleware    │  │
│  │  /api/oauth │  │ /api/stripe │  │       /api/trpc         │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                        tRPC Routers                              │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────────────┐ │
│  │  auth  │ │worksp..│ │ goals  │ │ todos  │ │    chat        │ │
│  └────────┘ └────────┘ └────────┘ └────────┘ └────────────────┘ │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────────────┐ │
│  │strategy│ │credits │ │ stripe │ │referral│ │ notifications  │ │
│  └────────┘ └────────┘ └────────┘ └────────┘ └────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Services Layer                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │CreditService │  │ReferralService│  │ NotificationService │   │
│  └──────────────┘  └──────────────┘  └──────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Database (Drizzle ORM)                       │
│  ┌──────┐ ┌──────────┐ ┌─────┐ ┌─────┐ ┌─────────────────────┐  │
│  │users │ │workspaces│ │goals│ │todos│ │ creditTransactions  │  │
│  └──────┘ └──────────┘ └─────┘ └─────┘ └─────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Request Flow

### 1. Authentication Flow

```
Client → OAuth Portal → Callback → Session Cookie → Protected Routes
```

1. User clicks "Login" → redirected to Manus OAuth portal
2. OAuth callback received at `/api/oauth/callback`
3. User data fetched and upserted in database
4. Session JWT stored in HTTP-only cookie
5. Subsequent requests include cookie for authentication

### 2. API Request Flow

```
Request → Express → tRPC Middleware → Auth Check → Router → Service → DB → Response
```

1. Request arrives at Express server
2. tRPC middleware processes `/api/trpc/*` routes
3. Context created with user from session cookie
4. Error handling middleware wraps all procedures
5. Protected procedures verify authentication
6. Router handles business logic
7. Services handle complex operations (credits, referrals)
8. Database queries via Drizzle ORM
9. Response serialized via SuperJSON

---

## Module Responsibilities

### Core Modules

| Module           | Path                 | Responsibility                                  |
| ---------------- | -------------------- | ----------------------------------------------- |
| **context.ts**   | `_core/context.ts`   | Request context, user authentication            |
| **trpc.ts**      | `_core/trpc.ts`      | tRPC initialization, error handling, procedures |
| **oauth.ts**     | `_core/oauth.ts`     | OAuth callback, session management              |
| **llm.ts**       | `_core/llm.ts`       | LLM API with timeout/retry                      |
| **stripe.ts**    | `_core/stripe.ts`    | Stripe checkout sessions                        |
| **ownership.ts** | `_core/ownership.ts` | Resource ownership verification                 |

### Services

| Service                 | Path                     | Responsibility                               |
| ----------------------- | ------------------------ | -------------------------------------------- |
| **CreditService**       | `creditService.ts`       | Atomic credit operations, balance management |
| **ReferralService**     | `referralService.ts`     | Referral codes, bonus credit distribution    |
| **NotificationService** | `notificationService.ts` | User notifications, alerts                   |

### Routers

| Router            | Path                       | Endpoints                   |
| ----------------- | -------------------------- | --------------------------- |
| **auth**          | `routers.ts`               | `me`, `logout`              |
| **workspaces**    | `routers/workspaces.ts`    | CRUD for workspaces         |
| **goals**         | `routers/goals.ts`         | CRUD for SMART goals        |
| **todos**         | `routers/todos.ts`         | CRUD for tasks              |
| **chat**          | `routers/chat.ts`          | Chat sessions, AI responses |
| **strategy**      | `routers/strategy.ts`      | Marketing strategy          |
| **credits**       | `routers/credits.ts`       | Balance, usage history      |
| **stripe**        | `routers/stripe.ts`        | Checkout, payment history   |
| **referrals**     | `routers/referrals.ts`     | Referral codes, stats       |
| **notifications** | `routers/notifications.ts` | Notification management     |
| **account**       | `routers/account.ts`       | GDPR: data export, deletion |

---

## Database Schema

### Core Tables

```sql
-- Users: Authentication and credits
users (id, openId, name, email, credits, lifetimeCreditsUsed, ...)

-- Workspaces: User's marketing projects
workspaces (id, userId, name, industry, ...)

-- Goals: SMART goals per workspace
goals (id, workspaceId, title, status, progress, ...)

-- Todos: Tasks linked to goals
todos (id, workspaceId, goalId?, title, status, ...)

-- Chat: AI coach conversations
chatSessions (id, workspaceId, title, ...)
chatMessages (id, sessionId, role, content, ...)
```

### Billing Tables

```sql
-- Credit transactions audit log
creditTransactions (id, userId, featureKey, creditsSpent, balanceBefore, balanceAfter, ...)

-- Stripe payments
stripePayments (id, userId, stripeSessionId, amount, credits, status, ...)

-- Subscriptions
userSubscriptions (id, userId, planId, status, stripeSubscriptionId, ...)
```

### Performance Indexes

Key indexes added in migration `0008_add_performance_indexes.sql`:

- `creditTransactions(userId, createdAt)` - Transaction history queries
- `todos(workspaceId, status)` - Filtered todo queries
- `notifications(userId, isRead)` - Unread notification queries

---

## API Endpoints

### Authentication

- `POST /api/oauth/callback` - OAuth callback handler
- `GET /api/trpc/auth.me` - Get current user
- `POST /api/trpc/auth.logout` - Logout

### Workspaces

- `GET /api/trpc/workspaces.list` - List user's workspaces
- `GET /api/trpc/workspaces.getById` - Get workspace by ID
- `POST /api/trpc/workspaces.create` - Create workspace
- `POST /api/trpc/workspaces.update` - Update workspace
- `POST /api/trpc/workspaces.delete` - Delete workspace

### Chat

- `GET /api/trpc/chat.listSessions` - List chat sessions
- `GET /api/trpc/chat.getSession` - Get session with messages
- `POST /api/trpc/chat.createSession` - Create new session
- `POST /api/trpc/chat.sendMessage` - Send message, get AI response
- `POST /api/trpc/chat.deleteSession` - Delete session

### Credits

- `GET /api/trpc/credits.getBalance` - Current balance
- `GET /api/trpc/credits.getUsageHistory` - Transaction history
- `GET /api/trpc/credits.getMonthlyUsage` - Monthly stats

### Webhooks

- `POST /api/stripe/webhook` - Stripe payment webhooks

---

## Security

### Authentication

- OAuth 2.0 via Manus platform
- Session stored in HTTP-only, secure cookie
- JWT signed with `JWT_SECRET` environment variable

### Authorization

- **Ownership Checks**: All workspace resources verify user ownership
- **Protected Procedures**: Use `protectedProcedure` for authenticated routes
- **Admin Procedures**: Use `adminProcedure` for admin-only routes

### Input Validation

- All inputs validated via Zod schemas
- String lengths limited to prevent abuse
- Malformed requests rejected with 400 errors

### Credit System Safety

- **Atomic Operations**: Credit deductions use atomic SQL updates
- **Race Condition Prevention**: `UPDATE WHERE credits >= amount`
- **Idempotent Webhooks**: Stripe webhooks check for duplicate processing

---

## Error Handling

### Application Errors

```typescript
// Defined in shared/_core/errors.ts
enum AppErrorCode {
  INSUFFICIENT_CREDITS,
  RESOURCE_NOT_FOUND,
  ACCESS_DENIED,
  LIMIT_REACHED,
  LLM_ERROR,
  // ...
}
```

### tRPC Error Mapping

| AppErrorCode         | tRPC Code             |
| -------------------- | --------------------- |
| INSUFFICIENT_CREDITS | BAD_REQUEST           |
| RESOURCE_NOT_FOUND   | NOT_FOUND             |
| ACCESS_DENIED        | FORBIDDEN             |
| LIMIT_REACHED        | PRECONDITION_FAILED   |
| LLM_ERROR            | INTERNAL_SERVER_ERROR |

### Error Response Format

```json
{
  "error": {
    "message": "Human-readable message",
    "code": "TRPC_CODE",
    "data": {
      "appCode": "APP_ERROR_CODE",
      "details": { ... }
    }
  }
}
```

---

## Environment Variables

### Required

| Variable                 | Description             | Example                     |
| ------------------------ | ----------------------- | --------------------------- |
| `DATABASE_URL`           | MySQL connection string | `mysql://user:pass@host/db` |
| `JWT_SECRET`             | Session cookie signing  | `random-secret-64chars`     |
| `VITE_APP_ID`            | Manus OAuth app ID      | `app-123`                   |
| `OAUTH_SERVER_URL`       | Manus OAuth backend     | `https://api.manus.im`      |
| `BUILT_IN_FORGE_API_KEY` | LLM API key             | `key-xxx`                   |
| `STRIPE_SECRET_KEY`      | Stripe secret key       | `sk_live_xxx`               |
| `STRIPE_WEBHOOK_SECRET`  | Stripe webhook secret   | `whsec_xxx`                 |

### Optional

| Variable                 | Description | Default                  |
| ------------------------ | ----------- | ------------------------ |
| `PORT`                   | Server port | `3000`                   |
| `NODE_ENV`               | Environment | `development`            |
| `BUILT_IN_FORGE_API_URL` | LLM API URL | `https://forge.manus.im` |

---

## Local Development

### Prerequisites

- Node.js 20+
- pnpm 10+
- MySQL database (or use Docker)

### Setup

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp env.example .env

# Edit .env with your values
# Required: DATABASE_URL, JWT_SECRET, etc.

# Run database migrations
pnpm db:push

# Start development server
pnpm dev
```

### Available Scripts

```bash
pnpm dev          # Start dev server with hot reload
pnpm build        # Build for production
pnpm start        # Start production server
pnpm check        # TypeScript type checking
pnpm test         # Run tests
pnpm lint         # Run ESLint
pnpm db:push      # Generate and run migrations
```

---

## Testing

### Test Files

| File                      | Coverage                          |
| ------------------------- | --------------------------------- |
| `creditService.test.ts`   | Credit operations, atomic charges |
| `ownership.test.ts`       | Resource ownership verification   |
| `goals.test.ts`           | Goal CRUD operations              |
| `todos.test.ts`           | Todo CRUD operations              |
| `auth.logout.test.ts`     | Authentication flow               |
| `notifications.test.ts`   | Notification service              |
| `referralService.test.ts` | Referral system                   |

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run specific test file
pnpm test creditService
```

### Test Database

Tests require a test database. Set `DATABASE_URL` to a test database in CI or use a local MySQL instance.

---

## Known Limitations

1. **LLM Streaming**: Responses are buffered, not streamed
2. **Invoice Idempotency**: Uses metadata search (consider adding invoiceId column for scale)
3. **Rate Limiting**: Not implemented (consider adding for production)

---

## Recent Changes (December 2024)

### Credit System Hardening

- Atomic UPDATE operations to prevent race conditions
- Transaction logging with before/after balances

### Webhook Idempotency

- Stripe webhooks check for duplicate processing
- Payment records marked complete before credit grant

### Authorization Improvements

- Ownership verification for all workspace resources
- Centralized ownership utilities in `_core/ownership.ts`

### Error Handling

- Structured error codes via `AppErrorCode`
- Consistent error response format
- No stack traces leaked to clients

### LLM Resilience

- 60-second timeout for LLM requests
- Up to 3 retries with exponential backoff
- Proper error classification

### Performance

- Added database indexes for common queries
- Optimized transaction history queries

---

_Document maintained by Houston Backend Team_
