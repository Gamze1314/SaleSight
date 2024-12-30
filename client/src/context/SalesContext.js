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
        setLoading(false); // Set loading to false once the data is fetched
      })
      .catch((error) => setError(error));
    setLoading(false); // Set loading to false once the data is fetched
  }, []);

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
          console.log("SALES DATA", data);
          setLoading(false); // Set loading to false once the data is fetched
        } else if (res.status === 404) {
          setError("No sales data found.");
          setLoading(false); // Set loading to false once the data is fetched
        } else {
          setError("Failed to fetch sales data.");
          setLoading(false); // Set loading to false once the data is fetched
        }
      } catch (err) {
        setError(err.message);
        console.log(err.message);
        setLoading(false); // Set loading to false once the data is fetched
      }
    };
    setError(null);
    setLoading(false); // Set loading to false once the data is fetched
    fetchSalesData();
  }, []);


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
        setError(`Failed to add product: ${response.statusText}`);
        setLoading(false); // Set loading to false once the data is fetched
      }
      const data = await response.json();
      console.log("Product and profit data added successfully:", data);
      // update salesAnalytics , salesData
      const { sale_data, sales_analytics } = data;

      setSalesData((prev) => {
        console.log("NEWDATA", [...prev, sale_data]);
        // state is being updated successfully.
        return [...prev, sale_data];
      });
      // replaces existing object in the salesAnalyticsData state.
      setSalesAnalyticsData((prevData) => {
        const updatedData = [...prevData];
        updatedData[0] = sales_analytics;
        return updatedData;
      });
      setLoading(false); // Set loading to false once the data is fetched
    } catch (error) {
      console.error("Error adding product:", error);
      setError(error.message);
      setLoading(false); // Set loading to false once the data is fetched
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
        setError(`Failed to add profit metrics: ${response.statusText}`);
        setLoading(false); // Set loading to false once the data is fetched
      }
      const data = await response.json();
      console.log("Profit metrics added successfully:", data);

      // update Sale Analytics and salesData state here
      const { sale_data, sales_analytics } = data;

      console.log(
        "Sales_analytics data updated in the backednd after sale addition",
        sales_analytics
      );
      console.log("Sale_data after new sale addition", sale_data);
      /*TODO:
        sale_data is product_data including new sales created in sales array
        Find product_data in salesData by productId
        Copy salesData into new array object and replace product_data with productId with sale_data
        setSalesData with copied array
      */
      const updatedProdDataIdx = salesData.findIndex(
        (prod) => prod.id === productId
      );
      const updatedData = [...salesData];
      updatedData.splice(updatedProdDataIdx, 1, sale_data);

      setSalesData(updatedData); // updates the sales analytics and sales array for the product.
      console.log(salesData);
      // replaces existing object in the salesAnalyticsData state.
      setSalesAnalyticsData((prevData) => {
        const updatedData = [...prevData];
        updatedData[0] = sales_analytics;
        return updatedData;
      });
      setLoading(false); // Set loading to false once the data is fetched
    } catch (error) {
      console.error("Error updating profit metrics:", error.message);
      setLoading(false); // Set loading to false once the data is fetched
    }
  };

  console.log("salesAnalytics Data", salesAnalyticsData)

  const clearError = () => setError(null);

  // API DELETE request for product deletion
  const deleteProductSale = async (saleId) => {
    try {
      const response = await fetch(`/user_sales/${saleId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        setError(`Failed to delete profit: ${response.statusText}`);
      }
      console.log("Sale Data deleted successfully:", saleId);
      setLoading(false); // Set loading to false once the data is fetched
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
      const data = response.sales_analytics;
      setSalesAnalyticsData(data);
      setLoading(false); // Set loading to false once the data is fetched
    } catch (error) {
      console.error("Error deleting sale:", error.message);
      setLoading(false); // Set loading to false once the data is fetched
    }
  };


  return (
    <SalesContext.Provider
      value={{
        loading,
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
