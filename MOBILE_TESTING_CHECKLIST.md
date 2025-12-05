# Houston AI - Mobile Testing & QA Checklist

## 📱 Test Devices & Browsers

### iOS

- [ ] iPhone SE (375x667) - Safari
- [ ] iPhone 12/13/14 (390x844) - Safari
- [ ] iPhone 14 Pro Max (430x932) - Safari
- [ ] iPad (768x1024) - Safari
- [ ] iPad Pro (1024x1366) - Safari

### Android

- [ ] Samsung Galaxy S21 (360x800) - Chrome
- [ ] Google Pixel 5 (393x851) - Chrome
- [ ] Samsung Galaxy Tab (800x1280) - Chrome

### Desktop Responsive Testing

- [ ] Chrome DevTools Mobile Emulation
- [ ] Firefox Responsive Design Mode
- [ ] Safari Responsive Design Mode

---

## 🎯 Landing Page Tests

### Hero Section

- [ ] Hero title scales properly on all screen sizes
- [ ] Hero subtitle is readable and properly spaced
- [ ] CTA buttons are at least 44x44px (iOS guideline)
- [ ] Hero image loads and displays correctly
- [ ] Background gradients render smoothly
- [ ] No horizontal scrolling

### Navigation

- [ ] Mobile menu opens and closes smoothly
- [ ] All nav links are tappable (44x44px minimum)
- [ ] Language switcher works on mobile
- [ ] Theme toggle works on mobile
- [ ] Sticky header doesn't overlap content
- [ ] Safe area insets respected on notched devices

### Features Section

- [ ] Feature cards stack vertically on mobile
- [ ] Images load with lazy loading
- [ ] Text is readable at all sizes
- [ ] Icons display correctly
- [ ] Spacing is consistent

### Testimonials & Stats

- [ ] Stats grid displays in 2 columns on mobile
- [ ] Testimonial cards are readable
- [ ] No text overflow

### Pricing Section

- [ ] Pricing cards stack vertically
- [ ] All features are visible
- [ ] CTA buttons are full-width on mobile
- [ ] Price text is large enough

### FAQ Section

- [ ] Accordion opens/closes smoothly
- [ ] Text is readable when expanded
- [ ] Touch targets are large enough

### Footer

- [ ] Footer links are tappable
- [ ] Newsletter form works on mobile
- [ ] Social icons are visible
- [ ] Copyright text is readable

---

## 🚀 Onboarding Tests (AI-First)

### Step 1: Website Input

- [ ] Input field is at least 44px tall
- [ ] Keyboard doesn't cover input (iOS)
- [ ] URL validation works
- [ ] Loading state shows correctly
- [ ] Error messages display properly
- [ ] Manual entry button is accessible
- [ ] Enter key submits form

### Step 2: Data Review

- [ ] Scanned data displays in readable cards
- [ ] Manual entry form is usable
- [ ] All inputs are at least 44px tall
- [ ] Textarea is properly sized
- [ ] Back button works
- [ ] Continue button is enabled/disabled correctly

### Step 3: SMART Goals

- [ ] Goals cards are readable
- [ ] All SMART criteria are visible
- [ ] Scrolling works smoothly
- [ ] Back/Continue buttons work

### Step 4: Completion

- [ ] Success animation plays
- [ ] CTA buttons are accessible
- [ ] Navigation to dashboard works
- [ ] Navigation to chat works

### General Onboarding

- [ ] Progress bar updates correctly
- [ ] Step counter is visible
- [ ] No horizontal scrolling
- [ ] Animations don't cause lag
- [ ] LocalStorage persistence works
- [ ] Can resume after closing browser

---

## 💬 Chat Page Tests

### Chat Interface

- [ ] Chat container fills viewport correctly
- [ ] Messages display properly
- [ ] User messages align right
- [ ] AI messages align left
- [ ] Message bubbles are readable
- [ ] Timestamps are visible

### Input Area

- [ ] Input field is at least 44px tall
- [ ] Input doesn't zoom on focus (iOS)
- [ ] Send button is at least 44x44px
- [ ] Keyboard doesn't cover input
- [ ] Enter key sends message
- [ ] Input clears after sending

### Scrolling

- [ ] Auto-scroll to latest message works
- [ ] Manual scrolling is smooth
- [ ] Scroll to bottom button appears when needed

---

## 🎯 Goals Page Tests

### Goals List

- [ ] Goal cards stack vertically
- [ ] Progress bars are visible
- [ ] Goal titles are readable
- [ ] Action buttons are accessible
- [ ] Edit/Delete buttons are at least 44x44px

### Goal Creation

- [ ] Form inputs are properly sized
- [ ] Keyboard doesn't cover inputs
- [ ] Save button is accessible
- [ ] Validation works

### Goal Details

- [ ] Modal/drawer opens smoothly
- [ ] All details are visible
- [ ] Close button is accessible
- [ ] SMART criteria are readable

---

## 📊 Dashboard Tests

### Overview

