# Landingpage Deployment - Umfassende Analyse & Plan

**Datum:** 2025-12-03  
**Status:** Problem identifiziert - Plan erstellt

---

## 🔍 Problem-Analyse

### Aktuelle Situation

**Live-Seite (`https://houston.manus.space`):**

- Zeigt alte Landingpage-Version mit:
  - Hero: "Steigere deine Marketing-Performance um 300% mit KI-gestützter Strategie"
  - Pricing: "Orbit Pack" und "Galaxy Pack"
  - Navigation: "Feature", "Screenshot", "Pricing", "FAQ", "Testimonial"
  - Meta-Tags enthalten noch `orbit-coach.manus.space` URLs

**Code (aktueller Stand):**

- Neue Landingpage-Version mit:
  - Hero: "Marketing, das nicht liegen bleibt" (via `t('landing.hero.title.part1')`)
  - Pricing: "Solo" (€9,99) und "Team" (€39,99)
  - Navigation: "How It Works", "Features", "Pricing", "FAQ"
  - Alle Texte über i18n (`de.json`)

**Letztes Deployment:**

- Commit: `7db291e` - "feat: Add production server deployment configuration"
- Datum: 2025-12-03T19:32:23Z
- Status: ✅ Erfolgreich

---

## 🔎 Root Cause Analysis

### 1. Deployment-System verstanden

**GitHub Actions Workflow (`.github/workflows/optimized-ci.yml`):**

1. **Trigger:** Push zu `main` Branch
2. **Build-Job:**
   - Checkout Code
   - Install Dependencies (`pnpm install`)
   - Build App (`pnpm build`) → erstellt `dist/public/`
   - Upload Artefakte
3. **Deploy-Job:**
   - Download Artefakte
   - Erstelle Deployment-Prompt (aus `.github/scripts/deployment-prompt-template.sh`)
   - Sende Task an Manus API (`/v1/tasks`)
   - Manus Agent führt Deployment aus

**Deployment-Prompt:**

- Lädt Template aus `.github/scripts/deployment-prompt-template.sh`
- Ersetzt Platzhalter (COMMIT_SHA_SHORT, COMMIT_SHA_FULL, etc.)
- Agent klont Repository, baut App, deployed Dateien

### 2. Mögliche Ursachen für das Problem

**Option A: Alte Version deployed**

- Die Live-Seite zeigt eine Version, die nicht dem aktuellen Code entspricht
- Mögliche Ursache: Deployment hat nicht die neueste Version deployed

**Option B: Cache-Problem**

- Browser-Cache zeigt alte Version
- Server-Cache (Nginx/CDN) zeigt alte Assets
- Build-Artefakte wurden nicht richtig aktualisiert

**Option C: Falsche Dateien deployed**

- Es gibt mehrere Landingpage-Dateien (`Landing.tsx`, `Landing.tsx.backup`)
- Falsche Datei wurde deployed

**Option D: Übersetzungsdateien fehlen**

- Die neue Landingpage verwendet `t('landing.*')` Keys
- Übersetzungsdateien wurden nicht deployed oder sind nicht aktuell

### 3. Verifizierung

**Code-Analyse:**

- ✅ `client/src/pages/Landing.tsx` verwendet neue Übersetzungskeys
- ✅ `client/src/locales/de.json` enthält alle benötigten `landing.*` Keys
- ✅ Keine hardcoded "Steigere deine Marketing-Performance" oder "Orbit Pack" im Code
- ⚠️ `client/public/manifest.json` enthält noch alten Text: "Steigere deine Marketing-Performance um 300%"

**Git-Historie:**

- Letzter Commit auf `main`: `7db291e` (2025-12-03)
- Apple-Redesign Commit: `e7c3b19` (vorher)
- Keine Unterschiede zwischen `e7c3b19` und `HEAD` für `Landing.tsx`

**Live-Seite:**

- Asset-Hash: `index-DoTGdMZc.js`
- Enthält alte Texte ("Steigere", "Orbit Pack", "Galaxy Pack")
- Meta-Tags zeigen `orbit-coach.manus.space`

