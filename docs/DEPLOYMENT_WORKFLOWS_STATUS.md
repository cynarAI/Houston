# Deployment Workflows - Status Übersicht

**Datum:** 2025-12-03  
**Status:** ✅ Alle Manus-Deployments deaktiviert, Vercel aktiv

---

## 📋 Workflow-Übersicht

| Workflow                | Status         | Trigger        | Zweck                                |
| ----------------------- | -------------- | -------------- | ------------------------------------ |
| **`deploy-vercel.yml`** | ✅ **AKTIV**   | Push zu `main` | Vercel Deployment (kostenlos)        |
| `deploy-manus-api.yml`  | ❌ Deaktiviert | Nur manuell    | Manus Runtime API (404 Fehler)       |
| `deploy.yml`            | ❌ Deaktiviert | Nur manuell    | Manus Agent (benötigt Credits)       |
| `optimized-ci.yml`      | ⚠️ Build aktiv | Push zu `main` | Tests & Builds (Deploy deaktiviert)  |
| `deploy-ssh.yml`        | ⚠️ Verfügbar   | Nur manuell    | SSH-Deployment (benötigt SSH-Zugang) |
| `ci.yml`                | ✅ Aktiv       | Push/PR        | Standard CI                          |

---

## ✅ Aktive Deployments

### 1. Vercel Deployment (PRIMÄR)

**Datei:** `.github/workflows/deploy-vercel.yml`

- ✅ **Aktiv bei Push zu `main`**
- ✅ **Dauerhaft kostenlos**
- ✅ Automatisches Deployment
- ✅ Build & Deploy Pipeline

**Benötigte Secrets:**

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

---

## ❌ Deaktivierte Deployments

### 1. Manus Runtime API

**Datei:** `.github/workflows/deploy-manus-api.yml`

**Status:** ❌ Deaktiviert

**Grund:**

- API-Endpoint `/v1/publish` existiert nicht (HTTP 404)
- Push-Trigger entfernt
- Deploy-Job mit `if: false` deaktiviert
- Kann noch manuell ausgelöst werden (für Tests)

### 2. Manus Agent (deploy.yml)

**Datei:** `.github/workflows/deploy.yml`

**Status:** ❌ Deaktiviert

**Grund:**

- Benötigt Credits
- Push-Trigger entfernt
- Deploy-Job mit `if: false` deaktiviert
- Kann noch manuell ausgelöst werden

### 3. Manus Agent (optimized-ci.yml)

**Datei:** `.github/workflows/optimized-ci.yml`

**Status:** ⚠️ Build aktiv, Deploy deaktiviert

**Grund:**

- Deploy-Job mit `if: false` deaktiviert
- Build-Job läuft noch für Tests
- Kann noch manuell ausgelöst werden

---

## ⚠️ Alternative Deployments

### SSH-Deployment

**Datei:** `.github/workflows/deploy-ssh.yml`

**Status:** ⚠️ Verfügbar, aber nicht aktiv

**Grund:**

- Benötigt SSH-Zugang zu Server
- SSH-Port 22 nicht öffentlich erreichbar
- Kann manuell ausgelöst werden, wenn SSH-Zugang verfügbar

---

## 🎯 Was passiert bei Push zu `main`?

1. **`deploy-vercel.yml`** läuft → ✅ Deployment zu Vercel
2. **`optimized-ci.yml`** läuft → ✅ Build & Tests (kein Deploy)
3. **`ci.yml`** läuft → ✅ Standard CI Checks

**Keine Manus-Deployments mehr!**

---

## 📊 Zusammenfassung

| Deployment-Methode | Status         | Kosten       | Automatisch |
| ------------------ | -------------- | ------------ | ----------- |
| **Vercel**         | ✅ Aktiv       | ✅ Kostenlos | ✅ Ja       |
| Manus Runtime API  | ❌ Deaktiviert | ❓ Unbekannt | ❌ Nein     |
| Manus Agent        | ❌ Deaktiviert | ❌ Credits   | ❌ Nein     |
| SSH                | ⚠️ Verfügbar   | ✅ Kostenlos | ❌ Nein     |

---

**Erstellt:** 2025-12-03  
**Status:** ✅ Alle Manus-Deployments deaktiviert, Vercel aktiv
