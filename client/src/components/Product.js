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
      <td className="p-2 text-left sm:text-xs w-1/4">
        <div className="flex flex-col flex-wrap">
          <span className="text-xs">
            {index + 1}. {formattedDescription}&nbsp;
          </span>
        </div>
      </td>
      <td className="p-3 text-left w-1/4">${total_sales_revenue || 0}</td>
      <td className="p-3 text-left w-1/4">{total_quantity_purchased || 0}</td>
      <td className="p-3 text-left w-1/4">{total_quantity_sold || 0}</td>
      <td className="w-1/4">
        <select
          className="h-5 text-center text-xs"
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
