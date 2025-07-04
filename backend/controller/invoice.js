import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import Invoice from "../models/Invoice.js";

export const generateInvoice = async (req, res) => {
  const { orderId, customerName, items, total, invoiceSize } = req.body;

  const pageFormat =
    invoiceSize === "ticket" ? { width: "80mm", height: "297mm" } : "A4";

  // Generate HTML for invoice
  const invoiceHtml = `
    <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; padding: 10px; }
                .invoice-container { max-width: ${
                  invoiceSize === "ticket" ? "80mm" : "100%"
                }; }
                h2 { text-align: center; }
                table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                th, td { border: 1px solid black; padding: 5px; text-align: left; }
                .total { font-size: 16px; font-weight: bold; text-align: right; margin-top: 10px; }
            </style>
        </head>
        <body>
            <div class="invoice-container">
                <h2>Invoice</h2>
                <p><strong>Order ID:</strong> ${orderId}</p>
                <p><strong>Customer:</strong> ${customerName}</p>
                <table>
                    <tr>
                        <th>Item</th>
                        <th>Qty</th>
                        <th>Price</th>
                    </tr>
                    ${items
                      .map(
                        (item) => `
                        <tr>
                            <td>${item.name}</td>
                            <td>${item.qty}</td>
                            <td>$${item.prix.toFixed(2)}</td>
                        </tr>
                    `
                      )
                      .join("")}
                </table>
                <p class="total">Total: $${total.toFixed(2)}</p>
            </div>
        </body>
    </html>
    `;

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(invoiceHtml, { waitUntil: "domcontentloaded" });

    // Define PDF path
    const pdfDir = path.resolve("invoices");
    if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir);

    const pdfPath = path.join(pdfDir, `invoice_${orderId}.pdf`);

    // Generate PDF and save it
    await page.pdf({
      path: pdfPath,
      format: pageFormat,
      printBackground: true,
    });

    await browser.close();

    // Save invoice data in the database
    const newInvoice = new Invoice({
      orderId,
      customerName,
      items,
      total,
      invoiceSize,
      pdfUrl: `/invoices/invoice_${orderId}.pdf`,
    });

    await newInvoice.save();

    res.status(200).json({
      message: "Invoice generated successfully",
      pdfUrl: newInvoice.pdfUrl,
    });
  } catch (error) {
    console.error("Error generating invoice:", error);
    res.status(500).json({ error: "Failed to generate invoice" });
  }
};
export const getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find();
    res.status(200).json(invoices);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    res.status(500).json({ error: "Failed to fetch invoices" });
  }
};
export const getInvoiceByOrderId = async (req, res) => {
  try {
    const { orderId } = req.params;
    const invoice = await Invoice.findOne({ orderId });

    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    res.status(200).json(invoice);
  } catch (error) {
    console.error("Error fetching invoice:", error);
    res.status(500).json({ error: "Failed to fetch invoice" });
  }
};