---

## 📋 Plan zur Behebung

### Phase 1: Verifizierung & Vorbereitung

**1.1 Code-Verifizierung**

- [ ] Prüfe, ob alle Übersetzungskeys vorhanden sind
- [ ] Prüfe, ob `manifest.json` aktualisiert werden muss
- [ ] Prüfe, ob es andere Dateien mit alten Texten gibt

**1.2 Deployment-Verifizierung**

- [ ] Prüfe GitHub Actions Logs für letztes Deployment
- [ ] Verifiziere, welcher Commit tatsächlich deployed wurde
- [ ] Prüfe Manus Task-Logs (falls verfügbar)

**1.3 Lokale Änderungen**

- [ ] Committe lokale Änderungen (README.md, etc.)
- [ ] Stelle sicher, dass alles auf `main` ist

### Phase 2: Fixes & Updates

**2.1 Manifest.json aktualisieren**

- [ ] Aktualisiere `client/public/manifest.json` mit neuem Text
- [ ] Entferne "Steigere deine Marketing-Performance um 300%"

**2.2 Code-Verifizierung**

- [ ] Stelle sicher, dass keine alten Texte mehr im Code sind
- [ ] Prüfe alle Dateien auf "Orbit Pack" / "Galaxy Pack" (außer Dokumentation)

**2.3 Build-Test**

- [ ] Lokaler Build-Test: `pnpm build`
- [ ] Verifiziere, dass `dist/public/index.html` korrekt ist
- [ ] Prüfe, dass alle Assets generiert werden

### Phase 3: Deployment

**3.1 Neues Deployment auslösen**

- [ ] Committe alle Änderungen
- [ ] Push zu `main` Branch
- [ ] GitHub Actions Workflow startet automatisch

**3.2 Deployment überwachen**

- [ ] Prüfe GitHub Actions Logs
- [ ] Warte auf erfolgreiches Deployment
- [ ] Verifiziere Manus Task-Status

**3.3 Post-Deployment-Verifizierung**

- [ ] Prüfe Live-Seite: `https://houston.manus.space`
- [ ] Verifiziere neue Hero-Headline
- [ ] Prüfe Pricing-Section (Solo/Team statt Orbit/Galaxy)
- [ ] Prüfe Navigation
- [ ] Prüfe Meta-Tags (houston.manus.space statt orbit-coach)
- [ ] Browser-Cache leeren und erneut prüfen

### Phase 4: Fallback-Plan

**Falls Deployment fehlschlägt:**

- [ ] Manuelles Deployment über `.github/scripts/deploy-specific-commit.sh`
- [ ] Prüfe Manus Web UI für Task-Status
- [ ] Rollback auf vorherigen Commit falls nötig

---

## 🎯 Erwartete Ergebnisse

Nach erfolgreichem Deployment sollte die Live-Seite zeigen:

1. **Hero-Section:**
   - Badge: "KI-Marketing-Coach"
   - Headline: "Marketing, das nicht liegen bleibt"
   - Subheadline: "Houston ist dein KI-Marketing-Coach..."

2. **Pricing-Section:**
   - Starter (kostenlos)
   - Solo (€9,99/Monat)
   - Team (€39,99/Monat)

3. **Navigation:**
   - How It Works
   - Features
   - Pricing
   - FAQ

4. **Meta-Tags:**
   - Alle URLs zeigen `houston.manus.space`
   - Keine `orbit-coach.manus.space` mehr

---

## 📝 Nächste Schritte

1. **Sofort:** Manifest.json aktualisieren
2. **Dann:** Code-Verifizierung abschließen
3. **Dann:** Deployment auslösen
4. **Dann:** Verifizierung durchführen

---

## 🔗 Referenzen

- GitHub Actions Workflow: `.github/workflows/optimized-ci.yml`
- Deployment Prompt: `.github/scripts/deployment-prompt-template.sh`
- Landingpage Code: `client/src/pages/Landing.tsx`
- Übersetzungen: `client/src/locales/de.json`
- Manifest: `client/public/manifest.json`
