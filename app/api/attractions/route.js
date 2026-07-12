import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { Attraction } from "@/lib/db/models";

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
}

// GET /api/attractions - List all attractions (with optional filters)
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;

    const query = { isActive: true };
    if (category) query.category = category;
    if (featured === "true") query.featured = true;

    const [attractions, total] = await Promise.all([
      Attraction.find(query).sort({ featured: -1, createdAt: -1 }).skip(skip).limit(limit).lean(),
      Attraction.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      attractions,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error("[GET /api/attractions]", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST /api/attractions - Create a new attraction (admin)
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    const attraction = new Attraction(body);
    await attraction.save();

    return NextResponse.json({ success: true, attraction }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/attractions]", err);
    if (err.code === 11000) {
      return NextResponse.json({ success: false, error: "Slug already exists. Use a unique title." }, { status: 409 });
    }
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
