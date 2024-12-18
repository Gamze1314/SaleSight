import React, { useContext } from "react";
import Product from "./Product";
import { SalesContext } from "../context/SalesContext";
import { stringFormatter } from "../utils";

function ProductsList({ handleCheckboxChange}) {
  const { userProducts, saleCosts, userSales, error } = useContext(SalesContext);

  if (error) return <div>Error: {error}</div>;
  if (!userProducts || userSales.length === 0)
    return <div>Loading product details...</div>;

  console.log(userProducts)
  // process data to extract product description, unit value, quantity purchased , and quantity sold.
  // userProducts returns the product description
  // costs returns the unit value and quantity purchased
  // userSales returns the quantity sold

  const processedData = userSales.map((sale) => {
    const relevantCost = saleCosts.find(
      (cost) => cost.profit_id === sale.profit_id
    );
    // find the relevant product description
      userProducts.forEach((product) => {
        return stringFormatter(product.description);
      });

      const productDescription =
        userProducts.length > 0
          ? userProducts[0].description
          : "No product found";
    // profitId is the profit_id from the saleCosts array
    // unitValue is the unit_value from the relevant cost data
    // inventory is the quantity_purchased from the relevant cost data
    // quantitySold is the quantity sold from the sale object

    // Return an object containing the profitId, unitValue, inventory, and quantitySold
    return {
      profitId: relevantCost?.profit_id,
      description: productDescription,
      unitValue: relevantCost?.unit_value,
      inventory: relevantCost?.quantity_purchased,
      quantitySold: sale.quantity_sold,
      // sales revenue
      salesRevenue: sale.sales_revenue,
    };
  });

  console.log(processedData);

  // Map through the processedData and render Product components with appropriate props.
  // OnEdit and onDelete props are passed to Product component for handling edit and delete operations.



  return (
    <>
    <p>By selecting the product, you can edit Profit metrics.</p>
    <table className="w-full text-sm border-collapse border border-gray-200">
      {/* Table Header */}
      <thead>
        <tr className="bg-gray-100">
          <th className="p-3 text-center border border-gray-200">Select</th>
          <th className="p-3 text-center border border-gray-200">
            Description
          </th>
          <th className="p-3 text-center border border-gray-200">Sale Revenue</th>
          <th className="p-3 text-center border border-gray-200">Total Inventory</th>
          <th className="p-3 text-center border border-gray-200">
            Quantity Sold
          </th>
        </tr>
      </thead>
      {/* Table Body */}
      <tbody>
        {processedData.map((productData) => (
          <Product
            key={productData.profitId}
            productData={productData}
            handleCheckboxChange={handleCheckboxChange}
          />
        ))}
      </tbody>
    </table>
    </>
  );
}

export default ProductsList;
