import React, { useContext } from "react";
import { SalesContext } from "../context/SalesContext";
import { formatCurrency } from "../utils";

function ProductProfitTable({ onClose }) {
  const { salesData, deleteProductSale } = useContext(SalesContext);

  const productSales = salesData
    .map((productObj) => {
      // product id
      const productId = productObj.id;
      // Process each sale for the current product
      const productDescription = productObj.description || "Unknown Product";

      // Process each sale for the current product
      const sales = productObj.sales?.map((sale) => {
        const salesRevenue = parseFloat(sale.sales_revenue) || 0;
        const quantitySold = parseInt(sale.quantity_sold) || 0;
        const totalCost = parseFloat(sale.total_cost) || 0;
        const profitAmount = parseFloat(sale.profit_amount) || 0;

        return {
          saleDate: new Date(sale.sale_date).toLocaleDateString(),
          salesRevenue: salesRevenue.toFixed(2),
          quantitySold: quantitySold,
          unitSalePrice: parseFloat(sale.unit_sale_price).toFixed(2),
          totalCost: totalCost.toFixed(2),
          profit: profitAmount.toFixed(2),
          saleId: sale.sale_id,
          productId: productId,
          productDescription: productDescription,
        };
      });

      // Return the sales array for the current product
      return sales || [];
    })
    .flat(); // Flatten the array of arrays to a single array of sales

  // Sort the sales data by saleDate in ascending order
  const sortedData = productSales.sort(
    (a, b) => new Date(a.saleDate) - new Date(b.saleDate)
  );

  // deletes Profit Data(sales and costs for the selected Product.)
  const handleDelete = (saleId) => {
    alert("Are you sure you want to delete this profit metric?");
    deleteProductSale(saleId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur">
      <div className="relative bg-white shadow rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          ✕
        </button>
        {sortedData.length > 0 ? (
          <>
            <h4 className="text-lg font-medium mb-4">
              Profit Details for Product: {sortedData[0].productDescription}
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 text-left">Sale ID</th>
                    <th className="p-2 text-left">Date</th>
                    <th className="p-2 text-right">Quantity Sold</th>
                    <th className="p-2 text-right">Unit Value</th>
                    <th className="p-2 text-right">Sale Revenue</th>
                    <th className="p-2 text-right">Total Cost</th>
                    <th className="p-2 text-right">Profit</th>
                    <th className="p-2 text-center"></th>
                  </tr>
                </thead>
                <tbody>
                  {sortedData.map((sale, index) => (
                    <tr key={sale.saleId} className="border-b hover:bg-gray-50">
                      <td className="p-2">{index + 1}</td>
                      <td className="p-2">{sale.saleDate}</td>
                      <td className="p-2 text-right">{sale.quantitySold}</td>
                      <td className="p-2 text-right">
                        {formatCurrency(sale.unitSalePrice)}
                      </td>
                      <td className="p-2 text-right">
                        {formatCurrency(sale.salesRevenue)}
                      </td>
                      <td className="p-2 text-right">
                        {formatCurrency(sale.totalCost)}
                      </td>
                      <td className="p-2 text-right">
                        {formatCurrency(sale.profit)}
                      </td>
                      <td className="p-2 text-center">
                        <button
                          className="text-red-500 hover:underline"
                          onClick={() =>
                            handleDelete(sale.saleId)
                          }
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50 font-medium">
                  <tr>
                    <td colSpan="2" className="p-2 text-right">
                      Totals:
                    </td>
                    <td className="p-2 text-right">
                      {sortedData.reduce(
                        (sum, sale) => sum + sale.quantitySold,
                        0
                      )}
                    </td>
                    <td className="p-2 text-right">-</td>
                    <td className="p-2 text-right">
                      {formatCurrency(
                        sortedData.reduce(
                          (sum, sale) => sum + parseFloat(sale.salesRevenue),
                          0
                        )
                      )}
                    </td>
                    <td className="p-2 text-right">
                      {formatCurrency(
                        sortedData.reduce(
                          (sum, sale) => sum + parseFloat(sale.totalCost),
                          0
                        )
                      )}
                    </td>
                    <td className="p-2 text-right">
                      {formatCurrency(
                        sortedData.reduce(
                          (sum, sale) => sum + parseFloat(sale.profit),
                          0
                        )
                      )}
                    </td>
                    <td className="p-2 text-right">-</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500">No sales data available</p>
        )}
      </div>
    </div>
  );
}

export default ProductProfitTable;
