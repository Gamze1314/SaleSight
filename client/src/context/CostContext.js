import React, { useState, useEffect, createContext } from "react";

export const CostContext = createContext([]); // Initialize context

export const CostProvider = ({ children }) => {
  const [costsData, setCostsData] = useState([]); // State for cost data
  const [error, setError] = useState(null); // Error state for CostContext

  // Function to manage cost data
  const fetchCostsData = async () => {
    try {
      const res = await fetch("/costs"); // Fetch costs data from the API
      if (res.ok) {
        const data = await res.json(); // Parse JSON data
        setCostsData(data); // Update costs data state
      } else {
        throw new Error("Failed to fetch costs data"); // Throw error if response is not ok
      }
    } catch (err) {
      setError(err); // Set error state
      console.error(err); // Log error to the console
    }
  };

  // Fetch costs data on component mount
  useEffect(() => {
    fetchCostsData();
  }, []);

  // Function to clear the error state
  const clearError = () => {
    setError(null);
  };

  return (
    <CostContext.Provider value={{ costsData, error, clearError }}>
      {children} {/* Render child components */}
    </CostContext.Provider>
  );
};
