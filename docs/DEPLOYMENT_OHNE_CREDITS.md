# Deployment ohne Credits - Sofortige Lösungen

**Datum:** 2025-12-03  
**Problem:** Keine Credits mehr bei Manus  
**Ziel:** Sofort deployen können ohne Credits zu kaufen

---

## 🚀 Option 1: Manus Runtime API testen (SOFORT)

**Status:** Unbekannt, aber schnell testbar  
**Credits:** ✅ **0** (falls verfügbar)

### Was ist das?

Laut Recherche bietet Manus.im möglicherweise eine direkte `/v1/publish` API, die ohne Agent-Interaktion deployt.

### Testen:

```bash
# Teste ob API-Endpoint existiert
curl -X POST https://api.manus.ai/v1/publish \
  -H "API_KEY: $MANUS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": "9Ye7dFtLEUdP6ojxHpkQhu",
    "directory": "dist/public",
    "target": "houston.manus.space"
  }'
```

### GitHub Actions Workflow anpassen:

```yaml
# Ersetze den Manus Agent Call durch direkten API-Call
- name: 🚀 Deploy via Manus Runtime API
  env:
    MANUS_API_KEY: ${{ secrets.MANUS_API_KEY }}
  run: |
    curl -X POST https://api.manus.ai/v1/publish \
      -H "API_KEY: $MANUS_API_KEY" \
      -H "Content-Type: application/json" \
      -d "{
        \"project_id\": \"9Ye7dFtLEUdP6ojxHpkQhu\",
        \"directory\": \"dist/public\",
        \"target\": \"houston.manus.space\"
      }"
```

**Vorteile:**

- ✅ Sofort testbar
- ✅ Keine Credits benötigt (falls verfügbar)
- ✅ Schneller als Agent
- ✅ Bestehende Domain bleibt

**Nächste Schritte:**

1. API-Endpoint testen (siehe oben)
2. Falls erfolgreich: Workflow anpassen
3. Falls nicht: Weiter zu Option 2

---

## 🚀 Option 2: Railway (KOSTENLOS, SOFORT)

**Status:** ✅ Verfügbar, kostenloser Plan  
**Credits:** ✅ **0**  
**Setup-Zeit:** 10-15 Minuten

### Was ist Railway?

Railway ist ein Platform-as-a-Service (PaaS) mit kostenlosem Plan ($5 Credits/Monat).

### Setup-Schritte:

1. **Account erstellen:**
   - Gehe zu: https://railway.app
   - Sign up mit GitHub

2. **Projekt verbinden:**
   - "New Project" → "Deploy from GitHub repo"
   - Wähle Repository: `cynarAI/Houston`
   - Branch: `main`

3. **Konfiguration:**
   - Railway erkennt automatisch Node.js
   - Build Command: `pnpm install && pnpm build`
   - Start Command: `node dist/index.js`

4. **Environment Variables:**
   - Kopiere alle `.env` Variablen zu Railway
   - `DATABASE_URL`, `MANUS_API_KEY`, etc.

5. **Custom Domain:**
   - Railway → Settings → Domains
   - Füge `houston.manus.space` hinzu
   - Aktualisiere DNS (falls nötig)

### `railway.json` erstellen:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "pnpm install --frozen-lockfile && pnpm build"
  },
  "deploy": {
    "startCommand": "NODE_ENV=production node dist/index.js",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

**Vorteile:**

- ✅ Kostenlos (bis zu $5/Monat)
- ✅ Automatisches Deployment bei Git Push
- ✅ SSL/TLS automatisch
- ✅ Monitoring/Logging integriert
- ✅ Einfaches Setup

**Nachteile:**

- ⚠️ Domain-Migration nötig (falls DNS geändert werden muss)
- ⚠️ Vendor Lock-in

**Nächste Schritte:**

1. Railway Account erstellen
2. Projekt verbinden
3. `railway.json` committen
4. Test-Deployment durchführen

---

## 🚀 Option 3: Vercel (KOSTENLOS, SEHR SCHNELL)

**Status:** ✅ Verfügbar, kostenloser Plan  
**Credits:** ✅ **0**  
**Setup-Zeit:** 5-10 Minuten

### Was ist Vercel?

Vercel ist ein Hosting-Service speziell für Frontend/Full-Stack Apps.

### Setup-Schritte:

1. **Account erstellen:**
   - Gehe zu: https://vercel.com
   - Sign up mit GitHub

2. **Projekt importieren:**
   - "Add New Project"
   - Wähle Repository: `cynarAI/Houston`
   - Framework Preset: "Other"

3. **Build Settings:**
   - Build Command: `pnpm build`
   - Output Directory: `dist/public`
   - Install Command: `pnpm install --frozen-lockfile`

4. **Environment Variables:**
   - Füge alle `.env` Variablen hinzu

5. **Custom Domain:**
   - Settings → Domains
   - Füge `houston.manus.space` hinzu

### `vercel.json` erstellen:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "dist/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "dist/public/$1"
    }
  ]
}
```

**Vorteile:**

- ✅ Kostenlos (Hobby Plan)
- ✅ Sehr schnell (Edge Network)
- ✅ Automatisches Deployment
- ✅ SSL/TLS automatisch
- ✅ CDN integriert

**Nachteile:**

- ⚠️ Domain-Migration nötig
- ⚠️ Serverless-Funktionen (könnte Backend-Logik anpassen)

**Nächste Schritte:**

1. Vercel Account erstellen
2. Projekt importieren
3. `vercel.json` committen
4. Test-Deployment durchführen

---

## 🚀 Option 4: Netlify (KOSTENLOS, STATIC SITES)

**Status:** ✅ Verfügbar, kostenloser Plan  
**Credits:** ✅ **0**  
**Setup-Zeit:** 5-10 Minuten

### Was ist Netlify?

Netlify ist ein Hosting-Service für statische Sites und Serverless-Funktionen.

### Setup-Schritte:

1. **Account erstellen:**
   - Gehe zu: https://netlify.com
   - Sign up mit GitHub

2. **Projekt verbinden:**
   - "Add new site" → "Import an existing project"
   - Wähle Repository: `cynarAI/Houston`

3. **Build Settings:**
   - Build command: `pnpm build`
   - Publish directory: `dist/public`

4. **Environment Variables:**
   - Site settings → Environment variables
   - Füge alle `.env` Variablen hinzu

5. **Custom Domain:**
   - Domain settings → Add custom domain
   - Füge `houston.manus.space` hinzu

### `netlify.toml` erstellen:

```toml
[build]
  command = "pnpm install --frozen-lockfile && pnpm build"
  publish = "dist/public"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/api/:splat"
  status = 200
