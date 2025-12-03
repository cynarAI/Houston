# Houston App - Privacy & Data Processing Notes

> **Hinweis:** Dies ist eine technische Dokumentation für Entwickler und dient als Grundlage für die Datenschutzerklärung. Kein rechtlicher Rat.

## 1. Übersicht der verarbeiteten personenbezogenen Daten

### 1.1 Direkt identifizierende Daten

| Datenfeld     | Tabelle | Beschreibung                   | Speicherort     |
| ------------- | ------- | ------------------------------ | --------------- |
| `name`        | `users` | Vollständiger Name des Nutzers | MySQL (Backend) |
| `email`       | `users` | E-Mail-Adresse                 | MySQL (Backend) |
| `openId`      | `users` | OAuth-Identifier von Manus     | MySQL (Backend) |
| `loginMethod` | `users` | Login-Methode (Google, etc.)   | MySQL (Backend) |

### 1.2 Nutzungsdaten

| Datenfeld             | Tabelle | Beschreibung               | Speicherort |
| --------------------- | ------- | -------------------------- | ----------- |
| `credits`             | `users` | Aktuelles Credit-Guthaben  | MySQL       |
| `lifetimeCreditsUsed` | `users` | Gesamt verbrauchte Credits | MySQL       |
| `lastSignedIn`        | `users` | Letzter Login-Zeitpunkt    | MySQL       |
| `referralCode`        | `users` | Eigener Empfehlungscode    | MySQL       |

### 1.3 Business-/Workspace-Daten (können personenbezogen sein)

| Datenfeld        | Tabelle          | Beschreibung               |
| ---------------- | ---------------- | -------------------------- |
| `companyName`    | `onboardingData` | Firmenname                 |
| `website`        | `onboardingData` | Firmenwebsite              |
| `targetAudience` | `workspaces`     | Zielgruppen-Beschreibung   |
| `challenges`     | `workspaces`     | Business-Herausforderungen |

### 1.4 Konversationsdaten

| Datenfeld | Tabelle        | Beschreibung            |
| --------- | -------------- | ----------------------- |
| `content` | `chatMessages` | Chat-Nachrichten mit AI |

**Achtung:** Chat-Inhalte können personenbezogene Daten enthalten, die der Nutzer selbst eingibt.

### 1.5 Zahlungsdaten

| Datenfeld               | Tabelle          | Beschreibung          | Speicherort |
| ----------------------- | ---------------- | --------------------- | ----------- |
| `stripeSessionId`       | `stripePayments` | Stripe Session ID     | MySQL       |
| `stripePaymentIntentId` | `stripePayments` | Stripe Payment Intent | MySQL       |
| `amount`                | `stripePayments` | Zahlungsbetrag        | MySQL       |

**Hinweis:** Kreditkartendaten werden NICHT in Houston gespeichert - diese verbleiben bei Stripe.

## 2. Speicherorte

### 2.1 Backend (MySQL-Datenbank)

Alle Nutzerdaten werden in einer MySQL-Datenbank gespeichert:

- Hosting: Je nach Deployment (z.B. PlanetScale, AWS RDS)
- Verschlüsselung: TLS für Transport, ggf. Encryption at Rest

### 2.2 Frontend (Browser)

**LocalStorage-Einträge (alle nicht-personenbezogen):**

| Key                         | Zweck                 | Personenbezogen |
| --------------------------- | --------------------- | --------------- |
| `theme`                     | Dunkelmodus-Präferenz | Nein            |
| `sidebar-width`             | UI-Einstellung        | Nein            |
| `i18next`                   | Spracheinstellung     | Nein            |
| `todos-view` / `goals-view` | Ansichts-Präferenz    | Nein            |
| `onboarding-completed`      | Onboarding-Status     | Nein            |
| `*-dismissed`               | Banner-Dismiss-Status | Nein            |

**Cookies:**

| Cookie          | Zweck                     | Laufzeit |
| --------------- | ------------------------- | -------- |
| `__session`     | Session-Authentifizierung | 1 Jahr   |
| `sidebar:state` | Sidebar UI-State          | 7 Tage   |

### 2.3 Drittanbieter

