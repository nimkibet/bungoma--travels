import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { Booking, Attraction } from "@/lib/db/models";
import { auth } from "@/lib/auth";

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
}

// GET /api/bookings - Get user's bookings
export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();

    const bookings = await Booking.find({ user: session.user.id })
      .populate("attraction", "title slug images location entryFee")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, bookings });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST /api/bookings - Create a booking
export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();

    const body = await request.json();
    const { attractionSlug, travelDate, numberOfGuests, mpesaPhone } = body;

    // Fetch attraction to compute total
    const attraction = await Attraction.findOne({ slug: attractionSlug, isActive: true });
    if (!attraction) {
      return NextResponse.json({ success: false, error: "Attraction not found" }, { status: 404 });
    }

    const { citizen = 0, resident = 0, foreigner = 0 } = numberOfGuests || {};
    const totalAmount =
      citizen * attraction.entryFee.citizen +
      resident * attraction.entryFee.resident +
      foreigner * attraction.entryFee.foreigner;

    const booking = new Booking({
      user: session.user.id,
      attraction: attraction._id,
      travelDate: new Date(travelDate),
      numberOfGuests: { citizens: citizen, residents: resident, foreigners: foreigner },
      totalAmount,
      mpesaPhone,
      paymentStatus: "Pending",
    });

    await booking.save();

    return NextResponse.json(
      {
        success: true,
        booking: {
          ...booking.toObject(),
          confirmationCode: booking.confirmationCode,
          totalAmount,
          currency: "KES",
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[POST /api/bookings]", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
