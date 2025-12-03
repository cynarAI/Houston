# SSH-Zugang Recherche - Zusammenfassung

## ✅ Was ich in den Docs gefunden habe

### 1. SSH Username: `ubuntu` ✅

**Quelle:** `.deployment/houston.service` (Zeile 8)

```yaml
User=ubuntu
```

**Auch in:** `.deployment/SETUP.md` (Zeile 34)

```bash
sudo chown -R ubuntu:ubuntu /var/www/houston.manus.space /opt/houston
```

---

### 2. Deployment-Verzeichnis: `/var/www/houston.manus.space/dist` ✅

**Quelle:** `.deployment/nginx.conf` (Zeile 46)

```nginx
root /var/www/houston.manus.space/dist;
```

**⚠️ WICHTIG:** Nicht `/var/www/houston.manus.space`, sondern `/dist`!

---

### 3. Server: `houston.manus.space` ✅

**Quelle:** Überall in der Dokumentation

---

### 4. SSH Port: Nicht dokumentiert

**Annahme:** Standard `22`

---

## 📋 Zusammenfassung

| Parameter      | Wert                                | Status                |
| -------------- | ----------------------------------- | --------------------- |
| **SSH_HOST**   | `houston.manus.space`               | ✅ Gefunden           |
| **SSH_USER**   | `ubuntu`                            | ✅ Gefunden           |
| **SSH_PORT**   | `22` (Standard)                     | ⚠️ Nicht dokumentiert |
| **DEPLOY_DIR** | `/var/www/houston.manus.space/dist` | ✅ Gefunden           |

---

## ⚠️ Wichtige Erkenntnisse

### 1. Deployment-Verzeichnis ist `/dist`!

Der Nginx zeigt auf `/var/www/houston.manus.space/dist`, nicht auf root.

**Workflow muss angepasst werden:**

- ❌ Falsch: `target: "/var/www/houston.manus.space"`
- ✅ Richtig: `target: "/var/www/houston.manus.space/dist"`

### 2. SSH-Zugang noch nicht getestet

- Username `ubuntu` ist dokumentiert
- Aber: SSH-Verbindung muss noch getestet werden
- Möglicherweise benötigt man einen SSH-Key von Manus

---

## 🔧 Nächste Schritte

### Option A: SSH-Verbindung direkt testen

```bash
ssh ubuntu@houston.manus.space
```

**Mögliche Ergebnisse:**

- ✅ **Erfolg:** SSH-Zugang funktioniert → Weiter mit SSH-Deployment
- ❌ **"Permission denied":** SSH-Key benötigt → Bei Manus nach Key fragen
- ❌ **"Connection refused":** SSH nicht verfügbar → Alternative suchen

### Option B: Bei Manus nach SSH-Zugang fragen

Falls direkter Test nicht möglich ist, E-Mail an Manus Support senden (siehe `docs/MANUS_SSH_ANFRAGE.md`)

---

## 📝 Workflow-Anpassungen nötig

Der SSH-Deployment Workflow wurde bereits angepasst:

- ✅ Deployment-Verzeichnis: `/var/www/houston.manus.space/dist`
- ✅ SSH User: `ubuntu`
- ✅ SSH Host: `houston.manus.space`

**Workflow ist bereit, sobald:**

1. SSH-Zugang getestet/verfügbar ist
2. SSH-Key generiert und auf Server installiert ist
3. GitHub Secrets konfiguriert sind

---

## 🎯 Empfehlung

**Sofort testen:**

```bash
ssh ubuntu@houston.manus.space
```

**Falls erfolgreich:**

- SSH-Key für GitHub Actions generieren
- Key auf Server installieren
- GitHub Secrets konfigurieren
- Workflow aktivieren

**Falls nicht erfolgreich:**

- Bei Manus Support nach SSH-Zugang fragen
- Oder Manus Runtime API testen
