import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import * as db from "../db";
import { getWorkspaceById } from "../db";
import { invokeLLM } from "../_core/llm";
import { CreditService } from "../creditService";

export const chatRouter = router({
  // List all chat sessions for a workspace
  listSessions: protectedProcedure
    .input(z.object({ workspaceId: z.number() }))
    .query(async ({ input }) => {
      return await db.getChatSessionsByWorkspaceId(input.workspaceId);
    }),

  // Get a specific session with messages
  getSession: protectedProcedure
    .input(z.object({ sessionId: z.number() }))
    .query(async ({ input }) => {
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
      })
    )
    .mutation(async ({ input }) => {
      const id = await db.createChatSession(input);
      return { id };
    }),

  // Send a message and get coach response
  sendMessage: protectedProcedure
    .input(
      z.object({
        sessionId: z.number(),
        content: z.string().min(1),
        language: z.enum(["de", "en"]).default("de"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Basic chat is free (0 credits)
      // Deep analysis keywords trigger credit charge
      const deepAnalysisKeywords = ['analyse', 'analysis', 'strategie', 'strategy', 'audit', 'competitor', 'wettbewerb'];
      const isDeepAnalysis = deepAnalysisKeywords.some(keyword => 
        input.content.toLowerCase().includes(keyword)
      );
      
      if (isDeepAnalysis) {
        // Charge 3 credits for deep analysis
        const result = await CreditService.charge(
          ctx.user.id,
          'CHAT_DEEP_ANALYSIS',
          3,
          { sessionId: input.sessionId, query: input.content.substring(0, 100) }
        );
        
        if (!result.success) {
          throw new Error(input.language === "de"
            ? `Nicht genug Credits! Diese Analyse kostet 3 Credits. Aktuelles Guthaben: ${result.newBalance} Credits.`
            : `Not enough credits! This analysis costs 3 credits. Current balance: ${result.newBalance} credits.`);
        }
      }

      // Save user message
      await db.createChatMessage({
        sessionId: input.sessionId,
        role: "user",
        content: input.content,
      });

      // Note: Basic chat usage tracking removed (now credit-based)

      // Get session context
      const session = await db.getChatSessionById(input.sessionId);
      if (!session) throw new Error("Session not found");

      const workspace = await db.getWorkspaceById(session.workspaceId);
      const messages = await db.getChatMessagesBySessionId(input.sessionId);

      // Get user's credit balance for credit-aware responses
      const creditBalance = await CreditService.getBalance(ctx.user.id);
      const hasLowCredits = creditBalance < 20;
      const hasNoCredits = creditBalance === 0;

      // Build context for LLM
      const creditContext = input.language === "de"
        ? `\n\n**Credit-System:**\n- Der User hat aktuell ${creditBalance} Credits.\n${hasLowCredits ? "- WICHTIG: Credits werden knapp! Erwähne dies subtil und schlage vor, Credits aufzuladen.\n" : ""}${hasNoCredits ? "- KRITISCH: Keine Credits mehr! Der User kann keine kostenpflichtigen Analysen mehr durchführen.\n" : ""}${isDeepAnalysis ? "- Diese Anfrage hat 3 Credits gekostet (Deep Analysis).\n" : "- Einfache Chat-Nachrichten sind kostenlos.\n"}- Tiefe Analysen (Strategie, Audit, Wettbewerb) kosten 3 Credits.\n- Wenn der User nach teuren Analysen fragt und wenig Credits hat, schlage günstigere Alternativen vor.`
        : `\n\n**Credit System:**\n- User currently has ${creditBalance} credits.\n${hasLowCredits ? "- IMPORTANT: Credits running low! Mention this subtly and suggest topping up.\n" : ""}${hasNoCredits ? "- CRITICAL: No credits left! User cannot perform paid analyses.\n" : ""}${isDeepAnalysis ? "- This request cost 3 credits (Deep Analysis).\n" : "- Simple chat messages are free.\n"}- Deep analyses (strategy, audit, competitor) cost 3 credits.\n- If user requests expensive analyses with low credits, suggest cheaper alternatives.`;

      const systemPrompt = input.language === "de" 
        ? `Du bist Houston, der AIstronaut Marketing Coach - ein freundlicher, motivierender KI-Coach für KMU-Marketing. 
           Deine Aufgabe ist es, praktische, umsetzbare Ratschläge zu geben.
           
           Kontext zum Unternehmen:
           ${workspace?.industry ? `Branche: ${workspace.industry}` : ""}
           ${workspace?.companySize ? `Größe: ${workspace.companySize}` : ""}
           ${workspace?.targetAudience ? `Zielgruppe: ${workspace.targetAudience}` : ""}
           ${creditContext}
           
           Antworte in Du-Form, kurz und prägnant (max. 3-4 Absätze), nutze Bulletpoints.`
        : `You are Houston, the AIstronaut Marketing Coach - a friendly, motivating AI coach for SMB marketing.
           Your task is to provide practical, actionable advice.
           
           Company context:
           ${workspace?.industry ? `Industry: ${workspace.industry}` : ""}
           ${workspace?.companySize ? `Size: ${workspace.companySize}` : ""}
           ${workspace?.targetAudience ? `Target audience: ${workspace.targetAudience}` : ""}
           ${creditContext}
           
           Respond professionally, keep it concise (max. 3-4 paragraphs), use bullet points.`;

      const llmMessages = [
        { role: "system" as const, content: systemPrompt },
        ...messages.slice(-10).map(m => ({
          role: m.role === "user" ? ("user" as const) : ("assistant" as const),
          content: m.content,
        })),
        { role: "user" as const, content: input.content },
      ];

      // Get response from Manus 1.5
      const response = await invokeLLM({ messages: llmMessages });
      const coachResponse = (typeof response.choices[0]?.message?.content === "string" 
        ? response.choices[0]?.message?.content 
        : "Entschuldigung, ich konnte keine Antwort generieren.");

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
    .mutation(async ({ input }) => {
      await db.deleteChatSession(input.sessionId);
      return { success: true };
    }),

  // Send feedback on a message (thumbs up/down)
  sendFeedback: protectedProcedure
    .input(
      z.object({
        messageId: z.number(),
        feedback: z.enum(["positive", "negative"]),
      })
    )
    .mutation(async ({ input }) => {
      // In a real app, save feedback to database
      // For now, just return success
      console.log(`Feedback received for message ${input.messageId}: ${input.feedback}`);
      return { success: true };
    }),

  // Regenerate AI response
  regenerateResponse: protectedProcedure
    .input(
      z.object({
        sessionId: z.number(),
        messageId: z.number(), // The user message ID to regenerate response for
        language: z.enum(["de", "en"]).default("de"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Get the user message
      const messages = await db.getChatMessagesBySessionId(input.sessionId);
      const userMessage = messages.find(m => m.id === input.messageId);
      if (!userMessage || userMessage.role !== "user") {
        throw new Error("User message not found");
      }

      // Get session context
      const session = await db.getChatSessionById(input.sessionId);
      if (!session) throw new Error("Session not found");

      const workspace = await db.getWorkspaceById(session.workspaceId);

      // Build context for LLM
      const systemPrompt = input.language === "de" 
        ? `Du bist der AIstronaut Marketing Coach - ein freundlicher, motivierender KI-Coach für KMU-Marketing. 
           Deine Aufgabe ist es, praktische, umsetzbare Ratschläge zu geben.
           
           Kontext zum Unternehmen:
           ${workspace?.industry ? `Branche: ${workspace.industry}` : ""}
           ${workspace?.companySize ? `Größe: ${workspace.companySize}` : ""}
           ${workspace?.targetAudience ? `Zielgruppe: ${workspace.targetAudience}` : ""}
           
           Antworte in Du-Form, kurz und prägnant (max. 3-4 Absätze), nutze Bulletpoints.`
        : `You are the AIstronaut Marketing Coach - a friendly, motivating AI coach for SMB marketing.
           Your task is to provide practical, actionable advice.
           
           Company context:
           ${workspace?.industry ? `Industry: ${workspace.industry}` : ""}
           ${workspace?.companySize ? `Size: ${workspace.companySize}` : ""}
           ${workspace?.targetAudience ? `Target audience: ${workspace.targetAudience}` : ""}
           
           Respond professionally, keep it concise (max. 3-4 paragraphs), use bullet points.`;

      const llmMessages = [
        { role: "system" as const, content: systemPrompt },
        ...messages.slice(-10).filter(m => m.id < input.messageId).map(m => ({
          role: m.role === "user" ? ("user" as const) : ("assistant" as const),
          content: m.content,
        })),
        { role: "user" as const, content: userMessage.content },
      ];

      // Get new response from Manus 1.5
      const response = await invokeLLM({ messages: llmMessages });
      const coachResponse = (typeof response.choices[0]?.message?.content === "string" 
        ? response.choices[0]?.message?.content 
        : "Entschuldigung, ich konnte keine Antwort generieren.");

      // Save new coach response
      await db.createChatMessage({
        sessionId: input.sessionId,
        role: "coach",
        content: coachResponse,
      });

      return { content: coachResponse };
    }),
});
