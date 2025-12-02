import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import * as db from "../db";
import { invokeLLM } from "../_core/llm";
import { CreditService } from "../creditService";

export const insightsRouter = router({
  generateRecommendations: protectedProcedure
    .input(z.object({ workspaceId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // Charge 3 credits for AI insights generation
      const result = await CreditService.charge(
        ctx.user.id,
        'AI_INSIGHTS',
        3,
        { workspaceId: input.workspaceId }
      );
      
      if (!result.success) {
        throw new Error(
          `Not enough credits! AI Insights generation costs 3 credits. Current balance: ${result.newBalance} credits.`
        );
      }
      // Fetch user's data
      const goals = await db.getGoalsByWorkspaceId(input.workspaceId);
      const todos = await db.getTodosByWorkspaceId(input.workspaceId);
      const strategy = await db.getStrategyByWorkspaceId(input.workspaceId);

      // Prepare context for LLM
      const context = {
        goals: goals.map((g) => ({
          title: g.title,
          description: g.description,
          status: g.status,
          priority: g.priority,
        })),
        todos: todos.map((t) => ({
          title: t.title,
          status: t.status,
          priority: t.priority,
        })),
        strategy: strategy
          ? {
              positioning: strategy.positioning,
              personas: strategy.personas,
              coreMessages: strategy.coreMessages,
            }
          : null,
      };

      // Generate recommendations using LLM
      const prompt = `You are Houston, an AI Marketing Coach. Analyze the user's current marketing situation and provide 3-5 concrete, actionable recommendations.

**User's Current State:**
- Goals: ${context.goals.length > 0 ? JSON.stringify(context.goals) : "No goals defined yet"}
- To-dos: ${context.todos.length > 0 ? JSON.stringify(context.todos) : "No tasks created yet"}
- Strategy: ${context.strategy ? JSON.stringify(context.strategy) : "No strategy defined yet"}

**Instructions:**
1. Analyze their progress, gaps, and opportunities
2. Provide 3-5 specific, actionable recommendations
3. Each recommendation should have:
   - A clear title (max 8 words)
   - A brief description (1-2 sentences)
   - A suggested action (what they should do next)
   - A priority level (high, medium, low)
   - A category (goals, strategy, tasks, or optimization)

**Output Format (JSON):**
{
  "recommendations": [
    {
      "title": "Set your first SMART goal",
      "description": "You haven't defined any marketing goals yet. Start with one clear, measurable goal.",
      "action": "Define your first goal",
      "priority": "high",
      "category": "goals",
      "link": "/app/goals"
    }
  ]
}

Respond ONLY with valid JSON, no additional text.`;

      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content:
              "You are Houston, an AI Marketing Coach. You provide clear, actionable recommendations in JSON format.",
          },
          { role: "user", content: prompt },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "recommendations",
            strict: true,
            schema: {
              type: "object",
              properties: {
                recommendations: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: { type: "string" },
                      description: { type: "string" },
                      action: { type: "string" },
                      priority: { type: "string", enum: ["high", "medium", "low"] },
                      category: { type: "string", enum: ["goals", "strategy", "tasks", "optimization"] },
                      link: { type: "string" },
                    },
                    required: ["title", "description", "action", "priority", "category", "link"],
                    additionalProperties: false,
                  },
                },
              },
              required: ["recommendations"],
              additionalProperties: false,
            },
          },
        },
      });

      const content = response.choices[0].message.content;
      const recommendations = JSON.parse(typeof content === 'string' ? content : "{}");

      return recommendations;
    }),
});
