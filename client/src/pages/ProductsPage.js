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

  const handleAddProfit = () => {
    setFormAction("add_product");
    setShowForm(true);
    setSelectedOption("none");
    setSelectedProduct(null);
  };
  const handleOptionSelect = (productId, option) => {
    const selectedProd = salesData.find((prod) => prod.id === productId);
    if (selectedProd) {
      setSelectedProduct(selectedProd);
      // option "edit_metrics"
      setSelectedOption(option);
      if (option === "edit_metrics") {
        setFormAction("edit_metrics");
        setShowForm(true);
      } else {
        setShowForm(false);
      }
    }
  };

  const handleOperationComplete = () => {
    // Call this function when the sales view is closed or metrics are edited (after every operation.)
    setShowForm(false);
    setFormAction("");
    setSelectedOption("none");
    setSelectedProduct(null);
  };

  const handleEditFormDisplay = () => {
    setShowForm(false);
  };

  return (
    <div className="flex ih-screen mt-10">
      <MainNavBar />
      {/* Left side bar */}
      <div className="w-1/4">
        <ProductToolBar handleAddProfit={handleAddProfit} />
        {/* Main Content Area */}
        </div>
        <div className="flex-1 bg-white p-4">
        {showForm && (
          <ProductForm
            onClose={() => setShowForm(false)}
            selectedOption={selectedOption}
            selectedProductId={selectedProduct?.id}
            formAction={formAction}
            onOperationComplete={handleOperationComplete}
          />
        )}
        {selectedProduct && selectedOption === "view_sales" && (
          <ProductProfitTable
            onClose={handleOperationComplete}
            selectedProduct={selectedProduct}
            onEdit={handleEditFormDisplay}
          />
        )}
        <div className="1/4">
        <ProductsList
          onOptionSelect={handleOptionSelect}
          selectedProduct={selectedProduct}
        />
        </div>
      </div>
    </div>
  );
}

export default ProductsPage;
