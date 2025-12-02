# Houston Quick Wins - Implementation Todo

**Goal:** Implement 4 high-impact features in 1-2 hours

---

## Quick Win #1: Keyboard Shortcuts

- [x] Create `client/src/hooks/useKeyboardShortcuts.ts`
- [x] Implement global shortcut handler
- [x] Add shortcuts:
  - [x] Cmd+K: Focus search / Command palette
  - [x] Cmd+N: New goal / New task (context-dependent)
  - [x] Cmd+F: Focus filter
  - [x] Cmd+/: Show keyboard shortcuts help modal
  - [x] Esc: Close modals / Clear focus
  - [x] G then H: Go to Home
  - [x] G then C: Go to Coach
  - [x] G then G: Go to Goals
  - [x] G then T: Go to Tasks
  - [x] G then S: Go to Settings
- [x] Create `client/src/components/KeyboardShortcutsModal.tsx`
- [ ] Add visual hints (tooltips with shortcuts)
- [ ] Test all shortcuts

---

## Quick Win #2: Chat UX Improvements

- [x] Add typing indicator to `client/src/pages/Chats.tsx`
- [x] Show "Houston is thinking..." while AI generates response
- [ ] Add quick-reply chips after AI response (skipped - requires more design work)
- [x] Implement feedback buttons (👍 👎 📋 🔄)
- [x] Add copy-to-clipboard functionality
- [x] Add regenerate response functionality
- [x] Test chat UX flow (21 tests passing)

---

## Quick Win #3: Dashboard AI Insights

- [x] Create AI Insight Card component
- [x] Add to `client/src/pages/Dashboard.tsx`
- [x] Implement AI insight generation (frontend logic)
- [x] Show personalized suggestions based on goals
- [x] Add "View Details" CTA
- [x] Test AI insights

---

## Quick Win #4: Filters & Sorting

### Goals Page
- [ ] Add filter dropdown (Status, Priority, Deadline)
- [ ] Add sort dropdown (Name, Deadline, Progress)
- [ ] Implement filter logic in `client/src/pages/Goals.tsx`
- [ ] Implement sort logic
- [ ] Test filters and sorting

### Tasks Page
- [ ] Add filter dropdown (Status, Priority, Due Date)
- [ ] Add sort dropdown (Name, Due Date, Priority)
- [ ] Implement filter logic in `client/src/pages/Todos.tsx`
- [ ] Implement sort logic
- [ ] Test filters and sorting

---

## Testing

- [ ] Test all keyboard shortcuts
- [ ] Test chat UX improvements
- [ ] Test AI insights
- [ ] Test filters and sorting
- [ ] Run vitest tests
- [ ] Visual regression test in browser

---

## Completion Checklist

- [ ] All 4 Quick Wins implemented
- [ ] All tests passing
- [ ] No TypeScript errors
- [ ] Browser tested (Desktop + Mobile)
- [ ] Checkpoint saved
