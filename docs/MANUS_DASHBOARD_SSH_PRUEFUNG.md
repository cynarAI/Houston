# Manus Dashboard - SSH-Einstellungen prüfen

**Datum:** 2025-12-03  
**Ziel:** SSH-Zugang und Server-Einstellungen im Manus Dashboard finden

---

## 🔍 Was im Manus Dashboard zu prüfen ist

### 1. SSH Keys Management

**Wo zu finden:**

- Settings → SSH Keys
- Settings → Security → SSH Keys
- Project Settings → SSH Keys
- Server Settings → SSH Keys

**Was zu prüfen:**

- ✅ Ist der öffentliche SSH-Key bereits hinterlegt?
  - Key Name: "Houston Deployment Server" oder ähnlich
  - SHA256: `6nGik/ZoRQn+/SdQ6pHZBEkspQCTi5Cp7scjxfzQaVQ`
  - Status: "Never used — Read/write"

- ✅ Kann ich einen neuen SSH-Key hinzufügen?
- ✅ Gibt es eine Option, den privaten Key zu exportieren?

**Screenshot machen:** Falls SSH-Keys gefunden werden

---

### 2. Server Settings / Project Settings

**Wo zu finden:**

- Project Settings → Server
- Settings → Servers
- Project → houston.manus.space → Settings

**Was zu prüfen:**

- ✅ Server-Hostname/IP-Adresse
- ✅ SSH-Port (Standard 22 oder anderer?)
- ✅ SSH-Username (sollte `ubuntu` sein)
- ✅ SSH-Zugang aktiviert/deaktiviert
- ✅ Firewall-Regeln oder IP-Whitelist

**Screenshot machen:** Falls Server-Settings gefunden werden

---

### 3. Deployment Settings

**Wo zu finden:**

- Project Settings → Deployment
- Settings → Deployment
- Project → Deployment Options

**Was zu prüfen:**

- ✅ Aktuelle Deployment-Methode (Manus Agent?)
- ✅ Gibt es SSH-Deployment-Option?
- ✅ Deployment-Verzeichnis (`/var/www/houston.manus.space/dist`?)
- ✅ Deployment-Befehle oder Scripts

**Screenshot machen:** Falls Deployment-Settings gefunden werden

---

### 4. Network / Firewall Settings

**Wo zu finden:**

- Settings → Network
- Settings → Security → Firewall
- Server Settings → Network

**Was zu prüfen:**

- ✅ Ist Port 22 (SSH) geöffnet?
- ✅ Gibt es IP-Whitelist?
- ✅ Gibt es VPN-Anforderung?
- ✅ Welche Ports sind öffentlich erreichbar?

**Screenshot machen:** Falls Network-Settings gefunden werden

---

### 5. API / Developer Settings

**Wo zu finden:**

- Settings → API
- Settings → Developer
- Account Settings → API Keys

**Was zu prüfen:**

- ✅ Gibt es SSH-Deployment-API?
- ✅ Gibt es alternative Deployment-Methoden?
- ✅ API-Dokumentation für SSH-Zugang

**Screenshot machen:** Falls API-Settings gefunden werden

---

## 📋 Checkliste für Dashboard-Prüfung

### Schritt 1: Navigation erkunden

- [ ] Öffne Manus Dashboard: https://manus.im
- [ ] Suche nach "Settings" oder "Einstellungen"
- [ ] Suche nach "SSH" oder "Keys"
- [ ] Suche nach "Server" oder "Deployment"

### Schritt 2: SSH-Keys prüfen

- [ ] Finde SSH-Keys-Sektion
- [ ] Prüfe ob Key "Houston Deployment Server" existiert
- [ ] Prüfe Key-Status und Berechtigungen
- [ ] Prüfe ob neuer Key hinzugefügt werden kann
- [ ] Screenshot machen

### Schritt 3: Server-Settings prüfen

- [ ] Finde Server-Settings für `houston.manus.space`
- [ ] Prüfe SSH-Port (Standard 22?)
- [ ] Prüfe SSH-Username (`ubuntu`?)
- [ ] Prüfe ob SSH-Zugang aktiviert ist
- [ ] Screenshot machen

### Schritt 4: Deployment-Settings prüfen

- [ ] Finde Deployment-Settings
- [ ] Prüfe aktuelle Deployment-Methode
- [ ] Prüfe ob SSH-Deployment verfügbar ist
- [ ] Prüfe Deployment-Verzeichnis
- [ ] Screenshot machen

### Schritt 5: Network/Firewall prüfen

- [ ] Finde Network/Firewall-Settings
- [ ] Prüfe ob Port 22 geöffnet ist
- [ ] Prüfe IP-Whitelist
- [ ] Prüfe VPN-Anforderungen
- [ ] Screenshot machen

---

## 📸 Screenshots sammeln

**Wichtige Screenshots:**

1. SSH-Keys-Übersicht (falls vorhanden)
2. Server-Settings für houston.manus.space
3. Deployment-Settings
4. Network/Firewall-Settings
5. API/Developer-Settings (falls relevant)

**Speichere Screenshots in:** `docs/screenshots/manus-dashboard/`

---

## 🔍 Alternative: Manus Support fragen

**Falls nichts gefunden wird:**

1. **Support-Chat im Dashboard:**
   - Suche nach "Support" oder "Hilfe"
   - Öffne Support-Chat
   - Frage: "Wo finde ich SSH-Einstellungen für houston.manus.space?"

2. **Support-E-Mail:**
   - Siehe `docs/MANUS_SSH_ANFRAGE.md` für E-Mail-Vorlage

---

## 📝 Dokumentation der Ergebnisse

**Erstelle nach der Prüfung:**

1. **Datei:** `docs/MANUS_DASHBOARD_ERGEBNISSE.md`
   - Was wurde gefunden?
   - Was wurde NICHT gefunden?
   - Screenshots anhängen
   - Nächste Schritte

2. **Update:** `docs/SSH_DOKUMENTATION_ZUSAMMENFASSUNG.md`
   - Neue Erkenntnisse hinzufügen
   - SSH-Port bestätigen/aktualisieren
   - Zugänglichkeit dokumentieren

---

## 🎯 Erwartete Ergebnisse

### Best Case:

- ✅ SSH-Keys-Sektion gefunden
- ✅ Server-Settings mit SSH-Port gefunden
- ✅ SSH-Zugang kann aktiviert werden
- ✅ Port 22 ist geöffnet

### Worst Case:

- ❌ Keine SSH-Settings gefunden
- ❌ SSH-Zugang nicht verfügbar
- ❌ Nur Manus Agent API verfügbar

### Realistic Case:

- ⚠️ SSH-Settings existieren, aber nicht öffentlich zugänglich
- ⚠️ SSH-Zugang muss bei Support angefragt werden
- ⚠️ Alternative Ports oder VPN erforderlich

---

## 🚀 Nächste Schritte nach Prüfung

**Falls SSH-Settings gefunden:**

1. SSH-Port dokumentieren
2. SSH-Zugang aktivieren (falls nötig)
3. GitHub Secret `SSH_PORT` aktualisieren
4. SSH-Verbindung testen

**Falls nichts gefunden:**

1. Manus Support kontaktieren (siehe `docs/MANUS_SSH_ANFRAGE.md`)
2. Alternative Ports testen
3. Alternative Deployment-Methoden prüfen

---

**Erstellt:** 2025-12-03  
**Status:** ⏳ Ausstehend - Dashboard-Prüfung durchführen
