# Houston – AIstronaut Marketing Coach

[![CI](https://github.com/cynarAI/Houston/actions/workflows/ci.yml/badge.svg)](https://github.com/cynarAI/Houston/actions/workflows/ci.yml)
[![Live App](https://img.shields.io/badge/Live-houston.manus.space-brightgreen)](https://houston.manus.space)

AI-powered marketing coach for SMBs with credit-based billing.

**Live:** [https://houston.manus.space](https://houston.manus.space)

---

## Tech Stack

| Layer    | Technology                                                  |
| -------- | ----------------------------------------------------------- |
| Frontend | React 19, Tailwind CSS 4, shadcn/ui, Wouter, TanStack Query |
| Backend  | Express 4, tRPC 11, Drizzle ORM                             |
| Database | MySQL / TiDB                                                |
| Auth     | Manus OAuth                                                 |
| AI       | Manus 1.5 LLM                                               |
| Payments | Stripe                                                      |
| i18n     | i18next (DE/EN)                                             |
| Build    | Vite 7, TypeScript 5.9, esbuild                             |
| Testing  | Vitest, Playwright                                          |

---

## Quick Start

```bash
# 1. Install dependencies
pnpm install

# 2. Set up environment (copy and fill in values)
cp env.example .env

# 3. Push database schema
pnpm db:push

# 4. Start dev server
pnpm dev
```

App runs at `http://localhost:3000`

---

## Scripts

| Command          | Description                           |
| ---------------- | ------------------------------------- |
| `pnpm dev`       | Start development server (hot reload) |
| `pnpm build`     | Build for production                  |
| `pnpm start`     | Run production server                 |
| `pnpm check`     | TypeScript type check                 |
| `pnpm lint`      | ESLint check                          |
| `pnpm test`      | Run unit tests (Vitest)               |
| `pnpm e2e`       | Run E2E tests (Playwright)            |
| `pnpm db:push`   | Generate and run DB migrations        |
| `pnpm storybook` | Start Storybook on port 6006          |

---

## Environment Variables

Copy `env.example` to `.env` and configure:

| Variable                      | Required | Description                  |
| ----------------------------- | -------- | ---------------------------- |
| `DATABASE_URL`                | Yes      | MySQL connection string      |
| `JWT_SECRET`                  | Yes      | Session cookie signing       |
| `VITE_APP_ID`                 | Yes      | Manus OAuth App ID           |
| `OAUTH_SERVER_URL`            | Yes      | Manus OAuth backend URL      |
| `BUILT_IN_FORGE_API_URL`      | Yes      | Manus LLM API endpoint       |
| `BUILT_IN_FORGE_API_KEY`      | Yes      | Manus API key                |
| `STRIPE_SECRET_KEY`           | Yes      | Stripe secret key            |
| `STRIPE_WEBHOOK_SECRET`       | Yes      | Stripe webhook secret        |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Yes      | Stripe public key (frontend) |
| `SENTRY_DSN`                  | No       | Sentry error tracking        |
| `VITE_PLAUSIBLE_DOMAIN`       | No       | Plausible analytics domain   |

> On Manus Platform: All required variables are auto-injected.

---

## Project Structure

```
/client               React frontend (Vite)
  /src
    /components       UI components (shadcn/ui in /ui)
    /pages            Route pages
    /locales          i18n JSON files (de.json, en.json)
    /lib              Utilities (trpc, i18n, analytics)
/server               Express + tRPC backend
  /routers            tRPC route handlers
  /_core              Core utilities (auth, llm, stripe)
  /webhooks           Stripe webhook handler
/shared               Shared types and constants
/drizzle              DB schema and migrations
/docs                 Project documentation
  /architecture       Technical architecture docs
  /design             Design analysis & guidelines
  /features           Feature specifications
  /planning           TODOs & roadmaps
  /qa                 QA reports & testing docs
  /releases           Release notes
/research             Market research documents
/e2e                  Playwright E2E tests
```

---

## Deployment

Das Deployment-System ist darauf ausgelegt, Deployments schneller, ressourcenschonender und flexibler zu gestalten. Der rechenintensive Build-Prozess findet in GitHub Actions oder lokal statt, nicht mehr auf dem Manus-Agenten.

### Automatisches Deployment (GitHub Actions)

Jeder Push auf den `main`-Branch löst automatisch einen Build- und Deployment-Prozess über GitHub Actions aus.

**Funktionsweise:**

1. **Build-Job**: Dependencies werden aus dem Cache geladen, die App wird gebaut
2. **Deploy-Job**: Die gebauten Artefakte werden an die Manus-Plattform gesendet

**Setup:**

1. Gehen Sie zu Ihrem GitHub-Repository
2. Navigieren Sie zu `Settings` > `Secrets and variables` > `Actions`
3. Erstellen Sie ein neues Secret: `MANUS_API_KEY`
4. Fügen Sie Ihren Manus API-Schlüssel als Wert ein

Der Workflow wird durch `.github/workflows/optimized-ci.yml` gesteuert.

### Manuelles Deployment (Lokal)

Für schnelle Deployments direkt aus Ihrer Entwicklungsumgebung können Sie das `deploy.sh`-Skript verwenden.

**Setup:**

1. **API-Schlüssel als Umgebungsvariable setzen:**

   Temporär (für die aktuelle Terminalsitzung):

   ```bash
   export MANUS_API_KEY='ihr-api-schluessel'
   ```

   Permanent (empfohlen):

   ```bash
   echo 'export MANUS_API_KEY="ihr-api-schluessel"' >> ~/.zshrc
   source ~/.zshrc
   ```

2. **Skript ausführbar machen:**
   ```bash
   chmod +x deploy.sh
   ```

**Verwendung:**

```bash
./deploy.sh
```

Das Skript führt automatisch aus:

- Installation der Dependencies (`pnpm install`)
- Build der Anwendung (`pnpm build`)
- Start eines Deployment-Tasks über die Manus API

### Manual Build (ohne Deployment)

```bash
pnpm build    # Creates dist/
pnpm start    # Runs production server
```

---

## Documentation

All documentation is organized in the `docs/` folder:

| Folder                                     | Contents                                         |
| ------------------------------------------ | ------------------------------------------------ |
| [docs/architecture/](./docs/architecture/) | Technical architecture, performance docs         |
| [docs/design/](./docs/design/)             | Design analysis, UX guidelines, space theme      |
| [docs/features/](./docs/features/)         | Feature specs (credit system, Stripe, referrals) |
| [docs/planning/](./docs/planning/)         | TODOs, roadmaps, redesign plans                  |
| [docs/qa/](./docs/qa/)                     | QA reports, test results, accessibility          |
| [docs/releases/](./docs/releases/)         | Release notes, summaries                         |

**Key documents:**

- [Product Vision & Principles](./docs/product_principles_houston.md) - Steve-Jobs-level product focus
- [Architecture Overview](./docs/architecture/architecture.md)
- [Credit System Design](./docs/features/CREDIT_SYSTEM_DESIGN.md)
- [QA Release Checklist](./docs/qa/QA_CHECKLIST.md) - Critical user flows & testing
- [Full Documentation](./docs/README.md)

---

## Testing

### Running Tests

```bash
# Unit Tests (Vitest)
pnpm test              # Run all tests once
pnpm test:watch        # Watch mode for development
pnpm test creditService  # Run specific test file

# E2E Tests (Playwright)
pnpm e2e               # Run headless
pnpm e2e:ui            # Run with interactive UI

# Coverage
pnpm test -- --coverage
```

### Prerequisites

Tests require a running database connection:

```bash
# Set DATABASE_URL in your environment
export DATABASE_URL="mysql://user:password@localhost:3306/houston_test"
```

> Tip: Use a separate test database to avoid polluting development data.

### Test Coverage

| Test File                 | Module                                 | Tests |
| ------------------------- | -------------------------------------- | ----- |
| `creditService.test.ts`   | Credit system (charge, grant, balance) | 28    |
| `referralService.test.ts` | Referral codes, bonus credits          | 12    |
| `goals.test.ts`           | SMART goals CRUD, progress updates     | 8     |
| `todos.test.ts`           | Todo CRUD, status changes              | 3     |
| `notifications.test.ts`   | Notification system                    | 15    |
| `chat.test.ts`            | Chat sessions, AI messaging            | 2     |
| `chat.feedback.test.ts`   | Message feedback                       | 4     |
| `workspaces.test.ts`      | Workspace management                   | 3     |
| `auth.logout.test.ts`     | Authentication logout                  | 1     |

**Total: ~76 unit tests**

### E2E Tests

Located in `e2e/`:

- `landing.spec.ts` - Landing page visibility, navigation, responsive design

### CI/CD

Tests run automatically on GitHub Actions (see `.github/workflows/ci.yml`).
The CI pipeline includes TypeScript check, linting, unit tests, and build verification.

---

## Support

- Manus Docs: https://docs.manus.im
- Manus Help: https://help.manus.im
