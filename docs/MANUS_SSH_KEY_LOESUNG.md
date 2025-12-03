# SSH-Key von Manus - Lösung basierend auf Dokumentation

## ✅ Aktueller Status

**SSH-Key bei Manus:**

- **Name:** Houston Deployment Server
- **SHA256:** `6nGik/ZoRQn+/SdQ6pHZBEkspQCTi5Cp7scjxfzQaVQ`
- **Hinzugefügt:** Dec 3, 2025
- **Status:** Never used — Read/write

---

## 🔍 Erkenntnisse aus der Dokumentation

### Problem

**Für GitHub Actions brauchen wir den privaten SSH-Key.**

**Aber:** Laut Dokumentation (`docs/MANUS_SSH_KEY_EXPORT.md`):

> "Manus zeigt normalerweise nur den **öffentlichen Key** an, nicht den privaten."

### Typisches Verhalten von SSH-Key-Management-Systemen

- **Öffentliche Keys** werden angezeigt (sicher zu teilen)
- **Private Keys** werden normalerweise NICHT exportiert (Sicherheitsrisiko)
- Private Keys sollten nur beim Erstellen gespeichert werden

---

## 🎯 Empfohlene Lösung

### Option 1: Prüfe Manus Dashboard (zuerst)

**Schritt 1: Manus Dashboard öffnen**

1. Gehe zu: `https://manus.im` (oder dein Manus Dashboard)
2. Navigiere zu: **SSH Keys** / **Deploy Keys** / **Settings** → **SSH Keys**
3. Finde: "Houston Deployment Server"

**Schritt 2: Prüfe verfügbare Optionen**

- Gibt es einen **"Download"** oder **"Export"** Button?
- Gibt es eine **"Show Private Key"** Option?
- Gibt es eine **"Copy Private Key"** Funktion?

**Falls verfügbar:**

- ✅ Exportiere den privaten Key
- ✅ Kopiere den kompletten Key (inkl. Header/Footer)
- ✅ Füge ihn als GitHub Secret `SSH_PRIVATE_KEY` hinzu

**Falls NICHT verfügbar:**
→ Weiter zu Option 2

---

### Option 2: Neuen SSH-Key generieren (empfohlen)

**Warum?**

- ✅ Du hast volle Kontrolle
- ✅ Key ist speziell für GitHub Actions
- ✅ Keine Passphrase (für Automation)
- ✅ Einfach zu verwalten
- ✅ Sicher (alter Key bleibt bei Manus, neuer Key nur für GitHub)

**Schritte:**

```bash
# 1. Neuen SSH-Key generieren
ssh-keygen -t ed25519 -C "github-actions-houston-deployment" -f ~/.ssh/github_actions_houston

# WICHTIG: Keine Passphrase eingeben (Enter drücken)
# Frage: "Enter passphrase (empty for no passphrase):" → Enter
# Frage: "Enter same passphrase again:" → Enter
```

**2. Öffentlichen Key anzeigen:**

```bash
cat ~/.ssh/github_actions_houston.pub
```

**3. Öffentlichen Key bei Manus hinterlegen:**

- Gehe zu Manus Dashboard → SSH Keys
- Klicke "Add SSH Key" oder "Add Deploy Key"
- Name: "GitHub Actions Houston Deployment"
- Füge den öffentlichen Key ein
- Speichern

**4. Privaten Key für GitHub Secret kopieren:**

```bash
cat ~/.ssh/github_actions_houston
```

**5. GitHub Secrets konfigurieren:**

- Gehe zu: `https://github.com/cynarAI/Houston/settings/secrets/actions`
- Erstelle Secret: `SSH_PRIVATE_KEY`
- Füge den kompletten privaten Key ein (inkl. Header/Footer)

**6. Öffentlichen Key auf Server installieren:**

```bash
# Test SSH-Verbindung und installiere Key
ssh-copy-id -i ~/.ssh/github_actions_houston.pub ubuntu@houston.manus.space

# Oder manuell:
cat ~/.ssh/github_actions_houston.pub | ssh ubuntu@houston.manus.space "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

---

### Option 3: Bei Manus Support nachfragen

**Falls Option 1 und 2 nicht funktionieren:**

**E-Mail an Manus Support:**

```
Betreff: Privaten SSH-Key exportieren - Houston Deployment Server

Hallo Manus Support,

ich habe einen SSH-Key "Houston Deployment Server" (SHA256: 6nGik/ZoRQn+/SdQ6pHZBEkspQCTi5Cp7scjxfzQaVQ)
in meinem Manus Dashboard hinterlegt.

Für automatisierte Deployments via GitHub Actions benötige ich den privaten SSH-Key.
Könntet ihr mir bitte helfen, den privaten Key zu exportieren oder eine Alternative vorschlagen?

Vielen Dank!
```

---

## 📋 GitHub Secrets Setup (nachdem du den privaten Key hast)

**Gehe zu:** `https://github.com/cynarAI/Houston/settings/secrets/actions`

**Erstelle folgende Secrets:**

| Secret Name       | Wert                  | Beschreibung                     |
| ----------------- | --------------------- | -------------------------------- |
| `SSH_HOST`        | `houston.manus.space` | Server Hostname                  |
| `SSH_USER`        | `ubuntu`              | SSH Username (aus Docs gefunden) |
| `SSH_PRIVATE_KEY` | `[Privater Key]`      | Kompletter privater Key          |
| `SSH_PORT`        | `22`                  | SSH Port (optional)              |

**Wichtig für `SSH_PRIVATE_KEY`:**

- Muss den **kompletten** Key enthalten:
  ```
  REMOVED_PRIVATE_KEY_BEGIN
  [Key-Inhalt]
  REMOVED_PRIVATE_KEY_END
  ```
- Keine Zeilenumbrüche entfernen!

---

## ✅ Checkliste

- [ ] Manus Dashboard geprüft (Export-Funktion vorhanden?)
- [ ] Falls nicht: Neuen SSH-Key generiert
- [ ] Öffentlichen Key bei Manus hinterlegt
- [ ] Privaten Key als GitHub Secret hinzugefügt
- [ ] Öffentlichen Key auf Server installiert
- [ ] SSH-Verbindung getestet
- [ ] Test-Deployment durchgeführt

---

## 🎯 Empfehlung

**Option 2 (Neuen Key generieren) ist am sichersten und einfachsten:**

- ✅ Keine Abhängigkeit von Manus Export-Funktion
- ✅ Key ist speziell für GitHub Actions
- ✅ Einfach zu verwalten
- ✅ Sicher (alter Key bleibt bei Manus)

---

## 🔗 Nächste Schritte

1. **Sofort:** Manus Dashboard prüfen (Option 1)
2. **Falls nicht verfügbar:** Neuen Key generieren (Option 2)
3. **Dann:** GitHub Secrets konfigurieren
4. **Dann:** SSH-Verbindung testen
5. **Dann:** Test-Deployment durchführen
