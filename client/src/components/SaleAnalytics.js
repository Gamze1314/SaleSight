import React, { useContext, useEffect } from "react";
import { SalesContext } from "../context/SalesContext";
import { formatCurrency } from "../utils";

function SaleAnalytics() {
  const { salesData, processedData, error } = useContext(SalesContext);

  // Add debugging logs
  useEffect(() => {
    console.log("salesData:", salesData);
    console.log("processedData:", processedData);
  }, [salesData, processedData]);

  // if there is no data available(new user signup), then show 0 Values.
  // Sort data by date

  // Initialize analytics data
  let totalRevenue = 0;
  let totalCost = 0;
  let totalProfit = 0;
  let totalQuantity = 0;

  // Only calculate totals if there's data
  if (processedData && processedData.length > 0) {
    // Sort data by date
    const sortedData = processedData.sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    totalRevenue = sortedData.reduce((sum, sale) => sum + sale.revenue, 0);
    totalCost = sortedData.reduce((sum, sale) => sum + sale.cost, 0);
    totalProfit = sortedData.reduce((sum, sale) => sum + sale.profit, 0);
    totalQuantity = sortedData.reduce((sum, sale) => sum + sale.quantity, 0);
  }

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
          <h3 className="text-lg font-medium">Total Profit</h3>
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
