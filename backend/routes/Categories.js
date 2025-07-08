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
router.post("/", upload.single("image"), addCategory);
router.put(
  "/:id",

  upload.single("image"),
  updateCategory
);
router.delete("/:id", deleteCategory);

export default router;
