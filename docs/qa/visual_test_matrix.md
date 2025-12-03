# Houston Visual Test Matrix

> Generated: 2025-12-03
> Status: Testing in Progress

## Screen Inventory

### Public Pages

| Screen  | Route  | Key Sections                                                                                                    | Priority |
| ------- | ------ | --------------------------------------------------------------------------------------------------------------- | -------- |
| Landing | `/`    | Hero, How It Works, Benefits, For Whom, Screenshots, Credits Explained, Pricing, FAQ, Testimonials, CTA, Footer | HIGH     |
| 404     | `/404` | Error message, CTA                                                                                              | LOW      |

### App Pages (Protected)

| Screen     | Route             | Key Sections                                                                                                | Priority |
| ---------- | ----------------- | ----------------------------------------------------------------------------------------------------------- | -------- |
| Dashboard  | `/app/dashboard`  | Credit Banner, Welcome, Activation Checklist, Mission Control Stats, AI Insights, Playbooks Grid, Main Grid | HIGH     |
| Chats      | `/app/chats`      | Header + Session Selector, Chat Messages, Quick Actions, Input Area                                         | HIGH     |
| Goals      | `/app/goals`      | PageHeader, ViewSwitcher, Filters, Views (Table/Board/Timeline/Calendar)                                    | HIGH     |
| Todos      | `/app/todos`      | PageHeader, ViewSwitcher, Filters, Stats Cards, Views                                                       | HIGH     |
| Strategy   | `/app/strategy`   | Header, Form/Display Cards, Empty State                                                                     | MEDIUM   |
| Credits    | `/app/credits`    | Balance Card, Tabs (Plans/Topups/Analytics), Cost Reference, History                                        | HIGH     |
| Settings   | `/app/settings`   | Account, Notifications, Credits, Privacy                                                                    | MEDIUM   |
| Referrals  | `/app/referrals`  | Stats Grid, Referral Link, Share Buttons, List                                                              | MEDIUM   |
| Playbooks  | `/app/playbooks`  | Filters, Playbook Grid, Detail Modal                                                                        | MEDIUM   |
| Onboarding | `/app/onboarding` | Multi-step wizard                                                                                           | HIGH     |

---

## Viewport Test Matrix

| Viewport   | Width  | Sidebar        | Grid Columns | Priority |
| ---------- | ------ | -------------- | ------------ | -------- |
| Mobile     | 375px  | Hidden (Sheet) | 1            | HIGH     |
| Mobile L   | 414px  | Hidden (Sheet) | 1            | MEDIUM   |
| Tablet P   | 768px  | Hidden (Sheet) | 2            | HIGH     |
| Tablet L   | 1024px | Visible        | 2-3          | MEDIUM   |
| Desktop    | 1280px | Visible        | 3-4          | HIGH     |
| Desktop XL | 1440px | Visible        | 4            | MEDIUM   |

---

## State Combinations

### Data States

| State  | Description | Test Focus                        |
| ------ | ----------- | --------------------------------- |
| Empty  | No items    | Empty state UI, CTAs              |
| Normal | 3-5 items   | Typical layout                    |
| Dense  | 10+ items   | Overflow, pagination, performance |

### Credit States

| State  | Balance | Visual Indicator           |
| ------ | ------- | -------------------------- |
| Plenty | 50+     | Green, no warning          |
| Low    | 1-19    | Orange, "Knapp" badge      |
| Zero   | 0       | Red, "Aufladen" CTA, pulse |

### Language States

| Lang | Focus                       |
| ---- | --------------------------- |
| DE   | Default, check all strings  |
| EN   | Check text length, wrapping |

---

## Test Checklist

### Landing Page

- [ ] Hero section visible, gradient text renders
- [ ] Navigation links scroll to sections
- [ ] Mobile menu opens/closes
- [ ] Language switcher works (DE/EN)
- [ ] CTA buttons have hover effects
- [ ] Pricing cards align properly
- [ ] FAQ accordions expand/collapse
- [ ] Footer links work
- [ ] All viewports: 375px, 768px, 1280px, 1440px

