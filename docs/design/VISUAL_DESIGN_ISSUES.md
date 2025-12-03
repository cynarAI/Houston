# Visual Design Issues (Browser-Test)

## Critical Layout Problems

### 1. Sidebar Overlap

- **Problem:** Sidebar überlappt Content-Bereich
- **Ursache:** Content hat keine `margin-left` für Sidebar-Platz
- **Fix:** Content muss `ml-64` (256px) auf Desktop haben

### 2. Mobile-Sidebar

- **Problem:** Sidebar ist auf Mobile sichtbar und überlappt alles
- **Ursache:** Keine `hidden md:block` Klasse auf Sidebar
- **Fix:** Sidebar auf Mobile < 768px ausblenden, Hamburger-Menu verwenden

### 3. Harsh Borders

- **Problem:** Weiße Linien überall (nicht Glassmorphism)
- **Ursache:** `border-white/10` statt subtile Shadows
- **Fix:** Glassmorphism mit `backdrop-blur` und `shadow-2xl`

### 4. Stats-Cards

- **Problem:** Cards haben keine Hover-Effekte
- **Ursache:** Fehlende `hover:-translate-y-1` und `transition-all`
- **Fix:** Card-Lift-Glow-Animation hinzufügen

### 5. Typography

- **Problem:** "Ingo!" in Lila ist zu grell
- **Ursache:** `text-primary` (Blau #3b82f6) statt subtiler Gradient
- **Fix:** Gradient-Text mit `bg-gradient-to-r from-blue-400 to-purple-400`

### 6. User-Dropdown

- **Problem:** Email sichtbar (Privacy-Problem)
- **Ursache:** Dropdown zeigt Email standardmäßig
- **Fix:** Email nur auf Hover zeigen oder entfernen

## Viewport-Specific Issues

### Mobile (< 768px)

- [ ] Sidebar überlappt Content
- [ ] Keine Hamburger-Menu-Logik
- [ ] Stats-Cards zu breit (sollte 1-column sein)

### Tablet (768px - 1024px)

- [ ] Sidebar-Width zu groß (sollte schmaler sein)
- [ ] Stats-Cards 2-column statt 4-column

### Desktop (> 1024px)

- [x] Layout funktioniert (aber Content-Overlap-Problem)
- [ ] Stats-Cards brauchen mehr Spacing

## Premium-Design-Gaps

- [ ] Keine Micro-Interactions (Hover, Focus, Active)
- [ ] Keine Smooth-Transitions
- [ ] Keine Glassmorphism-Effekte
- [ ] Keine Premium-Shadows
- [ ] Keine Empty-State-Illustrations
