import React from "react";
import MainNavBar from "../components/MainNavBar";
import SaleAnalytics from "../components/SaleAnalytics";
import { ProfitAnalytics } from "../components/ProfitAnalytics";
import CostAnalytics from "../components/CostAnalytics";

function AnalyticsPage() {
  return (
    <>
      <div>
        <MainNavBar />
        <div className="h-content-height flex-col flex items-center justify-center mb-6 transition-shadow duration-300 ease-in-out hover:shadow-red-900">
          <h1 className="text-3xl font-bold text-gray-800">Sale Insights</h1>
          <p className="text-gray-600 text-center text-xl w-full max-w-4xl mt-6 p-4">
            Your one-stop solution for managing your sales and earnings. Here
            you can view your total profit, revenue, and total cost statistics.
          </p>
        </div>
      </div>
      <div>
        <SaleAnalytics />
        <CostAnalytics />
        <ProfitAnalytics />
      </div>
    </>
  );
}

export default AnalyticsPage;

// Revenue vs Cost Bar Chart

// Shows revenue and costs side by side
// Easy to compare revenue and cost for each period

// Profit Trend Line Chart

// Shows how profit changes over time
// Good for identifying trends and patterns
// Smooth line makes it easy to spot growth or decline

// Combined Performance Overview

// Shows revenue, cost, and quantity sold together
// Uses bars for revenue/cost and a line for quantity
// Helps identify relationships between sales volume and financial performance
