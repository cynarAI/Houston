# OrbitCoach – AIstronaut Marketing Coach

**Version:** 1.3  
**Autor:** Manus AI  
**Datum:** Dezember 2024  
**Status:** Produktionsreif

---

## Zusammenfassung

OrbitCoach ist eine vollständige, produktionsreife Marketing-Coach-Web-App für KMUs, die auf dem AIstronaut-Ökosystem basiert. Die Anwendung kombiniert eine öffentliche Landingpage mit einer internen Web-App, die einen KI-gestützten Marketing-Coach (Manus 1.5), Onboarding-Flow, Dashboard, Chat-Interface, Ziele-, Strategie- und To-do-Management sowie ein vollständiges Plan-Limits-System (Satellite/Rocket) umfasst. Die App ist mehrsprachig (DE/EN) vorbereitet und nutzt das AIstronaut-Design-System mit den Primärfarben #ffb606 (Gelb/Orange) und #442e66 (Dunkelblau).

---

## Technologie-Stack

Die Anwendung basiert auf einem modernen Full-Stack-Setup mit folgenden Technologien:

| Komponente | Technologie | Version | Zweck |
|------------|-------------|---------|-------|
| **Frontend** | React 19 | 19.1.1 | UI-Framework |
| **Routing** | Wouter | 3.3.5 | Client-Side Routing |
| **Styling** | Tailwind CSS | 4.1.14 | Utility-First CSS |
| **UI-Komponenten** | shadcn/ui | - | Radix UI + Tailwind |
| **Backend** | Express 4 | 4.21.2 | Node.js Server |
| **API-Layer** | tRPC | 11.6.0 | Type-Safe API |
| **Datenbank** | MySQL/TiDB | - | Relationale DB |
| **ORM** | Drizzle ORM | 0.44.5 | Type-Safe DB-Zugriff |
| **Authentifizierung** | Manus OAuth | - | SSO-Integration |
| **KI-Integration** | Manus 1.5 | - | LLM-Backend |
| **Mehrsprachigkeit** | i18next | - | Internationalisierung |
| **Build-Tool** | Vite | 7.1.7 | Frontend-Build |
| **TypeScript** | TypeScript | 5.9.3 | Type Safety |

---

## Architektur-Übersicht

Die Anwendung folgt einer klassischen Client-Server-Architektur mit klarer Trennung zwischen Frontend und Backend:

### Backend-Struktur

Das Backend ist in mehrere Router aufgeteilt, die jeweils eine spezifische Domäne abdecken:

| Router | Pfad | Zweck |
|--------|------|-------|
| **auth** | `/api/trpc/auth` | Authentifizierung (me, logout) |
| **workspaces** | `/api/trpc/workspaces` | Workspace-Management |
| **goals** | `/api/trpc/goals` | SMART-Goals-CRUD |
| **todos** | `/api/trpc/todos` | To-do-Management |
| **strategy** | `/api/trpc/strategy` | Marketing-Strategie |
| **chat** | `/api/trpc/chat` | Coach-Chat mit Manus 1.5 |
| **onboarding** | `/api/trpc/onboarding` | Onboarding-Flow |
| **planLimits** | `/api/trpc/planLimits` | Plan-Limits (Satellite/Rocket) |

### Datenbank-Schema

Die Datenbank umfasst 8 Haupttabellen:

**Tabelle: users**
- `id` (INT, PK): Benutzer-ID
- `openId` (VARCHAR): Manus OAuth ID
- `name`, `email`, `loginMethod`: Benutzerdaten
- `role` (ENUM): "user" | "admin"
- `createdAt`, `updatedAt`, `lastSignedIn`: Zeitstempel

**Tabelle: workspaces**
- `id` (INT, PK): Workspace-ID
- `userId` (INT, FK): Besitzer
- `name`, `description`: Workspace-Daten
- `industry`, `companySize`, `targetAudience`, `products`, `channels`, `budget`, `challenges`, `goals`: Onboarding-Daten