### Dashboard

- [ ] Sidebar collapses to icons
- [ ] Mobile header shows on <768px
- [ ] Credit indicator shows correct state
- [ ] Stats cards have glassmorphism
- [ ] Empty state shows when no data
- [ ] Playbook cards render
- [ ] All cards have hover effects

### Chats

- [ ] Empty state shows quick actions
- [ ] Session selector dropdown works
- [ ] Messages align correctly (user right, AI left)
- [ ] Typing indicator animates
- [ ] Input area sticky at bottom
- [ ] Long messages wrap properly

### Goals/Todos

- [ ] View switcher changes view
- [ ] Filters update list
- [ ] Empty state shows CTA
- [ ] Board view drag-and-drop works
- [ ] Calendar view renders dates
- [ ] Create dialog opens/closes

### Strategy

- [ ] Empty state shows CTA
- [ ] Form validates required fields
- [ ] Display mode shows saved data
- [ ] Edit mode loads data

### Credits

- [ ] Balance card shows correct amount
- [ ] Tabs switch content
- [ ] Plans cards align
- [ ] Checkout buttons work
- [ ] Analytics tab loads charts

### Settings

- [ ] All sections render
- [ ] Export data button works
- [ ] Delete account shows confirmation
- [ ] Notification toggles work

### Playbooks

- [ ] Search filters results
- [ ] Category/difficulty filters work
- [ ] Cards have hover effect
- [ ] Detail modal opens
- [ ] Houston CTA works

---

## Issues Found

| #   | Screen    | Viewport | Issue                                                       | Severity | Fixed           |
| --- | --------- | -------- | ----------------------------------------------------------- | -------- | --------------- |
| 1   | All       | All      | PWA meta tag `apple-mobile-web-app-capable` deprecated      | Low      | ✅              |
| 2   | All       | All      | Analytics script with undefined env vars causing 400 errors | Medium   | ✅              |
| 3   | App Pages | All      | Cannot test without OAuth authentication                    | High     | N/A (by design) |

## Test Completion Status

### Landing Page

- [x] Hero section visible, gradient text renders
- [x] Navigation links scroll to sections
- [x] Mobile menu opens/closes
- [x] Language switcher works (DE/EN)
- [x] CTA buttons have hover effects
- [x] Pricing cards align properly
- [x] FAQ accordions expand/collapse
- [x] Footer links present
- [x] All viewports: 375px, 768px, 1280px, 1440px

### App Pages (Auth Bypass Implemented - Database Required)

Authentication bypass implemented via `DEV_MOCK_AUTH=true` environment variable.
Full testing requires MySQL database connection.

- [ ] Dashboard - ✅ Auth bypassed, ⚠️ needs MySQL
- [ ] Chats - ✅ Auth bypassed, ⚠️ needs MySQL
- [ ] Goals - ✅ Auth bypassed, ⚠️ needs MySQL
- [ ] Todos - ✅ Auth bypassed, ⚠️ needs MySQL
- [ ] Strategy - ✅ Auth bypassed, ⚠️ needs MySQL
- [ ] Credits - ✅ Auth bypassed, ⚠️ needs MySQL
- [ ] Settings - ✅ Auth bypassed, ⚠️ needs MySQL
- [ ] Playbooks - ✅ Auth bypassed, ⚠️ needs MySQL
- [ ] Referrals - ✅ Auth bypassed, ⚠️ needs MySQL

### How to Enable Full App Testing

1. Set up MySQL database (local or Docker)
2. Configure `DATABASE_URL` in `.env`
3. Run `pnpm db:push` to create tables
4. Set `DEV_MOCK_AUTH=true` in `.env`
5. Start dev server with `pnpm dev`

---

## Notes

- Dev server running on localhost
- Testing with browser resize for viewports
- Focus on visual consistency and responsiveness
