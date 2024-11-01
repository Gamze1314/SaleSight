import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";


function ErrorPage() {

  // Redirect to login page when user tries to access an unauthorized route
  // This is a workaround to avoid navigation errors when trying to access unauthorized routes
  // Replace with a real authorization logic when implementing the authentication system
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/login", { replace: true });
  }, [navigate]);


  // Display different error information based on the structure
  return (
    <div className="flex flex-col justify-center items-center p-8 mt-8">
      <h1 className="text-red-600 font-bold text-2md">
        Something went wrong...Please check the URL address you have entered.
      </h1>
    </div>
  );
}

export default ErrorPage;
