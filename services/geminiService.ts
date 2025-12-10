import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

// Helper to resize and compress images before sending to AI
const compressImage = (base64Str: string, maxWidth = 400, quality = 0.6): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Maintain aspect ratio while resizing
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // Force export as JPEG for consistency
          const optimized = canvas.toDataURL('image/jpeg', quality);
          resolve(optimized);
        } else {
          resolve(base64Str); // Fallback to original if context fails
        }
      } catch (e) {
        console.warn("Image compression failed, using original", e);
        resolve(base64Str);
      }
    };
    img.onerror = (e) => {
      console.warn("Image load failed", e);
      resolve(base64Str);
    }; // Fallback on error
  });
};

export const analyzeFoodImage = async (base64Image: string): Promise<AnalysisResult> => {
  // Check for API Key
  if (!process.env.API_KEY) {
    console.error("API_KEY is missing. Please check your Vercel deployment settings.");
    throw new Error("Missing API Key");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    // 1. Optimize image
    const optimizedBase64 = await compressImage(base64Image);
    
    // 2. Extract real MIME type and clean data
    // This is critical: If compression failed, we might have a PNG. We must tell Gemini the truth.
    const mimeMatch = optimizedBase64.match(/^data:(image\/[a-zA-Z+]+);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg"; // Default to jpeg if unknown
    const cleanBase64 = optimizedBase64.replace(/^data:image\/[a-zA-Z+]+;base64,/, "");

    // 3. Send to Gemini
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: cleanBase64,
            },
          },
          {
            text: "Analyze this food image for a mindful eating journal. Identify the food name (short), categories (select from: Comfort, Sweet, Savory, High-carb, Green/fresh, Protein-heavy, Snack, Drink), suggest a mood, determine the time context, and check specific attributes. Return JSON.",
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
    // Return null to indicate failure to the UI, rather than fake data
    // This allows the UI to show "Analysis unavailable" or handle it gracefully
    throw error; 
  }
};