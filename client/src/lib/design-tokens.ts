/**
 * Design token exports for Houston app
 * Provides access to CSS custom properties as TypeScript constants
 */

export const designTokens = {
  spacing: {
    "1": "0.5rem", // 8px
    "2": "1rem", // 16px
    "3": "1.5rem", // 24px
    "4": "2rem", // 32px
    "5": "2.5rem", // 40px
    "6": "3rem", // 48px
    "8": "4rem", // 64px
    "10": "5rem", // 80px
    "12": "6rem", // 96px
    "16": "8rem", // 128px
  },
  colors: {
    aistronaut: {
      cyan: "#00D4FF",
      purple: "#8B5CF6",
      pink: "#FF6B9D",
      blue: "#3B82F6",
    },
  },
  gradients: {
    aistronaut:
      "linear-gradient(135deg, #FF6B9D 0%, #8B5CF6 50%, #00D4FF 100%)",
    aistronautCta: "linear-gradient(90deg, #FF6B9D 0%, #8B5CF6 100%)",
  },
  animation: {
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
      bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)", // 2025: Bouncy microinteractions
    },
    delay: {
      stagger1: "50ms",
      stagger2: "100ms",
      stagger3: "150ms",
      stagger4: "200ms",
    },
  },
  // Modern Design Trends 2025/2026
  modern: {
    borderRadius: {
      sm: "0.5rem", // 8px
      md: "1rem", // 16px
      lg: "1.5rem", // 24px
      xl: "2rem", // 32px
      "2xl": "2.5rem", // 40px
      full: "9999px",
    },
    glass: {
      blur: "blur(20px)",
      backdropBlur: "backdrop-blur(20px)",
    },
    transform3d: {
      perspective: "1000px",
      depth: "translateZ(20px)",
      lift: "translateZ(40px)",
    },
  },
} as const;

/**
 * Get CSS variable value
 */
export function getCSSVariable(name: string): string {
  if (typeof window === "undefined") return "";
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
}

/**
 * Get theme-aware color
 */
export function getThemeColor(
  lightColor: string,
  darkColor: string,
  isDark: boolean,
): string {
  return isDark ? darkColor : lightColor;
}
