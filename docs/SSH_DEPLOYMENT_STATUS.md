# SSH-Deployment Status

**Datum:** 2025-12-03  
**Status:** ⏸️ Blockiert durch SSH-Verbindungsproblem

---

## ✅ Was funktioniert

- ✅ **GitHub Secrets konfiguriert:**
  - `SSH_HOST`: `houston.manus.space`
  - `SSH_USER`: `ubuntu`
  - `SSH_PRIVATE_KEY`: Hinterlegt
  - `SSH_PORT`: `22`

- ✅ **SSH-Deployment-Workflow vorhanden:**
  - `.github/workflows/deploy-ssh.yml` ist aktiv
  - Build → Deploy Pipeline konfiguriert
  - Backup- und Verifikations-Schritte enthalten

- ✅ **Build-Konfiguration korrekt:**
  - Build output: `dist/public/`
  - Deployment target: `/var/www/houston.manus.space/dist`
  - Workflow kopiert korrekte Dateien

- ✅ **Git-History bereinigt:**
  - Private Keys entfernt
  - GitHub Push Protection blockiert nicht mehr

---

## ❌ Aktuelles Problem

### SSH-Verbindung schlägt fehl

**Fehler:**

```
ssh: connect to host houston.manus.space port 22: Operation timed out
```

**Details:**

- ✅ Server ist erreichbar (Ping funktioniert)
- ✅ IP: `104.19.168.112`
- ❌ SSH-Port 22 ist **nicht öffentlich erreichbar**
- ❌ Timeout nach 10 Sekunden

**Mögliche Ursachen:**

1. **SSH läuft auf anderem Port**
   - Standard-Port 22 könnte blockiert sein
   - Möglicherweise Port 2222, 2200, oder anderer

2. **SSH ist nicht öffentlich erreichbar**
   - Nur über VPN erreichbar
   - Nur über Manus-Netzwerk erreichbar
   - Firewall blockiert externen Zugriff

3. **Cloudflare/Firewall blockiert Port 22**
   - Port 22 könnte durch Cloudflare blockiert sein
   - Nur bestimmte IPs haben Zugriff

4. **SSH-Service läuft nicht**
   - SSH-Daemon ist nicht gestartet
   - Service ist deaktiviert

---

## 🔧 Nächste Schritte

### Option 1: Manus Support kontaktieren (EMPFOHLEN)

**Fragen an Manus Support:**

1. **SSH-Zugang:**
   - Ist SSH-Zugang für `houston.manus.space` öffentlich verfügbar?
   - Auf welchem Port läuft SSH? (Standard 22 oder anderer?)

2. **Zugriff:**
   - Gibt es IP-Whitelist oder VPN erforderlich?
   - Wie kann ich SSH-Zugang aktivieren?
   - Ist SSH-Zugang für GitHub Actions IPs erlaubt?

3. **Alternative:**
   - Gibt es alternative Deployment-Methoden?
   - Webhook-basiertes Deployment?
   - CI/CD über Manus API?

**Kontakt:**

- Manus Dashboard → Support
- E-Mail an Manus Support

---

### Option 2: Alternative Ports testen

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

**Falls erfolgreich:**

- GitHub Secret `SSH_PORT` aktualisieren
- Workflow sollte dann funktionieren

---

### Option 3: Manus Dashboard prüfen

**Prüfe im Manus Dashboard:**

1. **SSH-Keys:**
   - Ist der öffentliche Key korrekt hinterlegt?
   - Wurde der Key aktiviert/verifiziert?

2. **Server-Einstellungen:**
   - Ist SSH-Zugang aktiviert?
   - Gibt es Firewall-Regeln?
   - Ist VPN erforderlich?

3. **Deployment-Optionen:**
   - Gibt es andere Deployment-Methoden?
   - Webhook-basiertes Deployment?

---

## 📋 Workflow-Verbesserungen (bereits implementiert)

Der SSH-Deployment-Workflow ist bereits optimiert:

- ✅ Build-Artefakte werden korrekt kopiert (`dist/public/*` → `/var/www/houston.manus.space/dist`)
- ✅ Backup wird vor Deployment erstellt
- ✅ Berechtigungen werden korrekt gesetzt
- ✅ Server-Restart (PM2/systemd) wird versucht
- ✅ Deployment-Verifikation nach Upload

**Workflow-Schritte:**

1. Build-Artefakte herunterladen
2. SSH-Verbindung testen
3. Deployment-Package erstellen
4. Dateien via SCP hochladen
5. Backup erstellen
6. Berechtigungen setzen
7. Server neu starten (falls nötig)
8. Deployment verifizieren

---

## 🚀 Sobald SSH funktioniert

**Test-Deployment auslösen:**

```bash
git commit --allow-empty -m "test: SSH-Deployment nach Fix"
git push origin main
```

**Workflow überwachen:**

```bash
gh run watch
```

**Bei Erfolg:**

- ✅ SSH-Deployment funktioniert
- ✅ Keine Credits benötigt
- ✅ Alten Manus-Agent-Workflow deaktivieren

---

## 💰 Kosten-Vergleich

| Methode            | Credits  | Status        |
| ------------------ | -------- | ------------- |
| **Manus Agent**    | ❌ Ja    | Aktuell aktiv |
| **SSH-Deployment** | ✅ **0** | ⏸️ Blockiert  |

**Ziel:** Migration zu SSH-Deployment (kostenlos)

---

## 📝 Checkliste

- [x] GitHub Secrets konfiguriert
- [x] SSH-Deployment-Workflow erstellt
- [x] Git-History bereinigt
- [x] Build-Konfiguration geprüft
- [ ] **SSH-Verbindung funktioniert** ⚠️ BLOCKIERT
- [ ] Test-Deployment erfolgreich
- [ ] Production-Deployment getestet
- [ ] Alten Manus-Agent-Workflow deaktiviert

---

**Nächste Aktion:** Manus Support kontaktieren für SSH-Zugang-Konfiguration

**Erstellt:** 2025-12-03  
**Letzte Aktualisierung:** 2025-12-03
