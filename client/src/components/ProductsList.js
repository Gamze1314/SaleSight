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
  const processedProducts = productDetails.map((item) => {
    const product = item[0]; // First element contains product details
    const costs = item[1] || []; // Second element contains costs
    const profits = item[2] || []; // Third element contains profits
    const sales = item[3] || []; // Fourth element contains sales

    return {
      ...product, // Spread the product data
      costs, // Attach the costs data
      profits, // Attach the profits data
      sales, // Attach the sales data
    };
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {processedProducts.map((product) => (
        <div className="bg-white p-4 shadow rounded-lg">
          <Product key={product.id} product={product} />
        </div>
      ))}
    </div>
  );
}

export default ProductsList;
