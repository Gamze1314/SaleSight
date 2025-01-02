import React, { useState, useEffect } from "react";
import { stringFormatter } from "../utils";

function Product({ product, index, onOptionSelect }) {
  const [selectedOption, setSelectedOption] = useState("none");

  const { description, total_sales_revenue, total_quantity_sold, total_quantity_purchased } = product;


  const formattedDescription = stringFormatter(description);

  const handleSelect = (event) => {
    const value = event.target.value;
    setSelectedOption(value);

    if (value === "view_sales" || value === "edit_metrics") {
      onOptionSelect(product.id, value);
    } else {
      onOptionSelect(null, "none");
    }

    setTimeout(() => setSelectedOption("none"), 100);
  };


  return (
    <tr className="border-b">
      <td className="p-3 text-left">
        <span className="font-bold mr-2">{index + 1}. &nbsp;</span>
        {formattedDescription}
      </td>
      <td className="p-3 text-left">${total_sales_revenue || 0}</td>
      <td className="p-3 text-left">{total_quantity_purchased || 0}</td>
      <td className="p-3 text-left">{total_quantity_sold || 0}</td>
      <td>
        <select
          className="h-10 w-full rounded border border-solid border-neutral-300 px-4 text-sm"
          onChange={handleSelect}
          value={selectedOption}
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
