// contexts/PosCartContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { cartService } from "../services/cart";

const PosCartContext = createContext();

export const PosCartProvider = ({ children, userId }) => {
  const [cart, setCart] = useState({
    items: [],
    totalAmount: 0,
    discount: 0,
    tax: 0,
    customer: null,
    paymentMethod: null,
    cashierId: userId,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // POS-specific functions
  const quickAddItem = async (productId, quantity = 1) => {
    try {
      const product = await getProductDetails(productId); // You'll need to implement this
      const existingItemIndex = cart.items.findIndex(
        (item) => item.productId === productId
      );

      if (existingItemIndex >= 0) {
        // Update quantity if product already in cart
        const updatedItems = [...cart.items];
        updatedItems[existingItemIndex].quantity += quantity;
        updatedItems[existingItemIndex].total =
          updatedItems[existingItemIndex].price *
          updatedItems[existingItemIndex].quantity;

        setCart((prev) => ({
          ...prev,
          items: updatedItems,
          totalAmount:
            updatedItems.reduce((sum, item) => sum + item.total, 0) -
            (prev.discount || 0),
        }));
      } else {
        // Add new item to cart
        const newItem = {
          productId,
          productName: product.name,
          price: product.price,
          quantity,
          total: product.price * quantity,
        };

        setCart((prev) => ({
          ...prev,
          items: [...prev.items, newItem],
          totalAmount: prev.totalAmount + newItem.total - (prev.discount || 0),
        }));
      }
    } catch (err) {
      setError(err.message || "Failed to add item");
      throw err;
    }
  };

  const applyDiscount = (discountAmount) => {
    setCart((prev) => ({
      ...prev,
      discount: discountAmount,
      totalAmount:
        prev.items.reduce((sum, item) => sum + item.total, 0) - discountAmount,
    }));
  };

  const applyTax = (taxRate) => {
    const subtotal =
      cart.items.reduce((sum, item) => sum + item.total, 0) -
      (cart.discount || 0);
    const taxAmount = subtotal * (taxRate / 100);

    setCart((prev) => ({
      ...prev,
      tax: taxAmount,
      totalAmount: subtotal + taxAmount,
    }));
  };

  const setCustomer = (customer) => {
    setCart((prev) => ({ ...prev, customer }));
  };

  const setPaymentMethod = (method) => {
    setCart((prev) => ({ ...prev, paymentMethod: method }));
  };

  const clearCart = () => {
    setCart({
      items: [],
      totalAmount: 0,
      discount: 0,
      tax: 0,
      customer: null,
      paymentMethod: null,
      cashierId: userId,
    });
    setError(null);
  };

  const checkout = async () => {
    try {
      setLoading(true);
      const result = await cartService.checkout(
        userId,
        cart.paymentMethod,
        cart.customer,
        cart.discount,
        cart.tax
      );
      clearCart();
      return result;
    } catch (err) {
      setError(err.message || "Checkout failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    cart,
    loading,
    error,
    quickAddItem,
    applyDiscount,
    applyTax,
    setCustomer,
    setPaymentMethod,
    clearCart,
    checkout,
    cartItemCount: cart.items.reduce((total, item) => total + item.quantity, 0),
  };

  return (
    <PosCartContext.Provider value={value}>{children}</PosCartContext.Provider>
  );
};

export const usePosCart = () => {
  const context = useContext(PosCartContext);
  if (context === undefined) {
    throw new Error("usePosCart must be used within a PosCartProvider");
  }
  return context;
};
