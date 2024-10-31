import React from "react";
import { NavLink } from "react-router-dom";
import { GrAnalytics } from "react-icons/gr";

function LogInNavBar() {
  return (
    <div className="fixed top-0 w-full flex justify-between items-center p-4 bg-gray-800 text-white shadow-lg  hover:shadow-red-900">
      <div className="flex items-center">
        <p className="text-3xl font-bold ml-4">SaleSight</p>
        <GrAnalytics className="ml-3 mt-6 transform -translate-y-1/2 text-2xl" />
      </div>
      <div className="flex space-x-6 mr-4">
        <NavLink
          to="/about"
          className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-lg font-semibold"
        >
          About
        </NavLink>
        <NavLink
          to="/signup"
          className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-lg font-semibold"
        >
          Signup
        </NavLink>
      </div>
    </div>
  );
}

export default LogInNavBar;
