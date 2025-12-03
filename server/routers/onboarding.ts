import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import * as db from "../db";
import { invokeLLM } from "../_core/llm";

export const onboardingRouter = router({
  // Scan website for business info
  scanWebsite: protectedProcedure
    .input(
      z.object({
        url: z.string().url(),
        language: z.enum(["de", "en"]).default("de"),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // 1. Fetch website content
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
        
        const response = await fetch(input.url, { 
          signal: controller.signal,
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; HoustonBot/1.0; +https://houston.aistronaut.io)"
          }
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`Failed to fetch website: ${response.statusText}`);
        }

        const html = await response.text();

        // 2. Simple cleanup (remove scripts, styles, comments) to save tokens
        const cleanText = html
          .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "")
          .replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gim, "")
          .replace(/<!--[\s\S]*?-->/g, "")
          .replace(/<[^>]+>/g, " ")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 15000); // Limit to ~15k chars to fit in context

        // 3. Analyze with LLM
        const systemPrompt = input.language === "de"
          ? `Du bist ein KI-Marketing-Analyst. Analysiere den folgenden Website-Text und extrahiere Business-Informationen.
             
             Antworte NUR mit einem JSON-Objekt:
             {
               "companyName": "Name des Unternehmens",
               "industry": "Eine der Kategorien: Coaching, Local Business, E-Commerce, Agency, SaaS, Creator (oder 'Other')",
               "customIndustry": "Falls 'Other', eine kurze Beschreibung (max 3 Wörter)",
               "companySize": "Geschätzt: 1-10, 11-50, 51-200, 201-1000, 1000+",
               "targetAudience": {
                 "demographics": "Kurze Beschreibung der Zielgruppe",
                 "painPoints": "Vermutete Pain Points"
               }
             }`
          : `You are an AI Marketing Analyst. Analyze the following website text and extract business information.
             
             Respond ONLY with a JSON object:
             {
               "companyName": "Name of the company",
               "industry": "One of: Coaching, Local Business, E-Commerce, Agency, SaaS, Creator (or 'Other')",
               "customIndustry": "If 'Other', a short description (max 3 words)",
               "companySize": "Estimated: 1-10, 11-50, 51-200, 201-1000, 1000+",
               "targetAudience": {
                 "demographics": "Short description of target audience",
                 "painPoints": "Suspected pain points"
               }
             }`;

        const llmResponse = await invokeLLM({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Website URL: ${input.url}\n\nContent:\n${cleanText}` },
          ],
          response_format: { type: "json_object" }
        });

        const content = typeof llmResponse.choices[0]?.message?.content === "string"
          ? llmResponse.choices[0]?.message?.content
          : "{}";

        return JSON.parse(content);

      } catch (error) {
        console.error("Website scan failed:", error);
        throw new Error("Could not analyze website. Please enter data manually.");
      }
    }),

  // Generate summary from onboarding answers
  generateSummary: protectedProcedure
    .input(
      z.object({
        industry: z.string(),
        companySize: z.string(),
        targetAudience: z.string(),
        products: z.string(),
        marketingChannels: z.string(),
        monthlyBudget: z.string(),
        challenges: z.string(),
        mainGoals: z.string(),
        language: z.enum(["de", "en"]).default("de"),
      })
    )
    .mutation(async ({ input }) => {
      const systemPrompt = input.language === "de"
        ? `Du bist der AIstronaut Marketing Coach. Fasse die folgenden Business-Informationen in 3-5 prägnanten Bulletpoints zusammen.
           Nutze eine freundliche Du-Form und konzentriere dich auf die wichtigsten Fakten.
           Format: Bulletpoints mit - am Anfang.`
        : `You are the AIstronaut Marketing Coach. Summarize the following business information in 3-5 concise bullet points.
           Use a friendly tone and focus on the most important facts.
           Format: Bullet points with - at the beginning.`;

      const userPrompt = input.language === "de"
        ? `Branche: ${input.industry}
Unternehmensgröße: ${input.companySize}
Zielgruppe: ${input.targetAudience}
Produkte/Dienstleistungen: ${input.products}
Marketingkanäle: ${input.marketingChannels}
Monatliches Budget: ${input.monthlyBudget}
Herausforderungen: ${input.challenges}
Hauptziele: ${input.mainGoals}`
        : `Industry: ${input.industry}
Company size: ${input.companySize}
Target audience: ${input.targetAudience}
Products/Services: ${input.products}
Marketing channels: ${input.marketingChannels}
Monthly budget: ${input.monthlyBudget}
Challenges: ${input.challenges}
Main goals: ${input.mainGoals}`;

      const response = await invokeLLM({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      });

      const summary = typeof response.choices[0]?.message?.content === "string"
        ? response.choices[0]?.message?.content
        : "Zusammenfassung konnte nicht generiert werden.";

      return { summary };
    }),

  // Generate SMART goals based on business info
  generateSmartGoals: protectedProcedure
    .input(
      z.object({
        industry: z.string(),
        companySize: z.string(),
        targetAudience: z.string(),
        products: z.string(),
        marketingChannels: z.string(),
        monthlyBudget: z.string(),
        challenges: z.string(),
        mainGoals: z.string(),
        language: z.enum(["de", "en"]).default("de"),
      })
    )
    .mutation(async ({ input }) => {
      const systemPrompt = input.language === "de"
        ? `Du bist der AIstronaut Marketing Coach. Generiere 3 SMART-Ziele (Specific, Measurable, Achievable, Relevant, Time-bound) basierend auf den Business-Informationen.
           
           Antworte NUR mit einem JSON-Array in folgendem Format (ohne zusätzlichen Text):
           [
             {
               "title": "Kurzer Titel des Ziels",
               "description": "Detaillierte Beschreibung",
               "specific": "Was genau soll erreicht werden?",
               "measurable": "Wie wird der Erfolg gemessen?",
               "achievable": "Warum ist das Ziel erreichbar?",
               "relevant": "Warum ist das Ziel wichtig?",
               "timeBound": "Bis wann soll es erreicht werden?"
             }
           ]`
        : `You are the AIstronaut Marketing Coach. Generate 3 SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound) based on the business information.
           
           Respond ONLY with a JSON array in the following format (without additional text):
           [
             {
               "title": "Short goal title",
               "description": "Detailed description",
               "specific": "What exactly should be achieved?",
               "measurable": "How will success be measured?",
               "achievable": "Why is this goal achievable?",
               "relevant": "Why is this goal important?",
               "timeBound": "By when should it be achieved?"
             }
           ]`;

      const userPrompt = input.language === "de"
        ? `Branche: ${input.industry}
Unternehmensgröße: ${input.companySize}
Zielgruppe: ${input.targetAudience}
Produkte/Dienstleistungen: ${input.products}
Marketingkanäle: ${input.marketingChannels}
Monatliches Budget: ${input.monthlyBudget}
Herausforderungen: ${input.challenges}
Hauptziele: ${input.mainGoals}`
        : `Industry: ${input.industry}
Company size: ${input.companySize}
Target audience: ${input.targetAudience}
Products/Services: ${input.products}
Marketing channels: ${input.marketingChannels}
Monthly budget: ${input.monthlyBudget}
Challenges: ${input.challenges}
Main goals: ${input.mainGoals}`;

      const response = await invokeLLM({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "smart_goals",
            strict: true,
            schema: {
              type: "object",
              properties: {
                goals: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: { type: "string" },
                      description: { type: "string" },
                      specific: { type: "string" },
                      measurable: { type: "string" },
                      achievable: { type: "string" },
                      relevant: { type: "string" },
                      timeBound: { type: "string" },
                    },
                    required: ["title", "description", "specific", "measurable", "achievable", "relevant", "timeBound"],
                    additionalProperties: false,
                  },
                },
              },
              required: ["goals"],
              additionalProperties: false,
            },
          },
        },
      });

      const content = typeof response.choices[0]?.message?.content === "string"
        ? response.choices[0]?.message?.content
        : "{}";

      let goals;
      try {
        const parsed = JSON.parse(content);
        goals = parsed.goals || [];
      } catch (error) {
        console.error("Failed to parse SMART goals:", error);
        goals = [];
      }

      return { goals };
    }),

  /**
   * Get user-level onboarding status
   */
  getUserOnboardingStatus: protectedProcedure.query(async ({ ctx }) => {
    const data = await db.getOnboardingDataByUserId(ctx.user.id);
    return {
      completed: data?.completed === 1,
      data: data || null,
    };
  }),

  /**
   * Save user-level onboarding data (upsert)
   */
  saveUserOnboardingData: protectedProcedure
    .input(
      z.object({
        // Step 1: Company Info
        companyName: z.string().optional(),
        industry: z.string().optional(),
        companySize: z.enum(["1-10", "11-50", "51-200", "201-1000", "1000+"]).optional(),
        website: z.string().optional(),
        // Step 2: Marketing Goals
        primaryGoal: z.enum(["brand_awareness", "lead_generation", "sales_conversion", "customer_retention", "market_expansion"]).optional(),
        secondaryGoals: z.array(z.string()).optional(),
        monthlyBudget: z.enum(["<1000", "1000-5000", "5000-10000", "10000-50000", "50000+"]).optional(),
        // Step 3: Target Audience
        targetAudience: z.object({
          demographics: z.string().optional(),
          painPoints: z.string().optional(),
          channels: z.array(z.string()).optional(),
        }).optional(),
        currentChallenges: z.array(z.string()).optional(),
        // Completion flag
        completed: z.boolean().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const existing = await db.getOnboardingDataByUserId(ctx.user.id);

      const data = {
        userId: ctx.user.id,
        companyName: input.companyName || existing?.companyName || null,
        industry: input.industry || existing?.industry || null,
        companySize: input.companySize || existing?.companySize || null,
        website: input.website || existing?.website || null,
        primaryGoal: input.primaryGoal || existing?.primaryGoal || null,
        secondaryGoals: input.secondaryGoals 
          ? JSON.stringify(input.secondaryGoals) 
          : existing?.secondaryGoals || null,
        monthlyBudget: input.monthlyBudget || existing?.monthlyBudget || null,
        targetAudience: input.targetAudience 
          ? JSON.stringify(input.targetAudience) 
          : existing?.targetAudience || null,
        currentChallenges: input.currentChallenges 
          ? JSON.stringify(input.currentChallenges) 
          : existing?.currentChallenges || null,
        completed: input.completed ? 1 : (existing?.completed || 0),
        completedAt: input.completed ? new Date() : existing?.completedAt || null,
      };

      if (existing) {
        await db.updateOnboardingData(existing.id, data);
      } else {
        await db.createOnboardingData(data);
      }

      return { success: true };
    }),

  /**
   * Skip user-level onboarding
   */
  skipUserOnboarding: protectedProcedure.mutation(async ({ ctx }) => {
    const existing = await db.getOnboardingDataByUserId(ctx.user.id);

    if (existing) {
      await db.updateOnboardingData(existing.id, {
        completed: 1,
        completedAt: new Date(),
      });
    } else {
      await db.createOnboardingData({
        userId: ctx.user.id,
        completed: 1,
        completedAt: new Date(),
      });
    }

    return { success: true };
  }),

  // Complete onboarding and save workspace data
  completeOnboarding: protectedProcedure
    .input(
      z.object({
        workspaceId: z.number(),
        industry: z.string(),
        companySize: z.string(),
        targetAudience: z.string(),
        products: z.string(),
        marketingChannels: z.string(),
        monthlyBudget: z.string(),
        challenges: z.string(),
        goals: z.array(
          z.object({
            title: z.string(),
            description: z.string(),
            specific: z.string(),
            measurable: z.string(),
            achievable: z.string(),
            relevant: z.string(),
            timeBound: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      // Update workspace with onboarding data
      await db.updateWorkspace(input.workspaceId, {
        industry: input.industry,
        companySize: input.companySize,
        targetAudience: input.targetAudience,
        products: input.products,
        marketingChannels: input.marketingChannels,
        monthlyBudget: input.monthlyBudget,
        challenges: input.challenges,
        onboardingCompleted: 1,
      });

      // Create goals
      for (const goal of input.goals) {
        await db.createGoal({
          workspaceId: input.workspaceId,
          ...goal,
        });
      }

      return { success: true };
    }),
});
