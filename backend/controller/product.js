import Product from "../models/Product.js";
import Order from "../models/Order.js"; // Adjust the path as necessary for your product";
import Notification from "../models/Notification.js";
import Category from "../models/Category.js";
import { v2 as cloudinary } from "cloudinary";
// Upload Product Image to Cloudinary

export const uploadProductImage = async (path) => {
  try {
    const result = await cloudinary.uploader.upload(path, {
      folder: "products", // specify the folder name in Cloudinary
      quality: "auto",
      crop: "auto",
      gravity: "auto",
      width: 500,
      height: 500,
    });

    return {
      success: true,
      imageUrl: result.secure_url,
    };
  } catch (error) {
    console.error("Error uploading image:", error);
    return { success: false, error: "Image upload failed" };
  }
};

// Create a new Product
export const createProduct = async (req, res) => {
  try {
    const {
      productName,
      brandName,
      category,
      prix_detail,
      prix_gros,
      prix_passager,
      currentStock,
      minStock,
      maxStock,
      code_barre,
      location,
      cost,
      tva,
      description,
      discount,
    } = req.body;

    let imageUrl = "/placeholder.svg?height=100&width=100"; // default fallback

    // ✅ Multer uploads the file to `req.file`
    if (req.file) {
      const result = await uploadProductImage(req.file.path);
      if (result.success) {
        imageUrl = result.imageUrl;
      } else {
        return res.status(400).json({
          success: false,
          message: "Failed to upload image",
        });
      }
    }

    const newProduct = new Product({
      productName,
      brandName,
      category,
      prix_detail,
      prix_gros,
      prix_passager,
      currentStock,
      minStock: minStock || 0,
      maxStock: maxStock || 0,
      code_barre,
      location,
      cost,
      tva: tva || 0,
      description: description || "",
      discount: discount || 0,
      image: imageUrl,
    });

    await newProduct.save();

    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get all products with filtering and pagination
export const getAllProducts = async (req, res) => {
  try {
    const {
      limit = 10,
      page = 1,
      productName,
      brandName,
      category,
      prix_detail,
      prix_gros,
      currentStock,
      minStock,
      status,
      maxStock,
      code_barre,
      location,
      cost,
      tva,
      description,
      discount,
      gros_qty,
      sortField,
      minPrice,
      maxPrice,
      sortOrder = "desc",
    } = req.query;

    if (page < 1 || limit < 1) {
      return res.status(400).json({ error: "Invalid pagination parameters" });
    }

    let sortOptions = { createdAt: -1 };
    const filter = {};

    // Category filter
    if (productName) filter.productName = productName;
    if (brandName) filter.brandName = brandName;
    if (category && category !== "all") {
      filter.category = category;
    }
    if (location) filter.location = location;
    if (code_barre) filter.code_barre = code_barre;
    if (prix_detail) filter.prix_detail = prix_detail;
    if (prix_gros) filter.prix_gros = prix_gros;
    if (currentStock) filter.currentStock = currentStock;
    if (minStock) filter.minStock = minStock;
    if (maxStock) filter.maxStock = maxStock;
    if (cost) filter.cost = cost;
    if (tva) filter.tva = tva;
    if (description) filter.description = description;
    if (gros_qty) filter.gros_qty = gros_qty;
    if (status === "low_stock") filter.currentStock = { $lte: 5 };
    if (status === "out_of_stock") filter.currentStock = 0;
    if (status === "active") filter.currentStock = { $gt: 0 };

    // Department and child categories filter

    // Discount filter
    if (discount === "true") filter.discount = { $ne: 0 };

    // Name filter (case insensitive)

    // Price range filter
    if (minPrice && maxPrice) {
      filter.prix_detail = { $gte: Number(minPrice), $lte: Number(maxPrice) };
    }

    // Sorting by price (detaillant price)
    if (sortField) {
      sortOptions = { price: sortOrder === "asc" ? 1 : -1 };
    }

    // Stock filter
    if (currentStock) {
      filter.currentStock = currentStock > 0 ? { $gte: Number(stock) } : 0;
    }

    // Brand name filter
    if (brandName) {
      // Split the brandName string by commas if it's a string, otherwise use it as is
      const brandsArray =
        typeof brandName === "string"
          ? brandName.split(",").filter((brand) => brand.trim() !== "")
          : Array.isArray(brandName)
          ? brandName
          : [brandName];

      filter.brandName = {
        $in: brandsArray.map((brand) => new RegExp(`^${brand}$`, "i")),
      };
    }

    // Fetch products with filters and pagination
    const products = await Product.find(filter)
      .populate("category")
      .sort(sortOptions)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Product.countDocuments(filter);

    return res.status(200).json({
      currentPage: parseInt(page, 10),
      totalPages: Math.ceil(total / limit),
      data: products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ error: "Failed to fetch products" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error("Error fetching product:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch product" });
  }
};
export const getProductBybarcode = async (req, res) => {
  try {
    const product = await Product.findOne({ code_barre: req.params.barcode });
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error("Error fetching product:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch product" });
  }
};

// UPDATE product
export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const updatedData = { ...req.body };

    // Reconstruct the nested prices object

    // Handle image upload (optional)
    if (req.file) {
      const uploadResult = await uploadProductImage(req.file.path);
      if (!uploadResult.success) {
        return res
          .status(400)
          .json({ success: false, message: "Image upload failed" });
      }
      updatedData.productImage = uploadResult.imageUrl;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $set: updatedData },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update product" });
  }
};

// DELETE product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete product" });
  }
};
export const searchProducts = async (req, res) => {
  try {
    const seachterm = req.query.searchterm;
    if (!seachterm || seachterm.length < 1) {
      return res.status(400).json({ error: "seachterm too short" });
    }

    const products = await Product.find({
      $or: [
        { productName: { $regex: seachterm, $options: "i" } }, // case-insensitive match
        { code_barre: { $regex: seachterm, $options: "i" } },

        { brandName: { $regex: seachterm, $options: "i" } }, // same for barcode
      ],
    }).limit(8);

    return res.status(200).json({
      data: products,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
export const getStockCounts = async (req, res) => {
  try {
    const actifsCount = await Product.countDocuments({
      currentStock: { $gt: 0 },
    });
    const faibleCount = await Product.countDocuments({
      currentStock: { $gt: 0, $lte: 5 }, // fallback to 5 if null
    });
    const ruptureCount = await Product.countDocuments({ currentStock: 0 });
    const totalProducts = await Product.countDocuments();
    res.json({
      actifs: actifsCount,
      faibleStock: faibleCount,
      rupture: ruptureCount,
      totalProducts: totalProducts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const checkStockLevel = async (productId) => {
  const product = await Product.findById(productId);

  if (product && product.stockInStock <= 5) {
    console.log(
      `⚠️ Warning: Low stockInStock for ${product.productName} (Stock: ${product.stockInStock})`
    );

    // Store notification in DB
    await Notification.create({
      message: `Low stockInStock: ${product.productName} has ${product.stockInStock} left.`,
      productId: product._id,
    });
  }
};