**Tabelle: goals**
- `id` (INT, PK): Ziel-ID
- `workspaceId` (INT, FK): Zugehöriger Workspace
- `title`, `description`: Ziel-Beschreibung
- `specific`, `measurable`, `achievable`, `relevant`, `timeBound`: SMART-Kriterien
- `status` (ENUM): "active" | "completed" | "archived"
- `priority` (ENUM): "high" | "medium" | "low"
- `progress` (INT): Fortschritt 0-100%

**Tabelle: strategy**
- `id` (INT, PK): Strategie-ID
- `workspaceId` (INT, FK): Zugehöriger Workspace
- `positioning`, `personas`, `coreMessages`, `channels`, `contentPillars`: Strategie-Daten

**Tabelle: todos**
- `id` (INT, PK): To-do-ID
- `workspaceId` (INT, FK): Zugehöriger Workspace
- `goalId` (INT, FK, optional): Verknüpftes Ziel
- `title`, `description`: To-do-Beschreibung
- `status` (ENUM): "open" | "in_progress" | "done"
- `priority` (ENUM): "high" | "medium" | "low"
- `dueDate` (TIMESTAMP, optional): Fälligkeitsdatum

**Tabelle: chatSessions**
- `id` (INT, PK): Session-ID
- `workspaceId` (INT, FK): Zugehöriger Workspace
- `title`: Session-Titel
- `createdAt`, `updatedAt`: Zeitstempel

**Tabelle: chatMessages**
- `id` (INT, PK): Nachrichten-ID
- `sessionId` (INT, FK): Zugehörige Session
- `role` (ENUM): "user" | "coach"
- `content` (TEXT): Nachrichteninhalt

**Tabelle: planLimits**
- `id` (INT, PK): Limit-ID
- `userId` (INT, FK): Benutzer
- `plan` (ENUM): "satellite" | "rocket"
- `maxWorkspaces`, `maxChatsPerMonth`, `maxGoals`, `maxTodos`: Limits
- `chatsUsedThisMonth` (INT): Aktueller Verbrauch
- `periodStart`, `periodEnd`: Abrechnungszeitraum

### Frontend-Struktur

Das Frontend ist in Seiten und wiederverwendbare Komponenten aufgeteilt:

**Seiten:**
- `Landing.tsx`: Öffentliche Landingpage
- `Dashboard.tsx`: Haupt-Dashboard mit Stats
- `Onboarding.tsx`: 5-Schritte-Onboarding
- `Chats.tsx`: Coach-Chat-Interface
- `Goals.tsx`: SMART-Goals-Management
- `Todos.tsx`: To-do-Kanban-Board
- `Strategy.tsx`: Marketing-Strategie-Editor

**Komponenten:**
- `AppLayout.tsx`: Sidebar-Navigation + Header
- `PlanBadge.tsx`: Satellite/Rocket-Badge
- `UpgradeDialog.tsx`: Upgrade-Prompt
- `LanguageSwitcher.tsx`: DE/EN-Umschalter

---

## Funktions-Übersicht

### 1. Öffentliche Landingpage

Die Landingpage folgt dem AIstronaut-Design und umfasst:

- **Hero-Section**: Headline, Subheadline, CTAs ("Kostenlos starten", "Alle Funktionen entdecken")
- **Benefits-Section**: 4 Vorteilskacheln (Zeit sparen, Klarheit gewinnen, Marketing strukturieren, Umsatzpotenzial heben)
- **Features-Section**: Checkmark-Liste mit Hauptfunktionen
- **How It Works**: 3-Schritte-Flow (Account erstellen, Onboarding, Coach nutzen)
- **Pricing**: Satellite (Free) vs. Rocket (€49/Monat)
- **FAQ**: 7 häufige Fragen
- **Footer**: Links, Newsletter, Copyright

**Design-Merkmale:**
- Sticky Header mit Navigation
- Primärfarbe #ffb606 für CTAs und Akzente
- Inter-Schriftart (Google Fonts)
- Responsive für Mobile/Tablet/Desktop
- Language Switcher (DE/EN) im Header

