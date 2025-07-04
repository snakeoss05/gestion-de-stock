import express from "express";
import {
  Login,
  Register,
  UpdateUser,
  getProfile,
  SendOtp,
  resetPassword,
  verifyOtp,
  getUsers,
  getUserNotVerified,
  UpdateUserWithId,
  UpdateUserWithAdmin,
} from "../controller/user.js";

import { upload } from "../storage/cloudinaryConfig.js";
import { verifyAdmin, verifyToken } from "../middleware/authMiddleware.js";
const router = express.Router();

// Update the file upload middleware configuration

router.post("/users", upload.single("profileImage"), Register);

router.get("/users", getUsers);
router.post("/auth/login", Login);
router.put(
  "/profile/update",
  verifyToken,
  upload.single("profileImage"),
  UpdateUser
);
router.put("/users/update/:id", verifyToken, verifyAdmin, UpdateUserWithAdmin);
router.get("/users/notverified", verifyToken, verifyAdmin, getUserNotVerified);
router.put("/admin/update/:id", verifyToken, verifyAdmin, UpdateUserWithId);
router.get("/profile/:id", getProfile);
router.post("/auth/send-otp", SendOtp);
router.put("/auth/reset-password", resetPassword);
router.post("/auth/verify-otp", verifyOtp);

export default router;
