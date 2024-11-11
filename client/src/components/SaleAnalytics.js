import React, { useContext } from "react";
import { SalesContext } from "../context/SalesContext";
import { CostContext } from "../context/CostContext";
import { formatCurrency } from "../utils";

function SaleAnalytics() {

  const { salesData, error } = useContext(SalesContext);
  const { costData } = useContext(CostContext);


  // Handle loading and error states
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="rounded-lg bg-red-50 p-4 text-red-800 shadow-sm">
          <p className="text-center font-medium">{error}</p>
        </div>
      </div>
    );
  }

  // Process sales data for chart
  const processedData = salesData.map((sale) => ({
    date: new Date(sale.sale_date).toLocaleDateString(), // only date format
    revenue: Number(sale.item_revenue),
    profit: Number(sale.net_profit),
    quantity: Number(sale.quantity_sold),
  }));

  console.log(processedData)

  const sortedData = [...processedData].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );


  // Calculate summary statistics
  const totalRevenue = sortedData.reduce((sum, sale) => sum + sale.revenue, 0);
  // get total cost for the products sold. costData has item cost for each, reduce()

  const totalCost = costData.reduce(
    // convert string to floating number.
    (sum, cost) => sum + parseFloat(cost.item_cost), 0);

  const totalProfit = sortedData.reduce((sum, sale) => sum + sale.profit, 0);

  const totalQuantity = sortedData.reduce((sum, sale) => sum + sale.quantity, 0);

  return (
    <div className="space-y-6 p-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium">Total Revenue</h3>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenue)}
          </p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium">Total Cost</h3>
          <p className="text-2xl font-bold text-red-600">{formatCurrency(totalCost)}
          </p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium">Total Profit</h3>
          <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalProfit)}
          </p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium">Total Items Sold</h3>
          <p className="text-2xl font-bold text-purple-600">{totalQuantity}</p>
        </div>
      </div>

      {/* Sales Details Table */}
      <div className="bg-white shadow rounded-lg p-6">
        <h4 className="text-lg font-medium mb-4">Sales Details</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Sale ID</th>
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-right">Quantity</th>
                <th className="p-2 text-right">Revenue</th>
                <th className="p-2 text-right">Cost</th>
                <th className="p-2 text-right">Profit</th>
              </tr>
            </thead>
            <tbody>
              {salesData.map((sale) => {
                // Find the corresponding cost for each sale’s product in costData
                const relatedCost = costData.find(
                  (cost) => cost.product_id === sale.product_id
                );
                const itemCost = relatedCost
                  ? parseFloat(relatedCost.item_cost)
                  : 0;

                return (
                  <tr key={sale.id} className="border-b">
                    <td className="p-2">{sale.id}</td>
                    <td className="p-2">
                      {new Date(sale.sale_date).toLocaleDateString()}
                    </td>
                    <td className="p-2 text-right">{sale.quantity_sold}</td>
                    <td className="p-2 text-right">
                      {formatCurrency(sale.item_revenue)}
                    </td>
                    <td className="p-2 text-right">
                      {formatCurrency(itemCost)}
                    </td>
                    <td className="p-2 text-right">
                      {formatCurrency(
                        sale.unit_sale_price * sale.quantity_sold -
                          itemCost * sale.quantity_sold
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default SaleAnalytics;
