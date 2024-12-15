import React, { useState } from 'react'
import MainNavBar from '../components/MainNavBar'
import ProductsList from '../components/ProductsList'
import ProductToolBar from '../components/ProductToolBar'
import ProductForm from '../components/ProductForm'


//Sales Context has products that need to be displayed here.
//renders NavBar and ProductsList.
function ProductsPage() {
  const [showForm, setShowForm] = useState(false); // state to manage form visibility.
  const [selectedProduct, setSelectedProduct] = useState(null); // state to store selected product

  // Handle product edit
  const handleEdit = (product) => {
    setSelectedProduct(product); // Set the selected product
    setShowForm(true); // Show the form
  };

  // Handle product deletion
  const handleDelete = (productId) => {
    // Your deletion logic here (e.g., make an API call)
    console.log("Product deleted:", productId);
  };

  return (
    <div className="flex items-center justify-between w-full mt-10">
      <MainNavBar />
      {/* Content Wrapper */}
      <div className="w-full mt-6">
        <ProductToolBar setShowForm={setShowForm} />
        {showForm && selectedProduct && (
          <ProductForm
            product={selectedProduct} // Pass the selected product details to ProductForm
            onClose={() => setShowForm(false)} // Close the form when done
          />
        )}
        <ProductsList onEdit={handleEdit} onDelete={handleDelete} />
      </div>
    </div>
  );
}

export default ProductsPage