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
  // userProducts used to displayed all product descriptions on Related Information.
  const { processedData, userProducts } = useContext(SalesContext);
  const { currentUser } = useContext(AuthContext);
  const { name } = currentUser;

  // format username , first letter capitalized, the rest lowercase
  const formattedUsername = stringFormatter(name);

  userProducts.forEach((product) => {
    return stringFormatter(product.description);
  });

  const firstRecord = processedData || {};

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-semibold mb-6">Profit Analytics</h2>
      {processedData.length === 0 ? (
        <p>No data available</p>
      ) : (
        <p>Please click on the blue dot to display profit details.</p>
      )}
      <ChartContainer data={processedData} />
      <RelatedInfo
        data={firstRecord}
        username={formattedUsername}
        userProducts={userProducts}
      />
    </div>
  );
}

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
        <p className="font-medium">User: {username}</p>
        {/* return all product desc. from userProducts array. */}
        <p className="font-medium">
          Products: {/* IF NO PRODUCT FOUND, NO PRODUCTS IN THE INVENTORY */}
          {userProducts.length === 0 ? "No products found." : ""}
          {userProducts.map((product) => product.description).join(", ")}
        </p>
      </div>
    ) : (
      <p>No data available</p>
    )}
  </div>
);

export { ProfitAnalytics };
