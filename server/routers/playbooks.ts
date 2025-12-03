import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import * as db from "../db";

// Playbook definitions (mirrored from frontend for server-side access)
// In a production app, these would be stored in a database
const PLAYBOOKS = [
  {
    id: "blog-funnel",
    slug: "blog-funnel",
    title: "Blog-Funnel",
    subtitle: "Lead-Generierung durch SEO-Content",
    category: "content",
    difficulty: "medium",
    durationDays: 90,
    stepsCount: 7,
    goalsCount: 1,
  },
  {
    id: "leadmagnet",
    slug: "leadmagnet",
    title: "Leadmagnet",
    subtitle: "E-Mail-Liste aufbauen mit Freebie",
    category: "leadgen",
    difficulty: "easy",
    durationDays: 14,
    stepsCount: 6,
    goalsCount: 1,
  },
  {
    id: "launch-campaign",
    slug: "launch-kampagne",
    title: "Launch-Kampagne",
    subtitle: "Produkt/Service erfolgreich launchen",
    category: "campaign",
    difficulty: "advanced",
    durationDays: 30,
    stepsCount: 6,
    goalsCount: 1,
  },
  {
    id: "evergreen-ads",
    slug: "evergreen-ads",
    title: "Evergreen-Ads",
    subtitle: "Dauerhaft performante Werbung",
    category: "campaign",
    difficulty: "medium",
    durationDays: 60,
    stepsCount: 7,
    goalsCount: 1,
  },
  {
    id: "newsletter-series",
    slug: "newsletter-serie",
    title: "Newsletter-Serie",
    subtitle: "Nurturing-Sequenz erstellen",
    category: "nurturing",
    difficulty: "easy",
    durationDays: 7,
    stepsCount: 5,
    goalsCount: 1,
  },
  {
    id: "social-media-30",
    slug: "social-media-30-tage",
    title: "Social Media 30-Tage",
    subtitle: "Konsistente Präsenz aufbauen",
    category: "social",
    difficulty: "easy",
    durationDays: 30,
    stepsCount: 7,
    goalsCount: 1,
  },
  {
    id: "webinar-funnel",
    slug: "webinar-funnel",
    title: "Webinar-Funnel",
    subtitle: "Leads über Live-Events gewinnen",
    category: "leadgen",
    difficulty: "advanced",
    durationDays: 21,
    stepsCount: 7,
    goalsCount: 1,
  },
  {
    id: "testimonial-campaign",
    slug: "testimonial-kampagne",
    title: "Testimonial-Kampagne",
    subtitle: "Social Proof sammeln und nutzen",
    category: "campaign",
    difficulty: "easy",
    durationDays: 14,
    stepsCount: 6,
    goalsCount: 1,
  },
] as const;

export const playbooksRouter = router({
  // List all playbooks (lightweight, for overview)
  list: protectedProcedure.query(async () => {
    return PLAYBOOKS;
  }),

  // Get playbook metadata by ID
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const playbook = PLAYBOOKS.find((p) => p.id === input.id || p.slug === input.id);
      if (!playbook) {
        throw new Error("Playbook nicht gefunden");
      }
      return playbook;
    }),

  // Get suggested playbooks based on user's current state
  getSuggestions: protectedProcedure
    .input(z.object({ workspaceId: z.number() }))
    .query(async ({ input }) => {
      // Fetch user's current data
      const goals = await db.getGoalsByWorkspaceId(input.workspaceId);
      const todos = await db.getTodosByWorkspaceId(input.workspaceId);
      const strategy = await db.getStrategyByWorkspaceId(input.workspaceId);

      const hasGoals = goals.length > 0;
      const hasTodos = todos.length > 0;
      const hasStrategy = !!strategy;

      const suggestions: string[] = [];

      // Logic for suggestions
      if (!hasGoals && !hasStrategy) {
        // New users: suggest beginner-friendly playbooks
        suggestions.push("leadmagnet", "social-media-30");
      } else if (hasGoals && !hasStrategy) {
        // Has goals but no strategy: suggest content/nurturing playbooks
        suggestions.push("blog-funnel", "newsletter-series");
      } else if (hasGoals && hasStrategy && hasTodos) {
        // Active users: suggest advanced playbooks
        suggestions.push("webinar-funnel", "launch-campaign", "testimonial-campaign");
      } else {
        // Default suggestions
        suggestions.push("leadmagnet", "social-media-30", "newsletter-series");
      }

      // Return playbook objects for suggested IDs
      return PLAYBOOKS.filter((p) => suggestions.includes(p.id)).slice(0, 3);
    }),

  // Track when a user starts a mission (for analytics)
  trackMissionStart: protectedProcedure
    .input(
      z.object({
        playbookId: z.string(),
        workspaceId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // In a production app, this would:
      // 1. Record the mission start in a database table
      // 2. Track analytics
      // 3. Potentially trigger onboarding flows
      
      // For now, we just acknowledge the action
      console.log(
        `User ${ctx.user.id} started playbook "${input.playbookId}" in workspace ${input.workspaceId}`
      );
      
      return { success: true };
    }),
});
