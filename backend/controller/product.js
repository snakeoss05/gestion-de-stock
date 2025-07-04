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
      description,
      stock,
      discount,
      tva,
      code_barre,
      prix_achat,
      prix_passager,
      prix_gros,
      prix_detail,
      image,
      place,
      gros_qty,
    } = req.body;

    // Validate required fields
    const colors = JSON.parse(req.body.colors || "[]");
    colors.forEach((color) => {
      if (!color.colorName || !color.images || color.images.length === 0) {
        throw new Error(
          `Each color must have at least one image. Invalid color: ${color.colorName}`
        );
      }
    });
    if (!productName || !brandName || !category || !stock || !price) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Ensure file path is correct
    const filePath = file.path;

    // Upload the file to Cloudinary
    const result = await uploadProductImage(filePath);

    // Create the new product
    const newProduct = new Product({
      productName,
      brandName,
      category,
      image: result.imageUrl,
      description: description || "", // Default to empty string if missing
      discount: discount || 0, // Default discount to 0 if missing
      stock,
      tva,
      code_barre,
      prix_achat,
      prix_passager,
      prix_gros,
      prix_detail,
      image,
      place,
      gros_qty,
    });

    // Save to the database
    await newProduct.save();

    // Return the created product
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
      minPrice,
      maxPrice,
      limit = 10,
      category,
      discount,
      name,
      stock,
      page = 1,
      department,
      brandName,

      sortField,
      sortOrder = "desc",
    } = req.query;

    if (page < 1 || limit < 1) {
      return res.status(400).json({ error: "Invalid pagination parameters" });
    }

    let sortOptions = { createdAt: -1 };
    const filter = {};

    // Category filter
    if (category) filter.category = category;

    // Department and child categories filter
    if (department) {
      const childCategories = await Category.find({
        parentCategory: department,
      });
      const childCategoryIds = childCategories.map((cat) => cat._id);
      childCategoryIds.push(department);
      filter.category = { $in: childCategoryIds };
    }

    // Discount filter
    if (discount === "true") filter.discount = { $ne: 0 };

    // Name filter (case insensitive)
    if (name) filter.productName = { $regex: name, $options: "i" };

    // Price range filter
    if (minPrice && maxPrice) {
      filter.price = { $gte: Number(minPrice), $lte: Number(maxPrice) };
    }

    // Sorting by price (detaillant price)
    if (sortField) {
      sortOptions = { price: sortOrder === "asc" ? 1 : -1 };
    }

    // Stock filter
    if (stock) {
      filter.stock = stock > 0 ? { $gte: Number(stock) } : 0;
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
    const name = req.query.name;
    if (!name) {
      return res.status(400).json({ error: "Name parameter is required" });
    }
    const filter = {};
    if (name) {
      filter.productName = { $regex: name, $options: "i" };
    }
    const products = await Product.find(filter)
      .limit(8)
      .select("productName price discount  colors stock category");

    return res.status(200).json({
      data: products,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get filter options
export const getFilterOptions = async (req, res) => {
  try {
    const brands = await Product.distinct("brandName");
    const categories = await Product.distinct("category");
    const prices = await Product.find().select("prices");

    const minPrice = Math.min(...prices.map((p) => p.price));
    const maxPrice = Math.max(...prices.map((p) => p.price));

    res.json({ brands, categories, minPrice, maxPrice });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get products by category
export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get product sales report
export const getProductSalesReport = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;

    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );

    // Aggregate query
    const productSalesPipeline = [
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryData",
        },
      },
      { $unwind: { path: "$categoryData", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "orders",
          localField: "_id",
          foreignField: "orderItems.product",
          as: "orderData",
        },
      },
      {
        $addFields: {
          monthlyOrders: {
            $filter: {
              input: "$orderData",
              as: "order",
              cond: { $gte: ["$$order.createdAt", startOfMonth] },
            },
          },
        },
      },
      { $unwind: { path: "$monthlyOrders", preserveNullAndEmptyArrays: true } },
      {
        $unwind: {
          path: "$monthlyOrders.orderItems",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          $expr: { $eq: ["$monthlyOrders.orderItems.product", "$_id"] },
        },
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$productName" },
          category: { $first: "$categoryData.name" },
          stock: { $first: "$stock" },
          totalSales: { $sum: "$monthlyOrders.orderItems.qty" }, // Total quantity sold
          saleCount: { $sum: 1 }, // Count number of times sold
          revenue: {
            $sum: {
              $multiply: [
                "$monthlyOrders.orderItems.qty",
                "$monthlyOrders.orderItems.price",
              ],
            },
          },
          lastUpdated: { $max: "$updatedAt" },
          productImage: { $first: "$productImage" },
        }, // Get first image
      },

      {
        $project: {
          _id: 0,
          productId: "$_id",
          name: 1,
          category: { $ifNull: ["$category", "Unknown"] },
          stock: 1,
          totalSales: { $ifNull: ["$totalSales", 0] },
          saleCount: { $ifNull: ["$saleCount", 0] }, // Count of sales
          revenue: { $ifNull: ["$revenue", 0] },
          lastUpdated: 1,
          productImage: { $ifNull: ["$productImage", "default-image.jpg"] }, // Default image if none
        },
      },
      { $sort: { revenue: -1 } }, // Sort by highest revenue
      { $skip: skip },
      { $limit: limit },
    ];

    // Get total count for pagination
    const totalProducts = await Product.countDocuments();
    const totalPages = Math.ceil(totalProducts / limit);

    // Get total sales across all products
    const totalSalesCount = await Order.aggregate([
      { $unwind: "$orderItems" },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$orderItems.qty" },
          saleCount: { $sum: 1 },
        },
      },
    ]);

    const productSales = await Product.aggregate(productSalesPipeline);

    res.json({
      currentPage: page,
      totalPages,
      totalProducts,
      totalSales: totalSalesCount[0]?.totalSales || 0, // Total quantity sold
      totalOrders: totalSalesCount[0]?.saleCount || 0, // Total number of orders
      pageSize: productSales.length,
      products: productSales,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching product sales report", error });
  }
};

// Export product sales report

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
