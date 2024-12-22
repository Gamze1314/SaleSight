import React, { useContext } from 'react';
import Product from "./Product";
import { SalesContext } from '../context/SalesContext';


function ProductsList({ onOptionSelect }) {
  const { productPageData, loading } = useContext(SalesContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {/*  DO NOT DISPLAY P TAG IF NO PRODUCT FOUND */}
      {productPageData.length > 0 && (
        <p>With Select Options, you can manage Profit center.</p>
      )}
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
              Total Inventory
            </th>
            <th className="p-3 text-left border border-gray-200">
              Quantity Sold
            </th>
            <th className="p-3 text-center border border-gray-200"></th>
          </tr>
        </thead>
        {/* Table Body */}
        <tbody>
          {productPageData.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">
                No products found.
              </td>
            </tr>
          ) : (
            productPageData.map((profit, index) => (
              <Product
                key={index}
                profit={profit}
                index={index}
                onOptionSelect={onOptionSelect}
              />
            ))
          )}
        </tbody>
      </table>
    </>
  );
}

export default ProductsList;
