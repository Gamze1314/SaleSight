import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App";
import Authentication from "./pages/Authentication";
import ErrorPage from "./pages/ErrorPage";
import About from "./pages/About";
import ProtectedRoute from "./ProtectedRoute";
import AnalyticsPage from "./pages/AnalyticsPage";

// Create router configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/authentication" replace />, // Redirect root to /authentication
  },
  {
    path: "/authentication",
    element: <App />, // Render App component at /authentication
    errorElement: <ErrorPage />,
    children: [
      {
        index: true, // Default child route for App at /authentication
        element: <Authentication />, // Renders Authentication inside App
      },
    ],
  },
  {
    // signup page '/signup' => authentication
    path: "/signup",
    element: <Authentication />, // Renders Authentication inside App
  },
  // login page '/login' => authentication
  {
    path: "/login",
    element: <Authentication />, // Renders Authentication inside App
  },
  {
    path: "/about",
    element: <About />, // Renders About page
  },
  {
    path: "/analytics",
    element: <ProtectedRoute element={<AnalyticsPage />} />,
  },
  // add /products protected route.
  {
    path: "*", // Catch-all for unmatched routes
    element: <ErrorPage />,
  },
]);

export default router;
