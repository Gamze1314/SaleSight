import React, { useState, useEffect } from "react";
import LogInNavBar from "../components/LogInNavBar";
import { useFormik } from "formik";
import * as yup from "yup";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { NavLink, useLocation } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";

function Authentication() {
  const { login, authError, setAuthError, signup } = useContext(AuthContext);
  const location = useLocation();

  const [formType, setFormType] = useState(
    location.pathname === "/signup" ? "signup" : "login"
  );

  const initialValues =
    formType === "signup"
      ? { username: "", password: "", name: "", email: "" }
      : { username: "", password: "" };

  const validationSchema =
    formType === "signup"
      ? yup.object({
          username: yup.string().required("Username is required"),
          password: yup.string().required("Password is required"),
          name: yup.string().required("Name is required"),
          email: yup
            .string()
            .email("Invalid email")
            .required("Email is required"),
        })
      : yup.object({
          username: yup.string().required("Username is required"),
          password: yup.string().required("Password is required"),
        });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      if (formType === "signup") {
        signup(values.username, values.password, values.name, values.email);
        formik.resetForm();
      } else {
        login(values.username, values.password);
        formik.resetForm();
      }
    },
  });

  useEffect(() => {
    if (location.pathname === "/signup") {
      formik.resetForm();
      setFormType("signup");
    } else {
      setFormType("login");
      formik.resetForm();
    }
  }, [location.pathname]);

  // useEffect to clear previous error state if signup or login switch is done.
  useEffect(() => {
    if (formType === "signup" || formType === "login") {
      setAuthError("");
    }
  }, [formType, setAuthError]);

  // Styling classes
  const formClass =
    "bg-white shadow-black p-3 rounded-md shadow-lg w-full max-w-sm md:w-1/3 items-center transition-shadow duration-300 ease-in-out hover:shadow-red-900";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <LogInNavBar />
      <main className="flex flex-col items-center w-full mt-8">
        <h1 className="text-2md font-semibold mb-4 mt-3">
          {formType === "signup" ? "Sign Up" : " Login"}
        </h1>
        {authError ? <p className="text-red-500 text-sm">{authError}</p> : null}
        <form className={formClass} onSubmit={formik.handleSubmit}>
          {/* Username Input */}
          <div className="relative mb-2 text-sm mt-1">
            <label htmlFor="username">Username:</label>
            <div className="flex items-center mt-2">
              <input
                className="bg-gray-50 border border-blue-300 text-blue-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 pr-8" // Add pr-10 to make space for the icon
                id="username"
                type="text"
                name="username"
                placeholder="Please enter your username..."
                value={formik.values.username || ""}
                onChange={formik.handleChange}
              />
              <FaUser className="mt-3 absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-300" />
            </div>
            {formik.touched.username && formik.errors.username ? (
              <div className="text-red-500 text-sm">
                {formik.errors.username}
              </div>
            ) : null}
          </div>

          {/* Password Input */}
          <div className="relative mb-4 text-sm mt-1">
            <label htmlFor="password">Password:</label>
            <div className="flex items-center mt-2">
              <input
                className="bg-gray-50 border border-blue-300 text-blue-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 pr-8" // Add pr-10 to make space for the icon
                id="password"
                type="password"
                name="password"
                placeholder="Password"
                value={formik.values.password || ""}
                onChange={formik.handleChange}
              />
              <FaLock className="mt-3 absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-300" />
            </div>
            {formik.touched.password && formik.errors.password ? (
              <div className="text-red-500 text-sm">
                {formik.errors.password}
              </div>
            ) : null}
          </div>

          {/* Sign Up Fields */}
          {formType === "signup" && (
            <>
              <div className="mt-4 text-sm">
                <label htmlFor="name">Full Name:</label>
                <input
                  className="bg-gray-50 border border-blue-300 text-blue-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mt-1"
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Please enter your full name.."
                  value={formik.values.name || ""}
                  onChange={formik.handleChange}
                />
                {formik.touched.name && formik.errors.name ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.name}
                  </div>
                ) : null}
              </div>
              <div className="mt-4 text-sm">
                <label htmlFor="email">Email:</label>
                <input
                  className="bg-gray-50 border border-blue-300 text-blue-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mt-1 mb-3"
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Please enter your email..."
                  value={formik.values.email || ""}
                  onChange={formik.handleChange}
                />
                {formik.touched.email && formik.errors.email ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.email}
                  </div>
                ) : null}
              </div>
            </>
          )}
          {/* Submit Button */}
          <button
            type="submit"
            className="mt-2 w-full bg-gray-700 text-white text-sm py-2 rounded-lg hover:bg-red-900"
          >
            Submit
          </button>
          {/* Navigation Link */}
          <p className="mt-6 items-center text-sm">
            {formType === "signup"
              ? "Already have an account? "
              : "Don't have an account? "}
            <NavLink
              to={formType === "signup" ? "/login" : "/signup"}
              className="font-bold text-gray-700 hover:underline"
              onClick={() => {
                formik.resetForm();
                setFormType(formType === "signup" ? "login" : "signup");
              }}
            >
              {formType === "signup" ? "Login" : "Register"}
            </NavLink>
          </p>
        </form>
      </main>
    </div>
  );
}

export default Authentication;
