#!/bin/bash
# EINFACHER, DIREKTER DEPLOYMENT-PROMPT
# Minimale Logik, maximale Klarheit

cat << 'PROMPT_EOF'
🚀 EINFACHES DEPLOYMENT FÜR HOUSTON APP

ZIEL: Deploye Commit COMMIT_SHA_SHORT (COMMIT_SHA_FULL) nach houston.manus.space

SCHRITT 1: Repository klonen
cd /tmp
rm -rf houston-deploy 2>/dev/null || true
git clone https://github.com/cynarAI/Houston.git houston-deploy
cd houston-deploy
git checkout COMMIT_SHA_FULL

# Verifiziere Commit
ACTUAL_SHA=$(git rev-parse HEAD)
if [ "$ACTUAL_SHA" != "COMMIT_SHA_FULL" ]; then
  echo "❌ FEHLER: Falscher Commit!"
  exit 1
fi
echo "✅ Commit: $ACTUAL_SHA"

SCHRITT 2: Build (falls nicht vorhanden)
if [ ! -f dist/public/index.html ]; then
  pnpm install --frozen-lockfile
  pnpm build
fi

# Verifiziere Build
if [ ! -f dist/public/index.html ]; then
  echo "❌ FEHLER: Build fehlgeschlagen!"
  exit 1
fi
echo "✅ Build vorhanden"

SCHRITT 3: Finde Deployment-Verzeichnis
# Versuche verschiedene Verzeichnisse
DEPLOY_DIR=""
for DIR in /var/www/html /var/www/houston.manus.space /var/www/houston; do
  if [ -d "$DIR" ]; then
    DEPLOY_DIR="$DIR"
    echo "✅ Gefunden: $DEPLOY_DIR"
    break
  fi
done

# Falls nicht gefunden, suche nach laufendem Node-Prozess
if [ -z "$DEPLOY_DIR" ]; then
  NODE_PID=$(ps aux | grep "node.*dist/index.js" | grep -v grep | head -1 | awk '{print $2}')
  if [ ! -z "$NODE_PID" ]; then
    PROC_DIR=$(lsof -p $NODE_PID 2>/dev/null | grep cwd | awk '{print $NF}' | head -1)
    if [ ! -z "$PROC_DIR" ] && [ -d "$PROC_DIR/dist/public" ]; then
      DEPLOY_DIR="$PROC_DIR/dist/public"
      echo "✅ Gefunden via Node-Prozess: $DEPLOY_DIR"
    fi
  fi
fi

# Fallback
if [ -z "$DEPLOY_DIR" ]; then
  DEPLOY_DIR="/var/www/html"
  echo "⚠️  Verwende Fallback: $DEPLOY_DIR"
fi

echo "📁 Deployment-Verzeichnis: $DEPLOY_DIR"

SCHRITT 4: Backup erstellen
BACKUP_DIR="${DEPLOY_DIR}.backup.$(date +%s)"
if [ -d "$DEPLOY_DIR" ]; then
  sudo cp -r "$DEPLOY_DIR" "$BACKUP_DIR" 2>/dev/null || cp -r "$DEPLOY_DIR" "$BACKUP_DIR"
  echo "✅ Backup: $BACKUP_DIR"
fi

