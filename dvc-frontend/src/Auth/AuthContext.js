// AuthContext.js - Complete implementation
import { createContext, useContext, useEffect, useState } from "react";

// Create context
const AuthContext = createContext();

// Context provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing token on load
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem("token");

        if (token) {
          // In a real app, you would verify the token here
          // For example, by making a request to your backend

          // For now, we'll just set a user object
          setUser({
            token,
            isLoggedIn: true,
          });
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        // Clear invalid auth data
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Login function
  // const login = (userData) => {
  //   setUser({
  //     ...userData,
  //     isLoggedIn: true,
  //   });
  // };
  const login = async (userData) => {
    setUser({
      ...userData,
      isLoggedIn: true,
    });
    return true; // Signal login complete
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // Context value
  const value = {
    user,
    login,
    logout,
    isLoggedIn: !!user,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
