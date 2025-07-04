import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up multer for local file upload with file size limit
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// Function to upload file to Cloudinary
const uploadToCloudinary = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "users", // specify the folder name in Cloudinary
    });

    // Delete the temporary file after upload
    fs.unlinkSync(file.path);

    return {
      success: true,
      imageUrl: result.secure_url,
    };
  } catch (error) {
    console.error("Error uploading image:", error);
    // Try to delete the temporary file if it exists
    if (file && file.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    return { success: false, error: "Image upload failed" };
  }
};

export { upload, uploadToCloudinary };
