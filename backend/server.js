import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectToMongoDB from "./db.js";
import express from "express";
import mongoose from "mongoose";
import userRoutese from "./routes/user.js";
import addressesRoutes from "./routes/Addresses.js";
import orderRoutes from "./routes/order.js";
import productRoutes from "./routes/product.js";
import invoiceRoutes from "./routes/invoice.js";
import wishlistRoutes from "./routes/wishlist.js";
import CategoryRoutes from "./routes/Categories.js";
import notificationRoutes from "./routes/Notification.js";
import { fileURLToPath } from "url";
import path from "path";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

const corsOptions = {
  origin: ["https://superbadli.netlify.app", "http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.static(__dirname + "/public"));
app.use("/uploads", express.static("uploads"));
app.use("/invoices", express.static(path.join(__dirname, "invoices")));

const PORT = process.env.PORT || 8000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());

app.use("/api", userRoutese);
app.use("/api/addresses", addressesRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/invoice", invoiceRoutes);
app.use("/api", productRoutes);
app.use("/api/categories", CategoryRoutes);
app.use("/api/wishlist", wishlistRoutes);

app.use("*", (req, res) => res.status(404).json({ error: "ops not found" }));

app.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server is running on port ${PORT}`);
});
