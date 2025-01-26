import React, { useContext } from "react";
import { SalesContext } from "../context/SalesContext";
import { formatCurrency } from "../utils";

function SaleAnalytics() {
  const { salesAnalyticsData, error } = useContext(SalesContext);

  const totalRevenue = salesAnalyticsData?.total_sales_revenue || 0;
  const totalCost = salesAnalyticsData?.total_cost || 0;
  const totalProfit = salesAnalyticsData?.total_profit_amount || 0;
  const totalQuantity = salesAnalyticsData?.total_quantity_sold || 0;

  return (
    <div className="flex items-center flex-col space-y-4 p-2 mb-6 sm:text-xs">
      {error && (
        <div className="text-red-500 mb-4 text-xs">{error.message}</div>
      )}
      {/* Summary Card */}
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-white p-1 flex flex-row items-center space-x-10">
          <div className="flex flex-row items-center space-x-2">
            <h3 className="text-sm font-bold font-medium-bold">
              Total Revenue:
            </h3>
            <p className="text-xl font-bold text-green-600">
              {formatCurrency(totalRevenue)}
            </p>
          </div>
          <div className="flex flex-row items-center space-x-2">
            <h3 className="text-sm font-bold font-medium-bold">Total Cost:</h3>
            <p className="text-xl font-bold text-red-600">
              {formatCurrency(totalCost)}
            </p>
          </div>
          <div className="flex flex-row items-center space-x-2">
            <h3 className="text-sm font-bold font-medium-bold">
              {totalProfit < 0 ? "Total Loss:" : "Total Profit:"}
            </h3>
            <p className="text-xl font-bold text-blue-600">
              {formatCurrency(totalProfit)}
            </p>
          </div>
          <div className="flex flex-row items-center space-x-2">
            <h3 className="text-sm font-bold font-medium-bold">
              Total Items Sold:
            </h3>
            <p className="text-xl font-bold text-purple-600">{totalQuantity}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SaleAnalytics;
