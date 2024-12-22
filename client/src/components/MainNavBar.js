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
    <div className="fixed top-0 w-full flex justify-between items-center p-4 bg-gray-800 text-white shadow-lg  hover:shadow-red-900">
      <div className="flex items-center">
        <p className="text-3xl font-bold ml-4">SaleSight</p>
        <GrAnalytics className="ml-3 mt-6 transform -translate-y-1/2 text-2xl" />
      </div>
      <div className="flex space-x-6 mr-4">
        <NavLink
          to="/profit_center"
          className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-lg font-semibold"
        >
          Profit Center
        </NavLink>
        <NavLink
          to="/my_store"
          className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-lg font-semibold"
        >
          My Store
        </NavLink>
        <NavLink
          to="/logout"
          onClick={handleLogOut}
          className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-lg font-semibold"
        >
          Log out
        </NavLink>
      </div>
    </div>
  );
}

export default MainNavBar;