| Anbieter                    | Zweck              | Datenkategorien               | GDPR-Status                                |
| --------------------------- | ------------------ | ----------------------------- | ------------------------------------------ |
| **Manus OAuth**             | Authentifizierung  | Name, Email, OpenID           | EU-konform                                 |
| **Stripe**                  | Zahlungsabwicklung | Email, Zahlungsdaten          | EU-US DPF zertifiziert                     |
| **Plausible**               | Web-Analytics      | Anonyme Nutzungsdaten         | EU-basiert, privacy-focused, keine Cookies |
| **Sentry**                  | Error-Tracking     | IP (anonymisiert), Error-Logs | EU-Rechenzentrum möglich                   |
| **Google Maps** (via Proxy) | Kartenansicht      | Keine Nutzerdaten             | Über Proxy anonymisiert                    |

## 3. Technische GDPR-Maßnahmen

### 3.1 Recht auf Löschung (Art. 17)

**Implementiert in:** `server/routers/account.ts`

```
POST /api/trpc/account.deleteAccount
```

- Löscht User-Datensatz
- CASCADE löscht automatisch:
  - Alle Workspaces
  - Alle Goals, Todos, Strategies
  - Alle Chat Sessions und Messages
  - Alle Credit Transactions
  - Alle Plan Limits
  - Alle Onboarding Data
  - Alle Notifications
  - Alle Referrals

### 3.2 Recht auf Datenportabilität (Art. 20)

**Implementiert in:** `server/routers/account.ts`

```
POST /api/trpc/account.exportAllData
```

Exportiert alle Nutzerdaten als strukturiertes JSON:

- User-Profil
- Workspaces
- Goals, Todos, Strategies
- Chat-Verlauf
- Credit-Transaktionen
- Onboarding-Daten

### 3.3 Datensparsamkeit

- **Keine** Speicherung von Kreditkartendaten (Stripe)
- **Keine** Speicherung von User-Daten im localStorage
- **Keine** IP-Adressen in Logs (außer Sentry, anonymisiert)
- Plausible Analytics: Cookie-frei, keine personenbezogenen Daten

## 4. Hinweise für die Datenschutzerklärung

Die Datenschutzerklärung muss folgende Punkte abdecken:

### 4.1 Verantwortlicher

- Name und Kontaktdaten des Betreibers

### 4.2 Verarbeitete Daten

- Account-Daten (Name, E-Mail)
- Nutzungsdaten (Credits, Login-Zeiten)
- Business-Daten (Workspace-Inhalte)
- Chat-Inhalte (KI-Konversationen)
- Zahlungsdaten (über Stripe)

### 4.3 Rechtsgrundlagen

- Art. 6 (1) b DSGVO - Vertragserfüllung (Account, Credits)
- Art. 6 (1) a DSGVO - Einwilligung (Marketing-Emails, falls implementiert)
- Art. 6 (1) f DSGVO - Berechtigtes Interesse (Analytics, Sicherheit)

### 4.4 Drittanbieter (Auftragsverarbeiter)

| Anbieter  | Sitz   | Zweck          | Datenschutz-Link             |
| --------- | ------ | -------------- | ---------------------------- |
| Manus     | -      | OAuth          | [Link]                       |
| Stripe    | USA/EU | Zahlungen      | https://stripe.com/privacy   |
| Plausible | EU     | Analytics      | https://plausible.io/privacy |
| Sentry    | USA/EU | Error-Tracking | https://sentry.io/privacy/   |

### 4.5 Speicherdauer

- Account-Daten: Bis zur Löschung durch Nutzer
- Chat-Verlauf: Bis zur Löschung durch Nutzer
- Zahlungsdaten: Gesetzliche Aufbewahrungspflicht (10 Jahre)
- Analytics: 24 Monate (Plausible Standard)

### 4.6 Betroffenenrechte

- Auskunft (Art. 15) - Via Settings-Seite (Datenexport)
- Berichtigung (Art. 16) - Via Manus OAuth
- Löschung (Art. 17) - Via Settings-Seite
- Datenübertragbarkeit (Art. 20) - Via Settings-Seite (JSON-Export)
- Widerspruch (Art. 21) - Support-Kontakt

### 4.7 Cookies

- Technisch notwendig: Session-Cookie (`__session`)
- Keine Marketing-Cookies
- Keine Tracking-Cookies (Plausible ist cookie-frei)

## 5. Offene Punkte / TODOs

- [ ] Cookie-Banner für Session-Cookie implementieren (optional, da technisch notwendig)
- [ ] Consent-Management für Marketing-Emails (wenn implementiert)
- [ ] Auftragsverarbeitungsverträge (AVV) mit allen Drittanbietern prüfen
- [ ] Datenschutz-Folgenabschätzung (DSFA) für KI-Verarbeitung erwägen
- [ ] Verfahrensverzeichnis erstellen

---

_Letzte Aktualisierung: Dezember 2024_
