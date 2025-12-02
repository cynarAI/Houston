# Houston Design System

**Version:** 2.0  
**Date:** 2025-12-01  
**Based on:** Premium UX Pattern Library (Linear, Superhuman, Stripe, Notion)

---

## Design Principles

1. **Every Pixel Serves Purpose** - No decorative elements, every design choice is functional
2. **Perceptually Uniform Colors** - Use OKLCH color space for consistent brightness and contrast
3. **Strict Visual Alignment** - 8pt grid system, perfect alignment on all screens
4. **High Contrast** - WCAG 2.2 AAA compliance for critical text, AA for all text
5. **Keyboard-First** - All actions accessible via keyboard shortcuts

---

## Color System (OKLCH)

### Philosophy

Houston uses **OKLCH color space** (Oklab Lightness Chroma Hue) instead of HSL for perceptually uniform colors. This ensures consistent brightness and contrast across all hues, making the UI more accessible and visually balanced.

### Core Variables

```css
/* Base Colors (Neutrals) */
--color-base-0: oklch(100% 0 0);      /* Pure white */
--color-base-5: oklch(98% 0 0);       /* Off-white */
--color-base-10: oklch(95% 0 0);      /* Light gray */
--color-base-20: oklch(90% 0 0);      /* Lighter gray */
--color-base-30: oklch(80% 0 0);      /* Light-medium gray */
--color-base-40: oklch(70% 0 0);      /* Medium gray */
--color-base-50: oklch(60% 0 0);      /* Medium-dark gray */
--color-base-60: oklch(50% 0 0);      /* Dark gray */
--color-base-70: oklch(40% 0 0);      /* Darker gray */
--color-base-80: oklch(30% 0 0);      /* Very dark gray */
--color-base-90: oklch(20% 0 0);      /* Near black */
--color-base-95: oklch(15% 0 0);      /* Almost black */
--color-base-100: oklch(10% 0 0);     /* True black */

/* Accent Colors (Brand) */
--color-accent-blue: oklch(60% 0.15 250);      /* Primary blue */
--color-accent-purple: oklch(55% 0.18 290);    /* Secondary purple */
--color-accent-indigo: oklch(58% 0.16 270);    /* Tertiary indigo */

/* Semantic Colors */
--color-success: oklch(65% 0.15 145);   /* Green */
--color-warning: oklch(70% 0.15 85);    /* Orange */
--color-error: oklch(60% 0.20 25);      /* Red */
--color-info: oklch(65% 0.15 230);      /* Blue */

/* Glassmorphism Overlays */
--glass-bg: oklch(15% 0 0 / 0.6);       /* Dark glass background */
--glass-border: oklch(100% 0 0 / 0.1);  /* Light glass border */
--glass-blur: 32px;                      /* Backdrop blur amount */
```

### Dark Theme (Default)

```css
:root {
  /* Backgrounds */
  --bg-primary: var(--color-base-100);    /* Main background */
  --bg-secondary: var(--color-base-95);   /* Cards, panels */
  --bg-tertiary: var(--color-base-90);    /* Hover states */
  --bg-elevated: var(--color-base-95);    /* Modals, dropdowns */
  
  /* Borders */
  --border-primary: var(--color-base-80);
  --border-secondary: var(--color-base-85);
  --border-focus: var(--color-accent-blue);
  
  /* Text */
  --text-primary: var(--color-base-5);    /* Main text */
  --text-secondary: var(--color-base-40); /* Secondary text */
  --text-tertiary: var(--color-base-50);  /* Disabled text */
  --text-inverse: var(--color-base-100);  /* Text on colored bg */
  
  /* Accents */
  --accent-primary: var(--color-accent-blue);
  --accent-secondary: var(--color-accent-purple);
  --accent-tertiary: var(--color-accent-indigo);
  
  /* Semantic */
  --success: var(--color-success);
  --warning: var(--color-warning);
  --error: var(--color-error);
  --info: var(--color-info);
}
```

### Light Theme (Optional)

```css
[data-theme="light"] {
  /* Backgrounds */
  --bg-primary: var(--color-base-0);
  --bg-secondary: var(--color-base-5);
  --bg-tertiary: var(--color-base-10);
  --bg-elevated: var(--color-base-0);
  
  /* Borders */
  --border-primary: var(--color-base-20);
  --border-secondary: var(--color-base-15);
  --border-focus: var(--color-accent-blue);
  
  /* Text */
  --text-primary: var(--color-base-100);
  --text-secondary: var(--color-base-60);
  --text-tertiary: var(--color-base-50);
  --text-inverse: var(--color-base-0);
  
  /* Accents (same as dark) */
  --accent-primary: var(--color-accent-blue);
  --accent-secondary: var(--color-accent-purple);
  --accent-tertiary: var(--color-accent-indigo);
  
  /* Semantic (same as dark) */
  --success: var(--color-success);
  --warning: var(--color-warning);
  --error: var(--color-error);
  --info: var(--color-info);
}
```

