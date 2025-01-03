import React, { useContext } from "react";
import { SalesContext } from "../context/SalesContext";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
} from "recharts";
import { formatCurrency } from "../utils";

function CostAnalytics() {
  const { salesData, salesAnalyticsData, error } = useContext(SalesContext);

  // Check if data is available and transform for the chart
  // const chartData = salesAnalyticsData.map((item) => ({
  //   date: item.date, // Ensure there's a date key
  //   revenue: item.total_sales_revenue || 0, // Replace with actual revenue data key
  //   cost: item.total_cost || 0, // Replace with actual cost data key
  // }));

  const chartData = [{
    date: salesAnalyticsData.date,
    revenue: salesAnalyticsData.total_sales_revenue,
    cost: salesAnalyticsData.total_cost || 0,
  }]

  return (
    <div className="space-y-6 p-4">
      {/* Error Message Display */}
      {error && <div className="text-red-500 mb-4">{error.message}</div>}

      <h2 className="text-2xl font-semibold mb-6">Cost Analytics</h2>

      {/* Check for sales data availability */}
      {salesData.sales?.length === 0 ? (
        <p>No data available</p>
      ) : (
        <p>
          Analyze your revenue and cost here. Great job on keeping the cost at a
          minimum!
        </p>
      )}

      {/* Chart Display */}
      <div className="bg-white shadow rounded-lg p-6">
        <h4 className="text-lg font-medium mb-4">Revenue vs Cost</h4>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              {/* Grid lines */}
              <CartesianGrid strokeDasharray="3 3" />
              {/* X-axis */}
              <XAxis dataKey="date" />
              {/* Y-axis with currency formatting */}
              <YAxis tickFormatter={formatCurrency} />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
              {/* Bars for revenue and cost */}
              <Bar dataKey="revenue" fill="#4CAF50" name="Revenue" />
              <Bar dataKey="cost" fill="#FF5252" name="Cost" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default CostAnalytics;
