import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: String,
    role: {
      type: String,
      default: "cashier",
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,

      unique: true,
    },

    phone: {
      type: String,

      unique: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
