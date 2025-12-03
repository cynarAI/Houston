# Houston Deployment Guide

## 🚀 Übersicht

Houston wird auf **Manus** gehostet - einer All-in-One Plattform für Full-Stack Webapplikationen.

**Live-URL:** https://houston.manus.space

---

## 📦 Was Manus bietet

| Feature                  | Beschreibung                   |
| ------------------------ | ------------------------------ |
| **Full-Stack Hosting**   | Backend + Frontend + Datenbank |
| **Integrierte MySQL-DB** | Automatisch provisioniert      |
| **Custom Domain**        | `houston.manus.space`          |
| **SSL/HTTPS**            | Automatisch konfiguriert       |
| **Analytics**            | Eingebaut                      |
| **Versionskontrolle**    | Rollback jederzeit möglich     |

---

## 🎯 Deployment durchführen

### Option 1: Über Manus Chat (empfohlen)

1. Öffne [manus.im](https://manus.im)
2. Navigiere zu deinem Houston-Projekt
3. Sage zu Manus:

```
Publish this website and make it live.
```

**Das war's!** Manus übernimmt:

- ✅ Cloud-Infrastruktur bereitstellen
- ✅ Build und Optimierung
- ✅ Deployment
- ✅ DNS-Konfiguration

### Option 2: Code-Änderungen deployen

Wenn du Änderungen im Code gemacht hast:

```
Deploy the latest changes from the GitHub repository.
```

Oder spezifischer:

```
Pull the latest code from https://github.com/cynarAI/Houston.git,
build it with pnpm, and publish to houston.manus.space.
```

---

## 🔧 Lokale Entwicklung

### Voraussetzungen

- Node.js 20+
- pnpm
- MySQL (lokal oder Docker)

### Setup

```bash
# Dependencies installieren
pnpm install

# Entwicklungsserver starten
pnpm dev
```

### Environment Variables

Erstelle `.env` basierend auf `env.example`:

```env
DATABASE_URL=mysql://root:password@localhost:3306/houston
DEV_MOCK_AUTH=true  # Für lokale Entwicklung ohne Auth
```

---

## 🗄️ Datenbank

Die MySQL-Datenbank wird von Manus verwaltet.

### Schema-Änderungen

```bash
# Migration generieren
pnpm db:generate

# Migration ausführen (lokal)
pnpm db:push
```

Bei Production-Deployments werden Migrationen automatisch von Manus angewendet.

---

## 📊 Monitoring

- **Analytics:** Integriert in Manus Dashboard
- **Logs:** Über Manus Dashboard einsehbar
- **Uptime:** Von Manus überwacht

---

## 🔄 Rollback

Falls ein Deployment Probleme verursacht:

```
Rollback to the previous version of the website.
```

---

## 📚 Weitere Ressourcen

- [Manus Dokumentation](https://manus.im/docs)
- [Manus Website Builder](https://manus.im/docs/website-builder)
- [Manus Publishing](https://manus.im/docs/website-builder/publishing)
