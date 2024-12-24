import React, { useContext } from "react";
import { SalesContext } from "../context/SalesContext";
import { formatCurrency } from "../utils";

// this table will show all product sales for a product, selected.
function ProductSalesTable({ selectedProductId, onClose }) {
  const { salesData } = useContext(SalesContext);

  // if productId exists, filter the state data to show product sales in the table. (productId === selectedProductId)
  const productProfits = salesData.filter(
    (profit) => profit.product_id === selectedProductId
  );


  // Extract sales with added total cost and profit
  const productSales = productProfits.flatMap((profit) => {
    // Get the product description from the first product entry
    const productDescription =
      profit.product?.[0]?.description || "Unknown Product";

    // Get the cost per unit from the first cost entry
    const costPerUnit = parseFloat(profit.costs?.[0]?.unit_value || 0);

    // Map each sale to include all required information
    return (
      profit.sales?.map((sale) => {
        const salesRevenue = parseFloat(sale.sales_revenue) || 0;
        const quantitySold = parseInt(sale.quantity_sold) || 0;
        const totalCost = costPerUnit * quantitySold;
        const profitAmount = salesRevenue - totalCost;

        return {
          saleDate: new Date(sale.sale_date).toLocaleDateString(),
          salesRevenue: salesRevenue.toFixed(2),
          quantitySold: quantitySold,
          unitSalePrice: parseFloat(sale.unit_sale_price).toFixed(2),
          totalCost: totalCost.toFixed(2),
          profit: profitAmount.toFixed(2),
          productDescription: productDescription,
          id: sale.id,
        };
      }) || []
    );
  });

// Sort data by date
const sortedData = productSales.sort(
  (a, b) => new Date(a.saleDate) - new Date(b.saleDate)
);

return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur">
    <div className="relative bg-white shadow rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      {/* Close Button */}
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        onClick={onClose}
      >
        ✕
      </button>
      {/* Check if there's any data */}
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
                </tr>
              </thead>
              <tbody>
                {sortedData.map((sale, index) => (
                  <tr key={sale.id} className="border-b hover:bg-gray-50">
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
                  </tr>
                ))}
              </tbody>
              {/* Footer for Totals */}
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

export default ProductSalesTable;