SCHRITT 5: Lösche alte Dateien
echo "🗑️  Lösche alte Dateien..."
sudo rm -rf "$DEPLOY_DIR/assets"/* 2>/dev/null || rm -rf "$DEPLOY_DIR/assets"/*
sudo rm -f "$DEPLOY_DIR/index.html" 2>/dev/null || rm -f "$DEPLOY_DIR/index.html"
echo "✅ Alte Dateien gelöscht"

SCHRITT 6: Kopiere neue Dateien
echo "📤 Kopiere neue Dateien..."
sudo cp -r dist/public/* "$DEPLOY_DIR/" 2>/dev/null || cp -r dist/public/* "$DEPLOY_DIR/"
sudo chmod -R 755 "$DEPLOY_DIR" 2>/dev/null || chmod -R 755 "$DEPLOY_DIR"
echo "✅ Dateien kopiert"

# Verifiziere
NEW_JS=$(grep -o 'src="[^"]*index-[^"]*\.js"' "$DEPLOY_DIR/index.html" | head -1)
echo "📋 Neue JS-Datei: $NEW_JS"
if [ -f "$DEPLOY_DIR/assets/$(echo $NEW_JS | sed 's|src="/assets/||;s|"||')" ]; then
  echo "✅ JS-Datei existiert"
else
  echo "⚠️  JS-Datei fehlt!"
fi

SCHRITT 7: Server neu starten (KRITISCH!)
echo "🔄 Starte Server neu..."

# Methode 1: Systemd
if sudo systemctl restart houston 2>/dev/null; then
  echo "✅ Server restarted via systemctl"
elif sudo systemctl restart houston-app 2>/dev/null; then
  echo "✅ Server restarted via systemctl (houston-app)"
else
  # Methode 2: Finde Node-Prozess und starte neu
  NODE_PID=$(ps aux | grep "node.*dist/index.js" | grep -v grep | head -1 | awk '{print $2}')
  if [ ! -z "$NODE_PID" ]; then
    echo "🔄 Gefundener Prozess: PID $NODE_PID"
    
    # Finde Arbeitsverzeichnis
    PROC_DIR=$(lsof -p $NODE_PID 2>/dev/null | grep cwd | awk '{print $NF}' | head -1)
    echo "📁 Prozess-Verzeichnis: $PROC_DIR"
    
    if [ ! -z "$PROC_DIR" ] && [ -d "$PROC_DIR" ]; then
      # Beende Prozess
      echo "🛑 Beende Prozess..."
      kill $NODE_PID 2>/dev/null
      sleep 3
      if ps -p $NODE_PID > /dev/null 2>&1; then
        kill -9 $NODE_PID 2>/dev/null
        sleep 2
      fi
      
      # Starte neu
      cd "$PROC_DIR"
      if [ -f "dist/index.js" ]; then
        echo "🚀 Starte Server neu..."
        nohup node dist/index.js > /tmp/houston-restart.log 2>&1 &
        sleep 3
        if ps -p $! > /dev/null 2>&1; then
          echo "✅ Server neu gestartet (PID: $!)"
        else
          echo "⚠️  Server-Start fehlgeschlagen - prüfe /tmp/houston-restart.log"
        fi
      fi
    fi
  else
    echo "⚠️  Kein Node-Prozess gefunden - Server läuft möglicherweise anders"
  fi
fi

SCHRITT 8: Webserver reload
if systemctl is-active --quiet nginx 2>/dev/null; then
  sudo systemctl reload nginx 2>/dev/null && echo "✅ Nginx reloaded"
elif systemctl is-active --quiet apache2 2>/dev/null; then
  sudo systemctl reload apache2 2>/dev/null && echo "✅ Apache reloaded"
fi

SCHRITT 9: Verifiziere Live-Seite
echo "🌐 Prüfe Live-Seite..."
sleep 5

LIVE_HTML=$(curl -s --max-time 10 "https://houston.manus.space/?nocache=$(date +%s)" 2>/dev/null)
if [ ! -z "$LIVE_HTML" ]; then
  LIVE_JS=$(echo "$LIVE_HTML" | grep -o 'src="[^"]*index-[^"]*\.js"' | head -1)
  echo "📋 Live-Seite lädt: $LIVE_JS"
  echo "📋 Deployed: $NEW_JS"
  
  if [ "$LIVE_JS" = "$NEW_JS" ]; then
    echo "✅ ERFOLG: Live-Seite lädt neue Dateien!"
  else
    echo "⚠️  WARNUNG: Live-Seite lädt andere Dateien!"
    echo "   Möglicherweise falsches Verzeichnis oder Server nicht neu gestartet"
  fi
else
  echo "⚠️  Konnte Live-Seite nicht abrufen"
fi

echo "✅ Deployment abgeschlossen"
PROMPT_EOF
