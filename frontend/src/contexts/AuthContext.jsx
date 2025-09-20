import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on app load
  useEffect(() => {
    const checkAuth = () => {
      const currentUser = authService.getCurrentUser();
      const authenticated = authService.isAuthenticated();

      setUser(currentUser);
      setIsAuthenticated(authenticated);
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Signup function
  const signup = async (userData) => {
    try {
      const response = await authService.signup(userData);
      return response;
    } catch (error) {
      throw error;
    }
  };

  // Login function (request OTP)
  const login = async (email) => {
    try {
      const response = await authService.login(email);
      return response;
    } catch (error) {
      throw error;
    }
  };

  // Password-based login function
  const loginWithPassword = async (email, password) => {
    try {
      const response = await authService.loginWithPassword(email, password);
      if (response.success && response.token) {
        setUser(response.user);
        setIsAuthenticated(true);
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  // Google OAuth login function
  const googleLogin = async (googleData) => {
    try {
      const response = await authService.googleLogin(googleData);
      if (response.success && response.token) {
        setUser(response.user);
        setIsAuthenticated(true);
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  // Verify OTP function
  const verifyOtp = async (email, otp) => {
    try {
      const response = await authService.verifyOtp(email, otp);

      if (response.success && response.token) {
        setUser(response.user);
        setIsAuthenticated(true);
      }

      return response;
    } catch (error) {
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    signup,
    login,
    loginWithPassword,
    googleLogin,
    verifyOtp,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
