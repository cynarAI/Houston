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

SCHRITT 2: Verwende bereits gebaute Artefakte ODER baue neu (PRODUCTION BUILD!)
═══════════════════════════════════════════════════════════════════

⚠️ KRITISCH: Prüfe ZUERST ob dist/public/ bereits existiert (vom GitHub Actions Build)!
⚠️ KRITISCH: Wenn dist/public/ bereits existiert, verwende diese Dateien - baue NICHT nochmal!
⚠️ KRITISCH: Nur wenn dist/public/ NICHT existiert, baue neu mit NODE_ENV=production!

# Prüfe ob Build-Artefakte bereits vorhanden sind
if [ -f dist/public/index.html ] && [ -d dist/public/assets ]; then
  echo "✅ Build-Artefakte bereits vorhanden (vom GitHub Actions Build)!"
  echo "📁 Verwende vorhandene Build-Artefakte..."
  echo "📊 Anzahl Dateien im vorhandenen Build:"
  find dist/public -type f | wc -l
  echo "📁 Build-Verzeichnis-Inhalt:"
  ls -la dist/public/ | head -10
  
  # Verifiziere dass es ein Production-Build ist
  if grep -r "vite" dist/public/*.html 2>/dev/null | grep -q "dev"; then
    echo "⚠️  WARNUNG: Möglicherweise Dev-Mode erkannt in vorhandenem Build!"
    echo "   Baue neu mit Production-Modus..."
    BUILD_NEEDED=true
  else
    echo "✅ Vorhandene Build-Artefakte sind Production-Builds - verwende diese!"
    BUILD_NEEDED=false
  fi
else
  echo "⚠️  Build-Artefakte nicht vorhanden - baue neu..."
  BUILD_NEEDED=true
fi

# Nur bauen wenn nötig
if [ "$BUILD_NEEDED" = "true" ]; then
  echo "🏗️ Starte PRODUCTION BUILD..."
  
  # Setze Production-Umgebung
  export NODE_ENV=production
  echo "✅ NODE_ENV gesetzt: $NODE_ENV"
  
  # Installiere Dependencies
  pnpm install --frozen-lockfile
  
  # Baue die App im PRODUCTION-Modus
  pnpm build
  
  # Verifiziere dass dist/public/ existiert und Production-Build enthält
  echo "🔍 Verifiziere Build-Artefakte..."
  if [ ! -f dist/public/index.html ]; then
    echo "❌ FEHLER: index.html fehlt nach Build!"
    echo "   Build ist fehlgeschlagen oder wurde nicht ausgeführt!"
    exit 1
  fi
  
  if [ ! -d dist/public/assets ]; then
    echo "⚠️  WARNUNG: assets/ Verzeichnis fehlt nach Build!"
    echo "   Das könnte bedeuten, dass der Build nicht vollständig war!"
  fi
  
  # Zeige Build-Informationen
  echo "✅ Build erfolgreich!"
  echo "📁 Build-Verzeichnis-Inhalt:"
  ls -la dist/public/ | head -10
  echo "📊 Anzahl Dateien im Build:"
  find dist/public -type f | wc -l
  
  # Verifiziere dass es ein Production-Build ist (keine Dev-Dateien)
  if grep -r "vite" dist/public/*.html 2>/dev/null | grep -q "dev"; then
    echo "⚠️  WARNUNG: Möglicherweise Dev-Mode erkannt in HTML!"
  fi
fi

# Finale Verifikation
if [ ! -f dist/public/index.html ]; then
  echo "❌ FEHLER: index.html fehlt nach Build/Verifikation!"
  exit 1
fi

⚠️ WICHTIG: Das dist/public/ Verzeichnis muss die PRODUCTION-BUILD-Dateien enthalten (index.html, assets/, etc.)!
⚠️ WICHTIG: Verwende die bereits gebauten Artefakte wenn vorhanden - baue nur wenn nötig!

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

# Methode 2: Suche nach laufenden Node-Prozessen (KRITISCH für Full-Stack App!)
if [ -z "$DEPLOY_DIR" ]; then
  echo "🔍 Suche nach laufenden Node-Prozessen..."
  NODE_PID=$(ps aux | grep -i "node.*dist/index.js\|node.*houston\|node.*server" | grep -v grep | head -1 | awk '{print $2}')
  if [ ! -z "$NODE_PID" ]; then
    echo "✅ Node Prozess gefunden (PID: $NODE_PID)"
    
    # Finde das Arbeitsverzeichnis des Prozesses
    PROC_CWD=$(pwdx $NODE_PID 2>/dev/null | awk '{print $2}' || lsof -p $NODE_PID 2>/dev/null | grep cwd | awk '{print $NF}' | head -1)
    
    if [ ! -z "$PROC_CWD" ] && [ -d "$PROC_CWD/dist/public" ]; then
      DEPLOY_DIR="$PROC_CWD/dist/public"
      echo "✅ Deployment-Verzeichnis aus Node-Prozess gefunden: $DEPLOY_DIR"
    elif [ ! -z "$PROC_CWD" ]; then
      # Versuche dist/public relativ zum Arbeitsverzeichnis zu finden
      if [ -d "$PROC_CWD/dist/public" ]; then
        DEPLOY_DIR="$PROC_CWD/dist/public"
        echo "✅ Deployment-Verzeichnis relativ zum Prozess-CWD: $DEPLOY_DIR"
      fi
    fi
    
    # Alternative: Finde dist/public durch lsof
    DIST_PUBLIC=$(lsof -p $NODE_PID 2>/dev/null | grep "dist/public/index.html" | awk '{print $NF}' | head -1)
    if [ ! -z "$DIST_PUBLIC" ] && [ -f "$DIST_PUBLIC" ]; then
      DEPLOY_DIR=$(dirname "$DIST_PUBLIC")
      echo "✅ Deployment-Verzeichnis durch lsof gefunden: $DEPLOY_DIR"
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

# Methode 4: Suche nach dist/public Verzeichnissen (KRITISCH für Node.js App!)
if [ -z "$DEPLOY_DIR" ]; then
  echo "🔍 Suche nach dist/public Verzeichnissen (Node.js App)..."
  # Suche nach dist/public/index.html in verschiedenen Verzeichnissen
  DIST_PUBLIC_DIRS=$(find /home /opt /var -type d -path "*/dist/public" 2>/dev/null | grep -v "/home/ubuntu/houston-deploy" | head -5)
  if [ ! -z "$DIST_PUBLIC_DIRS" ]; then
    # Prüfe welches Verzeichnis eine gültige index.html hat
    for DIR in $DIST_PUBLIC_DIRS; do
      if [ -f "$DIR/index.html" ] && [ -d "$DIR/assets" ]; then
        DEPLOY_DIR="$DIR"
        echo "✅ Gefunden: $DEPLOY_DIR (dist/public mit index.html und assets/)"
        break
      fi
    done
  fi
