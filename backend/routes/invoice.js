import express from "express";
import {
  generateInvoice,
  getAllInvoices,
  getInvoiceByOrderId,
} from "../controller/invoice.js";

const router = express.Router();

router.post("/generate-invoice", generateInvoice);
router.get("/invoices", getAllInvoices);
router.get("/invoice/:orderId", getInvoiceByOrderId);

export default router;
