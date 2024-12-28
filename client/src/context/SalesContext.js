import React, { createContext, useState, useEffect } from "react";

export const SalesContext = createContext();

export const SalesProvider = ({ children }) => {
  // state to hold user sales, profit and cost.
  const [salesData, setSalesData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [salesAnalyticsData, setSalesAnalyticsData] = useState(null);

    // Fetching sale analytics data on component mount
    useEffect(() => {
      fetch("/sales_analytics")
        .then((response) => response.json())
        .then((data) => {
          setSalesAnalyticsData(data);
        })
        .catch((error) => setError(error));
    }, []);

    console.log(salesAnalyticsData);


  // Fetch initial sales data
  useEffect(() => {
    const fetchSalesData = async () => {
      // loading state is true here
      setLoading(true);
      // reset previous error state
      setError(null);

      try {
        const res = await fetch("/user_sales");
        if (res.status === 200) {
          const data = await res.json();
          setSalesData(data);
        } else if (res.status === 404) {
          setError("No sales data found.");
        } else {
          setError("Failed to fetch sales data.");
        }
      } catch (err) {
        setError(err.message);
        console.log(err.message);
      } finally {
        setLoading(false); // stop loading.
      }
    };
    fetchSalesData();
  }, []);

  console.log(salesData);


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
      console.log(data);
      console.log("Product and profit data added successfully:", data);
      // Update salesData
      setSalesData((prevData) => [...prevData, data]);
    } catch (error) {
      console.error("Error adding product:", error);
      setError(error.message);
    }
  };


  // add sale, cost, profit data for the selected prodcut.(ProductForm)
  const addProductSale = async (values, productId) => {
    try {
      const response = await fetch(`/user_products/${productId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        console.log(`Failed to add profit metrics: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("Profit metrics added successfully:", data);

      // update Sale Analytics and salesData state here
      const { sale_data, sales_analytics } = data;
      
      setSalesData(sale_data);
      setSalesAnalyticsData(sales_analytics);

    } catch (error) {
      console.error("Error updating profit metrics:", error.message);
    }
  };

  const clearError = () => setError(null);

  // API DELETE request for product deletion
  const deleteProductSale = async (saleId) => {
    try {
      const response = await fetch(`/user_sales/${saleId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete profit: ${response.statusText}`);
      }
      console.log("Sale Data deleted successfully:", saleId);
      //  update state, remove sale data from product.sales array
      // Step 1: Remove the deleted sale from the salesData
      const updatedSalesData = salesData.map((product) => {
        // Filter out the sale with the matching ID for the product
        const updatedSales = product.sales.filter(
          (sale) => sale.sale_id !== saleId
        );

        // Step 2: Recalculate totals for this product
        const totalSalesRevenue = updatedSales.reduce(
          (sum, sale) => sum + (sale.sales_revenue || 0),
          0
        );
        const totalProfitAmount = updatedSales.reduce(
          (sum, sale) => sum + (sale.profit_amount || 0),
          0
        );
        const totalCost = updatedSales.reduce(
          (sum, sale) => sum + (sale.total_cost || 0),
          0
        );

        // Return the updated product with updated sales and totals
        return {
          ...product,
          sales: updatedSales,
          total_sales_revenue: totalSalesRevenue,
          total_profit_amount: totalProfitAmount,
          total_cost: totalCost,
        };
      });

      // Step 3: Update the state with the updatedSalesData
      setSalesData(updatedSalesData);

      // update salesAnalytics
      const data = response.sales_analytics

      console.log(data)
      setSalesAnalyticsData(data);

    } catch (error) {
      console.error("Error deleting sale:", error.message);
    }
  };

  return (
    <SalesContext.Provider
      value={{
        salesData,
        salesAnalyticsData,
        error,
        clearError,
        addProduct,
        addProductSale,
        deleteProductSale,
      }}
    >
      {loading ? (
        <div>Loading...</div> // Show loading message while data is fetched(SalesData)
      ) : (
        children
      )}
    </SalesContext.Provider>
  );
};
