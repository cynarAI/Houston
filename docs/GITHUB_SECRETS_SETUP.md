# GitHub Secrets Setup - Schritt für Schritt

## ✅ SSH-Key generiert

**Öffentlicher Key:**

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAINjUwg0sGgmU//cg1I+8UIsxGtt4qsSjsXTyLAwOdidq github-actions-houston-deployment
```

**Privater Key:** (siehe unten)

---

## 🔧 GitHub Secrets konfigurieren

**Gehe zu:** `https://github.com/cynarAI/Houston/settings/secrets/actions`

### Secret 1: SSH_HOST

1. Klicke: **"New repository secret"**
2. **Name:** `SSH_HOST`
3. **Secret:** `houston.manus.space`
4. Klicke: **"Add secret"**

---

### Secret 2: SSH_USER

1. Klicke: **"New repository secret"**
2. **Name:** `SSH_USER`
3. **Secret:** `ubuntu`
4. Klicke: **"Add secret"**

---

### Secret 3: SSH_PRIVATE_KEY

1. Klicke: **"New repository secret"**
2. **Name:** `SSH_PRIVATE_KEY`
3. **Secret:** Füge den **KOMPLETTEN** privaten Key ein:

```
REMOVED_PRIVATE_KEY_BEGIN
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW
QyNTUxOQAAACDY1MINLBoJlP/3INSPvFCLMRrbeKrEo7F08iwMDnYnagAAAKhUuOGgVLjh
oAAAAAtzc2gtZWQyNTUxOQAAACDY1MINLBoJlP/3INSPvFCLMRrbeKrEo7F08iwMDnYnag
AAAEDVPD3YotXdFe2zu+RwRhRgHqA6ZhH1rCJ+qYIoFU9BOtjUwg0sGgmU//cg1I+8UIsx
Gtt4qsSjsXTyLAwOdidqAAAAIWdpdGh1Yi1hY3Rpb25zLWhvdXN0b24tZGVwbG95bWVudA
ECAwQ=
REMOVED_PRIVATE_KEY_END
```

**⚠️ WICHTIG:**

- Kopiere den **kompletten** Key (inkl. `-----BEGIN` und `-----END` Zeilen)
- Keine Zeilenumbrüche entfernen!
- Alle Zeilen müssen enthalten sein

4. Klicke: **"Add secret"**

---

### Secret 4: SSH_PORT (optional)

1. Klicke: **"New repository secret"**
2. **Name:** `SSH_PORT`
3. **Secret:** `22`
4. Klicke: **"Add secret"**

---

## ✅ Verifizierung

**Nach dem Setup sollten folgende Secrets vorhanden sein:**

- ✅ `SSH_HOST` = `houston.manus.space`
- ✅ `SSH_USER` = `ubuntu`
- ✅ `SSH_PRIVATE_KEY` = [Privater Key]
- ✅ `SSH_PORT` = `22` (optional)

---

## 🔍 Troubleshooting

### Problem: "Secret already exists"

**Lösung:**

- Gehe zu: `Settings` → `Secrets and variables` → `Actions`
- Finde das bestehende Secret
- Klicke auf das Secret → **"Update"**
- Füge den neuen Wert ein

### Problem: "Invalid secret format"

**Lösung:**

- Stelle sicher, dass der private Key komplett ist (inkl. Header/Footer)
- Keine zusätzlichen Leerzeichen am Anfang/Ende
- Alle Zeilen müssen enthalten sein

---

## 📝 Nächste Schritte

Nach dem GitHub Secrets Setup:

1. ✅ Öffentlichen Key bei Manus hinterlegen
2. ✅ Öffentlichen Key auf Server installieren
3. ✅ SSH-Verbindung testen
4. ✅ Test-Deployment durchführen
