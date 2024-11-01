//  /sale GET request. updates state.

import React, { useState , useEffect, createContext } from 'react';

export const SalesContext = createContext([])

export const SalesProvider = ({ children }) => {

    const [salesData, setSalesData] = useState([]);
    const [error, setError] = useState(null); // error state for saleContext


    // function to manage sale data

    //fetchSalesData()
    useEffect(() => {
        const fetchSalesData = async () => {
            try {
                const res = await fetch("/sales");
                if (res.ok) {
                    const data = await res.json();
                    setSalesData(data);
                }
            } catch (err) {
                setError(err);
                console.error(err);
            }
        }

        fetchSalesData();
    }, []);

    //clear error state 




  return (
    <SalesContext.Provider value={{ salesData, error }}>
      {children}
    </SalesContext.Provider>
  );


};