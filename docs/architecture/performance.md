# Houston Performance Optimierungen

Dieses Dokument beschreibt die Performance-Optimierungen, die in der Houston App implementiert wurden, um die Runtime-Performance und Bundle-Größe zu verbessern.

## Übersicht

Die Optimierungen konzentrieren sich auf:

1. Code-Splitting und Lazy Loading
2. Bundle-Größenreduktion
3. Animation-Performance
4. Memoization

---

## 1. Code-Splitting & Lazy Loading

### Page-Level Lazy Loading

Alle Pages werden bereits in `App.tsx` mit `React.lazy()` geladen:

```tsx
const Landing = lazy(() => import("./pages/Landing"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
// ... weitere Pages
```

### Component-Level Lazy Loading

Schwere Komponenten werden nur geladen, wenn sie benötigt werden:

#### BoardView & CalendarView (Goals.tsx, Todos.tsx)

```tsx
const BoardView = lazy(() => import("@/components/views/BoardView"));
const CalendarView = lazy(() => import("@/components/views/CalendarView"));
```

- **BoardView**: Verwendet `@dnd-kit` (~30kb)
- **CalendarView**: Verwendet `react-day-picker` (~30kb)

#### Analytics-Komponenten (Credits.tsx)

```tsx
const CreditUsageChart = lazy(() => import("@/components/CreditUsageChart"));
const UsageStatsCards = lazy(() => import("@/components/UsageStatsCards"));
```

- **CreditUsageChart**: Verwendet `recharts` (~250kb)

---

## 2. Bundle-Optimierung (Vite Config)

### Manual Chunks

In `vite.config.ts` werden schwere Libraries in separate Chunks aufgeteilt:

```ts
manualChunks: {
  'charts': ['recharts'],                    // ~250kb - nur Analytics Tab
  'dnd': ['@dnd-kit/core', '@dnd-kit/sortable', '@dnd-kit/utilities'], // ~30kb
  'calendar': ['react-day-picker'],          // ~30kb - nur Calendar View
  'vendor-react': ['react', 'react-dom'],    // Core React
  'vendor-radix': [/* Radix UI Components */],
}
```

### Entfernte Dependencies

- `framer-motion` (~150kb) - wurde nicht verwendet
- `ScrollReveal.tsx` - gelöscht (war unused)

---

## 3. SpaceBackground Performance

Die `SpaceBackground.tsx` Komponente wurde optimiert:

### Änderungen

| Aspekt                   | Vorher | Nachher          |
| ------------------------ | ------ | ---------------- |
| Sterne                   | 300    | 150              |
| Shooting Stars Intervall | 3-8s   | 6-12s            |
| Shooting Stars Chance    | 50%    | 40%              |
| reduced-motion Support   | Nein   | Ja               |
| Mouse-Tracking           | Immer  | Throttled (50ms) |

### prefers-reduced-motion

Wenn der Benutzer reduzierte Bewegung bevorzugt, werden:

- Animationen komplett deaktiviert
- Nur statische Sterne gerendert (100 statt 150)
- Keine Shooting Stars

```tsx
const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
if (mediaQuery.matches) {
  // Render static stars only
}
```

---

## 4. Memoization

### CreditIndicator

Die `CreditIndicator` Komponente ist mit `React.memo()` gewrapped:

```tsx
export const CreditIndicator = memo(function CreditIndicator({ onClick }) {
  // Tooltip wird memoized
  const tooltipText = useMemo(() => {
    if (isEmpty) return "Keine Credits mehr – jetzt aufladen!";
    // ...
  }, [isEmpty, isLow]);
});
```

### Menu Items (DashboardLayout)

Die `menuItems` sind als Konstante außerhalb der Komponente definiert, um Re-Creation bei jedem Render zu vermeiden.

---

## 5. Best Practices

### Beim Hinzufügen neuer Features

1. **Schwere Libraries**: Immer mit `lazy()` laden

   ```tsx
   const HeavyComponent = lazy(() => import("./HeavyComponent"));
   ```

2. **Suspense Fallback**: Immer einen Loader anzeigen

   ```tsx
   <Suspense fallback={<Loader2 className="animate-spin" />}>
     <HeavyComponent />
   </Suspense>
   ```

3. **Neue Dependencies prüfen**: Vor dem Hinzufügen die Bundle-Größe prüfen

   ```bash
   npm view [package] dist.unpackedSize
   ```

4. **Animationen**: `prefers-reduced-motion` respektieren
   ```tsx
   const prefersReducedMotion = window.matchMedia(
     "(prefers-reduced-motion: reduce)",
   ).matches;
   ```

---

## 6. Messung & Monitoring

### Bundle-Analyse

```bash
pnpm build
# Prüfe dist/public Größen
```

### Lighthouse

- Performance Score > 90 anstreben
- Largest Contentful Paint < 2.5s
- First Input Delay < 100ms

### React DevTools Profiler

Für Re-Render-Analyse während der Entwicklung verwenden.

---

## Changelog

### 2024-12-03

- Initial Performance-Optimierung
- `framer-motion` entfernt (-150kb)
- Lazy Loading für BoardView, CalendarView, Charts
- SpaceBackground optimiert (50% weniger Sterne)
- Vite manual chunks konfiguriert
- CreditIndicator memoized
