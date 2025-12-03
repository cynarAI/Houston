# Vercel Deployment Setup

**Datum:** 2025-12-03  
**Status:** ✅ Konfiguriert, bereit für Setup

---

## ✅ Warum Vercel?

### Vorteile:

1. **Dauerhaft kostenlos:**
   - ✅ Keine Credits, die aufgebraucht werden
   - ✅ 100 Deployments pro Tag
   - ✅ 1 Million Function Invocations/Monat
   - ✅ 100 GB Bandwidth/Monat

2. **Besser als Railway:**
   - Railway: $1 Credits/Monat (kann schnell aufgebraucht sein)
   - Vercel: Dauerhaft kostenlos

3. **Perfekt für Houston:**
   - Frontend + Backend in einem Projekt
   - Automatisches Deployment bei Git Push
   - Sehr schnelle Deployments

---

## 🚀 Setup-Schritte

### 1. Vercel Account erstellen

1. Gehe zu https://vercel.com
2. Melde dich mit GitHub an
3. Importiere das Repository `cynarAI/Houston`

### 2. Vercel Secrets konfigurieren

**In GitHub Repository Secrets hinzufügen:**

```bash
# Vercel Token (aus Vercel Dashboard → Settings → Tokens)
VERCEL_TOKEN=vercel_xxx...

# Vercel Org ID (aus Vercel Dashboard → Settings → General)
VERCEL_ORG_ID=team_xxx...

# Vercel Project ID (aus Vercel Dashboard → Project Settings → General)
VERCEL_PROJECT_ID=prj_xxx...
```

**Oder via GitHub CLI:**

```bash
gh secret set VERCEL_TOKEN --body "vercel_xxx..."
gh secret set VERCEL_ORG_ID --body "team_xxx..."
gh secret set VERCEL_PROJECT_ID --body "prj_xxx..."
```

### 2.5. Domain konfigurieren

**WICHTIG:** Domain `houston.manus.space` muss in Vercel konfiguriert werden!

**Im Vercel Dashboard → Project Settings → Domains:**

1. **Domain hinzufügen:**
   - Domain: `houston.manus.space`
   - Typ: Production (oder Preview)

2. **DNS-Konfiguration:**
   - Vercel zeigt DNS-Records an (CNAME oder A-Record)
   - Diese müssen im DNS-Provider für `manus.space` konfiguriert werden
   - Oder: Domain-Inhaber muss DNS-Records bei Manus setzen lassen

**DNS-Records (Beispiel):**

```
Type: CNAME
Name: houston
Value: cname.vercel-dns.com
```

**Oder:**

```
Type: A
Name: houston
Value: 76.76.21.21 (Vercel IP)
```

### 3. Environment Variables in Vercel

**Im Vercel Dashboard → Project Settings → Environment Variables:**

Alle Variablen aus `.env` hinzufügen:

- `DATABASE_URL`
- `JWT_SECRET`
- `VITE_APP_ID`
- `OAUTH_SERVER_URL`
- `BUILT_IN_FORGE_API_URL`
- `BUILT_IN_FORGE_API_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `VITE_STRIPE_PUBLISHABLE_KEY`
- `SENTRY_DSN` (optional)
- `VITE_PLAUSIBLE_DOMAIN` (optional)

### 4. Vercel konfigurieren

**Build Settings:**

- **Build Command:** `pnpm build`
- **Output Directory:** `dist/public`
- **Install Command:** `pnpm install`
- **Framework Preset:** Other

**Root Directory:** `.` (root)

---

## 📋 Workflow

**Datei:** `.github/workflows/deploy-vercel.yml`

- ✅ Automatisches Deployment bei Push zu `main`
- ✅ Build & Deploy Pipeline
- ✅ Keine Credits benötigt

---

## 🔧 Vercel-Konfiguration

**Datei:** `vercel.json`

```json
{
  "version": 2,
  "buildCommand": "pnpm build",
  "outputDirectory": "dist/public",
  "installCommand": "pnpm install",
  "framework": null,
  "functions": {
    "api/server.js": {
      "runtime": "nodejs20.x"
    }
  },
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/server"
    },
    {
      "source": "/(.*)",
      "destination": "/$1"
    }
  ]
}
```

---

## ⚠️ Wichtige Hinweise

### Express Server auf Vercel

Houston verwendet einen Express-Server, der normalerweise als Node.js Server läuft. Auf Vercel läuft er als Serverless Function.

**Anpassungen möglicherweise nötig:**

- Port-Handling (Vercel setzt PORT automatisch)
- Static File Serving (bereits konfiguriert)
- tRPC Routes (sollten funktionieren)

### Database

**MySQL auf Vercel:**

- Vercel unterstützt keine MySQL-Datenbanken direkt
- Externe MySQL-Datenbank erforderlich (z.B. PlanetScale, Railway MySQL, oder eigene)

---

## 📊 Vergleich: Vercel vs. Railway

| Aspekt             | Vercel                  | Railway                   |
| ------------------ | ----------------------- | ------------------------- |
| **Kostenlos**      | ✅ Dauerhaft            | ⚠️ $1 Credits/Monat       |
| **Deployments**    | ✅ 100/Tag              | ⚠️ Begrenzt durch Credits |
| **Express Server** | ⚠️ Serverless Functions | ✅ Native Node.js         |
| **Setup**          | ⚠️ Etwas komplizierter  | ✅ Einfacher              |
| **Dokumentation**  | ✅ Sehr gut             | ✅ Gut                    |

---

## 🎯 Nächste Schritte

1. ✅ Vercel Account erstellen
2. ✅ Repository importieren
3. ✅ Secrets konfigurieren
4. ✅ Environment Variables setzen
5. ✅ Ersten Deployment testen

---

**Erstellt:** 2025-12-03  
**Status:** ✅ Konfiguriert, bereit für Setup