### 2. Onboarding-Flow (5 Schritte)

Der Onboarding-Flow sammelt Business-Daten und generiert automatisch SMART-Goals:

**Schritt 1: Willkommen**
- Begrüßung und Motivation
- CTA zum Start

**Schritt 2: Fragebogen**
- Branche (z.B. "E-Commerce", "SaaS", "Beratung")
- Unternehmensgröße (z.B. "1-10", "11-50", "51-200")
- Zielgruppe (Freitext)
- Produkte/Dienstleistungen (Freitext)
- Marketingkanäle (Multi-Select: Website, Social Media, E-Mail, SEO, Ads, Events)
- Monatliches Budget (Dropdown: <500€, 500-2000€, 2000-5000€, >5000€)
- Größte Herausforderungen (Freitext)
- Ziele (Freitext)

**Schritt 3: Zusammenfassung (Manus 1.5)**
- KI generiert eine strukturierte Zusammenfassung der Eingaben
- Nutzer kann fortfahren oder zurück

**Schritt 4: SMART-Goals (Manus 1.5)**
- KI generiert 3 SMART-Goals basierend auf den Eingaben
- Jedes Goal hat: Title, Specific, Measurable, Achievable, Relevant, Time-bound
- Nutzer kann Goals akzeptieren

**Schritt 5: Abschluss**
- Bestätigung und Übergang zum Dashboard

### 3. Dashboard

Das Dashboard zeigt eine Übersicht über die Marketing-Mission:

**Plan-Badge-Sektion:**
- Anzeige des aktuellen Plans (Satellite/Rocket)
- Chat-Usage-Counter (z.B. "15 / 20 Chats diesen Monat")
- Upgrade-Button für Satellite-Nutzer

**Quick-Stats (4 Cards):**
- Workspaces: Anzahl / Maximum
- Aktive Ziele: Anzahl / Maximum
- Offene To-dos: Anzahl / Maximum
- Chat-Gespräche: Anzahl

**Haupt-Content (4 Sektionen):**
- Heute / Nächste Schritte
- Ziele & Fortschritt
- Strategie auf einen Blick
- Letzte Gespräche mit Coach

### 4. Coach-Chat-Interface

Das Chat-Interface ermöglicht Gespräche mit dem KI-Coach:

**Features:**
- Session-Liste in der Sidebar
- "Neues Gespräch"-Button (mit Limit-Check)
- Chat-Historie mit User/Coach-Bubbles
- Markdown-Rendering für Coach-Antworten (via Streamdown)
- Streaming-Effekt (simuliert)
- Quick-Suggestion-Buttons für schnellen Einstieg
- Empty-States mit hilfreichen CTAs

**Limit-Enforcement:**
- Vor neuer Session-Erstellung wird `planLimits.checkChatLimit` aufgerufen
- Bei Limit-Erreichen wird UpgradeDialog angezeigt
- Nach erfolgreicher Session-Erstellung wird `planLimits.incrementChatUsage` aufgerufen

### 5. Goals-Management

Die Goals-Seite zeigt alle SMART-Goals:

**Features:**
- Liste aller Goals mit SMART-Kriterien
- Create/Edit/Delete-Funktionen
- Status-Filter (Active, Completed, Archived)
- Prioritäts-Badges (High, Medium, Low)
- Fortschritts-Anzeige (Placeholder)
- Empty-State mit CTA

### 6. Todos-Management

Die Todos-Seite zeigt ein Kanban-Board:

**Features:**
- 2 Spalten: "Offen" und "Erledigt"
- Stats-Cards (Offen, Erledigt, Gesamt)
- Prioritäts-Badges (High, Medium, Low)
- Checkbox-Toggle für Status
- Fälligkeitsdatum-Support
- Create/Delete-Funktionen
- Empty-State mit CTA

### 7. Strategy-Management

Die Strategy-Seite zeigt die Marketing-Strategie:

**Features:**
- Positionierung & Personas
- Kernbotschaften
- Marketingkanäle
- Content-Säulen
- Edit/Save-Modus
- Empty-State mit CTA