### Glow Shadows (Glassmorphism)

```css
/* Glow shadows for stats cards */
--glow-blue: 0 8px 32px oklch(60% 0.15 250 / 0.3);
--glow-purple: 0 8px 32px oklch(55% 0.18 290 / 0.3);
--glow-indigo: 0 8px 32px oklch(58% 0.16 270 / 0.3);
--glow-orange: 0 8px 32px oklch(70% 0.15 85 / 0.3);
--glow-pink: 0 8px 32px oklch(65% 0.20 350 / 0.3);
```

---

## Typography

### Font Families

```css
/* Display Font (Headings) */
--font-display: 'Inter Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Body Font (Text) */
--font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Monospace Font (Code) */
--font-mono: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
```

### Type Scale

```css
/* Font Sizes */
--text-xs: 0.75rem;    /* 12px - Meta info, labels */
--text-sm: 0.875rem;   /* 14px - UI labels, secondary text */
--text-base: 1rem;     /* 16px - Body text */
--text-lg: 1.25rem;    /* 20px - Subheadings */
--text-xl: 1.5rem;     /* 24px - Headings */
--text-2xl: 2rem;      /* 32px - Page titles */
--text-3xl: 2.5rem;    /* 40px - Hero text */
--text-4xl: 3rem;      /* 48px - Landing page hero */

/* Line Heights */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;

/* Font Weights */
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Typography Hierarchy

```css
/* Display (Headings) */
h1, .text-display-1 {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  line-height: var(--leading-tight);
  letter-spacing: -0.02em;
}

h2, .text-display-2 {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  line-height: var(--leading-tight);
  letter-spacing: -0.01em;
}

h3, .text-display-3 {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  line-height: var(--leading-normal);
}

/* Body */
p, .text-body {
  font-family: var(--font-body);
  font-size: var(--text-base);
  font-weight: var(--font-normal);
  line-height: var(--leading-relaxed);
}

/* Small */
small, .text-small {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--font-normal);
  line-height: var(--leading-normal);
}

/* Caption */
.text-caption {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: var(--font-normal);
  line-height: var(--leading-normal);
  color: var(--text-secondary);
}
```

---

## Spacing System (8pt Grid)

```css
/* Spacing Scale */
--space-0: 0;
--space-1: 0.5rem;   /* 8px */
--space-2: 1rem;     /* 16px */
--space-3: 1.5rem;   /* 24px */
--space-4: 2rem;     /* 32px */
--space-5: 2.5rem;   /* 40px */
--space-6: 3rem;     /* 48px */
--space-8: 4rem;     /* 64px */
--space-10: 5rem;    /* 80px */
--space-12: 6rem;    /* 96px */
--space-16: 8rem;    /* 128px */
--space-20: 10rem;   /* 160px */

/* Component Spacing */
--spacing-xs: var(--space-1);   /* 8px - Tight spacing */
--spacing-sm: var(--space-2);   /* 16px - Small spacing */
--spacing-md: var(--space-3);   /* 24px - Medium spacing */
--spacing-lg: var(--space-4);   /* 32px - Large spacing */
--spacing-xl: var(--space-6);   /* 48px - Extra large spacing */
--spacing-2xl: var(--space-8);  /* 64px - Section spacing */
```

---

## Border Radius

```css
/* Radius Scale */
--radius-none: 0;
--radius-sm: 0.25rem;   /* 4px - Small elements */
--radius-md: 0.5rem;    /* 8px - Buttons, inputs */
--radius-lg: 0.75rem;   /* 12px - Cards */
--radius-xl: 1rem;      /* 16px - Modals */
--radius-2xl: 1.5rem;   /* 24px - Large cards */
--radius-full: 9999px;  /* Circular */
```

---

## Shadows

```css
/* Elevation Shadows */
--shadow-xs: 0 1px 2px oklch(10% 0 0 / 0.05);
--shadow-sm: 0 2px 4px oklch(10% 0 0 / 0.1);
--shadow-md: 0 4px 8px oklch(10% 0 0 / 0.12);
--shadow-lg: 0 8px 16px oklch(10% 0 0 / 0.15);
--shadow-xl: 0 16px 32px oklch(10% 0 0 / 0.2);
--shadow-2xl: 0 24px 48px oklch(10% 0 0 / 0.25);

