# 🛡️ Branch Protection Rules Setup

Diese Anleitung zeigt dir, wie du Branch Protection für den `main` Branch aktivierst.

## 📋 Schritte

### 1. GitHub Repository öffnen
Gehe zu: https://github.com/cynarAI/Houston

### 2. Settings öffnen
- Klicke auf **Settings** (oben rechts)
- Im Menü links: **Branches** (unter "Code and automation")

### 3. Branch Protection Rule hinzufügen
- Klicke auf **"Add branch protection rule"**
- Bei **Branch name pattern**: `main` eingeben

### 4. Folgende Optionen aktivieren:

#### ✅ **Require a pull request before merging**
- ☑️ Aktivieren
- Optional: "Require approvals" (1 Approval empfohlen)
- ☑️ "Dismiss stale pull request approvals when new commits are pushed"

#### ✅ **Require status checks to pass before merging**
- ☑️ Aktivieren
- Im Suchfeld: **"Test & Build"** auswählen (dein CI-Workflow)
- ☑️ "Require branches to be up to date before merging"

#### ✅ **Require conversation resolution before merging**
- ☑️ Aktivieren (alle Kommentare müssen aufgelöst sein)

#### ✅ **Do not allow bypassing the above settings**
- ☑️ Aktivieren (selbst Admins müssen die Regeln befolgen)

#### ❌ **Optionale Regeln (kannst du überspringen):**
- "Require signed commits" - nur nötig für hohe Sicherheitsanforderungen
- "Require linear history" - verhindert Merge-Commits
- "Lock branch" - macht Branch read-only

### 5. Speichern
- Scrolle nach unten
- Klicke auf **"Create"** oder **"Save changes"**

## ✅ Ergebnis

Nach Aktivierung:
- ❌ Keine direkten Pushes auf `main` möglich
- ✅ Nur via Pull Request
- ✅ CI muss grün sein vor Merge
- ✅ Optional: Mind. 1 Review nötig

## 🚀 Workflow danach

```bash
# 1. Feature-Branch erstellen
git checkout -b feature/neue-funktion

# 2. Änderungen machen
git add .
git commit -m "Neue Funktion"

# 3. Pushen
git push origin feature/neue-funktion

# 4. Pull Request auf GitHub erstellen
# 5. CI läuft automatisch
# 6. Nach grünem CI: Merge in main
```

## 💡 Tipp: Dependabot Auto-Merge

Der Dependabot Auto-Merge Workflow wird automatisch aktiviert, sobald:
- Branch Protection aktiv ist
- Ein Dependabot-PR erstellt wird
- CI passing ist
- Es ein Minor/Patch Update ist (kein Major)


