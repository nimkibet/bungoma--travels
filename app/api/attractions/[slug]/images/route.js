import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { Attraction } from "@/lib/db/models";
import { uploadToCloudinary, deleteFromCloudinary, extractPublicId } from "@/lib/cloudinary";

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
}

// POST /api/attractions/[slug]/images - Add image to attraction
export async function POST(request, { params }) {
  try {
    await connectDB();
    const { slug } = params;
    const body = await request.json();
    const { image } = body; // base64 or URL

    if (!image) {
      return NextResponse.json({ success: false, error: "Image is required" }, { status: 400 });
    }

    const result = await uploadToCloudinary(image, slug);

    const attraction = await Attraction.findOneAndUpdate(
      { slug },
      { $push: { images: result.secure_url } },
      { new: true }
    );

    if (!attraction) {
      return NextResponse.json({ success: false, error: "Attraction not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      imageUrl: result.secure_url,
      images: attraction.images,
    });
  } catch (err) {
    console.error("[POST /api/attractions/[slug]/images]", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// DELETE /api/attractions/[slug]/images - Remove image from attraction
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { slug } = params;
    const body = await request.json();
    const { imageUrl } = body;

    if (!imageUrl) {
      return NextResponse.json({ success: false, error: "imageUrl is required" }, { status: 400 });
    }

    // Delete from Cloudinary
    const publicId = extractPublicId(imageUrl);
    if (publicId) {
      await deleteFromCloudinary(publicId);
    }

    // Remove from MongoDB
    const attraction = await Attraction.findOneAndUpdate(
      { slug },
      { $pull: { images: imageUrl } },
      { new: true }
    );

    if (!attraction) {
      return NextResponse.json({ success: false, error: "Attraction not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, images: attraction.images });
  } catch (err) {
    console.error("[DELETE /api/attractions/[slug]/images]", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
