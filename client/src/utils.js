//helper function to format currency.

export const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};

// helper function to formate profit margin %

export const formatProfitMargin = (margin) => {
  return `${margin}%`;
};

// helper function to format strings
export const stringFormatter = (value) => {
  if (typeof value !== "string") return value; // Ensure it's a string
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};