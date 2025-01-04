import React, { useContext, useState } from "react";
import MainNavBar from "../components/MainNavBar";
import ProductsList from "../components/ProductsList";
import ProductToolBar from "../components/ProductToolBar";
import ProductForm from "../components/ProductForm";
import ProductProfitTable from "../components/ProductProfitTable";
import { SalesContext } from "../context/SalesContext";

function ProductsPage() {
  const { salesData } = useContext(SalesContext);
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedOption, setSelectedOption] = useState("none");
  const [formAction, setFormAction] = useState("");

  // edit sale mode => formAction(""), showForm(False), selectedOption("view_sales"), selectedProduct = (not null),
  // show ProductSaleTable with product and sale details.

  // update state depending on the action if edit mode then " edit_metrics"
  // if add_product... "add_product"

  const handleAddProfit = () => {
    setFormAction("add_product"); // Set action for adding a new product
    setShowForm(true);
    setSelectedOption("none");
    setSelectedProduct(null); // Reset selected product
  };
  const handleOptionSelect = (productId, option) => {
    //SET PRODUCT ID
    const selectedProd = salesData.find((prod) => prod.id === productId);
    if (selectedProd) {
      setSelectedProduct(selectedProd);
      // option "edit_metrics"
      setSelectedOption(option);
      if (option === "edit_metrics") {
        setFormAction("edit_metrics");
        setShowForm(true); // Show the form when "edit_metrics" is selected
      } else {
        setShowForm(false); // Hide the form for other options
      }
    }
  };

  const handleOperationComplete = () => {
    // Call this function when the sales view is closed or metrics are edited (after every operation.)
    setShowForm(false);
    setFormAction(""); // Reset form action
    setSelectedOption("none"); // Reset the dropdown to "none"
    setSelectedProduct(null); // Reset the selected product ID
  };

  const handleEditFormDisplay = () => {
    setShowForm(false);
  };

  return (
    <div className="flex items-center justify-between w-full mt-10">
      <MainNavBar />
      <div className="w-full mt-6">
        <ProductToolBar handleAddProfit={handleAddProfit} />
        {/* Render the form if "edit_metrics" is selected */}
        {showForm && (
          <ProductForm
            onClose={() => setShowForm(false)}
            selectedOption={selectedOption}
            selectedProductId={selectedProduct?.id} // Pass selectedProductId to the form
            formAction={formAction} // Pass formAction to the form
            onOperationComplete={handleOperationComplete} // Handle operationComplete
          />
        )}
        {selectedProduct && selectedOption === "view_sales" && (
          <ProductProfitTable
            onClose={handleOperationComplete}
            selectedProduct={selectedProduct}
            onEdit={handleEditFormDisplay}
          />
        )}
        {/* {selectedProduct && showEditForm && (
          <ProductSaleEditForm
            onClose={handleOperationComplete}
            selectedProduct={selectedProduct}
          />
        )} */}
        <ProductsList
          onOptionSelect={handleOptionSelect} //// Handle product and option selection
          selectedProduct={selectedProduct}
        />
      </div>
    </div>
  );
}

export default ProductsPage;
