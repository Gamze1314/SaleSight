import React, { useContext } from "react";
import { SalesContext } from "../context/SalesContext";
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
  // userProducts used to displayed all product descriptions on Related Information.
  const { processedData, userData, userProducts, error } =
    useContext(SalesContext);
  const [user] = userData;
  const { username } = user;

  // format username , first letter capitalized, the rest lowercase
  const formattedUsername = stringFormatter(username);

  userProducts.forEach((product) => {
    return stringFormatter(product.description);
  });

  if (error) return <ErrorDisplay error={error} />;

  const firstRecord = processedData || {};

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-semibold mb-6">Profit Analytics</h2>
      <p>Please click on the blue dot to display profit details.</p>
      <ChartContainer data={processedData} />
      <RelatedInfo
        data={firstRecord}
        username={formattedUsername}
        userProducts={userProducts}
      />
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

// Function to dynamically format tooltip values
const formatMargin = (value, name) => {
  if (name === "Profit Amount") {
    return [formatCurrency(value), "Profit"];
  }
  if (name === "Margin") {
    return [formatProfitMargin(value), "Margin"];
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
            // formats date related data.
            tickFormatter={(value) => new Date(value).toLocaleDateString()}
          />
          <YAxis tickFormatter={formatMargin} />
          <Tooltip formatter={formatMargin} />
          <Legend />
          {/* Display Profit Amount */}
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

const RelatedInfo = ({ data, username, userProducts }) => (
  <div className="bg-white shadow rounded-lg p-6">
    <h4 className="text-lg font-medium mb-4">Related Information</h4>
    {data ? (
      <div>
        <p className="font-medium">Sale Assistant: {username}</p>
        {/* return all product desc. from userProducts array. */}
        <p className="font-medium">
          Product Description:{" "}
          {userProducts.map((product) => product.description).join(", ")}
        </p>
      </div>
    ) : (
      <p>No data available</p>
    )}
  </div>
);

export { ProfitAnalytics };
