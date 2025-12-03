# Houston Analytics Events

Dieses Dokument beschreibt alle Analytics-Events, die in Houston getrackt werden, sowie deren Verwendung und KPI-Definitionen.

## Übersicht

Houston nutzt ein Event-basiertes Analytics-System mit:

- **Plausible Analytics** für Produktion
- **Console-Logging** für Entwicklung/Debugging

### Konfiguration

| Env Variable            | Beschreibung                                          |
| ----------------------- | ----------------------------------------------------- |
| `VITE_PLAUSIBLE_DOMAIN` | Plausible Domain (z.B. `houston.aistronaut.io`)       |
| `VITE_ANALYTICS_DEBUG`  | `"true"` aktiviert Console-Logging auch in Produktion |

---

## Event-Kategorien

### 1. Authentication Events

| Event       | Beschreibung              | Properties        |
| ----------- | ------------------------- | ----------------- |
| `signed_up` | User hat sich registriert | `method?: string` |
| `login`     | User hat sich eingeloggt  | `method?: string` |
| `logout`    | User hat sich ausgeloggt  | -                 |

**Verwendung:**

```typescript
import { trackEvent, AnalyticsEvents } from "@/lib/analytics";

trackEvent(AnalyticsEvents.SIGNED_UP, { method: "email" });
trackEvent(AnalyticsEvents.LOGIN, { method: "google" });
```

---

### 2. Onboarding Events

| Event                       | Beschreibung                         | Properties                           |
| --------------------------- | ------------------------------------ | ------------------------------------ |
| `onboarding_started`        | User startet Onboarding              | -                                    |
| `onboarding_step_completed` | Onboarding-Schritt abgeschlossen     | `step: number`, `step_name?: string` |
| `onboarding_completed`      | Onboarding vollständig abgeschlossen | `duration_seconds?: number`          |

**Verwendung:**

```typescript
trackEvent(AnalyticsEvents.ONBOARDING_STARTED);
trackEvent(AnalyticsEvents.ONBOARDING_STEP_COMPLETED, {
  step: 2,
  step_name: "questions",
});
trackEvent(AnalyticsEvents.ONBOARDING_COMPLETED, { duration_seconds: 180 });
```

---

### 3. Goal Events

| Event          | Beschreibung        | Properties                                              |
| -------------- | ------------------- | ------------------------------------------------------- |
| `goal_created` | Neues Ziel erstellt | `is_first_goal?: boolean`, `has_smart_fields?: boolean` |
| `goal_updated` | Ziel bearbeitet     | `goal_id?: number`                                      |
| `goal_deleted` | Ziel gelöscht       | `goal_id?: number`                                      |

**Verwendung:**

```typescript
trackEvent(AnalyticsEvents.GOAL_CREATED, {
  is_first_goal: true,
  has_smart_fields: true,
});
trackEvent(AnalyticsEvents.GOAL_UPDATED, { goal_id: 42 });
trackEvent(AnalyticsEvents.GOAL_DELETED, { goal_id: 42 });
```

---

### 4. Strategy Events

| Event            | Beschreibung          | Properties                                              |
| ---------------- | --------------------- | ------------------------------------------------------- |
| `strategy_saved` | Strategie gespeichert | `is_first_strategy?: boolean`, `fields_filled?: number` |

**Verwendung:**

```typescript
trackEvent(AnalyticsEvents.STRATEGY_SAVED, {
  is_first_strategy: true,
  fields_filled: 4,
});
```

---

### 5. Chat Events

| Event                 | Beschreibung            | Properties                                                       |
| --------------------- | ----------------------- | ---------------------------------------------------------------- |
| `chat_started`        | Neuer Chat erstellt     | `is_first_chat?: boolean`                                        |
| `message_sent`        | Nachricht gesendet      | `message_length?: number`, `session_id?: number`                 |
| `message_feedback`    | Feedback auf AI-Antwort | `feedback_type: "positive" \| "negative"`, `message_id?: number` |
| `message_copied`      | Nachricht kopiert       | `message_id?: number`                                            |
| `message_regenerated` | Antwort neu generiert   | `message_id?: number`                                            |

**Verwendung:**

```typescript
trackEvent(AnalyticsEvents.CHAT_STARTED, { is_first_chat: true });
trackEvent(AnalyticsEvents.MESSAGE_SENT, {
  message_length: 150,
  session_id: 1,
});
trackEvent(AnalyticsEvents.MESSAGE_FEEDBACK, {
  feedback_type: "positive",
  message_id: 123,
});
```

---

### 6. Todo Events

| Event            | Beschreibung         | Properties                                    |
| ---------------- | -------------------- | --------------------------------------------- |
| `todo_created`   | Neues To-do erstellt | `priority?: string`, `has_due_date?: boolean` |
| `todo_completed` | To-do abgeschlossen  | `todo_id?: number`                            |
| `todo_deleted`   | To-do gelöscht       | `todo_id?: number`                            |

**Verwendung:**

```typescript
trackEvent(AnalyticsEvents.TODO_CREATED, {
  priority: "high",
  has_due_date: true,
});
trackEvent(AnalyticsEvents.TODO_COMPLETED, { todo_id: 42 });
```

---

### 7. Credits & Purchase Events

| Event               | Beschreibung         | Properties                                                   |
| ------------------- | -------------------- | ------------------------------------------------------------ |
| `credits_purchased` | Credits/Plan gekauft | `product_key: string`, `amount?: number`, `credits?: number` |
| `plan_upgraded`     | Plan gewechselt      | `plan_key: string`, `from_plan?: string`                     |

**Verwendung:**

