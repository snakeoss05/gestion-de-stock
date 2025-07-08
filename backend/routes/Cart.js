// routes/cartRoutes.js
import express from "express";
import {
  addOrUpdateCartItem,
  removeCartItem,
  getCart,
  checkoutCart,
} from "../controller/Cart.js";

const router = express.Router();

router.post("/add", addOrUpdateCartItem);
router.post("/remove", removeCartItem);
router.get("/:userId", getCart);
router.post("/checkout", checkoutCart);

export default router;
