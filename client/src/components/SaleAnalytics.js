import React, { useContext } from "react";
import { SalesContext } from "../context/SalesContext";
import { formatCurrency } from "../utils";

function SaleAnalytics() {
  console.log("Sale Analytics rendered.");

  const { salesData, error } = useContext(SalesContext);

  console.log(salesData);

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

  // Process data for charts
  const processedData = salesData
    .map((sale) => ({
      date: new Date(sale.sale_date).toLocaleDateString(),
      revenue: Number(sale.unit_sale_price) * Number(sale.quantity_sold),
      cost: Number(sale.product?.unit_cost || 0) * Number(sale.quantity_sold),
      quantity: Number(sale.quantity_sold),
    }))
    .map((sale) => ({
      ...sale,
      profit: sale.revenue - sale.cost,
    }));

  const sortedData = [...processedData].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  // Calculate summary statistics
  const totalRevenue = sortedData.reduce((sum, sale) => sum + sale.revenue, 0);
  const totalCost = sortedData.reduce((sum, sale) => sum + sale.cost, 0);
  const totalProfit = sortedData.reduce((sum, sale) => sum + sale.profit, 0);
  const totalQuantity = sortedData.reduce(
    (sum, sale) => sum + sale.quantity,
    0
  );

  return (
    <div className="space-y-6 p-4">
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
              {salesData.map((sale) => (
                <tr key={sale.id} className="border-b">
                  <td className="p-2">{sale.id}</td>
                  <td className="p-2">
                    {new Date(sale.sale_date).toLocaleDateString()}
                  </td>
                  <td className="p-2 text-right">{sale.quantity_sold}</td>
                  <td className="p-2 text-right">
                    {formatCurrency(sale.unit_sale_price * sale.quantity_sold)}
                  </td>
                  <td className="p-2 text-right">
                    {formatCurrency(
                      (sale.product?.unit_cost || 0) * sale.quantity_sold
                    )}
                  </td>
                  <td className="p-2 text-right">
                    {formatCurrency(
                      sale.unit_sale_price * sale.quantity_sold -
                        (sale.product?.unit_cost || 0) * sale.quantity_sold
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default SaleAnalytics;
