import mongoose from "mongoose";

const tourSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    distance: { type: Number, required: true },
    photo: { type: String, required: true },
    desc: { type: String, required: true },
    price: { type: Number, required: true },
    maxGroupSize: { type: Number, required: true },
    reviews: [
      {
        // use Schema.Types.ObjectId
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// ✅ Add the index AFTER the schema is defined
//    Collation-aware index for case-insensitive lookups
tourSchema.index(
  { city: 1 },
  { collation: { locale: "en", strength: 2 } }
);

export default mongoose.model("Tour", tourSchema);
