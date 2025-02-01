import React, { useContext } from "react";
import { SalesContext } from "../context/SalesContext"; // Make sure you import your context correctly
import { AuthContext } from "../context/AuthContext";

function ErrorPage() {
  // Access errors from both contexts
  const { error } = useContext(SalesContext) || {};
  const { authError } = useContext(AuthContext) || {};

  // navigate to login page
  const navigateToLogin = () => {
    window.location.href = "/login";
  };

  // If there are any errors, display them and provide a link to the login page
  if (error || authError) {
    return (
      <div className="error-container">
        <div className="error-message">
          <h2>An error occurred</h2>
          <p>Please try again or contact support.</p>
          <button onClick={navigateToLogin}>Login</button>
        </div>
      </div>
    );
  }

  // If there are no errors, display a generic message
  return (
    <div className="error-container">
      <h2>An error occurred</h2>
      <p>Please try again or contact support.</p>
    </div>
  );

}

export default ErrorPage;
