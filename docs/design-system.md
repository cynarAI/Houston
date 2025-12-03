# Houston Design System

Das Houston Design System definiert die visuelle Sprache und Komponenten-Bibliothek für die Houston App.

## Design-Prinzipien

### 1. Simplicity (Steve Jobs)

Jede Komponente hat einen klaren Zweck. Keine unnötige Komplexität.

### 2. Focus

Nur essenzielle Features. Kein Feature-Bloat.

### 3. Perfektionismus

Jedes Detail ist durchdacht und poliert.

### 4. Intuitivität

"It just works" - keine Erklärung nötig.

### 5. Theme-Konsistenz

Perfekte Erfahrung in Light & Dark Mode.

## Design Tokens

### Spacing Scale (8pt Grid)

- `--space-1`: 0.5rem (8px)
- `--space-2`: 1rem (16px)
- `--space-3`: 1.5rem (24px)
- `--space-4`: 2rem (32px)
- `--space-5`: 2.5rem (40px)
- `--space-6`: 3rem (48px)
- `--space-8`: 4rem (64px)
- `--space-10`: 5rem (80px)

### Typography Scale

- `--font-size-xs`: 0.75rem (12px)
- `--font-size-sm`: 0.875rem (14px)
- `--font-size-base`: 1rem (16px)
- `--font-size-lg`: 1.125rem (18px)
- `--font-size-xl`: 1.25rem (20px)
- `--font-size-2xl`: 1.5rem (24px)
- `--font-size-3xl`: 1.875rem (30px)
- `--font-size-4xl`: 2.25rem (36px)

### Color System

#### AIstronaut Brand Colors

- `--aistronaut-cyan`: #00D4FF
- `--aistronaut-purple`: #8B5CF6
- `--aistronaut-pink`: #FF6B9D
- `--aistronaut-blue`: #3B82F6

#### Semantic Colors (Theme-aware)

- `--success`: Green (Light: #22C55E, Dark: Brighter)
- `--warning`: Amber (Light: #F59E0B, Dark: Brighter)
- `--info`: Blue (Light: #3B82F6, Dark: Brighter)
- `--error`: Red (Light: #EF4444, Dark: Brighter)

### Elevation Tokens

- `--elevation-1`: Subtle shadow
- `--elevation-2`: Light shadow
- `--elevation-3`: Medium shadow
- `--elevation-4`: Strong shadow
- `--elevation-5`: Very strong shadow

### Animation Tokens

- `--duration-fast`: 150ms
- `--duration-base`: 200ms
- `--duration-slow`: 300ms
- `--easing-standard`: cubic-bezier(0.4, 0, 0.2, 1)
- `--easing-emphasized`: cubic-bezier(0.2, 0, 0, 1)
- `--easing-decelerate`: cubic-bezier(0, 0, 0.2, 1)
- `--easing-accelerate`: cubic-bezier(0.4, 0, 1, 1)

## Komponenten

### MessageBubble

Wiederverwendbare Chat-Message-Komponente für Conversational Interface.

**Props:**

- `role`: "user" | "coach"
- `content`: string
- `userName?`: string
- `messageId?`: number
- `onCopy?`: (content: string) => void
- `onRegenerate?`: (messageId: number) => void
- `onSave?`: (content: string, messageId: number) => void
- `onFeedback?`: (messageId: number, feedback: "positive" | "negative") => void
- `copied?`: boolean
- `showActions?`: boolean

**Usage:**

```tsx
<MessageBubble
  role="coach"
  content="Hello! How can I help you?"
  messageId={1}
  onCopy={handleCopy}
  onRegenerate={handleRegenerate}
/>
```

### ConversationCard

Rich Content Cards für actionable Vorschläge im Chat.

**Props:**

- `title`: string
- `description?`: string
- `icon?`: React.ReactNode
- `action?`: { label: string; onClick: () => void; variant?: string }
- `gradient?`: "pink-purple" | "blue-purple" | "cyan-purple" | "orange-pink"

**Usage:**

```tsx
<ConversationCard
  title="Content Ideas"
  description="Get 3 concrete suggestions"
  icon={<Sparkles />}
  action={{ label: "Get Ideas", onClick: handleClick }}
  gradient="pink-purple"
/>
```

### StatusIndicator

Subtile Status-Anzeigen mit Space-Theming.

**Props:**

- `type`: "success" | "warning" | "info" | "error" | "loading"
- `label?`: string
- `size?`: "sm" | "md" | "lg"
- `showPulse?`: boolean

**Usage:**

```tsx
<StatusIndicator type="success" label="Goal completed" size="md" />
```

### ProgressiveLoader

Elegante Loading-States.

**Props:**

- `size?`: "sm" | "md" | "lg"
- `variant?`: "spinner" | "dots" | "pulse"
- `label?`: string

**Usage:**

```tsx
<ProgressiveLoader variant="dots" size="md" label="Loading..." />
```

### SectionDivider

Elegante Trennlinien mit Space-Elementen.

**Props:**

- `label?`: string
- `variant?`: "solid" | "gradient" | "space"

**Usage:**

```tsx
<SectionDivider label="Section" variant="space" />
```

## Theme Guidelines

### Light Mode

- Subtile Space-Elemente (minimale Sterne)
- Leichtere Gradient-Borders
- Subtilere Glassmorphism-Effekte
- Optimierte Farben für helle Hintergründe

### Dark Mode

- Stärkere Space-Elemente (Sterne, Nebula)
- Subtile Gradient-Borders
- Stärkere Glassmorphism-Effekte
- Optimierte Farben für dunkle Hintergründe

### Best Practices

1. **Immer beide Themes testen** - Jede Komponente muss in beiden Themes perfekt aussehen
2. **Konsistente Farben verwenden** - Nutze Design Tokens statt hardcodierte Farben
3. **Accessibility** - WCAG AA-konform in beiden Themes
4. **Performance** - GPU-accelerated Transforms für Animationen

## Accessibility

### Keyboard Navigation

- Alle interaktiven Elemente sind per Tastatur erreichbar
- Klare Focus-Indicators (sichtbar in beiden Themes)
- Logische Tab-Reihenfolge

### Screen Reader

- ARIA-Labels für alle interaktiven Elemente
- Semantisches HTML
- Role-Attribute wo nötig

### Color Contrast

- WCAG AA-konform in beiden Themes
- Mindestens 4.5:1 Kontrast für Text
- Mindestens 3:1 Kontrast für UI-Elemente

## Do's & Don'ts

### Do's ✅

- Verwende Design Tokens für Spacing, Colors, Typography
- Teste Komponenten in beiden Themes
- Nutze semantisches HTML
- Implementiere Keyboard-Navigation
- Verwende ARIA-Labels

### Don'ts ❌

- Keine hardcodierten Farben
- Keine hardcodierten Spacing-Werte
- Keine unzugänglichen Komponenten
- Keine Theme-spezifischen Styles ohne Dark-Mode-Variante
- Keine Animationen ohne `prefers-reduced-motion` Support

## Performance

### Animation Performance

- GPU-accelerated Transforms (`transform`, `opacity`)
- Vermeide `width`, `height`, `top`, `left` für Animationen
- Nutze `will-change` sparsam

### Code Splitting

- Route-based Code Splitting
- Lazy Loading für Komponenten
- Optimierte Bundle-Größe

## Weiterführende Ressourcen

- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Steve Jobs Vision Rules](./005-steve-jobs-vision.mdc)
