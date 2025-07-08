// routes/saleRoutes.js
import express from "express";
import {
  createSale,
  getAllSales,
  getDailySalesTotal,
} from "../controller/Sales.js";
const router = express.Router();

router.post("/", createSale);
router.get("/", getAllSales);
router.get("/daily-total", getDailySalesTotal);

export default router;
