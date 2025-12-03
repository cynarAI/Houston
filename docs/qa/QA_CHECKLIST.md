# Quality Assurance Checklist - Houston Marketing Coach

**Stand:** Dezember 2024  
**Letzte Aktualisierung:** Apple-Level Redesign

---

## 🚀 CRITICAL USER FLOWS (Must Pass)

### Flow 1: Erster Kontakt (Landing → Chat)

- [ ] Landing Page Hero zeigt EINE klare Headline
- [ ] CTA "Kostenlos starten" ist prominent sichtbar
- [ ] Login/Sign-up funktioniert
- [ ] Onboarding-Wizard startet für neue User
- [ ] Nach Onboarding: Redirect zu Chat mit vorausgefülltem Prompt
- [ ] Erster Chat mit Houston funktioniert

### Flow 2: Tägliche Rückkehr (Login → Action)

- [ ] Login funktioniert
- [ ] Dashboard "Today's Focus" Card ist sichtbar
- [ ] Stats (Ziele, To-dos, Chats) werden korrekt angezeigt
- [ ] CTA führt zu Aufgaben oder Chat
- [ ] User weiß in <10 Sekunden, was zu tun ist

### Flow 3: Arbeiten mit Houston (Chat → Ergebnis)

- [ ] Chat-Seite lädt korrekt
- [ ] Quick-Action Chips werden angezeigt (Was heute?, Nächster Schritt, etc.)
- [ ] Klick auf Chip füllt Input-Feld
- [ ] Nachricht senden funktioniert
- [ ] Typing Indicator erscheint während Antwort
- [ ] Houston-Antwort wird korrekt angezeigt
- [ ] Feedback-Buttons (👍👎) funktionieren
- [ ] Kopieren-Button funktioniert

---

## 🎯 LANDING PAGE QA

### Visual Design

- [ ] Hero section zeigt vereinfachte Headline
- [ ] EINEN primären CTA (nicht zwei gleichwertige)
- [ ] Trust Badges sichtbar
- [ ] Features cards haben visible borders und glassmorphism
- [ ] Pricing cards zeigen Credits-Modell korrekt
- [ ] FAQ accordion expands/collapses smoothly
- [ ] Testimonials section visible
- [ ] Footer displays correctly with all columns
- [ ] Text contrast meets WCAG 2.2 AA standards
- [ ] Gradient text renders correctly
- [ ] Space animations funktionieren (mit prefers-reduced-motion Support)

### Navigation

- [ ] Logo links to home
- [ ] Features link scrolls to features section
- [ ] Pricing link scrolls to pricing section
- [ ] Language switcher works (DE/EN)
- [ ] Mobile hamburger menu appears on mobile
- [ ] Mobile menu opens/closes correctly
- [ ] Mobile menu links work
- [ ] "Go to Dashboard" button works when logged in
- [ ] "Login" button works when logged out

### Functionality

- [ ] FAQ items expand/collapse
- [ ] Chevron icons rotate on FAQ open/close
- [ ] Newsletter email input accepts text
- [ ] Newsletter subscribe button clickable
- [ ] All footer links are clickable
- [ ] Social media links open in new tab
- [ ] CTA buttons have hover effects
- [ ] Cards have hover effects

### Responsive Design

- [ ] Desktop (1920px) layout correct
- [ ] Tablet (768px) layout correct
- [ ] Mobile (375px) layout correct
- [ ] Hamburger menu only visible on mobile
- [ ] Footer stacks correctly on mobile
- [ ] Pricing cards stack on mobile
- [ ] Features cards stack on mobile

### Content

- [ ] All text is readable (no lorem ipsum)
- [ ] Translations work (DE/EN)
- [ ] Pricing information accurate
- [ ] FAQ answers comprehensive
- [ ] No spelling errors
- [ ] No broken images

---

## 📱 APP QA

### Authentication

- [ ] Login flow works
- [ ] Logout works
- [ ] Session persists on refresh
- [ ] Redirect to dashboard after login
- [ ] Redirect to landing page after logout
- [ ] Protected routes require authentication

### Dashboard Layout

- [ ] Sidebar navigation visible
- [ ] Logo in sidebar
- [ ] Navigation items clickable
- [ ] User profile shows in sidebar
- [ ] Logout button in sidebar
- [ ] Main content area displays correctly
- [ ] No layout shifts or jumps

### Dashboard - Today's Focus (NEU)

- [ ] "Today's Focus" Hero-Card ist prominent sichtbar
- [ ] Welcome-Message zeigt Benutzername
- [ ] Dynamischer Content basierend auf User-Status:
  - [ ] Mit offenen Todos: Zeigt Anzahl und CTA zu Todos
  - [ ] Ohne Todos aber mit Zielen: Zeigt "Alle erledigt" Message
  - [ ] Ohne alles: Zeigt "Lass uns loslegen" Message
- [ ] Quick Stats (Ziele, To-dos, Chats) sichtbar
- [ ] CTAs führen zu korrekten Seiten