```

**Vorteile:**

- ✅ Kostenlos (Starter Plan)
- ✅ Automatisches Deployment
- ✅ SSL/TLS automatisch
- ✅ CDN integriert
- ✅ Form Handling

**Nachteile:**

- ⚠️ Backend muss als Serverless-Funktionen umgebaut werden
- ⚠️ Domain-Migration nötig

**Nächste Schritte:**

1. Netlify Account erstellen
2. Projekt verbinden
3. `netlify.toml` committen
4. Backend als Serverless-Funktionen umbauen (falls nötig)

---

## 🚀 Option 5: GitHub Pages (NUR STATIC)

**Status:** ✅ Verfügbar, kostenlos  
**Credits:** ✅ **0**  
**Einschränkung:** ⚠️ Nur statische Sites (kein Backend)

### Setup:

1. **GitHub Actions Workflow:**

   ```yaml
   - name: Deploy to GitHub Pages
     uses: peaceiris/actions-gh-pages@v4
     with:
       github_token: ${{ secrets.GITHUB_TOKEN }}
       publish_dir: ./dist/public
   ```

2. **Repository Settings:**
   - Settings → Pages
   - Source: GitHub Actions

**Vorteile:**

- ✅ Komplett kostenlos
- ✅ Automatisches Deployment
- ✅ SSL/TLS automatisch

**Nachteile:**

- ❌ Kein Backend möglich
- ❌ Nur statische Sites

**Nächste Schritte:**

- Nur wenn Backend nicht benötigt wird

---

## 📊 Vergleichstabelle

| Option                | Credits | Setup-Zeit | Domain-Migration  | Backend-Support | Empfehlung |
| --------------------- | ------- | ---------- | ----------------- | --------------- | ---------- |
| **Manus Runtime API** | ✅ 0    | 5 Min      | ❌ Nein           | ✅ Ja           | ⭐⭐⭐⭐⭐ |
| **Railway**           | ✅ 0    | 15 Min     | ⚠️ Möglicherweise | ✅ Ja           | ⭐⭐⭐⭐   |
| **Vercel**            | ✅ 0    | 10 Min     | ⚠️ Möglicherweise | ✅ Ja           | ⭐⭐⭐⭐   |
| **Netlify**           | ✅ 0    | 10 Min     | ⚠️ Möglicherweise | ⚠️ Serverless   | ⭐⭐⭐     |
| **GitHub Pages**      | ✅ 0    | 5 Min      | ❌ Nein           | ❌ Nein         | ⭐⭐       |

---

## 🎯 Empfehlung: Reihenfolge

### 1. SOFORT testen: Manus Runtime API

```bash
# Teste API-Endpoint
curl -X POST https://api.manus.ai/v1/publish \
  -H "API_KEY: $MANUS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"project_id": "9Ye7dFtLEUdP6ojxHpkQhu", "directory": "dist/public", "target": "houston.manus.space"}'
```

**Falls erfolgreich:**

- ✅ Workflow anpassen
- ✅ Fertig!

**Falls nicht:**

- ⏭️ Weiter zu Option 2

### 2. FALLBACK: Railway

- ✅ Schnellste Alternative
- ✅ Backend-Support
- ✅ Kostenlos

### 3. ALTERNATIVE: Vercel

- ✅ Sehr schnell
- ✅ Edge Network
- ✅ Backend-Support

---

## 🔧 Nächste Schritte (SOFORT)

1. **Teste Manus Runtime API:**

   ```bash
   # Lokal testen
   export MANUS_API_KEY="dein-key"
   curl -X POST https://api.manus.ai/v1/publish \
     -H "API_KEY: $MANUS_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"project_id": "9Ye7dFtLEUdP6ojxHpkQhu", "directory": "dist/public", "target": "houston.manus.space"}'
   ```

2. **Falls API funktioniert:**
   - Workflow anpassen (siehe Option 1)
   - Test-Deployment durchführen

3. **Falls API nicht funktioniert:**
   - Railway Account erstellen
   - Projekt verbinden
   - `railway.json` committen
   - Test-Deployment durchführen

---

**Erstellt:** 2025-12-03  
**Status:** ⚡ Sofort umsetzbar
