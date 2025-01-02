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
    <div className="space-y-6 p-4">
      {error && <div className="text-red-500 mb-4">{error.message}</div>}
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium">Total Revenue</h3>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(totalRevenue)}
          </p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium">Total Cost</h3>
          <p className="text-2xl font-bold text-red-600">
            {formatCurrency(totalCost)}
          </p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium">{totalProfit < 0 ? "Total Loss" : "Total Profit"}</h3>
          <p className="text-2xl font-bold text-blue-600">
            {formatCurrency(totalProfit)}
          </p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium">Total Items Sold</h3>
          <p className="text-2xl font-bold text-purple-600">{totalQuantity}</p>
        </div>
      </div>
    </div>
  );
}

export default SaleAnalytics;
