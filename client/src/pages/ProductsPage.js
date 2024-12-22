import React, { useState, useContext } from "react";
import MainNavBar from "../components/MainNavBar";
import ProductsList from "../components/ProductsList";
import ProductToolBar from "../components/ProductToolBar";
import ProductForm from "../components/ProductForm";
import ProductSalesTable from "../components/ProductSalesTable";
import { SalesContext } from "../context/SalesContext";

//Sales Context has products that need to be displayed here.
//renders NavBar and ProductsList.
function ProductsPage() {
  const { productPageData, error } = useContext(SalesContext);
  const [showForm, setShowForm] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedOption, setSelectedOption] = useState("none");
  // add new state to track formAction..
  const [formAction, setFormAction] = useState("")
  
  // update state depending on the action if ediit mode then " edit_metrics"
  // if add_product... "add_product"


    const handleAddProfit = () => {
      setFormAction("add_product"); // Set action for adding a new product
      setShowForm(true);
      setSelectedOption("none");
      setSelectedProductId(null); // Reset selected product
    };

  // const handleEditMetrics = (productId) => {
  //   setShowForm(true);
  //   setFormAction("edit_metrics"); // Set action for editing metrics
  //   setSelectedProductId(productId); // Set the selected product ID
  // };

  const handleOptionSelect = (productId, option) => {
    //SET PRODUCT ID
    setSelectedProductId(productId);
    // option "edit_metrics"
    setSelectedOption(option);
    if (option === "edit_metrics") {
      setFormAction("edit_metrics")
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

  return (
    <div className="flex items-center justify-between w-full mt-10">
      <MainNavBar />
      <div className="w-full mt-6">
        <ProductToolBar handleAddProfit={handleAddProfit} />
        {/* Render the form if "edit_metrics" is selected */}
        {showForm && (
          <ProductForm
            productPageData={productPageData}
            onClose={() => setShowForm(false)}
            selectedOption={selectedOption}
            selectedProductId={selectedProductId} // Pass selectedProductId to the form
            formAction={formAction} // Pass formAction to the form
          />
        )}
        {selectedProductId && selectedOption === "view_sales" && (
          <ProductSalesTable
            onClose={handleOperationComplete}
            selectedProductId={selectedProductId}
          />
        )}
        <ProductsList
          onOptionSelect={handleOptionSelect} //// Handle product and option selection
        />
      </div>
    </div>
  );
}

export default ProductsPage;
