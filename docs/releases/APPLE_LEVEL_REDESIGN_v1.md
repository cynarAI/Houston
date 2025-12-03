# Release Notes: Apple-Level Redesign v1

**Datum:** Dezember 2024  
**Version:** 1.0.0-redesign

---

## Zusammenfassung

Dieses Release fokussiert sich auf die Verbesserung der drei kritischen User Flows nach dem "Steve Jobs"-Prinzip: **Fokus auf das Wesentliche, Reduzierung von Komplexität, Erhöhung der täglichen Nutzbarkeit.**

---

## Änderungen

### 🎯 Product Vision
- **NEU:** `/docs/product_principles_houston.md` - Definiert die Produkt-Principles und den Core Job-to-be-done
- Klarer Fokus auf: Focus, Simplicity, Coherence, Quality, Habit

### 🚀 Landing Page (Flow 1: Erster Kontakt)
- **Hero Section vereinfacht:** Eine klare Headline ("Marketing, das nicht liegen bleibt")
- **Ein primärer CTA** statt zwei konkurrierende Buttons
- **Sekundärer Link** dezent unterhalb des CTAs
- **Copy gekürzt** für bessere Verständlichkeit

### 📊 Dashboard (Flow 2: Tägliche Rückkehr)
- **NEU: "Today's Focus" Hero-Card** - Zeigt dynamisch den wichtigsten nächsten Schritt
  - Mit offenen Todos: Zeigt Anzahl und führt zu Aufgaben
  - Ohne Todos: Motiviert zu neuem Gespräch mit Houston
  - Für neue User: Direkter Einstieg in ersten Chat
- **Quick Stats** integriert (Ziele, To-dos, Chats)
- **Redundante Stats-Cards entfernt** für klareres Layout
- **ReturnReminder** nur noch kontextuell angezeigt

### 💬 Chat (Flow 3: Arbeiten mit Houston)
- **NEU: Quick-Action Chips** unter dem Input-Feld
  - "Was heute?", "Nächster Schritt", "Ideen", "Feedback"
  - Erscheinen nur wenn bereits Nachrichten vorhanden sind
- **Überarbeitete Quick-Actions** im Empty State
  - Fokus auf Daily-Use: "Was soll ich heute tun?", "Meine Woche planen"
- **URL-Prompt Support:** Chat kann mit vorausgefülltem Prompt geöffnet werden

### 🎓 Onboarding (Flow 1 → Flow 3 Übergang)
- **Nach Abschluss:** Direkter Redirect zu Chat mit personalisierten Willkommens-Prompt
- **Nahtloser Übergang** statt Dashboard-Zwischenschritt

### 💰 Credits Page
- **Klare Einführung:** "So funktionieren Credits" am Seitenanfang
- **Gruppierte Kostenübersicht:** Kostenlos vs. Kostenpflichtig
- **Transparente Kommunikation:** User weiß VOR jeder Action, was sie kostet

### 🎨 Design System
- **prefers-reduced-motion Support** für alle Animationen
- **Dokumentierte Spacing Scale** (8pt Grid)
- **Transition Presets** für konsistente Motion

### ✅ QA
- **Aktualisierte QA-Checklist** mit den drei kritischen User Flows
- **Neue Sections:** Dashboard Today's Focus, Chat Quick Actions, Credits Page

---

## Migration Notes

Keine Datenbankänderungen. Keine Breaking Changes.

---

## Verifikation vor Release

1. **Flow 1 testen:** Landing → Login → Onboarding → Chat
2. **Flow 2 testen:** Login → Dashboard zeigt Today's Focus → CTA funktioniert
3. **Flow 3 testen:** Chat → Quick Chips sichtbar → Nachricht senden → Antwort kommt
4. **Credits testen:** Credits-Page zeigt klare Kostenübersicht
5. **Responsive testen:** Mobile (375px), Tablet (768px), Desktop (1920px)

---

## Nächste Schritte (nicht in diesem Release)

- [ ] Keyboard Shortcuts für Power User
- [ ] AI-Transparenz: "Houston denkt über X nach..."
- [ ] Proaktive Insights auf Dashboard
- [ ] Weekly Review mit Houston

---

*"Focus means saying no to the hundred other good ideas."* - Steve Jobs
