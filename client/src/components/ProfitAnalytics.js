import React, { useContext } from "react";
import { SalesContext } from "../context/SalesContext";
import { AuthContext } from "../context/AuthContext";
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
import { formatCurrency, formatProfitMargin, stringFormatter } from "../utils";

function ProfitAnalytics() {
  const { salesData, salesAnalyticsData } = useContext(SalesContext);
  const { currentUser } = useContext(AuthContext);
  const { name } = currentUser;

  // Format username: first letter capitalized, the rest lowercase
  const formattedUsername = stringFormatter(name);

  const firstRecord = salesData || [];

  // Format data for Profit Trend chart
  const chartData = [
    {
      sale_date: new Date().toLocaleDateString(),
      profit: salesAnalyticsData.total_profit_amount,
      margin: salesAnalyticsData.average_profit_margin,
    },
  ];


  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-semibold mb-6">Profit Analytics</h2>
      {salesData.sales?.length === 0 ? (
        <p>No data available</p>
      ) : (
        <p>Please click on the blue dot to display profit details.</p>
      )}
      <ChartContainer data={chartData} />
      <RelatedInfo data={firstRecord} username={formattedUsername} />
    </div>
  );
}

// Function to dynamically format tooltip values
const formatMargin = (value, name) => {
  if (name === "Profit Amount") {
    return [formatCurrency(value), "Total Profit"];
  }
  if (name === "Margin") {
    return [formatProfitMargin(value), "Average Margin"];
  }
  return value;
};

const ChartContainer = ({ data }) => (
  <div className="bg-white shadow rounded-lg p-6">
    <h4 className="text-lg font-medium mb-4">Profit Trend</h4>
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="sale_date"
            tickFormatter={(value) => new Date(value).toLocaleDateString()}
          />
          <YAxis />
          <Tooltip formatter={formatMargin} />
          <Legend />
          <Line
            type="monotone"
            dataKey="profit"
            stroke="#2196F3"
            name="Profit Amount"
            strokeWidth={2}
          />
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
);

const RelatedInfo = ({ data, username }) => (
  <div className="bg-white shadow rounded-lg p-6">
    <h4 className="text-lg font-medium mb-4">Related Information</h4>
    {data?.length > 0 ? (
      <div>
        <p className="font-medium">User: {username}</p>
        <p className="font-medium">Inventory Count: {data.length}</p>
      </div>
    ) : (
      <p>No data available</p>
    )}
  </div>
);

export { ProfitAnalytics };
