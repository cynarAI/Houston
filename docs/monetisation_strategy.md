# Houston Monetisation Strategy

> Dokumentation der Monetarisierungsstrategie für Houston AI Marketing Coach.
> Zielgruppe: KMU (Kleine und mittlere Unternehmen), Solo-Marketer, Marketing-Agenturen.

---

## 1. Credit-System Übersicht

Houston nutzt ein transparentes Credit-System für alle Premium-Features.

### 1.1 Kostenlose Features (0 Credits)

- Chat-Nachrichten mit Houston
- Inhalte ansehen (Ziele, Todos, Strategie)
- Dashboard-Navigation
- Einstellungen verwalten

### 1.2 Credit-Kosten nach Feature

| Feature               | Credits | Beschreibung                                    |
| --------------------- | ------- | ----------------------------------------------- |
| Chat-Nachrichten      | 0       | Unbegrenzt kostenlos                            |
| Tiefenanalyse im Chat | 3       | Detaillierte Marketing-Analyse                  |
| PDF-Export            | 2       | Ziele, Chats oder Strategie exportieren         |
| KI-Empfehlungen       | 3       | Dashboard-Insights und Empfehlungen             |
| Ziele generieren      | 5       | SMART-Ziele aus Nutzereingabe                   |
| Strategie-Analyse     | 8       | Umfassende Marketing-Strategie                  |
| Kampagnen-Plan        | 7       | Kompletter Kampagnen-Blueprint                  |
| Marketing-Audit       | 15      | Tiefgehende Analyse aller Marketing-Aktivitäten |
| Wettbewerbs-Analyse   | 12      | Detaillierte Konkurrenzanalyse                  |
| Content-Kalender      | 10      | 30-Tage Content-Kalender                        |

---

## 2. Paketstruktur

### 2.1 Starter (Kostenlos)

- **Credits:** 50 (einmalig)
- **Zielgruppe:** Neugierige, erste Tester
- **Use-Case:** Houston ausprobieren, erste Strategie entwickeln
- **Kommunikation:** "Perfekt zum Ausprobieren – keine Kreditkarte nötig"

### 2.2 Solo Plan (€9,99/Monat)

- **Credits:** 100/Monat
- **Zielgruppe:** Solo-Marketer, kleine Unternehmen
- **Use-Case:** 2-3 Marketing-Projekte pro Monat
- **Kommunikation:** "Ideal für Solo-Marketer und kleine Teams"
- **Badge:** "Empfohlen"

### 2.3 Team Plan (€39,99/Monat)

- **Credits:** 500/Monat
- **Zielgruppe:** Agenturen, wachsende Teams
- **Use-Case:** Viele parallele Kampagnen, mehrere Kunden
- **Kommunikation:** "Perfekt für Agenturen und wachsende Teams"

### 2.4 Credit-Booster (Einmalzahlungen)

| Booster | Credits | Preis  | €/Credit | Badge           |
| ------- | ------- | ------ | -------- | --------------- |
| Mini    | 50      | €5,99  | €0,12    | -               |
| Power   | 150     | €14,99 | €0,10    | -               |
| Mega    | 300     | €24,99 | €0,08    | Beste Ersparnis |

**Wichtig:** Gekaufte Credits verfallen nicht.

---

## 3. Upsell-Momente im Produkt

### 3.1 Dashboard Credit-Banner

**Trigger:** Credits < 20
**Komponente:** `CreditBanner.tsx`
**Verhalten:**

- Zeigt sanften Hinweis auf niedriges Guthaben
- CTAs: "Schnell aufladen" und "Pläne ansehen"
- Kann dismissed werden (24h localStorage)
- Keine aggressive Kommunikation

### 3.2 Low-Credits-Dialog

**Trigger:** Bei Feature-Nutzung, wenn Credits nicht ausreichen
**Komponente:** `LowCreditsDialog.tsx`
**Verhalten:**

- Zeigt Kosten transparent: "Diese Analyse kostet X Credits, du hast Y"
- 3-Button-Layout:
  1. Schnell-Booster (ab €5,99)
  2. Monatliche Pläne ansehen
  3. Später erinnern / Abbrechen
- Trust-Signale im Footer

### 3.3 Exit-Intent-Popup (Landing Page)

**Trigger:** Maus verlässt Seite nach oben
**Komponente:** `ExitIntentPopup.tsx`
**Verhalten:**

- Erscheint nur 1x pro Session
- Fokus auf kostenlose Starter-Credits (50)
- Keine Discount-Taktiken
- Freundliche, nicht-aggressive Copy

### 3.4 Feature-Credit-Bestätigung

**Trigger:** Vor teuren Features (≥5 Credits)
**Verhalten:**

- Zeigt Kosten vor Ausführung
- "Fortfahren" oder "Abbrechen"
- Optional: "Nicht mehr anzeigen" Checkbox

---

## 4. Conversion-Pfade

### 4.1 Free → Erster Kauf

**Pfad:**