/* Focus Shadow */
--shadow-focus: 0 0 0 3px var(--accent-primary) / 0.3;
```

---

## Motion System

```css
/* Duration */
--duration-fast: 150ms;
--duration-base: 200ms;
--duration-slow: 300ms;

/* Easing */
--easing-default: cubic-bezier(0.4, 0, 0.2, 1);  /* Ease-in-out */
--easing-in: cubic-bezier(0.4, 0, 1, 1);         /* Ease-in */
--easing-out: cubic-bezier(0, 0, 0.2, 1);        /* Ease-out */
--easing-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);

/* Transitions */
--transition-fast: all var(--duration-fast) var(--easing-default);
--transition-base: all var(--duration-base) var(--easing-default);
--transition-slow: all var(--duration-slow) var(--easing-default);
```

---

## Component Library

### Button

```css
/* Base Button */
.btn {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  line-height: var(--leading-normal);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  transition: var(--transition-fast);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
}

/* Primary Button */
.btn-primary {
  background: var(--accent-primary);
  color: var(--text-inverse);
  border: 1px solid transparent;
}

.btn-primary:hover {
  background: oklch(from var(--accent-primary) calc(l + 0.05) c h);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn-primary:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus);
}

/* Secondary Button */
.btn-secondary {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-primary);
}

.btn-secondary:hover {
  background: var(--bg-tertiary);
  border-color: var(--border-secondary);
}

/* Ghost Button */
.btn-ghost {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid transparent;
}

.btn-ghost:hover {
  background: var(--bg-tertiary);
}

/* Destructive Button */
.btn-destructive {
  background: var(--error);
  color: var(--text-inverse);
  border: 1px solid transparent;
}

.btn-destructive:hover {
  background: oklch(from var(--error) calc(l + 0.05) c h);
}

