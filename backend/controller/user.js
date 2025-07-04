import User from "../models/User.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendMail } from "../controller/mailerSender.js";
import mongoose from "mongoose";

import { uploadToCloudinary } from "../storage/cloudinaryConfig.js";

export async function Login(req, res) {
  const { email, password } = req.body;

  const secretOrPrivateKey = process.env.ACCESS_TOKEN_SECRET;

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email: email }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "User not registered." });
    }

    if (!user.password) {
      return res.status(500).json({ message: "User password is not defined." });
    }

    const isPasswordMatch = await user.matchPassword(password);

    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const tokenData = {
      userId: user._id,
      role: user.role,
    };
    const token = jwt.sign(tokenData, secretOrPrivateKey, { expiresIn: "1d" });
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;
    return res.status(200).json({
      user: userWithoutPassword,
      token: token,
      message: "Login Successful",
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Bad Request: " + error.message });
  }
}
export async function Register(req, res) {
  const {
    name,
    email,
    password,
    role,
    companyName,
    phone,
    adresse,
    ville,
    codePostal,
    numberTva,
  } = req.body;

  const secretOrPrivateKey = process.env.ACCESS_TOKEN_SECRET;

  try {
    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: status,
        message: "Name, email, and password are required",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Handle file upload if present
    let uploadedfile = null;
    if (req.file) {
      try {
        const uploadResult = await uploadToCloudinary(req.file);
        if (!uploadResult.success) {
          return res.status(400).json({
            success: false,
            message: "Failed to upload document",
          });
        }
        uploadedfile = uploadResult.imageUrl;
      } catch (error) {
        console.error("Error uploading file:", error);
        return res.status(400).json({
          success: false,
          message: "Error uploading document",
        });
      }
    }

    // Create new user
    const newUser = new User({
      name,
      email,
      password,
      role,
      numberTva,
      companyName,
      address: {
        adresse,
        ville,
        codePostal,
        phone,
      },
      ConfirmationFile: uploadedfile,
    });

    // Save user to database
    const savedUser = await newUser.save();

    // Generate JWT token
    const tokenData = {
      userId: savedUser._id,
      role: savedUser.role,
    };
    const token = jwt.sign(tokenData, secretOrPrivateKey, {
      expiresIn: "1d",
    });

    // Return success response
    return res.status(201).json({
      success: true,
      user: savedUser,
      token: token,
      message: "Registration successful",
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred during registration",
      error: error.message,
    });
  }
}

export async function UpdateUser(req, res) {
  const userId = req.user._id;

  try {
    const results = await User.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(userId) },
      { $set: req.body },
      { new: true }
    );
    return res
      .status(200)
      .json({ message: "success updated", results: results });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}
export async function UpdateUserWithAdmin(req, res) {
  const userId = req.params;

  try {
    const results = await User.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(userId) },
      { $set: req.body },
      { new: true }
    );
    return res
      .status(200)
      .json({ message: "success updated", results: results });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}
export async function UpdateUserWithId(req, res) {
  const userId = req.params;

  try {
    const results = await User.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(userId) },
      { isVerified: true },
      { new: true }
    );
    return res
      .status(200)
      .json({ message: "success updated", results: results });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}
export async function getProfile(req, res) {
  const id = req.params;
  try {
    const results = await User.findOne({
      _id: new mongoose.Types.ObjectId(id),
    }).select("-password");
    return res.status(200).json({ results: results });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

export async function verifyOtp(req, res) {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user || user.resetOtp !== otp || Date.now() > user.otpExpires) {
      throw new Error("Invalid or expired OTP");
    }
    return res.status(200).json({ success: true, message: "OTP verified" });
  } catch (err) {
    return res.status(400).json({ message: "Bad Request: " + error.message });
  }

  // OTP is valid, allow the user to reset their password
}
export async function resetPassword(req, res) {
  const { email, newPassword } = req.body;

  const user = await User.findOne({ email });
  user.password = await bcryptjs.hash(newPassword, 10);
  user.resetOtp = undefined;
  user.otpExpires = undefined;
  await user.save();
  console.log("Password reset successful");
}
export async function getUsers(req, res) {
  const {
    page = 1,
    limit = 10,
    search,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);

  if (pageNum < 1 || limitNum < 1) {
    return res.status(400).json({ error: "Invalid pagination parameters" });
  }

  const sortOptions = { [sortBy]: sortOrder === "asc" ? 1 : -1 };
  let filter = {};

  if (search) {
    const searchRegex = { $regex: search, $options: "i" };
    filter = {
      $or: [
        { name: searchRegex },
        { email: searchRegex },
        { numberTva: searchRegex },
        { companyName: searchRegex },
      ],
    };
  }

  try {
    const results = await User.find(filter)
      .sort(sortOptions)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    const totalUsers = await User.countDocuments(filter);
    const totalPages = Math.ceil(totalUsers / limitNum);

    return res.status(200).json({
      results,
      totalUsers,
      totalPages,
      currentPage: pageNum,
      limit: limitNum,
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}
export async function getUserNotVerified(req, res) {
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
    status,
  } = req.query;
  try {
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const sortOptions = { [sortBy]: sortOrder === "asc" ? 1 : -1 };
    const results = await User.find({ isVerified: status })
      .sort(sortOptions)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);
    const totalUsers = await User.countDocuments({ isVerified: status });
    const totalPages = Math.ceil(totalUsers / limitNum);

    return res.status(200).json({
      results,
      totalUsers,
      totalPages,
      currentPage: pageNum,
      limit: limitNum,
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}
export async function SendOtp(req, res) {
  const { email } = req.body;
  try {
    const results = await sendMail(email);
    return res.status(200).json({ results: results });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}
