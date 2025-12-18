
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export async function appraiseImage(imageBuffer: string, name: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          parts: [
            { text: `Appraise this digital image named "${name}" for a high-tech NFT marketplace. Provide a professional, concise market analysis (2-3 sentences) explaining its visual appeal and estimated rarity score (1-100). Output in professional financial tone.` },
            {
              inlineData: {
                mimeType: 'image/png',
                data: imageBuffer.split(',')[1],
              },
            },
          ],
        },
      ],
    });
    return response.text || "Appraisal service currently unavailable.";
  } catch (error) {
    console.error("Gemini Appraisal Error:", error);
    return "AI Appraisal failed to generate. Manual review recommended.";
  }
}

export async function generateMetadata(imageBuffer: string): Promise<{ name: string; description: string }> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          parts: [
            { text: "Analyze this image and provide a professional title and a short description suitable for an art gallery. Format as JSON with keys 'name' and 'description'." },
            {
              inlineData: {
                mimeType: 'image/png',
                data: imageBuffer.split(',')[1],
              },
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json"
      }
    });
    return JSON.parse(response.text || '{"name": "Untitled Art", "description": "No description available."}');
  } catch (error) {
    return { name: "New Acquisition", description: "A unique digital asset uploaded to the Etheron platform." };
  }
}