/* Button Sizes */
.btn-sm {
  font-size: var(--text-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
}

.btn-lg {
  font-size: var(--text-base);
  padding: var(--spacing-md) var(--spacing-lg);
}

/* Button States */
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.btn-loading {
  position: relative;
  color: transparent;
}

.btn-loading::after {
  content: '';
  position: absolute;
  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

### Card

```css
/* Base Card */
.card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  transition: var(--transition-base);
}

/* Card Variants */
.card-elevated {
  box-shadow: var(--shadow-md);
}

.card-glass {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  backdrop-filter: blur(var(--glass-blur));
}

.card-outlined {
  background: transparent;
  border: 1px solid var(--border-primary);
}

/* Card Hover */
.card-interactive:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
  border-color: var(--accent-primary);
}

/* Card with Glow */
.card-glow-blue {
  box-shadow: var(--glow-blue);
}

.card-glow-purple {
  box-shadow: var(--glow-purple);
}

.card-glow-indigo {
  box-shadow: var(--glow-indigo);
}

.card-glow-orange {
  box-shadow: var(--glow-orange);
}

.card-glow-pink {
  box-shadow: var(--glow-pink);
}
```

### Input

```css
/* Base Input */
.input {
  font-family: var(--font-body);
  font-size: var(--text-base);
  font-weight: var(--font-normal);
  line-height: var(--leading-normal);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  transition: var(--transition-fast);
  width: 100%;
}

.input::placeholder {
  color: var(--text-tertiary);
}

.input:hover {
  border-color: var(--border-secondary);
}

.input:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: var(--shadow-focus);
}

/* Input States */
.input-error {
  border-color: var(--error);
}

.input-error:focus {
  border-color: var(--error);
  box-shadow: 0 0 0 3px var(--error) / 0.3;
}

.input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: var(--bg-tertiary);
}

/* Textarea */
.textarea {
  min-height: 120px;
  resize: vertical;
}
```

### Badge

```css
/* Base Badge */
.badge {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  line-height: var(--leading-tight);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-full);
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
}

/* Badge Variants */
.badge-success {
  background: oklch(from var(--success) l c h / 0.2);
  color: var(--success);
}

.badge-warning {
  background: oklch(from var(--warning) l c h / 0.2);
  color: var(--warning);
}

.badge-error {
  background: oklch(from var(--error) l c h / 0.2);
  color: var(--error);
}

.badge-info {
  background: oklch(from var(--info) l c h / 0.2);
  color: var(--info);
}

.badge-neutral {
  background: var(--bg-tertiary);
  color: var(--text-secondary);
}
```

### Progress Bar

```css
/* Base Progress */
.progress {
  width: 100%;
  height: 8px;
  background: var(--bg-tertiary);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: var(--accent-primary);
  border-radius: var(--radius-full);
  transition: width var(--duration-slow) var(--easing-default);
}

/* Progress Variants */
.progress-bar-success {
  background: var(--success);
}

.progress-bar-warning {
  background: var(--warning);
}

.progress-bar-error {
  background: var(--error);
}
```

### Skeleton Loader

```css
/* Base Skeleton */
.skeleton {
  background: linear-gradient(
    90deg,
    var(--bg-secondary) 25%,
    var(--bg-tertiary) 50%,
    var(--bg-secondary) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
  border-radius: var(--radius-md);
}

@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Skeleton Variants */
.skeleton-text {
  height: 1rem;
  width: 100%;
}

.skeleton-heading {
  height: 2rem;
  width: 60%;
}

.skeleton-avatar {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
}

.skeleton-card {
  height: 200px;
  width: 100%;
}
```

---

## Layout System

### Container

```css
.container {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
}

@media (max-width: 640px) {
  .container {
    padding: 0 var(--spacing-md);
  }
}
```

### Grid

```css
.grid {
  display: grid;
  gap: var(--spacing-lg);
}

.grid-cols-1 { grid-template-columns: repeat(1, 1fr); }
.grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
.grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
.grid-cols-4 { grid-template-columns: repeat(4, 1fr); }

@media (max-width: 1024px) {
  .grid-cols-4 { grid-template-columns: repeat(2, 1fr); }
  .grid-cols-3 { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 640px) {
  .grid-cols-4,
  .grid-cols-3,
  .grid-cols-2 {
    grid-template-columns: repeat(1, 1fr);
  }
}
```

### Flex

```css
.flex {
  display: flex;
  min-width: 0;
  min-height: 0;
}

.flex-col { flex-direction: column; }
.flex-row { flex-direction: row; }

.items-start { align-items: flex-start; }
.items-center { align-items: center; }
.items-end { align-items: flex-end; }

.justify-start { justify-content: flex-start; }
.justify-center { justify-content: center; }
.justify-end { justify-content: flex-end; }
.justify-between { justify-content: space-between; }

.gap-1 { gap: var(--space-1); }
.gap-2 { gap: var(--space-2); }
.gap-3 { gap: var(--space-3); }
.gap-4 { gap: var(--space-4); }
```

---

## Accessibility

### Focus Indicators

```css
/* Visible focus ring for all interactive elements */
*:focus-visible {
  outline: 2px solid var(--accent-primary);
  outline-offset: 2px;
}

/* Remove default outline */
*:focus {
  outline: none;
}
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Screen Reader Only

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

---

## Responsive Breakpoints

```css
/* Mobile First */
@media (min-width: 640px) {  /* sm */
  /* Tablet styles */
}

@media (min-width: 768px) {  /* md */
  /* Small desktop styles */
}

@media (min-width: 1024px) { /* lg */
  /* Desktop styles */
}

@media (min-width: 1280px) { /* xl */
  /* Large desktop styles */
}

@media (min-width: 1536px) { /* 2xl */
  /* Extra large desktop styles */
}
```

---

## Usage Examples

### Glassmorphism Card with Glow

```html
<div class="card card-glass card-glow-blue">
  <h3>Active Goals</h3>
  <p class="text-2xl font-bold">2</p>
  <p class="text-sm text-secondary">of 3 available</p>
</div>
```

### Primary Button with Icon

```html
<button class="btn btn-primary">
  <svg><!-- icon --></svg>
  <span>New Goal</span>
</button>
```

### Input with Error State

```html
<div>
  <label for="email">Email</label>
  <input 
    type="email" 
    id="email" 
    class="input input-error"
    placeholder="you@example.com"
  />
  <p class="text-xs text-error">Invalid email format</p>
</div>
```

### Progress Bar

```html
<div class="progress">
  <div class="progress-bar progress-bar-success" style="width: 75%"></div>
</div>
```

### Skeleton Loading State

```html
<div class="card">
  <div class="skeleton skeleton-heading"></div>
  <div class="skeleton skeleton-text" style="margin-top: 1rem"></div>
  <div class="skeleton skeleton-text" style="margin-top: 0.5rem; width: 80%"></div>
</div>
```

---

## Design Tokens (CSS Custom Properties)

All design tokens are available as CSS custom properties and can be used throughout the application:

```css
/* Example: Using design tokens */
.my-component {
  background: var(--bg-secondary);
  color: var(--text-primary);
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  transition: var(--transition-base);
}

.my-component:hover {
  background: var(--bg-tertiary);
  box-shadow: var(--shadow-lg);
}
```

---

## Next Steps

With this design system defined, we can now:

1. **Task 5:** Redesign all key screens (Landing, Dashboard, Coach, Goals, etc.) using these components
2. **Task 6:** Implement design system in code (update `client/src/index.css` and component library)
3. **Task 7:** Quality check and deliver final premium app

**Estimated Time:** 2-3 weeks for full implementation
