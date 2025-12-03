# Houston App - Issues Todo List

**Created:** 2025-12-01  
**Test Cycle:** #1

## 🔴 CRITICAL (Must Fix Immediately)

- [x] **Issue #1:** Create Settings page component (currently 404)
- [x] **Issue #1:** Add `/app/settings` route in App.tsx
- [x] **Issue #1:** Implement Settings page UI (user preferences, account management)

## 🟡 MEDIUM (Should Fix)

- [x] **Issue #2:** Remove red badges from all sidebar navigation items (FALSE ALARM - no badges exist, only browser annotations)
- [x] **Issue #2:** Only show badges when there are actual notifications (N/A)
- [x] **Issue #3:** Verify email privacy in sidebar footer (opacity-0 by default) - CONFIRMED WORKING
- [x] **Issue #3:** Ensure email shows only on hover (group-hover:opacity-100) - CONFIRMED WORKING
- [x] **Issue #4:** Verify Dashboard stats cards have backdrop-blur-xl - CONFIRMED (blur(32px))
- [x] **Issue #4:** Verify stats cards have individual glow shadows (orange/blue/purple/pink) - CONFIRMED
- [x] **Issue #4:** Verify stats cards have hover:scale-[1.02] effect - CONFIRMED

## 🟢 MINOR (Nice to Have)

- [ ] **Issue #5:** Implement i18n language switching (DE/EN buttons)
- [ ] **Issue #5:** Test language switcher on all pages
- [ ] **Issue #6:** Test "Explore All Features" button scroll behavior
- [ ] **Issue #7:** Verify full pricing details visible in Pricing section

## ✅ VERIFICATION (After Fixes)

- [ ] Re-test Settings page (should load, not 404)
- [ ] Re-test sidebar navigation (no red badges)
- [ ] Re-test email privacy (hover-only)
- [ ] Re-test stats cards glassmorphism (visual validation)
- [ ] Re-test language switcher (DE/EN)
- [ ] Full browser test of all 7 pages
- [ ] Mobile responsive test (375px, 768px, 1024px)
- [ ] Run all Vitest tests (should still pass)

## 📝 NOTES

- 6/7 pages currently functional (86%)
- Chat AI streaming confirmed working
- All CRUD pages load correctly
- Main blocker: Settings 404
