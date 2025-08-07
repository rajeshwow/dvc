// frontend/src/services/api.js
import axios from "axios";

// Create a base instance of axios with default configuration
const API_URL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_BASE_URL
    : "http://localhost:5000";
console.log("api url ", API_URL);

const token = localStorage.getItem("token");

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  Authorization: `Bearer ${token}`,
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem("token");

    // If token exists, add it to request headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors (expired token)
    if (
      error.response &&
      (error.response.status === 401 ||
        (error.response.data &&
          error.response.data.message === "Token expired"))
    ) {
      // Clear user data from localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Display an alert to inform the user (optional)
      alert("Your session has expired. Please log in again.");

      // navigate("/login");
      window.location.href = "/login";
    }

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

  // Product methods
  getCardProducts: async (cardId) => {
    const response = await api.get(`/api/cards/${cardId}/products`);
    return response.data;
  },

  addCardProduct: async (cardId, productData) => {
    const response = await api.post(
      `/api/cards/${cardId}/products`,
      productData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  updateCardProduct: async (cardId, productId, productData) => {
    const response = await api.put(
      `/api/cards/${cardId}/products/${productId}`,
      productData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  deleteCardProduct: async (cardId, productId) => {
    const response = await api.delete(
      `/api/cards/${cardId}/products/${productId}`
    );
    return response.data;
  },

  // Business Hours methods
  updateBusinessHours: async (cardId, hoursData) => {
    const response = await api.put(`/api/cards/${cardId}/hours`, hoursData);
    return response.data;
  },

  // Testimonials methods
  addTestimonial: async (cardId, testimonialData) => {
    const response = await api.post(
      `/api/cards/${cardId}/testimonials`,
      testimonialData
    );
    return response.data;
  },

  approveTestimonial: async (cardId, testimonialId) => {
    const response = await api.put(
      `/api/cards/${cardId}/testimonials/${testimonialId}/approve`
    );
    return response.data;
  },

  deleteTestimonial: async (cardId, testimonialId) => {
    const response = await api.delete(
      `/api/cards/${cardId}/testimonials/${testimonialId}`
    );
    return response.data;
  },
};

// User API calls
export const userAPI = {
  // Login user
  login: async (credentials) => {
    const response = await api.post("/api/users/login", credentials);
    return response.data;
  },

  // Register user
  register: async (userData) => {
    const response = await api.post("/api/users/register", userData);
    return response.data;
  },

  // Get current user profile
  getCurrentUser: async () => {
    const response = await api.get("/api/users/profile");
    return response.data;
  },

  // Update user profile
  updateProfile: async (userData) => {
    const response = await api.put("/api/users/profile", userData);
    return response.data;
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await api.post("/api/users/change-password", passwordData);
    return response.data;
  },

  // Reset password request
  forgotPassword: async (email) => {
    const response = await api.post("/api/users/forgot-password", { email });
    return response.data;
  },

  // Reset password with token
  resetPassword: async (resetData) => {
    const response = await api.post("/api/users/reset-password", resetData);
    return response.data;
  },

  validateResetToken: async (token) => {
    const response = await api.get(`/api/users/validate-reset-token/${token}`);
    return response.data;
  },

  // Logout - client-side only, no API call needed
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Optionally clear other user-related data from localStorage
  },
  googleLogin: async (googleUser) => {
    const response = await api.post(`/api/users/google-login`, googleUser);
    return response.data;
  },
};

// Analytics API calls
export const analyticsAPI = {
  // Get analytics for a specific card
  getCardAnalytics: async (cardId, timeframe) => {
    const response = await api.get(
      `/api/analytics/cards/${cardId}?timeframe=${timeframe}`
    );
    return response.data;
  },

  // Track a view event
  trackView: async (cardId, viewData = {}) => {
    try {
      const response = await api.post(
        `/api/analytics/track/view/${cardId}`,
        viewData,
        { withCredentials: true } // Important for cookies
      );
      return response.data;
    } catch (error) {
      console.error("View tracking failed silently:", error);
      // Don't throw error for tracking calls
      return null;
    }
  },

  // Track a contact click (email, phone, website)
  trackContactClick: async (cardId, contactType) => {
    try {
      const response = await api.post(
        `/api/analytics/track/interaction/${cardId}`,
        {
          interactionType: "contact_click",
          interactionDetail: contactType,
        },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      console.error(`Contact click (${contactType}) tracking failed:`, error);
      return null;
    }
  },

  // Track a social media click (linkedin, twitter, etc.)
  trackSocialClick: async (cardId, network) => {
    try {
      const response = await api.post(
        `/api/analytics/track/interaction/${cardId}`,
        {
          interactionType: "social_click",
          interactionDetail: network,
        },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      console.error(`Social click (${network}) tracking failed:`, error);
      return null;
    }
  },

  // Track a download (vCard)
  trackDownload: async (cardId) => {
    try {
      const response = await api.post(
        `/api/analytics/track/interaction/${cardId}`,
        {
          interactionType: "download",
        },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      console.error("Download tracking failed:", error);
      return null;
    }
  },

  // Track a share
  trackShare: async (cardId, shareMethod = "share") => {
    try {
      const response = await api.post(
        `/api/analytics/track/interaction/${cardId}`,
        {
          interactionType: "share",
          interactionDetail: shareMethod,
        },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      console.error(`Share (${shareMethod}) tracking failed:`, error);
      return null;
    }
  },

  // General purpose track interaction method (for any other interactions)
  trackInteraction: async (cardId, interactionType, interactionDetail = "") => {
    try {
      const response = await api.post(
        `/api/analytics/track/interaction/${cardId}`,
        {
          interactionType,
          interactionDetail,
        },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      console.error(`Interaction (${interactionType}) tracking failed:`, error);
      return null;
    }
  },

  // Get analytics for all user's cards - NEW FUNCTION
  getAllCardsAnalytics: async (dateRange = "7") => {
    try {
      const response = await api.get(
        `/api/analytics/all-cards?days=${dateRange}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching all cards analytics:", error);

      // Return mock data if API call fails (for development)
      return {
        totalViews: 1247,
        totalShares: 89,
        totalDownloads: 156,
        totalContacts: 67,
        recentActivity: [
          {
            cardName: "John Doe - CEO",
            type: "view",
            location: "New York, US",
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          },
          {
            cardName: "Sarah Smith - Designer",
            type: "share",
            location: "London, UK",
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          },
          {
            cardName: "Mike Johnson - Developer",
            type: "download",
            location: "Toronto, CA",
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          },
          {
            cardName: "John Doe - CEO",
            type: "contact",
            location: "Boston, US",
            timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
          },
          {
            cardName: "Sarah Smith - Designer",
            type: "view",
            location: "Paris, FR",
            timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          },
        ],
        cardStats: [
          {
            cardId: "1",
            cardName: "John Doe - CEO",
            views: 456,
            shares: 23,
            downloads: 67,
            contacts: 34,
            engagementRate: 85,
          },
          {
            cardId: "2",
            cardName: "Sarah Smith - Designer",
            views: 389,
            shares: 31,
            downloads: 45,
            contacts: 19,
            engagementRate: 72,
          },
          {
            cardId: "3",
            cardName: "Mike Johnson - Developer",
            views: 402,
            shares: 35,
            downloads: 44,
            contacts: 14,
            engagementRate: 68,
          },
        ],
        topPerformingCards: [
          {
            cardId: "1",
            cardName: "John Doe - CEO",
            totalEngagements: 580,
            views: 456,
            shares: 23,
            downloads: 67,
            contacts: 34,
          },
          {
            cardId: "2",
            cardName: "Sarah Smith - Designer",
            totalEngagements: 484,
            views: 389,
            shares: 31,
            downloads: 45,
            contacts: 19,
          },
          {
            cardId: "3",
            cardName: "Mike Johnson - Developer",
            totalEngagements: 495,
            views: 402,
            shares: 35,
            downloads: 44,
            contacts: 14,
          },
        ],
      };
    }
  },

  // Get analytics summary for dashboard
  getAnalyticsSummary: async (dateRange = "7") => {
    try {
      const response = await api.get(
        `/api/analytics/summary?days=${dateRange}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching analytics summary:", error);
      throw error;
    }
  },

  // Get top performing cards
  getTopPerformingCards: async (limit = 5, dateRange = "30") => {
    try {
      const response = await api.get(
        `/api/analytics/top-cards?limit=${limit}&days=${dateRange}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching top performing cards:", error);
      throw error;
    }
  },

  // Get recent activity feed
  getRecentActivity: async (limit = 20, dateRange = "7") => {
    try {
      const response = await api.get(
        `/api/analytics/recent-activity?limit=${limit}&days=${dateRange}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching recent activity:", error);
      throw error;
    }
  },
};

export const appointmentAPI = {
  // Get all appointments for the logged-in user
  getUserAppointments: async () => {
    const response = await api.get("/api/appointments");
    return response.data;
  },

  // Create a new appointment
  createAppointmentScheduler: async (appointmentData) => {
    const response = await api.post(
      "/api/appointments/scheduler",
      appointmentData
    );
    return response.data;
  },

  // Create a new appointment
  createAppointment: async (appointmentData) => {
    const response = await api.post("/api/appointments", appointmentData);
    return response.data;
  },

  // Update an existing appointment
  updateAppointment: async (appointmentId, appointmentData) => {
    const response = await api.put(
      `/api/appointments/${appointmentId}`,
      appointmentData
    );
    return response.data;
  },

  // Delete an appointment
  deleteAppointment: async (appointmentId) => {
    const response = await api.delete(`/api/appointments/${appointmentId}`);
    return response.data;
  },
};

export default api;