- [ ] Stats cards display in grid
- [ ] Numbers are large enough
- [ ] Icons are visible
- [ ] Cards are tappable

### Charts/Graphs

- [ ] Charts scale to mobile width
- [ ] Labels are readable
- [ ] Touch interactions work
- [ ] No overflow

### Quick Actions

- [ ] Action buttons are accessible
- [ ] Icons are clear
- [ ] Tooltips work on mobile

---

## 🔧 Settings Page Tests

### Form Inputs

- [ ] All inputs are at least 44px tall
- [ ] Labels are readable
- [ ] Dropdowns work on mobile
- [ ] Toggles are tappable
- [ ] Save button is accessible

### Profile Section

- [ ] Avatar upload works
- [ ] Image preview displays
- [ ] Crop/edit tools work on touch

---

## ⚡ Performance Tests

### Loading Speed

- [ ] Initial page load < 3s on 3G
- [ ] Images lazy load
- [ ] Fonts don't cause layout shift
- [ ] No render-blocking resources

### Interactions

- [ ] Button taps respond instantly
- [ ] Animations are smooth (60fps)
- [ ] No janky scrolling
- [ ] Transitions are fluid

### Network

- [ ] Works on slow 3G
- [ ] Offline indicator shows
- [ ] PWA install prompt works
- [ ] Service worker caches assets

---

## ♿ Accessibility Tests

### Touch Targets

- [ ] All interactive elements ≥ 44x44px
- [ ] Adequate spacing between targets
- [ ] No accidental taps

### Text

- [ ] Font size ≥ 16px (prevents iOS zoom)
- [ ] Sufficient contrast ratios
- [ ] Text is selectable where appropriate
- [ ] Line height is comfortable

### Focus States

- [ ] Visible focus indicators
- [ ] Keyboard navigation works
- [ ] Tab order is logical

### Screen Readers

- [ ] Semantic HTML used
- [ ] ARIA labels present
- [ ] Images have alt text
- [ ] Forms have labels

---

## 🐛 Bug Checks

### iOS Specific

- [ ] No double-tap zoom on buttons
- [ ] Input fields don't cause zoom
- [ ] Safe area insets respected
- [ ] No tap highlight flash
- [ ] Momentum scrolling works

### Android Specific

- [ ] Address bar doesn't cover content
- [ ] Back button works correctly
- [ ] Chrome autofill works
- [ ] Material ripple effects work

### Cross-Browser

- [ ] Works in Safari
- [ ] Works in Chrome
- [ ] Works in Firefox
- [ ] Works in Samsung Internet

---

## 🎨 Visual QA

### Layout

- [ ] No horizontal scrolling
- [ ] No content cutoff
- [ ] Consistent spacing
- [ ] Proper alignment

### Typography

- [ ] No text overflow
- [ ] Proper line breaks
- [ ] Readable font sizes
- [ ] Consistent hierarchy

### Images

- [ ] Proper aspect ratios
- [ ] No distortion
- [ ] Lazy loading works
- [ ] Fallback images work

### Colors

- [ ] Sufficient contrast
- [ ] Dark mode works
- [ ] Brand colors consistent
- [ ] Gradients render smoothly

---

## 🔐 Security Tests

### Forms

- [ ] HTTPS enforced
- [ ] CSRF protection
- [ ] Input validation
- [ ] Error messages don't leak info

### Authentication

- [ ] OAuth works on mobile
- [ ] Session persistence
- [ ] Logout works
- [ ] Token refresh works

---

## 📈 Analytics Tests

### Tracking

- [ ] Page views tracked
- [ ] Button clicks tracked
- [ ] Form submissions tracked
- [ ] Errors tracked

### Events

- [ ] Onboarding events fire
- [ ] Goal creation tracked
- [ ] Chat interactions tracked
- [ ] Feature usage tracked

---

## ✅ Final Checks

### Before Deployment

- [ ] All tests passed
- [ ] No console errors
- [ ] No console warnings
- [ ] Lighthouse score > 90
- [ ] Core Web Vitals pass
- [ ] PWA audit passes

### Post-Deployment

- [ ] Production site loads
- [ ] SSL certificate valid
- [ ] DNS configured correctly
- [ ] CDN working
- [ ] Analytics receiving data
- [ ] Error tracking active

---

## 📝 Notes

### Known Issues

- Document any known issues here
- Include workarounds if available
- Link to relevant tickets

### Future Improvements

- List planned enhancements
- Note performance optimizations
- Document accessibility improvements

---

## 🚀 Testing Tools

### Recommended Tools

- Chrome DevTools (Mobile Emulation)
- BrowserStack (Real Device Testing)
- Lighthouse (Performance & PWA)
- axe DevTools (Accessibility)
- WebPageTest (Performance)
- Google PageSpeed Insights

### Quick Test Commands

```bash
# Start dev server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Run Lighthouse
npx lighthouse http://localhost:5173 --view

# Check bundle size
npx vite-bundle-visualizer
```

---

**Last Updated:** $(date)
**Tested By:** [Your Name]
**Version:** 1.0.0
