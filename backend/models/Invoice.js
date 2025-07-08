import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  total: { type: Number, required: true },
});

const invoiceSchema = new mongoose.Schema(
  {

    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
      default: () => `INV-${Date.now()}`,
    },

    type: {
      type: String,
      enum: ["vente", "achat", "retour"],
      default: "vente",
    },
    customerName: { type: String, required: true },
    customerEmail: { type: String },
    customerAddress: { type: String },
    invoiceDate: { type: Date, required: true },
    dueDate: { type: Date },
    items: [itemSchema],
    subtotal: { type: Number, required: true },
    tax: { type: Number, required: true },
    total: { type: Number, required: true },
    notes: { type: String },
    status: {
      type: String,
      enum: ["en_attente", "payé", "en_retard", "annulé"],
      default: "en_attente",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Invoice", invoiceSchema);
