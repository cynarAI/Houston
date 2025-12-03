# Houston Accessibility Guide

This document describes the accessibility features implemented in the Houston application following **WCAG 2.2 AA** guidelines.

## Overview

Houston is designed to be accessible to all users, including those who rely on assistive technologies like screen readers or keyboard-only navigation.

---

## Keyboard Navigation

### Skip Links

- A "Skip to main content" link appears at the top of the dashboard when focused (visible only on keyboard focus)
- Allows keyboard users to bypass the sidebar navigation

### Keyboard Shortcuts

| Shortcut          | Action                                |
| ----------------- | ------------------------------------- |
| `Cmd/Ctrl + B`    | Toggle sidebar open/closed            |
| `Tab`             | Navigate between interactive elements |
| `Enter` / `Space` | Activate buttons and links            |
| `Escape`          | Close dialogs and dropdowns           |

### Focus Management

- All interactive elements have visible focus indicators (2px ring with primary color)
- Focus is trapped within modal dialogs
- Focus returns to trigger element when dialogs close

---

## Landmarks & Semantic HTML

### Page Structure

```
<a class="skip-link">Skip to main content</a>
<nav aria-label="Hauptnavigation">
  <!-- Sidebar navigation -->
</nav>
<main id="main-content">
  <!-- Page content -->
</main>
```

### Dashboard Layout

- `<nav>` element wraps the sidebar with `aria-label="Hauptnavigation"`
- `<main>` element contains the primary content with `id="main-content"`
- `<header>` element with `role="banner"` for the mobile top bar

### Landing Page

- `<header>` for the top navigation
- `<nav>` for main navigation with appropriate `aria-label`
- `<section>` elements for content sections
- `<footer>` for footer content

---

## ARIA Attributes

### Interactive Components

#### Chat Interface (`AIChatBox`)

- `role="log"` and `aria-live="polite"` on the message container
- `role="status"` and `aria-busy="true"` on loading indicator
- `aria-label` on input field and send button

#### Notification Center

- `aria-label` includes unread count: "Benachrichtigungen - X ungelesen"
- `aria-expanded` indicates dropdown state
- `aria-haspopup="true"` on trigger button

#### Credit Indicator

- Single interactive element (no nested buttons/links)
- `aria-label` provides full context: "X Credits - zur Creditseite gehen"
- Loading state has `role="status"`

#### Mobile Menu (Landing Page)

- `aria-expanded` on toggle button
- `aria-controls` links button to menu
- `id` on menu matches `aria-controls`
- `role="menu"` and `role="menuitem"` for menu items

---

## Color Contrast

### Minimum Ratios (WCAG AA)

- **Normal text**: 4.5:1
- **Large text (18pt+)**: 3:1
- **UI components**: 3:1

### Implemented Tokens

| Token                | Light Mode   | Dark Mode    |
| -------------------- | ------------ | ------------ |
| `--foreground`       | 9% (black)   | 98% (white)  |
| `--muted-foreground` | 45%          | 70%          |
| `--primary`          | Blue #3B82F6 | Blue #3B82F6 |

### Landing Page

- Text opacity increased from `/60` to `/75` and `/70` to `/80` for better contrast
- Primary CTAs use gradient backgrounds with white text

---

## Screen Reader Support

### Live Regions

- Chat messages announced via `aria-live="polite"`
- Loading states announced via `role="status"`

### Hidden Decorative Elements

- Icons have `aria-hidden="true"` when redundant
- Animated backgrounds marked as `aria-hidden="true"`

### Descriptive Labels

- All form inputs have associated labels (visible or `sr-only`)
- Buttons have descriptive `aria-label` when icon-only
- External links indicate they open in new tab

---

## Testing Checklist

### Keyboard Testing

- [ ] Tab through all interactive elements
- [ ] Skip link is visible on focus
- [ ] Can navigate sidebar with keyboard
- [ ] Can close dialogs with Escape
- [ ] Focus indicators are visible

### Screen Reader Testing

- [ ] Page landmarks are announced
- [ ] Buttons and links have descriptive names
- [ ] Form errors are announced
- [ ] Dynamic content changes are announced

### Visual Testing

- [ ] Zoom to 200% - content remains usable
- [ ] Check color contrast with tool
- [ ] Test with high contrast mode
- [ ] Test with reduced motion preference

---

## Browser Support

Tested and supported:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

Screen readers tested:

- VoiceOver (macOS/iOS)
- NVDA (Windows)

---

## Known Limitations

1. **Sidebar resize handle**: Not keyboard accessible, but the `Cmd/Ctrl+B` shortcut provides an alternative
2. **Animated backgrounds**: Disabled for users with `prefers-reduced-motion`
3. **Complex data tables**: Some tables may benefit from additional `scope` attributes

---

## Resources

- [WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/)
- [MDN Accessibility Guide](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [Radix UI Accessibility](https://www.radix-ui.com/docs/primitives/overview/accessibility)
