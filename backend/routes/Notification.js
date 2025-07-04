// routes/notificationRoutes.js
import express from "express";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
} from "../controller/Notification.js";
import { verifyAdmin, verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getNotifications);

// Mark a notification as read
router.put("/:id/read", markAsRead);

// Mark all notifications as read
router.put("/read-all", markAllAsRead);

// Create a new notification (typically used by automated systems)

export default router;
