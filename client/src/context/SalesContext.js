import React, { createContext, useState, useEffect, useMemo } from "react";

export const SalesContext = createContext();

export const SalesProvider = ({ children }) => {
  const [salesData, setSalesData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

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
        console.error("Fetch error:", err);
      } finally {
        setLoading(false); // stop loading.
      }
    };
    fetchSalesData();
  }, []);

  console.log(salesData);

  // API Call -> salesData update -> memoizedProductPageData recalculation -> productPageData update

  // processed for Profit Hub page.
  const { userSales, saleCosts, userData, userProducts, processedData } =
    useMemo(() => {
      // Flatten and process data
      const userSales = salesData.flatMap(
        (profitData) => profitData.sales || []
      );
      const saleCosts = salesData.flatMap(
        (profitData) => profitData.costs || []
      );
      const userData = salesData.flatMap((profitData) => profitData.user || []);

      const userProducts = salesData.flatMap(
        (profitData) => profitData.product || []
      );

      const processedData = userSales.map((sale) => {
        const relevantCosts = saleCosts.filter(
          (cost) => cost.profit_id === sale.profit_id
        );

        const totalCost = relevantCosts.reduce(
          (acc, cost) => acc + parseFloat(cost.total_cost || 0),
          0
        );

        const revenue = parseFloat(sale.sales_revenue || 0);
        const profit = revenue - totalCost; // calculates profit correctly.(with positive, and negative values)

        return {
          id: sale.id,
          date: new Date(sale.sale_date).toLocaleDateString(),
          revenue,
          margin: sale.profit_margin,
          cost: totalCost,
          profit,
          quantity: Number(sale.quantity_sold || 0),
          sale_date: sale.sale_date,
        };
      });

      return { userSales, saleCosts, userData, userProducts, processedData };
    }, [salesData]);

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

  console.log(salesData);

  const addProductSale = async (values, productId) => {
    try {
      const response = await fetch(`/product_sales/${productId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to update profit metrics: ${response.statusText}`
        );
      }
      const data = await response.json();
      console.log("Profit metrics updated successfully:", data);
      //  update your products list or trigger a refresh
      console.log(data);
      setSalesData((prevData) =>
        prevData.map((item) => (item.product_id === productId ? data : item))
      );
    } catch (error) {
      console.error("Error updating profit metrics:", error.message);
    }
  };

  const clearError = () => setError(null);

  // API DELETE request for product deletion
  console.log(salesData);

  return (
    <SalesContext.Provider
      value={{
        salesData,
        processedData,
        userData,
        userProducts,
        userSales,
        saleCosts,
        error,
        clearError,
        addProduct,
        addProductSale,
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
