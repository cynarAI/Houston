/**
 * Animation utilities for Houston app
 * Provides consistent animation durations and easing functions
 */

export const animations = {
  duration: {
    fast: "150ms",
    base: "200ms",
    slow: "300ms",
  },
  easing: {
    standard: "cubic-bezier(0.4, 0, 0.2, 1)",
    emphasized: "cubic-bezier(0.2, 0, 0, 1)",
    decelerate: "cubic-bezier(0, 0, 0.2, 1)",
    accelerate: "cubic-bezier(0.4, 0, 1, 1)",
  },
} as const;

/**
 * Get animation class for fade-in
 */
export function getFadeInClass(delay = 0): string {
  return `animate-in fade-in slide-in-from-bottom-2 duration-300`;
}

/**
 * Get animation style with delay
 */
export function getAnimationStyle(delay: number): React.CSSProperties {
  return {
    animationDelay: `${delay}ms`,
  };
}

/**
 * Stagger animation delays for list items
 */
export function getStaggerDelay(index: number, baseDelay = 50): number {
  return index * baseDelay;
}
