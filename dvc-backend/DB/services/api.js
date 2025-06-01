// src/services/api.js
import axios from "axios";

// Create a base instance of axios with default configuration
const API_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Card API calls - adjusted to match your routes
export const cardAPI = {
  // Get all cards for the logged-in user
  getUserCards: async () => {
    const response = await api.get("/api/cards");
    return response.data;
  },

  // Create a new card
  createCard: async (cardData) => {
    const response = await api.post("/api/cards", cardData);
    return response.data;
  },

  // Get a single card by ID
  getCard: async (id) => {
    const response = await api.get(`/api/cards/${id}`);
    return response.data;
  },

  // Update a card
  updateCard: async (id, cardData) => {
    const response = await api.put(`/api/cards/${id}`, cardData);
    return response.data;
  },

  // Delete a card
  deleteCard: async (id) => {
    const response = await api.delete(`/api/cards/${id}`);
    return response.data;
  },
};

export default api;
