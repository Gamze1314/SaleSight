// renders main navbar, headline, and 3 cards for pies and charts to show profit, cost, sale revenue.(total)
import React from "react";
import MainNavBar from "../components/MainNavBar";
import SaleAnalytics from "../components/SaleAnalytics";
import ProfitAnalytics from "../components/ProfitAnalytics";
import CostAnalytics from "../components/CostAnalytics";

function AnalyticsPage() {
  console.log("Analytics page rendered");
  // render Sale, cost and profit analytics, pies, numbers.. in 3 divs aligned vertically. import components.

  return (
    <div>
      <div className="h-content-height flex-col flex items-center justify-center mb-6 transition-shadow duration-300 ease-in-out hover:shadow-red-900">
        <h1 className="text-3xl font-bold text-gray-800">Sale Insights</h1>
        <p className="text-gray-600 text-center text-xl w-full max-w-4xl mt-6 p-4">
          Your one-stop solution for managing your sales and earnings. Here you
          can view your total profit, revenue, and total cost.
        </p>
      </div>
      <MainNavBar />
      <SaleAnalytics />
      <ProfitAnalytics />
      <CostAnalytics />
    </div>
  );
}

export default AnalyticsPage;