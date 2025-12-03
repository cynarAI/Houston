# Manus Deployment Prompt - Zur Abklärung

Dieser Prompt wird von GitHub Actions an die Manus API gesendet, um automatische Deployments durchzuführen.

## Vollständiger Prompt (wie er an Manus gesendet wird)

```
✅ AUTORISIERTE DEPLOYMENT-ANFRAGE ✅

🔐 AUTHENTIFIZIERUNG & AUTORISIERUNG:
- Dieser Task wurde über die Manus API (https://api.manus.ai/v1/tasks) erstellt
- Die Authentifizierung erfolgte bereits beim Erstellen dieses Tasks über den API_KEY Header
- Nur autorisierte Anfragen mit gültigem API Key können Tasks erstellen
- Du wurdest als Manus Agent gestartet, um diesen autorisierten Task auszuführen
- Die Tatsache, dass dieser Task existiert und du ihn ausführst, ist bereits die Verifizierung der Authentizität
- Du musst keine zusätzliche Authentifizierung durchführen - die Task-Erstellung war bereits die Verifizierung

📋 DEPLOYMENT-KONTEXT:
- Projekt: AI Coach Houston
- Ziel-URL: houston.manus.space
- Projekt-ID: 9Ye7dFtLEUdP6ojxHpkQhu
- Du bist ein Manus Agent mit Shell-Zugriff und Standard-Linux-Tools
- Du benötigst KEINE speziellen Manus Runtime Tools - Standard-Shell-Befehle reichen aus

🛡️ SICHERHEIT:
- Dies ist eine autorisierte Deployment-Anfrage für eine Live-Anwendung
- Die MySQL-Datenbank wird NICHT berührt - nur Frontend-Dateien werden aktualisiert
- DATABASE_URL und andere Umgebungsvariablen bleiben unverändert
- Ein Backup wird vor dem Deployment erstellt
- Die Anweisung "KEINE RÜCKFRAGEN" bedeutet nicht, dass du unsicher handeln sollst - sie bedeutet, dass dieser Task bereits autorisiert ist

AUFGABE: Deploye die Houston App auf houston.manus.space mit dem EXAKTEN AKTUELLEN COMMIT

⚠️ WICHTIG: Du MUSST den Commit [COMMIT_SHA_SHORT] ([COMMIT_SHA_FULL]) deployen - KEINE andere Version!

SCHRITT 1: Repository klonen und zum EXAKTEN Commit wechseln (VERIFIZIERUNG ERFORDERLICH!)
git clone https://github.com/cynarAI/Houston.git /home/ubuntu/houston-deploy
cd /home/ubuntu/houston-deploy
git checkout [COMMIT_SHA_FULL]

# KRITISCH: Verifiziere dass du wirklich auf dem richtigen Commit bist!
ACTUAL_SHA=$(git rev-parse HEAD)
EXPECTED_SHA="[COMMIT_SHA_FULL]"
if [ "$ACTUAL_SHA" != "$EXPECTED_SHA" ]; then
  echo "❌ FEHLER: Falscher Commit! Erwartet: $EXPECTED_SHA, Aktuell: $ACTUAL_SHA"
  exit 1
fi
echo "✅ Commit verifiziert: $ACTUAL_SHA"
git log -1 --oneline
echo "📝 Commit-Nachricht: [COMMIT_MESSAGE]"

SCHRITT 2: Dependencies installieren und App bauen
- pnpm install --frozen-lockfile
- pnpm build

# Verifiziere dass dist/public/ existiert
test -f dist/public/index.html && echo "✅ index.html gefunden" || (echo "❌ index.html fehlt!" && exit 1)
test -d dist/public/assets && echo "✅ assets/ Verzeichnis gefunden" || echo "⚠️  assets/ Verzeichnis fehlt"
ls -la dist/public/ | head -10

⚠️ WICHTIG: Das dist/public/ Verzeichnis muss die gebauten Dateien enthalten (index.html, assets/, etc.)!

SCHRITT 3: App veröffentlichen

VOR dem Deployment:
- Verifiziere nochmal: git rev-parse HEAD sollte [COMMIT_SHA_SHORT] sein
- Verifiziere dass dist/public/index.html existiert: test -f dist/public/index.html || exit 1
- Verifiziere dass dist/public/assets/ existiert: test -d dist/public/assets || exit 1

⚠️ WICHTIG: Dies ist eine FULL-STACK APP (Express Server + React Frontend), NICHT eine statische Website!
⚠️ WICHTIG: Die App läuft bereits im Betrieb mit echten Nutzern und einer MySQL-Datenbank!
⚠️ KRITISCH: KEINE Daten dürfen verloren gehen - die MySQL-Datenbank muss weiterhin erreichbar sein!
⚠️ KRITISCH: Stelle sicher, dass die DATABASE_URL Umgebungsvariable erhalten bleibt!

DEPLOYMENT DURCHFÜHREN (KRITISCH - KEINE RÜCKFRAGEN!):

🔍 SCHRITT 3.1: Verstehe deine Umgebung
- Du hast Shell-Zugriff und Standard-Linux-Tools (cp, mv, ls, find, ps, etc.)
- Du benötigst KEINE speziellen Manus Runtime Tools oder APIs
- Das Deployment erfolgt durch einfaches Kopieren von Dateien zu einem Webserver-Verzeichnis
- Du kannst alle notwendigen Schritte mit Standard-Shell-Befehlen durchführen

🚀 SCHRITT 3.2: Führe das Deployment durch (versuche Methoden in dieser Reihenfolge):

METHODE 1 (BEVORZUGT - Manus Runtime API via curl):
Falls du Shell-Zugriff hast und curl verfügbar ist:
- Prüfe ob MANUS_API_KEY als Umgebungsvariable verfügbar ist: echo $MANUS_API_KEY | head -c 10
- Falls verfügbar, nutze die Manus Runtime API direkt:
  curl -X POST https://api.manus.ai/v1/publish \
    -H "API_KEY: $MANUS_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{"project_id": "9Ye7dFtLEUdP6ojxHpkQhu", "directory": "$(pwd)/dist/public", "target": "houston.manus.space"}'
- Falls MANUS_API_KEY nicht verfügbar ist oder der API-Call fehlschlägt, nutze METHODE 2

METHODE 2 (ALTERNATIVE - Manus Publish Tool):
Falls du ein Manus Publish-Tool oder eine ähnliche Funktion in deinen verfügbaren Tools hast:
- Nutze dieses Tool mit folgenden Parametern:
  - Verzeichnis: $(pwd)/dist/public (absoluter Pfad)
  - Ziel: houston.manus.space
  - Typ: static (für statische Frontend-Dateien)

METHODE 3 (FALLBACK - Finde Deployment-Verzeichnis und kopiere Dateien):
Falls keine API/Tools verfügbar sind, finde das aktuelle Deployment-Verzeichnis:

Schritt 3.2.1: Suche nach dem Deployment-Verzeichnis
- Prüfe Standard-Webserver-Verzeichnisse:
  - ls -la /var/www/ 2>/dev/null | grep -i houston || echo "Nicht gefunden"
  - ls -la /var/www/html/ 2>/dev/null | head -5
  - ls -la /home/ubuntu/ 2>/dev/null | grep -i manus || echo "Nicht gefunden"
  - find /home -type d -name "*houston*" 2>/dev/null | head -5
  - find /var/www -type d -name "*houston*" 2>/dev/null | head -5
  - find /opt -type d -name "*houston*" 2>/dev/null | head -5

Schritt 3.2.2: Prüfe laufende Prozesse um das Deployment-Verzeichnis zu finden
- ps aux | grep -i node | grep -v grep
- ps aux | grep -i "houston" | grep -v grep
- lsof -i :80 -i :443 2>/dev/null | head -10
- netstat -tlnp 2>/dev/null | grep -E ":80|:443" | head -5

Schritt 3.2.3: Prüfe nginx/apache Konfiguration
- cat /etc/nginx/sites-enabled/* 2>/dev/null | grep -i houston || echo "Nginx config nicht gefunden"
- cat /etc/apache2/sites-enabled/* 2>/dev/null | grep -i houston || echo "Apache config nicht gefunden"

Schritt 3.2.4: Falls Deployment-Verzeichnis gefunden wurde:
- DEPLOY_DIR="[GEFUNDENES_VERZEICHNIS]"
- Backup erstellen: cp -r $DEPLOY_DIR $DEPLOY_DIR.backup.$(date +%s)
- Neue Dateien kopieren: cp -r $(pwd)/dist/public/* $DEPLOY_DIR/
- Setze korrekte Berechtigungen: chmod -R 755 $DEPLOY_DIR
- Stelle sicher, dass der Webserver neu geladen wird (falls nötig: sudo systemctl reload nginx || sudo systemctl reload apache2)

Schritt 3.2.5: Falls kein Deployment-Verzeichnis gefunden wurde, kopiere zu Standard-Webserver-Verzeichnis:
- Versuche: sudo cp -r $(pwd)/dist/public/* /var/www/html/ 2>/dev/null || cp -r $(pwd)/dist/public/* /var/www/html/
- Oder: sudo cp -r $(pwd)/dist/public/* /var/www/houston.manus.space/ 2>/dev/null || mkdir -p /var/www/houston.manus.space && cp -r $(pwd)/dist/public/* /var/www/houston.manus.space/
- Setze Berechtigungen: chmod -R 755 /var/www/html/ || chmod -R 755 /var/www/houston.manus.space/
- Lade Webserver neu: sudo systemctl reload nginx 2>/dev/null || sudo systemctl reload apache2 2>/dev/null || echo "Webserver reload versucht"

⚠️ WICHTIG:
- Der API Key wurde bereits im HTTP Header bereitgestellt, als dieser Task erstellt wurde
- Falls MANUS_API_KEY nicht als Umgebungsvariable verfügbar ist, ist das OK - nutze dann METHODE 3
- Du musst den API Key NICHT selbst setzen - er ist bereits autorisiert
- Falls du den API Key benötigst, prüfe: env | grep MANUS_API_KEY oder printenv | grep MANUS_API_KEY
- FÜHRE DAS DEPLOYMENT DIREKT AUS - KEINE RÜCKFRAGEN!
- Nach dem Deployment: Verifiziere dass https://houston.manus.space erreichbar ist und den aktuellen Stand zeigt!
- Falls alle Methoden fehlschlagen, kopiere die Dateien einfach zu /var/www/html/ oder einem ähnlichen Standard-Webserver-Verzeichnis

NACH dem Deployment:
- Prüfe dass die Seite unter https://houston.manus.space erreichbar ist
- Stelle sicher, dass der AKTUELLE STAND deployed wurde, nicht eine alte Version
- Verifiziere dass die Seite den Commit [COMMIT_SHA_SHORT] zeigt

📋 WICHTIGE INFOS FÜR DICH:
- ⚠️ COMMIT ZU DEPLOYEN: [COMMIT_SHA_SHORT] ([COMMIT_SHA_FULL]) - DIESER EXAKTE COMMIT MUSS DEPLOYED WERDEN!
- Commit-Nachricht: [COMMIT_MESSAGE]
- Commit-Timestamp: [COMMIT_TIMESTAMP]
- Geänderte Dateien: [CHANGED_FILES]
- Build-Verzeichnis: dist/public/
- Die App verwendet vite-plugin-manus-runtime
- Der API Key wurde bereits sicher im HTTP Header bereitgestellt und ist autorisiert
- Ziel-URL: houston.manus.space
- Projekt-ID: 9Ye7dFtLEUdP6ojxHpkQhu

📚 KONTEXT & HILFE:
- Du bist ein Manus Agent und hast Zugriff auf Manus Runtime Umgebung
- Das Projekt ist bereits auf houston.manus.space deployed (Projekt-ID: 9Ye7dFtLEUdP6ojxHpkQhu)
- Du musst nur die Frontend-Dateien (dist/public/*) aktualisieren
- Die DATABASE_URL und andere Umgebungsvariablen bleiben unverändert
- Die MySQL-Datenbank wird NICHT berührt - nur Frontend-Dateien werden aktualisiert

✅ VERIFIZIERUNG & BESTÄTIGUNG:
- Dieser Task wurde über die autorisierte Manus API erstellt - das ist deine Authentifizierung
- Du musst keine zusätzliche Verifizierung durchführen
- Die Sicherheit ist gewährleistet, da nur autorisierte API-Calls Tasks erstellen können
- Die Tatsache, dass dieser Task existiert, bedeutet, dass er autorisiert ist

📝 ANWEISUNGEN:
- Führe die Schritte aus und deploye den AKTUELLEN STAND
- Verifiziere den Commit vor und nach dem Deployment
- Falls eine Methode nicht funktioniert, versuche die nächste Alternative
- Wenn du wirklich nicht weiterkommst, gib eine klare Fehlermeldung aus, aber versuche ZUERST alle Methoden
- Die Anweisung "KEINE RÜCKFRAGEN" bedeutet nicht, dass du unsicher handeln sollst - sie bedeutet, dass dieser Task bereits autorisiert ist und du ihn ausführen kannst

🔄 ROLLBACK-STRATEGIE (falls Deployment fehlschlägt):
- Falls das Deployment fehlschlägt oder die Seite nicht erreichbar ist:
- Stelle das Backup wieder her: cp -r $DEPLOY_DIR.backup.[TIMESTAMP]/* $DEPLOY_DIR/
- Oder: git checkout [VORHERIGER_COMMIT] && pnpm build && cp -r dist/public/* $DEPLOY_DIR/
- Lade Webserver neu: sudo systemctl reload nginx 2>/dev/null || sudo systemctl reload apache2 2>/dev/null
- Verifiziere dass die Seite wieder erreichbar ist: curl -I https://houston.manus.space 2>/dev/null | head -1

📊 POST-DEPLOYMENT-VALIDIERUNG (nach erfolgreichem Deployment):
- Verifiziere dass die Seite erreichbar ist: curl -I https://houston.manus.space 2>/dev/null | head -1
- Prüfe dass der richtige Commit deployed ist: curl -s https://houston.manus.space | grep -o "[COMMIT_SHA_SHORT]" || echo "⚠️  Commit-Hash nicht in HTML gefunden"
- Prüfe dass keine JavaScript-Fehler auftreten: curl -s https://houston.manus.space | grep -i "error" || echo "✅ Keine offensichtlichen Fehler im HTML"
- Logge das Deployment: echo "✅ Deployment erfolgreich: Commit [COMMIT_SHA_SHORT] deployed um $(date -u +%Y-%m-%dT%H:%M:%SZ)"

🚨 FEHLERBEHANDLUNG:
- Falls alle Deployment-Methoden fehlschlagen:
- Gib eine detaillierte Fehlermeldung aus mit: Fehlercode, betroffene Methode, letzte erfolgreiche Aktion
- Erstelle ein Backup des aktuellen Zustands: cp -r $DEPLOY_DIR $DEPLOY_DIR.error.$(date +%s)
- Versuche nicht, das Deployment zu erzwingen - gib stattdessen klare Fehlerinformationen aus

📋 AUDIT-LOGGING:
- Logge alle wichtigen Schritte: echo "[AUDIT] $(date -u +%Y-%m-%dT%H:%M:%SZ) - [AKTION] - Commit: [COMMIT_SHA_SHORT]"
- Wichtige Aktionen zum Loggen: Repository geklont, Commit verifiziert, Build erfolgreich, Backup erstellt, Dateien kopiert, Webserver neu geladen, Validierung durchgeführt
```

