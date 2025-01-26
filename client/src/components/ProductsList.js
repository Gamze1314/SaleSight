import React, { useContext, useEffect } from "react";
import Product from "./Product";
import { SalesContext } from "../context/SalesContext";

function ProductsList({ onOptionSelect }) {
  const { loading, salesData, error, setError } = useContext(SalesContext);

  // Use useEffect unconditionally
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 10000); // 10 seconds
      // Cleanup function to clear the timer
      return () => clearTimeout(timer);
    }
  }, [error, setError]);

  // Loading state handling
  if (loading) return <p>Loading...</p>;

  return (
    <>
      {error && <div className="text-red-700">{error}</div>}
      <div className="flex flex-col sm:flex-row mt-9 space-x-4">
        {" "}
        {/* Add flex for layout */}
        {/* Table Container */}
        <div className="w-[500px]">
          {" "}
          {/* Set fixed width to control the size */}
          <table className="w-full sm:text-xs border-collapse border border-white table-fixed">
            {/* Table Header */}
            <thead>
              <tr className="bg-white">
                <th className="p-2 text-blue-800 text-left border border-white text-xs">
                  Product Description
                </th>
                <th className="p-2 text-blue-800 text-left border border-white text-xs">
                  Sales Revenue
                </th>
                <th className="p-2 text-blue-800 text-left border border-white text-xs">
                  Quantity Purchased
                </th>
                <th className="p-2 text-blue-800 text-left border border-white text-xs">
                  Quantity Sold
                </th>
                <th className="p-2 text-blue-800 text-center border border-white text-xs">
                  Select Action
                </th>
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
                  <td colSpan="5" className="text-center text-xs">
                    No product and sales data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default ProductsList;
