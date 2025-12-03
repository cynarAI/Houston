import { Toaster as Sonner, type ToasterProps } from "sonner";
import { useTheme } from "@/contexts/ThemeContext";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-card group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:backdrop-blur-xl",
          title: "group-[.toast]:font-semibold",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success: "group-[.toaster]:border-green-500/30 group-[.toaster]:bg-green-500/10",
          error: "group-[.toaster]:border-red-500/30 group-[.toaster]:bg-red-500/10",
          warning: "group-[.toaster]:border-yellow-500/30 group-[.toaster]:bg-yellow-500/10",
          info: "group-[.toaster]:border-blue-500/30 group-[.toaster]:bg-blue-500/10",
        },
      }}
      style={
        {
          "--normal-bg": "hsl(var(--card))",
          "--normal-text": "hsl(var(--card-foreground))",
          "--normal-border": "hsl(var(--border))",
          "--success-bg": "hsl(142 76% 36% / 0.15)",
          "--success-border": "hsl(142 76% 36% / 0.3)",
          "--error-bg": "hsl(0 84% 60% / 0.15)",
          "--error-border": "hsl(0 84% 60% / 0.3)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
