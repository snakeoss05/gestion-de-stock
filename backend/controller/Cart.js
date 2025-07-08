// controllers/cartController.js
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Sale from "../models/Sales.js";

// 🟢 Add or update item in cart
export const addOrUpdateCartItem = async (req, res) => {
  try {
    const { userId, productId, quantity, price, itemTotal } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [
          {
             productId,
            productName: product.productName,
            price: price,
            quantity,
            total: itemTotal,
          },
        ],
        totalAmount: itemTotal,
      });
    } else {
      const index = cart.items.findIndex((item) =>
        item.productId.equals(productId)
      );
      if (index > -1) {
        // Update existing item
        cart.items[index].quantity = quantity;
        cart.items[index].total = price * quantity;
      } else {
        // Add new item
        cart.items.push({
          productId,
          productName: product.productName,
          price: price,
          quantity,
          total: itemTotal,
        });
      }

      cart.totalAmount =
        cart.items.reduce((sum, item) => sum + item.total, 0) -
        (cart.discount || 0);
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error in addOrUpdateCartItem:", error);
    res.status(500).json({ message: "Failed to add/update cart item", error });
  }
};

// 🔴 Remove product from cart
export const removeCartItem = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    // Remove the item
    cart.items = cart.items.filter((item) => !item._id.equals(productId));

    // Mark the items field as modified to force full update
    cart.markModified("items");

    // Recalculate total
    cart.totalAmount =
      cart.items.reduce((sum, item) => sum + item.total, 0) -
      (cart.discount || 0);

    await cart.save();

    // Optional: re-fetch and populate to ensure clean response
    const updatedCart = await Cart.findOne({ userId }).populate(
      "items.productId"
    );

    res.status(200).json(updatedCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to remove item", error });
  }
};

// 🟡 Get cart content
export const getCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Failed to get cart", error });
  }
};

// 🟣 Checkout (convert cart to sale and clear cart)
// controllers/cartController.js - Updated checkout
export const checkoutCart = async (req, res) => {
  try {
    const { userId, paymentMethod, customer, discount = 0, tax = 0 } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Calculate final total with tax
    const subtotal = cart.totalAmount + discount; // Because totalAmount already has discount subtracted
    const finalTotal = subtotal + tax;

    const sale = await Sale.create({
      cashierId: userId,
      products: cart.items,
      paymentMethod,
      subtotal,
      discount,
      tax,
      totalAmount: finalTotal,
      customer,
      status: "completed",
      saleDate: new Date(),
    });

    // Reduce stock with transaction for safety
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      for (const item of cart.items) {
        await Product.findByIdAndUpdate(
          item.productId,
          { $inc: { stock: -item.quantity } },
          { session }
        );
      }

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }

    // Clear cart
    cart.items = [];
    cart.totalAmount = 0;
    cart.discount = 0;
    await cart.save();

    res.status(201).json({
      message: "Sale completed",
      sale,
      receiptId: sale._id,
    });
  } catch (error) {
    res.status(500).json({ message: "Checkout failed", error });
  }
};
