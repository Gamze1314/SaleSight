import React, { useContext } from "react";
// Import Profit Context
import { ProfitContext } from "../context/ProfitContext";
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from "recharts";
import { formatCurrency } from "../utils";

function ProfitAnalytics() {
  console.log("Profit Analytics rendered.");

  // Destructuring the context values
  const { profitsData, error } = useContext(ProfitContext);

  // Log the profits data for debugging
  console.log(profitsData);

  // Error handling: Display error message if there's an issue
  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="bg-red-50 p-4 text-red-800 rounded-lg shadow-sm">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Ensure profitsData is an array, even if it's undefined or null
  const sortedData = profitsData || [];

  return (
    <div className="space-y-6 p-4">
      {/* Title */}
      <h2 className="text-2xl font-semibold mb-6">Profit Analytics</h2>

      {/* Profit Trend Chart */}
      <div className="bg-white shadow rounded-lg p-6">
        <h4 className="text-lg font-medium mb-4">Profit Trend</h4>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sortedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="created_at"
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <YAxis tickFormatter={formatCurrency} />
              <Tooltip formatter={formatCurrency} />
              <Legend />
              {/* Display Profit Amount */}
              <Line
                type="monotone"
                dataKey="profit_amount"
                stroke="#2196F3"
                name="Profit Amount"
                strokeWidth={2}
              />
              {/* Display Margin if available */}
              <Line
                type="monotone"
                dataKey="margin"
                stroke="#4CAF50"
                name="Margin"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Display user and product-related data */}
      <div className="bg-white shadow rounded-lg p-6">
        <h4 className="text-lg font-medium mb-4">Related Information</h4>
        {sortedData.length > 0 && (
          <div>
            <p className="font-medium">
              User: {sortedData[0]?.user?.name || "Unknown User"}
            </p>
            <p className="font-medium">
              Product: {sortedData[0]?.product?.name || "Unknown Product"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfitAnalytics;
