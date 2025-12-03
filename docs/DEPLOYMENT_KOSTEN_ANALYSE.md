# Deployment-Kosten-Analyse

**Problem:** Aktuelles Manus Agent-System kostet Credits  
**Ziel:** Kostenlose oder günstigere Alternative finden

---

## 💰 Kosten-Übersicht

### Aktuelles System (Manus Agent)

- **Kosten:** Credits pro Deployment
- **Häufigkeit:** Jeder Push zu `main` = 1 Deployment
- **Problem:** Credits müssen gekauft werden

### Alternative Optionen (Kosten)

| Option                | Credits      | Sonstige Kosten            | Gesamt           |
| --------------------- | ------------ | -------------------------- | ---------------- |
| **Manus Runtime API** | ❓ Unbekannt | -                          | ❓ Unbekannt     |
| **SSH-Deployment**    | ✅ **0**     | -                          | ✅ **Kostenlos** |
| **Docker**            | ✅ **0**     | Server-Kosten              | ⚠️ Server-Kosten |
| **Railway**           | ✅ **0**     | Kostenloser Plan verfügbar | ✅ **Kostenlos** |
| **Vercel**            | ✅ **0**     | Kostenloser Plan verfügbar | ✅ **Kostenlos** |
| **Netlify**           | ✅ **0**     | Kostenloser Plan verfügbar | ✅ **Kostenlos** |

---

## 🎯 Empfehlung: SSH-Deployment (Priorität 1)

**Warum:**

- ✅ **Kostenlos** (keine Credits)
- ✅ Schnell (2-5 Minuten)
- ✅ Volle Kontrolle
- ✅ Keine Vendor-Lock-in
- ✅ Bestehende Infrastruktur nutzen

**Voraussetzungen:**

- SSH-Zugang zum Server (`houston.manus.space`)
- SSH-Key als GitHub Secret

**Nächste Schritte:**

1. Bei Manus Support nach SSH-Zugang fragen
2. Falls verfügbar: SSH-Deployment implementieren
3. GitHub Actions Workflow anpassen

---

## 🎯 Alternative: Railway/Vercel (Priorität 2)

**Falls SSH nicht verfügbar:**

### Railway

- ✅ Kostenloser Plan: $5 Credits/Monat
- ✅ Automatisches Deployment bei Git Push
- ✅ Einfaches Setup
- ⚠️ Domain-Migration nötig

### Vercel

- ✅ Kostenloser Plan verfügbar
- ✅ Sehr schnell
- ✅ Automatisches Deployment
- ⚠️ Domain-Migration nötig

---

## 📋 Implementierungs-Plan

### Option A: SSH-Deployment (bevorzugt)

**Schritt 1: SSH-Zugang prüfen**

```bash
# Test ob SSH verfügbar ist
ssh user@houston.manus.space
```

**Schritt 2: GitHub Actions Workflow anpassen**

- Ersetze Manus API-Call durch SSH-Deployment
- Nutze `appleboy/scp-action` oder `appleboy/ssh-action`
- Konfiguriere GitHub Secrets (SSH_HOST, SSH_USER, SSH_KEY)

**Schritt 3: Testen**

- Test-Deployment durchführen
- Verifizieren dass alles funktioniert

**Geschätzte Zeit:** 1-2 Stunden

---

### Option B: Railway/Vercel (Fallback)

**Schritt 1: Account erstellen**

- Railway: https://railway.app
- Oder Vercel: https://vercel.com

**Schritt 2: Projekt verbinden**

- GitHub Repository verbinden
- Automatisches Deployment aktivieren

**Schritt 3: Domain konfigurieren**

- Custom Domain `houston.manus.space` hinzufügen
- DNS-Einstellungen anpassen

**Geschätzte Zeit:** 30-60 Minuten

---

## 🔧 Konkrete nächste Schritte

1. **Sofort:** Bei Manus Support nach SSH-Zugang fragen
2. **Falls SSH verfügbar:** SSH-Deployment implementieren
3. **Falls SSH nicht verfügbar:** Railway/Vercel evaluieren
4. **Langfristig:** Von Manus Agent-System weg migrieren

---

## 💡 Vorteile der Migration

- ✅ **Keine Credits mehr nötig**
- ✅ Schnellere Deployments
- ✅ Mehr Kontrolle
- ✅ Einfacher zu debuggen
- ✅ Unabhängiger von Manus API
