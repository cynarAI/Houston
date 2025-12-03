# Deployment-Alternativen für Houston

**Stand:** 2025-12-03  
**Aktuelles System:** Manus Agent über API (`/v1/tasks`)

---

## 🔍 Aktuelles System

### Wie es jetzt funktioniert:

1. **GitHub Actions** baut die App (`pnpm build`)
2. **GitHub Actions** sendet Task an **Manus API** (`/v1/tasks`)
3. **Manus Agent** (manus-1.5) führt Deployment aus:
   - Klont Repository
   - Verifiziert Commit
   - Nutzt Build-Artefakte (oder baut neu)
   - Kopiert Dateien auf Server
   - Startet Server neu

**Vorteile:**

- ✅ Automatisiert
- ✅ Keine direkten Server-Zugangsdaten nötig
- ✅ Manus verwaltet Infrastruktur

**Nachteile:**

- ⚠️ Abhängig von Manus API/Agent
- ⚠️ Deployment kann 10-20 Minuten dauern
- ⚠️ Weniger Kontrolle über den Prozess
- ⚠️ Schwieriger zu debuggen bei Fehlern

---

## 🚀 Alternative Optionen

### Option 1: Manus Runtime API (`/v1/publish`)

**Beschreibung:**  
Direkte API-Call an Manus, ohne Agent-Interaktion.

**Status:**

- Wird im Deployment-Prompt erwähnt (METHODE 1)
- Aber: Nicht aktiv verwendet
- Unklar ob Endpoint existiert/funktioniert

**Implementierung:**

```bash
curl -X POST https://api.manus.ai/v1/publish \
  -H "API_KEY: $MANUS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": "9Ye7dFtLEUdP6ojxHpkQhu",
    "directory": "dist/public",
    "target": "houston.manus.space"
  }'
```

**Vorteile:**

- ✅ Schneller (kein Agent-Overhead)
- ✅ Direkter API-Call
- ✅ Weniger Fehlerquellen

**Nachteile:**

- ❓ Unklar ob verfügbar
- ❓ Weniger Flexibilität

**Nächste Schritte:**

- [ ] API-Endpoint testen
- [ ] Dokumentation prüfen
- [ ] Falls verfügbar: Workflow anpassen

---

### Option 2: Direktes SSH-Deployment

**Beschreibung:**  
GitHub Actions verbindet sich direkt per SSH zum Server und deployed.

**Voraussetzungen:**

- SSH-Zugang zum Server (`houston.manus.space`)
- SSH-Key als GitHub Secret
- Server-IP/Hostname bekannt

**Implementierung:**

```yaml
# In GitHub Actions Workflow
- name: Deploy via SSH
  uses: appleboy/scp-action@master
  with:
    host: ${{ secrets.SSH_HOST }}
    username: ${{ secrets.SSH_USER }}
    key: ${{ secrets.SSH_PRIVATE_KEY }}
    source: "dist/public/*"
    target: "/var/www/houston.manus.space"
```

**Vorteile:**

- ✅ Vollständige Kontrolle
- ✅ Schneller (direkter Transfer)
- ✅ Keine Abhängigkeit von Manus API
- ✅ Einfacher zu debuggen

**Nachteile:**

- ❌ Benötigt SSH-Zugang (aktuell nicht verfügbar?)
- ❌ Server-Zugangsdaten müssen verwaltet werden
- ❌ Sicherheitsrisiko (SSH-Keys in GitHub Secrets)

**Nächste Schritte:**

- [ ] Prüfen ob SSH-Zugang verfügbar ist
- [ ] Server-IP/Hostname ermitteln
- [ ] SSH-Key generieren und konfigurieren

---

### Option 3: Docker-basiertes Deployment

**Beschreibung:**  
App wird als Docker-Container gebaut und deployed.

**Status:**

- ✅ `Dockerfile` existiert bereits
- ❓ Wird aktuell nicht verwendet

**Implementierung:**

```dockerfile
# Dockerfile (vereinfacht)
FROM node:20
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
CMD ["node", "dist/index.js"]
```

**Vorteile:**

- ✅ Konsistente Umgebung
- ✅ Einfaches Rollback
- ✅ Skalierbar (Kubernetes, Docker Swarm)

**Nachteile:**

- ❌ Benötigt Docker-Infrastruktur
- ❌ Komplexer Setup
- ❌ Mehr Ressourcen-Verbrauch

**Nächste Schritte:**

- [ ] Dockerfile prüfen/optimieren
- [ ] Docker-Registry einrichten
- [ ] Deployment-Script für Docker erstellen

---

### Option 4: Railway / Vercel / Netlify

**Beschreibung:**  
Deployment über Platform-as-a-Service (PaaS) Provider.

**Status:**

- ✅ `railway.json` existiert (aber leer)
- ❓ Nicht konfiguriert

**Implementierung:**

```json
// railway.json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "pnpm install && pnpm build"
  },
  "deploy": {
    "startCommand": "node dist/index.js"
  }
}
```

**Vorteile:**

- ✅ Sehr einfach zu setup
- ✅ Automatisches Deployment bei Git Push
- ✅ Integrierte Monitoring/Logging
- ✅ SSL/TLS automatisch

