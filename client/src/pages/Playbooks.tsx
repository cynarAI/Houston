import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import DashboardLayout from "@/components/DashboardLayout";
import { PlaybookCard } from "@/components/PlaybookCard";
import { PlaybookDetailModal } from "@/components/PlaybookDetailModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/ui/page-header";
import { GlassCard, GlassCardContent } from "@/components/ui/glass-card";
import { GradientIcon } from "@/components/ui/gradient-icon";
import {
  playbooks,
  type Playbook,
  type PlaybookCategory,
  type PlaybookDifficulty,
  PLAYBOOK_CATEGORIES,
  PLAYBOOK_DIFFICULTIES,
} from "@/data/playbooks";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Search,
  Filter,
  BookOpen,
  Sparkles,
  Rocket,
} from "lucide-react";

export default function Playbooks() {
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<PlaybookCategory | "all">("all");
  const [difficultyFilter, setDifficultyFilter] = useState<PlaybookDifficulty | "all">("all");
  const [selectedPlaybook, setSelectedPlaybook] = useState<Playbook | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Get workspace for creating todos
  const { data: workspaces } = trpc.workspaces.list.useQuery();
  const createGoalMutation = trpc.goals.create.useMutation();
  const createTodoMutation = trpc.todos.create.useMutation();

  // Filter playbooks
  const filteredPlaybooks = useMemo(() => {
    return playbooks.filter((p) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          p.title.toLowerCase().includes(query) ||
          p.subtitle.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.tags.some((t) => t.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }

      // Category filter
      if (categoryFilter !== "all" && p.category !== categoryFilter) return false;

      // Difficulty filter
      if (difficultyFilter !== "all" && p.difficulty !== difficultyFilter) return false;

      return true;
    });
  }, [searchQuery, categoryFilter, difficultyFilter]);

  const handleSelectPlaybook = (playbook: Playbook) => {
    setSelectedPlaybook(playbook);
    setIsDetailOpen(true);
  };

  const handleStartMission = async (playbook: Playbook) => {
    const workspaceId = workspaces?.[0]?.id;
    if (!workspaceId) {
      toast.error(t("playbooks.noWorkspace", "Kein Workspace gefunden. Bitte erstelle zuerst einen Workspace."));
      return;
    }

    try {
      // Create goal from playbook
      if (playbook.goals.length > 0) {
        const goal = playbook.goals[0];
        await createGoalMutation.mutateAsync({
          workspaceId,
          title: goal.title,
          description: goal.description,
          specific: goal.specific,
          measurable: goal.measurable,
          achievable: goal.achievable,
          relevant: goal.relevant,
          timeBound: goal.timeBound,
        });
      }

      // Create todos from playbook steps
      for (const step of playbook.steps) {
        if (step.todoTemplate) {
          await createTodoMutation.mutateAsync({
            workspaceId,
            title: step.todoTemplate.title,
            description: step.todoTemplate.description,
            priority: "medium",
          });
        }
      }

      toast.success(
        t("playbooks.missionStarted", {
          title: playbook.title,
          count: playbook.steps.length,
          defaultValue: `Mission "${playbook.title}" gestartet! ${playbook.steps.length} Aufgaben wurden erstellt.`
        }),
        {
          action: {
            label: t("nav.todos", "Zu Todos"),
            onClick: () => navigate("/app/todos"),
          },
        }
      );

      setIsDetailOpen(false);
    } catch (error) {
      toast.error(t("playbooks.missionError", "Mission konnte nicht gestartet werden. Bitte versuche es erneut."));
    }
  };

  const handleAskHouston = (prompt: string) => {
    // Navigate to chat with pre-filled message
    navigate(`/app/chats?prompt=${encodeURIComponent(prompt)}`);
    setIsDetailOpen(false);
  };

  const activeFilters =
    (categoryFilter !== "all" ? 1 : 0) + (difficultyFilter !== "all" ? 1 : 0);

  return (
    <DashboardLayout>
      <div className="container py-8 space-y-8">
        {/* Header */}
        <PageHeader
          title={t("playbooks.title")}
          description={t("playbooks.subtitle")}
        />

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("playbooks.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Category Filter */}
          <Select
            value={categoryFilter}
            onValueChange={(v) => setCategoryFilter(v as PlaybookCategory | "all")}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Kategorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("playbooks.allCategories")}</SelectItem>
              {Object.entries(PLAYBOOK_CATEGORIES).map(([key, { label, labelKey }]) => (
                <SelectItem key={key} value={key}>
                  {t(`playbooks.category.${key}`, label)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Difficulty Filter */}
          <Select
            value={difficultyFilter}
            onValueChange={(v) => setDifficultyFilter(v as PlaybookDifficulty | "all")}
          >
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Schwierigkeit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("playbooks.allLevels")}</SelectItem>
              {Object.entries(PLAYBOOK_DIFFICULTIES).map(([key, { label }]) => (
                <SelectItem key={key} value={key}>
                  {t(`playbooks.difficulty.${key}`, label)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Active Filters */}
        {activeFilters > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{t("playbooks.activeFilters")}:</span>
            {categoryFilter !== "all" && (
              <Badge variant="secondary" className="gap-1">
                {t(`playbooks.category.${categoryFilter}`, PLAYBOOK_CATEGORIES[categoryFilter].label)}
                <button
                  onClick={() => setCategoryFilter("all")}
                  className="ml-1 hover:text-destructive"
                >
                  ×
                </button>
              </Badge>
            )}
            {difficultyFilter !== "all" && (
              <Badge variant="secondary" className="gap-1">
                {t(`playbooks.difficulty.${difficultyFilter}`, PLAYBOOK_DIFFICULTIES[difficultyFilter].label)}
                <button
                  onClick={() => setDifficultyFilter("all")}
                  className="ml-1 hover:text-destructive"
                >
                  ×
                </button>
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setCategoryFilter("all");
                setDifficultyFilter("all");
              }}
            >
              {t("playbooks.resetFilters")}
            </Button>
          </div>
        )}

        {/* Results Count */}
        <div className="text-sm text-muted-foreground">
          {t("playbooks.resultsCount", { count: filteredPlaybooks.length, total: playbooks.length })}
        </div>

        {/* Playbooks Grid */}
        {filteredPlaybooks.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPlaybooks.map((playbook) => (
              <PlaybookCard
                key={playbook.id}
                playbook={playbook}
                onSelect={handleSelectPlaybook}
              />
            ))}
          </div>
        ) : (
          <GlassCard variant="elevated">
            <GlassCardContent className="py-16 text-center">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-gradient-blue)] to-[var(--color-gradient-purple)] rounded-full blur-2xl opacity-20 animate-pulse"></div>
                  <GradientIcon
                    icon={BookOpen}
                    gradient="blue-purple"
                    size="xl"
                    className="relative"
                  />
                </div>
              </div>
              <h3 className="font-semibold text-xl mb-2">
                {t("playbooks.noResults")}
              </h3>
              <p className="text-sm text-muted-foreground mb-8 max-w-md mx-auto">
                {t("playbooks.noResultsHint")}
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setCategoryFilter("all");
                  setDifficultyFilter("all");
                }}
              >
                {t("playbooks.resetFilters")}
              </Button>
            </GlassCardContent>
          </GlassCard>
        )}

        {/* Houston CTA */}
        <GlassCard variant="glow" className="mt-8">
          <GlassCardContent className="py-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[var(--color-gradient-pink)] to-[var(--color-gradient-purple)] shrink-0">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-semibold text-lg mb-1">
                  {t("playbooks.notSure")}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {t("playbooks.notSureHint")}
                </p>
              </div>
              <Button
                variant="gradient"
                onClick={() =>
                  handleAskHouston(
                    t("playbooks.askHoustonPrompt", "Welches Marketing-Playbook passt am besten zu meiner Situation?")
                  )
                }
                className="gap-2"
              >
                <Rocket className="h-4 w-4" />
                {t("playbooks.askHouston")}
              </Button>
            </div>
          </GlassCardContent>
        </GlassCard>
      </div>

      {/* Detail Modal */}
      <PlaybookDetailModal
        playbook={selectedPlaybook}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        onStartMission={handleStartMission}
        onAskHouston={handleAskHouston}
      />
    </DashboardLayout>
  );
}
