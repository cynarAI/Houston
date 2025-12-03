# KRITISCHE UI/UX-PROBLEME (Dashboard-Test)

## 🔴 CRITICAL ISSUES

### 1. **"Auf Rocket upgraden"** - Veraltetes Branding

- **Location:** Dashboard Stats-Card
- **Problem:** Button zeigt "Auf Rocket upgraden" statt "Upgrade to Houston Pro"
- **Fix:** Ändere Button-Text zu "Upgrade to Houston Pro"

### 2. **Deutscher Text** - Inkonsistente Sprache

- **Location:** Dashboard überall
- **Problem:** "Willkommen zurück, Ingo!", "Hier ist dein Houston Dashboard im Überblick", "von 1 verfügbar"
- **Fix:** Alle Texte auf Englisch umstellen (konsistent mit Landing-Page)

### 3. **"27 von 1 verfügbar"** - Logik-Fehler

- **Location:** Workspaces Stats-Card
- **Problem:** 27 Workspaces bei Limit von 1? Unmöglich!
- **Fix:** Validiere Workspace-Count-Logik

### 4. **Plan-Badge-Icon** - Falsches Icon

- **Location:** Dashboard Stats-Card
- **Problem:** Icon zeigt nicht Brain/Sparkles
- **Fix:** Prüfe PlanBadge-Komponente

## ⚠️ MEDIUM ISSUES

### 5. **Sidebar-Navigation** - "Page 1", "Page 2"

- **Location:** Sidebar
- **Problem:** Placeholder-Navigation statt echten Links (Dashboard, Chats, Goals, etc.)
- **Fix:** Implementiere echte Navigation-Links

### 6. **Stats-Cards-Design** - Kein Glassmorphism

- **Location:** Workspaces/Goals/Todos/Chats Cards
- **Problem:** Keine Glassmorphism-Effekte sichtbar
- **Fix:** Prüfe CSS-Klassen (glass, backdrop-blur)

## 📝 MINOR ISSUES

### 7. **Empty-States** - Zu viele CTA-Buttons

- **Location:** Heute/Ziele/Strategie/Gespräche Sections
- **Problem:** Jede Section hat eigenen Button, wirkt überladen
- **Fix:** Konsolidiere CTAs

---

**Status:** CRITICAL - Dashboard ist nicht production-ready!
**Priority:** Fix Issues 1-4 sofort, dann 5-7
