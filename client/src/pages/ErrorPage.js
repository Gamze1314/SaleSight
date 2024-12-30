import React, { useContext } from "react";
import { SalesContext } from "../context/SalesContext"; // Make sure you import your context correctly
import { AuthContext } from "../context/AuthContext";

function ErrorPage() {
  // Access errors from both contexts
  const { error: salesError } = useContext(SalesContext) || {};
  const { error: authError } = useContext(AuthContext) || {};


  return (
    <div className="error-container">
      {salesError && (
        <div className="error-message">
          <h2>Sales Error: {salesError}</h2>
        </div>
      )}
      {authError && (
        <div className="error-message">
          <h2>Authentication Error: {authError}</h2>
        </div>
      )}
    </div>
  );
};

export default ErrorPage;
