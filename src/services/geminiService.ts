import { GoogleGenerativeAI } from "@google/generative-ai";
import { ChatMessage } from "../types";

const ENV_API_KEY = import.meta.env.VITE_API_KEY || import.meta.env.VITE_GEMINI_API_KEY;

const genAI = ENV_API_KEY ? new GoogleGenerativeAI(ENV_API_KEY) : null;

export const getApiKeyStatus = () => ({
  hasKey: Boolean(ENV_API_KEY),
  source: ENV_API_KEY ? "env" : "none",
});

const SYSTEM_INSTRUCTION_COACH = `
You are "Recovery Buddy", a compassionate, non-judgmental, and wise recovery coach and sponsor. 
Your goal is to support the user in their sobriety from alcohol and substances.
- Use empathetic, supportive language.
- Provide practical advice based on 12-step principles (AA/NA), CBT (Cognitive Behavioral Therapy), and mindfulness.
- If the user seems to be in immediate danger or self-harm crisis, gently suggest they call 988 or emergency services immediately, but continue to be supportive.
- Keep responses concise (under 150 words) unless asked for a detailed explanation.
- Do not be preachy. Be a peer.
`;

export const getAICoachResponse = async (history: ChatMessage[], newMessage: string): Promise<string> => {
  if (!genAI) return "AI is temporarily unavailable. Please try again later.";

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: SYSTEM_INSTRUCTION_COACH
    });
    
    const recentHistory = history.slice(-10).map(msg => ({
      role: msg.role === 'admin' ? 'model' : msg.role,
      parts: [{ text: msg.text }]
    }));

    const chat = model.startChat({
      history: recentHistory,
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage(newMessage);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return "I'm having trouble connecting right now. Please try again in a moment.";
  }
};

export const analyzeJournalEntry = async (entryText: string, mood: string): Promise<string> => {
  if (!genAI) return "AI reflections are temporarily unavailable.";

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      The user wrote this journal entry with a mood of "${mood}":
      "${entryText}"
      
      Please provide a brief, compassionate reflection (max 3 sentences). 
      Highlight a strength they showed or offer a gentle perspective shift. 
      End with a short encouraging affirmation.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Keep going. Writing is a powerful tool for healing.";
  }
};
