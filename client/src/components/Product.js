import React, { useState } from "react";
import { stringFormatter } from "../utils";

function Product({ product, index, onOptionSelect }) {
  // Manage state for each selection change
  const [selectedOption, setSelectedOption] = useState("none");

  // Destructure the necessary values from the product and sales data
  const { description, sales, total_sales_revenue } = product;

  // format description
  const formattedDescription = stringFormatter(description);

  // Calculate the total quantity sold and purchased
  const totalQuantityPurchased = sales?.reduce(
    (acc, sale) => acc + sale.quantity_purchased,
    0
  );
  const totalQuantitySold = sales?.reduce(
    (acc, sale) => acc + sale.quantity_sold,
    0
  );

  const handleSelect = (event) => {
    const value = event.target.value;
    setSelectedOption(value);

    // Handle selection and pass the action up to the parent component
    if (value === "view_sales" || value === "edit_metrics") {
      onOptionSelect(product.id, value); // Pass selected product and action up
    } else {
      onOptionSelect(null, "none"); // Reset selection
    }

    // Reset the selected option to "none" after the selection is handled
    setTimeout(() => setSelectedOption("none"), 100); // Adds a small delay to avoid UI flicker
  };

  return (
    <tr className="border-b">
      <td className="p-3 text-left">
        <span className="font-bold mr-2">{index + 1}. &nbsp;</span>
        {formattedDescription}
      </td>
      <td className="p-3 text-left">${total_sales_revenue || 0}</td>
      <td className="p-3 text-left">{totalQuantityPurchased || 0}</td>
      <td className="p-3 text-left">{totalQuantitySold || 0}</td>
      <td>
        <select
          className="h-10 w-full rounded border border-solid border-neutral-300 px-4 text-sm"
          onChange={handleSelect}
          value={selectedOption} // Controlled component per row
        >
          <option value="none">Select</option>
          <option value="view_sales">View Profit Table</option>
          <option value="edit_metrics">Add Profit Metrics</option>
        </select>
      </td>
    </tr>
  );
}

export default Product;
