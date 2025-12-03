# SSH-Deployment Setup - Finale Anleitung

## ✅ Status

**SSH-Key gefunden:**

- **Name:** Houston Deployment Server
- **SHA256:** `6nGik/ZoRQn+/SdQ6pHZBEkspQCTi5Cp7scjxfzQaVQ`
- **Hinzugefügt:** Dec 3, 2025
- **Status:** Never used — Read/write

**Workflow aktiviert:** ✅ `.github/workflows/deploy-ssh.yml`

---

## 🔧 GitHub Secrets konfigurieren

**Gehe zu:** `https://github.com/cynarAI/Houston/settings/secrets/actions`

**Erstelle folgende Secrets:**

### 1. SSH_HOST

- **Name:** `SSH_HOST`
- **Wert:** `houston.manus.space`

### 2. SSH_USER

- **Name:** `SSH_USER`
- **Wert:** `ubuntu`

### 3. SSH_PRIVATE_KEY

- **Name:** `SSH_PRIVATE_KEY`
- **Wert:** [Privater SSH-Key]

**Wichtig:**

- Du brauchst den **privaten Key** (nicht den öffentlichen!)
- Der Key muss komplett sein, inkl. Header/Footer:
  ```
  REMOVED_PRIVATE_KEY_BEGIN
  [Key-Inhalt]
  REMOVED_PRIVATE_KEY_END
  ```
- Oder falls RSA:
  ```
  REMOVED_PRIVATE_KEY_BEGIN
  [Key-Inhalt]
  REMOVED_PRIVATE_KEY_END
  ```

**Wo finde ich den privaten Key?**

- Falls in GitHub hinterlegt: `Settings` → `SSH and GPG keys` → Key herunterladen (falls möglich)
- Falls lokal: `~/.ssh/id_rsa` oder `~/.ssh/id_ed25519`
- Falls in Manus: Manus Dashboard → SSH Keys → Privaten Key exportieren

### 4. SSH_PORT (optional)

- **Name:** `SSH_PORT`
- **Wert:** `22` (Standard)

---

## 🧪 SSH-Verbindung testen

**Bevor du den Workflow aktivierst, teste die SSH-Verbindung:**

```bash
# Test mit lokalem Key
ssh -i ~/.ssh/id_rsa ubuntu@houston.manus.space

# Oder falls Key bereits in ~/.ssh/config:
ssh ubuntu@houston.manus.space
```

**Erwartetes Ergebnis:**

- ✅ Erfolgreiche Verbindung → Weiter mit Workflow
- ❌ "Permission denied" → Key nicht auf Server installiert
- ❌ "Connection refused" → SSH nicht verfügbar

---

## 🚀 Workflow aktivieren

**Der Workflow ist bereits erstellt:** `.github/workflows/deploy-ssh.yml`

**Aktivierung:**

1. GitHub Secrets konfigurieren (siehe oben)
2. SSH-Verbindung testen
3. Commit und Push:
   ```bash
   git add .github/workflows/deploy-ssh.yml
   git commit -m "feat: SSH-Deployment Workflow aktivieren"
   git push origin main
   ```

**Der Workflow wird automatisch ausgeführt bei:**

- Push zu `main` Branch
- Manuell über GitHub Actions UI

---

## 🧪 Test-Deployment

**Nach Secrets-Konfiguration:**

```bash
# Test-Commit erstellen
git commit --allow-empty -m "test: SSH deployment"
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

## 🔄 Alten Manus-Workflow deaktivieren

**Nach erfolgreichem Test:**

**Option A: Workflow umbenennen (empfohlen)**

```bash
mv .github/workflows/optimized-ci.yml .github/workflows/optimized-ci.yml.disabled
git add .github/workflows/
git commit -m "chore: Alten Manus-Workflow deaktivieren"
git push origin main
```

**Option B: Deploy-Job deaktivieren**

- Öffne `.github/workflows/optimized-ci.yml`
- Kommentiere den `deploy` Job aus oder entferne ihn

---

## ✅ Checkliste

- [ ] SSH-Key identifiziert (SHA256: `6nGik/ZoRQn+/SdQ6pHZBEkspQCTi5Cp7scjxfzQaVQ`)
- [ ] Privaten Key aus GitHub/Manus kopiert
- [ ] GitHub Secrets konfiguriert:
  - [ ] `SSH_HOST` = `houston.manus.space`
  - [ ] `SSH_USER` = `ubuntu`
  - [ ] `SSH_PRIVATE_KEY` = [Privater Key]
  - [ ] `SSH_PORT` = `22` (optional)
- [ ] SSH-Verbindung getestet
- [ ] Workflow aktiviert (`.github/workflows/deploy-ssh.yml`)
- [ ] Test-Deployment durchgeführt
- [ ] Alten Manus-Workflow deaktiviert

---

## 🔍 Troubleshooting

### Problem: "Permission denied (publickey)"

**Lösung:**

1. Prüfe ob öffentlicher Key auf Server installiert ist:
   ```bash
   ssh ubuntu@houston.manus.space "cat ~/.ssh/authorized_keys | grep -i houston"
   ```
2. Prüfe GitHub Secret `SSH_PRIVATE_KEY` (kompletter Key?)
3. Prüfe Username/Hostname

### Problem: "Host key verification failed"

**Lösung:**

- Workflow nutzt bereits `StrictHostKeyChecking=no`
- Falls lokal: `ssh-keyscan houston.manus.space >> ~/.ssh/known_hosts`

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

## 📊 Vergleich: Vorher vs. Nachher

| Aspekt              | Manus Agent  | SSH-Deployment |
| ------------------- | ------------ | -------------- |
| **Kosten**          | ❌ Credits   | ✅ Kostenlos   |
| **Geschwindigkeit** | 10-20 Min    | 2-5 Min        |
| **Kontrolle**       | ⚠️ Begrenzt  | ✅ Vollständig |
| **Debugging**       | ⚠️ Schwierig | ✅ Einfach     |

---

## 🎯 Nächste Schritte

1. **Sofort:** GitHub Secrets konfigurieren
2. **Dann:** SSH-Verbindung testen
3. **Dann:** Test-Deployment durchführen
4. **Dann:** Alten Manus-Workflow deaktivieren

---

## 🔗 Referenzen

- Setup-Anleitung: `docs/SSH_DEPLOYMENT_SETUP.md`
- Quickstart: `docs/SSH_DEPLOYMENT_QUICKSTART.md`
- Key-Setup: `docs/SSH_KEY_SETUP.md`
- Recherche: `docs/SSH_RECHERCHE_ZUSAMMENFASSUNG.md`
