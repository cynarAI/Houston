# Houston - Umfassende Anwendungsinformationen

**Stand:** Dezember 2024  
**Version:** 1.0.0  
**Status:** Production-Ready

---

## Inhaltsverzeichnis

1. [Projektübersicht](#projektübersicht)
2. [Produktvision & Zielgruppe](#produktvision--zielgruppe)
3. [Technischer Stack](#technischer-stack)
4. [Architektur](#architektur)
5. [Features & Funktionalitäten](#features--funktionalitäten)
6. [Credit-System & Monetarisierung](#credit-system--monetarisierung)
7. [Design & UX](#design--ux)
8. [Datenbank-Schema](#datenbank-schema)
9. [API & Backend](#api--backend)
10. [Frontend-Struktur](#frontend-struktur)
11. [Testing & Qualitätssicherung](#testing--qualitätssicherung)
12. [Deployment & CI/CD](#deployment--cicd)
13. [Dokumentation & Regeln](#dokumentation--regeln)
14. [User Testing & Feedback](#user-testing--feedback)
15. [Roadmap & TODO](#roadmap--todo)

---

## Projektübersicht

### Was ist Houston?

**Houston** ist ein **KI-gestützter Marketing-Coach für KMUs und Solo-Founder**. Die Anwendung kombiniert eine öffentliche Landing Page mit einer internen Web-App, die Onboarding, Dashboard, Chat, Ziele, Todos und Strategie-Management bietet.

### Ziel der Anwendung

Houston ist ein **Assistenztool** mit folgenden Kernzielen:

1. **Marketing-Coaching für Nicht-Marketer** - KMU-Inhaber ohne Marketing-Expertise erhalten strukturierte Guidance
2. **Strategie-Entwicklung** - Vage Ideen werden in konkrete, umsetzbare Marketing-Pläne transformiert
3. **Tägliche Begleitung** - Proaktive Unterstützung statt reaktiver Chatbot
4. **Strukturierung** - SMART-Goals, Todos und Strategien werden automatisch generiert und verwaltet
5. **Wissensvermittlung** - Marketing-Best-Practices werden im Kontext vermittelt

**NICHT:** 
- Generischer Chatbot
- Projektmanagement-Tool
- Social Media Scheduler
- Analytics-Dashboard
- Agentur-Ersatz

### Kern-Value Proposition

> **"Houston hilft beschäftigten KMU-Inhabern, vage Marketing-Ideen in einen fokussierten, umsetzbaren Plan zu verwandeln - mit KI, die das schwere Denken übernimmt."**

### Live-URL

- **Production:** https://houston.manus.space
- **Repository:** GitHub (cynarAI/Houston)

---

## Produktvision & Zielgruppe

### Primäre Zielgruppe

- **Solo-Founder und Freelancer**, die Marketing "nebenbei" machen müssen
- **KMU-Inhaber** ohne eigene Marketing-Abteilung
- **Marketing-Einsteiger**, die Struktur und Guidance brauchen

### Gemeinsame Eigenschaften

- Wenig Zeit für Marketing
- Viele Ideen, aber keine klare Strategie
- Wissen, dass sie Marketing brauchen, aber wissen nicht wo anfangen
- Budget für Tools, aber nicht für eine Agentur

### Product Principles

1. **Focus** - Jeder Screen, jedes Feature muss dem primären Job dienen
2. **Simplicity** - Der nächste Schritt muss immer offensichtlich sein
3. **Coherence** - App und Marketing-Site müssen sich wie EIN Produkt anfühlen
4. **Quality** - Keine halbfertigen Flows, keine visuellen Glitches
5. **Habit** - Das Produkt muss es wert sein, jeden Tag geöffnet zu werden

### Tone of Voice

- **Klar** - Keine Marketing-Buzzwords, keine Übertreibungen
- **Warm** - Freundlich, aber nicht albern
- **Kompetent** - Wie ein erfahrener Berater, nicht wie ein Tool
- **Motivierend** - Positiv, aber nicht aufdringlich
- **Direkt** - Du-Form, aktive Sprache, kurze Sätze

---

## Technischer Stack

### Frontend

| Technologie | Version | Zweck |
|-------------|---------|-------|
| React | 19.x | UI Framework |
| Vite | 7.x | Build Tool |
| Wouter | 3.x | Client-Side Routing |
| Tailwind CSS | 4.x | Utility-First Styling |
| shadcn/ui | - | UI Komponenten (Radix + Tailwind) |
| TanStack Query | 5.x | Server State Management |
| i18next | 25.x | Internationalisierung (DE/EN) |
| TypeScript | 5.9 | Type Safety |

### Backend

| Technologie | Version | Zweck |
|-------------|---------|-------|
| Express | 4.x | HTTP Server |
| tRPC | 11.x | Type-Safe API |
| Drizzle ORM | 0.44.x | Database Access |
| MySQL/TiDB | - | Datenbank |
| Stripe | 20.x | Payments |
| Manus OAuth | - | Authentifizierung |
| Manus Forge API | - | LLM Integration (Gemini 2.5 Flash) |

### Sprache & Architektur

**Sprache:** TypeScript 5.9 (Frontend & Backend)

**Architektur-Pattern:**
- **Monorepo** - Frontend und Backend im selben Repository
- **Full-Stack TypeScript** - Type-Safety von DB bis UI
- **tRPC** - End-to-End Type-Safety ohne Code-Generierung
- **SPA** - Single Page Application mit Client-Side Routing
- **RESTful via tRPC** - Type-safe API-Calls statt REST-Endpoints

### Tooling

| Tool | Zweck |
|------|-------|
| pnpm | Package Manager |
| Vitest | Unit Testing |
| Playwright | E2E Testing |
| ESLint + Prettier | Code Quality |
| Husky | Git Hooks |
| Storybook | Component Development |

---

## Architektur

### Projekt-Struktur

```
houston/
├── client/                 # React Frontend (Vite)
│   └── src/
│       ├── components/     # UI Komponenten
│       │   └── ui/         # shadcn/ui Primitives
│       ├── pages/          # Route Pages
│       ├── locales/        # i18n (de.json, en.json)
│       ├── lib/            # Utilities (trpc, i18n, analytics)
│       ├── hooks/          # Custom React Hooks
│       └── contexts/       # React Contexts
├── server/                 # Express + tRPC Backend
│   ├── routers/            # tRPC Route Handler
│   ├── _core/              # Core Utilities (auth, llm, stripe)
│   └── webhooks/           # Stripe Webhook Handler
├── shared/                 # Shared Types und Constants
│   ├── types.ts            # Re-exports from drizzle schema
│   └── products.ts         # Stripe product definitions
├── drizzle/                # Database Schema + Migrations
│   ├── schema.ts           # Table definitions
│   └── migrations/         # SQL migrations
├── docs/                   # Dokumentation
│   ├── architecture/       # Technical architecture docs
│   ├── design/             # Design analysis & guidelines
│   ├── features/           # Feature specifications
│   ├── planning/           # TODOs & roadmaps
│   ├── qa/                 # QA reports & testing docs
│   └── releases/           # Release notes
├── e2e/                    # Playwright E2E Tests
└── research/               # Market research documents
```

### Datenfluss

```
Frontend (React)
      │
      │ tRPC Client
      ▼
Backend (Express + tRPC)
      │
      ├─► CreditService (für kostenpflichtige Features)
      │
      ├─► LLM Service (für AI-Features)
      │
      └─► Drizzle ORM
            │
            ▼
      MySQL/TiDB
```

### Domain-Module

1. **Houston Coach (AI Chat)** - Kern der App
2. **Goals & Todos** - SMART-Goal Management und Aufgabenverwaltung
3. **Strategy** - Marketing-Strategie-Editor
4. **Credits (Billing)** - Credit-basiertes Abrechnungssystem
5. **Referrals** - Empfehlungsprogramm mit Credit-Bonus
6. **Workspaces** - Multi-Workspace Support pro User
7. **Playbooks** - Vordefinierte Marketing-Strategien

---

## Features & Funktionalitäten

### Core Features

#### 1. Houston AI Chat
- **Kostenlos:** Basis-Chat-Nachrichten
- **Premium:** Tiefenanalyse (3 Credits)
- Kontextbewusst (kennt Workspace, Goals, Strategy)
- Streaming-Antworten für bessere UX

#### 2. Goals Management
- SMART-Goals (Specific, Measurable, Achievable, Relevant, Time-bound)
- AI-generierte Goals (5 Credits)
- Progress-Tracking (0-100%)
- Prioritäten (low, medium, high)
- Status (active, completed, archived)

#### 3. Todos
- Verknüpft mit Goals
- Kanban-Board (To Do, In Progress, Done)
- Drag & Drop Support
- Status-Tracking

#### 4. Strategy Editor
- Marketing-Strategie-Verwaltung
- Positioning, Personas, Core Messages
- Channels, Content Pillars
- AI-generierte Strategien (8 Credits)

#### 5. Dashboard
- Übersicht über aktuelle Aufgaben
- AI-Insights und Empfehlungen (3 Credits)
- Progress-Visualisierung
- "Nächster Schritt" Guidance

#### 6. Onboarding Wizard
- Business-Informationen sammeln
- Industry, Company Size, Target Audience
- AI-generierte Zusammenfassung
- Automatische SMART-Goals-Generierung

#### 7. Playbooks
- Vordefinierte Marketing-Strategien
- Blog-Funnel, Social Media 30-Day, etc.
- Branchen-spezifische Templates

### Credit-basierte Features

| Feature | Credits | Beschreibung |
|---------|---------|--------------|
| Chat (Basis) | 0 | Unbegrenzt kostenlos |
| Chat Deep Analysis | 3 | Detaillierte Marketing-Analyse |
| PDF Export | 2 | Ziele, Chats oder Strategie exportieren |
| AI Insights | 3 | Dashboard-Insights und Empfehlungen |
| Goals Generation | 5 | SMART-Ziele aus Nutzereingabe |
| Strategy Analysis | 8 | Umfassende Marketing-Strategie |
| Campaign Blueprint | 7 | Kompletter Kampagnen-Blueprint |
| Marketing Audit | 15 | Tiefgehende Analyse aller Marketing-Aktivitäten |
| Competitor Analysis | 12 | Detaillierte Konkurrenzanalyse |
| Content Calendar | 10 | 30-Tage Content-Kalender |

---

## Credit-System & Monetarisierung

### Credit-Definition

Ein **Credit** ist die atomare Abrechnungseinheit für ressourcenintensive Aktionen in Houston.

### Credit-Balance Storage

- `users.credits` - Aktuelles Credit-Guthaben (integer)
- `users.lifetimeCreditsUsed` - Gesamt verbrauchte Credits (für Analytics)
- `users.lastTopupAt` - Letzte Credit-Aufladung

### Paketstruktur

#### Starter (Kostenlos)
- **Credits:** 50 (einmalig)
- **Zielgruppe:** Neugierige, erste Tester
- Automatisch bei Account-Erstellung

#### Orbit Pack (€29/Monat)
- **Credits:** 200/Monat
- **Zielgruppe:** Solo-Unternehmer, kleine Unternehmen
- Auto-Renewal monatlich

#### Galaxy Pack (€99/Monat)
- **Credits:** 800/Monat
- **Zielgruppe:** Wachsende Teams, Agenturen
- Priority Support

#### Mission Boosters (Einmalzahlungen)
- **Mini Booster:** 100 Credits - €15
- **Power Booster:** 300 Credits - €39
- **Mega Booster:** 1000 Credits - €119

### CreditService API

**KRITISCH:** Alle Credit-Operationen MÜSSEN über CreditService laufen!

```typescript
// RICHTIG
import { CreditService, CREDIT_COSTS } from "./creditService";
const cost = CreditService.getCost("GOALS_GENERATION");
await CreditService.charge(userId, "GOALS_GENERATION", cost);

// FALSCH - niemals direkt DB-Updates für Credits
await db.update(users).set({ credits: newBalance });
```

### Stripe Integration

- **Checkout Sessions** für Abos und Boosters
- **Webhooks** für Zahlungsbestätigungen
- **Automatische Credit-Gutschrift** nach erfolgreicher Zahlung
- **Subscription Renewal** - monatliche Credit-Gutschrift

---

## Design & UX

### Design-System

#### CSS Variables (Design Tokens)

```css
/* Core colors */
--primary: 217 91% 60%;
--background: 0 0% 100%;
--foreground: 0 0% 9%;

/* AIstronaut brand */
--aistronaut-cyan: 192 100% 50%;   /* #00D4FF */
--aistronaut-purple: 258 87% 65%;  /* #8B5CF6 */
--aistronaut-pink: 340 100% 70%;   /* #FF6B9D */

/* Gradients */
--gradient-aistronaut: linear-gradient(
  135deg,
  #ff6b9d 0%,
  #8b5cf6 50%,
  #00d4ff 100%
);
```

#### UI-Komponenten (shadcn/ui)

- Layout: Card, Separator, Tabs, Accordion, Collapsible
- Forms: Button, Input, Textarea, Select, Checkbox, Switch
- Feedback: Alert, Badge, Progress, Skeleton, Spinner
- Overlay: Dialog, Sheet, Drawer, Popover, Tooltip
- Navigation: Sidebar, NavigationMenu, Breadcrumb
- Data: Table, ScrollArea, Avatar

### Responsive Design

- **Mobile-First Approach**
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-optimierte Targets für Mobile

### Dark Mode

- Automatische Dark Mode Unterstützung
- Theme-Switching über Theme Context
- WCAG 2.2 AA konforme Kontraste

---

## Datenbank-Schema

### Haupt-Tabellen

| Tabelle | Zweck |
|---------|-------|
| `users` | User-Accounts, Credit-Balance, Referral-Code |
| `workspaces` | User-Workspaces mit Business-Info |
| `goals` | SMART-Goals |
| `todos` | Tasks verknüpft mit Goals |
| `strategies` | Marketing-Strategien |
| `chatSessions` | Chat-Konversations-Sessions |
| `chatMessages` | Einzelne Nachrichten |
| `creditTransactions` | Credit-Nutzungs-Log |
| `creditPlans` | Abo-Pläne |
| `creditTopups` | Einmalige Käufe |
| `userSubscriptions` | Aktive Abos |
| `stripePayments` | Zahlungs-Records |
| `referrals` | Referral-Tracking |
| `notifications` | User-Benachrichtigungen |

### Schema-Änderungen

```bash
# 1. Edit drizzle/schema.ts
# 2. Generate and apply migration
pnpm db:push
```

---

## API & Backend

### tRPC Router-Struktur

```typescript
// Router erstellen
export const myFeatureRouter = router({
  list: protectedProcedure
    .input(z.object({ workspaceId: z.number() }))
    .query(async ({ ctx, input }) => {
      // ... implementation
    }),
    
  create: protectedProcedure
    .input(z.object({
      workspaceId: z.number(),
      title: z.string().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      // ... implementation
    }),
});
```

### Procedure Types

| Procedure | Verwendung |
|-----------|------------|
| `publicProcedure` | Öffentliche Endpoints (Landing, Health) |
| `protectedProcedure` | Authentifizierte User (`ctx.user` garantiert) |
| `adminProcedure` | Nur Admins (`ctx.user.role === "admin"`) |

### Error Handling

```typescript
import { AppError, AppErrorCode } from "@shared/_core/errors";

// Business-Fehler
throw new AppError(AppErrorCode.INSUFFICIENT_CREDITS, "Nicht genug Credits");
throw new AppError(AppErrorCode.RESOURCE_NOT_FOUND, "Ziel nicht gefunden");
```

### LLM Integration

#### LLM-Anforderungen

| Anforderung | Spezifikation | Begründung |
|-------------|---------------|------------|
| **Modell** | Gemini 2.5 Flash (via Manus Forge API) | Balance zwischen Geschwindigkeit und Qualität |
| **Kontextlänge** | max_tokens: 32.768 | Für umfangreiche Strategie-Analysen und Chat-Historie |
| **Geschwindigkeit** | Timeout: 60 Sekunden | Akzeptable UX für komplexe Analysen |
| **Retry-Logik** | 3 Versuche mit Exponential Backoff | Robustheit bei transienten Fehlern |
| **Thinking Budget** | 128 Tokens | Chain-of-Thought für bessere Qualität |
| **Kosten** | Credit-basiert (3-15 Credits je Feature) | Transparente Abrechnung für User |
| **On-Device** | Nein (Cloud-basiert) | Manus Forge API als Service |

#### LLM-Konfiguration

```typescript
// server/_core/llm.ts
const LLM_CONFIG = {
  TIMEOUT_MS: 60000,        // 60 Sekunden
  MAX_RETRIES: 3,           // Bis zu 3 Wiederholungen
  BASE_RETRY_DELAY_MS: 1000, // Exponential Backoff Basis
  RETRY_JITTER: 0.2,        // Zufällige Variation
};

// Payload-Konfiguration
payload.max_tokens = 32768;
payload.thinking = {
  budget_tokens: 128,
};
```

#### LLM-Integration Pattern

```typescript
import { invokeLLM } from "../_core/llm";

// Nicht-streaming (für strukturierte Antworten)
const response = await invokeLLM({
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: userMessage },
  ],
  outputSchema: {
    name: "StrategyAnalysis",
    schema: { /* JSON Schema */ },
  },
});

// Streaming (für Chat - aktuell nicht implementiert, nutzt Typing-Effekt)
// Geplant: streamLLM() für echte Streaming-Antworten
```

#### Verwendete Frameworks

**Keine Agent-Frameworks** - Houston nutzt eine **eigene Infrastruktur**:

- ❌ **LangChain** - Nicht verwendet
- ❌ **AutoGen** - Nicht verwendet  
- ❌ **CrewAI** - Nicht verwendet
- ✅ **Eigene Infrastruktur** - Direkte API-Calls zu Manus Forge API
- ✅ **tRPC** - Type-safe API-Layer zwischen Frontend und Backend
- ✅ **Custom LLM Service** - `server/_core/llm.ts` mit Retry-Logik und Error Handling

**Architektur-Entscheidung:**
- Einfache, direkte LLM-Calls statt komplexer Agent-Frameworks
- Bessere Kontrolle über Prompt-Engineering und Kontext-Management
- Type-Safety durch tRPC und TypeScript
- Credit-System als Orchestrierung für kostenpflichtige Features

---

## Frontend-Struktur

### Routing

| Route | Komponente | Beschreibung |
|-------|------------|--------------|
| `/` | Landing | Öffentliche Landing Page |
| `/app/dashboard` | Dashboard | Haupt-Dashboard (geschützt) |
| `/app/chats` | Chats | Houston Chat |
| `/app/goals` | Goals | Ziele-Verwaltung |
| `/app/todos` | Todos | To-dos |
| `/app/strategy` | Strategy | Strategie-Editor |
| `/app/credits` | Credits | Credits & Pläne |
| `/app/referrals` | Referrals | Empfehlungen |
| `/app/settings` | Settings | Einstellungen |

### Data Fetching

```typescript
import { trpc } from "@/lib/trpc";

// Query
const { data, isLoading, error } = trpc.goals.list.useQuery({ workspaceId });

// Mutation
const createGoal = trpc.goals.create.useMutation({
  onSuccess: () => {
    utils.goals.list.invalidate();
  },
});
```

### Internationalisierung (i18n)

- **Standard-Sprache:** Deutsch (Du-Form)
- **Fallback:** Englisch
- **Dateien:** `client/src/locales/de.json`, `client/src/locales/en.json`
- **Verwendung:** `const { t } = useTranslation(); t("key.path")`

---

## Testing & Qualitätssicherung

### Unit Tests (Vitest)

| Test File | Module | Tests |
|-----------|--------|-------|
| `creditService.test.ts` | Credit system | 28 |
| `referralService.test.ts` | Referral codes | 12 |
| `goals.test.ts` | SMART goals CRUD | 8 |
| `todos.test.ts` | Todo CRUD | 3 |
| `notifications.test.ts` | Notification system | 15 |
| `chat.test.ts` | Chat sessions | 2 |
| `chat.feedback.test.ts` | Message feedback | 4 |
| `workspaces.test.ts` | Workspace management | 3 |
| `auth.logout.test.ts` | Authentication | 1 |

**Total: ~76 unit tests**

### E2E Tests (Playwright)

- `landing.spec.ts` - Landing page visibility, navigation, responsive design

### Test-Commands

```bash
pnpm test              # Run all tests once
pnpm test:watch        # Watch mode for development
pnpm test creditService  # Run specific test file
pnpm e2e               # Run headless
pnpm e2e:ui            # Run with interactive UI
pnpm test -- --coverage  # Coverage report
```

---

## Deployment & CI/CD

### Production (Manus Platform)

```bash
git push origin main
```

Manus auto-deploys zu `houston.manus.space`.

### Manual Build

```bash
pnpm build    # Creates dist/
pnpm start    # Runs production server
```

### CI/CD Pipeline

- **GitHub Actions** (`.github/workflows/ci.yml`)
- TypeScript Check
- ESLint
- Unit Tests
- Build Verification

### Environment Variables

| Variable | Required | Beschreibung |
|----------|----------|--------------|
| `DATABASE_URL` | Yes | MySQL connection string |
| `JWT_SECRET` | Yes | Session cookie signing |
| `VITE_APP_ID` | Yes | Manus OAuth App ID |
| `OAUTH_SERVER_URL` | Yes | Manus OAuth backend URL |
| `BUILT_IN_FORGE_API_URL` | Yes | Manus LLM API endpoint |
| `BUILT_IN_FORGE_API_KEY` | Yes | Manus API key |
| `STRIPE_SECRET_KEY` | Yes | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Yes | Stripe webhook secret |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Yes | Stripe public key (frontend) |
| `SENTRY_DSN` | No | Sentry error tracking |
| `VITE_PLAUSIBLE_DOMAIN` | No | Plausible analytics domain |

---

## Dokumentation & Regeln

### Cursor IDE & Entwicklungsumgebung

#### Rolle von Cursor

**Cursor wird als IDE/Editor genutzt** mit folgenden Funktionen:

1. **Code-Editor** - Hauptentwicklungsumgebung für TypeScript/React
2. **AI-Assistent** - Inline-Code-Vervollständigung und -Vorschläge
3. **Cursor Rules** - Kontextuelle Regeln für konsistente Code-Generierung
4. **Git-Integration** - Version Control direkt im Editor

#### Cursor Composer

**Nicht verwendet** - Houston nutzt **keinen orchestrierenden Agent**:

- ❌ Cursor Composer wird nicht als Agent-System genutzt
- ✅ Cursor wird nur als intelligenter Editor verwendet
- ✅ Cursor Rules dienen der Code-Konsistenz, nicht der Orchestrierung
- ✅ Agent-Logik liegt im Backend (Credit-System, LLM-Service)

**Entscheidung:**
- Agent-Logik ist im Backend implementiert (Credit-System orchestriert Features)
- Cursor dient der Entwicklung, nicht der Laufzeit-Orchestrierung
- Einfacheres Debugging und bessere Kontrolle über Agent-Verhalten

#### Cursor Rules System

| Datei | Zweck | Aktivierung |
|-------|-------|-------------|
| `001-core-houston.mdc` | Projekt-Kern, Tech Stack | Always |
| `010-frontend.mdc` | React/Vite/shadcn/ui Patterns | Auto: `client/**` |
| `020-backend.mdc` | tRPC/Drizzle/CreditService | Auto: `server/**`, `drizzle/**` |
| `030-testing.mdc` | Vitest/Playwright Guidelines | Auto: `**/*.test.ts`, `e2e/**` |
| `040-ux-copy.mdc` | i18n, Houston Persona, Copy | Auto: `locales/**`, `pages/**` |

**Zweck der Rules:**
- Architektur-Konventionen kodifizieren
- Code-Patterns dokumentieren
- Domain-Wissen für AI-Assistenten bereitstellen
- Konsistente Code-Generierung sicherstellen

### Wichtige Dokumente

- [Product Vision & Principles](./product_principles_houston.md)
- [Architecture Overview](./architecture/architecture.md)
- [Credit System Design](./features/CREDIT_SYSTEM_DESIGN.md)
- [QA Release Checklist](./qa/QA_CHECKLIST.md)
- [User Testing Report](./USER_TESTING_REPORT.md)

### Non-Negotiable Regeln

1. **TypeScript** - Kein `any` ohne expliziten Grund
2. **Credit-System** - Immer über CreditService, nie direkt DB-Updates
3. **Authentifizierung** - Geschützte Endpoints: `protectedProcedure`
4. **Error Handling** - Verwende `AppError` für Business-Fehler
5. **Datenbank** - Schema-Änderungen nur in `drizzle/schema.ts`

---

## User Testing & Feedback

### Getestete Personas

1. **Sarah - Solo-Unternehmerin** (34, Mittel Tech-Level, Gering Marketing-Erfahrung)
2. **Max - Startup-Gründer** (28, Hoch Tech-Level, Mittel Marketing-Erfahrung)
3. **Claudia - Marketing-Managerin** (45, Niedrig Tech-Level, Hoch Marketing-Erfahrung)
4. **Tom - Freelance-Berater** (52, Niedrig Tech-Level, Mittel Marketing-Erfahrung)
5. **Lisa - E-Commerce-Inhaberin** (31, Hoch Tech-Level, Gering Marketing-Erfahrung)

### Top 5 Verbesserungen (Quick Wins)

1. SMART-Ziele nicht erklärt → Tooltip im Onboarding
2. Differenzierung zu ChatGPT unklar → "Was ist Houston?" Section
3. Hilfe/Support nicht sichtbar → Hilfe-Link im Footer
4. Sie-Form für B2B fehlt → Toggle in Einstellungen
5. E-Commerce Playbooks → Branchen-spezifische Templates

### Top 5 Stärken

1. Dashboard zeigt sofort nächste Aktion
2. AI-Antworten sind konkret & umsetzbar
3. Playbooks sind strukturiert & hilfreich
4. Onboarding-Confetti ist motivierend
5. Credit-System ist transparent

---

## Roadmap & TODO

### Bekannte Limitierungen

1. **Feedback-Persistierung** - Chat-Feedback wird akzeptiert aber nicht gespeichert
2. **Push-Notifications** - VAPID-Keys müssen für Produktion konfiguriert werden
3. **E2E-Tests** - Nur `landing.spec.ts` vorhanden, weitere Tests empfohlen

### Geplante Features

- [ ] Credit-Rollover (ungenutzte Credits 1 Monat mitnehmen)
- [ ] Team-Features (shared Workspaces)
- [ ] Referral-Bonus-Erweiterung
- [ ] Jahres-Abos mit Rabatt
- [ ] API-Dokumentation für Entwickler
- [ ] Integrations (Zapier, Shopify, etc.)

### Design-Verbesserungen

- [ ] Typografie-Hierarchie optimieren
- [ ] Spacing-Konsistenz (8px-Grid-System)
- [ ] Farben & Kontraste (WCAG 2.2 AA)
- [ ] Glassmorphism-Komponenten
- [ ] Micro-Interactions & Hover-States

---

## Quick Start

### Entwicklung

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

App läuft auf `http://localhost:3000`

### Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server (hot reload) |
| `pnpm build` | Build for production |
| `pnpm start` | Run production server |
| `pnpm check` | TypeScript type check |
| `pnpm lint` | ESLint check |
| `pnpm test` | Run unit tests (Vitest) |
| `pnpm e2e` | Run E2E tests (Playwright) |
| `pnpm db:push` | Generate and run DB migrations |
| `pnpm storybook` | Start Storybook on port 6006 |

---

## Support & Ressourcen

- **Manus Docs:** https://docs.manus.im
- **Manus Help:** https://help.manus.im
- **Live App:** https://houston.manus.space

---

**Erstellt:** Dezember 2024  
**Letzte Aktualisierung:** Dezember 2024  
**Version:** 1.0.0
