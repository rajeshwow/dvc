// AuthContext.js - Complete implementation
import { createContext, useContext, useEffect, useState } from "react";

// Create context
const AuthContext = createContext();

// Context provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // ✅ separate state

  // Check for existing token on load
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          // Just mocking user for now
          setUser({ token });
          setIsLoggedIn(true); // ✅ ensure this updates
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        localStorage.removeItem("token");
        setUser(null);
        setIsLoggedIn(false); // ✅ reset on error
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const login = async (userData) => {
    setUser(userData);
    setIsLoggedIn(true); // ✅ trigger update
    return true;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsLoggedIn(false); // ✅ trigger update
  };

  // Context value
  const value = {
    user,
    login,
    logout,
    isLoggedIn,
    loading,
  };
  if (loading) return null;
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
