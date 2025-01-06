import React, { useState, useContext, useEffect } from "react";
import { SalesContext } from "../context/SalesContext";
import { formatCurrency } from "../utils";

function ProductProfitTable({ onClose, selectedProduct }) {
  const { deleteProductSale, updateSale, error, salesData } =
    useContext(SalesContext);
  const [editSaleId, setEditSaleId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [localData, setLocalData] = useState([]);

  const prodData = salesData.find((prod) => prod.id === selectedProduct.id);

  // Process and set initial data
  useEffect(() => {
    if (prodData?.sales) {
      const processedSales = prodData.sales.map((sale) => {
        const salesRevenue = parseFloat(sale.sales_revenue) || 0;
        const quantitySold = parseInt(sale.quantity_sold) || 0;
        const totalCost = parseFloat(sale.total_cost || 0);
        const profitAmount = salesRevenue - totalCost || 0;

        return {
          saleDate: new Date(sale.sale_date).toLocaleDateString(),
          salesRevenue: salesRevenue.toFixed(2) || 0,
          quantitySold: quantitySold,
          unitSalePrice: parseFloat(sale.unit_sale_price).toFixed(2) || 0,
          totalCost: parseFloat(totalCost).toFixed(2) || 0,
          profit: parseFloat(profitAmount).toFixed(2) || 0,
          saleId: sale.sale_id,
          productId: prodData.id,
          productDescription: prodData.description,
          quantityPurchased: sale.quantity_purchased,
        };
      });

      // Sort the data
      const sortedData = processedSales.sort(
        (a, b) => new Date(a.saleDate) - new Date(b.saleDate)
      );

      setLocalData(sortedData);
    }
  }, [selectedProduct]);

  const handleDelete = async (saleId) => {
    alert("Are you sure you want to delete this profit metric?");
    deleteProductSale(saleId);
    // Update local data after successful deletion
    setLocalData((prevData) => {
      const updatedData = prevData.filter((sale) => sale.saleId !== saleId);
      return updatedData;
    });
  };

  const handleUpdate = (saleId) => {
    setEditSaleId(saleId);
    const sale = localData.find((sale) => sale.saleId === saleId);
    setEditValues({
      quantitySold: sale.quantitySold,
      unitSalePrice: sale.unitSalePrice,
      quantityPurchased: sale.quantityPurchased,
    });
  };

  const handleSave = async (saleId) => {
    // 10 , 15
    const sale = localData.find((sale) => sale.saleId === saleId);

    const updatedTotalSold =
      selectedProduct.total_quantity_sold +
      (Number(editValues.quantitySold) - sale.quantity_sold);
    console.log(
      selectedProduct.total_quantity_purchased,
      selectedProduct.total_quantity_sold,
      Number(editValues.quantitySold)
    );
    if (
      selectedProduct.total_quantity_purchased <
        Number(editValues.quantitySold) ||
      selectedProduct.total_quantity_purchased < updatedTotalSold
    ) {
      alert(
        `Quantity sold cannot be greater than quantity purchased.The quantity purchased is ${selectedProduct.total_quantity_purchased}.`
      );
      return;
    }

    try {
      const updatedValues = {
        quantity_sold: parseInt(editValues.quantitySold, 10),
        unit_sale_price: parseFloat(editValues.unitSalePrice),
      };

      const updatedSale = await updateSale(editValues, saleId);

      const updatedSales = localData.map((sale) =>
        sale.saleId === saleId
          ? {
              ...sale,
              quantitySold: updatedValues.quantity_sold,
              unitSalePrice: updatedValues.unit_sale_price.toFixed(2),
              salesRevenue: (
                updatedValues.quantity_sold * updatedValues.unit_sale_price
              ).toFixed(2),
              profit: (
                updatedValues.quantity_sold * updatedValues.unit_sale_price -
                parseFloat(sale.totalCost)
              ).toFixed(2),
            }
          : sale
      );
      setLocalData(updatedSales);
      setEditSaleId(null);
    } catch (err) {
      alert("Failed to update ");
      console.error("Failed to update sale:", err);
      // Handle error appropriately
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
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
        {error && <div className="text-red-700">{error}</div>}
        <p className="text-center text-lg text-black-500">Profit Table</p>
        {localData.length > 0 ? (
          <>
            <h4 className="text-md font-medium mb-4">
              The sales data is shown for Product: '
              {localData[0].productDescription}'
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 text-left">Sale ID</th>
                    <th className="p-2 text-left">Date</th>
                    <th className="p-2 text-right">Quantity Sold</th>
                    <th className="p-2 text-right">Sale Price</th>
                    <th className="p-2 text-right">Sales Revenue</th>
                    <th className="p-2 text-right">Total Cost</th>
                    <th className="p-2 text-right">
                      {selectedProduct?.total_profit_amount < 0
                        ? "Loss"
                        : "Profit"}
                    </th>
                    <th className="p-2 text-center"></th>
                  </tr>
                </thead>
                <tbody>
                  {localData.map((sale, index) => (
                    <tr
                      key={sale.saleId ? sale.saleId : index}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="p-2">{index + 1}</td>
                      <td className="p-2">{sale.saleDate}</td>
                      <td className="p-2 text-right">
                        {editSaleId === sale.saleId ? (
                          <input
                            type="number"
                            name="quantitySold"
                            value={editValues.quantitySold}
                            onChange={handleChange}
                            className="w-full text-right"
                          />
                        ) : (
                          sale.quantitySold
                        )}
                      </td>
                      <td className="p-2 text-right">
                        {editSaleId === sale.saleId ? (
                          <input
                            type="number"
                            name="unitSalePrice"
                            value={editValues.unitSalePrice}
                            onChange={handleChange}
                            className="w-full text-right"
                          />
                        ) : (
                          formatCurrency(sale.unitSalePrice)
                        )}
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
                      <td className="p-2 text-center flex justify-center">
                        {/* conditional rendering if edit is clicked , hide delete, show save. */}
                        {editSaleId === sale.saleId && !error ? (
                          <>
                            <button
                              className="text-green-500 mr-4 hover:underline"
                              onClick={() => handleSave(sale.saleId)}
                            >
                              Save
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="text-blue-500 mr-4 hover:underline"
                              onClick={() => handleUpdate(sale.saleId)}
                            >
                              Update
                            </button>
                            <button
                              className="text-red-500 font-bold hover:underline"
                              onClick={() => handleDelete(sale.saleId)}
                            >
                              X
                            </button>
                          </>
                        )}
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
                      {localData.reduce(
                        (sum, sale) => sum + sale.quantitySold,
                        0
                      )}
                    </td>
                    <td className="p-2 text-right">-</td>
                    <td className="p-2 text-right">
                      {formatCurrency(
                        localData.reduce(
                          (sum, sale) => sum + parseFloat(sale.salesRevenue),
                          0
                        )
                      )}
                    </td>
                    <td className="p-2 text-right">
                      {formatCurrency(
                        localData.reduce(
                          (sum, sale) => sum + parseFloat(sale.totalCost),
                          0
                        )
                      )}
                    </td>
                    <td className="p-2 text-right">
                      {formatCurrency(
                        localData.reduce(
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
          <p className="text-center text-gray-500">
            No sales data found for product '{prodData.description}'. Please
            navigate to Select Action Tab, then select 'Add Profit Metrics'
            option to add sales data.
          </p>
        )}
      </div>
    </div>
  );
}

export default ProductProfitTable;
