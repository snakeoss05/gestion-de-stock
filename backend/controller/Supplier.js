import Supplier from "../models/Supplier.js";

// @desc    Create a new supplier
// @route   POST /api/suppliers
// @access  Private (Admin only)
export const createSupplier = async (req, res) => {
  try {
    const { name, email, phone, address, productsSupplied } = req.body;

    // Check if supplier already exists
    const existingSupplier = await Supplier.findOne({ email });
    if (existingSuppplier) {
      return res.status(400).json({ message: "Supplier already exists" });
    }

    const newSupplier = new Supplier({
      name,
      email,
      phone,
      address,
      productsSupplied,
    });

    const savedSupplier = await newSupplier.save();
    res.status(201).json(savedSupplier);
  } catch (error) {
    res.status(500).json({ message: "Failed to create supplier", error });
  }
};

// @desc    Get all suppliers
// @route   GET /api/suppliers
// @access  Admin only
export const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.status(200).json(suppliers);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// @desc    Get supplier by ID
export const getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }
    res.status(200).json(supplier);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update supplier (Admin only)
export const updateSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    res.status(200).json({ message: "Supplier updated", supplier: supplier });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete supplier (Admin only)
export const deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);

    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    await Supplier.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Supplier deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