**Nachteile:**

- ❌ Kosten (kostenloser Plan limitiert)
- ❌ Vendor Lock-in
- ❌ Weniger Kontrolle über Infrastruktur
- ❌ Migration von `houston.manus.space` nötig

**Nächste Schritte:**

- [ ] Railway/Vercel/Netlify Account erstellen
- [ ] Projekt verbinden
- [ ] Domain `houston.manus.space` migrieren

---

### Option 5: GitHub Actions + rsync/scp

**Beschreibung:**  
Ähnlich wie Option 2, aber mit rsync für effizienten Transfer.

**Implementierung:**

```yaml
- name: Deploy via rsync
  run: |
    rsync -avz --delete \
      dist/public/ \
      ${{ secrets.SSH_USER }}@${{ secrets.SSH_HOST }}:/var/www/houston.manus.space/
```

**Vorteile:**

- ✅ Effizienter Transfer (nur Änderungen)
- ✅ Schnell
- ✅ Einfach zu implementieren

**Nachteile:**

- ❌ Benötigt SSH-Zugang
- ❌ Server-Zugangsdaten nötig

---

## 📊 Vergleichstabelle

| Option                    | Geschwindigkeit           | Komplexität     | Kontrolle  | Kosten             | Status       |
| ------------------------- | ------------------------- | --------------- | ---------- | ------------------ | ------------ |
| **Aktuell (Manus Agent)** | ⚠️ Langsam (10-20 Min)    | ✅ Niedrig      | ⚠️ Mittel  | ✅ Kostenlos       | ✅ Aktiv     |
| **Manus Runtime API**     | ✅ Schnell (2-5 Min)      | ✅ Niedrig      | ⚠️ Mittel  | ✅ Kostenlos       | ❓ Unbekannt |
| **SSH direkt**            | ✅ Schnell (2-5 Min)      | ⚠️ Mittel       | ✅ Hoch    | ✅ Kostenlos       | ❓ Prüfen    |
| **Docker**                | ⚠️ Mittel (5-10 Min)      | ❌ Hoch         | ✅ Hoch    | ⚠️ Variabel        | 📝 Möglich   |
| **Railway/Vercel**        | ✅ Sehr schnell (1-3 Min) | ✅ Sehr niedrig | ⚠️ Niedrig | ⚠️ Kostenlos/Limit | 📝 Möglich   |

---

## 🎯 Empfehlung

### Kurzfristig (sofort umsetzbar):

1. **Option 1 testen:** Manus Runtime API (`/v1/publish`)
   - Einfach zu testen
   - Falls verfügbar: Schnelle Verbesserung
   - Keine großen Änderungen nötig

### Mittelfristig (wenn möglich):

2. **Option 2 prüfen:** SSH-Deployment
   - Prüfen ob SSH-Zugang verfügbar ist
   - Falls ja: Implementieren für mehr Kontrolle
   - Falls nein: Bei Manus nachfragen

### Langfristig (falls nötig):

3. **Option 4 evaluieren:** PaaS Provider
   - Falls Manus-Probleme bestehen
   - Für bessere Skalierbarkeit
   - Für einfacheres Management

---

## 🔧 Nächste Schritte

### Sofort:

1. **Manus Runtime API testen:**

   ```bash
   curl -X POST https://api.manus.ai/v1/publish \
     -H "API_KEY: $MANUS_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"project_id": "9Ye7dFtLEUdP6ojxHpkQhu", "directory": "dist/public", "target": "houston.manus.space"}'
   ```

2. **SSH-Zugang prüfen:**
   - Bei Manus Support nachfragen
   - Server-IP/Hostname ermitteln
   - SSH-Key-Generierung prüfen

### Falls API verfügbar:

3. **GitHub Actions Workflow anpassen:**
   - Ersetze `/v1/tasks` durch `/v1/publish`
   - Entferne Agent-Prompt-Logik
   - Teste Deployment

### Falls SSH verfügbar:

4. **SSH-Deployment implementieren:**
   - GitHub Secrets konfigurieren
   - Workflow anpassen
   - Testen

---

## 📝 Fragen an Manus Support

1. **Gibt es einen `/v1/publish` Endpoint?**
   - Falls ja: Welche Parameter werden erwartet?
   - Falls nein: Warum wird er im Prompt erwähnt?

2. **Ist SSH-Zugang zum Server möglich?**
   - Falls ja: Wie bekomme ich Zugang?
   - Falls nein: Gibt es eine Alternative?

3. **Kann ich direkt auf den Server deployen?**
   - Ohne Agent-Interaktion?
   - Mit direkten API-Calls?

4. **Gibt es eine bessere Deployment-Methode?**
   - Als die aktuelle Agent-basierte Methode?
   - Für schnellere Deployments?

---

## 🔗 Referenzen

- Aktueller Workflow: `.github/workflows/optimized-ci.yml`
- Deployment Prompt: `.github/scripts/deployment-prompt-template.sh`
- Manus API Docs: https://manus.im/docs (falls verfügbar)
- Dockerfile: `Dockerfile`
- Railway Config: `railway.json`
