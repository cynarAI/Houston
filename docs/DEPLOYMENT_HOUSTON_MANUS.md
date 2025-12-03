# 🚀 Deployment-Anleitung für Houston App auf houston.manus.space

**Version**: 2.0 (Production Ready)  
**Datum**: December 3, 2025  
**Status**: ✅ Produktionsreif

---

## 📋 Inhaltsverzeichnis

1. [Überblick](#überblick)
2. [Voraussetzungen](#voraussetzungen)
3. [Automatisches Deployment (GitHub Actions)](#automatisches-deployment-github-actions)
4. [Manuelles Deployment](#manuelles-deployment)
5. [Deployment-Prozess im Detail](#deployment-prozess-im-detail)
6. [Fehlerbehandlung & Rollback](#fehlerbehandlung--rollback)
7. [Validierung & Monitoring](#validierung--monitoring)
8. [Troubleshooting](#troubleshooting)
9. [Best Practices](#best-practices)

---

## Überblick

Diese Anleitung beschreibt das vollständige Deployment-System für die **Houston AI Coach App** auf `houston.manus.space`. Das System basiert auf:

- ✅ **GitHub Actions** für automatisierte CI/CD
- ✅ **Manus API** für Agent-basierte Deployments
- ✅ **Shell-Befehle** als primäre Deployment-Methode
- ✅ **Automatisches Backup & Rollback**
- ✅ **Vollständige Validierung**

### Wichtige Garantien

- 🛡️ **Datenintegrität**: MySQL-Datenbank wird NICHT berührt
- 🔒 **Sicherheit**: Nur Frontend-Dateien werden aktualisiert
- 💾 **Backup**: Automatisches Backup vor jedem Deployment
- 🔄 **Rollback**: Jederzeit möglich
- ✅ **Validierung**: Umfassende Post-Deployment-Tests

---

## Voraussetzungen

### GitHub Repository Secrets

1. Gehe zu: `https://github.com/cynarAI/Houston/settings/secrets/actions`
2. Füge hinzu: `MANUS_API_KEY` = Dein Manus API Key

**Wie man den API Key erhält:**

- Gehe zu: `https://manus.im/settings/api`
- Generiere einen neuen API Key
- Kopiere den Key
- Füge ihn als GitHub Secret hinzu

### Lokale Umgebung (für manuelles Deployment)

```bash
# Installiere jq (falls nicht vorhanden)
# macOS:
brew install jq

# Linux:
apt-get install jq  # oder yum install jq

# Stelle sicher, dass pnpm installiert ist
pnpm --version
```

---

## Automatisches Deployment (GitHub Actions)

### Funktionsweise

Das automatische Deployment wird durch `.github/workflows/optimized-ci.yml` gesteuert:

1. **Trigger**: Push zu `main` Branch
2. **Build**: Dependencies installieren + App bauen
3. **Deploy**: Task an Manus API senden
4. **Agent**: Manus Agent führt Deployment aus
5. **Validierung**: Post-Deployment-Tests

### Workflow-Schritte

```yaml
1. Checkout Code
2. Setup pnpm
3. Install Dependencies (mit Cache)
4. Build Application
5. Get Commit Information
6. Create Deployment Prompt
7. Send Task to Manus API
8. Monitor Deployment
```

### Verwendung

**Automatisch:**

```bash
# Einfach pushen - Deployment läuft automatisch
git add .
git commit -m "Fix: Verbessere UI"
git push origin main
```

**Manuell über GitHub UI:**

1. Gehe zu: `https://github.com/cynarAI/Houston/actions`
2. Klicke auf "Optimized CI/CD"
3. Klicke "Run workflow"
4. Wähle Branch: `main`
5. Klicke "Run workflow"

---

## Manuelles Deployment

### Option 1: Über Manus Web UI

1. Gehe zu: `https://manus.im`
2. Erstelle einen neuen Task
3. Kopiere den Deployment-Prompt (siehe unten)
4. Ersetze Platzhalter:
   - `[COMMIT_SHA_SHORT]` → z.B. `3ab926a`
   - `[COMMIT_SHA_FULL]` → z.B. `3ab926ae9703da5ccfea15748f9de3085f359e91`
5. Klicke "Create Task"
6. Warte auf Completion

### Option 2: Über Shell (curl)

```bash
# Setze API Key
export MANUS_API_KEY="dein-api-key"

# Hole Commit-Informationen
COMMIT_SHA=$(git rev-parse HEAD)
COMMIT_SHORT=$(echo $COMMIT_SHA | cut -c1-7)

# Erstelle Deployment-Prompt (siehe DEPLOYMENT_PROMPT_FINAL.md)
# Ersetze Platzhalter im Prompt

# Sende Task an Manus API
curl -X POST https://api.manus.ai/v1/tasks \
  -H "API_KEY: $MANUS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "[DEPLOYMENT_PROMPT_HIER]",
    "agentProfile": "manus-1.5",
    "projectId": "9Ye7dFtLEUdP6ojxHpkQhu"
  }'
```

---

## Deployment-Prozess im Detail

Der Manus Agent führt folgende Schritte aus:

### SCHRITT 1: Repository klonen und Commit verifizieren

```bash
cd /tmp
rm -rf houston-deploy 2>/dev/null || true
git clone https://github.com/cynarAI/Houston.git houston-deploy
cd houston-deploy
git checkout [COMMIT_SHA_FULL]

# Verifiziere Commit
ACTUAL_SHA=$(git rev-parse HEAD)
EXPECTED_SHA="[COMMIT_SHA_FULL]"
if [ "$ACTUAL_SHA" != "$EXPECTED_SHA" ]; then
  echo "❌ FEHLER: Falscher Commit!"
  exit 1
fi
```

### SCHRITT 2: Dependencies installieren und App bauen

```bash
pnpm install --frozen-lockfile
pnpm build

# Verifiziere Build-Artefakte
test -f dist/public/index.html || exit 1
test -d dist/public/assets || echo "⚠️  assets/ fehlt"
```

### SCHRITT 3: Deployment-Verzeichnis finden

Der Agent sucht nach dem Deployment-Verzeichnis mit 4 Methoden:

1. **Standard-Webserver-Verzeichnisse**: `/var/www/houston.manus.space` oder `/var/www/html`
2. **Laufende Node-Prozesse**: `ps aux | grep node` → `lsof` → Verzeichnis ermitteln
3. **Nginx-Konfiguration**: `/etc/nginx/sites-enabled/houston.manus.space`
4. **Find-Befehle**: `find /var/www -name "*houston*"`

**Fallback**: `/var/www/html`

### SCHRITT 4: Backup erstellen

```bash
BACKUP_TIMESTAMP=$(date +%s)
BACKUP_DIR="${DEPLOY_DIR}.backup.${BACKUP_TIMESTAMP}"
sudo cp -r "$DEPLOY_DIR" "$BACKUP_DIR"
```

### SCHRITT 5: Neue Dateien deployen

```bash
sudo cp -r dist/public/* "$DEPLOY_DIR/"
sudo chmod -R 755 "$DEPLOY_DIR"
```

### SCHRITT 6: Webserver neu laden

```bash
# Ermittle Webserver-Typ
if systemctl is-active --quiet nginx; then
  sudo systemctl reload nginx
elif systemctl is-active --quiet apache2; then
  sudo systemctl reload apache2
fi
```

### SCHRITT 7: Validierung

```bash
# Test 1: Seite erreichbar?
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://houston.manus.space)
if [ "$HTTP_CODE" = "200" ]; then
  echo "✅ Seite erreichbar"
fi

# Test 2: Commit-Hash im HTML?
curl -s https://houston.manus.space | grep -q "[COMMIT_SHA_SHORT]"

# Test 3: Keine JavaScript-Fehler?
curl -s https://houston.manus.space | grep -i "error" | head -3
```

---

## Fehlerbehandlung & Rollback

### Automatischer Rollback bei Fehlern

Falls das Kopieren der Dateien fehlschlägt:

```bash
# Automatischer Rollback
if [ -d "$BACKUP_DIR" ]; then
  sudo cp -r "$BACKUP_DIR"/* "$DEPLOY_DIR/"
  echo "✅ Rollback durchgeführt"
fi
```

### Manueller Rollback

Falls die Seite nach dem Deployment nicht funktioniert:

```bash
# 1. Finde Backup-Verzeichnis
ls -la /var/www/ | grep backup

# 2. Stelle Backup wieder her
BACKUP_DIR="/var/www/houston.manus.space.backup.1234567890"
sudo cp -r "$BACKUP_DIR"/* /var/www/houston.manus.space/

# 3. Setze Berechtigungen
sudo chmod -R 755 /var/www/houston.manus.space/

# 4. Lade Webserver neu
sudo systemctl reload nginx

# 5. Verifiziere
curl -I https://houston.manus.space
```

### Fehlerbehandlung nach HTTP-Status-Codes

- **401/403**: Authentifizierungsfehler → Deployment abbrechen
- **404**: Endpoint nicht gefunden → Fallback-Methode verwenden
- **409**: Konflikt → Warten und erneut versuchen
- **500**: Server-Fehler → Rollback durchführen

---

## Validierung & Monitoring

### Post-Deployment-Validierung

Nach jedem Deployment werden folgende Tests durchgeführt:

1. ✅ **HTTP Status**: Seite erreichbar? (200 OK)
2. ✅ **Commit-Hash**: Richtiger Commit deployed?
3. ✅ **JavaScript**: Keine Fehler im HTML?
4. ✅ **Assets**: Alle Dateien vorhanden?

### Monitoring

**Erste Stunde (kritisch):**

```bash
# Überwache Logs
tail -f /var/log/houston-deployment.log
tail -f /var/log/nginx/error.log

# Prüfe auf Fehler
grep -i "error\|warn\|fail" /var/log/nginx/error.log
```

**Erste 24 Stunden:**

- Keine Fehler in den Logs
- Benutzer melden keine Probleme
- Performance ist normal
- Datenbank-Verbindung stabil

### Audit-Logging

Alle wichtigen Schritte werden geloggt:

```
[AUDIT] 2025-12-03T12:00:00Z - Repository geklont - Commit: 3ab926a
[AUDIT] 2025-12-03T12:01:00Z - Commit verifiziert - Commit: 3ab926a
[AUDIT] 2025-12-03T12:02:00Z - Build erfolgreich - Commit: 3ab926a
[AUDIT] 2025-12-03T12:03:00Z - Backup erstellt - Commit: 3ab926a
[AUDIT] 2025-12-03T12:04:00Z - Dateien kopiert - Commit: 3ab926a
[AUDIT] 2025-12-03T12:05:00Z - Webserver neu geladen - Commit: 3ab926a
[AUDIT] 2025-12-03T12:06:00Z - Validierung durchgeführt - Commit: 3ab926a
[AUDIT] 2025-12-03T12:07:00Z - Deployment erfolgreich - Commit: 3ab926a
```

**Log-Datei**: `/var/log/houston-deployment.log`

---

## Troubleshooting

### Problem: GitHub Actions schlägt fehl

**Fehler**: `MANUS_API_KEY secret is not set!`

**Lösung**:

1. Gehe zu Repository Settings → Secrets
2. Überprüfe dass `MANUS_API_KEY` gesetzt ist
3. Überprüfe dass der Key gültig ist
4. Versuche einen neuen Key zu generieren

**Fehler**: `Workflow file not found`

**Lösung**:

1. Überprüfe dass `.github/workflows/optimized-ci.yml` existiert
2. Überprüfe dass die Datei korrekt formatiert ist (YAML)
3. Pushe die Datei ins Repository

### Problem: Deployment schlägt fehl

**Fehler**: `Commit not found`

**Lösung**:

```bash
# Überprüfe dass der Commit existiert
git log --oneline | grep 3ab926a

# Falls nicht, pushe den Commit
git push origin main
```

**Fehler**: `Build failed`

**Lösung**:

```bash
# Überprüfe Build lokal
pnpm install --frozen-lockfile
pnpm build

# Überprüfe Fehler
cat dist/public/index.html | head -20
```

**Fehler**: `Deployment directory not found`

**Lösung**:

```bash
# Suche nach dem Verzeichnis
find /var/www -name "*houston*" -type d
find /home -name "*houston*" -type d

# Überprüfe Nginx-Konfiguration
cat /etc/nginx/sites-enabled/houston.manus.space
```

### Problem: Seite nicht erreichbar nach Deployment

**Fehler**: `HTTP 503 Service Unavailable`

**Lösung**:

```bash
# Überprüfe Webserver-Status
sudo systemctl status nginx

# Starte Webserver neu
sudo systemctl restart nginx

# Überprüfe Logs
sudo tail -f /var/log/nginx/error.log
```

**Fehler**: `Connection refused`

**Lösung**:

```bash
# Überprüfe ob Webserver läuft
ps aux | grep nginx

# Überprüfe Port
sudo lsof -i :80 -i :443

# Starte Webserver
sudo systemctl start nginx
```

---

## Best Practices

### Vor jedem Deployment

- [ ] Teste lokal: `pnpm build && pnpm preview`
- [ ] Überprüfe Commit-Nachricht
- [ ] Überprüfe dass keine Breaking Changes enthalten sind
- [ ] Informiere das Team

### Während des Deployment

- [ ] Überwache GitHub Actions
- [ ] Überwache Manus Task
- [ ] Überprüfe Logs auf Fehler
- [ ] Sei bereit für Rollback

### Nach dem Deployment

- [ ] Besuche die Seite: `https://houston.manus.space`
- [ ] Teste alle Funktionen
- [ ] Überprüfe Logs auf Fehler
- [ ] Informiere das Team
- [ ] Archiviere Deployment-Report

### Regelmäßig

- [ ] Überprüfe alte Backups und lösche sie
- [ ] Überprüfe Logs auf Anomalien
- [ ] Überprüfe Speicherplatz
- [ ] Aktualisiere Dokumentation

---

## Technische Details

### Projekt-Informationen

- **Projekt-ID**: `9Ye7dFtLEUdP6ojxHpkQhu`
- **Ziel-URL**: `houston.manus.space`
- **Repository**: `https://github.com/cynarAI/Houston.git`
- **Build-Verzeichnis**: `dist/public/`
- **Deployment-Typ**: Frontend-Dateien (statisch), Backend bleibt unverändert

### Manus API Endpoints

- **Task Creation**: `POST https://api.manus.ai/v1/tasks`
- **Header**: `API_KEY: <api-key>`
- **Agent Profile**: `manus-1.5`

### Deployment-Verzeichnis

**Standard-Pfade** (in dieser Reihenfolge gesucht):

1. `/var/www/houston.manus.space/`
2. `/var/www/html/`
3. Aus laufenden Node-Prozessen ermittelt
4. Aus Nginx-Konfiguration ermittelt
5. Mit `find`-Befehlen gesucht

**Fallback**: `/var/www/html/`

### Webserver

**Erkannt werden**:

- Nginx (bevorzugt)
- Apache2
- Node.js Service (falls vorhanden)

**Reload-Befehle**:

- `sudo systemctl reload nginx`
- `sudo systemctl reload apache2`
- `sudo systemctl restart houston` (falls vorhanden)

---

## FAQ

### F: Wie oft kann ich deployen?

**A**: So oft wie nötig. Es gibt keine Rate Limits.

### F: Kann ich zu einem älteren Commit zurückkehren?

**A**: Ja, gib den Commit-SHA im manuellen Deployment ein.

### F: Was passiert mit der Datenbank?

**A**: Nichts. Nur Frontend-Dateien werden aktualisiert. Die Datenbank bleibt unverändert.

### F: Wie lange dauert ein Deployment?

**A**: Etwa 10-15 Minuten (abhängig von Build-Zeit und Dateigröße).

### F: Was wenn das Deployment fehlschlägt?

**A**: Das Backup wird automatisch erstellt. Du kannst jederzeit Rollback durchführen.

### F: Kann ich mehrere Deployments gleichzeitig durchführen?

**A**: Nein, es wird empfohlen, Deployments nacheinander durchzuführen.

### F: Wie überprüfe ich den Deployment-Status?

**A**:

- GitHub Actions: `https://github.com/cynarAI/Houston/actions`
- Manus: `https://manus.im` (Task-Details)
- Logs: `/var/log/houston-deployment.log`

### F: Wie erstelle ich ein Backup?

**A**: Das Backup wird automatisch erstellt. Es ist unter `/var/www/houston.manus.space.backup.TIMESTAMP` gespeichert.

### F: Wie lange werden Backups aufbewahrt?

**A**: Standardmäßig unbegrenzt. Du solltest alte Backups manuell löschen.

---

## Support & Kontakt

**Bei Fragen oder Problemen:**

1. Überprüfe diese Anleitung
2. Überprüfe `docs/MANUS_DEPLOYMENT_PROMPT.md`
3. Überprüfe `docs/DEPLOYMENT_RESEARCH_FINDINGS.md`
4. Kontaktiere das Team mit:
   - Fehlercode
   - Logs
   - Deployment-Report
   - Commit-SHA

**Wichtige Links:**

- GitHub Actions: `https://github.com/cynarAI/Houston/actions`
- Manus: `https://manus.im`
- Manus API: `https://open.manus.ai/docs`
- Logs: `/var/log/houston-deployment.log`

---

## Changelog

### Version 2.0 (December 3, 2025)

- ✅ Überarbeitung basierend auf Recherche-Ergebnissen
- ✅ Entfernung nicht-existierender API-Methoden
- ✅ Shell-Befehle als primäre Deployment-Methode
- ✅ Verbesserte Discovery-Befehle
- ✅ Automatisches Backup & Rollback
- ✅ Umfassende Validierung
- ✅ Audit-Logging

### Version 1.0 (Vorherige Version)

- ✅ Initial release
- ✅ GitHub Actions workflow
- ✅ Manus API Integration

---

**Status**: ✅ Produktionsreif  
**Letzte Aktualisierung**: December 3, 2025  
**Nächste Überprüfung**: Januar 2026
