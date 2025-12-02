# Houston - Next Features Implementation

## Feature 1: Onboarding Wizard (5-Step Flow)

### Backend (tRPC Procedures)
- [ ] Create `onboarding.saveBusinessInfo` procedure
- [ ] Create `onboarding.saveGoals` procedure
- [ ] Create `onboarding.saveAudience` procedure
- [ ] Create `onboarding.saveChannels` procedure
- [ ] Create `onboarding.generateRoadmap` procedure (AI-powered)
- [ ] Create `onboarding.getProgress` procedure
- [ ] Create `onboarding.markComplete` procedure

### Database Schema
- [ ] Add `onboardingProgress` table to schema
- [ ] Add fields: userId, step, completed, businessInfo, goals, audience, channels, roadmap
- [ ] Run `pnpm db:push` to apply schema changes

### Frontend Components
- [ ] Create `client/src/pages/Onboarding.tsx` (main wizard component)
- [ ] Create `client/src/components/onboarding/Step1BusinessInfo.tsx`
- [ ] Create `client/src/components/onboarding/Step2Goals.tsx`
- [ ] Create `client/src/components/onboarding/Step3Audience.tsx`
- [ ] Create `client/src/components/onboarding/Step4Channels.tsx`
- [ ] Create `client/src/components/onboarding/Step5Roadmap.tsx`
- [ ] Create `client/src/components/onboarding/ProgressIndicator.tsx`
- [ ] Add route `/app/onboarding` in App.tsx

### UX Features
- [ ] Step progress indicator (1/5, 2/5, etc.)
- [ ] Back/Next navigation
- [ ] Skip option for each step
- [ ] Auto-save on step completion
- [ ] AI-generated roadmap based on inputs
- [ ] Confetti animation on completion
- [ ] Redirect to Dashboard after completion

### Testing
- [ ] Write Vitest tests for onboarding procedures
- [ ] Test wizard flow in browser
- [ ] Test skip functionality
- [ ] Test auto-save

---

## Feature 2: Multiple Views (Table/Board/Timeline/Calendar)

### Backend (No changes needed - use existing data)

### Frontend Components
- [ ] Create `client/src/components/views/TableView.tsx`
- [ ] Create `client/src/components/views/BoardView.tsx` (Kanban)
- [ ] Create `client/src/components/views/TimelineView.tsx`
- [ ] Create `client/src/components/views/CalendarView.tsx`
- [ ] Create `client/src/components/ViewSwitcher.tsx` (Tab component)

### Goals Page Updates
- [ ] Add View Switcher to Goals page header
- [ ] Implement Table View (sortable columns, inline edit)
- [ ] Implement Board View (drag-and-drop between columns)
- [ ] Implement Timeline View (Gantt-style with deadlines)
- [ ] Implement Calendar View (monthly calendar with goals)
- [ ] Persist view preference in localStorage

### Tasks Page Updates
- [ ] Add View Switcher to Todos page header
- [ ] Implement Table View (sortable columns, inline edit)
- [ ] Implement Board View (drag-and-drop between columns)
- [ ] Implement Timeline View (Gantt-style with due dates)
- [ ] Implement Calendar View (monthly calendar with tasks)
- [ ] Persist view preference in localStorage

### UX Features
- [ ] Smooth transitions between views
- [ ] Keyboard shortcuts (V+T, V+B, V+L, V+C)
- [ ] Empty states for each view
- [ ] Responsive design (mobile shows List/Board only)

### Testing
- [ ] Test all 4 views for Goals
- [ ] Test all 4 views for Tasks
- [ ] Test drag-and-drop in Board view
- [ ] Test view persistence

---

## Feature 3: PDF Export

### Backend (tRPC Procedures)
- [ ] Create `export.goalsAsPdf` procedure
- [ ] Create `export.strategyAsPdf` procedure
- [ ] Create `export.chatHistoryAsPdf` procedure
- [ ] Use `pdf-lib` or `pdfmake` for PDF generation

### Frontend Components
- [ ] Add "Export as PDF" button to Goals page
- [ ] Add "Export as PDF" button to Strategy page
- [ ] Add "Export as PDF" button to Chats page
- [ ] Create `client/src/components/ExportButton.tsx`
- [ ] Show loading state during PDF generation
- [ ] Auto-download PDF after generation

### PDF Templates
- [ ] Design Goals PDF template (title, description, SMART criteria, progress)
- [ ] Design Strategy PDF template (canvas, recommendations, action items)
- [ ] Design Chat PDF template (conversation history, timestamps, metadata)
- [ ] Add Houston branding (logo, colors, footer)
- [ ] Add page numbers and timestamps

### UX Features
- [ ] Toast notification on export start
- [ ] Toast notification on export complete
- [ ] Error handling (show error toast)
- [ ] Filename format: `Houston_Goals_2024-12-01.pdf`

### Testing
- [ ] Test Goals PDF export
- [ ] Test Strategy PDF export
- [ ] Test Chat PDF export
- [ ] Verify PDF formatting and branding
- [ ] Test error handling

---

## Final Steps

- [ ] Run all Vitest tests (`pnpm test`)
- [ ] Test all features in browser
- [ ] Fix any bugs or TypeScript errors
- [ ] Save checkpoint with description
- [ ] Push to GitHub
- [ ] Update README.md with new features
