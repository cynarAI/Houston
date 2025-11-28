
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

VERFÜGBARE WIDGETS & LOGIC:

1. BUSINESS_PROFILE: Für Basisdaten.
2. GOAL_SETUP: Für Zieldefinition (SMART).
3. BOTTLENECK_ANALYSIS: Wenn du analysieren willst, wo das Problem liegt (Traffic, Conversion, Angebot).
   Data: { "bottlenecks": [{"id": "1", "category": "Traffic", "name": "Zu wenig Website-Besucher", "severity": "High"}] }
4. STRATEGY: Strategische Stoßrichtungen.
   Data: { "pillars": [{"title": "Content", "description": "...", "actionItems": ["Post 1", "Post 2"]}] }
5. ROADMAP: Wenn der Nutzer einen Zeitplan braucht (8-12 Wochen).
   Data: { "phases": [{"phase": 1, "title": "Fundament", "duration": "Woche 1-2", "tasks": ["Audit", "Setup"]}] }
6. CONTENT_PLAN: Content-Ideen.
7. LANDING_PAGE_STRUCTURE: Wenn es um Webseiten-Aufbau geht.
   Data: { "sections": [{"type": "Hero", "title": "Headline...", "description": "..."}] }
8. VALUE_PROPOSITION: Um Produkt-Markt-Fit zu klären.
   Data: { "canvas": { "customerProfile": { "jobs": [], "pains": [], "gains": [] }, "valueMap": { "products": [], "painRelievers": [], "gainCreators": [] } } }
9. PERSONA: Zielgruppen-Profil.
   Data: { "personas": [{"id": "1", "name": "Anna", "role": "CEO", "needs": "...", "painPoints": "..."}] }
10. COMPETITOR_ANALYSIS: Wettbewerb.
    Data: { "competitors": [{"id": "1", "name": "CompA", "strength": "...", "weakness": "..."}] }
11. KPI_REPORT: Reporting.

FORMAT DER ANTWORT:
Du MUSST ein JSON-Objekt zurückgeben.
{
  "text": "Dein Antworttext hier (kann Markdown enthalten). Halte dich kurz und prägnant.",
  "widget": {
    "type": "WIDGET_ENUM_NAME",
    "data": {} 
  }
}
`;

const RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    text: { type: Type.STRING },
    widget: {
      type: Type.OBJECT,
      nullable: true,
      properties: {
        type: {
          type: Type.STRING,
          enum: [
            "BUSINESS_PROFILE", "GOAL_SETUP", "CONTENT_PLAN", "KPI_REPORT",
            "STRATEGY", "PERSONA", "COMPETITOR_ANALYSIS", "BOTTLENECK_ANALYSIS",
            "ROADMAP", "LANDING_PAGE_STRUCTURE", "VALUE_PROPOSITION", "NONE"
          ]
        },
        data: {
          type: Type.OBJECT,
          nullable: true,
          properties: {
            bottlenecks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  category: { type: Type.STRING },
                  name: { type: Type.STRING },
                  severity: { type: Type.STRING },
                  selected: { type: Type.BOOLEAN, nullable: true }
                }
              }
            },
            phases: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  phase: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  tasks: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              }
            },
            sections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING }
                }
              }
            },
            canvas: {
              type: Type.OBJECT,
              properties: {
                customerProfile: {
                  type: Type.OBJECT,
                  properties: {
                    jobs: { type: Type.ARRAY, items: { type: Type.STRING } },
                    pains: { type: Type.ARRAY, items: { type: Type.STRING } },
                    gains: { type: Type.ARRAY, items: { type: Type.STRING } }
                  }
                },
                valueMap: {
                  type: Type.OBJECT,
                  properties: {
                    products: { type: Type.ARRAY, items: { type: Type.STRING } },
                    painRelievers: { type: Type.ARRAY, items: { type: Type.STRING } },
                    gainCreators: { type: Type.ARRAY, items: { type: Type.STRING } }
                  }
                }
              }
            },
            pillars: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  actionItems: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              }
            },
            personas: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  role: { type: Type.STRING },
                  needs: { type: Type.STRING },
                  painPoints: { type: Type.STRING }
                }
              }
            },
            competitors: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  strength: { type: Type.STRING },
                  weakness: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
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
    Bottlenecks: ${JSON.stringify(contextData.bottlenecks || [])}
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
