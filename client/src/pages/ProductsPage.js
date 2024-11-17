import React from 'react'
import MainNavBar from '../components/MainNavBar'
import ProductsList from '../components/ProductsList'
import ProductToolBar from '../components/ProductToolBar'


//Sales Context has products that need to be displayed here.
//renders NavBar and ProductsList.
function ProductsPage() {
  return (
    <div className="flex items-center justify-between w-full mt-10">
      <MainNavBar />
      {/* Content Wrapper */}
      <div className="w-full mt-6">
        <ProductToolBar />
        <ProductsList />
      </div>
    </div>
  );
}

export default ProductsPage