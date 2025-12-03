# GitHub Secrets - Quick Setup

## ⚠️ WICHTIG: Diese Secrets müssen MANUELL in GitHub konfiguriert werden!

**Gehe zu:** `https://github.com/cynarAI/Houston/settings/secrets/actions`

---

## 📋 Secrets zum Kopieren

### 1. SSH_HOST

```
houston.manus.space
```

### 2. SSH_USER

```
ubuntu
```

### 3. SSH_PRIVATE_KEY

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

### 4. SSH_PORT (optional)

```
22
```

---

## 🚀 Schnell-Setup

1. Öffne: `https://github.com/cynarAI/Houston/settings/secrets/actions`
2. Für jedes Secret:
   - Klicke "New repository secret"
   - Name: `SSH_HOST`, `SSH_USER`, `SSH_PRIVATE_KEY`, `SSH_PORT`
   - Value: Kopiere den Wert von oben
   - Klicke "Add secret"

---

## ✅ Nach dem Setup

- Workflow ist bereits aktiviert (`.github/workflows/deploy-ssh.yml`)
- Test-Deployment wird automatisch getriggert bei Push zu `main`
- Oder manuell: GitHub Actions → "Deploy via SSH (Kostenlos)" → "Run workflow"
