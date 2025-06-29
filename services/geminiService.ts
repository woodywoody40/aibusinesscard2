import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { BusinessCard } from '../types.ts';

const PROMPT = `
You are an expert business card scanner. Analyze the provided image of a business card.
1. Extract the following information:
   - name (the person's full name, can be in Chinese or English)
   - phone (the primary phone number)
   - email (the email address)
   - company (the company name)
   - title (the job title)
   - address (the full company address)
   - website (the company website URL)
   - social (a relevant social media URL, like LinkedIn)
2. Analyze the company name and business details to classify it into a general industry category. **Use Chinese for the industry category** (e.g., 科技業, 金融業, 醫療保健, 零售業, 餐飲業, 行銷業, 房地產業, etc.).
3. Detect if there is a portrait photo of a person on the card.
   - If a photo is found, provide its bounding box with normalized coordinates (from 0 to 1 for x, y, width, height, where (x,y) is the top-left corner).

Return the result as a single, minified JSON object.
The JSON must have these exact keys: "name", "phone", "email", "company", "title", "address", "website", "social", "industry", "photoBoundingBox".
If a field is not found, its value should be an empty string "".
The "photoBoundingBox" key should have an object with "x", "y", "width", "height" as keys, or be null if no photo is found.

Example response with photo: {"name":"Jane Doe","phone":"+1-555-987-6543","email":"jane@corp.com","company":"Corp Inc.","title":"CEO","address":"123 Innovation Dr, Tech City","website":"corp.com","social":"linkedin.com/in/janedoe","industry":"科技業","photoBoundingBox":{"x":0.05,"y":0.1,"width":0.25,"height":0.4}}
Example response without photo: {"name":"John Smith","phone":"555-111-2222","email":"smith@work.net","company":"Work Net LLC","title":"Developer","address":"","website":"","social":"","industry":"科技業","photoBoundingBox":null}
`;

interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type ExtractedData = Omit<BusinessCard, 'id' | 'image' | 'createdAt'> & {
  photoBoundingBox: BoundingBox | null;
};

// Cache the client instance.
let aiClient: GoogleGenAI | null = null;
let lastUsedApiKey: string | null = null;

function getAiClient(apiKey: string): GoogleGenAI {
  if (aiClient && lastUsedApiKey === apiKey) {
    return aiClient;
  }
  aiClient = new GoogleGenAI({ apiKey });
  lastUsedApiKey = apiKey;
  return aiClient;
}


export async function extractInfoFromImage(base64Image: string, apiKey: string): Promise<ExtractedData> {
  if (!apiKey) {
    throw new Error("API Key is not configured. Please set it up in the settings.");
  }
  
  const ai = getAiClient(apiKey);
  
  const imagePart = {
    inlineData: {
      mimeType: 'image/jpeg',
      data: base64Image,
    },
  };

  const textPart = {
    text: PROMPT,
  };

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-04-17',
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
      },
    });

    let jsonStr = response.text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }
    
    const parsedData = JSON.parse(jsonStr);

    return {
      name: parsedData.name || '',
      phone: parsedData.phone || '',
      email: parsedData.email || '',
      company: parsedData.company || '',
      title: parsedData.title || '',
      address: parsedData.address || '',
      website: parsedData.website || '',
      social: parsedData.social || '',
      industry: parsedData.industry || '一般',
      photoBoundingBox: parsedData.photoBoundingBox || null,
    };
  } catch (error) {
    console.error("Error extracting info from image:", error);
    
    let friendlyErrorMessage = "Failed to analyze the business card. The image might be unclear or the format is not supported.";
    
    if (error instanceof Error) {
      const lowerCaseError = error.message.toLowerCase();
      if (lowerCaseError.includes("api key") || lowerCaseError.includes("permission denied")) {
        friendlyErrorMessage = "AI analysis failed due to an invalid API Key. Please check the key you provided and try again.";
      } else if (lowerCaseError.includes("quota")) {
        friendlyErrorMessage = "AI analysis failed because the API quota has been exceeded. Please check your Google Cloud project quotas.";
      } else if (lowerCaseError.includes("fetch") || lowerCaseError.includes("network")) {
        friendlyErrorMessage = "A network error occurred while contacting the AI service. Please check your internet connection.";
      }
    }
    
    throw new Error(friendlyErrorMessage);
  }
}