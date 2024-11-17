import React, { useContext } from "react";
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
  const { profitsData, error } = useContext(ProfitContext);

  if (error) return <ErrorDisplay error={error} />;

  // Process data to extract relevant details
  const processedData =
    profitsData?.map(({ created_at, profit_amount, margin, user, product }) => ({
      created_at: new Date(created_at),
      profit_amount: Number(profit_amount),
      margin: Number(margin),
      userName: user?.name || "Unknown User",
      productDescription: product?.description || "Unknown Product",
    })) || [];

  console.log(processedData)

  const firstRecord = processedData[0] || {};

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-semibold mb-6">Profit Analytics</h2>
      <p>Please click on the blue dot to display profit details.</p>
      <ChartContainer data={processedData} />
      <RelatedInfo data={firstRecord} />
    </div>
  );
}

const ErrorDisplay = ({ error }) => (
  <div className="min-h-screen flex justify-center items-center">
    <div className="bg-red-50 p-4 text-red-800 rounded-lg shadow-sm">
      <p>{error}</p>
    </div>
  </div>
);

const ChartContainer = ({ data }) => (
  <div className="bg-white shadow rounded-lg p-6">
    <h4 className="text-lg font-medium mb-4">Profit Trend</h4>
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
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
          <Line
            type="monotone"
            dataKey="margin"
            stroke="#4CAF50"
            name="Margin"
            strokeWidth={2}
            dot={false}
            label={(props) => {
              const { x, y, value } = props;
              return (
                <text
                  x={x - 20}
                  y={y}
                  dy={-5}
                  fill="#4CAF50"
                  fontSize={14}
                  textAnchor="middle"
                >
                  {`${value}%`}
                </text>
              );
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const RelatedInfo = ({ data }) => (
  <div className="bg-white shadow rounded-lg p-6">
    <h4 className="text-lg font-medium mb-4">Related Information</h4>
    {data ? (
      <div>
        <p className="font-medium">Sale Assistant: {data.userName}</p>
        <p className="font-medium">Product Description: {data.productDescription}</p>
      </div>
    ) : (
      <p>No data available</p>
    )}
  </div>
);

export { ProfitAnalytics };
