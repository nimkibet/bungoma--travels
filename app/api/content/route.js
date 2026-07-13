import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { PageContent } from "@/lib/db/models";

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "home";

    await connectDB();
    const doc = await PageContent.findOne({ page }).lean();

    return NextResponse.json({ success: true, content: doc?.content || {} });
  } catch (err) {
    console.error("[GET /api/content]", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { page, content } = await request.json();

    if (!page) {
      return NextResponse.json({ success: false, error: "Page is required" }, { status: 400 });
    }

    await connectDB();
    
    const doc = await PageContent.findOneAndUpdate(
      { page },
      { content },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, content: doc.content });
  } catch (err) {
    console.error("[POST /api/content]", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
