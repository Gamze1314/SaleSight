import React, { useContext } from 'react';
import Product from "./Product";
import { SalesContext } from '../context/SalesContext';


function ProductsList({
  setSelectedProductId,
  setSelectedOption,
  selectedOption,
}) {
  const { productPageData, loading } = useContext(SalesContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <p>With Select Options, you can edit Profit metrics.</p>
      <table className="w-full text-sm border-collapse border border-gray-200">
        {/* Table Header */}
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 text-left border border-gray-200">
              Product Description
            </th>
            <th className="p-3 text-left border border-gray-200">
              Sale Revenue
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
          {productPageData.map((profit, index) => (
            <Product
              key={index} // fallback to index
              profit={profit}
              index={index}
              setSelectedProductId={setSelectedProductId}
              setSelectedOption={setSelectedOption}
              selectedOption={selectedOption}
            />
          ))}
        </tbody>
      </table>
    </>
  );
}

export default ProductsList;
