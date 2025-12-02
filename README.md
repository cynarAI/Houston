# 🚀 OrbitCoach – AIstronaut Marketing Coach

[![CI](https://github.com/cynarAI/Houston/actions/workflows/ci.yml/badge.svg)](https://github.com/cynarAI/Houston/actions/workflows/ci.yml)
[![Live App](https://img.shields.io/badge/Live-houston.manus.space-brightgreen)](https://houston.manus.space)
[![Tests](https://img.shields.io/badge/tests-46%20passing-success)](./server)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Eine vollständige, produktionsreife Marketing-Coach-Web-App für KMUs mit KI-Integration (Manus 1.5) und Credit-Based Billing System.

🌐 **Live:** [https://houston.manus.space](https://houston.manus.space)

## 🎯 Features

### Core Features
- ✅ **Öffentliche Landingpage** mit Hero, Benefits, Features, Pricing, FAQ
- ✅ **Onboarding-Flow** (5 Schritte) mit automatischer SMART-Goals-Generierung (Manus 1.5)
- ✅ **Dashboard** mit Echtzeit-Statistiken (Goals, Todos, Chats) und Credit Analytics Widget
- ✅ **Coach-Chat** mit KI-gestützten Antworten, Session-Management und Typing Indicator
- ✅ **Goals-Management** mit SMART-Kriterien und Fortschritts-Tracking
- ✅ **Todos-Management** mit Kanban-Board (Drag-and-Drop)
- ✅ **Strategy-Management** mit Positionierung, Personas, Kernbotschaften
- ✅ **Mehrsprachigkeit** (DE/EN) vorbereitet mit i18next
- ✅ **Responsive Design** für Mobile/Tablet/Desktop mit Space-Theme

### 💳 Credit-Based Billing System
- ✅ **Flexible Credits** statt Free/Paid Plans
- ✅ **Starter Credits** (50 Credits für neue User)
- ✅ **Credit Packs**:
  - Orbit Pack: €9.99/Monat (100 Credits)
  - Galaxy Pack: €39.99/Monat (500 Credits)
  - Mission Boosters: One-Time Top-ups (50/150/300 Credits)
- ✅ **Credit Indicator** im Dashboard (Live Balance)
- ✅ **Credits & Plans Page** mit Balance, History, Packs
- ✅ **Feature Costs**:
  - Chat Basic: Free
  - Chat Deep Analysis: 3 Credits
  - PDF Exports: 2 Credits
  - AI Insights: 3 Credits
  - Goals Generation: 5 Credits
  - Strategy Analysis: 8 Credits
- ✅ **Houston AI Credit Awareness** (proaktive Hinweise bei niedrigem Guthaben)
- ✅ **Low Credit Warnings** (dismissable Banners)
- ✅ **Credit Confirmation Dialogs** für teure Aktionen

### 💰 Stripe Payment Integration
- ✅ **Checkout Sessions** für Credit Packs (Orbit, Galaxy, Mission Boosters)
- ✅ **Webhook Handler** für Payment Success
- ✅ **Automatische Credit-Vergabe** nach erfolgreicher Zahlung
- ✅ **Payment History** Tracking
- ✅ **Integration** in Credits Page und Landing Page CTAs

### 📊 Credit Usage Analytics
- ✅ **Analytics Dashboard Widget** mit Credit Breakdown
- ✅ **Feature Usage Breakdown** (Donut Chart + Percentage)
- ✅ **Monthly Usage Trends** (Line Chart)
- ✅ **Top Features** Ranking
- ✅ **"Credits Saved"** Metric (Vergleich zum Vormonat)

### 🎁 Referral Program
- ✅ **Unique Referral Links** für jeden User (HOUSTON-{userId}-{random})
- ✅ **Referral Tracking System** (wer hat wen eingeladen)
- ✅ **Bonus Credits** (25 Credits für beide Seiten)
- ✅ **Referrals Dashboard** mit Stats, Link Sharing, Rewards
- ✅ **Share Buttons** (Twitter, Facebook, Email)
- ✅ **Referral History** mit Status-Tracking

## 🛠️ Tech-Stack

- **Frontend**: React 19, Tailwind CSS 4, shadcn/ui, Wouter
- **Backend**: Express 4, tRPC 11, Drizzle ORM
- **Datenbank**: MySQL/TiDB
- **Auth**: Manus OAuth
- **KI**: Manus 1.5 (LLM)
- **Payments**: Stripe
- **i18n**: i18next
- **Build**: Vite 7, TypeScript 5.9
- **Testing**: Vitest

## 📦 Installation

```bash
# Dependencies installieren
pnpm install

# Datenbank-Schema migrieren
pnpm db:push

# Dev-Server starten
pnpm dev
```

## 🚀 Deployment

### Manus Platform (Production)

Die App ist produktiv deployed auf: **[https://houston.manus.space](https://houston.manus.space)**

**Deployment erfolgt automatisch über die Manus-Plattform:**
1. Code zu GitHub pushen: `git push origin main`
2. Manus erkennt automatisch Änderungen
3. Build & Deploy läuft automatisch auf `houston.manus.space`

**Manuelle Deployment-Befehle (lokal testen):**

```bash
# Build erstellen
pnpm build

# Production-Server starten
pnpm start
```

### Environment-Variablen

Alle Variablen werden automatisch von Manus injiziert (siehe Abschnitt 🔑 Environment-Variablen unten).

## 📚 Dokumentation

Siehe folgende Dokumentations-Dateien:

- **[CREDIT_SYSTEM_DESIGN.md](./CREDIT_SYSTEM_DESIGN.md)**: Credit-System Architektur
- **[CREDIT_SYSTEM_USER_GUIDE.md](./CREDIT_SYSTEM_USER_GUIDE.md)**: User-Dokumentation für Credits
- **[STRIPE_ANALYTICS_REFERRAL_DESIGN.md](./STRIPE_ANALYTICS_REFERRAL_DESIGN.md)**: Stripe, Analytics & Referral Architektur

## 🔑 Environment-Variablen

Die folgenden Variablen werden automatisch von der Manus-Plattform injiziert:

- `DATABASE_URL`: MySQL/TiDB-Connection
- `JWT_SECRET`: Session-Cookie-Signing
- `VITE_APP_ID`: Manus OAuth App-ID
- `OAUTH_SERVER_URL`: Manus OAuth Backend
- `BUILT_IN_FORGE_API_URL`: Manus LLM API
- `BUILT_IN_FORGE_API_KEY`: Manus API Key
- `STRIPE_SECRET_KEY`: Stripe Secret Key
- `STRIPE_WEBHOOK_SECRET`: Stripe Webhook Secret
- `VITE_STRIPE_PUBLISHABLE_KEY`: Stripe Publishable Key (Frontend)

## 📝 Scripts

| Script | Zweck |
|--------|-------|
| `pnpm dev` | Dev-Server starten |
| `pnpm build` | Production-Build |
| `pnpm start` | Production-Server |
| `pnpm check` | TypeScript-Check |
| `pnpm test` | Vitest-Tests (46 Tests) |
| `pnpm db:push` | DB-Migration |

## 🎨 Design-System

- **Primärfarbe**: #ffb606 (Gelb/Orange)
- **Sekundärfarbe**: #442e66 (Dunkelblau)
- **Akzentfarben**: #FF6B9D (Pink), #8B5CF6 (Purple)
- **Schriftart**: Inter (Google Fonts)
- **Theme**: Space/Astronaut (Immersive Background mit Sternen)
- **Tonalität**: Du-Form, freundlich, motivierend

## 🧪 Testing

```bash
# Alle Tests ausführen
pnpm test

# Spezifische Test-Datei
pnpm test creditService

# Test Coverage
pnpm test --coverage
```

**Test Files:**
- `server/creditService.test.ts` (25 Tests)
- `server/auth.logout.test.ts` (1 Test)
- `server/chat.test.ts` (2 Tests)
- `server/chat.feedback.test.ts` (4 Tests)
- `server/goals.test.ts` (4 Tests)
- `server/todos.test.ts` (3 Tests)
- `server/workspaces.test.ts` (3 Tests)

**Total: 46 Tests passing**

## 📋 TODO

Siehe [todo.md](./todo.md) für offene Tasks und Feature-Requests.

## 🆘 Support

- **Manus Support**: https://help.manus.im
- **Dokumentation**: https://docs.manus.im

---

**Erstellt mit Manus AI** – Dezember 2024
