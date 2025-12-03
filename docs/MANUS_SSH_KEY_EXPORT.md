# SSH-Key von Manus exportieren

## ✅ Aktueller Status

**SSH-Key bei Manus:**

- **Name:** Houston Deployment Server
- **SHA256:** `6nGik/ZoRQn+/SdQ6pHZBEkspQCTi5Cp7scjxfzQaVQ`
- **Hinzugefügt:** Dec 3, 2025
- **Status:** Never used — Read/write

---

## 🔍 Problem

**Für GitHub Actions brauchen wir den privaten SSH-Key.**

**Aber:** Manus zeigt normalerweise nur den **öffentlichen Key** an, nicht den privaten.

---

## 🎯 Lösung: Optionen

### Option A: Privaten Key von Manus exportieren (falls möglich)

**Schritt 1: Prüfe Manus Dashboard**

1. Gehe zu Manus Dashboard
2. Navigiere zu SSH Keys / Deploy Keys
3. Finde "Houston Deployment Server"
4. Prüfe ob es eine "Download" oder "Export" Funktion gibt

**Falls verfügbar:**

- Exportiere den privaten Key
- Kopiere den kompletten Key (inkl. Header/Footer)
- Füge ihn als GitHub Secret `SSH_PRIVATE_KEY` hinzu

---

### Option B: Neuen SSH-Key generieren (empfohlen)

**Falls der private Key nicht verfügbar ist, generiere einen neuen:**

**Schritt 1: Neuen SSH-Key generieren**

```bash
# Generiere neuen SSH-Key speziell für GitHub Actions
ssh-keygen -t ed25519 -C "github-actions-houston-deployment" -f ~/.ssh/github_actions_houston

# WICHTIG: Keine Passphrase eingeben (für GitHub Actions)
# Drücke einfach Enter bei "Enter passphrase"
```

**Schritt 2: Öffentlichen Key bei Manus hinterlegen**

1. Zeige den öffentlichen Key:

   ```bash
   cat ~/.ssh/github_actions_houston.pub
   ```

2. Kopiere den kompletten öffentlichen Key

3. Gehe zu Manus Dashboard → SSH Keys
4. Füge den neuen öffentlichen Key hinzu
5. Name: "GitHub Actions Houston Deployment"

**Schritt 3: Privaten Key als GitHub Secret hinzufügen**

1. Zeige den privaten Key:

   ```bash
   cat ~/.ssh/github_actions_houston
   ```

2. Kopiere den **kompletten** Key (inkl. Header/Footer):

   ```
   REMOVED_PRIVATE_KEY_BEGIN
   [Key-Inhalt]
   REMOVED_PRIVATE_KEY_END
   ```

3. Gehe zu: `https://github.com/cynarAI/Houston/settings/secrets/actions`
4. Erstelle Secret: `SSH_PRIVATE_KEY`
5. Füge den kompletten privaten Key ein

**Schritt 4: Öffentlichen Key auf Server installieren**

```bash
# Test SSH-Verbindung und installiere Key
ssh-copy-id -i ~/.ssh/github_actions_houston.pub ubuntu@houston.manus.space

# Oder manuell:
cat ~/.ssh/github_actions_houston.pub | ssh ubuntu@houston.manus.space "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

---

### Option C: Bestehenden Key verwenden (falls lokal vorhanden)

**Falls du den Key lokal hast:**

**Schritt 1: Prüfe lokale SSH-Keys**

```bash
# Liste alle SSH-Keys
ls -la ~/.ssh/

# Prüfe Fingerprint (um zu sehen ob es der richtige Key ist)
ssh-keygen -lf ~/.ssh/id_rsa.pub
ssh-keygen -lf ~/.ssh/id_ed25519.pub
```

**Schritt 2: Finde den Key mit passendem Fingerprint**

Der Fingerprint sollte sein: `SHA256:6nGik/ZoRQn+/SdQ6pHZBEkspQCTi5Cp7scjxfzQaVQ`

**Schritt 3: Verwende den privaten Key**

```bash
# Zeige privaten Key
cat ~/.ssh/id_rsa  # oder id_ed25519

# Kopiere den kompletten Key
# Füge ihn als GitHub Secret `SSH_PRIVATE_KEY` hinzu
```

---

## 🔧 GitHub Secrets konfigurieren

**Nachdem du den privaten Key hast:**

**Gehe zu:** `https://github.com/cynarAI/Houston/settings/secrets/actions`

**Erstelle folgende Secrets:**

| Secret Name       | Wert                  | Beschreibung            |
| ----------------- | --------------------- | ----------------------- |
| `SSH_HOST`        | `houston.manus.space` | Server Hostname         |
| `SSH_USER`        | `ubuntu`              | SSH Username            |
| `SSH_PRIVATE_KEY` | `[Privater Key]`      | Kompletter privater Key |
| `SSH_PORT`        | `22`                  | SSH Port (optional)     |

**Wichtig für `SSH_PRIVATE_KEY`:**

- Muss den **kompletten** Key enthalten (inkl. Header/Footer)
- Keine Zeilenumbrüche entfernen!
- Format:
  ```
  REMOVED_PRIVATE_KEY_BEGIN
  [Key-Inhalt]
  REMOVED_PRIVATE_KEY_END
  ```

---

## 🧪 Test SSH-Verbindung

**Nach Secrets-Konfiguration:**

```bash
# Test mit lokalem Key
ssh -i ~/.ssh/github_actions_houston ubuntu@houston.manus.space

# Oder falls Key bereits in ~/.ssh/config:
ssh ubuntu@houston.manus.space
```

**Erwartetes Ergebnis:**

- ✅ Erfolgreiche Verbindung → Weiter mit Workflow
- ❌ "Permission denied" → Key nicht auf Server installiert
- ❌ "Connection refused" → SSH nicht verfügbar

---

## ✅ Checkliste

- [ ] Privaten Key identifiziert/exportiert
- [ ] GitHub Secrets konfiguriert:
  - [ ] `SSH_HOST` = `houston.manus.space`
  - [ ] `SSH_USER` = `ubuntu`
  - [ ] `SSH_PRIVATE_KEY` = [Privater Key]
  - [ ] `SSH_PORT` = `22` (optional)
- [ ] Öffentlicher Key auf Server installiert
- [ ] SSH-Verbindung getestet
- [ ] Test-Deployment durchgeführt

---

## 🎯 Empfehlung

**Option B (Neuen Key generieren) ist am sichersten:**

- ✅ Du hast volle Kontrolle
- ✅ Key ist speziell für GitHub Actions
- ✅ Keine Passphrase (für Automation)
- ✅ Einfach zu verwalten

**Falls der bestehende Key wichtig ist:**

- Prüfe ob Manus eine Export-Funktion hat
- Oder kontaktiere Manus Support für den privaten Key

---

## 🔗 Nächste Schritte

1. **Prüfe Manus Dashboard:** Gibt es eine Export-Funktion?
2. **Falls nicht:** Generiere neuen Key (Option B)
3. **Dann:** GitHub Secrets konfigurieren
4. **Dann:** SSH-Verbindung testen
5. **Dann:** Test-Deployment durchführen
