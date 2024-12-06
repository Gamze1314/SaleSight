import React, { createContext, useState, useEffect } from "react";

export const SalesContext = createContext();

export const SalesProvider = ({ children }) => {
  const [salesData, setSalesData] = useState([]);
  const [productDetails, setProductDetails] = useState([]); // State to hold product details
  const [error, setError] = useState(null);

  // Fetch initial sales data
  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const res = await fetch("/product_sales");
        if (res.ok) {
          const data = await res.json();
          setSalesData(data);
        } else {
          throw new Error("Failed to fetch sales data");
        }
      } catch (err) {
        setError(err.message);
        console.error(err);
      }
    };

    fetchSalesData();
  }, []);

  // Fetch product details based on IDs from salesData
  useEffect(() => {
    const fetchProductDetails = async () => {
      // if (!salesData || salesData.length === 0) return;

      const productIds = salesData.slice(1).map((product) => product.id); // Extract product IDs
      try {
        const productDetailPromises = productIds.map(async (id) => {
          const res = await fetch(`/product/${id}`);
          if (!res.ok) {
            throw new Error(`Failed to fetch details for product ID: ${id}`);
          }
          return await res.json();
        });

        const details = await Promise.all(productDetailPromises);
        setProductDetails(details);
      } catch (err) {
        setError(err.message);
        console.error(err);
      }
    };

    fetchProductDetails();
  }, [salesData]);

  // Function to clear the error state
  const clearError = () => {
    setError(null);
  };


  // API POST request for new product addition. /products
const addProduct = async (values) => {
  try {
    // Sanitize values to handle empty fields
    const sanitizedValues = Object.fromEntries(
      Object.entries(values).map(([key, value]) => {
        if (key === "quantity_sold" && value === "") {
          return [key, 0]; // Default `quantity_sold` to 0
        }
        return [key, value === "" ? null : value];
      })
    );

    const response = await fetch("/product_sales", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sanitizedValues),
    });

    if (!response.ok) {
      throw new Error(`Failed to add product: ${response.statusText}`);
    }
    const data = await response.json();
    console.log("Product added successfully:", data);
    // update state 
    setProductDetails((prevDetails) => [...prevDetails, data]);
    setSalesData((prevSales) => [...prevSales, { id: data.id, ...data }]);
  } catch (error) {
    console.error("Error adding product:", error);
  }
};

console.log(productDetails)

  return (
    <SalesContext.Provider
      value={{ salesData, productDetails, error, clearError, addProduct }}
    >
      {children}
    </SalesContext.Provider>
  );
};
