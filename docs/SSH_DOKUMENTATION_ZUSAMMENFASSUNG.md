# SSH-Deployment - Dokumentations-Zusammenfassung

**Datum:** 2025-12-03  
**Status:** Dokumentation analysiert

---

## ✅ Was in der Dokumentation gefunden wurde

### 1. SSH-Verbindungsdetails

| Parameter      | Wert                                | Quelle                                                                     | Status             |
| -------------- | ----------------------------------- | -------------------------------------------------------------------------- | ------------------ |
| **SSH_HOST**   | `houston.manus.space`               | Überall dokumentiert                                                       | ✅ Bestätigt       |
| **SSH_USER**   | `ubuntu`                            | `.deployment/houston.service` (Zeile 8), `.deployment/SETUP.md` (Zeile 34) | ✅ Bestätigt       |
| **SSH_PORT**   | `22` (Standard)                     | **Nicht explizit dokumentiert** - nur Annahme                              | ⚠️ Nicht bestätigt |
| **DEPLOY_DIR** | `/var/www/houston.manus.space/dist` | `.deployment/nginx.conf` (Zeile 46)                                        | ✅ Bestätigt       |

### 2. Server-Konfiguration

**Nginx-Konfiguration:**

- Root-Verzeichnis: `/var/www/houston.manus.space/dist` ✅
- Server: `houston.manus.space` ✅
- SSL: Let's Encrypt konfiguriert ✅

**Systemd-Service:**

- User: `ubuntu` ✅
- Service: `houston.service` ✅

### 3. Aktuelles Problem

**SSH-Verbindung schlägt fehl:**

```
ssh: connect to host houston.manus.space port 22: Operation timed out
```

**Erkenntnisse aus Dokumentation:**

- ❌ **SSH Port ist NICHT explizit dokumentiert**
- ❌ **Keine Informationen über alternative Ports**
- ❌ **Keine Informationen über SSH-Zugangsbeschränkungen**
- ❌ **Keine Informationen über VPN-Anforderungen**
- ❌ **Keine Informationen über Firewall-Regeln**

---

## 📋 Was die Dokumentation NICHT enthält

### Fehlende Informationen:

1. **SSH-Port:**
   - Nicht explizit dokumentiert
   - Nur Annahme: Standard-Port 22
   - Keine Informationen über alternative Ports (2222, 2200, etc.)

2. **SSH-Zugänglichkeit:**
   - Keine Informationen, ob SSH öffentlich erreichbar ist
   - Keine Informationen über IP-Whitelist
   - Keine Informationen über VPN-Anforderungen

3. **SSH-Key-Management:**
   - Keine Informationen, wie SSH-Keys auf dem Server installiert werden
   - Keine Informationen über Manus-spezifische SSH-Key-Verwaltung

4. **Deployment-Methode:**
   - Aktuell: Manus Agent API (kostet Credits)
   - Ziel: SSH-Deployment (kostenlos)
   - **Aber:** Keine Dokumentation, ob SSH-Deployment überhaupt möglich ist

---

## 🔍 Wichtige Erkenntnisse

### 1. Deployment-Verzeichnis ist korrekt

**Workflow ist korrekt konfiguriert:**

- ✅ Build output: `dist/public/`
- ✅ Deployment target: `/var/www/houston.manus.space/dist`
- ✅ Nginx zeigt auf `/var/www/houston.manus.space/dist`

### 2. SSH-Zugang ist unbekannt

**Problem:**

- SSH-Verbindung schlägt fehl (Port 22 timeoutet)
- **Aber:** Dokumentation enthält keine Informationen über SSH-Zugang
- **Vermutung:** SSH-Zugang muss erst bei Manus angefragt/aktiviert werden

### 3. Manus-spezifische Besonderheiten

**Aus `docs/MANUS_DEPLOYMENT_INSIGHTS.md`:**

- Manus verwendet eigene Deployment-Methode (Agent API)
- Manus hat möglicherweise eigene SSH-Key-Verwaltung
- SSH-Zugang könnte nicht standardmäßig verfügbar sein

---

## 🔧 Nächste Schritte basierend auf Dokumentation

### Option 1: Manus Support kontaktieren (EMPFOHLEN)

**Dokumentation:** `docs/MANUS_SSH_ANFRAGE.md` enthält Vorlagen für Support-Anfragen

**Fragen:**

1. Ist SSH-Zugang für `houston.manus.space` verfügbar?
2. Auf welchem Port läuft SSH? (Standard 22 oder anderer?)
3. Gibt es IP-Whitelist oder VPN erforderlich?
4. Wie werden SSH-Keys verwaltet? (Manus Dashboard oder direkt auf Server?)

### Option 2: Alternative Ports testen

**Da Port nicht dokumentiert ist, sollten alternative Ports getestet werden:**

```bash
# Teste alternative SSH-Ports
for port in 2222 2200 22022 443; do
  echo "Testing port $port..."
  ssh -i ~/.ssh/github_actions_houston \
      -p $port \
      -o ConnectTimeout=5 \
      ubuntu@houston.manus.space \
      "echo 'Success on port $port'" 2>&1
done
```

### Option 3: Manus Dashboard prüfen

**Mögliche Orte im Manus Dashboard:**

- SSH Keys Management
- Server Settings
- Deployment Settings
- Network/Firewall Settings

---

## 📝 Zusammenfassung

**Was wir wissen:**

- ✅ SSH_HOST: `houston.manus.space`
- ✅ SSH_USER: `ubuntu`
- ✅ DEPLOY_DIR: `/var/www/houston.manus.space/dist`
- ✅ Workflow ist korrekt konfiguriert

**Was wir NICHT wissen:**

- ❌ SSH_PORT (nur Annahme: 22)
- ❌ Ist SSH öffentlich erreichbar?
- ❌ Gibt es Zugangsbeschränkungen?
- ❌ Wie werden SSH-Keys verwaltet?

**Fazit:**
Die Dokumentation bestätigt die Workflow-Konfiguration, enthält aber **keine Informationen über SSH-Zugang**. Das Problem liegt wahrscheinlich daran, dass SSH-Zugang erst bei Manus angefragt/aktiviert werden muss.

---

**Nächste Aktion:** Manus Support kontaktieren (siehe `docs/MANUS_SSH_ANFRAGE.md`)

**Erstellt:** 2025-12-03
