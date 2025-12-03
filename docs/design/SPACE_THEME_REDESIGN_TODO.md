# Houston Space-Theme Redesign - AIstronaut Brand

## Phase 1: Space-Theme Color System

- [x] Define design tokens in index.css
  - [x] --bg-space (deep space navy/blue-black)
  - [x] --bg-card (layered cards in lighter space blues)
  - [x] --accent-primary (warm violet/purple)
  - [x] --accent-secondary (soft magenta)
  - [x] --accent-tertiary (cyan)
  - [x] --text-main (high contrast white)
  - [x] --text-muted (desaturated gray)
  - [x] --border-subtle (subtle space blue)
  - [x] --glow-accent (violet glow)
- [x] Update semantic colors (green, orange, red, blue - desaturated)
- [x] Create gradient utilities (violet-magenta, cyan-violet, space)
- [x] Add starfield texture utility (very soft, low contrast)

## Phase 2: 3-Column Layout Shell

- [ ] Create MainLayout component (Sidebar + Main + Context Panel)
- [ ] Implement responsive breakpoints
  - [ ] Desktop: 3-column (sidebar, main, context)
  - [ ] Tablet: 2-column (icon sidebar, main+context drawer)
  - [ ] Mobile: bottom nav + full-width main
- [ ] Add slide/fade transitions between views

## Phase 3: Top Bar

- [ ] Create TopBar component
- [ ] Add logo + tagline ("AIstronaut Marketing Coach – Houston", "Dein Mission Control für KI-Marketing")
- [ ] Add language toggle (DE/EN) with globe icon
- [ ] Add user avatar (initials) with profile dropdown
- [ ] Add model indicator ("Manus 1.5")

## Phase 4: Chat View Redesign

- [ ] Enhance chat bubbles (smooth rounded corners, gradient for user, darker for AI)
- [ ] Add role labels ("Du", "Houston")
- [ ] Add chat header ("Houston – AI Marketing Assistant" + subline)
- [ ] Enhance input area (larger, better placeholder)
- [ ] Add quick-action chips ("Content-Ideen", "Kampagnenplan", "SEO-Check")
- [ ] Add context panel (right)
  - [ ] "Aktuelle Mission" summary
  - [ ] "Nächste Schritte" checklist
  - [ ] Progress rings/bars

## Phase 5: Dashboard Redesign

- [ ] Add "Mission Overview" header (goal + timeframe)
- [ ] Create mission dashboard cards
  - [ ] Active Missions
  - [ ] To-dos / Tasks
  - [ ] Strategy Status
  - [ ] Recent chats
- [ ] Add progress circles, timeline chips, status badges
- [ ] Make cards clickable with hover states

## Phase 6: Strategie/Todos/Missionen Redesign

- [ ] Strategie: structured cards (Zielgruppe, Positionierung, Kanäle, Botschaften)
- [ ] Strategie: timeline/roadmap view (Quarterly, Monthly milestones)
- [ ] Todos: kanban layout (Backlog / In Arbeit / Erledigt)
- [ ] Todos: color badges for priority and due dates
- [ ] Missionen: mission cards (title, goal, difficulty, progress)
- [ ] Missionen: mission detail view (objective, steps, related chats, linked todos)

## Phase 7: Micro-Animations

- [ ] Add hover glow to cards and buttons
- [ ] Add fade/slide transitions between views
- [ ] Add typing indicator (pulsing orbit or three dots on gradient chip)
- [ ] Add message animation (short vertical motion + fade)
- [ ] Add reduced-motion support (prefers-reduced-motion)

## Phase 8: Testing & Delivery

- [ ] Test all views in browser
- [ ] Test responsive breakpoints (desktop, tablet, mobile)
- [ ] Test accessibility (contrast, focus states, aria labels)
- [ ] Verify all existing features still work
- [ ] Save final checkpoint
- [ ] Push to GitHub

## REMAINING PHASES TO COMPLETE

### Phase 4: Chat View Redesign (COMPLETED)

- [x] Add quick-action chips below input ("Content-Ideen", "Kampagnenplan", "SEO-Check")
- [x] Enhance input placeholder ("Frag Houston nach deiner nächsten Marketing-Mission …")
- [x] Add role labels to messages ("Du", "Houston")
- [ ] Create context panel component for chat (right side) - SKIPPED (complex, low priority)
  - [ ] "Aktuelle Mission" summary
  - [ ] "Nächste Schritte" checklist
  - [ ] Progress rings/bars
- [x] Add TopBar to Chats page

### Phase 5: Dashboard Mission Control Redesign

- [ ] Add "Mission Overview" header with goal + timeframe
- [ ] Transform stats cards into mission cards with:
  - [ ] Progress circles (not just numbers)
  - [ ] Timeline chips (e.g., "This Week", "Overdue")
  - [ ] Rocket/Orbit graphics
- [ ] Make cards clickable with hover lift effect
- [ ] Add mission status badges (Active, Completed, Pending)

### Phase 6: Strategie/Todos/Missionen Redesign

- [ ] Add TopBar to all pages (Strategy, Todos, Goals, Settings)
- [ ] Strategie: Add timeline/roadmap view
- [ ] Todos: Enhance kanban with color badges for priority
- [ ] Goals: Add mission card style (rocket icons, orbit graphics)

### Phase 7: Micro-Animations

- [ ] Add hover glow to all cards (0 0 40px rgba(167, 139, 250, 0.3))
- [ ] Add typing indicator to chat (pulsing orbit or gradient dots)
- [ ] Add message fade-in animation (vertical motion + fade)
- [ ] Add reduced-motion support (@media (prefers-reduced-motion))

### Phase 8: Final Testing & Delivery

- [ ] Test all pages in browser
- [ ] Test responsive breakpoints (desktop, tablet, mobile)
- [ ] Verify all animations work
- [ ] Save final checkpoint
- [ ] Push to GitHub
