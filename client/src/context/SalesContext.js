import React, { createContext, useState, useEffect } from "react";

export const SalesContext = createContext();

export const SalesProvider = ({ children }) => {
  const [salesData, setSalesData] = useState([]);
  const [error, setError] = useState(null);

  // Fetch initial sales data
  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const res = await fetch("/user_sales");
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

    const userSales = salesData.flatMap((profitData) => profitData.sales || []);
    const saleCosts = salesData.flatMap((profitData) => profitData.costs || []);
    const userData = salesData.flatMap((profitData) => profitData.user || []);
    //user products
    const userProducts = salesData.flatMap((profitData) => profitData.product || []);
  

    // Process sales data
    const processedData = userSales.map((sale) => {
      const relevantCosts = saleCosts.filter(
        (cost) => cost.profit_id === sale.profit_id
      );
      const totalCost = relevantCosts.reduce(
        (acc, cost) => acc + parseFloat(cost.total_cost || 0),
        0
      );

      const revenue = parseFloat(sale.sales_revenue || 0);
      const profit = revenue - totalCost;

      return {
        id: sale.id,
        date: new Date(sale.sale_date).toLocaleDateString(),
        revenue,
        margin: sale.profit_margin,
        cost: totalCost,
        profit,
        quantity: Number(sale.quantity_sold || 0),
        sale_date: sale.sale_date
      };
    });


  // Function to clear the error state
  const clearError = () => {
    setError(null);
  };


// API POST request for new product, sale, profit, and cost addition
const addProduct = async (values) => {
  try {
    const response = await fetch("/user_sales", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      throw new Error(`Failed to add product: ${response.statusText}`);
    }
    const data = await response.json();
    console.log("Product added successfully:", data);
    // update state 
    setSalesData((prevSales) => [...prevSales, { id: data.id, ...data }]);
  } catch (error) {
    console.error("Error adding product:", error);
  }
};



// const updateProduct = async (productId, updatedProductData) => {
//   try {
//     // Replace with the actual API endpoint, including the productId in the URL
//     const response = await fetch(`/product_sales/${productId}`, {
//       method: "PATCH", // Use PATCH for partial updates
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(updatedProductData), // Sending the updated product data
//     });
//     if (!response.ok) {
//       throw new Error("Failed to update product");
//     }

//     const data = await response.json();
//     console.log("Product updated successfully:", data);
//     //state updating logic here if needed
//     //  update your products list or trigger a refresh
//   } catch (error) {
//     console.error("Error updating product:", error.message);
//   }
// };


  return (
    <SalesContext.Provider
      value={{ salesData, processedData, userData, userProducts, userSales, saleCosts, error, clearError, addProduct }}
    >
      {children}
    </SalesContext.Provider>
  );
};
