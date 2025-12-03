# Vercel Programmatisches Setup

**Datum:** 2025-12-03  
**Methode:** Automatisch via GitHub Actions & Vercel CLI

---

## ✅ Was wird automatisch gemacht

### 1. Vercel CLI Installation

- ✅ Automatisch installiert im Workflow
- ✅ Keine manuelle Installation nötig

### 2. Login zu Vercel

- ✅ Automatisch mit `VERCEL_TOKEN`
- ✅ Kein manuelles Login nötig

### 3. Projekt-Linking

- ✅ Automatisch zu bestehendem Projekt (falls `VERCEL_PROJECT_ID` und `VERCEL_ORG_ID` gesetzt)
- ✅ Oder neues Projekt erstellen

### 4. Domain hinzufügen

- ✅ Automatisch `houston.manus.space` hinzufügen
- ✅ DNS-Records anzeigen

---

## 🚀 Verwendung

### Option 1: GitHub Actions Workflow

**Workflow:** `.github/workflows/setup-vercel.yml`

1. **Gehe zu:** `https://github.com/cynarAI/Houston/actions`
2. **Wähle:** "Setup Vercel"
3. **Klicke:** "Run workflow"
4. **Wähle Branch:** `main`
5. **Setup Domain:** ✅ (Standard: true)
6. **Klicke:** "Run workflow"

**Das war's!** Der Workflow macht alles automatisch.

### Option 2: Lokal via Script

**Script:** `.github/scripts/setup-vercel.sh`

```bash
# Setze Environment Variables
export VERCEL_TOKEN="vercel_xxx..."
export VERCEL_ORG_ID="team_xxx..."  # Optional
export VERCEL_PROJECT_ID="prj_xxx..."  # Optional

# Führe Script aus
chmod +x .github/scripts/setup-vercel.sh
./github/scripts/setup-vercel.sh
```

---

## 📋 Benötigte Secrets

**GitHub Repository Secrets:**

| Secret              | Beschreibung           | Erforderlich |
| ------------------- | ---------------------- | ------------ |
| `VERCEL_TOKEN`      | Vercel API Token       | ✅ Ja        |
| `VERCEL_ORG_ID`     | Vercel Organization ID | ⚠️ Optional  |
| `VERCEL_PROJECT_ID` | Vercel Project ID      | ⚠️ Optional  |

**Wie man sie erhält:**

### VERCEL_TOKEN

1. Gehe zu: https://vercel.com/account/tokens
2. Klicke: "Create Token"
3. Name: `GitHub Actions Houston`
4. Scope: Full Account
5. Kopiere Token
6. Füge als GitHub Secret hinzu: `VERCEL_TOKEN`

### VERCEL_ORG_ID & VERCEL_PROJECT_ID

**Option A: Automatisch (empfohlen)**

- Workflow erstellt Projekt automatisch
- IDs werden automatisch gesetzt

**Option B: Manuell**

1. Gehe zu: Vercel Dashboard → Project Settings → General
2. Kopiere **Project ID** (`prj_xxx...`)
3. Kopiere **Team ID** (`team_xxx...`)
4. Füge als GitHub Secrets hinzu

---

## 🔧 Was der Workflow macht

### Schritt 1: Vercel CLI installieren

```bash
npm install -g vercel@latest
```

### Schritt 2: Login

```bash
vercel login --token "$VERCEL_TOKEN"
```

### Schritt 3: Projekt linken

```bash
# Falls IDs vorhanden:
vercel link --yes --project "$VERCEL_PROJECT_ID" --scope "$VERCEL_ORG_ID"

# Oder automatisch:
vercel link --yes
```

### Schritt 4: Domain hinzufügen

```bash
vercel domains add houston.manus.space
```

### Schritt 5: DNS-Records anzeigen

```bash
vercel domains inspect houston.manus.space
```

---

## 📊 Ergebnis

**Nach erfolgreichem Setup:**

- ✅ Projekt ist mit Vercel verlinkt
- ✅ Domain `houston.manus.space` ist hinzugefügt
- ✅ DNS-Records sind sichtbar
- ⏭️ DNS-Records müssen bei Manus konfiguriert werden

---

## ⚠️ Wichtige Hinweise

### DNS-Konfiguration

**Der Workflow fügt die Domain hinzu, aber:**

- DNS-Records müssen **bei Manus** konfiguriert werden
- Vercel zeigt die benötigten DNS-Records an
- DNS-Propagierung dauert 5-60 Minuten

### Environment Variables

**Environment Variables müssen separat gesetzt werden:**

- Im Vercel Dashboard → Project Settings → Environment Variables
- Oder via Vercel CLI: `vercel env add`

**Automatisches Setzen möglich:**

- Siehe `.github/workflows/setup-vercel-env.yml` (kann erstellt werden)

---

## 🎯 Nächste Schritte

1. ✅ **Workflow ausführen** (siehe oben)
2. ⏭️ **DNS-Records bei Manus konfigurieren**
3. ⏭️ **Environment Variables in Vercel setzen**
4. ⏭️ **Erstes Deployment testen**

---

**Erstellt:** 2025-12-03  
**Status:** ✅ Bereit für automatisches Setup
