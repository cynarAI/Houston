# SSH-Key generiert - Nächste Schritte

## ✅ SSH-Key erfolgreich generiert

**Key-Details:**

- **Typ:** ED25519
- **Fingerprint:** `SHA256:3yJYbc6SIynBkRm59tbeR3jiJLVOeblVxCd6Qf+vbUw`
- **Datei:** `~/.ssh/github_actions_houston`
- **Öffentlicher Key:** `~/.ssh/github_actions_houston.pub`
- **Privater Key:** `~/.ssh/github_actions_houston`

---

## 📋 Nächste Schritte

### Schritt 1: Öffentlichen Key bei Manus hinterlegen

**1. Öffentlichen Key kopieren:**

```bash
cat ~/.ssh/github_actions_houston.pub
```

**2. Bei Manus hinzufügen:**

- Gehe zu: Manus Dashboard → SSH Keys (oder Deploy Keys)
- Klicke: "Add SSH Key" oder "Add Deploy Key"
- **Name:** `GitHub Actions Houston Deployment`
- **Key:** Füge den öffentlichen Key ein (komplett kopieren)
- **Berechtigungen:** Read/write (falls verfügbar)
- Klicke: "Add" oder "Save"

---

### Schritt 2: Privaten Key als GitHub Secret hinzufügen

**1. Privaten Key kopieren:**

```bash
cat ~/.ssh/github_actions_houston
```

**2. GitHub Secrets konfigurieren:**

- Gehe zu: `https://github.com/cynarAI/Houston/settings/secrets/actions`
- Klicke: "New repository secret"

**Erstelle folgende Secrets:**

#### Secret 1: SSH_HOST

- **Name:** `SSH_HOST`
- **Value:** `houston.manus.space`
- Klicke: "Add secret"

#### Secret 2: SSH_USER

- **Name:** `SSH_USER`
- **Value:** `ubuntu`
- Klicke: "Add secret"

#### Secret 3: SSH_PRIVATE_KEY

- **Name:** `SSH_PRIVATE_KEY`
- **Value:** [Füge den KOMPLETTEN privaten Key ein]
  - Muss enthalten: `REMOVED_PRIVATE_KEY_BLOCK`
  - Keine Zeilenumbrüche entfernen!
- Klicke: "Add secret"

#### Secret 4: SSH_PORT (optional)

- **Name:** `SSH_PORT`
- **Value:** `22`
- Klicke: "Add secret"

---

### Schritt 3: Öffentlichen Key auf Server installieren

**Test SSH-Verbindung und installiere Key:**

```bash
# Test SSH-Verbindung (sollte noch nicht funktionieren)
ssh ubuntu@houston.manus.space

# Installiere öffentlichen Key auf Server
ssh-copy-id -i ~/.ssh/github_actions_houston.pub ubuntu@houston.manus.space

# Oder falls ssh-copy-id nicht funktioniert, manuell:
cat ~/.ssh/github_actions_houston.pub | ssh ubuntu@houston.manus.space "mkdir -p ~/.ssh && chmod 700 ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys"
```

**Falls SSH-Verbindung nicht möglich ist:**

- Der öffentliche Key muss manuell auf dem Server installiert werden
- Kontaktiere Manus Support oder nutze Manus Dashboard (falls verfügbar)

---

### Schritt 4: SSH-Verbindung testen

**Nachdem der öffentliche Key auf dem Server installiert ist:**

```bash
# Test SSH-Verbindung
ssh -i ~/.ssh/github_actions_houston ubuntu@houston.manus.space

# Oder falls Key bereits in ~/.ssh/config:
ssh ubuntu@houston.manus.space
```

**Erwartetes Ergebnis:**

- ✅ Erfolgreiche Verbindung → Weiter mit Schritt 5
- ❌ "Permission denied" → Öffentlicher Key nicht auf Server installiert
- ❌ "Connection refused" → SSH nicht verfügbar

---

### Schritt 5: Test-Deployment durchführen

**Nach erfolgreicher SSH-Verbindung:**

```bash
# Test-Commit erstellen
git add .github/workflows/deploy-ssh.yml
git commit -m "feat: SSH-Deployment Workflow aktivieren"
git push origin main

# Überwache GitHub Actions
# Gehe zu: https://github.com/cynarAI/Houston/actions
```

**Erwartetes Ergebnis:**

- ✅ Build erfolgreich
- ✅ SSH-Verbindung erfolgreich
- ✅ Dateien kopiert
- ✅ Deployment verifiziert

---

## ✅ Checkliste

- [x] SSH-Key generiert
- [ ] Öffentlichen Key bei Manus hinterlegt
- [ ] GitHub Secrets konfiguriert:
  - [ ] `SSH_HOST` = `houston.manus.space`
  - [ ] `SSH_USER` = `ubuntu`
  - [ ] `SSH_PRIVATE_KEY` = [Privater Key]
  - [ ] `SSH_PORT` = `22` (optional)
- [ ] Öffentlichen Key auf Server installiert
- [ ] SSH-Verbindung getestet
- [ ] Test-Deployment durchgeführt
- [ ] Alten Manus-Workflow deaktiviert

---

## 🔍 Troubleshooting

### Problem: "Permission denied (publickey)"

**Lösung:**

1. Prüfe ob öffentlicher Key auf Server installiert ist:
   ```bash
   ssh ubuntu@houston.manus.space "cat ~/.ssh/authorized_keys | grep github-actions"
   ```
2. Falls nicht: Installiere Key erneut (Schritt 3)
3. Prüfe GitHub Secret `SSH_PRIVATE_KEY` (kompletter Key?)

### Problem: "Connection refused"

**Lösung:**

- SSH-Zugang muss von Manus aktiviert werden
- Kontaktiere Manus Support

### Problem: Dateien werden nicht kopiert

**Lösung:**

1. Prüfe ob Ziel-Verzeichnis existiert:
   ```bash
   ssh ubuntu@houston.manus.space "ls -la /var/www/houston.manus.space/dist"
   ```
2. Prüfe Berechtigungen:
   ```bash
   ssh ubuntu@houston.manus.space "sudo chown -R ubuntu:ubuntu /var/www/houston.manus.space"
   ```

---

## 📝 Wichtige Dateien

**Lokal:**

- Privater Key: `~/.ssh/github_actions_houston`
- Öffentlicher Key: `~/.ssh/github_actions_houston.pub`

**GitHub:**

- Secrets: `https://github.com/cynarAI/Houston/settings/secrets/actions`
- Workflow: `.github/workflows/deploy-ssh.yml`

**Manus:**

- SSH Keys: Manus Dashboard → SSH Keys

---

## 🎯 Zusammenfassung

1. ✅ **SSH-Key generiert** (erledigt)
2. ⏭️ **Öffentlichen Key bei Manus hinterlegen**
3. ⏭️ **GitHub Secrets konfigurieren**
4. ⏭️ **Öffentlichen Key auf Server installieren**
5. ⏭️ **SSH-Verbindung testen**
6. ⏭️ **Test-Deployment durchführen**
