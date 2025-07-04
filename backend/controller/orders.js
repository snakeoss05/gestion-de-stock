import Order from "../models/Order.js";
import generateInvoicePDF from "../storage/generateInvoicePDF.js";
import express from "express";
import mongoose from "mongoose";
import Product from "../models/Product.js";
import fs from "fs";
import moment from "moment";
import { checkStockLevel } from "./Notification.js";
import path from "path";

// GET all orders
export const getAllOrders = async (req, res) => {
  const { page, limit, orderDate, status } = req.query;

  if (page < 1 || limit < 1) {
    return res.status(400).json({ error: "Invalid pagination parameters" });
  }
  const filter = {};
  let startDate;
  let endDate = moment().endOf("year");

  switch (orderDate) {
    case "today":
      startDate = moment().startOf("day");
      filter.createdAt = { $gte: startDate, $lte: endDate };
      break;
    case "this_week":
      startDate = moment().startOf("week");
      filter.createdAt = { $gte: startDate, $lte: endDate };
      break;
    case "this_month":
      startDate = moment().startOf("month");
      filter.createdAt = { $gte: startDate, $lte: endDate };
      break;
    case "all":
      startDate = moment().startOf("year");
      filter.createdAt = { $gte: startDate, $lte: endDate };
      break;
    default:
      startDate = moment().startOf("year");
      filter.createdAt = { $gte: startDate, $lte: endDate };
  }

  if (status) {
    filter.status = status;
  }
  try {
    const orders = await Order.find(filter)
      .populate({ path: "user", select: "name _id" })
      .populate("orderItems.product")
      .select(
        "totalPrice fullname status _id orderId orderItems userId isPaid paymentMethod paymentStatus  createdAt"
      )
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Order.countDocuments();
    return res.status(200).json({
      currentPage: parseInt(page, 10),
      totalPages: Math.ceil(total / limit),
      data: orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res
      .status(400)
      .json({ success: false, message: "Failed to fetch orders" });
  }
};

// POST a new order
export const createOrder = async (req, res) => {
  try {
    const order = await Order.create(req.body);
    const orderItems = order.orderItems;

    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock -= item.qty;
        await product.save();
        await checkStockLevel(product._id);
      }
    }

    return res.status(201).json({ success: true, data: order });
  } catch (error) {
    console.error("Error creating order:", error);
    return res
      .status(400)
      .json({ success: false, message: "Failed to create order" });
  }
};

// GET order by ID
export const getOrderById = async (req, res) => {
  const { page, limit } = req.query;

  if (page < 1 || limit < 1) {
    return res.status(400).json({ error: "Invalid pagination parameters" });
  }
  try {
    const order = await Order.find({ user: req.params.id })
      .select("totalPrice status _id orderId createdAt")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    const total = await Order.countDocuments({ user: req.params.id });
    return res.status(200).json({
      currentPage: parseInt(page, 10),
      totalPages: Math.ceil(total / limit),
      data: order,
    });
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    return res
      .status(400)
      .json({ success: false, message: "Failed to fetch order by ID" });
  }
};
export const getOrderByOderId = async (req, res) => {
  try {
    const order = await Order.find({ orderId: req.params.id }).populate(
      "user orderItems.product"
    );

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    return res.status(200).json({
      data: order,
    });
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    return res
      .status(400)
      .json({ success: false, message: "Failed to fetch order by ID" });
  }
};
export const getOrderProducts = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate({
        path: "orderItems.product",
        model: "Product",
        select: "productName discount colors image prices stock price",
      })
      .sort({ createdAt: -1 });

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    return res.status(200).json({
      data: order,
    });
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    return res
      .status(400)
      .json({ success: false, message: "Failed to fetch order by ID" });
  }
};

// Update order status and details
export const updateOrderStatus = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { status, paymentStatus, orderItems } = req.body;
    const order = await Order.findById(req.params.id).session(session);

    if (!order) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Handle stock updates when order is confirmed
    if (status === "confirmed" && order.status !== "confirmed") {
      // Verify all products have sufficient stock first
      for (const item of order.orderItems) {
        const product = await Product.findById(item.product).session(session);

        if (!product) {
          await session.abortTransaction();
          session.endSession();
          return res.status(400).json({
            success: false,
            message: `Product ${item.product} not found`,
          });
        }

        if (product.stock < item.qty) {
          await session.abortTransaction();
          session.endSession();
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for product ${product.name}`,
            productId: product._id,
            availableStock: product.stock,
            requested: item.qty,
          });
        }
      }

      // Update stock for all products
      const bulkOps = order.orderItems.map((item) => ({
        updateOne: {
          filter: { _id: item.product, stock: { $gte: item.qty } },
          update: { $inc: { stock: -item.qty } },
        },
      }));

      const result = await Product.bulkWrite(bulkOps, { session });
      if (result.modifiedCount !== order.orderItems.length) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          success: false,
          message: "Stock update failed for some items",
        });
      }
    }

    // Handle stock restoration if order is cancelled/refunded
    if (status === "cancelled" || status === "refunded") {
      const bulkRestoreOps = order.orderItems.map((item) => ({
        updateOne: {
          filter: { _id: item.product },
          update: { $inc: { stock: item.qty } },
        },
      }));

      await Product.bulkWrite(bulkRestoreOps, { session });
    }

    // Update order status if provided
    if (status) {
      order.status = status;
      if (status === "delivered") {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
      }
    }

    // Update payment status if provided
    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
      if (paymentStatus === "paid") {
        order.isPaid = true;
        order.paidAt = Date.now();
      } else if (paymentStatus === "refunded") {
        order.isPaid = false;
        order.paidAt = null;
      }
    }

    // Update order items if provided
    if (orderItems && Array.isArray(orderItems)) {
      order.orderItems = orderItems;
      const itemsPrice = order.orderItems.reduce(
        (acc, item) => acc + item.price * item.qty,
        0
      );
      order.totalPrice = itemsPrice + order.shippingPrice + order.tax;
    }

    await order.save({ session });
    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({ success: true, data: order });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error updating order:", error);
    return res.status(400).json({
      success: false,
      message: "Failed to update order",
      error: error.message,
    });
  }
};
// DELETE order by ID
export const deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.deleteOne({ _id: req.params.id });
    if (!deletedOrder.deletedCount) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    return res.status(200).json({ success: true, data: {} });
  } catch (error) {
    console.error("Error deleting order:", error);
    return res
      .status(400)
      .json({ success: false, message: "Failed to delete order" });
  }
};
export const generateInvoice = async (req, res) => {
  const orderId = req.params.id;

  if (!orderId) {
    return res.status(400).json({ error: "Order ID is required" });
  }

  try {
    const pdfPath = await generateInvoicePDF(orderId);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${path.basename(pdfPath)}`
    );
    fs.createReadStream(pdfPath).pipe(res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate invoice" });
  }
};

// Update order items
export const updateOrderItems = async (req, res) => {
  try {
    const { orderItems } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Update order items
    order.orderItems = orderItems;

    // Recalculate total price
    const itemsPrice = order.orderItems.reduce(
      (acc, item) => acc + item.price * item.qty,
      0
    );
    order.totalPrice = itemsPrice + order.shippingPrice + order.tax;

    await order.save();

    // Return updated order with populated product information
    const updatedOrder = await Order.findById(order._id)
      .populate({
        path: "orderItems.product",
        select: "name images price stock",
      })
      .populate("user", "name email");

    return res.status(200).json({ success: true, data: updatedOrder });
  } catch (error) {
    console.error("Error updating order items:", error);
    return res
      .status(400)
      .json({ success: false, message: "Failed to update order items" });
  }
};
