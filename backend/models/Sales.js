// models/Sale.js
import mongoose from "mongoose";

const saleSchema = new mongoose.Schema(
  {
    saleDate: {
      type: Date,
      default: Date.now,
    },
    cashierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the user/cashier who made the sale
      required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        productName: String,
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
        total: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "mobile", "mixed"],
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    customer: {
      name: String,
      phone: String,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Sale || mongoose.model("Sale", saleSchema);
