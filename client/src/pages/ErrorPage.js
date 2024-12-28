import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SalesContext } from "../context/SalesContext"; // Make sure you import your context correctly

function ErrorPage() {
  const { error } = useContext(SalesContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      // Optionally, you can redirect after a delay or based on error specifics
      navigate("/login", { replace: true });
    }
  }, [error, navigate]);

  if (!error) {
    // If there's no error, render a loading state or redirect if necessary
    return null;
  }

  return (
    <div className="flex flex-col justify-center items-center p-8 mt-8">
      <h1 className="text-red-600 font-bold text-2xl">
        Something went wrong... Please check the URL or try again later.
      </h1>
      <p className="mt-4 text-sm text-gray-500">
        {error.message || "An unexpected error occurred."}
      </p>
    </div>
  );
}

export default ErrorPage;
