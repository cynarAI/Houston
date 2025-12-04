import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Mobile-first: Touch-optimized (min 44x44px), larger on mobile, refined on desktop
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring/40 focus-visible:ring-offset-background aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive touch-manipulation overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-[linear-gradient(135deg,#1c2055_0%,#2f3bff_55%,#7c59ff_100%)] text-white shadow-[0_5px_14px_rgba(35,64,255,0.18)] active:scale-[0.99] before:absolute before:inset-0 before:content-[''] before:bg-white/10 before:opacity-0 md:hover:before:opacity-100 before:transition-opacity",
        destructive:
          "bg-destructive text-white active:bg-destructive/80 md:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border border-border bg-transparent text-foreground hover:bg-foreground/5 active:bg-foreground/10 dark:hover:bg-white/10",
        secondary:
          "bg-secondary text-secondary-foreground active:bg-secondary/80 md:hover:bg-secondary/90",
        ghost:
          "text-foreground/80 hover:text-foreground bg-transparent active:bg-foreground/5 md:hover:bg-foreground/5 dark:text-foreground dark:active:bg-white/10 md:dark:hover:bg-white/10",
        link: "text-primary underline-offset-4 active:underline md:hover:underline",
        gradient:
          "text-white border border-white/15 shadow-none active:scale-[0.99] transition-all duration-200 bg-[linear-gradient(120deg,#1b1e4b_0%,#2f3bff_50%,#9d5dff_100%)] bg-[length:200%_200%] before:absolute before:inset-0 before:content-[''] before:bg-gradient-to-r before:from-transparent before:via-white/18 before:to-transparent before:translate-x-[-120%] hover:before:translate-x-[110%] before:transition-transform before:duration-700",
        "gradient-purple":
          "text-white border border-white/15 shadow-none active:scale-[0.99] transition-all duration-200 bg-[linear-gradient(125deg,#2b0f4d_0%,#5a1a82_40%,#a146ff_75%,#ff73d1_100%)] bg-[length:220%_220%] before:absolute before:inset-0 before:content-[''] before:bg-gradient-to-r before:from-transparent before:via-white/25 before:to-transparent before:translate-x-[-120%] hover:before:translate-x-[110%] before:transition-transform before:duration-700",
      },
      size: {
        // Mobile-first: Larger touch targets on mobile (min 44px), refined on desktop
        default:
          "h-11 md:h-10 px-6 md:px-5 py-2.5 md:py-2 has-[>svg]:px-5 md:has-[>svg]:px-4 min-w-[44px]",
        sm: "h-10 md:h-9 rounded-xl gap-1.5 px-4 md:px-3.5 has-[>svg]:px-3 md:has-[>svg]:px-2.5 min-w-[44px]",
        lg: "h-12 md:h-11 rounded-2xl px-8 md:px-6 has-[>svg]:px-6 md:has-[>svg]:px-5 min-w-[44px]",
        icon: "size-11 md:size-10 min-w-[44px] min-h-[44px]",
        "icon-sm": "size-10 md:size-9 min-w-[44px] min-h-[44px]",
        "icon-lg": "size-12 md:size-11 min-w-[44px] min-h-[44px]",
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
