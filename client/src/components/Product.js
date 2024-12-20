

function Product({ profit, index , setSelectedProductId, setSelectedOption, selectedOption }) {
  // const [selectedOption, setSelectedOption] = useState("none");

  console.log(profit.profitId, profit.productId)


  // if view_sales => displayes the product sales.
  // if edit profit_metrics => shows product's

    const handleSelect = (event) => {
      // on every option selection, state is being updated with product/profit data.
      const value = event.target.value;
      setSelectedOption(value);

      if (value === "view_sales") {
        setSelectedProductId(profit.productId);
      } else {
        setSelectedProductId(null); // Reset when another option is selected
      }
    };



  return (
    <tr className="border-b">
      <td className="p-3 text-left">
        <span className="font-bold mr-2">{index + 1}. &nbsp;</span>
        {profit.description}
      </td>
      <td className="p-3 text-left">${profit.total_sales_revenue}</td>
      <td className="p-3 text-left">{profit.quantity_purchased}</td>
      <td className="p-3 text-left">{profit.quantitySold}</td>
      <td>
        <select
          className="h-10 w-full rounded border border-solid border-neutral-300 px-4 text-sm"
          onChange={handleSelect}
          value={selectedOption} // Controlled component
        >
          <option value="none">Select</option>
          <option value="view_sales">View Sales</option>
          <option value="add_sale">Add New Sale</option>
        </select>
      </td>
      <td>
      </td>
    </tr>
  );
}

export default Product;
