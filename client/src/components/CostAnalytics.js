import React, { useContext } from "react";
import { CostContext } from "../context/CostContext";
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
  const { costData, error: costError } = useContext(CostContext);
  const { salesData, error: salesError } = useContext(SalesContext);

  // Display error message if there's an issue with the data
  if (costError || salesError) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="bg-red-50 p-4 text-red-800 rounded-lg shadow-sm">
          <p>{costError || salesError}</p>
        </div>
      </div>
    );
  }

  // Combine data from salesData and costData
  const processedData = salesData.map((sale, index) => ({
    date: new Date(sale.sale_date).toLocaleDateString(),
    revenue: Number(sale.item_revenue),
    cost: Number(costData[index]?.item_cost || 0), // Match index or use 0 if no corresponding cost
    profit: Number(sale.item_revenue) - Number(costData[index]?.item_cost || 0),
  }));

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-semibold mb-6">Cost Analytics</h2>
      <p>Analyze your revenue and cost here.Great job on keeping the cost at minimum!</p>

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
