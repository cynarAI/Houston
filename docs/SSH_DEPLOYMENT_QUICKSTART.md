# SSH-Deployment Quickstart

**Ziel:** Migration von Manus Agent (Credits) zu SSH-Deployment (kostenlos)

---

## ✅ Checkliste

- [ ] SSH-Zugang von Manus erhalten
- [ ] SSH-Key generiert und auf Server installiert
- [ ] GitHub Secrets konfiguriert
- [ ] Workflow aktiviert
- [ ] Test-Deployment durchgeführt
- [ ] Alten Manus-Workflow deaktiviert

---

## 🚀 Schritt-für-Schritt Anleitung

### Schritt 1: SSH-Zugang anfragen

**E-Mail an Manus Support senden** (siehe `docs/MANUS_SSH_ANFRAGE.md`)

**Benötigte Informationen:**

- SSH Hostname/IP: `houston.manus.space` oder IP-Adresse
- SSH Username: z.B. `ubuntu`, `deploy`, `root`
- SSH Port: Standard `22` (oder anderer)

---

### Schritt 2: SSH-Key generieren

```bash
# Generiere neuen SSH-Key für GitHub Actions
ssh-keygen -t ed25519 -C "github-actions-houston" -f ~/.ssh/github_actions_houston

# Öffentlichen Key auf Server installieren
ssh-copy-id -i ~/.ssh/github_actions_houston.pub USER@HOST

# Oder manuell:
cat ~/.ssh/github_actions_houston.pub | ssh USER@HOST "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

**Wichtig:**

- Ersetze `USER` und `HOST` mit den Werten von Manus
- Key sollte **ohne Passphrase** sein (für GitHub Actions)

---

### Schritt 3: GitHub Secrets konfigurieren

**Gehe zu:** `https://github.com/cynarAI/Houston/settings/secrets/actions`

**Erstelle folgende Secrets:**

| Secret Name       | Wert                    | Beispiel                                   |
| ----------------- | ----------------------- | ------------------------------------------ |
| `SSH_HOST`        | Server Hostname/IP      | `houston.manus.space`                      |
| `SSH_USER`        | SSH Username            | `ubuntu`                                   |
| `SSH_PRIVATE_KEY` | Privater Key (komplett) | Inhalt von `~/.ssh/github_actions_houston` |
| `SSH_PORT`        | SSH Port (optional)     | `22`                                       |

**Wichtig:**

- `SSH_PRIVATE_KEY` muss den **kompletten** Key enthalten:
  ```
  REMOVED_PRIVATE_KEY_BEGIN
  [Key-Inhalt]
  REMOVED_PRIVATE_KEY_END
  ```
- Keine Zeilenumbrüche entfernen!
- Key sollte **ohne Passphrase** sein

**Key-Inhalt kopieren:**

```bash
cat ~/.ssh/github_actions_houston
```

---

### Schritt 4: Workflow aktivieren

**Der Workflow ist bereits erstellt:** `.github/workflows/deploy-ssh.yml`

**Aktivierung:**

- Workflow wird automatisch aktiv, sobald Secrets konfiguriert sind
- Keine weitere Aktion nötig

**Testen:**

```bash
# Test-Commit erstellen
git commit --allow-empty -m "test: SSH deployment"
git push origin main
```

---

### Schritt 5: Alten Manus-Workflow deaktivieren

**Option A: Workflow umbenennen (empfohlen)**

```bash
mv .github/workflows/optimized-ci.yml .github/workflows/optimized-ci.yml.disabled
```

**Option B: Deploy-Job deaktivieren**

- Öffne `.github/workflows/optimized-ci.yml`
- Kommentiere den `deploy` Job aus oder entferne ihn

**Option C: Workflow löschen**

```bash
# Nur wenn sicher, dass SSH-Deployment funktioniert!
rm .github/workflows/optimized-ci.yml
```

---

## 🔍 Troubleshooting

### Problem: SSH-Verbindung schlägt fehl

**Fehler:** `Permission denied (publickey)`

**Lösung:**

1. Prüfe ob Key korrekt auf Server installiert ist:
   ```bash
   ssh -i ~/.ssh/github_actions_houston USER@HOST "echo 'SSH works'"
   ```
2. Prüfe GitHub Secret `SSH_PRIVATE_KEY` (kompletter Key?)
3. Prüfe Username/Hostname

---

### Problem: Dateien werden nicht kopiert

**Fehler:** `scp: failed to upload file`

**Lösung:**

1. Prüfe ob Ziel-Verzeichnis existiert:
   ```bash
   ssh USER@HOST "ls -la /var/www/houston.manus.space"
   ```
2. Prüfe Berechtigungen:
   ```bash
   ssh USER@HOST "sudo chown -R USER:USER /var/www/houston.manus.space"
   ```
3. Prüfe `strip_components` im Workflow

---

### Problem: Server startet nicht neu

**Lösung:**

- Server-Restart ist **optional** (Workflow läuft weiter)
- Prüfe manuell:
  ```bash
  ssh USER@HOST "pm2 list"  # Falls PM2
  ssh USER@HOST "systemctl status houston"  # Falls systemd
  ```

---

## 📊 Vergleich: Vorher vs. Nachher

| Aspekt              | Manus Agent  | SSH-Deployment |
| ------------------- | ------------ | -------------- |
| **Kosten**          | ❌ Credits   | ✅ Kostenlos   |
| **Geschwindigkeit** | 10-20 Min    | 2-5 Min        |
| **Kontrolle**       | ⚠️ Begrenzt  | ✅ Vollständig |
| **Debugging**       | ⚠️ Schwierig | ✅ Einfach     |
| **Abhängigkeiten**  | Manus API    | Nur SSH        |

---

## ✅ Erfolgskriterien

- [ ] Deployment dauert < 5 Minuten
- [ ] Keine Credits werden verbraucht
- [ ] Website zeigt neuen Commit
- [ ] Keine Fehler im GitHub Actions Log

---

## 📝 Nächste Schritte nach Migration

1. **Monitoring:** Prüfe ob Deployments erfolgreich sind
2. **Optimierung:** Passe Workflow an falls nötig
3. **Dokumentation:** Aktualisiere README mit neuen Deployment-Infos
4. **Cleanup:** Entferne alte Manus-Workflows

---

## 🔗 Referenzen

- Setup-Anleitung: `docs/SSH_DEPLOYMENT_SETUP.md`
- E-Mail-Vorlage: `docs/MANUS_SSH_ANFRAGE.md`
- Kosten-Analyse: `docs/DEPLOYMENT_KOSTEN_ANALYSE.md`
