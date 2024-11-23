import React, { useContext } from "react";
import Product from "./Product";
import { SalesContext } from "../context/SalesContext";

function ProductsList() {
  const { productDetails, error } = useContext(SalesContext);
  console.log(productDetails); // Check the structure of the data

  if (error) return <div>Error: {error}</div>;
  if (!productDetails || productDetails.length === 0)
    return <div>Loading product details...</div>;

  // Process productDetails to separate product, costs, and profits
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {processedProducts.map((product) => (
        <div className="bg-gray-100 p-4 shadow rounded-lg">
          <Product key={product.id} product={product} />
        </div>
      ))}
    </div>
  );
}

export default ProductsList;
