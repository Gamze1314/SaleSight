import React, { useState } from "react";
// import sales context to display the product details.

function Product({ product, onEdit, onDelete }) {
  const [isChecked, setIsChecked] = useState(false);


  // if the checkbox is checked, then store the product in the state to handle PATCH and DELETE requests accordingly.
    const handleCheckboxChange = (e) => {
      setIsChecked(e.target.checked);
    }


    const productSales = product.sales;
    const itemRevenues = []; // Array to store computed item revenues

    productSales.forEach((sale) => {
        // Calculate item revenue for each sale
    const itemRevenue = sale.quantity_sold * sale.unit_sale_price;
        itemRevenues.push(itemRevenue);
    });


  return (
    <>
      <tr className="border-b">
        {/* Checkbox for selection */}
        <td className="p-3 text-center">
          <input
            type="checkbox"
            className="form-checkbox h-4 w-4 text-blue-600"
            onChange={handleCheckboxChange}
          />
        </td>
        <td className="p-3 text-center">{product.description}</td>
        <td className="p-3 text-center">${product.unit_value || "N/A"}</td>
        <td className="p-3 text-center">{product.quantity || "N/A"}</td>
        <td className="p-3 text-center">
          {" "}
          <button
            className={`text-blue-600 hover:underline mr-2 ${
              isChecked ? "" : "opacity-50 cursor-not-allowed"
            }`}
            disabled={!isChecked}
            onClick={() => isChecked && onEdit(product)}
          >
            Edit Details
          </button>
          <button
            className={`text-red-600 hover:underline ${
              isChecked ? "" : "opacity-50 cursor-not-allowed"
            }`}
            disabled={!isChecked}
            onClick={() => isChecked && onDelete(product.id)}
          >
            Delete
          </button>
        </td>
      </tr>
    </>
  );
}

export default Product;
