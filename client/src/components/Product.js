import React from "react";
// import sales context to display the product details.

function Product({ product, index }) {
  console.log(product.costs);

  const productSales = product.sales; // array
  const itemRevenues = []; // Array to store computed item revenues

  productSales.forEach((sale) => {
    // Calculate item revenue for each sale
    const itemRevenue = sale.quantity_sold * sale.unit_sale_price;
    itemRevenues.push(itemRevenue);
  });

  // const productCosts = product.costs.map((cost) => cost["item_cost"]); // array with multiple cost objects
  // const productProfits = product.profits.map((profit) => profit["margin"]);

  return (
    <tr className="border-b">
      {/* Description */}
      <td className="p-3 text-left">{index + 1}. {product.description}</td>

      {/* Price */}
      <td className="p-3 text-right">${product.unit_value}</td>

      {/* Quantity */}
      <td className="p-3 text-right">{product.quantity} pcs</td>

      {/* Cost
      <td className="p-3 text-right">${productCosts[0] || "N/A"}</td>

      {/* Revenue */}
      {/* <td className="p-3 text-right">${itemRevenues[0] || "N/A"}</td>

      {/* Profit */}
      {/* <td className="p-3 text-right">%{productProfits[0] || "N/A"}</td> */}
    </tr>
  );
}

export default Product;
