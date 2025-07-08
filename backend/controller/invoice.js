import Invoice from "../models/Invoice.js";

// Create Invoice
export const createInvoice = async (req, res) => {
  try {
    const invoice = new Invoice(req.body);
    await invoice.save();
    res.status(201).json({ success: true, data: invoice });
  } catch (err) {
    console.error("Error creating invoice:", err);
    res
      .status(500)
      .json({ success: false, error: "Failed to create invoice." });
  }
};

// Get All Invoices
export const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: invoices });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch invoices." });
  }
};

// Get One Invoice
export const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res
        .status(404)
        .json({ success: false, error: "Invoice not found" });
    }
    res.status(200).json({ success: true, data: invoice });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch invoice." });
  }
};

// Update Invoice
export const updateInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!invoice) {
      return res
        .status(404)
        .json({ success: false, error: "Invoice not found" });
    }
    res.status(200).json({ success: true, data: invoice });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: "Failed to update invoice." });
  }
};

// Delete Invoice
export const deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!invoice) {
      return res
        .status(404)
        .json({ success: false, error: "Invoice not found" });
    }
    res.status(200).json({ success: true, message: "Invoice deleted." });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: "Failed to delete invoice." });
  }
};
