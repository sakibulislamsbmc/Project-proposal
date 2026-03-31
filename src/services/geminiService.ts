import { GoogleGenAI, Type } from "@google/genai";
import { WebDevFormData, PackageProposal } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateProposals(formData: WebDevFormData): Promise<PackageProposal[]> {
  const prompt = `
    Analyze the following website development project details and provide three package proposals with pricing in Bangladeshi Taka (BDT).
    The goal is to offer the lowest possible cost while meeting the client's needs.
    
    Project Details:
    1. Project Name: ${formData.projectName}
    2. Client Name: ${formData.clientName}
    3. Contact Info: ${formData.contactInfo}
    4. Goal: ${formData.goal}
    5. Target Audience: ${formData.targetAudience}
    6. Style Preference: ${formData.stylePreference}
    7. Branding Guideline: ${formData.brandingGuideline}
    8. Content Types: ${formData.contentTypes}
    9. Section Count: ${formData.sectionCount}
    10. Admin Dashboard Needed: ${formData.adminDashboard}
    11. Special Features: ${formData.specialFeatures}
    12. Hosting Status: ${formData.hostingStatus}
    13. Management: ${formData.management}

    Provide exactly 3 packages: "Basic", "Standard", and "Premium".
    Each package should have:
    - name: string
    - price: number (in BDT)
    - features: string[]
    - description: string (briefly explaining why this package fits)
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            price: { type: Type.NUMBER },
            features: { type: Type.ARRAY, items: { type: Type.STRING } },
            description: { type: Type.STRING },
          },
          required: ["name", "price", "features", "description"],
        },
      },
    },
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("Failed to parse AI response", e);
    return [];
  }
}