### Workspaces

- [ ] List workspaces
- [ ] Create new workspace
- [ ] Switch between workspaces
- [ ] Default workspace created on first login
- [ ] Workspace name displays in UI

### Goals Management

- [ ] View goals list
- [ ] Create new goal
- [ ] Edit goal
- [ ] Delete goal
- [ ] Goal status updates
- [ ] Goal progress displays correctly
- [ ] Empty state shows when no goals

### Tasks/Todos Management

- [ ] View todos list
- [ ] Create new todo
- [ ] Edit todo
- [ ] Delete todo
- [ ] Mark todo as complete
- [ ] Todo status toggles
- [ ] Empty state shows when no todos

### AI Chat

- [ ] Chat interface displays
- [ ] Send message works
- [ ] AI response appears
- [ ] Chat history persists
- [ ] Markdown rendering works
- [ ] Code blocks render correctly
- [ ] Chat counter increments
- [ ] Plan limit warning shows when approaching limit
- [ ] Error handling for failed messages

### Chat - Quick Actions (NEU)

- [ ] Empty State: 6 Quick-Action Karten sichtbar
- [ ] Quick-Action Klick füllt Input-Feld
- [ ] Mit Nachrichten: Quick-Chips unter Input sichtbar
- [ ] Chips: "Was heute?", "Nächster Schritt", "Ideen", "Feedback"
- [ ] Chip-Klick füllt Input-Feld
- [ ] URL-Prompt Parameter wird verarbeitet (von Onboarding)
- [ ] Typing Indicator während AI-Antwort

### Plan Limits

- [ ] Chat counter displays correctly
- [ ] Free plan: 20 chats limit enforced
- [ ] Pro plan: 200 chats limit enforced
- [ ] Limit resets monthly
- [ ] Warning shows at 80% usage
- [ ] Block chat when limit reached

### Credits Page (NEU)

- [ ] Credit-Erklärung am Seitenanfang sichtbar
- [ ] Aktuelles Guthaben korrekt angezeigt
- [ ] Pläne-Tab: Subscription-Optionen sichtbar
- [ ] Aufladungen-Tab: Credit-Booster sichtbar
- [ ] Statistiken-Tab: Usage Chart funktioniert
- [ ] Kostenübersicht gruppiert: Kostenlos vs. Kostenpflichtig
- [ ] Checkout-Flow funktioniert (Stripe)
- [ ] Keine versteckten Kosten-Überraschungen

### UI/UX Consistency

- [ ] Color scheme consistent
- [ ] Typography consistent
- [ ] Button styles consistent
- [ ] Form inputs consistent
- [ ] Loading states present
- [ ] Error messages clear
- [ ] Success messages clear
- [ ] Hover effects consistent
- [ ] Focus states visible
- [ ] Spacing consistent

### Performance

- [ ] Page load time < 3s
- [ ] No console errors
- [ ] No console warnings
- [ ] Images optimized
- [ ] No memory leaks
- [ ] Smooth animations

### Accessibility

- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Alt text on images
- [ ] ARIA labels present
- [ ] Color contrast sufficient
- [ ] Screen reader friendly

---

## 🤖 AI & AGENT QA

### Resilienz & Fehler

- [ ] **Timeout:** Was passiert bei >60s Wartezeit? (Erwartung: Freundliche Fehlermeldung, kein Crash)
- [ ] **API-Fehler:** Was passiert bei 500er Fehlern? (Erwartung: Retry im Hintergrund, dann Fehlermeldung)
- [ ] **UI-Feedback:** Ist der "Thinking"-Status jederzeit klar erkennbar?

### Qualität & Halluzinationen

- [ ] **Fakten-Check:** Erfindet Houston Features, die die App nicht hat?
- [ ] **Persona:** Bleibt Houston konsistent in seiner Rolle (laut `.cursor/rules/040-ux-copy.mdc`)?
- [ ] **Formatting:** Werden Markdown-Tabellen und Code-Blöcke korrekt gerendert?

### Kosten & Limits

- [ ] **Credit-Abzug:** Werden Credits erst nach _erfolgreicher_ Generierung abgezogen?
- [ ] **Limits:** Wird der Chat blockiert, wenn keine Credits mehr da sind?
- [ ] **Transparenz:** Sieht der User vor der Aktion, was sie kosten wird?

---

## 🧪 TECHNICAL QA

### Code Quality

- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] All tests passing (21/21)
- [ ] No unused imports
- [ ] No console.log statements in production

### Database

- [ ] Migrations applied
- [ ] Schema matches code
- [ ] Indexes present
- [ ] Foreign keys correct

### API

- [ ] All endpoints working
- [ ] Error handling present
- [ ] Authentication middleware works
- [ ] Rate limiting present
- [ ] CORS configured correctly

---

## 🐛 BUGS FOUND

(Will be populated during testing)

---

## ✅ IMPROVEMENTS NEEDED

(Will be populated during testing)
