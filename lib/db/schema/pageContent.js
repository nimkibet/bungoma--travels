import { Schema } from "mongoose";

const pageContentSchema = new Schema(
  {
    page: { type: String, required: true, unique: true }, // e.g. "home", "about", "contact"
    content: { type: Schema.Types.Mixed, default: {} }, // Arbitrary JSON for flexible CMS blocks
  },
  { timestamps: true }
);

export default pageContentSchema;
