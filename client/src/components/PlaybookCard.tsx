import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import type { Playbook, PlaybookDifficulty } from "@/data/playbooks";
import { PLAYBOOK_DIFFICULTIES } from "@/data/playbooks";
import { Clock, ArrowRight, CheckCircle2 } from "lucide-react";

interface PlaybookCardProps {
  playbook: Playbook;
  onSelect: (playbook: Playbook) => void;
  compact?: boolean;
}

const difficultyColors: Record<PlaybookDifficulty, string> = {
  easy: "bg-green-500/20 text-green-400 border-green-500/30",
  medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  advanced: "bg-red-500/20 text-red-400 border-red-500/30",
};

export function PlaybookCard({
  playbook,
  onSelect,
  compact = false,
}: PlaybookCardProps) {
  const Icon = playbook.icon;
  const difficulty = PLAYBOOK_DIFFICULTIES[playbook.difficulty];

  if (compact) {
    return (
      <GlassCard
        variant="default"
        className="group w-full cursor-pointer hover:scale-[1.02] transition-all duration-300"
        onClick={() => onSelect(playbook)}
      >
        <div className="grid grid-cols-[auto,1fr,auto] items-center gap-4 px-5 py-4">
          <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-[var(--color-gradient-pink)] to-[var(--color-gradient-purple)] shrink-0 shadow-[0_10px_30px_rgba(255,107,157,0.25)]">
            <Icon className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0 space-y-1">
            <h3 className="font-semibold text-sm leading-tight truncate">
              {playbook.title}
            </h3>
            <p className="text-xs text-muted-foreground/80 truncate">
              {playbook.subtitle}
            </p>
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard
      variant="elevated"
      className="group cursor-pointer hover:scale-[1.02] transition-all duration-300 flex flex-col h-full"
      onClick={() => onSelect(playbook)}
    >
      <div className="p-6 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--color-gradient-pink)] to-[var(--color-gradient-purple)] shadow-lg shadow-purple-500/20">
            <Icon className="h-7 w-7 text-white" />
          </div>
          <Badge
            variant="outline"
            className={difficultyColors[playbook.difficulty]}
          >
            {difficulty.label}
          </Badge>
        </div>

        {/* Title & Subtitle */}
        <h3 className="font-bold text-xl mb-1 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-[var(--color-gradient-pink)] group-hover:to-[var(--color-gradient-purple)] group-hover:bg-clip-text transition-all">
          {playbook.title}
        </h3>
        <p className="text-muted-foreground text-sm mb-4">
          {playbook.subtitle}
        </p>

        {/* Description */}
        <p className="text-sm text-muted-foreground/80 mb-4 flex-grow line-clamp-3">
          {playbook.description}
        </p>

        {/* Meta Info */}
        <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            <span>{playbook.durationDays} Tage</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4" />
            <span>{playbook.steps.length} Schritte</span>
          </div>
        </div>

        {/* Benefits Preview */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {playbook.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        {/* CTA */}
        <Button
          variant="ghost"
          className="w-full justify-between group-hover:bg-white/5"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(playbook);
          }}
        >
          <span>Details ansehen</span>
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </GlassCard>
  );
}

export default PlaybookCard;
