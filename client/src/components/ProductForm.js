import React, { useState, useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
// useContext for addProduct
import { SalesContext } from '../context/SalesContext'


// Validation Schemas
const ValidationSchema = Yup.object().shape({
  description: Yup.string().required("Description is required"),
  unit_value: Yup.number().required("Unit value is required"),
  quantity: Yup.number().required("Quantity is required").min(1),
  marketing_cost: Yup.number().required("Marketing cost is required"),
  shipping_cost: Yup.number().required("Shipping cost is required"),
  packaging_cost: Yup.number().required("Packaging cost is required"),
  profit_margin: Yup.number().required("Profit margin is required"),
  unit_sale_price: Yup.number().required("Unit sale price is required"),
  quantity_sold: Yup.number().required("Quantity sold is required"),
});

const ProductForm = ({ onClose }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const { addProduct } = useContext(SalesContext);


  const formik = useFormik({
    initialValues: {
      // product addition fields
      description: "",
      unit_value: "",
      quantity: "",
      // cost fields
      marketing_cost: "",
      shipping_cost: "",
      packaging_cost: "",
      //profit
      profit_margin: "",
      // sales
      unit_sale_price: "",
      quantity_sold: "",
    },
    validationSchema: ValidationSchema,
    onSubmit: (values) => {
      // Sanitize values and set defaults
      const sanitizedValues = Object.fromEntries(
        Object.entries(values).map(([key, value]) => {
          if (key === "quantity_sold" && value === "") {
            return [key, 0]; // Default `quantity_sold` to 0
          }
          return [key, value === "" ? null : value]; // Replace empty strings with `null`
        })
      );
      console.log("Sanitized Values:", sanitizedValues);

      // Add product and close form
      addProduct(sanitizedValues);
      onClose();
    },
  });


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur">
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl p-8">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Add Product Details
        </h2>
        <form onSubmit={formik.handleSubmit}>
          {/* BASIC FIELDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description
              </label>
              <input
                id="description"
                name="description"
                className="block w-full rounded-md border-gray-300 shadow-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3"
                onChange={formik.handleChange}
                value={formik.values.description}
              />
              {formik.errors.description && (
                <p className="text-sm text-red-600">
                  {formik.errors.description}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="unit_value"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Unit Value
              </label>
              <input
                id="unit_value"
                name="unit_value"
                type="number"
                className="block w-full rounded-md border-gray-300 shadow-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3"
                onChange={formik.handleChange}
                value={formik.values.unit_value}
              />
              {formik.errors.unit_value && (
                <p className="text-sm text-red-600">
                  {formik.errors.unit_value}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="quantity"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Quantity
              </label>
              <input
                id="quantity"
                name="quantity"
                type="number"
                className="block w-full rounded-md border-gray-300 shadow-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3"
                onChange={formik.handleChange}
                value={formik.values.quantity}
              />
              {formik.errors.quantity && (
                <p className="text-sm text-red-600">{formik.errors.quantity}</p>
              )}
            </div>
            <div>
                <label
                htmlFor="marketing_cost"
                className="block text-sm font-medium text-gray-700 mb-1"
                >
                Marketing Cost
                </label>
                <input
                id="marketing_cost"
                name="marketing_cost"
                type="number"
                className="block w-full rounded-md border-gray-300 shadow-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3"
                onChange={formik.handleChange}
                value={formik.values.marketing_cost}
                />
                {formik.errors.marketing_cost && (
                <p className="text-sm text-red-600">
                    {formik.errors.marketing_cost}
                </p>
                )}
            </div>
            <div>
                <label
                htmlFor="shipping_cost"
                className="block text-sm font-medium text-gray-700 mb-1"
                >
                Shipping Cost
                </label>
                <input
                id="shipping_cost"
                name="shipping_cost"
                type="number"
                className="block w-full rounded-md border-gray-300 shadow-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3"
                onChange={formik.handleChange}
                value={formik.values.shipping_cost}
                />
                {formik.errors.shipping_cost && (
                <p className="text-sm text-red-600">
                    {formik.errors.shipping_cost}
                </p>
                )}
            </div>
            <div>
                <label
                htmlFor="packaging_cost"
                className="block text-sm font-medium text-gray-700 mb-1"
                >
                Packaging Cost
                </label>
                <input
                id="packaging_cost"
                name="packaging_cost"
                type="number"
                className="block w-full rounded-md border-gray-300 shadow-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3"
                onChange={formik.handleChange}
                value={formik.values.shipping_cost}
                />
                {formik.errors.packaging_cost && (
                <p className="text-sm text-red-600">
                    {formik.errors.packaging_cost}
                </p>
                )}
            </div>
            <div>
                <label
                htmlFor="profit_margin"
                className="block text-sm font-medium text-gray-700 mb-1"
                >
                Profit Margin %
                </label>
                <input
                id="profit_margin"
                name="profit_margin"
                type="number"
                className="block w-full rounded-md border-gray-300 shadow-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3"
                onChange={formik.handleChange}
                value={formik.values.profit_margin}
                />
                {formik.errors.profit_margin && (
                <p className="text-sm text-red-600">
                    {formik.errors.profit_margin}
                </p>
                )}
            </div>
            <div>
                <label
                htmlFor="unit_sale_price"
                className="block text-sm font-medium text-gray-700 mb-1"
                >
                Unit Sales Price
                </label>
                <input
                id="unit_sale_price"
                name="unit_sale_price"
                type="number"
                className="block w-full rounded-md border-gray-300 shadow-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3"
                onChange={formik.handleChange}
                value={formik.values.unit_sale_price}
                />
                {formik.errors.unit_sale_price && (
                <p className="text-sm text-red-600">
                    {formik.errors.unit_sale_price}
                </p>
                )}
            </div>
            <div>
                <label
                htmlFor="quantity_sold"
                className="block text-sm font-medium text-gray-700 mb-1"
                >
                Quantity Sold
                </label>
                <input
                id="quantity_sold"
                name="quantity_sold"
                type="number"
                className="block w-full rounded-md border-gray-300 shadow-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3"
                onChange={formik.handleChange}
                value={formik.values.quantity_sold}
                />
                {formik.errors.quantity_sold && (
                <p className="text-sm text-red-600">
                    {formik.errors.quantity_sold}
                </p>
                )}
            </div>
          </div>
          {/* TOGGLE BUTTON */}
          <div className="flex justify-between mt-8">
            <button
              type="submit"
              className="px-6 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
            >
              Submit
            </button>
            {/* <button
              type="button"
              className="px-6 py-2 text-gray-800 bg-gray-300 rounded-lg hover:bg-gray-400"
              onClick={() => setIsUpdating((prev) => !prev)}
            >
              {isUpdating ? "Switch to Add Mode" : "Switch to Update Mode"}
            </button> */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;

// conditionlly render fields depending on the type of action (add or edit.)
