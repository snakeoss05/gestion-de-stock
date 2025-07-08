import express from "express";
import {
  registerUser,
  loginUser,
  UpdateUser,
  getProfile,
  resetPassword,
  UpdateUserWithId,
  UpdateUserWithAdmin,
  getMe,
} from "../controller/user.js";

import { upload } from "../storage/cloudinaryConfig.js";
import { verifyAdmin, verifyToken } from "../middleware/authMiddleware.js";
const router = express.Router();

// Update the file upload middleware configuration

router.post("/auth/register", registerUser);

router.post("/auth/login", loginUser);
router.get("/auth/me", verifyToken, getMe);
router.put(
  "/profile/update",
  verifyToken,
  upload.single("profileImage"),
  UpdateUser
);
router.put("/users/update/:id", verifyToken, verifyAdmin, UpdateUserWithAdmin);
router.put("/admin/update/:id", verifyToken, verifyAdmin, UpdateUserWithId);
router.get("/profile/:id", getProfile);
router.put("/auth/reset-password", resetPassword);

export default router;
