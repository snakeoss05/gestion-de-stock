// routes/productRoutes.js
import express from "express";
import {
  getAllProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProducts,
  getProductsByCategory,
  getFilterOptions,
  getProductSalesReport,
} from "../controller/product.js";
import { upload } from "../storage/cloudinaryConfig.js";
import { verifyAdmin, verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/products/search", searchProducts);
router.get("/products", getAllProducts);
router.get("/products/filter-options", getFilterOptions);
router.get("/products/category/:parentId", getProductsByCategory);
router.post("/products", verifyToken, verifyAdmin, upload.any(), createProduct);
router.get("/products/:id", getProductById);
router.put("/products/:id", verifyToken, verifyAdmin, upload.any(), updateProduct);

router.delete("/products/:id", verifyToken, verifyAdmin, deleteProduct);
router.get(
  "/product-sales-report",
  verifyToken,
  verifyAdmin,
  getProductSalesReport
);

export default router;
