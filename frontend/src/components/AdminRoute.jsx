// src/components/AdminRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { getCurrentUser, isAuthenticated } from "../services/api";

const AdminRoute = ({ children }) => {
  const user = getCurrentUser();

  if (!isAuthenticated() || user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
