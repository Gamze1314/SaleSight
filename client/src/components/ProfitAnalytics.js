import React, { useContext } from 'react'
// import Profit Context
import { ProfitContext } from '../context/ProfitContext'

function ProfitAnalytics() {

  console.log("Profit Analytics rendered.")

  const { profitsData, error } = useContext(ProfitContext)

  console.log(profitsData)

  return (
    <div>ProfitAnalytics
      {profitsData.map((p) => (
        <div key={p.id}>
          <p>Profit ID: {p.id}</p>
          <p>Product ID: {p.product_id}</p>
          <p>Quantity: {p.quantity}</p>
          <p>Price: {p.price}</p>
        </div>
      ))}
    </div>
  )
}


export default ProfitAnalytics