import React, { createContext, useState, useEffect } from "react";

export const SalesContext = createContext();

export const SalesProvider = ({ children }) => {
  // state to hold user sales, profit and cost.
  const [salesData, setSalesData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [salesAnalyticsData, setSalesAnalyticsData] = useState(null);

  // Function to fetch sales analytics data
  const fetchSalesAnalyticsData = async () => {
    try {
      const response = await fetch("/sales_analytics");
      const data = await response.json();
      setSalesAnalyticsData(Array.isArray(data) ? data : [data]);
      setLoading(false); // Set loading to false once the data is fetched
    } catch (error) {
      setError(error);
      setLoading(false); // Set loading to false in case of error
    }
  };

  // Fetching sale analytics data on component mount, and dependency to salesData
  useEffect(() => {
    fetchSalesAnalyticsData();
  }, [salesData]);

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
    // Declare variables
    const prodDescription = values["description"];

    // Check if the product exists in salesData
    const prod = salesData.find(
      (prodData) => prodData.description === prodDescription
    );
    if (prod) {
      alert(`${prodDescription} already exists in the inventory.`);
      setError("Product already exists.");
      return;
    }

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
        setLoading(false);
        return; // Exit early if the response is not OK
      }

      const data = await response.json();
      console.log("Product and profit data added successfully:", data);

      // Update salesData
      const { sale_data, sales_analytics } = data;
      setSalesData((prev) => {
        console.log("NEWDATA", [...prev, sale_data]);
        return [...prev, sale_data];
      });

      // Update salesAnalyticsData
      setSalesAnalyticsData((prevData) => {
        const updatedData = [...prevData];
        updatedData[0] = sales_analytics;
        return updatedData;
      });

      setLoading(false); // Set loading to false once the data is fetched
    } catch (error) {
      console.error("Error adding product:", error);
      setError(error.message);
      setLoading(false);
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

      setSalesData(updatedData);
      console.log(salesData);
      // replaces existing object in the salesAnalyticsData state.
      setSalesAnalyticsData((prevData) => {
        const updatedData = [...prevData];
        updatedData[0] = sales_analytics;
        return updatedData;
      });
      setLoading(false); // Set loading to false once the data is fetched
      setError("")
    } catch (error) {
      console.error("Error updating profit metrics:", error.message);
      setError(error)
      setLoading(false); // Set loading to false once the data is fetched
    }
  };

  console.log("salesAnalytics Data", salesAnalyticsData);

  const clearError = () => setError(null);

  // API DELETE request for Product Sale deletion
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

      // get updated product data and sales analytics data from the backend

      // update salesAnalytics
      const data = await response.json();
      const { sale_data, sales_analytics } = data;
      console.log("deletion -updated sales data:",  sale_data)
      console.log("deletion -updated analytics data:", sales_analytics);

      

      fetchSalesAnalyticsData();
      setSalesAnalyticsData((prevData) => {
        const updatedData = [...prevData];
        updatedData[0] = data;
        return updatedData;
      });

      setError("");
      setLoading(false); // Set loading to false once the data is fetched
    } catch (error) {
      console.error("Error deleting sale:", error.message);
      setLoading(false); // Set loading to false once the data is fetched
    }
  };

  console.log(salesData)

  const updateSale = async (values, saleId) => {
    console.log(values, saleId);
    // values must be integer
    const updatedValues = {
      ...values,
      quantitySold: parseInt(values.quantitySold, 10),
      unit_sale_price: parseFloat(values.unitSalePrice),
    };

    try {
      const response = await fetch(`/sale/${saleId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedValues),
      });

      if (!response.ok) {
        setError(`Failed to update profit metrics: ${response.statusText}`);
        setLoading(false); // Set loading to false once the data is fetched
      }
      const data = await response.json();
      console.log("Profit metrics updated successfully:", data);

      // update Sale Analytics and salesData state here
      const { sale_data, sales_analytics } = data;

      // copy sales array
      const updatedProdDataIdx = salesData.findIndex(
        (prod) => prod.id === sale_data.id
      );
      const updatedData = [...salesData];
      updatedData.splice(updatedProdDataIdx, 1, sale_data);

      // update the state with the new sales data
      setSalesData(updatedData);

      // update salesAnalytics
      setSalesAnalyticsData((prevData) => {
        const updatedData = [...prevData];
        updatedData[0] = sales_analytics;
        return updatedData;
      });

      setLoading(false); // Set loading to false once the data is fetched
    } catch (error) {
      console.error("Error updating sale:", error.message);
      setError(
        "Error occurred while updating the sale details.Please check the quantity sold."
      );
      setLoading(false); // Set loading to false once the data is fetched
    }
    setError("");
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
        updateSale,
        setError,
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
