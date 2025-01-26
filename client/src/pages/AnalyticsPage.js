import React, { useContext } from "react";
import MainNavBar from "../components/MainNavBar";
import SaleAnalytics from "../components/SaleAnalytics";
import { ProfitAnalytics } from "../components/ProfitAnalytics";
import CostAnalytics from "../components/CostAnalytics";
import { AuthContext } from "../context/AuthContext";


function AnalyticsPage() {
  const { currentUser } = useContext(AuthContext);


  return (
    <>
      <div>
        <MainNavBar />
        <div className="h-content-height flex-col flex items-center justify-center mb-2 transition-shadow duration-300 ease-in-out hover:shadow-red-900">
          <h1 className="sm:text-md font-bold text-gray-800">Profit Hub</h1>
          {/* welcome message for user if authenticated and directed to Profit Hub */}
          <p className="text-blue-600 text-center text-xs font-bold w-full max-w-4xl mt-2">
            {currentUser ? `Welcome ${currentUser.username}!` : null}
          </p>
          <p className="text-gray-700 text-center text-xs w-full max-w-4xl mt-2 p-2">
            Your one-stop solution for managing your sales and earnings. Here
            you can view your total profit, revenue, and total cost data
            analytics.
          </p>
          <p className="text-gray-700 text-center text-xs w-full max-w-4xl mt-6 p-2">
            Start managing your store and add your sales to view your profit
            metrics on this page!
          </p>
        </div>
      </div>
      <div className="overflow-x-auto overflow-y-hidden w-full">
        <SaleAnalytics />
        <CostAnalytics />
        <ProfitAnalytics />
      </div>
    </>
  );
}

export default AnalyticsPage;
