import express from "express";
import {
  addCategory,
  getCategories,
  deleteCategory,
  updateCategory,
} from "../controller/Category.js";
import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";
import { upload } from "../storage/cloudinaryConfig.js";

const router = express.Router();

// Public routes
router.get("/", getCategories);

// Protected routes (admin only)
router.post("/", verifyToken, verifyAdmin, upload.single("image"), addCategory);
router.put(
  "/:id",
  verifyToken,
  verifyAdmin,
  upload.single("image"),
  updateCategory
);
router.delete("/:id", verifyToken, verifyAdmin, deleteCategory);

export default router;
