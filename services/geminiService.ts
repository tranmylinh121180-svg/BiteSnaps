import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

export const analyzeFoodImage = async (base64Image: string): Promise<AnalysisResult> => {
  // Initialize AI instance here to ensure it uses the current environment context
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: cleanBase64,
            },
          },
          {
            text: "Analyze this food image for a mindful eating journal. Identify the food name (short), categories (select from: Comfort, Sweet, Savory, High-carb, Green/fresh, Protein-heavy, Snack, Drink), suggest a mood, determine the time context, and check specific attributes.",
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            foodName: { type: Type.STRING },
            category: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            moodSuggestion: { type: Type.STRING },
            timeContext: { type: Type.STRING },
            isHealthyLean: { type: Type.BOOLEAN, description: "Is it primarily green/fresh/vegetable based?" },
            isWater: { type: Type.BOOLEAN, description: "Is this just water?" }
          },
          required: ["foodName", "category", "moodSuggestion", "timeContext", "isHealthyLean", "isWater"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No text response from Gemini");

    return JSON.parse(text) as AnalysisResult;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    // Fallback for demo stability if API fails
    return {
      foodName: "Detected Meal",
      category: ["Savory"],
      moodSuggestion: "Nourishing",
      timeContext: "Daytime",
      isHealthyLean: false,
      isWater: false
    };
  }
};