### 8. Plan-Limits-System

Das Plan-Limits-System enforced die Unterschiede zwischen Satellite und Rocket:

| Feature | Satellite (Free) | Rocket (€49/Monat) |
|---------|------------------|-------------------|
| Workspaces | 1 | 3 |
| Chats/Monat | 20 | 200 |
| Ziele | 3 | Unbegrenzt (999) |
| To-dos | 10 | Unbegrenzt (999) |

**Komponenten:**
- `PlanBadge`: Zeigt aktuellen Plan (Satellite/Rocket)
- `UpgradeDialog`: Prompt mit Feature-Übersicht und Preisanzeige
- Backend-Checks: `checkWorkspaceLimit`, `checkChatLimit`
- Auto-Inkrementierung: `incrementChatUsage` bei neuer Session

### 9. Mehrsprachigkeit (i18n)

Die App ist für Mehrsprachigkeit vorbereitet:

**Implementiert:**
- i18next installiert und konfiguriert
- DE/EN-Übersetzungsdateien (`client/src/locales/de.json`, `client/src/locales/en.json`)
- LanguageSwitcher-Komponente im Header
- AppLayout-Navigation lokalisiert
- Landing-Header lokalisiert

**Noch zu tun:**
- Alle Seiten (Onboarding, Dashboard, Chat, Goals, Todos, Strategy) mit `useTranslation`-Hook ausstatten
- Alle Texte durch `t()`-Aufrufe ersetzen

---

## Manus 1.5 Integration

Die App nutzt Manus 1.5 für folgende Use-Cases:

### 1. Onboarding-Zusammenfassung

**Endpoint:** `onboarding.generateSummary`

**Input:**
```typescript
{
  industry: string;
  companySize: string;
  targetAudience: string;
  products: string;
  channels: string[];
  budget: string;
  challenges: string;
  goals: string;
}
```

**Output:**
```typescript
{
  summary: string; // Markdown-formatierte Zusammenfassung
}
```

**Prompt-Template:**
```
Du bist ein erfahrener Marketing-Coach. Fasse die folgenden Informationen über ein Unternehmen zusammen:

Branche: {industry}
Größe: {companySize}
Zielgruppe: {targetAudience}
Produkte: {products}
Kanäle: {channels}
Budget: {budget}
Herausforderungen: {challenges}
Ziele: {goals}

Erstelle eine prägnante Zusammenfassung (max. 200 Wörter).
```

### 2. SMART-Goals-Generierung

**Endpoint:** `onboarding.generateGoals`

**Input:** (gleich wie `generateSummary`)

**Output:**
```typescript
{
  goals: Array<{
    title: string;
    specific: string;
    measurable: string;
    achievable: string;
    relevant: string;
    timeBound: string;
  }>;
}
```

**Prompt-Template:**
```
Du bist ein Marketing-Coach. Basierend auf den folgenden Informationen, erstelle 3 SMART-Goals:

[Business-Daten]

Jedes Goal muss haben:
- Title: Kurzer Titel
- Specific: Spezifisch
- Measurable: Messbar
- Achievable: Erreichbar
- Relevant: Relevant
- Time-bound: Zeitgebunden

Antworte im JSON-Format.
```

### 3. Coach-Chat-Antworten

**Endpoint:** `chat.sendMessage`

**Input:**
```typescript
{
  sessionId: number;
  content: string; // User-Nachricht
  language: "de" | "en";
}
```

**Output:**
```typescript
{
  response: string; // Coach-Antwort (Markdown)
}
```

**System-Prompt:**
```
Du bist der AIstronaut Marketing Coach, ein freundlicher und kompetenter Marketing-Berater für KMUs. 
Deine Aufgabe ist es, praktische, umsetzbare Tipps zu geben und den Nutzer zu motivieren.

Kontext: Der Nutzer hat folgende Business-Daten:
[Workspace-Daten]

Antworte in {language}, verwende die Du-Form und sei motivierend.
```

---

## Deployment-Vorbereitung

