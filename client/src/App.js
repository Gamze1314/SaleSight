import React from "react";
// Outlet to render child components
import { Outlet, useLocation, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Authentication from "./pages/Authentication.js";

function App() {
  const { currentUser } = useContext(AuthContext);
  const location = useLocation();

  const isAuthRoute =
    location.pathname === "/login" || location.pathname === "/signup";

  // If the user is authenticated and tries to access "/", redirect them to the dashboard or a protected page
  if (location.pathname === "/" && currentUser) {
    return <Navigate to="/analytics" replace />;
  }

  return (
    <>
      {isAuthRoute ? (
        <Authentication />
      ) : (
        <Outlet />
      )}
    </>
  );
}

export default App;
