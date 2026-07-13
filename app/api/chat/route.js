import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request) {
  try {
    const { message, history } = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ success: false, error: "AI is sleeping right now." }, { status: 500 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

    // Format history for Gemini
    const chatHistory = (history || []).map(msg => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "You are an enthusiastic and helpful travel assistant for Bungoma Tours, a premium travel agency in Western Kenya. Keep answers concise, polite, and directly address the user's travel questions. You can recommend visiting Mount Elgon, Nabuyole Falls, crying stone of Kakamega, and the diverse culture of Western Kenya." }],
        },
        {
          role: "model",
          parts: [{ text: "Understood! I'm ready to assist travelers with their Bungoma Tours queries!" }],
        },
        ...chatHistory
      ],
      generationConfig: {
        maxOutputTokens: 200,
      },
    });

    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    return NextResponse.json({ success: true, message: responseText });
  } catch (err) {
    console.error("[POST /api/chat Error]", err);
    return NextResponse.json({ success: false, error: "Failed to send message." }, { status: 500 });
  }
}
