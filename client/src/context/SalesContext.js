import React, { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";

export const SalesContext = createContext();

export const SalesProvider = ({ children }) => {
  const [salesData, setSalesData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [salesAnalyticsData, setSalesAnalyticsData] = useState(null);
  const { currentUser } = useContext(AuthContext);

  // do not send GET request if user not logged in. currentUser ?

  // Fetching sale analytics data on component mount, and dependency to salesData
  const fetchSalesAnalyticsData = async () => {
    if (currentUser) {
      console.log("user is authenticated", currentUser)
      try {
        const response = await fetch("/sales_analytics");

        if (response.status === 200) {
        console.log("Sales analytics fetched successfully.")
        const data = await response.json();
        setSalesAnalyticsData(data);
        setLoading(false); // Set loading to false once the data is fetched
        }
      } catch (error) {
        console.error(error);
        setError(error);
        setLoading(false); // Set loading to false in case of error
      }
    } else {
      setError("The user is not authenticated. Cannot fetch data.");
    }
  };

  // Fetching sales analytics data on component mount.
  useEffect(() => {
    fetchSalesAnalyticsData();
  }, []);


  // Fetch initial sales data, if user is logged in.
  useEffect(() => {
    const fetchSalesData = async () => {
      if (currentUser) {
        setLoading(true);
        setError(null);
        try {
          const res = await fetch("/user_sales");
          if (res.status === 200) {
            console.log("Sales fetched successfully.")
            const data = await res.json();
            setSalesData(data);
            setLoading(false); // Set loading to false once the data is fetched
          } else if (res.status === 404) {
            console.error(error);
            setError("No sales data found.");
            setLoading(false); // Set loading to false once the data is fetched
          } else {
            setError("Failed to fetch sales data.");
            setLoading(false); // Set loading to false once the data is fetched
          }
        } catch (err) {
          console.error(err);
          setError(err.message);
          setLoading(false); // Set loading to false once the data is fetched
        }
      } else {
        // if user not logged in, clear salesData and salesAnalyticsData
        setSalesData([]);
        setSalesAnalyticsData(null);
        setLoading(false); // Set loading to false once the data is fetched
        setError("The user is not authenticated. Cannot fetch data.");
      }
    };
    fetchSalesData();
  }, [currentUser]);

  // API POST request for new product, sale, profit, and cost addition
  const addProduct = async (values) => {
    // check if product is in the state and setError. 
    const existingProduct = salesData.find((item) => item.description === values.description);
    if (existingProduct) {
      setError(`The Product ${existingProduct.description} already exists.`);
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

      if (response.status === 200) {
        const data = await response.json();
        console.log("Product and profit data added successfully:", data);

        // Update salesData
        const { sale_data, sales_analytics } = data;
        setSalesData((prev) => {
          return [...prev, sale_data];
        });
        // Update salesAnalyticsData
        setSalesAnalyticsData(sales_analytics);

        setLoading(false); // Set loading to false once the data is fetched

      } else if (response.status === 400) {
        console.log("response is 400")
        const errorData = await response.json()
        setError(`${errorData.message}`);
        setLoading(false);
        return; // Exit early if the response is not OK
      } else if (response.status === 500) {
        console.error(error);
        setError("Internal server error. Please try again later.");
        setLoading(false);
        return; // Exit early if the response is not OK
      }
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

      // update Sale Analytics and salesData state here
      const { sale_data, sales_analytics } = data;

      const updatedProdDataIdx = salesData.findIndex(
        (prod) => prod.id === productId
      );
      const updatedData = [...salesData];
      updatedData.splice(updatedProdDataIdx, 1, sale_data);
      setSalesData(updatedData);
      // replaces existing object in the salesAnalyticsData state.
      setSalesAnalyticsData(sales_analytics);
      setLoading(false);
      setError(null);
    } catch (error) {
      console.error("Error updating profit metrics:", error.message);
      setError(error);
      setLoading(false);
    }
    setError(null);
  };

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
      setLoading(false);

      // update salesAnalytics
      const data = await response.json();
      const { sale_data, sales_analytics } = data;

      const productData = salesData.find((prod) => prod.id === sale_data.id);

      const updatedSalesData = [...salesData];
      updatedSalesData.splice(salesData.indexOf(productData), 1, sale_data);
      setSalesData(updatedSalesData);
      console.log("Updated sale data", updatedSalesData);
      setSalesAnalyticsData(sales_analytics);

      setError(null);
      setLoading(false); // Set loading to false once the data is fetched
    } catch (error) {
      console.error("Error deleting sale:", error.message);
      setLoading(false); // Set loading to false once the data is fetched
    }
  };

  const updateSale = async (values, saleId) => {
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
      // update Sale Analytics and salesData state here
      const { sale_data, sales_analytics } = data;

      // copy sales array
      const updatedProdDataIdx = salesData.findIndex(
        (prod) => prod.id === sale_data.id
      );
      const updatedData = [...salesData];
      updatedData.splice(updatedProdDataIdx, 1, sale_data);

      setSalesData(updatedData);
      setSalesAnalyticsData(sales_analytics);
      setLoading(false);
    } catch (error) {
      console.error("Error updating sale:", error.message);
      setError(
        "Error occurred while updating the sale details.Please check the quantity sold."
      );
      setLoading(false);
    }
    setError(null);
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
        fetchSalesAnalyticsData,
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
