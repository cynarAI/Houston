# Houston Cursor Rules - Übersicht

Dieses Dokument beschreibt das Cursor Rules System für das Houston-Projekt.

## Was sind Cursor Rules?

Cursor Rules sind `.mdc` Dateien im `.cursor/rules/` Verzeichnis, die dem AI-Assistenten Kontext über das Projekt geben. Sie definieren:

- Architektur und Tech Stack
- Code-Konventionen und Patterns
- Domain-spezifisches Wissen
- Do's und Don'ts

## Rule-Dateien

### Übersicht

| Datei                  | Zweck                      | Aktivierung                        |
| ---------------------- | -------------------------- | ---------------------------------- |
| `000-instructions.mdc` | Index & globale AI-Regeln  | Always (immer aktiv)               |
| `001-core-houston.mdc` | Projekt-Kern & Tech Stack  | Always                             |
| `010-frontend.mdc`     | React/Vite/shadcn Patterns | Auto bei `client/**`               |
| `020-backend.mdc`      | tRPC/Drizzle/Credits       | Auto bei `server/**`, `drizzle/**` |
| `030-testing.mdc`      | Vitest/Playwright          | Auto bei `**/*.test.ts`, `e2e/**`  |
| `040-ux-copy.mdc`      | i18n & Copy Guidelines     | Auto bei `locales/**`, `pages/**`  |

### Rule-Typen

- **Always**: Wird bei jeder Interaktion geladen
- **Auto**: Wird automatisch geladen, wenn Dateien im Glob-Pattern geöffnet sind
- **Agent**: Wird nur bei Agent-Mode Interaktionen geladen
- **Manual**: Muss manuell referenziert werden (z.B. via `@rules/rulename`)

## Wie funktioniert es?

1. **Always-Rules** (`000-instructions.mdc`, `001-core-houston.mdc`) sind immer im Kontext
2. **Auto-Rules** werden basierend auf den geöffneten Dateien geladen:
   - `client/src/pages/Goals.tsx` offen → `010-frontend.mdc` und `040-ux-copy.mdc` werden geladen
   - `server/routers/chat.ts` offen → `020-backend.mdc` wird geladen
3. Der AI-Assistent nutzt diese Regeln, um kontextbezogene Hilfe zu geben

## Erweiterung der Rules

### Neue Rule hinzufügen

1. Datei in `.cursor/rules/` erstellen
2. YAML Frontmatter hinzufügen:
   ```yaml
   ---
   name: Meine Rule
   description: Kurze Beschreibung
   ruleType: Auto # oder Always, Agent, Manual
   globs:
     - "mein/pfad/**"
   ---
   ```
3. Inhalt in Markdown schreiben

### Bestehende Rule erweitern

1. Relevante `.mdc` Datei öffnen
2. Neuen Inhalt hinzufügen
3. Darauf achten, dass die Datei nicht zu lang wird (max ~400-500 Zeilen empfohlen)

### Best Practices für Rules

- **Fokussiert**: Eine Rule pro Themenbereich
- **Konkret**: Beispiele und Code-Snippets statt nur Beschreibungen
- **Aktuell**: Bei Architektur-Änderungen Rules updaten
- **Scanbar**: Überschriften, Listen, Tabellen für schnelles Erfassen

## Wichtige Inhalte

### Credit System (KRITISCH)

Die Rules betonen, dass **alle Credit-Operationen über `CreditService` laufen müssen**:

```typescript
// RICHTIG
await CreditService.charge(userId, "FEATURE_KEY", cost);

// FALSCH - niemals direkt DB-Updates
await db.update(users).set({ credits: newBalance });
```

Dies ist in `020-backend.mdc` dokumentiert.

### TypeScript-First

Alle Rules betonen TypeScript:

- Keine `any` ohne guten Grund
- Drizzle-generierte Typen für DB-Entitäten
- tRPC für type-safe APIs

### i18n

Alle User-facing Texte müssen lokalisiert sein:

```tsx
const { t } = useTranslation();
return <h1>{t("dashboard.title")}</h1>;
```

Siehe `040-ux-copy.mdc` für Details.

## Wartung

### Wann Rules updaten?

- Bei Einführung neuer Patterns oder Technologien
- Wenn bestehende Konventionen sich ändern
- Nach größeren Refactorings
- Wenn AI-Assistent wiederholt falsche Annahmen macht

### Validierung

Prüfe regelmäßig:

- [ ] Sind alle Rules noch aktuell?
- [ ] Stimmen die Globs noch mit der Projektstruktur überein?
- [ ] Gibt es Widersprüche zwischen Rules?
- [ ] Sind die wichtigsten Patterns dokumentiert?

## Referenzen

- [Cursor Rules Dokumentation](https://docs.cursor.com/context/rules)
- Projektarchitektur: `docs/architecture/architecture.md`
- Credit System: `docs/features/CREDIT_SYSTEM_DESIGN.md`
