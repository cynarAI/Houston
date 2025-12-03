# Öffentlichen SSH-Key bei Manus hinzufügen

## ✅ Status

**Öffentlicher SSH-Key bereit:**

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAINjUwg0sGgmU//cg1I+8UIsxGtt4qsSjsXTyLAwOdidq github-actions-houston-deployment
```

---

## 📋 Schritt-für-Schritt Anleitung

### Schritt 1: Manus Dashboard öffnen

1. Gehe zu: `https://manus.im` oder dein Manus Dashboard
2. Logge dich ein

### Schritt 2: SSH Keys Sektion finden

**Mögliche Wege:**

- **Settings** → **SSH Keys**
- **Account** → **SSH Keys**
- **Deploy Keys** → **Add Key**
- **Security** → **SSH Keys**

### Schritt 3: Neuen SSH-Key hinzufügen

1. Klicke auf: **"Add SSH Key"** oder **"Add Deploy Key"** oder **"New SSH Key"**

2. **Fülle die Felder aus:**
   - **Name/Titel:** `GitHub Actions Houston Deployment`
   - **Key:** Füge den kompletten öffentlichen Key ein:
     ```
     ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAINjUwg0sGgmU//cg1I+8UIsxGtt4qsSjsXTyLAwOdidq github-actions-houston-deployment
     ```
   - **Berechtigungen:** Read/write (falls verfügbar)

3. Klicke: **"Add"** oder **"Save"**

### Schritt 4: Verifizierung

Nach dem Hinzufügen sollte der Key:

- ✅ In der Liste der SSH Keys erscheinen
- ✅ Den Namen "GitHub Actions Houston Deployment" haben
- ✅ Status: "Active" oder "Ready"

---

## 🔍 Falls der Key bereits existiert

Falls ein Key mit ähnlichem Namen bereits existiert:

- **Option 1:** Lösche den alten Key und füge den neuen hinzu
- **Option 2:** Verwende den bestehenden Key (falls der private Key verfügbar ist)

---

## ✅ Nach dem Hinzufügen

1. ✅ Key ist bei Manus hinterlegt
2. ⏭️ Key wird automatisch auf Server installiert (von Manus verwaltet)
3. ⏭️ SSH-Verbindung testen
4. ⏭️ Test-Deployment durchführen

---

## 🚨 Wichtig

- **Nur den öffentlichen Key** hinzufügen (`.pub` Datei)
- **NICHT** den privaten Key teilen!
- Der private Key ist bereits als GitHub Secret konfiguriert

---

## 📞 Falls Probleme

Falls du die SSH Keys Sektion nicht findest:

1. Kontaktiere Manus Support
2. Frage nach: "Wie füge ich einen SSH-Key für GitHub Actions hinzu?"
3. Erwähne: "Ich möchte einen Deploy-Key für automatische Deployments hinzufügen"
