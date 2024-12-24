import React, { useState } from "react";

function Product({ profit, index, onOptionSelect }) {
  // manage state in child component for each selection change.
  const [selectedOption, setSelectedOption] = useState("none");

  // console.log(profit.profitId, profit.productId)

  // if view_sales => displayes the product sales.
  // if edit_metrics => show ProductForm with selected product sale/cost information.(ex:  Add new sale for Product A)
  // ProductForm needs to know about the selectedOption, and productId.

  const handleSelect = (event) => {
    const value = event.target.value;
    setSelectedOption(value);

    if (value === "view_sales" || value === "edit_metrics") {
      onOptionSelect(profit.productId, value); // Pass selected product and action up
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
        {profit.description}
      </td>
      <td className="p-3 text-left">${profit.total_sales_revenue}</td>
      <td className="p-3 text-left">{profit.total_quantity_purchased}</td>
      <td className="p-3 text-left">{profit.total_quantity_sold}</td>
      <td>
        <select
          className="h-10 w-full rounded border border-solid border-neutral-300 px-4 text-sm"
          onChange={handleSelect}
          value={selectedOption} // Controlled component per row
        >
          <option value="none">Select</option>
          <option value="view_sales">View Profit Table</option>
          <option value="edit_metrics">Add New Profit Metrics</option>
          {/* option to delete existing profit data for selected product */}
          <option value="delete_metric">Delete Existing Profit</option>
        </select>
      </td>
    </tr>
  );
}

export default Product;