```typescript
trackEvent(AnalyticsEvents.CREDITS_PURCHASED, {
  product_key: "orbit_pack",
  credits: 100,
});
trackEvent(AnalyticsEvents.PLAN_UPGRADED, {
  plan_key: "galaxy_pack",
  from_plan: "orbit_pack",
});
```

---

### 8. AI Feature Events

| Event                | Beschreibung          | Properties              |
| -------------------- | --------------------- | ----------------------- |
| `insights_generated` | AI Insights generiert | `workspace_id?: number` |

**Verwendung:**

```typescript
trackEvent(AnalyticsEvents.INSIGHTS_GENERATED, { workspace_id: 1 });
```

---

### 9. Export Events

| Event          | Beschreibung   | Properties                                         |
| -------------- | -------------- | -------------------------------------------------- |
| `pdf_exported` | PDF exportiert | `type: "chat" \| "goals" \| "strategy" \| "todos"` |

**Verwendung:**

```typescript
trackEvent(AnalyticsEvents.PDF_EXPORTED, { type: "goals" });
```

---

### 10. Navigation & Engagement Events

| Event          | Beschreibung     | Properties                            |
| -------------- | ---------------- | ------------------------------------- |
| `page_viewed`  | Seite aufgerufen | `page: string`, `referrer?: string`   |
| `feature_used` | Feature genutzt  | `feature: string`, `context?: string` |

**Verwendung:**

```typescript
trackEvent(AnalyticsEvents.PAGE_VIEWED, { page: "/app/dashboard" });
trackEvent(AnalyticsEvents.FEATURE_USED, {
  feature: "quick_actions",
  context: "chat",
});

// Oder mit Convenience-Funktion:
trackPageView("/app/dashboard");
trackFeatureUsed("quick_actions", "chat");
```

---

## KPI-Definitionen

### Activation KPIs

| KPI                            | Definition                                   | Berechnung                                                                   |
| ------------------------------ | -------------------------------------------- | ---------------------------------------------------------------------------- |
| **Signup-to-Onboarding Rate**  | Anteil der Users, die Onboarding starten     | `onboarding_started / signed_up`                                             |
| **Onboarding Completion Rate** | Anteil der Users, die Onboarding abschließen | `onboarding_completed / onboarding_started`                                  |
| **Time to First Goal**         | Zeit von Signup bis erstes Ziel              | Median der Zeit zwischen `signed_up` und `goal_created (is_first_goal=true)` |

### Engagement KPIs

| KPI                          | Definition                                     | Berechnung                                      |
| ---------------------------- | ---------------------------------------------- | ----------------------------------------------- |
| **Daily Active Users (DAU)** | Unique Users mit `page_viewed` pro Tag         | COUNT(DISTINCT user_id) WHERE event=page_viewed |
| **Messages per Session**     | Durchschnittliche Nachrichten pro Chat-Session | `message_sent / chat_started`                   |
| **Feedback Rate**            | Anteil der Nachrichten mit Feedback            | `message_feedback / message_sent (role=coach)`  |

### Retention KPIs

| KPI                     | Definition                                | Berechnung                                       |
| ----------------------- | ----------------------------------------- | ------------------------------------------------ |
| **D1/D7/D30 Retention** | Users, die nach 1/7/30 Tagen zurückkehren | Users mit `page_viewed` am Tag X / Total Signups |
| **Feature Adoption**    | Anteil der Users, die Feature X nutzen    | Users mit Feature-Event / Total Active Users     |

### Revenue KPIs

| KPI                 | Definition                           | Berechnung                                     |
| ------------------- | ------------------------------------ | ---------------------------------------------- |
| **Conversion Rate** | Free Users, die zu Paid konvertieren | `credits_purchased (unique users) / signed_up` |
| **ARPU**            | Average Revenue Per User             | Total Revenue / Active Users                   |

---

## Best Practices

### 1. Event Naming

- Verwende `snake_case` für Event-Namen
- Nutze Verben für Aktionen: `created`, `updated`, `deleted`, `sent`
- Sei konsistent: `goal_created`, `todo_created`, `chat_started`

### 2. Properties

- Halte Properties minimal und relevant
- Nutze `is_first_*` Flags für First-Time-Events
- Vermeide PII (Personally Identifiable Information)

### 3. Wann tracken?

- **Nach erfolgreicher Aktion:** Track nach dem API-Call, nicht vorher
- **User-initiierte Aktionen:** Track Klicks, nicht automatische Prozesse
- **Wichtige Meilensteine:** First Goal, Onboarding Complete, etc.

### 4. Debugging

Im Development werden alle Events in der Console geloggt:

```
[Analytics] goal_created { is_first_goal: true, has_smart_fields: true }
```

Aktiviere Debug-Modus in Production mit `VITE_ANALYTICS_DEBUG=true`.

---

## Implementierung

Die Analytics-Utility befindet sich in `client/src/lib/analytics.ts`.

### Neue Events hinzufügen

1. Event zum `AnalyticsEvents` Objekt hinzufügen
2. Properties-Interface in `EventProperties` definieren
3. `trackEvent` an der entsprechenden Stelle aufrufen
4. Dokumentation hier aktualisieren

```typescript
// 1. Event definieren
export const AnalyticsEvents = {
  // ...
  NEW_EVENT: "new_event",
} as const;

// 2. Properties definieren
export interface EventProperties {
  // ...
  new_event: { some_prop: string };
}

// 3. Event tracken
trackEvent(AnalyticsEvents.NEW_EVENT, { some_prop: "value" });
```

---

## Datenschutz

- Keine personenbezogenen Daten (E-Mail, Name) in Events
- IDs sind nur interne References, keine User-IDs in Plausible
- Plausible ist GDPR-konform und cookieless
