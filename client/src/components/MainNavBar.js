// import navlink
import { NavLink } from "react-router-dom";
import { GrAnalytics } from "react-icons/gr";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function MainNavBar() {
  const { logOut } = useContext(AuthContext);

  const handleLogOut = () => {
    logOut();
  };

  return (
    <div className="fixed top-0 w-full flex justify-between items-center sm:text-sm p-1 bg-gray-800 text-white shadow-md hover:shadow-red-900">
      <div className="flex items-center ml-2 text-lg sm:text-sm">
        <p className="sm:text-md responsive-text font-bold ml-2">SaleSight</p>
        <GrAnalytics className="ml-3 mt-4 transform -translate-y-1/2" />
      </div>
      <div className="flex space-x-6 mr-1 text-sm">
        <NavLink
          to="/profit_center"
          className="px-2 py-2 responsive-text bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
        >
          Profit Center
        </NavLink>
        <NavLink
          to="/my_store"
          className="px-2 py-2 responsive-text bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
        >
          My Store
        </NavLink>
        <NavLink
          onClick={handleLogOut}
          className="px-2 py-2 responsive-text bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
        >
          Log Out
        </NavLink>
      </div>
    </div>
  );
}

export default MainNavBar;
