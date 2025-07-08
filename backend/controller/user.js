import User from "../models/User.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendMail } from "../controller/mailerSender.js";
import mongoose from "mongoose";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "30d",
  });
};
// Register User
export const registerUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    const hashedPassword = await bcryptjs.hash(password, 10);
    const user = await User.create({
      username,
      password: hashedPassword,
      role,
    });

    res.status(201).json({ message: "User created", userId: user._id });
  } catch (error) {
    res.status(500).json({ message: "Register failed", error });
  }
};

// Login User
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (user && (await bcryptjs.compare(password, user.password))) {
      res.json({
        message: "Login successful",
        user: user,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// List all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to get users", error });
  }
};

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
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
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

export async function resetPassword(req, res) {
  const { email, newPassword } = req.body;

  const user = await User.findOne({ email });
  user.password = await bcryptjs.hash(newPassword, 10);
  user.resetOtp = undefined;
  user.otpExpires = undefined;
  await user.save();
  console.log("Password reset successful");
}
