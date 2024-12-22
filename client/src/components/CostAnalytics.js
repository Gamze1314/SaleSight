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
  const { salesData, processedData, error } = useContext(SalesContext);

  return (
    <div className="space-y-6 p-4">
      {error && <div className="text-red-500 mb-4">{error.message}</div>}
      <h2 className="text-2xl font-semibold mb-6">Cost Analytics</h2>
      {salesData.length === 0 ? <p>No data available</p> : <p>
        Analyze your revenue and cost here. Great job on keeping the cost at
        minimum!
      </p>}

      {/* Revenue vs Cost Chart */}
      <div className="bg-white shadow rounded-lg p-6">
        <h4 className="text-lg font-medium mb-4">Revenue vs Cost</h4>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={processedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={formatCurrency} />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
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
