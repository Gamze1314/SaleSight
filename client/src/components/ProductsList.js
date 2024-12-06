import React, { useContext } from "react";
import Product from "./Product";
import { SalesContext } from "../context/SalesContext";

function ProductsList() {
  const { productDetails, error } = useContext(SalesContext);
  console.log(productDetails); // Check the structure of the data

  if (error) return <div>Error: {error}</div>;
  if (!productDetails || productDetails.length === 0)
    return <div>Loading product details...</div>;


  // Process productDetails to separate product, costs, profits, and sales
  const processedProducts = productDetails.map((item) => {
    const { costs = [], profits = [], sales = [], ...product } = item;

    return {
      ...product, // Product data (description, id, quantity, etc.)
      costs, // Costs array
      profits, // Profits array
      sales, // Sales array
    };
  });



  return (
    <table className="w-full text-sm border-collapse border border-gray-200">
      {/* Table Header */}
      <thead>
        <tr className="bg-gray-100">
          <th className="p-3 text-left border border-gray-200">Description</th>
          <th className="p-3 text-right border border-gray-200">Unit Price</th>
          <th className="p-3 text-right border border-gray-200">Quantity</th>
          {/* <th className="p-3 text-right border border-gray-200">Cost</th>
          <th className="p-3 text-right border border-gray-200">Revenue</th>
          <th className="p-3 text-right border border-gray-200">Profit</th> */}
        </tr>
      </thead>
      {/* Table Body */}
      <tbody>
        {productDetails.map((product, index) => (
          <Product key={product.id} product={product} index={index} />
        ))}
      </tbody>
    </table>
  );
}

export default ProductsList;
