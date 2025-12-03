# 🚀 Deployment - Nächste Schritte

## ✅ Was bereits erledigt ist

1. ✅ **SSH-Key generiert** (`~/.ssh/github_actions_houston`)
2. ✅ **GitHub Secrets konfiguriert:**
   - SSH_HOST = `houston.manus.space`
   - SSH_USER = `ubuntu`
   - SSH_PRIVATE_KEY = (kompletter privater Key)
   - SSH_PORT = `22`
3. ✅ **Workflow aktiviert:** `.github/workflows/deploy-ssh.yml`
4. ✅ **Dokumentation erstellt**

---

## ⏭️ Was noch zu tun ist

### Schritt 1: Öffentlichen Key bei Manus hinterlegen ⚠️ MANUELL

**Anleitung:** Siehe `docs/MANUS_KEY_HINZUFUEGEN.md`

**Öffentlicher Key:**

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAINjUwg0sGgmU//cg1I+8UIsxGtt4qsSjsXTyLAwOdidq github-actions-houston-deployment
```

**Kurzanleitung:**

1. Gehe zu: Manus Dashboard → SSH Keys
2. Klicke: "Add SSH Key"
3. Name: `GitHub Actions Houston Deployment`
4. Key einfügen (siehe oben)
5. Speichern

---

### Schritt 2: Test-Deployment durchführen

**Nachdem der Key bei Manus hinterlegt ist:**

**Option A: Automatisch (bei Push zu main)**

```bash
git commit --allow-empty -m "test: Trigger SSH deployment test"
git push
```

**Option B: Manuell über GitHub Actions**

1. Gehe zu: `https://github.com/cynarAI/Houston/actions`
2. Klicke: "Deploy via SSH (Kostenlos)"
3. Klicke: "Run workflow"
4. Wähle Branch: `main`
5. Klicke: "Run workflow"

---

### Schritt 3: Deployment überprüfen

**Nach erfolgreichem Deployment:**

1. **GitHub Actions Log prüfen:**
   - Gehe zu: `https://github.com/cynarAI/Houston/actions`
   - Öffne den letzten Workflow-Run
   - Prüfe ob alle Schritte erfolgreich waren

2. **Website prüfen:**
   - Gehe zu: `https://houston.manus.space`
   - Prüfe ob die neueste Version deployed ist

3. **SSH-Verbindung testen:**
   ```bash
   ssh -i ~/.ssh/github_actions_houston ubuntu@houston.manus.space "ls -la /var/www/houston.manus.space/dist"
   ```

---

## 🔍 Troubleshooting

### Problem: "Permission denied (publickey)"

**Lösung:**

- Prüfe ob der öffentliche Key bei Manus hinterlegt ist
- Warte ein paar Minuten (Key-Propagierung kann dauern)
- Prüfe ob der Key auf dem Server installiert ist

### Problem: "Connection timed out"

**Lösung:**

- Prüfe ob SSH von außen erreichbar ist
- Prüfe Firewall-Einstellungen
- Kontaktiere Manus Support falls nötig

### Problem: "Deployment failed"

**Lösung:**

- Prüfe GitHub Actions Logs
- Prüfe ob alle Secrets korrekt konfiguriert sind
- Prüfe ob das Zielverzeichnis existiert und Schreibrechte hat

---

## ✅ Checkliste

- [ ] Öffentlichen Key bei Manus hinterlegt
- [ ] Key auf Server installiert (automatisch von Manus)
- [ ] SSH-Verbindung getestet
- [ ] Test-Deployment durchgeführt
- [ ] Deployment erfolgreich verifiziert
- [ ] Website funktioniert korrekt

---

## 📊 Status

**Aktueller Stand:**

- ✅ GitHub Secrets: Konfiguriert
- ✅ Workflow: Aktiviert
- ⏭️ Manus Key: Ausstehend (manuell)
- ⏭️ Test-Deployment: Ausstehend

**Nächster Schritt:** Öffentlichen Key bei Manus hinterlegen (siehe `docs/MANUS_KEY_HINZUFUEGEN.md`)
