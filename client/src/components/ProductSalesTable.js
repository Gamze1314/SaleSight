import React, { useContext } from "react";
import { SalesContext } from "../context/SalesContext";
import { formatCurrency } from "../utils";

// this table will show all product sales for a product, selected.
function ProductSalesTable({ selectedProductId, onClose }) {
  const { error, salesData } = useContext(SalesContext);

  console.log(selectedProductId);

  // if productId exists, filter the state data to show product sales in the table. (productId === selectedProductId)
  const productProfits = salesData.filter(
    (profit) => profit.product_id === selectedProductId
  );

  // extract sales from productProfits
  // show sale date, sales revenue, quantity sold, unit sale price, product description

  const productSales = productProfits.flatMap((profit) => {
    // Get the product description from the first product entry
    const productDescription =
      profit.product?.[0]?.description || "Unknown Product";

    // Map each sale to include all required information
    return (
      profit.sales?.map((sale) => ({
        saleDate: new Date(sale.sale_date).toLocaleDateString(),
        salesRevenue: parseFloat(sale.sales_revenue).toFixed(2),
        quantitySold: sale.quantity_sold,
        unitSalePrice: parseFloat(sale.unit_sale_price).toFixed(2),
        productDescription: productDescription,
        id: sale.id,
      })) || []
    );
  });


  if (error) {
    // Use error.message to display only the message part of the error
    return <div>{error.message}</div>;
  }

  // Sort data by date
  const sortedData = productSales.sort(
    (a, b) => new Date(a.date) - new Date(b.date)
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
            Sales Details for Product: {sortedData[0].productDescription}
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
                  </tr>
                ))}
              </tbody>
              {/* Optional Footer for Totals */}
              <tfoot className="bg-gray-50 font-medium">
                <tr>
                  <td colSpan="2" className="p-2 text-right">Totals:</td>
                  <td className="p-2 text-right">
                    {sortedData.reduce((sum, sale) => sum + sale.quantitySold, 0)}
                  </td>
                  <td className="p-2 text-right">-</td>
                  <td className="p-2 text-right">
                    {formatCurrency(
                      sortedData.reduce((sum, sale) => sum + parseFloat(sale.salesRevenue), 0)
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
