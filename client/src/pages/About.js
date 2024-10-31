// this page will explain what SaleSight offers to users.
// no need to be authenticated (unprotected route)
// renders LogInNavBar and key points.

// p tag or main to explain what SaleSight offers to users.
// 3 DIVS ALIGNED horizontally : Key Points; sale Insight, Profit Optimization and Real Time Revenue Management 


// box shadow, box inside of div and image . 
import React, { useState, useEffect } from "react";
import LogInNavBar from "../components/LogInNavBar";

// Import images for cards
import pie from "../assets/pie.png";
import profit from "../assets/profit.png";
import revenue from "../assets/revenue.png";


function About() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [showCards, setShowCards] = useState(false);

  useEffect(() => {
    // Load welcome message asynchronously with a 2-second delay
    const messageTimer = setTimeout(() => {
      setMessage(
        "Welcome to SaleSight! Your Revenue and Profit Management Tool"
      );
      setLoading(false);
    }, 2000);

    // Show cards after another 3 seconds
    const cardsTimer = setTimeout(() => {
      setShowCards(true);
    }, 5000); // 2000 ms for message + 3000 ms for card display

    // Cleanup the timers on component unmount
    return () => {
      clearTimeout(messageTimer);
      clearTimeout(cardsTimer);
    };
  }, []); // Empty dependency array to run only on mount

  // show cards 1 seconds after one card mounted.

  return (
    <>
      <LogInNavBar />
      {/*  flex-col stacks elements vertically */}
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
            </>
          )}
        </div>

        {/* Key Points Section */}
        {showCards && ( // Show cards only when showCards is true
          <div className="flex flex-col justify-center space-x-6 max-w-5xl mx-auto">
            {/* Card 1: Sale Insight */}
            <div className="bg-blue-100 rounded-lg shadow-lg p-6 flex flex-row items-center justify-between mb-8 transition-shadow duration-300 ease-in-out hover:shadow-red-900">
              {/* Text Content */}
              <div className="flex flex-col">
                <h2 className="text-2xl font-bold text-gray-800">
                  Sale Insight
                </h2>
                <p className="text-gray-600 mt-2 text-xl">
                  Streamlines profit calculation for each product and visualizes
                  cost and revenue with pies and charts.
                </p>
              </div>

              {/* Image on the right */}
              <img src={pie} alt="Sale Insight" className="h-20 ml-4" />
            </div>

            {/* Card 2: Profit Optimization */}
            <div className="bg-blue-100 rounded-lg shadow-lg p-6 flex flex-row items-center justify-between mb-8 transition-shadow duration-300 ease-in-out hover:shadow-red-900">
              {/* Text Content */}
              <div className="flex flex-col">
                <h2 className="text-2xl font-bold text-gray-800">
                  Profit Optimization
                </h2>
                <p className="text-gray-600 mt-2 text-xl">
                  Designed to calculate and track revenues, sales, costs, and
                  profits for products sold by users.
                </p>
              </div>

              {/* Image on the right */}
              <img
                src={profit}
                alt="Profit Optimization"
                className="h-20 ml-4"
              />
            </div>

            {/* Card 3: Real-Time Revenue Management */}
            <div className="bg-blue-100 rounded-lg shadow-lg p-6 flex flex-row items-center justify-between mb-8 transition-shadow duration-300 ease-in-out hover:shadow-red-900">
              {/* Text Content */}
              <div className="flex flex-col">
                <h2 className="text-2xl font-bold text-gray-800">
                  Real-Time Revenue Management
                </h2>
                <p className="text-gray-600 mt-2 text-xl">
                  Continuously track and monitor changes in revenue, sales, and
                  costs, providing immediate insights into business health.
                </p>
              </div>

              {/* Image on the right */}
              <img
                src={revenue}
                alt="Real-Time Revenue Management"
                className="h-24 ml-4"
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default About;

