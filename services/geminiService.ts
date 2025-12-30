import { GoogleGenAI } from "@google/genai";

export const generateFestiveMessage = async (year: number): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.warn("API Key missing, returning fallback message.");
      return `Wishing you a spectacular and vibrant ${year}!`;
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a poetic and inspiring 10-word New Year's greeting for the year ${year}. Focus on themes of cosmic beauty, fireworks, and new beginnings.`,
      config: {
        temperature: 0.8,
      }
    });

    const text = response.text;
    return text?.trim() || `Welcome to ${year}: A year of endless possibilities.`;
  } catch (error) {
    console.error("Gemini Error:", error);
    return `Wishing you a spectacular and vibrant ${year}!`;
  }
};