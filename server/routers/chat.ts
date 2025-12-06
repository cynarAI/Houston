import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import * as db from "../db";
import { getWorkspaceById } from "../db";
import { invokeLLM } from "../_core/llm";
import { CreditService } from "../creditService";
import {
  verifyWorkspaceOwnership,
  verifyChatSessionOwnership,
} from "../_core/ownership";

export const chatRouter = router({
  // List all chat sessions for a workspace
  listSessions: protectedProcedure
    .input(z.object({ workspaceId: z.number() }))
    .query(async ({ ctx, input }) => {
      // Verify user owns the workspace
      await verifyWorkspaceOwnership(input.workspaceId, ctx.user.id);
      return await db.getChatSessionsByWorkspaceId(input.workspaceId);
    }),

  // Get a specific session with messages
  getSession: protectedProcedure
    .input(z.object({ sessionId: z.number() }))
    .query(async ({ ctx, input }) => {
      // Verify user has access to this session
      await verifyChatSessionOwnership(input.sessionId, ctx.user.id);

      const session = await db.getChatSessionById(input.sessionId);
      if (!session) return null;

      const messages = await db.getChatMessagesBySessionId(input.sessionId);
      return { ...session, messages };
    }),

  // Create a new chat session
  createSession: protectedProcedure
    .input(
      z.object({
        workspaceId: z.number(),
        title: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Verify user owns the workspace before creating session
      await verifyWorkspaceOwnership(input.workspaceId, ctx.user.id);
      const id = await db.createChatSession(input);
      return { id };
    }),

  // Send a message and get coach response
  sendMessage: protectedProcedure
    .input(
      z.object({
        sessionId: z.number(),
        content: z.string().min(1).max(10000), // Limit message length
        language: z.enum(["de", "en"]).default("de"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Verify user has access to this session
      await verifyChatSessionOwnership(input.sessionId, ctx.user.id);

      // Check for explicit confirmation of deep analysis
      const confirmationKeywords = [
        "start analysis",
        "analyse starten",
        "start deep dive",
        "tiefenanalyse starten",
        "start audit",
      ];
      const isDeepAnalysisConfirmed = confirmationKeywords.some(
        (keyword) =>
          input.content.toLowerCase().trim() === keyword ||
          input.content.toLowerCase().includes(`[${keyword}]`), // Support button clicks if we had them
      );

      let isDeepAnalysis = false;
      let transactionId: number | undefined;

      // Charge credits first if needed (and get transactionId)
      if (isDeepAnalysisConfirmed) {
        const result = await CreditService.charge(
          ctx.user.id,
          "CHAT_DEEP_ANALYSIS",
          3,
          { sessionId: input.sessionId, query: "Deep Analysis Confirmed" },
        );

        if (!result.success) {
          throw new Error(
            input.language === "de"
              ? `Nicht genug Credits! Diese Analyse kostet 3 Credits. Aktuelles Guthaben: ${result.newBalance} Credits.`
              : `Not enough credits! This analysis costs 3 credits. Current balance: ${result.newBalance} credits.`,
          );
        }
        isDeepAnalysis = true;
        transactionId = result.transactionId;
      } else {
        // Even for free chats, we might want to log a transaction with 0 cost to track tokens
        const result = await CreditService.charge(
          ctx.user.id,
          "CHAT_BASIC",
          0,
          { sessionId: input.sessionId },
        );
        transactionId = result.transactionId;
      }

      // Save user message
      await db.createChatMessage({
        sessionId: input.sessionId,
        role: "user",
        content: input.content,
      });

      // Get session context
      const session = await db.getChatSessionById(input.sessionId);
      if (!session) throw new Error("Session not found");

      const workspace = await db.getWorkspaceById(session.workspaceId);
      const messages = await db.getChatMessagesBySessionId(input.sessionId);

      // Get user's activity context (goals, todos, strategy)
      const goals = await db.getGoalsByWorkspaceId(session.workspaceId);
      const todos = await db.getTodosByWorkspaceId(session.workspaceId);
      const strategy = await db.getStrategyByWorkspaceId(session.workspaceId);

      // Build activity context for more personalized responses
      const activeGoals = goals.filter((g) => g.status === "active");
      const openTodos = todos.filter((t) => t.status !== "done");
      const completedTodos = todos.filter((t) => t.status === "done").slice(-5); // Last 5 completed
      const overdueTodos = openTodos.filter(
        (t) => t.dueDate && new Date(t.dueDate) < new Date(),
      );

      // Get user's credit balance for credit-aware responses
      const creditBalance = await CreditService.getBalance(ctx.user.id);
      const hasLowCredits = creditBalance < 20;
      const hasNoCredits = creditBalance === 0;

      // Build context for LLM
      const creditContext =
        input.language === "de"
          ? `\n\n**Credit-System:**\n- Der User hat aktuell ${creditBalance} Credits.\n${hasLowCredits ? "- WICHTIG: Credits werden knapp! Erwähne dies subtil und schlage vor, Credits aufzuladen.\n" : ""}${hasNoCredits ? "- KRITISCH: Keine Credits mehr! Der User kann keine kostenpflichtigen Analysen mehr durchführen.\n" : ""}${isDeepAnalysis ? "- Diese Anfrage hat 3 Credits gekostet (Deep Analysis). Du MUSS jetzt eine sehr detaillierte, hochwertige Analyse liefern.\n" : "- Einfache Chat-Nachrichten sind kostenlos.\n"}- Tiefe Analysen (Strategie, Audit, Wettbewerb) kosten 3 Credits.\n- WICHTIG: Wenn der User nach einer tiefen Analyse fragt (und NICHT "ANALYSE STARTEN" geschrieben hat), mache sie NICHT sofort. Stattdessen: Erkläre kurz, was du tun kannst und biete an: "Soll ich eine Deep Dive Analyse starten? (Kostet 3 Credits). Schreibe dazu einfach 'ANALYSE STARTEN'".`
          : `\n\n**Credit System:**\n- User currently has ${creditBalance} credits.\n${hasLowCredits ? "- IMPORTANT: Credits running low! Mention this subtly and suggest topping up.\n" : ""}${hasNoCredits ? "- CRITICAL: No credits left! User cannot perform paid analyses.\n" : ""}${isDeepAnalysis ? "- This request cost 3 credits (Deep Analysis). You MUST provide a high-quality, detailed analysis now.\n" : "- Simple chat messages are free.\n"}- Deep analyses (strategy, audit, competitor) cost 3 credits.\n- IMPORTANT: If user asks for deep analysis (and did NOT type "START ANALYSIS"), do NOT do it yet. Instead: Briefly explain what you can do and offer: "Shall I start a Deep Dive Analysis? (Costs 3 Credits). Just type 'START ANALYSIS'".`;

      // Strategy Context
      const strategyContext =
        input.language === "de"
          ? `\n\n**MARKETING-STRATEGIE (Positionierung):**
${strategy?.positioning ? `"${strategy.positioning}"` : "Noch keine Positionierung definiert."}
${workspace?.targetAudience ? `- Zielgruppe: ${workspace.targetAudience}` : ""}
${strategy?.personas ? `- Personas: ${strategy.personas}` : ""}
${strategy?.coreMessages ? `- Kernbotschaften: ${strategy.coreMessages}` : ""}
${strategy?.brandVoice ? `- Brand Voice: ${strategy.brandVoice}` : ""}
NUTZE DIESE STRATEGIE FÜR ALLE ANTWORTEN. Deine Ratschläge müssen zur Positionierung passen.`
          : `\n\n**MARKETING STRATEGY (Positioning):**
${strategy?.positioning ? `"${strategy.positioning}"` : "No positioning defined yet."}
${workspace?.targetAudience ? `- Target Audience: ${workspace.targetAudience}` : ""}
${strategy?.personas ? `- Personas: ${strategy.personas}` : ""}
${strategy?.coreMessages ? `- Core Messages: ${strategy.coreMessages}` : ""}
${strategy?.brandVoice ? `- Brand Voice: ${strategy.brandVoice}` : ""}
USE THIS STRATEGY FOR ALL ANSWERS. Your advice must align with the positioning.`;

      // Playbook knowledge for proactive suggestions
      const playbookContext =
        input.language === "de"
          ? `\n\n**Marketing-Playbooks:**
Du hast Zugriff auf 8 bewährte Marketing-Playbooks, die du proaktiv vorschlagen kannst:
1. **Blog-Funnel** (90 Tage, Mittel) - Lead-Generierung durch SEO-Content
2. **Leadmagnet** (14 Tage, Einfach) - E-Mail-Liste aufbauen mit Freebie
3. **Launch-Kampagne** (30 Tage, Fortgeschritten) - Produkt/Service erfolgreich launchen
4. **Evergreen-Ads** (60 Tage, Mittel) - Dauerhaft performante Werbung
5. **Newsletter-Serie** (7 Tage, Einfach) - Nurturing-Sequenz erstellen
6. **Social Media 30-Tage** (30 Tage, Einfach) - Konsistente Präsenz aufbauen
7. **Webinar-Funnel** (21 Tage, Fortgeschritten) - Leads über Live-Events gewinnen
8. **Testimonial-Kampagne** (14 Tage, Einfach) - Social Proof sammeln und nutzen

Wenn der User nach Marketing-Strategien, Content-Plänen, Kampagnen oder Funnels fragt, schlage proaktiv ein passendes Playbook vor mit dem Hinweis: "Schau dir das [Playbook-Name]-Playbook an unter /app/playbooks".`
          : `\n\n**Marketing Playbooks:**
You have access to 8 proven marketing playbooks that you can proactively suggest:
1. **Blog-Funnel** (90 days, Medium) - Lead generation through SEO content
2. **Leadmagnet** (14 days, Easy) - Build email list with freebie
3. **Launch Campaign** (30 days, Advanced) - Successfully launch product/service
4. **Evergreen-Ads** (60 days, Medium) - Consistently performing ads
5. **Newsletter Series** (7 days, Easy) - Create nurturing sequence
6. **Social Media 30-Day** (30 days, Easy) - Build consistent presence
7. **Webinar-Funnel** (21 days, Advanced) - Generate leads via live events
8. **Testimonial Campaign** (14 days, Easy) - Collect and use social proof

When users ask about marketing strategies, content plans, campaigns, or funnels, proactively suggest a relevant playbook with: "Check out the [Playbook Name] playbook at /app/playbooks".`;

      // Build user activity context
      const activityContext =
        input.language === "de"
          ? `\n\n**AKTUELLE AKTIVITÄTEN DES USERS:**
${activeGoals.length > 0 ? `- Aktive Ziele (${activeGoals.length}): ${activeGoals.map((g) => `"${g.title}" (${g.progress || 0}% Fortschritt)`).join(", ")}` : "- Noch keine Ziele definiert"}
${
  openTodos.length > 0
    ? `- Offene Aufgaben (${openTodos.length}): ${openTodos
        .slice(0, 3)
        .map((t) => `"${t.title}"`)
        .join(
          ", ",
        )}${openTodos.length > 3 ? ` (+${openTodos.length - 3} weitere)` : ""}`
    : "- Keine offenen Aufgaben"
}
${completedTodos.length > 0 ? `- Zuletzt erledigt: ${completedTodos.map((t) => `"${t.title}"`).join(", ")}` : ""}
${overdueTodos.length > 0 ? `- ÜBERFÄLLIG (${overdueTodos.length}): ${overdueTodos.map((t) => `"${t.title}"`).join(", ")} – erwähne das taktvoll!` : ""}

NUTZE DIESE INFORMATIONEN:
- Referenziere aktive Ziele wenn relevant
- Lobe erledigte Aufgaben wenn passend
- Weise auf überfällige Aufgaben hin (taktvoll)
- Wenn keine Ziele/Aufgaben: Biete an, welche zu erstellen`
          : `\n\n**USER'S CURRENT ACTIVITIES:**
${activeGoals.length > 0 ? `- Active goals (${activeGoals.length}): ${activeGoals.map((g) => `"${g.title}" (${g.progress || 0}% progress)`).join(", ")}` : "- No goals defined yet"}
${
  openTodos.length > 0
    ? `- Open tasks (${openTodos.length}): ${openTodos
        .slice(0, 3)
        .map((t) => `"${t.title}"`)
        .join(
          ", ",
        )}${openTodos.length > 3 ? ` (+${openTodos.length - 3} more)` : ""}`
    : "- No open tasks"
}
${completedTodos.length > 0 ? `- Recently completed: ${completedTodos.map((t) => `"${t.title}"`).join(", ")}` : ""}
${overdueTodos.length > 0 ? `- OVERDUE (${overdueTodos.length}): ${overdueTodos.map((t) => `"${t.title}"`).join(", ")} – mention tactfully!` : ""}

USE THIS INFORMATION:
- Reference active goals when relevant
- Praise completed tasks when appropriate
- Point out overdue tasks (tactfully)
- If no goals/tasks: Offer to help create some`;

      const systemPrompt =
        input.language === "de"
          ? `Du bist Houston – dein persönlicher KI Marketing-Coach von AIstronaut.

DEINE PERSÖNLICHKEIT:
- Du bist wie ein erfahrener Marketing-Berater, der mit dem User auf Augenhöhe spricht
- Freundlich, direkt, motivierend – aber nie oberflächlich oder zu enthusiastisch
- Du gibst konkrete, umsetzbare Ratschläge statt vager Tipps
- Wenn du etwas nicht weißt, sagst du es ehrlich
- Du verwendest gelegentlich Space-Metaphern (Mission, Kurs, Orbit) – aber dezent

GESPRÄCHSSTIL:
- Du-Form, locker aber professionell
- Kurz und knackig: max. 3-4 Absätze
- Nutze Bulletpoints für Aufzählungen
- Stelle Rückfragen, um den User besser zu verstehen
- Beende Antworten oft mit einer konkreten Handlungsaufforderung oder Frage

KONTEXT ZUM UNTERNEHMEN:
${workspace?.industry ? `- Branche: ${workspace.industry}` : ""}
${workspace?.companySize ? `- Größe: ${workspace.companySize}` : ""}
${workspace?.targetAudience ? `- Zielgruppe: ${workspace.targetAudience}` : ""}
${activityContext}
${strategyContext}
${creditContext}
${playbookContext}

WICHTIG: Sei ein echter Coach, kein Chatbot. Der User soll das Gefühl haben, mit einem kompetenten Berater zu sprechen.`
          : `You are Houston – a personal AI marketing coach from AIstronaut.

YOUR PERSONALITY:
- You're like an experienced marketing consultant speaking at the user's level
- Friendly, direct, motivating – but never superficial or overly enthusiastic
- You give concrete, actionable advice instead of vague tips
- If you don't know something, be honest about it
- Occasionally use space metaphors (mission, course, orbit) – but subtly

CONVERSATION STYLE:
- Casual but professional
- Short and punchy: max. 3-4 paragraphs
- Use bullet points for lists
- Ask follow-up questions to better understand the user
- Often end responses with a concrete call-to-action or question

COMPANY CONTEXT:
${workspace?.industry ? `- Industry: ${workspace.industry}` : ""}
${workspace?.companySize ? `- Size: ${workspace.companySize}` : ""}
${workspace?.targetAudience ? `- Target audience: ${workspace.targetAudience}` : ""}
${activityContext}
${strategyContext}
${creditContext}
${playbookContext}

IMPORTANT: Be a real coach, not a chatbot. The user should feel like they're talking to a competent consultant.`;

      const llmMessages = [
        { role: "system" as const, content: systemPrompt },
        ...messages.slice(-10).map((m) => ({
          role: m.role === "user" ? ("user" as const) : ("assistant" as const),
          content: m.content,
        })),
        { role: "user" as const, content: input.content },
      ];

      // Get response from Manus 1.5
      const response = await invokeLLM({
        userId: String(ctx.user?.openId ?? ctx.user?.id ?? "unknown"),
        sessionId: String(input.sessionId),
        messages: llmMessages,
      });
      const coachResponse =
        typeof response.choices[0]?.message?.content === "string"
          ? response.choices[0]?.message?.content
          : "Entschuldigung, ich konnte keine Antwort generieren.";

      // Update transaction with actual token usage
      if (transactionId && response.usage) {
        await CreditService.updateTransactionUsage(transactionId, {
          promptTokens: response.usage.prompt_tokens,
          completionTokens: response.usage.completion_tokens,
          model: response.model,
        });
      }

      // Save coach response
      await db.createChatMessage({
        sessionId: input.sessionId,
        role: "coach",
        content: coachResponse,
      });

      return { content: coachResponse };
    }),

  // Delete a chat session
  deleteSession: protectedProcedure
    .input(z.object({ sessionId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // Verify user has access to this session before deleting
      await verifyChatSessionOwnership(input.sessionId, ctx.user.id);
      await db.deleteChatSession(input.sessionId);
      return { success: true };
    }),

  // Send feedback on a message (thumbs up/down)
  sendFeedback: protectedProcedure
    .input(
      z.object({
        messageId: z.number(),
        feedback: z.enum(["positive", "negative"]),
      }),
    )
    .mutation(async ({ input }) => {
      // TODO: Save feedback to database for analytics
      // Currently, feedback is acknowledged but not persisted
      void input; // Acknowledge input to avoid unused variable warning
      return { success: true };
    }),

  // Regenerate AI response
  regenerateResponse: protectedProcedure
    .input(
      z.object({
        sessionId: z.number(),
        messageId: z.number(), // The user message ID to regenerate response for
        language: z.enum(["de", "en"]).default("de"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Verify user has access to this session
      await verifyChatSessionOwnership(input.sessionId, ctx.user.id);

      // Get the user message
      const messages = await db.getChatMessagesBySessionId(input.sessionId);
      const userMessage = messages.find((m) => m.id === input.messageId);
      if (!userMessage || userMessage.role !== "user") {
        throw new Error("User message not found");
      }

      // Track regeneration cost (0 credits but track tokens)
      const { transactionId } = await CreditService.charge(
        ctx.user.id,
        "CHAT_BASIC", // Or create a specific REGENERATE type
        0,
        {
          sessionId: input.sessionId,
          action: "regenerate",
          messageId: input.messageId,
        },
      );

      // Get session context
      const session = await db.getChatSessionById(input.sessionId);
      if (!session) throw new Error("Session not found");

      const workspace = await db.getWorkspaceById(session.workspaceId);

      // Build context for LLM - Same personality as main chat
      const systemPrompt =
        input.language === "de"
          ? `Du bist Houston – dein persönlicher KI Marketing-Coach von AIstronaut.

DEINE PERSÖNLICHKEIT:
- Erfahrener Marketing-Berater auf Augenhöhe
- Freundlich, direkt, motivierend – nie oberflächlich
- Konkrete, umsetzbare Ratschläge statt vager Tipps

GESPRÄCHSSTIL:
- Du-Form, locker aber professionell
- Kurz und knackig: max. 3-4 Absätze
- Nutze Bulletpoints für Aufzählungen

KONTEXT:
${workspace?.industry ? `- Branche: ${workspace.industry}` : ""}
${workspace?.companySize ? `- Größe: ${workspace.companySize}` : ""}
${workspace?.targetAudience ? `- Zielgruppe: ${workspace.targetAudience}` : ""}`
          : `You are Houston – a personal AI marketing coach from AIstronaut.

YOUR PERSONALITY:
- Experienced marketing consultant at the user's level
- Friendly, direct, motivating – never superficial
- Concrete, actionable advice instead of vague tips

CONVERSATION STYLE:
- Casual but professional
- Short and punchy: max. 3-4 paragraphs
- Use bullet points for lists

CONTEXT:
${workspace?.industry ? `- Industry: ${workspace.industry}` : ""}
${workspace?.companySize ? `- Size: ${workspace.companySize}` : ""}
${workspace?.targetAudience ? `- Target audience: ${workspace.targetAudience}` : ""}`;

      const llmMessages = [
        { role: "system" as const, content: systemPrompt },
        ...messages
          .slice(-10)
          .filter((m) => m.id < input.messageId)
          .map((m) => ({
            role:
              m.role === "user" ? ("user" as const) : ("assistant" as const),
            content: m.content,
          })),
        { role: "user" as const, content: userMessage.content },
      ];

      // Get new response from Manus 1.5
      const response = await invokeLLM({
        userId: String(ctx.user?.openId ?? ctx.user?.id ?? "unknown"),
        sessionId: String(input.sessionId),
        messages: llmMessages,
      });
      const coachResponse =
        typeof response.choices[0]?.message?.content === "string"
          ? response.choices[0]?.message?.content
          : "Entschuldigung, ich konnte keine Antwort generieren.";

      // Update transaction with actual token usage
      if (transactionId && response.usage) {
        await CreditService.updateTransactionUsage(transactionId, {
          promptTokens: response.usage.prompt_tokens,
          completionTokens: response.usage.completion_tokens,
          model: response.model,
        });
      }

      // Save new coach response
      await db.createChatMessage({
        sessionId: input.sessionId,
        role: "coach",
        content: coachResponse,
      });

      return { content: coachResponse };
    }),
});
