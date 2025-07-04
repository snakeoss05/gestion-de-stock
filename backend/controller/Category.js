import Category from "../models/Category.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

export const uploadToCloudinary = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "categories", // specify the folder name in Cloudinary
      quality: "auto",
      crop: "auto",
      gravity: "auto",
      width: 500,
      height: 500,
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

export const addCategory = async (req, res) => {
  try {
    const { name, description, order } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const newName = name.toUpperCase();

    // Check if category with same slug exists
    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "A category with this name already exists",
      });
    }

    // Handle image upload if provided
    let imageUrl = "/fashion/category/default-category.jpg";
    if (req.file) {
      const result = await uploadToCloudinary(req.file);
      if (result.success) {
        imageUrl = result.imageUrl;
      } else {
        return res.status(400).json({
          success: false,
          message: "Failed to upload image",
        });
      }
    }

    const newCategory = await Category.create({
      name: newName,
      slug,
      description,
      image: imageUrl,
      order: order || 0,
    });

    res.status(201).json({
      success: true,
      data: newCategory,
      message: "Category created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error creating category",
    });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching categories",
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if category exists
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Delete the category
    await Category.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error deleting category",
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, order, isActive } = req.body;

    // Check if category exists
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Handle image upload if provided
    let updateData = { ...req.body };
    if (req.file) {
      const result = await uploadToCloudinary(req.file);
      if (result.success) {
        updateData.image = result.imageUrl;
      } else {
        return res.status(400).json({
          success: false,
          message: "Failed to upload image",
        });
      }
    }

    // Generate new slug if name is updated
    if (name && name !== category.name) {
      updateData.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      updateData.name = name.toUpperCase();
    }

    const updatedCategory = await Category.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: updatedCategory,
      message: "Category updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error updating category",
    });
  }
};
