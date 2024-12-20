import React, { useState, useMemo, useContext } from "react";
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

  const [showForm, setShowForm] = useState(false); // state to manage form visibility.
  const [isChecked, setIsChecked] = useState(false);
  // state to manage sales table visibility.
  const [showSalesTable, setShowSalesTable] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedOption, setSelectedOption] = useState("none");

  const handleOperationComplete = () => {
    // Call this function when the sales view is closed or metrics are edited (after every operation.)
    setSelectedOption("none"); // Reset the dropdown to "none"
    setSelectedProductId(null); // Reset the selected product ID
  };

  return (
    <div className="flex items-center justify-between w-full mt-10">
      <MainNavBar />
      {/* Content Wrapper */}
      <div className="w-full mt-6">
        <ProductToolBar setShowForm={setShowForm} />
        {showForm && (
          <ProductForm
            productPageData={productPageData}
            onClose={() => setShowForm(false)}
            isChecked={isChecked}
          />
        )}
        {/*  logic to show sales table if showSalesTable and isChecked true */}
        {selectedProductId ? (
          <ProductSalesTable
            onClose={handleOperationComplete}
            selectedProductId={selectedProductId}
          />
        ) : null}
        <ProductsList
          isChecked={isChecked}
          setSelectedProductId={setSelectedProductId}
          setSelectedOption={setSelectedOption}
          selectedOption={selectedOption}
        />
      </div>
    </div>
  );
}

export default ProductsPage;