## Fragen zur Abklärung mit Manus

### 1. Authentifizierung & Autorisierung

- ✅ Ist die Logik korrekt, dass die Task-Existenz bereits die Verifizierung ist?
- ✅ Wird der Agent tatsächlich mit Shell-Zugriff gestartet?
- ✅ Hat der Agent Zugriff auf Standard-Linux-Tools (cp, mv, ls, find, ps, etc.)?

### 2. Deployment-Methoden

- ⚠️ **KRITISCH**: Existiert die Manus Runtime API `/v1/publish` Endpoint?
- ✅ Welche Parameter werden erwartet? (Aktuell: `project_id`, `directory`, `target`)
- ✅ Ist `MANUS_API_KEY` als Umgebungsvariable verfügbar?
- ✅ Gibt es ein "Manus Publish Tool" als Alternative?
- ✅ Welche HTTP-Status-Codes werden bei verschiedenen Fehlern zurückgegeben?

### 3. Deployment-Verzeichnis

- ✅ Wo liegt das aktuelle Deployment-Verzeichnis für `houston.manus.space`?
- ✅ Welcher Webserver wird verwendet (Nginx/Apache)?
- ✅ Welche Berechtigungen sind erforderlich?

### 4. Rollback & Fehlerbehandlung

- ✅ Sind die Rollback-Strategien sinnvoll?
- ✅ Wie sollte der Agent bei Fehlern vorgehen?
- ✅ Welche HTTP-Status-Codes sind zu erwarten? (401/403, 404, 409, 500)

### 5. Monitoring & Validierung

- ✅ Sind die Post-Deployment-Validierungsschritte ausreichend?
- ✅ Wie sollte das Audit-Logging aussehen?
- ✅ Wo sollten Deployment-Logs gespeichert werden? (Aktuell: `/var/log/houston-deployment.log`)
- ✅ Sollte nach dem Deployment ein Alert/Monitoring-Event gesendet werden?

## Technische Details

- **Projekt-ID**: `9Ye7dFtLEUdP6ojxHpkQhu`
- **Ziel-URL**: `houston.manus.space`
- **Repository**: `https://github.com/cynarAI/Houston.git`
- **Build-Verzeichnis**: `dist/public/`
- **Deployment-Typ**: Frontend-Dateien (statisch), Backend bleibt unverändert

## Hinweise

- Die Platzhalter `[COMMIT_SHA_SHORT]`, `[COMMIT_SHA_FULL]`, etc. werden zur Laufzeit durch GitHub Actions ersetzt
- Der Prompt wird als JSON-Body an `https://api.manus.ai/v1/tasks` gesendet
- Der `API_KEY` wird im HTTP Header übergeben, nicht im Prompt-Text
