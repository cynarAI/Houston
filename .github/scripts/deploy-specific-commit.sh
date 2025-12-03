#!/bin/bash
# Deploye einen spezifischen Commit mit dem einfachen Prompt
# Usage: ./deploy-specific-commit.sh <COMMIT_SHA>

set -e

COMMIT_SHA="${1:-126d324}"

if [ -z "$MANUS_API_KEY" ]; then
  echo "❌ FEHLER: MANUS_API_KEY Umgebungsvariable nicht gesetzt!"
  echo "   Setze sie mit: export MANUS_API_KEY='dein-api-key'"
  exit 1
fi

# Hole Commit-Informationen
COMMIT_FULL=$(git rev-parse "$COMMIT_SHA")
COMMIT_SHORT=$(echo "$COMMIT_FULL" | cut -c1-7)
COMMIT_MESSAGE=$(git log -1 --pretty=%B "$COMMIT_SHA" | head -1)
COMMIT_TIMESTAMP=$(git log -1 --format=%ct "$COMMIT_SHA")
CHANGED_FILES=$(git diff --name-only "$COMMIT_SHA~1" "$COMMIT_SHA" 2>/dev/null | head -20 | tr '\n' ',' | sed 's/,$//' || echo "")

echo "📋 Deploye Commit: $COMMIT_SHORT ($COMMIT_FULL)"
echo "📝 Message: $COMMIT_MESSAGE"
echo "📁 Geänderte Dateien: $CHANGED_FILES"
echo ""

# Lade einfachen Prompt und ersetze Platzhalter
PROMPT=$(cat .github/scripts/simple-deployment-prompt.sh | \
  sed "s/COMMIT_SHA_SHORT/$COMMIT_SHORT/g" | \
  sed "s/COMMIT_SHA_FULL/$COMMIT_FULL/g" | \
  sed "s|COMMIT_MESSAGE|$(echo "$COMMIT_MESSAGE" | sed 's/"/\\"/g')|g" | \
  sed "s/COMMIT_TIMESTAMP/$COMMIT_TIMESTAMP/g" | \
  sed "s|CHANGED_FILES|$(echo "$CHANGED_FILES" | sed 's/"/\\"/g')|g" | \
  sed '/^#!/d' | \
  sed '/^cat << /d' | \
  sed '/^PROMPT_EOF$/d')

# Erstelle JSON-Payload
JSON_PAYLOAD=$(jq -n \
  --arg prompt "$PROMPT" \
  '{
    "prompt": $prompt,
    "agentProfile": "manus-1.5",
    "projectId": "9Ye7dFtLEUdP6ojxHpkQhu"
  }')

echo "🚀 Sende Deployment-Task an Manus API..."
echo ""

# Sende Task
RESPONSE=$(curl -s -w "\n%{http_code}" \
  --url https://api.manus.ai/v1/tasks \
  --header "API_KEY: $MANUS_API_KEY" \
  --header "Content-Type: application/json" \
  --data "$JSON_PAYLOAD")

HTTP_CODE=$(echo "$RESPONSE" | tail -1)
BODY=$(echo "$RESPONSE" | sed '$d')

echo "HTTP Status: $HTTP_CODE"
echo "Response: $BODY"
echo ""

if [ "$HTTP_CODE" -ne 200 ]; then
  echo "❌ FEHLER: Manus API request failed with status $HTTP_CODE"
  exit 1
fi

TASK_URL=$(echo "$BODY" | jq -r '.task_url // empty')
TASK_ID=$(echo "$BODY" | jq -r '.task_id // empty')

if [ -z "$TASK_ID" ] || [ -z "$TASK_URL" ]; then
  echo "❌ FEHLER: API response did not contain valid task_id or task_url"
  echo "Response body: $BODY"
  exit 1
fi

echo "✅ Deployment-Task erstellt!"
echo "📋 Task ID: $TASK_ID"
echo "🔗 Task URL: $TASK_URL"
echo ""
echo "💡 Du kannst den Fortschritt hier verfolgen: $TASK_URL"