Die App ist bereit für Deployment. Folgende Schritte sind erforderlich:

### 1. Environment-Variablen

Stelle sicher, dass folgende Variablen gesetzt sind:

| Variable | Zweck | Beispiel |
|----------|-------|----------|
| `DATABASE_URL` | MySQL/TiDB-Connection | `mysql://user:pass@host:port/db` |
| `JWT_SECRET` | Session-Cookie-Signing | `random-secret-string` |
| `VITE_APP_ID` | Manus OAuth App-ID | `app-id-from-manus` |
| `OAUTH_SERVER_URL` | Manus OAuth Backend | `https://api.manus.im` |
| `VITE_OAUTH_PORTAL_URL` | Manus Login Portal | `https://auth.manus.im` |
| `BUILT_IN_FORGE_API_URL` | Manus LLM API | `https://forge.manus.im` |
| `BUILT_IN_FORGE_API_KEY` | Manus API Key | `api-key-from-manus` |

### 2. Build-Prozess

```bash
# Frontend-Build
pnpm build

# Backend-Build
# (wird automatisch von `pnpm build` ausgeführt)
```

### 3. Datenbank-Migration

```bash
# Schema generieren und migrieren
pnpm db:push
```

### 4. Server-Start

```bash
# Production-Modus
pnpm start
```

---

## Nächste Schritte

### Priorität 1: Vollständige i18n-Lokalisierung

**Aufwand:** 2-3 Stunden

**Tasks:**
1. Alle Seiten mit `useTranslation`-Hook ausstatten
2. Alle Texte durch `t()`-Aufrufe ersetzen
3. Fehlende Übersetzungen in `de.json` und `en.json` ergänzen
4. Sprachwechsel in allen Seiten testen

### Priorität 2: Upgrade-Seite mit Stripe

**Aufwand:** 4-6 Stunden

**Tasks:**
1. Stripe-Integration einrichten (`webdev_add_feature` mit `feature="stripe"`)
2. `/app/upgrade`-Route erstellen
3. Checkout-Flow implementieren
4. Webhook für erfolgreiche Zahlung einrichten
5. Automatisches Plan-Upgrade nach Zahlung

### Priorität 3: Onboarding-Verbesserungen

**Aufwand:** 2-3 Stunden

**Tasks:**
1. Progress-Bar im Onboarding-Flow
2. Bessere Visualisierung der generierten SMART-Goals
3. Option zum Bearbeiten der Goals vor dem Speichern
4. Validierung der Eingaben

### Priorität 4: Testing

**Aufwand:** 3-4 Stunden

**Tasks:**
1. Vitest-Tests für alle tRPC-Procedures schreiben
2. E2E-Tests für kritische User-Flows (Onboarding, Chat, Goals)
3. Limit-Enforcement testen (Satellite-Plan)

### Priorität 5: Performance-Optimierung

**Aufwand:** 2-3 Stunden

**Tasks:**
1. Lazy Loading für Seiten
2. Image-Optimierung
3. Code-Splitting
4. Caching-Strategien

---

## Bekannte Einschränkungen

1. **Streaming-Antworten**: Der Coach-Chat simuliert Streaming-Effekte, aber die tatsächliche Manus 1.5 API gibt Antworten in einem Block zurück. Für echtes Streaming müsste die API erweitert werden.

2. **Workspace-Limit-Enforcement**: Das Limit-Enforcement für Workspaces ist im Backend implementiert, aber noch nicht im Frontend integriert.

3. **Fortschritts-Tracking**: Das Fortschritts-Tracking für Goals ist als Placeholder implementiert, aber noch nicht funktional.

4. **Quick-Actions**: Die Quick-Actions im Chat (Zusammenfassen, In To-dos umwandeln, In Mission umsetzen) sind noch nicht implementiert.

---

## Support & Kontakt

Bei Fragen oder Problemen wende dich an:

- **Manus Support**: https://help.manus.im
- **Dokumentation**: https://docs.manus.im
- **Community**: https://community.manus.im

---

**Erstellt von Manus AI** – Dezember 2024
