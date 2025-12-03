#!/bin/bash

# Houston Deployment Script
# Baut die App lokal und startet einen Deployment-Task über die Manus API

set -e  # Exit on error

# Farben für Output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Houston Deployment Script${NC}"
echo ""

# Prüfe ob MANUS_API_KEY gesetzt ist
if [ -z "$MANUS_API_KEY" ]; then
    echo -e "${RED}❌ Fehler: MANUS_API_KEY Umgebungsvariable ist nicht gesetzt!${NC}"
    echo ""
    echo "Bitte setzen Sie den API-Schlüssel:"
    echo "  export MANUS_API_KEY='ihr-api-schluessel'"
    echo ""
    echo "Oder fügen Sie diese Zeile zu Ihrer Shell-Konfiguration hinzu (~/.zshrc, ~/.bashrc)"
    exit 1
fi

# Prüfe ob pnpm installiert ist
if ! command -v pnpm &> /dev/null; then
    echo -e "${RED}❌ Fehler: pnpm ist nicht installiert!${NC}"
    echo "Installieren Sie pnpm mit: npm install -g pnpm"
    exit 1
fi

# Prüfe ob jq installiert ist
if ! command -v jq &> /dev/null; then
    echo -e "${RED}❌ Fehler: jq ist nicht installiert!${NC}"
    echo "Installieren Sie jq mit: brew install jq (macOS) oder apt-get install jq (Linux)"
    exit 1
fi

# Git Info sammeln und verifizieren
echo -e "${BLUE}📋 Sammle Git-Informationen und verifiziere aktuellen Stand...${NC}"
COMMIT_SHA=$(git rev-parse HEAD)
COMMIT_SHORT=$(git rev-parse --short HEAD)
COMMIT_MESSAGE=$(git log -1 --pretty=%B | head -1)
COMMIT_TIMESTAMP=$(git log -1 --format=%ct)
BRANCH=$(git rev-parse --abbrev-ref HEAD)

# Verifiziere dass wir auf einem sauberen Stand sind
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}⚠️  Warnung: Es gibt uncommitted Änderungen${NC}"
    git status --short
fi

echo "  Branch: $BRANCH"
echo "  Commit: $COMMIT_SHORT ($COMMIT_SHA)"
echo "  Message: $COMMIT_MESSAGE"
echo "  Timestamp: $COMMIT_TIMESTAMP"
echo ""
echo -e "${GREEN}✅ Aktueller Stand verifiziert${NC}"
echo ""

# Dependencies installieren
echo -e "${BLUE}📥 Installiere Dependencies...${NC}"
pnpm install --frozen-lockfile
echo -e "${GREEN}✅ Dependencies installiert${NC}"
echo ""

# Build
echo -e "${BLUE}🏗️  Baue Anwendung...${NC}"
pnpm build
echo -e "${GREEN}✅ Build erfolgreich${NC}"
echo ""

# Deployment Task erstellen
echo -e "${BLUE}🚀 Starte Deployment-Task...${NC}"

PROMPT="🚨 KRITISCH: Führe diese Schritte AUTOMATISCH aus, ohne Rückfragen! Stelle sicher, dass der AKTUELLE STAND deployed wird!

AUFGABE: Deploye die Houston App auf houston.manus.space mit dem EXAKTEN AKTUELLEN COMMIT

⚠️ WICHTIG: Du MUSST den Commit $COMMIT_SHORT ($COMMIT_SHA) deployen - KEINE andere Version!

SCHRITT 1: Repository klonen und zum EXAKTEN Commit wechseln (VERIFIZIERUNG ERFORDERLICH!)
git clone https://github.com/cynarAI/Houston.git /home/ubuntu/houston-deploy
cd /home/ubuntu/houston-deploy
git checkout $COMMIT_SHA

