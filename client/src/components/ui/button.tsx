import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Mobile-first: Touch-optimized (min 44x44px), larger on mobile, refined on desktop
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive touch-manipulation",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground active:bg-primary/80 md:hover:bg-primary/90",
        destructive:
          "bg-destructive text-white active:bg-destructive/80 md:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-transparent shadow-xs active:bg-accent md:hover:bg-accent dark:bg-transparent dark:border-input dark:active:bg-input/50 md:dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground active:bg-secondary/70 md:hover:bg-secondary/80",
        ghost:
          "active:bg-accent md:hover:bg-accent dark:active:bg-accent/50 md:dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 active:underline md:hover:underline",
        gradient:
          "ai-gradient-bg text-white border-none shadow-lg shadow-[#FF6B9D]/20 active:scale-[0.98] active:shadow-md md:hover:shadow-[0_10px_30px_rgba(255,107,157,0.35),0_5px_15px_rgba(196,79,226,0.25),0_0_40px_rgba(0,212,255,0.2)] md:hover:-translate-y-0.5 transition-all duration-200 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700",
      },
      size: {
        // Mobile-first: Larger touch targets on mobile (min 44px), refined on desktop
        default:
          "h-11 md:h-9 px-5 md:px-4 py-2.5 md:py-2 has-[>svg]:px-4 md:has-[>svg]:px-3 min-w-[44px]",
        sm: "h-10 md:h-8 rounded-md gap-1.5 px-4 md:px-3 has-[>svg]:px-3 md:has-[>svg]:px-2.5 min-w-[44px]",
        lg: "h-12 md:h-10 rounded-md px-7 md:px-6 has-[>svg]:px-5 md:has-[>svg]:px-4 min-w-[44px]",
        icon: "size-11 md:size-9 min-w-[44px] min-h-[44px]",
        "icon-sm": "size-10 md:size-8 min-w-[44px] min-h-[44px]",
        "icon-lg": "size-12 md:size-10 min-w-[44px] min-h-[44px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
