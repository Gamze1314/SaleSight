import { Link } from "react-router-dom";

function ErrorPage() {
  // Display different error information based on the structure
  return (
    <div className="flex flex-col justify-center items-center p-8 mt-8">
      <h1 className="text-red-600 font-bold text-2md">
        Something went wrong...Please check the URL address you have entered.
      </h1>
      <button className="bg-blue-600 text-white p-2 rounded mt-10">
        <Link to="/authentication">Return Home Page</Link>
      </button>
    </div>
  );
}

export default ErrorPage;
