// ProtectedRoute.js
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const ProtectedRoute = ({ element }) => {
  const { isAuthenticated } = useContext(AuthContext); //authentication state from AuthContext

  return isAuthenticated ? element : <Navigate to="/authentication" replace />;
};

export default ProtectedRoute;