# KRITISCH: Verifiziere dass du wirklich auf dem richtigen Commit bist!
ACTUAL_SHA=\$(git rev-parse HEAD)
EXPECTED_SHA=\"$COMMIT_SHA\"
if [ \"\$ACTUAL_SHA\" != \"\$EXPECTED_SHA\" ]; then
  echo \"❌ FEHLER: Falscher Commit! Erwartet: \$EXPECTED_SHA, Aktuell: \$ACTUAL_SHA\"
  exit 1
fi
echo \"✅ Commit verifiziert: \$ACTUAL_SHA\"
git log -1 --oneline
echo \"📝 Commit-Nachricht: $COMMIT_MESSAGE\"
echo \"🕐 Commit-Timestamp: $COMMIT_TIMESTAMP\"

SCHRITT 2: Dependencies installieren und bauen (FRISCH - KEINE CACHES!)
pnpm install --frozen-lockfile
pnpm build

# WICHTIG: Prüfe dass dist/public/ Verzeichnis existiert und Dateien enthält
if [ ! -d \"dist/public\" ]; then
  echo \"❌ FEHLER: dist/public/ Verzeichnis existiert nicht!\"
  exit 1
fi
ls -la dist/public/ | head -10
test -f dist/public/index.html && echo \"✅ index.html gefunden\" || (echo \"❌ index.html fehlt!\" && exit 1)
test -d dist/public/assets && echo \"✅ assets/ Verzeichnis gefunden\" || echo \"⚠️  assets/ Verzeichnis fehlt\"

SCHRITT 3: App veröffentlichen (AKTUELLER STAND - VERIFIZIERUNG ERFORDERLICH!)
VOR dem Deployment:
- Verifiziere nochmal: git rev-parse HEAD sollte $COMMIT_SHORT sein
- Verifiziere dass dist/public/index.html existiert
- Verifiziere dass dist/public/assets/ existiert

Verwende die Manus Publish-Funktion um die gebaute App aus dist/public/ auf houston.manus.space zu veröffentlichen.
- Das dist/public/ Verzeichnis enthält alle gebauten Dateien
- Verwende die Manus Publish-Funktion mit dem dist/public/ Verzeichnis
- Stelle sicher, dass der AKTUELLE STAND deployed wird, nicht eine alte Version

NACH dem Deployment:
- Prüfe dass die Seite unter https://houston.manus.space erreichbar ist
- Stelle sicher, dass der AKTUELLE STAND deployed wurde, nicht eine alte Version

📋 WICHTIGE INFOS FÜR DICH:
- ⚠️ COMMIT ZU DEPLOYEN: $COMMIT_SHORT ($COMMIT_SHA) - DIESER EXAKTE COMMIT MUSS DEPLOYED WERDEN!
- Branch: $BRANCH
- Commit-Nachricht: $COMMIT_MESSAGE
- Commit-Timestamp: $COMMIT_TIMESTAMP
- Build-Verzeichnis: dist/public/ (nach pnpm build)
- Die App wurde bereits lokal gebaut und getestet
- Die App verwendet vite-plugin-manus-runtime
- Manus API Key: $MANUS_API_KEY (verwende diesen für die Publish-Funktion)
- Ziel-URL: houston.manus.space

🚨 KRITISCH: KEINE Rückfragen - einfach ausführen und den AKTUELLEN STAND deployen! Verifiziere den Commit vor und nach dem Deployment!"

# API-Aufruf
RESPONSE=$(curl -s -w "\n%{http_code}" --request POST \
  --url https://api.manus.ai/v1/tasks \
  --header "API_KEY: $MANUS_API_KEY" \
  --header "Content-Type: application/json" \
  --data "$(jq -n \
    --arg prompt "$PROMPT" \
    '{
      "prompt": $prompt,
      "agentProfile": "manus-1.5",
      "projectId": "9Ye7dFtLEUdP6ojxHpkQhu"
    }')")

HTTP_CODE=$(echo "$RESPONSE" | tail -1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -ne 200 ]; then
    echo -e "${RED}❌ Fehler: Manus API Anfrage fehlgeschlagen (Status: $HTTP_CODE)${NC}"
    echo "Response: $BODY"
    exit 1
fi

TASK_URL=$(echo "$BODY" | jq -r '.task_url // empty')
TASK_ID=$(echo "$BODY" | jq -r '.task_id // empty')

if [ -z "$TASK_ID" ] || [ -z "$TASK_URL" ]; then
    echo -e "${RED}❌ Fehler: API Response enthält keine gültige task_id oder task_url${NC}"
    echo "Response: $BODY"
    exit 1
fi

echo -e "${GREEN}✅ Deployment-Task erstellt!${NC}"
echo ""
echo -e "${YELLOW}📊 Deployment-Informationen:${NC}"
echo "  Task URL: $TASK_URL"
echo "  Task ID: $TASK_ID"
echo "  Commit: $COMMIT_SHORT"
echo "  Branch: $BRANCH"
echo ""
echo -e "${BLUE}💡 Tipp: Sie können den Fortschritt unter folgender URL verfolgen:${NC}"
echo "  $TASK_URL"
echo ""
