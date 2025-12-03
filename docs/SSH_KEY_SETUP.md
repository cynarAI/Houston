# SSH-Key Setup für Houston Deployment

## ✅ Gefundener SSH-Key

**Name:** Houston Deployment Server  
**SHA256:** `6nGik/ZoRQn+/SdQ6pHZBEkspQCTi5Cp7scjxfzQaVQ`  
**Hinzugefügt:** Dec 3, 2025  
**Status:** Never used — Read/write

---

## 🔧 Setup-Schritte

### Schritt 1: SSH-Key aus GitHub kopieren

**Falls der Key bereits in GitHub hinterlegt ist:**

1. Gehe zu: `https://github.com/settings/keys` (oder Repository Settings → Deploy keys)
2. Finde den Key "Houston Deployment Server"
3. Kopiere den **privaten Key** (falls verfügbar)
   - ⚠️ **Wichtig:** Du brauchst den **privaten Key**, nicht den öffentlichen!

**Falls der Key lokal vorhanden ist:**

```bash
# Prüfe ob Key lokal existiert
ls -la ~/.ssh/ | grep -i houston

# Falls vorhanden, zeige Fingerprint
ssh-keygen -lf ~/.ssh/id_rsa  # oder welcher Key auch immer
```

---

### Schritt 2: GitHub Secrets konfigurieren

**Gehe zu:** `https://github.com/cynarAI/Houston/settings/secrets/actions`

**Erstelle folgende Secrets:**

| Secret Name       | Wert                  | Beschreibung                         |
| ----------------- | --------------------- | ------------------------------------ |
| `SSH_HOST`        | `houston.manus.space` | Server Hostname                      |
| `SSH_USER`        | `ubuntu`              | SSH Username (aus Docs gefunden)     |
| `SSH_PRIVATE_KEY` | `[Privater SSH-Key]`  | Kompletter privater Key              |
| `SSH_PORT`        | `22`                  | SSH Port (optional, Standard ist 22) |

**Wichtig für `SSH_PRIVATE_KEY`:**

- Muss den **kompletten** Key enthalten:
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
- Keine Zeilenumbrüche entfernen!

---

### Schritt 3: Öffentlichen Key auf Server installieren

**Falls der öffentliche Key noch nicht auf dem Server ist:**

```bash
# Generiere öffentlichen Key aus privatem Key (falls nötig)
ssh-keygen -y -f ~/.ssh/id_rsa > ~/.ssh/id_rsa.pub

# Kopiere öffentlichen Key auf Server
ssh-copy-id -i ~/.ssh/id_rsa.pub ubuntu@houston.manus.space

# Oder manuell:
cat ~/.ssh/id_rsa.pub | ssh ubuntu@houston.manus.space "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

**Falls der Key bereits in GitHub/Manus hinterlegt ist:**

- Der öffentliche Key sollte bereits auf dem Server installiert sein
- Teste Verbindung: `ssh ubuntu@houston.manus.space`

---

### Schritt 4: SSH-Verbindung testen

```bash
# Test SSH-Verbindung
ssh ubuntu@houston.manus.space

# Falls Key mit Passphrase:
ssh -i ~/.ssh/id_rsa ubuntu@houston.manus.space

# Test mit Fingerprint-Verifizierung
ssh -o StrictHostKeyChecking=no ubuntu@houston.manus.space
```

**Erwartetes Ergebnis:**

- ✅ Erfolgreiche Verbindung → Weiter mit Workflow-Aktivierung
- ❌ "Permission denied" → Key nicht auf Server installiert
- ❌ "Connection refused" → SSH nicht verfügbar

---

### Schritt 5: Workflow aktivieren

**Der Workflow ist bereits erstellt:** `.github/workflows/deploy-ssh.yml.example`

**Aktivierung:**

1. **Option A: Workflow umbenennen**

   ```bash
   mv .github/workflows/deploy-ssh.yml.example .github/workflows/deploy-ssh.yml
   ```

2. **Option B: Workflow kopieren**

   ```bash
   cp .github/workflows/deploy-ssh.yml.example .github/workflows/deploy-ssh.yml
   ```

3. **Commit und Push**
   ```bash
   git add .github/workflows/deploy-ssh.yml
   git commit -m "feat: SSH-Deployment Workflow aktivieren"
   git push origin main
   ```

---

### Schritt 6: Test-Deployment

```bash
# Test-Commit erstellen
git commit --allow-empty -m "test: SSH deployment"
git push origin main

# Überwache GitHub Actions
# Gehe zu: https://github.com/cynarAI/Houston/actions
```

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

## ✅ Checkliste

- [ ] SSH-Key identifiziert (SHA256: `6nGik/ZoRQn+/SdQ6pHZBEkspQCTi5Cp7scjxfzQaVQ`)
- [ ] Privater Key aus GitHub/Manus kopiert
- [ ] GitHub Secrets konfiguriert (`SSH_HOST`, `SSH_USER`, `SSH_PRIVATE_KEY`)
- [ ] Öffentlicher Key auf Server installiert
- [ ] SSH-Verbindung getestet
- [ ] Workflow aktiviert (`.github/workflows/deploy-ssh.yml`)
- [ ] Test-Deployment durchgeführt
- [ ] Alten Manus-Workflow deaktiviert

---

## 📝 Nächste Schritte

1. **Sofort:** Privaten Key aus GitHub/Manus kopieren
2. **Dann:** GitHub Secrets konfigurieren
3. **Dann:** SSH-Verbindung testen
4. **Dann:** Workflow aktivieren
5. **Dann:** Test-Deployment durchführen

---

## 🔗 Referenzen

- Setup-Anleitung: `docs/SSH_DEPLOYMENT_SETUP.md`
- Quickstart: `docs/SSH_DEPLOYMENT_QUICKSTART.md`
- Recherche: `docs/SSH_RECHERCHE_ZUSAMMENFASSUNG.md`