1. User registriert sich → erhält 50 Credits
2. User nutzt Features, verbraucht Credits
3. CreditBanner erscheint bei <20 Credits
4. Bei 0 Credits: LowCreditsDialog mit Optionen
5. User wählt Booster oder Plan

**Key-Optimierungen:**

- Starter-Credits reichen für ~16 Analysen (guter Wert)
- Klare Kommunikation, wann Credits verbraucht werden
- Sanfte Erinnerungen statt Hard-Blocks

### 4.2 Booster → Abo

**Pfad:**

1. User kauft Mini-Booster (€5,99)
2. User nutzt weiter, Credits werden knapp
3. Bei erneutem Aufladen: Plan-Vergleich anbieten
4. "Mit dem Solo-Plan sparst du langfristig"

**Key-Optimierungen:**

- Zeige Preis/Credit-Vergleich
- Betone Planbarkeit bei Abos

### 4.3 Inaktiver User → Reaktivierung

**Mögliche Trigger:**

- E-Mail nach 7 Tagen Inaktivität
- Push-Notification (wenn aktiviert)
- "Houston vermisst dich" Messaging

**Key-Optimierungen:**

- Erinnere an offene Ziele/Todos
- Biete kostenlose Ressourcen (Blog, Tipps)
- Kein aggressives Upselling bei Rückkehr

---

## 5. Copy-Guidelines

### 5.1 Ton & Sprache

- **Du-Form:** Immer "du", nie "Sie"
- **Freundlich:** Wie ein hilfreicher Kollege
- **Transparent:** Keine versteckten Kosten
- **Nutzen-fokussiert:** "Damit kannst du..." statt "Das kostet..."

### 5.2 Verbotene Phrasen

- "Limitiertes Angebot"
- "Nur noch heute"
- "Exklusiv für dich"
- Fake-Countdowns
- Übertriebene Urgency

### 5.3 Empfohlene Formulierungen

| Statt                 | Besser                           |
| --------------------- | -------------------------------- |
| "Upgrade jetzt!"      | "Mehr Möglichkeiten entdecken"   |
| "Keine Credits mehr!" | "Dein Guthaben ist aufgebraucht" |
| "Kaufen"              | "Plan wählen" / "Jetzt aufladen" |
| "Abonnieren"          | "Plan wählen"                    |
| "Premium"             | "Mehr Credits" / "Solo Plan"     |

### 5.4 Trust-Signale (immer zeigen)

- ✓ Sichere Zahlung via Stripe
- ✓ Jederzeit kündbar
- ✓ Keine versteckten Kosten
- ✓ Gekaufte Credits verfallen nicht

---

## 6. Komponenten-Übersicht

| Komponente       | Datei                             | Zweck                                   |
| ---------------- | --------------------------------- | --------------------------------------- |
| CreditIndicator  | `components/CreditIndicator.tsx`  | Topbar-Anzeige des Guthabens            |
| CreditBanner     | `components/CreditBanner.tsx`     | Dashboard-Banner bei niedrigen Credits  |
| LowCreditsDialog | `components/LowCreditsDialog.tsx` | Dialog bei Feature-Nutzung ohne Credits |
| Credits-Seite    | `pages/Credits.tsx`               | Haupt-Verwaltung von Plans/Boosters     |
| ExitIntentPopup  | `components/ExitIntentPopup.tsx`  | Landing-Page Exit-Intent                |

---

## 7. Metriken & KPIs

### 7.1 Zu trackende Metriken

- **Activation Rate:** % der User, die 50% der Starter-Credits nutzen
- **Conversion Rate:** Free → Paid (Booster oder Plan)
- **ARPU:** Average Revenue Per User
- **Churn Rate:** Abo-Kündigungen pro Monat
- **Credit-Verbrauch:** Durchschnittliche Credits/User/Monat

### 7.2 Erfolgs-Kriterien

- Activation Rate > 40%
- Free → Paid Conversion > 5%
- Churn Rate < 5%/Monat
- Kein negatives Feedback zu "aggressiver" Monetarisierung

---

## 8. Zukünftige Erweiterungen

### 8.1 Geplant

- [ ] Credit-Rollover (ungenutzte Credits 1 Monat mitnehmen)
- [ ] Team-Features (shared Workspaces)
- [ ] Referral-Bonus-Erweiterung
- [ ] Jahres-Abos mit Rabatt

### 8.2 Möglich

- [ ] Enterprise-Pakete (custom Credit-Pools)
- [ ] API-Zugang mit Credit-basiertem Rate-Limiting
- [ ] Credit-Gifting zwischen Usern
- [ ] Saisonale Promotions (Bonus-Credits)

---

## Änderungshistorie

| Datum      | Änderung                                       | Autor |
| ---------- | ---------------------------------------------- | ----- |
| 2024-12-03 | Initiale Dokumentation erstellt                | AI    |
| -          | Credits-Seite mit Trust-Signalen und Use-Cases | -     |
| -          | LowCreditsDialog mit 3-Button-Layout           | -     |
| -          | CreditBanner für Dashboard                     | -     |
| -          | Landing-Page Pricing auf Deutsch               | -     |
| -          | ExitIntentPopup überarbeitet                   | -     |
