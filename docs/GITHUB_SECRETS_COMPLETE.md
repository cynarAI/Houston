# GitHub Secrets - Komplette Anleitung

## ✅ Status

**SSH_HOST hinzugefügt:** ✅ Erfolgreich

**Noch hinzuzufügen:**

- SSH_USER
- SSH_PRIVATE_KEY
- SSH_PORT (optional)

---

## 🔧 Secrets hinzufügen

**Gehe zu:** `https://github.com/cynarAI/Houston/settings/secrets/actions`

**Für jedes Secret:**

1. Klicke: **"New repository secret"**
2. Fülle die Felder aus
3. Klicke: **"Add secret"**

---

## 📋 Secret 1: SSH_USER

**Name:** `SSH_USER`  
**Value:** `ubuntu`

---

## 📋 Secret 2: SSH_PRIVATE_KEY

**Name:** `SSH_PRIVATE_KEY`  
**Value:** (Kompletter privater Key - siehe Datei: `~/.ssh/github_actions_houston`)

**WICHTIG:** Der Key muss komplett sein, inkl. Header/Footer!

---

## 📋 Secret 3: SSH_PORT (optional)

**Name:** `SSH_PORT`  
**Value:** `22`

---

## ✅ Nach Abschluss

- Alle Secrets konfiguriert
- Öffentlichen Key bei Manus hinterlegen
- Öffentlichen Key auf Server installieren
- SSH-Verbindung testen
- Test-Deployment durchführen
