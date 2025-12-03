# SSH-Zugang Informationen aus der Dokumentation

## ✅ Gefundene Informationen

### 1. SSH Username

**Quelle:** `.deployment/houston.service` und `.deployment/SETUP.md`

```yaml
# .deployment/houston.service
User=ubuntu
```

```bash
# .deployment/SETUP.md
sudo chown -R ubuntu:ubuntu /var/www/houston.manus.space /opt/houston
```

**→ SSH Username:** `ubuntu` ✅

---

### 2. Deployment-Verzeichnis

**Quelle:** `.deployment/nginx.conf`

```nginx
# Root-Verzeichnis für statische Dateien
root /var/www/houston.manus.space/dist;
```

**→ Deployment-Verzeichnis:** `/var/www/houston.manus.space/dist` ✅

**Wichtig:** Der Workflow muss zu `/var/www/houston.manus.space/dist` deployen, nicht nur zu `/var/www/houston.manus.space`!

---

### 3. Server-Hostname

**Quelle:** Verschiedene Dokumentationen

**→ Server:** `houston.manus.space` ✅

---

### 4. SSH Port

**Nicht explizit dokumentiert** - Standard ist `22`

---

## 📋 Zusammenfassung

| Parameter      | Wert                                | Quelle                        |
| -------------- | ----------------------------------- | ----------------------------- |
| **SSH_HOST**   | `houston.manus.space`               | Dokumentation                 |
| **SSH_USER**   | `ubuntu`                            | `.deployment/houston.service` |
| **SSH_PORT**   | `22` (Standard)                     | Nicht dokumentiert            |
| **DEPLOY_DIR** | `/var/www/houston.manus.space/dist` | `.deployment/nginx.conf`      |

---

## ⚠️ Wichtige Erkenntnisse

### 1. Deployment-Verzeichnis ist `/dist`, nicht root!

Der Nginx zeigt auf `/var/www/houston.manus.space/dist`, nicht auf `/var/www/houston.manus.space`.

**Workflow muss angepasst werden:**

- Aktuell: `target: "/var/www/houston.manus.space"`
- Korrekt: `target: "/var/www/houston.manus.space/dist"`

### 2. SSH-Zugang noch nicht bestätigt

- Username `ubuntu` ist dokumentiert
- Aber: SSH-Zugang muss noch getestet werden
- Möglicherweise benötigt man einen SSH-Key von Manus

---

## 🔧 Nächste Schritte

### Schritt 1: SSH-Verbindung testen

```bash
ssh ubuntu@houston.manus.space
```

**Erwartetes Ergebnis:**

- ✅ Erfolg: SSH-Zugang funktioniert
- ❌ Fehler: "Permission denied" → SSH-Key benötigt
- ❌ Fehler: "Connection refused" → SSH nicht verfügbar

### Schritt 2: Falls SSH funktioniert

1. SSH-Key für GitHub Actions generieren
2. Key auf Server installieren
3. GitHub Secrets konfigurieren
4. Workflow anpassen (Deployment-Verzeichnis: `/dist`)

### Schritt 3: Falls SSH nicht funktioniert

- Bei Manus Support nach SSH-Zugang fragen
- Oder Manus Runtime API testen (falls verfügbar)

---

## 📝 Workflow-Anpassung nötig

Der SSH-Deployment Workflow muss angepasst werden:

**Vorher:**

```yaml
target: "/var/www/houston.manus.space"
```

**Nachher:**

```yaml
target: "/var/www/houston.manus.space/dist"
```

**Grund:** Nginx zeigt auf `/dist`, nicht auf root!
