import React, { useContext } from 'react'
import { SalesContext } from '../context/SalesContext'

function SaleAnalytics() {

    console.log("Sale Analytics rendered.")

    const { salesData, error } = useContext(SalesContext)

    console.log(salesData)

  return (
    <div>SaleAnalytics
        {salesData.map((s) => (
            <div key={s.id}>
                <p>Sale ID: {s.id}</p>
                <p>Product ID: {s.product_id}</p>
                <p>Quantity: {s.quantity}</p>
                <p>Price: {s.price}</p>
            </div>
        ))}
    </div>
  )
}

export default SaleAnalytics