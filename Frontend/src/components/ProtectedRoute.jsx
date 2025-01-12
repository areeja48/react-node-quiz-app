import React from "react";
import { Navigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    console.log("No token found, redirecting to login...");
    return <Navigate to="/auth/login" />;
  }

  try {
    const decoded = jwtDecode(token);
    if (decoded.role !== "admin") {
      console.log("Unauthorized access, redirecting to login...");
      return <Navigate to="/auth/login" />;
    }
  } catch (error) {
    console.error("Error decoding token:", error);
    return <Navigate to="/auth/login" />;
  }

  return children; // Render the child components if authorized
};

export default ProtectedRoute;
