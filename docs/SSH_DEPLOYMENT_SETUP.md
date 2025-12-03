# SSH-Deployment Setup (Kostenlos)

**Ziel:** Deployment ohne Credits über direkten SSH-Zugang

---

## 📋 Voraussetzungen

1. **SSH-Zugang zum Server**
   - Host: `houston.manus.space` (oder IP)
   - Username: z.B. `ubuntu`, `root`, `deploy`
   - Port: Standard 22 (oder anderer)

2. **SSH-Key**
   - Privater Key für GitHub Actions
   - Öffentlicher Key auf Server installiert

---

## 🔧 Setup-Schritte

### Schritt 1: SSH-Zugang prüfen

**Bei Manus Support nachfragen:**

- Ist SSH-Zugang verfügbar?
- Welcher Username?
- Welche IP/Hostname?
- Welcher Port?

**Oder selbst testen:**

```bash
ssh user@houston.manus.space
```

### Schritt 2: SSH-Key generieren (falls nötig)

```bash
# Generiere neuen SSH-Key für GitHub Actions
ssh-keygen -t ed25519 -C "github-actions-houston" -f ~/.ssh/github_actions_houston

# Öffentlichen Key auf Server installieren
ssh-copy-id -i ~/.ssh/github_actions_houston.pub user@houston.manus.space
```

### Schritt 3: GitHub Secrets konfigurieren

Gehe zu: `Settings` > `Secrets and variables` > `Actions`

**Erstelle folgende Secrets:**

| Secret Name       | Wert                    | Beispiel                                   |
| ----------------- | ----------------------- | ------------------------------------------ |
| `SSH_HOST`        | Server IP oder Hostname | `houston.manus.space` oder `123.45.67.89`  |
| `SSH_USER`        | SSH Username            | `ubuntu` oder `deploy`                     |
| `SSH_PRIVATE_KEY` | Privater SSH-Key        | Inhalt von `~/.ssh/github_actions_houston` |
| `SSH_PORT`        | SSH Port (optional)     | `22` (Standard)                            |

**Wichtig:**

- `SSH_PRIVATE_KEY` muss den **kompletten** Key enthalten (inkl. `REMOVED_PRIVATE_KEY_BLOCK`)
- Keine Zeilenumbrüche entfernen!

### Schritt 4: Workflow aktivieren

1. Kopiere `.github/workflows/deploy-ssh.yml.example` zu `.github/workflows/deploy-ssh.yml`
2. Passe den Workflow an (falls nötig)
3. Deaktiviere den alten Manus-Workflow (umbenennen oder löschen)

### Schritt 5: Testen

```bash
# Test-Deployment auslösen
git commit --allow-empty -m "test: SSH deployment"
git push origin main
```

---

## 🔍 Troubleshooting

### Problem: SSH-Verbindung schlägt fehl

**Lösung:**

- Prüfe ob SSH-Zugang verfügbar ist
- Prüfe ob Key korrekt ist
- Prüfe ob Username/Hostname korrekt sind

### Problem: Dateien werden nicht kopiert

**Lösung:**

- Prüfe ob Ziel-Verzeichnis existiert
- Prüfe Berechtigungen
- Prüfe `strip_components` Einstellung

### Problem: Server startet nicht neu

**Lösung:**

- Prüfe ob PM2 oder systemd verwendet wird
- Passe `script` im Workflow an

---

## 💰 Kosten-Vergleich

| Methode                   | Credits  | Sonstige Kosten  |
| ------------------------- | -------- | ---------------- |
| **Aktuell (Manus Agent)** | ❌ Ja    | -                |
| **SSH-Deployment**        | ✅ **0** | ✅ **Kostenlos** |

---

## ✅ Vorteile

- ✅ **Kostenlos** (keine Credits)
- ✅ Schnell (2-5 Minuten)
- ✅ Volle Kontrolle
- ✅ Einfach zu debuggen
- ✅ Unabhängig von Manus API

---

## 📝 Nächste Schritte

1. **Sofort:** Bei Manus Support nach SSH-Zugang fragen
2. **Falls verfügbar:** SSH-Key generieren und konfigurieren
3. **Dann:** Workflow aktivieren und testen
4. **Fertig:** Alten Manus-Workflow deaktivieren

---

## 🔗 Referenzen

- GitHub Actions SSH: https://github.com/appleboy/ssh-action
- GitHub Actions SCP: https://github.com/appleboy/scp-action
- SSH-Key Setup: https://docs.github.com/en/authentication/connecting-to-github-with-ssh
