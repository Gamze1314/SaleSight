// add new product and filtering options here.
function ProductToolBar({ handleAddProfit }) {
  const handleClick = () => {
    handleAddProfit(); // Call the function to show the form for adding a new product
  };

  return (
    <div className="bg-gray-100 p-4 shadow-md flex items-center justify-between w-full rounded-md mt-10 mb-10">
      {/* Button to Add Product */}
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        onClick={handleClick}
      >
        Add New Profit
      </button>
      {/* Filter Options */}
      {/* <div className="flex items-center space-x-4">
        <label className="text-sm font-medium text-gray-700" htmlFor="category">
          Filter by Category:
        </label>
        <select
          id="category"
          className="block w-48 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
          <option value="accessories">Accessories</option>
        </select>
      </div> */}
    </div>
  );
}

export default ProductToolBar;
