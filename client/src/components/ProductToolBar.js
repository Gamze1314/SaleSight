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
    </div>
  );
}

export default ProductToolBar;
