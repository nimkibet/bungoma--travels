import { Schema } from "mongoose";

const bookingSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
    },
    attraction: {
      type: Schema.Types.ObjectId,
      ref: "Attraction",
      required: [true, "Attraction reference is required"],
    },
    travelDate: {
      type: Date,
      required: [true, "Travel date is required"],
    },
    numberOfGuests: {
      citizens: { type: Number, default: 0, min: 0 },
      residents: { type: Number, default: 0, min: 0 },
      foreigners: { type: Number, default: 0, min: 0 },
    },
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      min: 0,
    },
    currency: {
      type: String,
      default: "KES",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Refunded"],
      default: "Pending",
    },
    paymentMethod: {
      type: String,
      enum: ["MPesa", "Card", "Cash"],
      default: "MPesa",
    },
    mpesaTrackingId: {
      type: String,
      trim: true,
      sparse: true,
    },
    mpesaReceiptNumber: {
      type: String,
      trim: true,
      sparse: true,
    },
    mpesaPhone: {
      type: String,
      trim: true,
    },
    specialRequests: {
      type: String,
      maxlength: [500, "Special requests cannot exceed 500 characters"],
    },
    confirmationCode: {
      type: String,
      unique: true,
      sparse: true,
    },
    checkedIn: {
      type: Boolean,
      default: false,
    },
    cancelledAt: {
      type: Date,
    },
    cancellationReason: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate confirmation code before saving
bookingSchema.pre("save", function (next) {
  if (this.isNew && !this.confirmationCode) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.confirmationCode = `BT-${timestamp}-${random}`;
  }
  next();
});

bookingSchema.index({ user: 1 });
bookingSchema.index({ attraction: 1 });
bookingSchema.index({ paymentStatus: 1 });
bookingSchema.index({ travelDate: 1 });

export default bookingSchema;
