import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Ensure you have GEMINI_API_KEY in your .env.local
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request) {
  try {
    const body = await request.json();
    const { days, groupType, budget, interests } = body;

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ success: false, error: "GEMINI_API_KEY is not configured" }, { status: 500 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

    const prompt = `You are an expert travel agent specializing in Western Kenya (specifically Bungoma, Kakamega, Mount Elgon, and surrounding areas).
Generate a realistic, logical, day-by-day itinerary based on the following preferences:
- Duration: ${days} days
- Group Type: ${groupType}
- Budget Level: ${budget}
- Interests: ${interests}

Return the itinerary STRICTLY as a JSON object with this exact structure (no markdown fences, no extra text):
{
  "title": "A catchy title for the trip",
  "summary": "A short 2-sentence summary of what to expect",
  "estimatedTotalCostKES": 15000,
  "days": [
    {
      "dayNumber": 1,
      "theme": "Arrival and Exploration",
      "activities": [
        {
          "time": "Morning",
          "title": "Hike Mount Elgon",
          "description": "Start early and explore the lower slopes of Mount Elgon National Park."
        }
      ]
    }
  ]
}

DO NOT wrap the response in \`\`\`json. Output raw JSON only.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();
    
    if (text.startsWith("\`\`\`json")) {
      text = text.replace(/^\`\`\`json/, "").replace(/\`\`\`$/, "").trim();
    } else if (text.startsWith("\`\`\`")) {
      text = text.replace(/^\`\`\`/, "").replace(/\`\`\`$/, "").trim();
    }

    const itineraryJson = JSON.parse(text);

    return NextResponse.json({ success: true, itinerary: itineraryJson });
  } catch (err) {
    console.error("[POST /api/ai-itinerary Error]", err);
    return NextResponse.json({ success: false, error: "Failed to generate itinerary. Please try again." }, { status: 500 });
  }
}
