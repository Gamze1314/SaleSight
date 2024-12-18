import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App";
import Authentication from "./pages/Authentication";
import ErrorPage from "./pages/ErrorPage";
import About from "./pages/About";
import ProtectedRoute from "./ProtectedRoute";
import AnalyticsPage from "./pages/AnalyticsPage";
import { AuthProvider } from "./context/AuthContext";
import { SalesProvider } from "./context/SalesContext";
import ProductsPage from "./pages/ProductsPage"

// Create router configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthProvider>
        <App /> {/* Wrap App with AuthProvider */}
      </AuthProvider>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Navigate to="/login" replace />, // Redirect to login if not authenticated
      },
      {
        path: "login",
        element: <Authentication />,
      },
      {
        path: "signup",
        element: <Authentication />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        element: <ProtectedRoute />, // Wrap protected routes with ProtectedRoute
        children: [
          {
            path: "profit_center",
            element: (
                  <SalesProvider>
                    <AnalyticsPage /> {/* Wrap App with AuthProvider */}
                  </SalesProvider>
            ),
          },
          {
            path: "my_store",
            element: (
              <SalesProvider>
                <ProductsPage /> 
              </SalesProvider>
            ),
          }
        ],
      },
    ],
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);

export default router;
