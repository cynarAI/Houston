# Manus API Endpoint Analyse

**Datum:** 2025-12-03  
**Problem:** HTTP 404 bei `/v1/publish` Endpoint

---

## 🔍 Recherche-Ergebnisse

### Verfügbare Manus API Endpoints

**Dokumentiert:**

- ✅ `POST /v1/tasks` - Erstellt AI-Tasks (benötigt Credits für LLM-Tokens)
- ❓ `POST /v1/publish` - **NICHT in öffentlicher Dokumentation gefunden**

### Was die Dokumentation sagt

**Credits-Verbrauch:**

- Credits werden für LLM-Tokens, VM-Zeit und API-Calls verbraucht
- **Bereits deployte/stored Outputs verbrauchen KEINE zusätzlichen Credits**
- Wenn Tasks aufgrund technischer Probleme auf Manus-Seite fehlschlagen, gibt es volle Credit-Erstattung

**Deployment:**

- Manus.ai bietet "instant deployment" mit einem einzigen Befehl
- Aber: Keine öffentliche API-Dokumentation für `/v1/publish` Endpoint

---

## ❌ Aktuelles Problem

**Workflow-Fehler:**

```
HTTP Status: 404
Response: Not Found
```

**Ursache:**

- Der Endpoint `https://api.manus.ai/v1/publish` existiert wahrscheinlich **nicht** oder ist nicht öffentlich verfügbar
- **NICHT** wegen fehlender Credits (404 bedeutet Endpoint nicht gefunden, nicht "unauthorized" oder "insufficient credits")

---

## 💡 Mögliche Erklärungen

### 1. Endpoint existiert nicht

- `/v1/publish` wurde nie implementiert
- Deployment läuft nur über Manus Agent (der Credits benötigt)

### 2. Endpoint ist nicht öffentlich

- Nur für interne Manus-Services verfügbar
- Benötigt spezielle Authentifizierung oder Zugang

### 3. Endpoint wurde entfernt/geändert

- Früher verfügbar, jetzt deprecated
- Neuer Endpoint existiert, aber nicht dokumentiert

---

## 🔧 Nächste Schritte

### Option 1: Manus Support kontaktieren

**Fragen:**

- Existiert ein API-Endpoint für Deployment ohne Agent?
- Wie kann ich ohne Credits deployen?
- Gibt es eine Alternative zu `/v1/publish`?

### Option 2: Alternative Deployment-Methoden

**Empfohlen:**

1. **Railway** - PaaS mit automatischem Deployment (kostenlos für kleine Projekte)
2. **Vercel** - Optimiert für Frontend-Apps (kostenlos)
3. **Netlify** - Einfaches Setup (kostenlos)
4. **SSH-Deployment** - Direkt auf Server (benötigt SSH-Zugang)

Siehe: `docs/DEPLOYMENT_OHNE_CREDITS.md`

---

## 📊 Vergleich: Agent vs. API

| Methode               | Endpoint                            | Credits      | Status               |
| --------------------- | ----------------------------------- | ------------ | -------------------- |
| **Manus Agent**       | `/v1/tasks` (mit Deployment-Prompt) | ✅ Benötigt  | ✅ Funktioniert      |
| **Manus Runtime API** | `/v1/publish`                       | ❓ Unbekannt | ❌ **404 Not Found** |

---

## ✅ Fazit

**Das Problem ist NICHT fehlende Credits:**

- HTTP 404 bedeutet "Endpoint nicht gefunden"
- Bei fehlenden Credits würde man HTTP 401/403 oder eine spezifische Fehlermeldung erhalten

**Das Problem ist:**

- Der `/v1/publish` Endpoint existiert wahrscheinlich nicht oder ist nicht öffentlich verfügbar
- Manus bietet möglicherweise **keine** kostenlose API-basierte Deployment-Methode

**Empfehlung:**

- Alternative Deployment-Methode einrichten (Railway/Vercel)
- Oder Manus Support kontaktieren für Klärung

---

**Erstellt:** 2025-12-03  
**Status:** ❌ Endpoint nicht verfügbar, Alternative empfohlen
