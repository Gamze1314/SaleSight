import React, { useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
// useContext for addProduct
import { SalesContext } from '../context/SalesContext'
import { stringFormatter } from "../utils";


// Validation Schemas
const ValidationSchema = Yup.object().shape({
  // format description intial upper rest is lower. stringFormatter
  description: Yup.string().required("Description is required")
  .transform((value) => stringFormatter(value)),
  unit_value: Yup.number().required("Unit value is required"),
  quantity: Yup.number().required("Quantity Sold is required").min(1),
  marketing_cost: Yup.number().required("Marketing cost is required"),
  shipping_cost: Yup.number().required("Shipping cost is required"),
  packaging_cost: Yup.number().required("Packaging cost is required"),
  unit_sale_price: Yup.number().required("Product sale price is required"),
  quantity_purchased: Yup.number().required("Quantity Purchased is required"),
});

const ProductForm = ({ onClose, isChecked, productPageData }) => {
  const { addProduct, updateProfitMetrics, salesData } =
    useContext(SalesContext);

  const relevantData =
    isChecked && productPageData.length > 0 ? productPageData : null;

  const formik = useFormik({
    initialValues:
      isChecked && relevantData
        ? {
            description: relevantData.description || "",
            unit_value: relevantData.unit_value || "",
            quantity: relevantData.quantity || "",
            marketing_cost: relevantData.marketing_cost || "",
            shipping_cost: relevantData.shipping_cost || "",
            packaging_cost: relevantData.packaging_cost || "",
            unit_sale_price: relevantData.unit_sale_price || "",
            quantity_purchased: relevantData.quantity_purchased || "",
          }
        : {
            description: "",
            unit_value: "",
            quantity: "",
            marketing_cost: "",
            shipping_cost: "",
            packaging_cost: "",
            unit_sale_price: "",
            quantity_purchased: "",
          },
    enableReinitialize: true,
    validationSchema: ValidationSchema,
    enableReinitialize: true, // Ensures the form gets reset when product data changes.
    onSubmit: (values) => {
      if (relevantData) {
        // if isChecked true, the user updates the profit metrics.(product selected)
        // add profit id to edit.
        values.profit_id = relevantData.profitId;
        // update the product metrics
        updateProfitMetrics(values, values.profit_id);
      } else {
        addProduct(values);
      }
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
          {isChecked
            ? "Edit Profit Metrics"
            : "Add Sale and Product Information"}
        </h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {!isChecked ? (
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Product Description
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
            ) : null}
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
                Quantity Sold
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
                value={formik.values.packaging_cost}
              />
              {formik.errors.packaging_cost && (
                <p className="text-sm text-red-600">
                  {formik.errors.packaging_cost}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="unit_sale_price"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Sale Price
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
                htmlFor="quantity_purchased"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Quantity Purchased
              </label>
              <input
                id="quantity_purchased"
                name="quantity_purchased"
                type="number"
                className="block w-full rounded-md border-gray-300 shadow-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3"
                onChange={formik.handleChange}
                value={formik.values.quantity_purchased}
              />
              {formik.errors.quantity_purchased && (
                <p className="text-sm text-red-600">
                  {formik.errors.quantity_purchased}
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
