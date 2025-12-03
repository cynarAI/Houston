import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Rocket, Home, MessageSquare, Sparkles } from "lucide-react";
import { useLocation, Link } from "wouter";
import { useMemo } from "react";

export default function NotFound() {
  const [, setLocation] = useLocation();

  const handleGoHome = () => {
    setLocation("/");
  };

  // Generate star positions once and cache them
  const stars = useMemo(() => 
    [...Array(50)].map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 2,
      opacity: Math.random() * 0.7 + 0.3,
    })), 
  []);

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
      {/* Space Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#1a1a2e] to-[#0a0a0f]"></div>
        {/* Stars */}
        <div className="absolute inset-0">
          {stars.map((star) => (
            <div
              key={star.id}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${star.left}%`,
                top: `${star.top}%`,
                animationDelay: `${star.delay}s`,
                opacity: star.opacity,
              }}
            />
          ))}
        </div>
      </div>

      <Card className="w-full max-w-lg mx-4 glass border-white/10 backdrop-blur-xl relative z-10">
        <CardContent className="pt-10 pb-10 text-center">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-gradient-pink)] to-[var(--color-gradient-purple)] rounded-full blur-2xl opacity-30 animate-pulse"></div>
              <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-[var(--color-gradient-pink)] to-[var(--color-gradient-purple)]">
                <Rocket className="h-12 w-12 text-white transform rotate-45" />
              </div>
            </div>
          </div>

          <h1 className="text-6xl font-bold gradient-text-aistronaut mb-3">404</h1>

          <h2 className="text-2xl font-semibold text-white mb-4">
            Houston, wir haben ein Problem! 🛸
          </h2>

          <p className="text-white/70 mb-8 leading-relaxed max-w-sm mx-auto">
            Diese Seite scheint im Weltraum verloren gegangen zu sein.
            <br />
            Lass uns dich zurück zur Basis bringen.
          </p>

          <div
            id="not-found-button-group"
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Button
              onClick={handleGoHome}
              className="bg-gradient-to-r from-[var(--color-gradient-pink)] to-[var(--color-gradient-purple)] hover:opacity-90 text-white px-6 py-2.5 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Home className="w-4 h-4 mr-2" />
              Zur Startseite
            </Button>
            <Link href="/app/chats">
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 px-6 py-2.5 rounded-lg transition-all duration-200"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Houston fragen
              </Button>
            </Link>
          </div>

          {/* Fun hint */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-xs text-white/50 flex items-center justify-center gap-2">
              <Sparkles className="w-3 h-3" />
              Tipp: Houston kann dir bei allem helfen – außer bei 404-Fehlern
              <Sparkles className="w-3 h-3" />
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
