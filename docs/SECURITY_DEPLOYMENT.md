# Deployment Sicherheitsprüfung

## ✅ Aktuelle Sicherheitsprüfung (Stand: 2024-12-03)

### 1. Deployment-Skripte

#### `deploy.sh`

- ✅ **Berechtigungen**: `rwxr-xr-x` (ausführbar für alle, lesbar für alle)
- ✅ **Keine hardcodierten Secrets**: API Key wird nur aus Umgebungsvariable gelesen
- ✅ **Validierung**: Prüft ob `MANUS_API_KEY` gesetzt ist
- ⚠️ **Hinweis**: Skript ist für alle lesbar (normal für ein Deployment-Skript)

#### GitHub Actions Workflows

- ✅ **optimized-ci.yml**: Aktiv, verwendet `secrets.MANUS_API_KEY`
- ✅ **deploy.yml**: Deaktiviert (nur `workflow_dispatch` möglich)
- ✅ **ci.yml**: Keine Deployment-Funktion

### 2. API Key Verwendung

#### Lokale Umgebung

- ✅ API Key wird aus Umgebungsvariable `MANUS_API_KEY` gelesen
- ✅ Keine hardcodierten Keys im Repository
- ✅ `.env` Dateien sind in `.gitignore` ausgeschlossen

#### GitHub Secrets

- ⚠️ **Zu prüfen**: Repository-Einstellungen für Secrets-Zugriff
- ✅ Workflows verwenden `${{ secrets.MANUS_API_KEY }}` korrekt

### 3. Repository-Sicherheit

#### Git History

- ✅ Keine API Keys in der Git-History gefunden
- ✅ Keine hardcodierten Secrets in Code-Dateien

#### Dateiberechtigungen

- ✅ `deploy.sh`: Ausführbar, aber kein Sicherheitsrisiko (keine Secrets enthalten)

## 🔒 Empfohlene Sicherheitsmaßnahmen

### GitHub Repository-Einstellungen

#### 1. Secrets-Zugriff einschränken

**Zu prüfen in GitHub:**

1. Gehen Sie zu: `Settings` > `Secrets and variables` > `Actions`
2. Prüfen Sie die **"Access"** Einstellungen für `MANUS_API_KEY`:
   - Sollte nur für **"All workflows"** oder spezifische Workflows verfügbar sein
   - **NICHT** für Fork-Pull-Requests verfügbar machen

#### 2. Workflow-Berechtigungen einschränken

**In `.github/workflows/optimized-ci.yml` hinzufügen:**

```yaml
permissions:
  contents: read
  actions: read
  # Keine write-Berechtigungen für Repository
```

#### 3. Branch-Schutz aktivieren

**Empfohlene Einstellungen für `main` Branch:**

- ✅ Require pull request reviews before merging
- ✅ Require status checks to pass before merging
- ✅ Require branches to be up to date before merging
- ✅ Do not allow bypassing the above settings
- ✅ Restrict who can push to matching branches (nur Sie)

#### 4. Workflow-Trigger einschränken

**Aktuell:**

- ✅ `optimized-ci.yml`: Läuft nur auf `main` und `develop` Branches
- ✅ Deploy-Job läuft nur auf `main` Branch
- ✅ Keine Deployment bei Pull Requests

**Zusätzliche Sicherheit:**

- Workflow kann manuell mit `workflow_dispatch` ausgelöst werden
- Prüfen Sie, wer `workflow_dispatch` verwenden kann (Repository-Einstellungen)

### Lokale Umgebung

#### 1. Umgebungsvariable schützen

**Empfohlen:**

```bash
# Statt in ~/.zshrc (lesbar für alle Prozesse)
# Verwenden Sie einen sicheren Speicherort:

# macOS Keychain (empfohlen)
security add-generic-password -a "$USER" -s "MANUS_API_KEY" -w "your-api-key"

# Oder: Nur für aktuelle Session
export MANUS_API_KEY='your-api-key'
```

#### 2. Skript-Berechtigungen

**Aktuell:** `rwxr-xr-x` (ausführbar für alle)

- ✅ **OK**: Skript enthält keine Secrets
- ⚠️ **Optional**: Könnte auf `rwx------` (nur Owner) gesetzt werden

```bash
chmod 700 deploy.sh  # Nur Sie können ausführen
```

### API Key im Prompt

**Aktueller Status:**

- ⚠️ API Key wird im Prompt an den Manus Agent übergeben
- ⚠️ Der Prompt wird in GitHub Actions Logs sichtbar sein

**Empfehlung:**

- ✅ GitHub Actions maskiert automatisch Secrets in Logs
- ⚠️ Aber: Der Prompt wird trotzdem an den Agent gesendet
- ✅ **OK**: Der Agent benötigt den Key für die Publish-Funktion

## 📋 Checkliste für maximale Sicherheit

### GitHub Repository

- [ ] Secrets-Zugriff auf "All workflows" beschränkt
- [ ] Secrets NICHT für Fork-PR verfügbar
- [ ] Branch-Schutz für `main` aktiviert
- [ ] Workflow-Berechtigungen auf `read` beschränkt
- [ ] Nur autorisierte Personen können `workflow_dispatch` verwenden

### Lokale Umgebung

- [ ] API Key nicht in `~/.zshrc` gespeichert (oder verschlüsselt)
- [ ] `deploy.sh` Berechtigungen auf `700` gesetzt (optional)
- [ ] Keine API Keys in Git committed

### Monitoring

- [ ] GitHub Actions Logs regelmäßig prüfen
- [ ] Ungewöhnliche Deployment-Aktivitäten überwachen
- [ ] Manus API Key Rotation planen (falls möglich)

## 🚨 Was zu tun ist, wenn ein Key kompromittiert wurde

1. **Sofort**: Neuen API Key in Manus generieren
2. **GitHub**: Alten Secret löschen, neuen Secret hinzufügen
3. **Lokal**: Umgebungsvariable aktualisieren
4. **Prüfen**: GitHub Actions Logs auf ungewöhnliche Aktivitäten
5. **Rotieren**: Alle betroffenen Credentials

## 📝 Notizen

- Der API Key wird aktuell im Prompt übergeben, damit der Agent die Publish-Funktion nutzen kann
- GitHub Actions maskiert Secrets automatisch in Logs (aber nicht im Prompt-Text)
- `deploy.sh` ist öffentlich lesbar, enthält aber keine Secrets (nur Umgebungsvariable)
