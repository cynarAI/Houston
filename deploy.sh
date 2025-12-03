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

# Git Info sammeln
echo -e "${BLUE}📋 Sammle Git-Informationen...${NC}"
COMMIT_SHA=$(git rev-parse HEAD)
COMMIT_SHORT=$(git rev-parse --short HEAD)
COMMIT_MESSAGE=$(git log -1 --pretty=%B | head -1)
BRANCH=$(git rev-parse --abbrev-ref HEAD)

echo "  Branch: $BRANCH"
echo "  Commit: $COMMIT_SHORT"
echo "  Message: $COMMIT_MESSAGE"
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

PROMPT="WICHTIG: Führe diese Schritte AUTOMATISCH aus, ohne Rückfragen!

AUFGABE: Veröffentliche die Houston App auf houston.manus.space

SCHRITT 1: Repository klonen und zum korrekten Commit wechseln
git clone https://github.com/cynarAI/Houston.git /home/ubuntu/houston-deploy
cd /home/ubuntu/houston-deploy
git checkout $COMMIT_SHA

SCHRITT 2: Dependencies installieren und bauen
pnpm install
pnpm build

SCHRITT 3: App veröffentlichen
Verwende die Manus Publish-Funktion um die gebaute App auf houston.manus.space zu veröffentlichen.

WICHTIGE INFOS:
- Commit: $COMMIT_SHORT
- Branch: $BRANCH
- Nachricht: $COMMIT_MESSAGE
- Die App wurde bereits lokal gebaut und getestet
- Die App verwendet vite-plugin-manus-runtime
- Keine Rückfragen - einfach ausführen!"

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
