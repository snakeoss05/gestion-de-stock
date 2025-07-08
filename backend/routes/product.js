// routes/productRoutes.js
import express from "express";
import {
  getAllProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProducts,
  getProductBybarcode,
  getStockCounts,
} from "../controller/product.js";
import { upload } from "../storage/cloudinaryConfig.js";
import { verifyAdmin, verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/products/search", searchProducts);
router.get("/products", getAllProducts);
router.get("/products/stock", getStockCounts);
router.get("/products/barcode/:barcode", getProductBybarcode);
router.post("/products", upload.single("image"), createProduct);
router.get("/products/:id", getProductById);
router.put(
  "/products/:id",

  upload.single("image"),
  updateProduct
);

router.delete("/products/:id", deleteProduct);

export default router;
