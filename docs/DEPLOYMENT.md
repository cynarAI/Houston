# Automatisiertes & Effizientes Deployment für Houston

Dieses Dokument beschreibt das neue, optimierte Deployment-System für die Houston App. Das System ist darauf ausgelegt, Deployments schneller, ressourcenschonender und flexibler zu gestalten.

## ⚠️ WICHTIG: Permanentes Deployment & Datenintegrität

**Die Houston App wird von echten Nutzern verwendet.** Daher ist es kritisch, dass:

1. **Deployments sind permanent** - nicht temporär. Die Seite muss dauerhaft verfügbar sein.
2. **Keine Datenverluste** - Bei jedem Deployment müssen alle Nutzerdaten erhalten bleiben:
   - Nutzerkonten und Authentifizierung
   - Credits und Transaktionen
   - Chat-Sessions und Nachrichten
   - Goals, Todos, Strategien
   - Onboarding-Daten
   - Content Library
3. **Datenbankverbindung bleibt erhalten** - Die `DATABASE_URL` Umgebungsvariable muss bei jedem Deployment erhalten bleiben und darf nicht überschrieben werden.

## Übersicht

Das neue System bietet zwei primäre Methoden für das Deployment:

1. **Automatisches Deployment via Git Push**: Jeder Push auf den `main`-Branch löst automatisch einen Build- und Deployment-Prozess über GitHub Actions aus.

2. **Manuelles Deployment aus der lokalen Entwicklungsumgebung** (z.B. Cursor, VS Code): Ein Skript ermöglicht es Ihnen, ein Deployment direkt von Ihrem lokalen Rechner aus zu starten.

Beide Methoden sind effizienter, da der rechenintensive Build-Prozess in GitHub Actions oder lokal stattfindet und nicht mehr auf dem Manus-Agenten. Der Manus-Agent wird nur noch für die finale Veröffentlichung der bereits gebauten App verwendet.

---

## 1. Automatisches Deployment (GitHub Actions)

Der Prozess wird durch die Workflow-Datei `.github/workflows/optimized-ci.yml` gesteuert.

### Funktionsweise

1. **Trigger**: Ein `git push` auf den `main` oder `develop` Branch startet den Workflow.

2. **Build-Job**: Der `build`-Job wird ausgeführt.
   - Die `pnpm` Dependencies werden aus dem Cache geladen (falls vorhanden), was die Installationszeit drastisch reduziert.
   - Die Anwendung wird mit `pnpm build` gebaut.
   - Die gebauten Artefakte im `dist`-Verzeichnis werden für den nächsten Job zwischengespeichert.

3. **Deploy-Job**: Wenn der `build`-Job erfolgreich war und der Push auf den `main`-Branch erfolgte, startet der `deploy`-Job.
   - Die gebauten Artefakte werden aus dem Cache geladen.
   - Ein API-Aufruf an die Manus-Plattform startet einen neuen Deployment-Task, der die App auf `houston.manus.space` veröffentlicht.

### Setup

Damit das automatische Deployment funktioniert, müssen Sie einen API-Schlüssel als Secret in Ihrem GitHub-Repository hinterlegen:

1. Gehen Sie zu Ihrem GitHub-Repository.
2. Navigieren Sie zu `Settings` > `Secrets and variables` > `Actions`.
3. Klicken Sie auf `New repository secret`.
4. Nennen Sie das Secret `MANUS_API_KEY`.
5. Fügen Sie Ihren Manus API-Schlüssel als Wert ein.

### Workflow-Details

- **Build-Cache**: pnpm Store wird zwischengespeichert, um Installationszeiten zu reduzieren
- **Artifact-Storage**: Build-Artefakte werden für 7 Tage gespeichert
- **Monitoring**: Der Deployment-Status wird automatisch überwacht
- **Fehlerbehandlung**: Bei Fehlern wird der Workflow gestoppt und eine Fehlermeldung ausgegeben

---

## 2. Manuelles Deployment (Lokal)

Für schnelle Deployments direkt aus Ihrer Entwicklungsumgebung können Sie das `deploy.sh`-Skript verwenden.

### Funktionsweise

Das Skript führt die folgenden Schritte aus:

