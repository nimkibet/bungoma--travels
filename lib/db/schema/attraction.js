import { Schema } from "mongoose";

const attractionSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Attraction title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    location: {
      county: { type: String, required: true, trim: true },
      region: { type: String, trim: true },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [5000, "Description cannot exceed 5000 characters"],
    },
    shortDescription: {
      type: String,
      maxlength: [300, "Short description cannot exceed 300 characters"],
    },
    images: [
      {
        type: String,
        trim: true,
      },
    ],
    category: {
      type: String,
      enum: [
        "Nature",
        "Wildlife",
        "Cultural",
        "Adventure",
        "Beach",
        "Historical",
        "Religious",
      ],
      default: "Nature",
    },
    entryFee: {
      citizen: { type: Number, default: 0, min: 0 },
      resident: { type: Number, default: 0, min: 0 },
      foreigner: { type: Number, default: 0, min: 0 },
      currency: { type: String, default: "KES" },
    },
    openingHours: {
      open: { type: String, default: "06:00" },
      close: { type: String, default: "18:00" },
      daysOpen: { type: [String], default: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] },
    },
    facilities: [{ type: String }],
    featured: { type: Boolean, default: false },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    seo: {
      metaTitle: {
        type: String,
        maxlength: [70, "Meta title cannot exceed 70 characters"],
      },
      metaDescription: {
        type: String,
        maxlength: [160, "Meta description cannot exceed 160 characters"],
      },
      keywords: [{ type: String }],
    },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// Auto-generate slug from title before saving
attractionSchema.pre("save", function (next) {
  if (this.isModified("title") || this.isNew) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }
  // Auto-populate SEO from title/description if not set
  if (!this.seo.metaTitle) {
    this.seo.metaTitle = `${this.title} | Bungoma Tours`;
  }
  if (!this.seo.metaDescription && this.shortDescription) {
    this.seo.metaDescription = this.shortDescription;
  }
  next();
});

attractionSchema.index({ "location.county": 1 });
attractionSchema.index({ category: 1 });
attractionSchema.index({ featured: 1 });

export default attractionSchema;
