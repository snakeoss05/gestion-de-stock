import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

// Middleware to verify the JWT token
export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token; // Extract token from cookies

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!decoded) {
      return res
        .status(401)
        .json({ message: "Invalid token, authorization denied" });
    }

    req.user = { id: decoded.userId, role: decoded.role }; // Attach user data

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token, authorization denied" });
  }
};

// Admin Middleware
export const verifyAdmin = (req, res, next) => {
  if (req.user && req.user.role === "ADMIN") {
    next();
  } else {
    res.status(403).json({ message: "Access Denied! Admins only." });
  }
};
