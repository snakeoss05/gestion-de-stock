import Sale from "../models/Sales.js";
import Product from "../models/Product.js";

// Create a sale
export const createSale = async (req, res) => {
  try {
    const {
      cashierId,
      products,
      paymentMethod,
      discount = 0,
      customer,
    } = req.body;

    const totalAmount =
      products.reduce((sum, p) => sum + p.total, 0) - discount;

    const sale = await Sale.create({
      cashierId,
      products,
      paymentMethod,
      totalAmount,
      discount,
      customer,
    });

    // Optional: Decrease stock from Product model
    for (const item of products) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });
    }

    res.status(201).json({ message: "Sale recorded", sale });
  } catch (error) {
    res.status(500).json({ message: "Failed to record sale", error });
  }
};

// Get all sales
export const getAllSales = async (req, res) => {
  try {
    const sales = await Sale.find().populate("cashierId", "username");
    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ message: "Failed to get sales", error });
  }
};

// Get today's total sales
export const getDailySalesTotal = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dailySales = await Sale.aggregate([
      {
        $match: {
          saleDate: { $gte: today, $lt: tomorrow },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          totalItems: { $sum: { $sum: "$products.quantity" } },
          totalSales: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json(
      dailySales[0] || {
        totalRevenue: 0,
        totalItems: 0,
        totalSales: 0,
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Failed to get daily sales", error });
  }
};
