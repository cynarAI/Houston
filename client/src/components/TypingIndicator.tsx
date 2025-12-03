import { useState, useEffect } from "react";

const thinkingPhrases = [
  "Houston denkt nach...",
  "Analysiere deine Daten...",
  "Formuliere Antwort...",
  "Gleich bin ich soweit...",
];

export function TypingIndicator() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  
  // Cycle through phrases every 2 seconds for longer waits
  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % thinkingPhrases.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 w-fit animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center gap-1.5">
        <div 
          className="w-2 h-2 rounded-full bg-gradient-to-r from-[#FF6B9D] to-[#C44FE2] animate-bounce"
          style={{ animationDelay: "0ms", animationDuration: "600ms" }}
        />
        <div 
          className="w-2 h-2 rounded-full bg-gradient-to-r from-[#FF6B9D] to-[#C44FE2] animate-bounce"
          style={{ animationDelay: "150ms", animationDuration: "600ms" }}
        />
        <div 
          className="w-2 h-2 rounded-full bg-gradient-to-r from-[#FF6B9D] to-[#C44FE2] animate-bounce"
          style={{ animationDelay: "300ms", animationDuration: "600ms" }}
        />
      </div>
      <span className="text-sm text-muted-foreground transition-all duration-300">
        {thinkingPhrases[phraseIndex]}
      </span>
    </div>
  );
}
