import React, { useContext } from "react";
import Product from "./Product";
import { SalesContext } from "../context/SalesContext";

function ProductsList({ onOptionSelect }) {
  const { loading, salesData } = useContext(SalesContext);

  // Loading state handling
  if (loading) return <p>Loading...</p>;

  return (
    <>
      <table className="w-full text-sm border-collapse border border-gray-200">
        {/* Table Header */}
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 text-left border border-gray-200">
              Product Description
            </th>
            <th className="p-3 text-left border border-gray-200">
              Sales Revenue
            </th>
            <th className="p-3 text-left border border-gray-200">
              Quantity Purchased
            </th>
            <th className="p-3 text-left border border-gray-200">
              Quantity Sold
            </th>
            <th className="p-3 text-center border border-gray-200">Select Action</th>
          </tr>
        </thead>
        {/* Table Body */}
        <tbody>
          {salesData && salesData.length > 0 ? (
            salesData.map((productSale, index) => (
              <Product
                key={productSale.id}
                product={productSale}
                index={index}
                onOptionSelect={onOptionSelect}
              />
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No product and sales data found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}

export default ProductsList;
