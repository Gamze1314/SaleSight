import { NavLink } from "react-router-dom";


function ProductToolBar({ handleAddProfit }) {
  const handleClick = () => {
    handleAddProfit();
  };

  return (
    <div className="bg-white p-4 flex flex-col items-start w-full sm:text-sm mt-12">
      <p className="text-xs font-semibold mb-2">Manage your store</p>
      <NavLink
        className="bg-white text-xs text-gray-700 hover:underline"
        onClick={handleClick}
      >
        Add Profit Data
      </NavLink>
    </div>
  );
}

export default ProductToolBar;
