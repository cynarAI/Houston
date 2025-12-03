#!/bin/bash
# Vercel Setup Script - Programmatische Konfiguration

set -e

echo "🚀 Vercel Setup - Programmatische Konfiguration"
echo ""

# Prüfe ob Vercel CLI installiert ist
if ! command -v vercel &> /dev/null; then
  echo "📦 Installiere Vercel CLI..."
  npm install -g vercel@latest
fi

# Prüfe ob VERCEL_TOKEN gesetzt ist
if [ -z "$VERCEL_TOKEN" ]; then
  echo "❌ VERCEL_TOKEN ist nicht gesetzt!"
  echo "💡 Setze VERCEL_TOKEN als Environment Variable oder GitHub Secret"
  exit 1
fi

# Prüfe ob VERCEL_ORG_ID gesetzt ist
if [ -z "$VERCEL_ORG_ID" ]; then
  echo "⚠️  VERCEL_ORG_ID ist nicht gesetzt - wird automatisch ermittelt"
fi

# Prüfe ob VERCEL_PROJECT_ID gesetzt ist
if [ -z "$VERCEL_PROJECT_ID" ]; then
  echo "⚠️  VERCEL_PROJECT_ID ist nicht gesetzt - wird automatisch ermittelt"
fi

echo "✅ Vercel CLI verfügbar: $(vercel --version)"
echo ""

# Login mit Token
echo "🔐 Login zu Vercel..."
vercel login --token "$VERCEL_TOKEN" || {
  echo "❌ Login fehlgeschlagen!"
  exit 1
}

# Link zu bestehendem Projekt oder erstelle neues
if [ -n "$VERCEL_PROJECT_ID" ] && [ -n "$VERCEL_ORG_ID" ]; then
  echo "🔗 Linke zu bestehendem Projekt..."
  vercel link --yes --token "$VERCEL_TOKEN" --project "$VERCEL_PROJECT_ID" --scope "$VERCEL_ORG_ID" || {
    echo "⚠️  Link fehlgeschlagen - versuche Projekt zu erstellen..."
  }
else
  echo "📦 Erstelle neues Projekt..."
  vercel link --yes --token "$VERCEL_TOKEN" || {
    echo "❌ Projekt-Erstellung fehlgeschlagen!"
    exit 1
  }
fi

# Domain hinzufügen
DOMAIN="houston.manus.space"
echo ""
echo "🌐 Füge Domain hinzu: $DOMAIN"

# Prüfe ob Domain bereits existiert
if vercel domains ls --token "$VERCEL_TOKEN" | grep -q "$DOMAIN"; then
  echo "✅ Domain $DOMAIN existiert bereits"
else
  echo "➕ Füge Domain $DOMAIN hinzu..."
  vercel domains add "$DOMAIN" --token "$VERCEL_TOKEN" || {
    echo "⚠️  Domain konnte nicht automatisch hinzugefügt werden"
    echo "💡 Domain muss manuell im Vercel Dashboard hinzugefügt werden"
    echo "💡 Oder DNS-Records müssen zuerst konfiguriert werden"
  }
fi

# Zeige DNS-Records
echo ""
echo "📋 DNS-Records für $DOMAIN:"
vercel domains inspect "$DOMAIN" --token "$VERCEL_TOKEN" || {
  echo "⚠️  Domain-Details konnten nicht abgerufen werden"
}

echo ""
echo "✅ Vercel Setup abgeschlossen!"
echo ""
echo "📝 Nächste Schritte:"
echo "1. Konfiguriere DNS-Records bei Manus (siehe oben)"
echo "2. Warte auf DNS-Propagierung (5-60 Minuten)"
echo "3. Prüfe Domain-Verfügbarkeit: curl https://$DOMAIN"
