# Spezifischen Commit deployen

## Option 1: Lokales Skript (empfohlen für Commit 126d324)

```bash
# Setze API Key (aus GitHub Secrets)
export MANUS_API_KEY="dein-api-key"

# Deploye Commit 126d324 (Apple-Redesign)
./.github/scripts/deploy-specific-commit.sh 126d324
```

## Option 2: GitHub Actions mit einfachem Prompt

1. Gehe zu: https://github.com/cynarAI/Houston/settings/variables/actions
2. Erstelle neue Variable: `USE_SIMPLE_PROMPT` = `true`
3. Pushe einen neuen Commit (oder triggere Workflow manuell)
4. Der Workflow verwendet dann automatisch den einfachen Prompt

## Option 3: Workflow-Dispatch (noch zu implementieren)

Ein Workflow-Dispatch könnte erstellt werden, der einen spezifischen Commit deployed.

---

## Warum einfacher Prompt?

Der einfache Prompt:

- ✅ Minimale Logik, maximale Klarheit
- ✅ Direktes Finden des Deployment-Verzeichnisses
- ✅ Expliziter Server-Neustart
- ✅ Klare Verifizierung

Der komplexe Prompt:

- ⚠️ Viele Fallbacks und Methoden
- ⚠️ Kann zu Verwirrung führen
- ⚠️ Mehrere mögliche Fehlerquellen
