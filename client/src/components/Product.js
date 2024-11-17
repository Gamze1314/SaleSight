import React from 'react'
// import sales context to display the product details.

function Product({ product }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">{product.description}</h3>
      <p className="text-sm text-gray-600">ID: {product.id}</p>
      <p className="text-sm text-gray-800 font-medium">
        Price: {product.UNIT_VALUE}
      </p>
    </div>
  );
}

export default Product