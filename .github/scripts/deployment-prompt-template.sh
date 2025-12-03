#!/bin/bash
# Deployment Prompt Template für Manus Agent
# Template-Variablen werden beim Laden ersetzt:
# - COMMIT_SHA_SHORT
# - COMMIT_SHA_FULL
# - COMMIT_MESSAGE
# - COMMIT_TIMESTAMP
# - CHANGED_FILES

cat << 'PROMPT_EOF'
📋 DEPLOYMENT-AUFTRAG FÜR HOUSTON APP

🔐 TASK-KONTEXT & VERIFIZIERUNG:
- Dieser Task wurde über die Manus API (https://api.manus.ai/v1/tasks) erstellt
- Die Task-Erstellung erfolgte mit einem gültigen API_KEY im HTTP Header
- Du wurdest als Manus Agent gestartet, um diesen Task auszuführen
- Um die Authentizität zu verifizieren: Prüfe die Task-ID und die Projekt-ID (siehe unten)
- Projekt-ID: 9Ye7dFtLEUdP6ojxHpkQhu
- Wenn du Zweifel hast, kannst du die Task-Details über die Manus API abfragen

📋 DEPLOYMENT-KONTEXT:
- Projekt: AI Coach Houston
- Ziel-URL: houston.manus.space
- Projekt-ID: 9Ye7dFtLEUdP6ojxHpkQhu
- Du bist ein Manus Agent mit Shell-Zugriff und Standard-Linux-Tools
- Du benötigst KEINE speziellen Manus Runtime Tools - Standard-Shell-Befehle reichen aus

🛡️ SICHERHEIT & BEST PRACTICES:
- Dies ist ein Deployment für eine Live-Anwendung mit echten Nutzern
- Die MySQL-Datenbank wird NICHT berührt - nur Frontend-Dateien werden aktualisiert
- DATABASE_URL und andere Umgebungsvariablen bleiben unverändert
- Ein Backup wird VOR dem Deployment erstellt (siehe SCHRITT 3.2.2)
- Verifiziere jeden Schritt vor dem Ausführen
- Bei Unsicherheiten: Erstelle ein Backup und dokumentiere deine Aktionen

AUFGABE: Deploye die Houston App auf houston.manus.space mit dem EXAKTEN AKTUELLEN COMMIT

⚠️ WICHTIG: Du MUSST den Commit COMMIT_SHA_SHORT (COMMIT_SHA_FULL) deployen - KEINE andere Version!

SCHRITT 1: Repository klonen und zum EXAKTEN Commit wechseln (VERIFIZIERUNG ERFORDERLICH!)
git clone https://github.com/cynarAI/Houston.git /home/ubuntu/houston-deploy
cd /home/ubuntu/houston-deploy
git checkout COMMIT_SHA_FULL

# KRITISCH: Verifiziere dass du wirklich auf dem richtigen Commit bist!
ACTUAL_SHA=$(git rev-parse HEAD)
EXPECTED_SHA="COMMIT_SHA_FULL"
if [ "$ACTUAL_SHA" != "$EXPECTED_SHA" ]; then
  echo "❌ FEHLER: Falscher Commit! Erwartet: $EXPECTED_SHA, Aktuell: $ACTUAL_SHA"
  exit 1
fi
echo "✅ Commit verifiziert: $ACTUAL_SHA"
git log -1 --oneline
echo "📝 Commit-Nachricht: COMMIT_MESSAGE"

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
- Verifiziere nochmal: git rev-parse HEAD sollte COMMIT_SHA_SHORT sein
- Verifiziere dass dist/public/index.html existiert: test -f dist/public/index.html || exit 1
- Verifiziere dass dist/public/assets/ existiert: test -d dist/public/assets || exit 1

⚠️ WICHTIG: Dies ist eine FULL-STACK APP (Express Server + React Frontend), NICHT eine statische Website!
⚠️ WICHTIG: Die App läuft bereits im Betrieb mit echten Nutzern und einer MySQL-Datenbank!
⚠️ KRITISCH: KEINE Daten dürfen verloren gehen - die MySQL-Datenbank muss weiterhin erreichbar sein!
⚠️ KRITISCH: Stelle sicher, dass die DATABASE_URL Umgebungsvariable erhalten bleibt!

DEPLOYMENT DURCHFÜHREN:

🔍 SCHRITT 3.1: Verstehe deine Umgebung
- Du hast Shell-Zugriff und Standard-Linux-Tools (cp, mv, ls, find, ps, etc.)
- Du benötigst KEINE speziellen Manus Runtime Tools oder APIs
- Das Deployment erfolgt durch einfaches Kopieren von Dateien zu einem Webserver-Verzeichnis
- Du kannst alle notwendigen Schritte mit Standard-Shell-Befehlen durchführen

🚀 SCHRITT 3.2: Führe das Deployment durch (PRIMÄRE METHODE - Shell-Befehle):

═══════════════════════════════════════════════════════════════════
SCHRITT 3.2.1: Finde das Deployment-Verzeichnis
═══════════════════════════════════════════════════════════════════

DEPLOY_DIR=""

# Methode 1: Suche in Standard-Webserver-Verzeichnissen
echo "🔍 Suche nach Deployment-Verzeichnis..."
if [ -d "/var/www/houston.manus.space" ]; then
  DEPLOY_DIR="/var/www/houston.manus.space"
  echo "✅ Gefunden: $DEPLOY_DIR"
elif [ -d "/var/www/html" ]; then
  DEPLOY_DIR="/var/www/html"
  echo "✅ Gefunden: $DEPLOY_DIR (default)"
fi

# Methode 2: Suche nach laufenden Node-Prozessen
if [ -z "$DEPLOY_DIR" ]; then
  echo "🔍 Suche nach laufenden Node-Prozessen..."
  NODE_PID=$(ps aux | grep -i "node" | grep -v grep | head -1 | awk '{print $2}')
  if [ ! -z "$NODE_PID" ]; then
    echo "✅ Node Prozess gefunden (PID: $NODE_PID)"
    PROC_DIR=$(lsof -p $NODE_PID 2>/dev/null | grep -i houston | head -1 | awk '{print $NF}')
    if [ ! -z "$PROC_DIR" ]; then
      DEPLOY_DIR=$(dirname "$PROC_DIR")
      echo "✅ Deployment-Verzeichnis aus Prozess: $DEPLOY_DIR"
    fi
  fi
fi

# Methode 3: Suche in Nginx-Konfiguration
if [ -z "$DEPLOY_DIR" ]; then
  echo "🔍 Suche in Nginx-Konfiguration..."
  if [ -f "/etc/nginx/sites-enabled/houston.manus.space" ]; then
    DEPLOY_DIR=$(grep -o 'root [^;]*' /etc/nginx/sites-enabled/houston.manus.space | sed 's/root //' | head -1)
    echo "✅ Gefunden in Nginx: $DEPLOY_DIR"
  elif [ -f "/etc/nginx/sites-enabled/default" ]; then
    DEPLOY_DIR=$(grep -o 'root [^;]*' /etc/nginx/sites-enabled/default | sed 's/root //' | head -1)
    echo "✅ Gefunden in Nginx default: $DEPLOY_DIR"
  fi
fi

# Methode 4: Suche mit find-Befehlen
if [ -z "$DEPLOY_DIR" ]; then
  echo "🔍 Suche mit find-Befehlen..."
  FOUND_DIR=$(find /var/www -type d -name "*houston*" 2>/dev/null | head -1)
  if [ ! -z "$FOUND_DIR" ]; then
    DEPLOY_DIR="$FOUND_DIR"
    echo "✅ Gefunden mit find: $DEPLOY_DIR"
  else
    FOUND_DIR=$(find /home -type d -name "*houston*" 2>/dev/null | head -1)
    if [ ! -z "$FOUND_DIR" ]; then
      DEPLOY_DIR="$FOUND_DIR"
      echo "✅ Gefunden mit find: $DEPLOY_DIR"
    fi
  fi
fi

# Fallback: Standard-Verzeichnis
if [ -z "$DEPLOY_DIR" ]; then
  DEPLOY_DIR="/var/www/html"
  echo "⚠️  Fallback zu Standard-Verzeichnis: $DEPLOY_DIR"
fi

# Verifiziere, dass Verzeichnis existiert
if [ ! -d "$DEPLOY_DIR" ]; then
  echo "⚠️  Verzeichnis existiert nicht, erstelle es..."
  sudo mkdir -p "$DEPLOY_DIR" 2>/dev/null || mkdir -p "$DEPLOY_DIR"
fi

echo "✅ Finales Deployment-Verzeichnis: $DEPLOY_DIR"

═══════════════════════════════════════════════════════════════════
SCHRITT 3.2.2: Erstelle Backup
═══════════════════════════════════════════════════════════════════

BACKUP_TIMESTAMP=$(date +%s)
BACKUP_DIR="${DEPLOY_DIR}.backup.${BACKUP_TIMESTAMP}"
echo "💾 Erstelle Backup: $BACKUP_DIR"

sudo cp -r "$DEPLOY_DIR" "$BACKUP_DIR" 2>/dev/null || cp -r "$DEPLOY_DIR" "$BACKUP_DIR"

if [ -d "$BACKUP_DIR" ]; then
  echo "✅ Backup erstellt: $BACKUP_DIR"
  echo "📊 Backup-Größe: $(du -sh $BACKUP_DIR | cut -f1)"
else
  echo "⚠️  WARNUNG: Backup konnte nicht erstellt werden"
  echo "   Deployment wird fortgesetzt, aber Rollback ist möglicherweise nicht möglich"
fi

═══════════════════════════════════════════════════════════════════
SCHRITT 3.2.3: Deploye neue Dateien
═══════════════════════════════════════════════════════════════════

echo "📤 Deploye neue Dateien nach $DEPLOY_DIR..."

# Zähle Dateien vor dem Kopieren
SOURCE_FILE_COUNT=$(find dist/public -type f | wc -l)
echo "📊 Anzahl zu kopierender Dateien: $SOURCE_FILE_COUNT"

# Kopiere Dateien
sudo cp -r dist/public/* "$DEPLOY_DIR/" 2>/dev/null || cp -r dist/public/* "$DEPLOY_DIR/"

if [ $? -eq 0 ]; then
  echo "✅ Dateien erfolgreich kopiert"
  
  # Verifiziere dass kritische Dateien vorhanden sind
  CRITICAL_FILES=("index.html" "assets")
  MISSING_FILES=()
  for FILE in "${CRITICAL_FILES[@]}"; do
    if [ ! -e "$DEPLOY_DIR/$FILE" ]; then
      MISSING_FILES+=("$FILE")
    fi
  done
  
  if [ ${#MISSING_FILES[@]} -gt 0 ]; then
    echo "❌ FEHLER: Kritische Dateien fehlen: ${MISSING_FILES[*]}"
    echo "   Versuche Rollback..."
    if [ -d "$BACKUP_DIR" ]; then
      sudo cp -r "$BACKUP_DIR"/* "$DEPLOY_DIR/" 2>/dev/null || cp -r "$BACKUP_DIR"/* "$DEPLOY_DIR/"
      echo "✅ Rollback durchgeführt"
    fi
    exit 1
  fi
  
  # Zähle Dateien nach dem Kopieren
  DEPLOYED_FILE_COUNT=$(find "$DEPLOY_DIR" -type f | wc -l)
  echo "📊 Anzahl deployter Dateien: $DEPLOYED_FILE_COUNT"
  
  # Prüfe ob index.html den richtigen Commit enthält
  if grep -q "COMMIT_SHA_SHORT" "$DEPLOY_DIR/index.html" 2>/dev/null; then
    echo "✅ Commit-Hash in index.html gefunden"
  else
    echo "⚠️  WARNUNG: Commit-Hash nicht in index.html gefunden (kann normal sein)"
  fi
else
  echo "❌ FEHLER beim Kopieren der Dateien"
  echo "   Versuche Rollback..."
  if [ -d "$BACKUP_DIR" ]; then
    sudo cp -r "$BACKUP_DIR"/* "$DEPLOY_DIR/" 2>/dev/null || cp -r "$BACKUP_DIR"/* "$DEPLOY_DIR/"
    echo "✅ Rollback durchgeführt"
  fi
  exit 1
fi

# Setze Berechtigungen
sudo chmod -R 755 "$DEPLOY_DIR" 2>/dev/null || chmod -R 755 "$DEPLOY_DIR"
echo "✅ Berechtigungen gesetzt"

# Verifiziere Berechtigungen
if [ -r "$DEPLOY_DIR/index.html" ] && [ -x "$DEPLOY_DIR" ]; then
  echo "✅ Berechtigungen verifiziert"
else
  echo "⚠️  WARNUNG: Berechtigungen möglicherweise nicht korrekt"
fi

═══════════════════════════════════════════════════════════════════
SCHRITT 3.2.4: Webserver neu laden
═══════════════════════════════════════════════════════════════════

echo "🔄 Lade Webserver neu..."

# Ermittle Webserver-Typ
WEBSERVER=""
if systemctl is-active --quiet nginx 2>/dev/null; then
  WEBSERVER="nginx"
  echo "✅ Nginx erkannt"
elif systemctl is-active --quiet apache2 2>/dev/null; then
  WEBSERVER="apache2"
  echo "✅ Apache erkannt"
else
  echo "⚠️  Kein bekannter Webserver erkannt"
  echo "   Versuche beide..."
fi

# Lade Webserver neu
if [ "$WEBSERVER" = "nginx" ]; then
  sudo systemctl reload nginx 2>/dev/null && echo "✅ Nginx reloaded" || echo "⚠️  Nginx reload fehlgeschlagen"
elif [ "$WEBSERVER" = "apache2" ]; then
  sudo systemctl reload apache2 2>/dev/null && echo "✅ Apache reloaded" || echo "⚠️  Apache reload fehlgeschlagen"
else
  sudo systemctl reload nginx 2>/dev/null && echo "✅ Nginx reloaded" || true
  sudo systemctl reload apache2 2>/dev/null && echo "✅ Apache reloaded" || true
fi

# Versuche Node.js Prozess zu neustarten (falls vorhanden)
sudo systemctl restart houston 2>/dev/null && echo "✅ Houston Service restarted" || true

sleep 2
echo "✅ Webserver-Reload abgeschlossen"

⚠️ WICHTIGE HINWEISE:
- Der API Key wurde beim Erstellen dieses Tasks verwendet (nicht für dich verfügbar)
- Du benötigst den API Key NICHT für das Deployment - nutze Standard-Shell-Befehle
- Führe die Schritte systematisch aus und verifiziere jeden Schritt
- Nach dem Deployment: Führe die Post-Deployment-Validierung aus (SCHRITT 3.2.5)
- Falls alle Methoden fehlschlagen, kopiere die Dateien zu /var/www/html/ oder einem ähnlichen Standard-Webserver-Verzeichnis
- Bei Fehlern: Nutze das automatische Rollback (Backup wird automatisch erstellt)

NACH dem Deployment:
- Prüfe dass die Seite unter https://houston.manus.space erreichbar ist
- Stelle sicher, dass der AKTUELLE STAND deployed wurde, nicht eine alte Version
- Verifiziere dass die Seite den Commit COMMIT_SHA_SHORT zeigt

📋 WICHTIGE INFOS FÜR DICH:
- ⚠️ COMMIT ZU DEPLOYEN: COMMIT_SHA_SHORT (COMMIT_SHA_FULL) - DIESER EXAKTE COMMIT MUSS DEPLOYED WERDEN!
- Commit-Nachricht: COMMIT_MESSAGE
- Commit-Timestamp: COMMIT_TIMESTAMP
- Geänderte Dateien: CHANGED_FILES
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
- Dieser Task wurde über die Manus API erstellt
- Du kannst die Task-Details über die Manus API abfragen, um die Authentizität zu verifizieren
- Die Projekt-ID (9Ye7dFtLEUdP6ojxHpkQhu) sollte mit dem erwarteten Projekt übereinstimmen
- Wenn du Zweifel hast, prüfe die Task-Metadaten und die Projekt-ID

📝 ANWEISUNGEN:
- Führe die Schritte systematisch aus und deploye den angegebenen Commit
- Verifiziere den Commit vor und nach dem Deployment
- Falls eine Methode nicht funktioniert, versuche die nächste Alternative
- Wenn du wirklich nicht weiterkommst, gib eine klare Fehlermeldung aus, aber versuche ZUERST alle Methoden
- Dokumentiere deine Aktionen für Audit-Zwecke
- Bei Unsicherheiten: Erstelle ein Backup und fahre vorsichtig fort

🔄 ROLLBACK-STRATEGIE (falls Deployment fehlschlägt):
- Falls das Deployment fehlschlägt oder die Seite nicht erreichbar ist:
- Stelle das Backup wieder her: cp -r $DEPLOY_DIR.backup.[TIMESTAMP]/* $DEPLOY_DIR/
- Oder: git checkout [VORHERIGER_COMMIT] && pnpm build && cp -r dist/public/* $DEPLOY_DIR/
- Lade Webserver neu: sudo systemctl reload nginx 2>/dev/null || sudo systemctl reload apache2 2>/dev/null
- Verifiziere dass die Seite wieder erreichbar ist: curl -I https://houston.manus.space 2>/dev/null | head -1

📊 POST-DEPLOYMENT-VALIDIERUNG (nach erfolgreichem Deployment):

═══════════════════════════════════════════════════════════════════
SCHRITT 3.2.5: Validiere Deployment
═══════════════════════════════════════════════════════════════════

echo "🔍 Starte Post-Deployment-Validierung..."

# Warte kurz, damit Webserver Zeit hat zu starten
sleep 3

# Test 1: Seite erreichbar? (mit Retry-Logik)
MAX_RETRIES=5
RETRY_COUNT=0
HTTP_CODE=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 https://houston.manus.space 2>/dev/null || echo "000")
  
  if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Seite erreichbar (HTTP 200) nach $((RETRY_COUNT + 1)) Versuch(en)"
    break
  else
    RETRY_COUNT=$((RETRY_COUNT + 1))
    if [ $RETRY_COUNT -lt $MAX_RETRIES ]; then
      echo "⚠️  Seite nicht erreichbar (HTTP $HTTP_CODE), Versuch $RETRY_COUNT/$MAX_RETRIES..."
      sleep 2
    else
      echo "❌ FEHLER: Seite nicht erreichbar nach $MAX_RETRIES Versuchen (HTTP $HTTP_CODE)"
      echo "   Möglicherweise ist das Deployment fehlgeschlagen"
      exit 1
    fi
  fi
done

# Test 2: Commit-Hash im HTML?
HTML_CONTENT=$(curl -s --max-time 10 https://houston.manus.space 2>/dev/null || echo "")
if echo "$HTML_CONTENT" | grep -q "COMMIT_SHA_SHORT"; then
  echo "✅ Commit-Hash in HTML gefunden: COMMIT_SHA_SHORT"
else
  echo "⚠️  WARNUNG: Commit-Hash nicht in HTML gefunden (kann normal sein, wenn nicht eingebettet)"
fi

# Test 3: Keine offensichtlichen Fehler im HTML?
if echo "$HTML_CONTENT" | grep -qi "error\|exception\|fatal"; then
  echo "⚠️  WARNUNG: Mögliche Fehler im HTML gefunden"
  echo "$HTML_CONTENT" | grep -i "error\|exception\|fatal" | head -3
else
  echo "✅ Keine offensichtlichen Fehler im HTML"
fi

# Test 4: index.html vorhanden und nicht leer?
if [ -f "$DEPLOY_DIR/index.html" ] && [ -s "$DEPLOY_DIR/index.html" ]; then
  HTML_SIZE=$(stat -f%z "$DEPLOY_DIR/index.html" 2>/dev/null || stat -c%s "$DEPLOY_DIR/index.html" 2>/dev/null || echo "0")
  if [ "$HTML_SIZE" -gt 1000 ]; then
    echo "✅ index.html vorhanden und ausreichend groß ($HTML_SIZE bytes)"
  else
    echo "⚠️  WARNUNG: index.html ist sehr klein ($HTML_SIZE bytes) - möglicherweise fehlerhaft"
  fi
else
  echo "❌ FEHLER: index.html fehlt oder ist leer"
  exit 1
fi

# Test 5: Assets-Verzeichnis vorhanden?
if [ -d "$DEPLOY_DIR/assets" ]; then
  ASSET_COUNT=$(find "$DEPLOY_DIR/assets" -type f | wc -l)
  echo "✅ Assets-Verzeichnis vorhanden mit $ASSET_COUNT Dateien"
else
  echo "⚠️  WARNUNG: Assets-Verzeichnis fehlt"
fi

# Logge erfolgreiches Deployment
LOG_FILE="/var/log/houston-deployment.log"
mkdir -p $(dirname $LOG_FILE) 2>/dev/null
AUDIT_MSG="[AUDIT] $(date -u +%Y-%m-%dT%H:%M:%SZ) - Deployment erfolgreich - Commit: COMMIT_SHA_SHORT - HTTP: $HTTP_CODE - Dateien: $DEPLOYED_FILE_COUNT"
echo "$AUDIT_MSG" | sudo tee -a $LOG_FILE 2>/dev/null || echo "$AUDIT_MSG"

echo "✅ Post-Deployment-Validierung abgeschlossen"
echo "✅ Deployment erfolgreich: Commit COMMIT_SHA_SHORT deployed um $(date -u +%Y-%m-%dT%H:%M:%SZ)"

🚨 FEHLERBEHANDLUNG:
- Falls alle Deployment-Methoden fehlschlagen:
- Gib eine detaillierte Fehlermeldung aus mit: Fehlercode, betroffene Methode, letzte erfolgreiche Aktion
- Erstelle ein Backup des aktuellen Zustands: cp -r $DEPLOY_DIR $DEPLOY_DIR.error.$(date +%s)
- Versuche nicht, das Deployment zu erzwingen - gib stattdessen klare Fehlerinformationen aus
- Spezifische HTTP-Status-Codes beachten:
  - 401/403: Authentifizierungsfehler - Deployment abbrechen
  - 404: Endpoint nicht gefunden - Fallback-Methode verwenden
  - 409: Konflikt (z.B. gleichzeitiges Deployment) - Warten und erneut versuchen
  - 500: Server-Fehler - Rollback durchführen
  - Andere Fehler: Detaillierte Fehlermeldung ausgeben und abbrechen

📋 AUDIT-LOGGING:
- Logge alle wichtigen Schritte sowohl in stdout als auch in Log-Datei:
  - LOG_FILE="/var/log/houston-deployment.log"
  - mkdir -p $(dirname $LOG_FILE) 2>/dev/null
  - Für jede wichtige Aktion: echo "[AUDIT] $(date -u +%Y-%m-%dT%H:%M:%SZ) - [AKTION] - Commit: COMMIT_SHA_SHORT" | sudo tee -a $LOG_FILE 2>/dev/null || echo "[AUDIT] $(date -u +%Y-%m-%dT%H:%M:%SZ) - [AKTION] - Commit: COMMIT_SHA_SHORT"
- Wichtige Aktionen zum Loggen: Repository geklont, Commit verifiziert, Build erfolgreich, Backup erstellt, Dateien kopiert, Webserver neu geladen, Validierung durchgeführt, Deployment erfolgreich/fehlgeschlagen
- Falls Log-Datei nicht beschreibbar ist, logge nur in stdout (nicht abbrechen)
PROMPT_EOF
