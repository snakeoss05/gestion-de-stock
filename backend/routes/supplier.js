import express from "express";
import {
  createSupplier,
  getAllSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
} from "../controller/Supplier.js";
import { verifyAdmin, verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create supplier (Admin only)
router.post("/", verifyToken, verifyAdmin, createSupplier);

// Get all suppliers
router.get("/", verifyToken, getAllSuppliers);

// Get single supplier
router.get("/:id", getSupplierById);

// Update supplier (Admin only)
router.put("/:id", verifyAdmin, updateSupplier);

// Delete supplier (Admin only)
router.delete("/:id", verifyAdmin, deleteSupplier);

export default router;
