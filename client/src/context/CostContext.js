import React, { useState, useEffect, createContext } from "react";

export const CostContext = createContext([]); // Initialize context

export const CostProvider = ({ children }) => {
  const [costData, setCostData] = useState([]); // State for cost data
  const [error, setError] = useState(null); // Error state for CostContext

  // Function to manage cost data
  const fetchCostData = async () => {
    try {
      const res = await fetch("/costs"); // Fetch costs data from the API
      if (res.ok) {
        const data = await res.json(); // Parse JSON data
        setCostData(data); // Update costs data state
      } else {
        throw new Error("Failed to fetch products' costs data"); // Throw error if response is not ok
      }
    } catch (err) {
      setError(err); // Set error state
      console.error(err); // Log error to the console
    }
  };

  // Fetch costs data on component mount
  useEffect(() => {
    fetchCostData();
  }, []);

  console.log(costData)

  // Function to clear the error state
  const clearError = () => {
    setError(null);
  };

  return (
    <CostContext.Provider value={{ costData, error, clearError }}>
      {children} {/* Render child components */}
    </CostContext.Provider>
  );
};