1. Installiert die Dependencies (`pnpm install`).
2. Baut die Anwendung lokal (`pnpm build`).
3. Startet einen neuen Deployment-Task über die Manus API, genau wie der GitHub Actions Workflow.

### Setup

#### 1. API-Schlüssel als Umgebungsvariable setzen

Das Skript benötigt Ihren Manus API-Schlüssel. Sie können diesen auf zwei Wegen bereitstellen:

**a) Temporär (für die aktuelle Terminalsitzung):**

```bash
export MANUS_API_KEY='ihr-api-schluessel'
```

**b) Permanent (empfohlen):**

Fügen Sie die obige Zeile zu Ihrer Shell-Konfigurationsdatei hinzu (z.B. `~/.zshrc`, `~/.bashrc` oder `~/.bash_profile`) und starten Sie Ihr Terminal neu.

#### 2. Skript ausführbar machen

Führen Sie diesen Befehl einmalig im Terminal aus:

```bash
chmod +x deploy.sh
```

### Verwendung

Nach dem Setup können Sie jederzeit ein Deployment starten, indem Sie das Skript in Ihrem Terminal ausführen:

```bash
./deploy.sh
```

Das Skript zeigt Ihnen:

- Git-Informationen (Branch, Commit, Message)
- Fortschritt des Build-Prozesses
- Task-URL zur Verfolgung des Deployments

### Voraussetzungen

Das Skript benötigt folgende Tools:

- `pnpm` - Package Manager
- `jq` - JSON-Verarbeitung (installieren mit `brew install jq` auf macOS oder `apt-get install jq` auf Linux)
- `curl` - HTTP-Client (meist bereits installiert)

---

## Vergleich: Alt vs. Neu

| Aspekt              | Altes System        | Neues System                   |
| ------------------- | ------------------- | ------------------------------ |
| Build-Ort           | Manus-Agent         | GitHub Actions / Lokal         |
| Build-Zeit          | Langsam (auf Agent) | Schnell (optimiert)            |
| Cache-Nutzung       | Keine               | pnpm Store Cache               |
| Deployment-Zeit     | ~10-15 Minuten      | ~3-5 Minuten                   |
| Ressourcenverbrauch | Hoch (auf Agent)    | Niedrig (nur Veröffentlichung) |
| Flexibilität        | Nur via Git Push    | Git Push + Lokales Skript      |

---

## Troubleshooting

### GitHub Actions Deployment schlägt fehl

**Problem**: `MANUS_API_KEY secret is not set!`

**Lösung**: Stellen Sie sicher, dass das Secret `MANUS_API_KEY` in den GitHub Repository Settings korrekt gesetzt ist.

### Lokales Deployment schlägt fehl

**Problem**: `MANUS_API_KEY Umgebungsvariable ist nicht gesetzt!`

**Lösung**: Setzen Sie die Umgebungsvariable wie im Setup beschrieben.

**Problem**: `jq ist nicht installiert!`

**Lösung**: Installieren Sie jq:

- macOS: `brew install jq`
- Linux: `apt-get install jq` oder `yum install jq`
- Windows: Nutzen Sie WSL oder installieren Sie jq über Chocolatey

### Build schlägt fehl

**Problem**: Build-Prozess schlägt mit Fehlern fehl

**Lösung**:

1. Prüfen Sie die Fehlermeldungen im Terminal/GitHub Actions Log
2. Stellen Sie sicher, dass alle Dependencies installiert sind: `pnpm install`
3. Prüfen Sie die TypeScript-Fehler: `pnpm check`

---

## Best Practices

1. **Vor dem Deployment testen**: Führen Sie `pnpm test` und `pnpm build` lokal aus, bevor Sie pushen
2. **Commit-Messages**: Verwenden Sie aussagekräftige Commit-Messages, da diese im Deployment-Log erscheinen
3. **Branch-Strategie**: Deployments erfolgen nur vom `main`-Branch
4. **Monitoring**: Überwachen Sie den Deployment-Status über die Task-URL

---

## Weitere Informationen

- [GitHub Actions Dokumentation](https://docs.github.com/en/actions)
- [Manus API Dokumentation](https://docs.manus.im)
- [Houston README](../README.md)
