
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Message, Sender, GeminiResponse, WidgetType } from '../types';

// IMPORTANT: In a real app, do not hardcode keys. We use process.env as required.
const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

const SYSTEM_INSTRUCTION = `
Du bist "Houston", ein KI-Marketing-Coach für kleine und mittlere Unternehmen (KMUs).
Deine Persönlichkeit: Freundlich, professionell, ermutigend, strategisch denkend (wie ein erfahrener CMO).
Sprache: Deutsch.

Deine Aufgabe ist es, den Nutzer durch einen Marketing-Prozess zu führen.
Du kannst nicht nur Text antworten, sondern auch UI-Widgets anfordern, um dem Nutzer zu helfen.

VERFÜGBARE WIDGETS:
1. BUSINESS_PROFILE: Wenn der Nutzer sein Geschäft beschreibt oder du Infos sammeln willst.
2. GOAL_SETUP: Wenn der Nutzer Ziele setzen möchte oder du Engpässe identifiziert hast.
3. CONTENT_PLAN: Wenn der Nutzer nach Content-Ideen oder einem Plan fragt.
4. KPI_REPORT: Wenn der Nutzer nach Zahlen, Erfolg oder Reporting fragt.
5. STRATEGY: Wenn du strategische Säulen (Pillars) vorschlägst (z.B. Reichweite, Vertrauen, Conversion).
6. PERSONA: Wenn du eine Zielgruppen-Persona definierst.
7. COMPETITOR_ANALYSIS: Wenn der Nutzer nach einer Wettbewerbsanalyse fragt.

FORMAT DER ANTWORT:
Du MUSST ein JSON-Objekt zurückgeben.
{
  "text": "Dein Antworttext hier (kann Markdown enthalten). Halte dich kurz und prägnant.",
  "widget": {
    "type": "BUSINESS_PROFILE" | "GOAL_SETUP" | "CONTENT_PLAN" | "KPI_REPORT" | "STRATEGY" | "PERSONA" | "COMPETITOR_ANALYSIS" | "NONE",
    "data": {} 
  }
}

Beispiel Strategy:
User: "Welche Strategie empfiehlst du?"
Response: {
  "text": "Basierend auf deinem Profil empfehle ich diese 3 Stoßrichtungen:",
  "widget": {
    "type": "STRATEGY",
    "data": {
       "pillars": [
         {"title": "Sichtbarkeit", "description": "SEO und Social Media Ausbau", "actionItems": ["Blog starten", "LinkedIn Profil optimieren"]},
         {"title": "Vertrauen", "description": "Social Proof aufbauen", "actionItems": ["Case Studies sammeln", "Webinare"]},
         {"title": "Conversion", "description": "Lead Magneten nutzen", "actionItems": ["E-Book erstellen", "Email Funnel"]}
       ]
    }
  }
}

Beispiel Competitor:
User: "Analysiere meinen Wettbewerb"
Response: {
  "text": "Ich habe mir deinen Hauptwettbewerber angesehen:",
  "widget": {
    "type": "COMPETITOR_ANALYSIS",
    "data": {
      "competitors": [
        {"id": "1", "name": "MusterFirma GmbH", "strength": "Starke Marke, hohes Budget", "weakness": "Langsame Innovation, schlechter Support"}
      ]
    }
  }
}
`;

const RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    text: { type: Type.STRING },
    widget: {
      type: Type.OBJECT,
      properties: {
        type: { type: Type.STRING, enum: ["BUSINESS_PROFILE", "GOAL_SETUP", "CONTENT_PLAN", "KPI_REPORT", "STRATEGY", "PERSONA", "COMPETITOR_ANALYSIS", "NONE"] },
        data: { type: Type.OBJECT, nullable: true }
      },
      nullable: true
    }
  },
  required: ["text"]
};

export const sendMessageToGemini = async (
  history: Message[],
  userMessage: string,
  contextData: any
): Promise<GeminiResponse> => {
  try {
    const modelId = "gemini-3-pro-preview";

    const contextString = `
    AKTUELLE DATEN (CONTEXT PANEL):
    Profile: ${JSON.stringify(contextData.profile)}
    Goals: ${JSON.stringify(contextData.goals)}
    Content: ${JSON.stringify(contextData.contentPlan)}
    Strategy: ${JSON.stringify(contextData.strategy)}
    Personas: ${JSON.stringify(contextData.personas)}
    Competitors: ${JSON.stringify(contextData.competitors)}
    `;

    const conversationHistory = history.map(h => `${h.sender === Sender.USER ? 'User' : 'Houston'}: ${h.text}`).join('\n');

    const prompt = `
    ${contextString}
    
    Verlauf:
    ${conversationHistory}
    
    User: ${userMessage}
    
    Antworte als JSON.
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA
      }
    });

    const responseText = response.text;
    if (!responseText) throw new Error("No response from AI");

    const parsedResponse = JSON.parse(responseText) as GeminiResponse;
    return parsedResponse;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      text: "Houston, wir haben ein Problem. Ich konnte leider keine Verbindung herstellen. Bitte versuche es noch einmal.",
      widget: { type: "NONE" }
    };
  }
};
