import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { Booking } from "@/lib/db/models";

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
}

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = params; // This is the booking _id
    
    const booking = await Booking.findById(id).lean();
    if (!booking) {
      return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      paymentStatus: booking.paymentStatus,
      paymentReference: booking.paymentReference,
    });
  } catch (err) {
    console.error("[GET /api/bookings/[id]/status]", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
