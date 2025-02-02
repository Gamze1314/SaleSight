import React from "react";
import { NavLink } from "react-router-dom";
import { GrAnalytics } from "react-icons/gr";

function LogInNavBar() {
  return (
    <div className="fixed top-0 w-full flex justify-between items-center sm:text-sm p-1 bg-gray-800 text-white shadow-md hover:shadow-red-900 mb-10">
      <div className="flex items-center">
        <p className="font-bold ml-4 responsive-text">SaleSight</p>
        <GrAnalytics className="ml-3 mt-4 transform -translate-y-1/2" />
      </div>
      <div className="flex space-x-6 mr-4">
        <NavLink
          to="/about"
          className="px-2 py-2 bg-gray-700 responsive-text rounded-lg hover:bg-gray-600 transition-colors"
        >
          About
        </NavLink>
        <NavLink
          to="/login"
          className="px-2 py-2 bg-gray-700 responsive-text rounded-lg hover:bg-gray-600 transition-colors"
        >
          Login
        </NavLink>
      </div>
    </div>
  );
}

export default LogInNavBar;
