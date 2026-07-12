import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { Attraction } from "@/lib/db/models";

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
}

// GET /api/attractions/[slug]
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { slug } = params;

    const attraction = await Attraction.findOne({ slug, isActive: true }).lean();
    if (!attraction) {
      return NextResponse.json({ success: false, error: "Attraction not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, attraction });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// PATCH /api/attractions/[slug] - Update attraction
export async function PATCH(request, { params }) {
  try {
    await connectDB();
    const { slug } = params;
    const body = await request.json();

    const attraction = await Attraction.findOneAndUpdate(
      { slug },
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!attraction) {
      return NextResponse.json({ success: false, error: "Attraction not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, attraction });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// DELETE /api/attractions/[slug]
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { slug } = params;

    const attraction = await Attraction.findOneAndUpdate(
      { slug },
      { $set: { isActive: false } },
      { new: true }
    );

    if (!attraction) {
      return NextResponse.json({ success: false, error: "Attraction not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Attraction deactivated" });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
