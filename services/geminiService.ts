
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateFestiveMessage = async (year: number): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a poetic and inspiring 10-word New Year's greeting for the year ${year}. Focus on themes of cosmic beauty, fireworks, and new beginnings.`,
      config: {
        temperature: 0.8,
      }
    });

    // Use optional chaining to safely handle cases where response.text might be undefined (e.g., safety filter triggers)
    const text = response.text;
    return text?.trim() || `Welcome to ${year}: A year of endless possibilities.`;
  } catch (error) {
    console.error("Gemini Error:", error);
    return `Wishing you a spectacular and vibrant ${year}!`;
  }
};
