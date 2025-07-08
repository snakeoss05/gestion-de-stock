import mongoose from "mongoose";
import { nanoid } from "nanoid";
const productSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
      default: () => nanoid(4),
      unique: true, // `index: { unique: true }` is redundant
    },
    code_barre: {
      type: String,
      required: true,
      unique: true,
      index: true, // ✅ index for fast exact/barcode search
      trim: true,
    },
    productName: {
      type: String,
      required: true,
      index: true, // ✅ index for autocomplete
      trim: true,
    },
    brandName: {
      type: String,
      required: true,
      trim: true,
    },
    currentStock: {
      type: Number,
      required: true,
      default: 0,
    },
    minStock: {
      type: Number,
      required: true,
      default: 0,
    },

    maxStock: {
      type: Number,
      required: true,
      default: 0,
    },
    prix_detail: {
      type: Number,
      required: true,
    },
    prix_gros: {
      type: Number,
      required: true,
    },
    prix_passager: {
      type: Number,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    location: {
      type: String,
      trim: true,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    cost: {
      type: Number,
      required: true,
    },
    tva: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      default: "",
    },
    discount: {
      type: Number,
      default: 0,
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
    },
  },
  { timestamps: true }
);

// Optional: full-text search index (useful for fuzzy searching later)
productSchema.index({ productName: "text" });

// Optional: index for autocomplete
productSchema.index({ productName: "text", category: "text" });

// Optional: index for fast exact/barcode search
productSchema.index({ code_barre: "text" });

export default mongoose.models.Product ||
  mongoose.model("Product", productSchema);
