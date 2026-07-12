import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { Booking } from "@/lib/db/models";

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();
    
    console.log("[M-PESA Callback Payload]", JSON.stringify(data, null, 2));

    const stkCallback = data?.Body?.stkCallback;
    if (!stkCallback) {
      return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 });
    }

    const { CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = stkCallback;

    // Find the booking by tracking ID
    const booking = await Booking.findOne({ mpesaTrackingId: CheckoutRequestID });
    if (!booking) {
      console.warn("[M-PESA Callback] Booking not found for CheckoutRequestID:", CheckoutRequestID);
      return NextResponse.json({ success: true, message: "Acknowledged but booking not found" });
    }

    if (ResultCode === 0) {
      // Success
      let mpesaReceiptNumber = "";
      if (CallbackMetadata?.Item) {
        const receiptItem = CallbackMetadata.Item.find(item => item.Name === "MpesaReceiptNumber");
        if (receiptItem) {
          mpesaReceiptNumber = receiptItem.Value;
        }
      }
      booking.paymentStatus = "Paid";
      booking.paymentReference = mpesaReceiptNumber;
      await booking.save();
      console.log(`[M-PESA Callback] Booking ${booking.confirmationCode} marked as Paid (${mpesaReceiptNumber})`);
    } else {
      // Failed or cancelled
      booking.paymentStatus = "Failed";
      booking.paymentReference = ResultDesc || "Failed";
      await booking.save();
      console.log(`[M-PESA Callback] Booking ${booking.confirmationCode} marked as Failed. Reason: ${ResultDesc}`);
    }

    // Safaricom expects a success response so they stop retrying
    return NextResponse.json({ "ResultCode": "0", "ResultDesc": "Success" }, { status: 200 });
  } catch (err) {
    console.error("[M-PESA Callback Error]", err);
    // Still return 200 so Safaricom doesn't retry unnecessarily unless it's a real network issue
    return NextResponse.json({ "ResultCode": "1", "ResultDesc": "Internal error" }, { status: 200 });
  }
}
