// ProtectedRoute.js
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext.js";
import { Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { currentUser } = useContext(AuthContext); //authentication state from AuthContext

  return currentUser ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
