// this page will explain what SaleSight offers to users.
// (unprotected route)
// renders LogInNavBar and key points.

import React, { useState, useEffect } from "react";
import LogInNavBar from "../components/LogInNavBar";

// Import images for cards
import pie from "../assets/pie.png";
import profit from "../assets/profit.png";
import revenue from "../assets/revenue.png";
import data from "../assets/data.png";

function About() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [cardVisible, setCardVisible] = useState([false, false, false]);

  useEffect(() => {
    const messageTimer = setTimeout(() => {
      setMessage(
        "Welcome to SaleSight! Your Revenue and Profit Management Tool"
      );
      setLoading(false);
    }, 1000);

    cardVisible.forEach((_, index) => {
      setTimeout(() => {
        setCardVisible((prev) => {
          const newVisibility = [...prev];
          newVisibility[index] = true;
          return newVisibility;
        });
      }, (index + 1) * 1000 + 1000);
    });

    return () => clearTimeout(messageTimer);
  }, []);

  return (
    <>
      <LogInNavBar />
      <div className="flex flex-col justify-center bg-gray-100 min-h-screen pt-3">
        <div className="h-content-height flex-col flex items-center justify-center mb-6 transition-shadow duration-300 ease-in-out hover:shadow-red-900">
          {loading ? (
            <p className="text-gray-600 text-center text-xl w-full max-w-5xl mt-6 p-4">
              Loading...
            </p>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-gray-800">{message}</h1>
              <p className="text-gray-600 text-center text-xl w-full max-w-5xl mt-6 p-4">
                At SaleSight, we believe tracking your product sales and
                maximizing profits should be effortless and intuitive, with the
                power of real-time updates at your fingertips. Whether you’re an
                e-commerce seller or a large enterprise, our platform is crafted
                to simplify your sales management and boost profit optimization,
                making growth easier than ever.
              </p>
              <p className="text-gray-600 text-center text-xl w-full max-w-5xl mt-6 p-4">
                And we believe in numbers, which drive our insights and
                decisions.
              </p>
              <img src={data} alt="data" className="h-20 ml-4" />
            </>
          )}
        </div>

        {/* Key Points Section */}
        <div className="flex justify-center space-x-6 max-w-5xl mx-auto">
          {cardVisible[0] && (
            <div className="bg-blue-100 rounded-lg shadow-lg p-8 flex flex-row items-center justify-between mb-6 transition-shadow duration-300 ease-in-out hover:shadow-red-900 w-full max-w-md">
              <div className="flex flex-col">
                <h2 className="text-2xl font-bold text-gray-800">
                  Profit Intelligence
                </h2>
                <p className="text-gray-600 mt-2 text-xl">
                  Streamlines profit calculation for each product and visualizes
                  cost and revenue with business analytics tools.
                </p>
              </div>
              <img src={pie} alt="Sale Insight" className="h-20 ml-4" />
            </div>
          )}

          {cardVisible[1] && (
            <div className="bg-blue-100 rounded-lg shadow-lg p-6 flex flex-row items-center justify-between mb-8 transition-shadow duration-300 ease-in-out hover:shadow-red-900 w-full max-w-md">
              <div className="flex flex-col">
                <h2 className="text-2xl font-bold text-gray-800">
                  Cost Optimization
                </h2>
                <p className="text-gray-600 mt-2 text-xl">
                  Designed to calculate and track revenues, sales, costs, and
                  profits for products sold by users.
                </p>
              </div>
              <img
                src={profit}
                alt="Profit Optimization"
                className="h-20 ml-4"
              />
            </div>
          )}

          {cardVisible[2] && (
            <div className="bg-blue-100 rounded-lg shadow-lg p-6 flex flex-row items-center justify-between mb-8 transition-shadow duration-300 ease-in-out hover:shadow-red-900 w-full max-w-md">
              <div className="flex flex-col">
                <h2 className="text-2xl font-bold text-gray-800">
                  Real-Time Revenue Management
                </h2>
                <p className="text-gray-600 mt-2 text-xl">
                  Continuously track and monitor changes in revenue, sales, and
                  costs, providing immediate insights into business health.
                </p>
              </div>
              <img
                src={revenue}
                alt="Real-Time Revenue Management"
                className="h-24 ml-4"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default About;
