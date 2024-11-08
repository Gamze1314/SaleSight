import React, { useState, useEffect, createContext } from "react";

export const ProfitContext = createContext([]); // Initialize context

export const ProfitProvider = ({ children }) => {
  const [profitsData, setProfitsData] = useState([]); // State for profit data
  const [error, setError] = useState(null); // Error state for ProfitContext


  // Fetch profits data on component mount
  useEffect(() => {
    // Function to manage profit data
    const fetchProfitsData = async () => {
      try {
        const res = await fetch("/profits"); // Fetch profits data
        if (res.ok) {
          const data = await res.json(); // Parse JSON data
          setProfitsData(data); // Update profits data state
        } else {
          throw new Error("Failed to fetch profits data");
        }
      } catch (err) {
        setError(err); // Set error state
        console.error(err); // Log error
      }
    };

    fetchProfitsData();
  }, []);

  console.log(profitsData)

  // Function to clear the error state
  const clearError = () => {
    setError(null);
  };

  return (
    <ProfitContext.Provider value={{ profitsData, error, clearError }}>
      {children} {/* Render child components */}
    </ProfitContext.Provider>
  );
};
