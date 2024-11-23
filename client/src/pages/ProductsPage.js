import React, { useState } from 'react'
import MainNavBar from '../components/MainNavBar'
import ProductsList from '../components/ProductsList'
import ProductToolBar from '../components/ProductToolBar'
import ProductForm from '../components/ProductForm'


//Sales Context has products that need to be displayed here.
//renders NavBar and ProductsList.
function ProductsPage() {
  const [showForm, setShowForm] = useState(false); // state to manage form visibility.


  return (
    <div className="flex items-center justify-between w-full mt-10">
      <MainNavBar />
      {/* Content Wrapper */}
      <div className="w-full mt-6">
        <ProductToolBar setShowForm={setShowForm} />
        {showForm && (
          <ProductForm onClose={() => setShowForm(false)} />
        )}
        <ProductsList />
      </div>
    </div>
  );
}

export default ProductsPage