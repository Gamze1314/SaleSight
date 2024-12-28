import React, { useState } from "react";
import MainNavBar from "../components/MainNavBar";
import ProductsList from "../components/ProductsList";
import ProductToolBar from "../components/ProductToolBar";
import ProductForm from "../components/ProductForm";
import ProductSalesTable from "../components/ProductSalesTable";

//Sales Context has products that need to be displayed here.
//renders NavBar and ProductsList.
function ProductsPage() {
  const [showForm, setShowForm] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedOption, setSelectedOption] = useState("none");
  // add new state to track formAction..
  const [formAction, setFormAction] = useState("");

  // update state depending on the action if edit mode then " edit_metrics"
  // if add_product... "add_product"

  const handleAddProfit = () => {
    setFormAction("add_product"); // Set action for adding a new product
    setShowForm(true);
    setSelectedOption("none");
    setSelectedProductId(null); // Reset selected product
  };

  const handleOptionSelect = (productId, option) => {
    //SET PRODUCT ID
    setSelectedProductId(productId);
    // option "edit_metrics"
    setSelectedOption(option);
    if (option === "edit_metrics") {
      setFormAction("edit_metrics");
      setShowForm(true); // Show the form when "edit_metrics" is selected
    } else {
      setShowForm(false); // Hide the form for other options
    }
  };

  const handleOperationComplete = () => {
    // Call this function when the sales view is closed or metrics are edited (after every operation.)
    setShowForm(false);
    setFormAction(""); // Reset form action
    setSelectedOption("none"); // Reset the dropdown to "none"
    setSelectedProductId(null); // Reset the selected product ID
  };


  // const consolidatedProductData = salesData.reduce((acc, profitData) => {
  //   const relevantCosts = profitData.costs?.[0];
  //   const product = profitData.product?.[0];

  //   if (!product) return acc;

  //   const productName = product.description
  //     ? stringFormatter(product.description)
  //     : "Unknown Product";

  //   const sales = Array.isArray(profitData.sales) ? profitData.sales : [];

  //   const totalSalesRevenue = sales.reduce(
  //     (acc, sale) => acc + (parseFloat(sale.sales_revenue) || 0),
  //     0
  //   );

  //   const totalQuantitySold = sales.reduce(
  //     (acc, sale) => acc + (parseInt(sale.quantity_sold) || 0),
  //     0
  //   );

  //   // Check if productId already exists in accumulator
  //   const existingProduct = acc.find((item) => item.productId === product.id);

  //   if (existingProduct) {
  //     // Update existing product totals and merge sales data
  //     existingProduct.total_sales_revenue += totalSalesRevenue;
  //     existingProduct.total_quantity_sold += totalQuantitySold;
  //     existingProduct.total_quantity_purchased +=
  //       relevantCosts?.quantity_purchased || 0;
  //     existingProduct.sales = existingProduct.sales.concat(
  //       sales.map((sale) => ({
  //         saleDate: new Date(sale.sale_date).toLocaleDateString(),
  //         salesRevenue: parseFloat(sale.sales_revenue).toFixed(2),
  //         quantitySold: sale.quantity_sold,
  //         unitSalePrice: parseFloat(sale.unit_sale_price).toFixed(2),
  //         id: sale.id,
  //       }))
  //     );
  //   } else {
  //     // Add new product entry
  //     acc.push({
  //       profitId: profitData.id,
  //       productId: product.id,
  //       description: productName,
  //       // unit value for edit metrics functionality
  //       unit_value: relevantCosts?.unit_value || 0,
  //       total_sales_revenue: totalSalesRevenue,
  //       total_quantity_sold: totalQuantitySold,
  //       total_quantity_purchased: relevantCosts?.quantity_purchased || 0,
  //       sales: sales.map((sale) => ({
  //         saleDate: new Date(sale.sale_date).toLocaleDateString(),
  //         salesRevenue: parseFloat(sale.sales_revenue).toFixed(2),
  //         quantitySold: sale.quantity_sold,
  //         unitSalePrice: parseFloat(sale.unit_sale_price).toFixed(2),
  //         id: sale.id,
  //       })),
  //     });
  //   }

  //   return acc;
  // }, []);

  // // consolidatedData is an array with objects (each object has product and related sales data as above)
  // const productProfits =
  //   userInventory.map((product) => {
  //     const profit = consolidatedProductData.find(
  //       (p) => p.productId === product.id
  //     );
  //     return { product, profit };
  //   }) || [];


  // console.log(productProfits);


  return (
    <div className="flex items-center justify-between w-full mt-10">
      <MainNavBar />
      <div className="w-full mt-6">
        <ProductToolBar handleAddProfit={handleAddProfit} />
        {/* Render the form if "edit_metrics" is selected */}
        {showForm && (
          <ProductForm
            // productProfits={productProfits}
            onClose={() => setShowForm(false)}
            selectedOption={selectedOption}
            selectedProductId={selectedProductId} // Pass selectedProductId to the form
            formAction={formAction} // Pass formAction to the form
            onOperationComplete={handleOperationComplete} // Handle operationComplete
          />
        )}
        {selectedProductId && selectedOption === "view_sales" && (
          <ProductSalesTable
            onClose={handleOperationComplete}
            selectedProductId={selectedProductId}
          />
        )}
        <ProductsList
          // productProfits={productProfits}
          selectedProductId={selectedProductId}
          onOptionSelect={handleOptionSelect} //// Handle product and option selection
        />
      </div>
    </div>
  );
}

export default ProductsPage;
