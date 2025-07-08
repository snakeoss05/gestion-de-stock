import mongoose from "mongoose";

const InventoryLogSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    action: {
      type: String,
      enum: ["Added", "Removed", "Updated"],
      required: true,
    },
    quantity: { type: Number, required: true },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.InventoryLog ||
  mongoose.model("InventoryLog", InventoryLogSchema);
