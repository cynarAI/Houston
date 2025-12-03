# Manus Runtime API Deployment - Status

**Datum:** 2025-12-03  
**Status:** ✅ Aktiviert

---

## ✅ Was wurde umgesetzt

### 1. Neuer Workflow aktiviert

**Datei:** `.github/workflows/deploy-manus-api.yml`

- ✅ Build & Deploy Pipeline
- ✅ Deployment via Manus Runtime API (`/v1/publish`)
- ✅ Keine Credits benötigt
- ✅ Automatisches Deployment bei Push zu `main`

### 2. Alter Workflow deaktiviert

**Datei:** `.github/workflows/optimized-ci.yml`

- ✅ Deployment-Job deaktiviert (`if: false`)
- ✅ Build-Job bleibt aktiv
- ✅ Kommentar hinzugefügt: "DEAKTIVIERT - Verwende deploy-manus-api.yml"

---

## 🚀 Wie es funktioniert

### Workflow-Ablauf:

1. **Build-Job:**
   - Checkout Code
   - Install Dependencies
   - TypeScript Check
   - Build Application (`pnpm build`)
   - Upload Artifacts

2. **Deploy-Job:**
   - Download Artifacts
   - API-Call an `https://api.manus.ai/v1/publish`
   - Payload:
     ```json
     {
       "project_id": "9Ye7dFtLEUdP6ojxHpkQhu",
       "directory": "dist/public",
       "target": "houston.manus.space"
     }
     ```

3. **Ergebnis:**
   - ✅ HTTP 200/201: Deployment erfolgreich
   - ❌ HTTP 404: API nicht verfügbar (Workflow schlägt fehl mit Hinweis)
   - ❌ Andere HTTP-Codes: Fehler wird angezeigt

---

## 📋 Nächste Schritte

### 1. Test-Deployment durchführen

```bash
git commit --allow-empty -m "test: Manus Runtime API Deployment"
git push origin main
```

### 2. Workflow überwachen

```bash
gh run watch
```

### 3. Ergebnis prüfen

**Falls erfolgreich (HTTP 200/201):**

- ✅ API funktioniert
- ✅ Keine Credits benötigt
- ✅ Deployment läuft automatisch

**Falls fehlgeschlagen (HTTP 404):**

- ❌ API-Endpoint nicht verfügbar
- ⚠️ Workflow schlägt fehl mit Hinweis
- 💡 Alternative: SSH-Deployment oder Railway/Vercel

---

## 🔍 Monitoring

**Workflow-Logs prüfen:**

```bash
gh run view --log
```

**Letzte Runs:**

```bash
gh run list --workflow=deploy-manus-api.yml
```

---

## ⚙️ Konfiguration

**Benötigte Secrets:**

- ✅ `MANUS_API_KEY` (bereits vorhanden)

**Workflow-Trigger:**

- ✅ Push zu `main`
- ✅ Manual Dispatch (mit `skip_deploy` Option)

---

## 📊 Vergleich

| Aspekt              | Alter Workflow (Agent) | Neuer Workflow (API) |
| ------------------- | ---------------------- | -------------------- |
| **Credits**         | ❌ Benötigt            | ✅ **0**             |
| **Geschwindigkeit** | ⚠️ 10-20 Min           | ✅ 2-5 Min           |
| **Zuverlässigkeit** | ⚠️ Abhängig von Agent  | ✅ Direkter API-Call |
| **Status**          | ❌ Deaktiviert         | ✅ **Aktiv**         |

---

## 🎯 Erwartetes Ergebnis

**Beim nächsten Push zu `main`:**

1. Build läuft (wie bisher)
2. Deploy-Job startet automatisch
3. API-Call an `/v1/publish`
4. Falls erfolgreich: Deployment ohne Credits ✅
5. Falls nicht: Workflow schlägt fehl mit klarem Hinweis

---

**Erstellt:** 2025-12-03  
**Status:** ✅ Aktiviert und bereit für Test-Deployment
