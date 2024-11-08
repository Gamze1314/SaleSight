import React, { useContext } from 'react'
import { CostContext } from '../context/CostContext'

function CostAnalytics() {

    const { costData , error } = useContext(CostContext)



  return (
    <div>
        CostAnalytics
        {error ? <p>{error}</p> : null}
        {costData.map((c) => (
            <div key={c.id}>
                <p>Cost ID: {c.id}</p>
                <p>Product ID: {c.product_id}</p>
                <p>Quantity: {c.quantity}</p>
                <p>Price: {c.price}</p>
            </div>
        ))}
    </div>
  )
}

export default CostAnalytics