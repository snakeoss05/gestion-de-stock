// services/cart/cartService.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/cart"; // Adjust based on your API base URL

export const addOrUpdateItem = async (
  userId,
  productId,
  quantity,
  price,
  itemTotal
) => {
  try {
    const response = await axios.post(`${API_URL}/add`, {
      userId,
      productId,
      quantity,
      price,
      itemTotal,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding/updating cart item:", error);
    throw error;
  }
};

export const removeItem = async (userId, productId) => {
  try {
    const response = await axios.post(`${API_URL}/remove`, {
      userId,
      productId,
    });
    return response.data;
  } catch (error) {
    console.error("Error removing cart item:", error);
    throw error;
  }
};

export const getCart = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching cart:", error);
    throw error;
  }
};

export const checkout = async (userId, paymentMethod, customer) => {
  try {
    const response = await axios.post(`${API_URL}/checkout`, {
      userId,
      paymentMethod,
      customer,
    });
    return response.data;
  } catch (error) {
    console.error("Error during checkout:", error);
    throw error;
  }
};
