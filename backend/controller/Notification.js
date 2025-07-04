// controllers/notificationController.js
import Notification from "../models/Notification.js";
import Product from "../models/Product.js"; // Assuming you have a Product model

// Helper function to build filter query

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ isRead: false })
      .populate({
        path: "product",

        select: "productName  price stock",
      })
      .sort({ createdAt: -1 })
      .lean();

    return res.json(notifications);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching notifications", error: error.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json(notification);
  } catch (error) {
    res.status(500).json({
      message: "Error marking notification as read",
      error: error.message,
    });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { isRead: false },
      { $set: { isRead: true } }
    );

    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({
      message: "Error marking notifications as read",
      error: error.message,
    });
  }
};

export const checkStockLevel = async (productId) => {
  const product = await Product.findById(productId);
  if (!product) return null;

  if (product.stock === 0) {
    Notification.create({
      type: "out-of-stock",
      message: `${product.productName} is out of stock.`,
      product: product._id,
      priority: "high",
    });
  } else if (product.stock <= 5) {
    Notification.create({
      type: "low-stock",
      message: `${product.productName} has ${product.stock} left.`,
      product: product._id,
      priority: "medium",
    });
  }

  return null;
};
