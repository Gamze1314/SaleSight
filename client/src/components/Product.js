import React from 'react'
// import sales context to display the product details.

function Product({ product }) {
  console.log(product.costs);

  const productSales = product.sales; // array
  const itemRevenues = []; // Array to store computed item revenues

  productSales.forEach((sale) => {
    // Calculate item revenue for each sale
    const itemRevenue = sale.quantity_sold * sale.unit_sale_price;

    // Push the result to the itemRevenues array or process it
    itemRevenues.push(itemRevenue);
  });

  console.log(itemRevenues); // Logs the array of item revenues

  const productCosts = product.costs; // array with multiple cost objects

  const itemCosts = productCosts.map((cost) => cost['item_cost']);

  console.log(itemCosts); // Array of item_revenue values, e.g., [100, 200, 300]

  const productProfits = product.profits;

  const itemProfits = productProfits.map((profit) => profit['margin']);

  console.log(itemProfits)


  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">{product.description}</h3>
      <p className="text-sm text-gray-800 font-medium">
        Price: {product.unit_value}
      </p>
      <p className="text-sm text-gray-800 font-medium">
        Quantity: {product.quantity}
      </p>
      {/* Sales Price */}

      {/* Total Item Revenue */}
      <p className="text-sm text-gray-800 font-medium">
        Item Revenue: ${itemRevenues[0]}
      </p>
      {/* Total Cost */}
      <p className="text-sm text-gray-800 font-medium">
        Item Cost: ${itemCosts[0]}
      </p>
      {/* Profit Margin */}
      <p className="text-sm text-gray-800 font-medium">
        Profit Margin: %{itemProfits[0]}
      </p>
    </div>
  );
}

export default Product