import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import mongoose from "mongoose";
import { Attraction } from "@/lib/db/models";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

async function getAttractionsList() {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
    }
    const attractions = await Attraction.find({ isActive: true }).select('title category').lean();
    return attractions.map(a => `${a.title} (${a.category})`).join(", ");
  } catch (err) {
    console.error("DB Error in chat:", err);
    return "Mount Elgon, Nabuyole Falls, Crying Stone of Kakamega";
  }
}

export async function POST(request) {
  try {
    const { message, history } = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ success: false, error: "AI is sleeping right now." }, { status: 500 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });
    const attractionsStr = await getAttractionsList();

    // Format history for Gemini
    const chatHistory = (history || []).map(msg => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: `You are an enthusiastic and helpful travel assistant for Bungoma Tours, a premium travel agency in Western Kenya. Keep answers concise, polite, and directly address the user's travel questions. Our actual available attractions are: ${attractionsStr}. Do not invent or hallucinate other tours, only recommend what we actually have.` }],
        },
        {
          role: "model",
          parts: [{ text: "Understood! I'm ready to assist travelers with their Bungoma Tours queries!" }],
        },
        ...chatHistory
      ]
    });

    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    return NextResponse.json({ success: true, message: responseText });
  } catch (err) {
    console.error("[POST /api/chat Error]", err);
    return NextResponse.json({ success: false, error: "Failed to send message." }, { status: 500 });
  }
}