fi

# Methode 4b: Suche mit find-Befehlen (AUSSCHLIESSLICH /var/www - NICHT /home!)
if [ -z "$DEPLOY_DIR" ]; then
  echo "🔍 Suche mit find-Befehlen in /var/www..."
  FOUND_DIR=$(find /var/www -type d -name "*houston*" 2>/dev/null | head -1)
  if [ ! -z "$FOUND_DIR" ]; then
    DEPLOY_DIR="$FOUND_DIR"
    echo "✅ Gefunden mit find: $DEPLOY_DIR"
  fi
fi

# Methode 5: Prüfe aktuelle Live-Seite um Deployment-Verzeichnis zu finden
if [ -z "$DEPLOY_DIR" ]; then
  echo "🔍 Prüfe aktuelle Live-Seite um Deployment-Verzeichnis zu finden..."
  # Versuche index.html von der Live-Seite zu finden
  CURRENT_HTML=$(curl -s https://houston.manus.space 2>/dev/null | head -c 1000)
  if [ ! -z "$CURRENT_HTML" ]; then
    # Suche nach Verzeichnissen die index.html enthalten und nicht das Clone-Verzeichnis sind
    POSSIBLE_DIRS=$(find /var/www -name "index.html" -type f 2>/dev/null | grep -v "/home/ubuntu/houston-deploy" | head -3)
    if [ ! -z "$POSSIBLE_DIRS" ]; then
      DEPLOY_DIR=$(dirname $(echo "$POSSIBLE_DIRS" | head -1))
      echo "✅ Gefunden durch Live-Seite-Analyse: $DEPLOY_DIR"
    fi
  fi
fi

# Fallback: Standard-Verzeichnis (NICHT /home/ubuntu/houston-deploy!)
if [ -z "$DEPLOY_DIR" ]; then
  DEPLOY_DIR="/var/www/html"
  echo "⚠️  Fallback zu Standard-Verzeichnis: $DEPLOY_DIR"
fi

# KRITISCH: Stelle sicher, dass wir NICHT ins Clone-Verzeichnis deployen!
if echo "$DEPLOY_DIR" | grep -q "/home/ubuntu/houston-deploy"; then
  echo "❌ FEHLER: Deployment-Verzeichnis ist das Clone-Verzeichnis - das ist falsch!"
  echo "   Verwende stattdessen /var/www/html"
  DEPLOY_DIR="/var/www/html"
  echo "✅ Korrigiert zu: $DEPLOY_DIR"
fi

# Verifiziere, dass Verzeichnis existiert
if [ ! -d "$DEPLOY_DIR" ]; then
  echo "⚠️  Verzeichnis existiert nicht, erstelle es..."
  sudo mkdir -p "$DEPLOY_DIR" 2>/dev/null || mkdir -p "$DEPLOY_DIR"
fi

# KRITISCH: Verifiziere dass das Deployment-Verzeichnis mit dem Webserver übereinstimmt
echo "🔍 Verifiziere Webserver-Konfiguration..."
NGINX_ROOT=""
APACHE_ROOT=""

# Prüfe Nginx-Konfiguration für houston.manus.space
if [ -f "/etc/nginx/sites-enabled/houston.manus.space" ]; then
  NGINX_ROOT=$(grep -o 'root [^;]*' /etc/nginx/sites-enabled/houston.manus.space | sed 's/root //' | head -1 | xargs)
  echo "   Nginx root für houston.manus.space: $NGINX_ROOT"
elif [ -f "/etc/nginx/sites-available/houston.manus.space" ]; then
  NGINX_ROOT=$(grep -o 'root [^;]*' /etc/nginx/sites-available/houston.manus.space | sed 's/root //' | head -1 | xargs)
  echo "   Nginx root für houston.manus.space (available): $NGINX_ROOT"
fi

# Prüfe Apache-Konfiguration
if [ -f "/etc/apache2/sites-enabled/houston.manus.space.conf" ]; then
  APACHE_ROOT=$(grep -i "DocumentRoot" /etc/apache2/sites-enabled/houston.manus.space.conf | awk '{print $2}' | head -1 | xargs)
  echo "   Apache DocumentRoot für houston.manus.space: $APACHE_ROOT"
fi

# Wenn Webserver ein anderes Verzeichnis verwendet, korrigiere DEPLOY_DIR
if [ ! -z "$NGINX_ROOT" ] && [ "$DEPLOY_DIR" != "$NGINX_ROOT" ]; then
  echo "⚠️  WARNUNG: Nginx verwendet anderes Verzeichnis: $NGINX_ROOT"
  echo "   Korrigiere DEPLOY_DIR zu: $NGINX_ROOT"
  DEPLOY_DIR="$NGINX_ROOT"
elif [ ! -z "$APACHE_ROOT" ] && [ "$DEPLOY_DIR" != "$APACHE_ROOT" ]; then
  echo "⚠️  WARNUNG: Apache verwendet anderes Verzeichnis: $APACHE_ROOT"
  echo "   Korrigiere DEPLOY_DIR zu: $APACHE_ROOT"
  DEPLOY_DIR="$APACHE_ROOT"
fi

# Stelle sicher, dass das Verzeichnis existiert
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

# KRITISCH: Lösche alte Assets-Dateien ZUERST, da Vite neue Hash-Namen generiert!
# Alte Dateien würden sonst auf dem Server bleiben und Browser könnten sie laden
echo "🗑️  Lösche alte Assets-Dateien (wichtig: Vite generiert neue Hash-Namen)..."
if [ -d "$DEPLOY_DIR/assets" ]; then
  echo "   Lösche: $DEPLOY_DIR/assets/*"
  sudo rm -rf "$DEPLOY_DIR/assets"/* 2>/dev/null || rm -rf "$DEPLOY_DIR/assets"/*
  echo "✅ Alte Assets gelöscht"
else
  echo "⚠️  Assets-Verzeichnis existiert nicht, wird erstellt"
fi

# Zähle Dateien vor dem Kopieren
SOURCE_FILE_COUNT=$(find dist/public -type f | wc -l)
echo "📊 Anzahl zu kopierender Dateien: $SOURCE_FILE_COUNT"

# KRITISCH: Lösche auch index.html, damit die neue Version garantiert deployed wird
# (index.html enthält Referenzen auf neue Assets mit Hash-Namen)
if [ -f "$DEPLOY_DIR/index.html" ]; then
  echo "🗑️  Lösche alte index.html (enthält Referenzen auf alte Assets)..."
  sudo rm -f "$DEPLOY_DIR/index.html" 2>/dev/null || rm -f "$DEPLOY_DIR/index.html"
  echo "✅ Alte index.html gelöscht"
fi

# Kopiere Dateien (assets/ wird neu erstellt, index.html wird neu kopiert)
sudo cp -r dist/public/* "$DEPLOY_DIR/" 2>/dev/null || cp -r dist/public/* "$DEPLOY_DIR/"

# KRITISCH: Verifiziere dass die neue index.html auf neue Assets verweist
if [ -f "$DEPLOY_DIR/index.html" ]; then
  NEW_ASSET_REF=$(grep -o 'src="[^"]*index-[^"]*\.js"' "$DEPLOY_DIR/index.html" | head -1)
  echo "📋 Neue index.html verweist auf: $NEW_ASSET_REF"
  
  # Prüfe ob die referenzierte Datei existiert
  ASSET_FILE=$(echo "$NEW_ASSET_REF" | sed 's|src="/assets/||;s|"||')
  if [ -f "$DEPLOY_DIR/assets/$ASSET_FILE" ]; then
    echo "✅ Referenzierte Asset-Datei existiert: $ASSET_FILE"
  else
    echo "⚠️  WARNUNG: Referenzierte Asset-Datei fehlt: $ASSET_FILE"
  fi
else
  echo "❌ FEHLER: index.html wurde nicht kopiert!"
fi

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
  # Lösche Nginx Cache (falls vorhanden)
  if [ -d "/var/cache/nginx" ]; then
    sudo rm -rf /var/cache/nginx/* 2>/dev/null && echo "✅ Nginx Cache gelöscht" || echo "⚠️  Nginx Cache konnte nicht gelöscht werden"
  fi
  sudo systemctl reload nginx 2>/dev/null && echo "✅ Nginx reloaded" || echo "⚠️  Nginx reload fehlgeschlagen"
elif [ "$WEBSERVER" = "apache2" ]; then
  # Lösche Apache Cache (falls vorhanden)
  if [ -d "/var/cache/apache2" ]; then
    sudo rm -rf /var/cache/apache2/* 2>/dev/null && echo "✅ Apache Cache gelöscht" || echo "⚠️  Apache Cache konnte nicht gelöscht werden"
  fi
  sudo systemctl reload apache2 2>/dev/null && echo "✅ Apache reloaded" || echo "⚠️  Apache reload fehlgeschlagen"
else
  # Versuche beide mit Cache-Clearing
  if [ -d "/var/cache/nginx" ]; then
    sudo rm -rf /var/cache/nginx/* 2>/dev/null || true
  fi
  if [ -d "/var/cache/apache2" ]; then
    sudo rm -rf /var/cache/apache2/* 2>/dev/null || true
  fi
  sudo systemctl reload nginx 2>/dev/null && echo "✅ Nginx reloaded" || true
  sudo systemctl reload apache2 2>/dev/null && echo "✅ Apache reloaded" || true
fi

# KRITISCH: Versuche Node.js Prozess zu neustarten (falls vorhanden)
echo "🔄 Versuche Node.js Server neu zu starten..."

# Methode 1: Systemd Service
if sudo systemctl restart houston 2>/dev/null; then
  echo "✅ Houston Service restarted via systemctl"
elif sudo systemctl restart houston-app 2>/dev/null; then
  echo "✅ Houston App Service restarted via systemctl"
else
  # Methode 2: Finde laufenden Node-Prozess und starte neu
  NODE_PID=$(ps aux | grep -i "node.*dist/index.js\|node.*houston" | grep -v grep | head -1 | awk '{print $2}')
  if [ ! -z "$NODE_PID" ]; then
    echo "⚠️  Node-Prozess gefunden (PID: $NODE_PID), aber kein systemd Service"
    echo "   Der Server muss manuell neu gestartet werden, um die neuen Dateien zu laden"
    echo "   Befehl zum Neustart: kill -HUP $NODE_PID oder kill $NODE_PID && [START_COMMAND]"
  else
    echo "⚠️  Kein laufender Node.js-Prozess gefunden"
    echo "   Die App läuft möglicherweise als statische Website oder über einen anderen Webserver"
  fi
fi

sleep 2
echo "✅ Webserver-Reload abgeschlossen"

═══════════════════════════════════════════════════════════════════
SCHRITT 3.2.5: Verifiziere Deployment & Assets-Dateien
═══════════════════════════════════════════════════════════════════

echo "🔍 Verifiziere Deployment..."

# WICHTIG: Prüfe ob neue Assets-Dateien vorhanden sind
echo "📊 Prüfe deployte Assets-Dateien..."
if [ -d "$DEPLOY_DIR/assets" ]; then
  ASSET_COUNT=$(find "$DEPLOY_DIR/assets" -type f | wc -l)
  echo "   Anzahl Assets-Dateien: $ASSET_COUNT"
  
  # Prüfe ob neue index-*.js Dateien vorhanden sind
  NEW_INDEX_FILES=$(find "$DEPLOY_DIR/assets" -name "index-*.js" | wc -l)
  echo "   Anzahl index-*.js Dateien: $NEW_INDEX_FILES"
  
  if [ "$NEW_INDEX_FILES" -gt 0 ]; then
    echo "✅ Neue JavaScript-Dateien gefunden"
    # Zeige Dateinamen (für Debugging)
    find "$DEPLOY_DIR/assets" -name "index-*.js" | head -3 | while read file; do
      echo "   - $(basename "$file") ($(du -h "$file" | cut -f1))"
    done
  else
    echo "⚠️  WARNUNG: Keine index-*.js Dateien gefunden!"
  fi
else
  echo "❌ FEHLER: Assets-Verzeichnis fehlt!"
fi

# Prüfe ob index.html existiert und lesbar ist
if [ -f "$DEPLOY_DIR/index.html" ]; then
  echo "✅ index.html gefunden"
  # Prüfe ob index.html auf neue Assets verweist
  if grep -q "assets/index-" "$DEPLOY_DIR/index.html" 2>/dev/null; then
    echo "✅ index.html verweist auf Assets-Dateien"
  else
    echo "⚠️  WARNUNG: index.html verweist möglicherweise nicht auf Assets-Dateien"
  fi
else
  echo "❌ FEHLER: index.html fehlt!"
fi

# KRITISCH: Verifiziere dass die Live-Seite die neuen Dateien zeigt
echo "🌐 Prüfe Live-Seite nach Deployment..."
sleep 5  # Warte länger, damit Webserver und Node.js Zeit haben zu aktualisieren

# Cache-Busting: Verwende mehrere Methoden um Browser-Cache zu umgehen
CACHE_BUST=$(date +%s)
CACHE_BUST_RANDOM=$(shuf -i 1000-9999 -n 1)

# Versuche mehrere Cache-Busting-URLs
LIVE_HTML=""
for CACHE_PARAM in "?nocache=$CACHE_BUST" "?v=$CACHE_BUST_RANDOM" "?t=$CACHE_BUST&_=$CACHE_BUST_RANDOM" ""; do
  LIVE_HTML=$(curl -s --max-time 10 -H "Cache-Control: no-cache" -H "Pragma: no-cache" "https://houston.manus.space/$CACHE_PARAM" 2>/dev/null || echo "")
  if [ ! -z "$LIVE_HTML" ] && [ ${#LIVE_HTML} -gt 1000 ]; then
    echo "✅ Live-Seite erfolgreich abgerufen (mit Cache-Busting: $CACHE_PARAM)"
    break
  fi
done

if [ ! -z "$LIVE_HTML" ] && [ ${#LIVE_HTML} -gt 1000 ]; then
  # Prüfe welche JavaScript-Datei die Live-Seite lädt
  LIVE_ASSET=$(echo "$LIVE_HTML" | grep -o 'src="[^"]*index-[^"]*\.js"' | head -1)
  echo "   Live-Seite lädt: $LIVE_ASSET"
  
  # Prüfe welche JavaScript-Datei lokal deployed wurde
  DEPLOYED_ASSET=$(grep -o 'src="[^"]*index-[^"]*\.js"' "$DEPLOY_DIR/index.html" 2>/dev/null | head -1)
  echo "   Deployed index.html verweist auf: $DEPLOYED_ASSET"
  
  if [ ! -z "$LIVE_ASSET" ] && [ ! -z "$DEPLOYED_ASSET" ]; then
    if [ "$LIVE_ASSET" = "$DEPLOYED_ASSET" ]; then
      echo "✅ Live-Seite lädt die neuen Assets!"
    else
      echo "⚠️  WARNUNG: Live-Seite lädt andere Assets als deployed!"
      echo "   Live: $LIVE_ASSET"
      echo "   Deployed: $DEPLOYED_ASSET"
      echo "   Möglicherweise wird ein anderes Verzeichnis vom Webserver verwendet"
      echo "   Oder es gibt ein Caching-Problem (Browser/CDN/Proxy)"
      echo "   Oder der Node.js Server wurde nicht neu gestartet"
    fi
  fi
  
  # Prüfe ob die neue Überschrift auf der Live-Seite ist
  if echo "$LIVE_HTML" | grep -qi "Marketing.*nicht.*liegen"; then
    echo "✅ Neue Überschrift auf Live-Seite gefunden!"
  elif echo "$LIVE_HTML" | grep -qi "Steigere deine Marketing-Performance"; then
    echo "⚠️  WARNUNG: Alte Überschrift noch auf Live-Seite!"
    echo "   Das Deployment-Verzeichnis könnte falsch sein oder es gibt ein Caching-Problem"
    echo "   Oder der Node.js Server wurde nicht neu gestartet"
    echo "   Oder die JavaScript-Datei wurde nicht aktualisiert"
  else
    echo "⚠️  WARNUNG: Konnte Überschrift nicht eindeutig identifizieren"
  fi
  
  # Prüfe Cache-Control Header der Live-Seite
  CACHE_HEADER=$(curl -s -I --max-time 10 "https://houston.manus.space/?nocache=$CACHE_BUST" 2>/dev/null | grep -i "cache-control" || echo "")
  if [ ! -z "$CACHE_HEADER" ]; then
    echo "   Cache-Control Header: $CACHE_HEADER"
    if echo "$CACHE_HEADER" | grep -qi "no-cache\|no-store"; then
      echo "✅ Cache-Control Header korrekt gesetzt (no-cache/no-store)"
    else
      echo "⚠️  WARNUNG: Cache-Control Header erlaubt möglicherweise Caching"
    fi
  fi
else
  echo "⚠️  WARNUNG: Konnte Live-Seite nicht abrufen oder Antwort zu kurz"
  echo "   Versuche direkten Zugriff auf index.html..."
  
  # Versuche direkt auf index.html zuzugreifen
  DIRECT_HTML=$(curl -s --max-time 10 -H "Cache-Control: no-cache" "https://houston.manus.space/index.html?nocache=$CACHE_BUST" 2>/dev/null || echo "")
  if [ ! -z "$DIRECT_HTML" ] && [ ${#DIRECT_HTML} -gt 1000 ]; then
    echo "✅ Direkter Zugriff auf index.html erfolgreich"
    DIRECT_ASSET=$(echo "$DIRECT_HTML" | grep -o 'src="[^"]*index-[^"]*\.js"' | head -1)
    echo "   Direkte index.html lädt: $DIRECT_ASSET"
  fi
fi

echo "✅ Deployment-Verifizierung abgeschlossen"

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
