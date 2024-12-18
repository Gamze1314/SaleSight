import React from "react";

function Product({ productData, handleCheckboxChange }) {

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
        <td className="p-3 text-center">{productData.description}</td>
        <td className="p-3 text-center">${productData.salesRevenue || "N/A"}</td>
        <td className="p-3 text-center">{productData.inventory || "N/A"}</td>
        <td className="p-3 text-center">{productData.quantitySold}</td>
      </tr>
    </>
  );
}

export default Product;
