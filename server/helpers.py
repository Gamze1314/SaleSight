from config import db
from decimal import Decimal, InvalidOperation


def total_revenue_for_sale(sale):
    """
    Calculate total revenue for a single sale.

    Parameters:
    unit_sale_price (str or Decimal): The unit sale price of the item.
    quantity_sold (str or Decimal): The quantity of items sold.

    Returns:
    Decimal: The total revenue calculated from the sale.
    """
    try:
        unit_sale_price = Decimal(sale.unit_sale_price)
        quantity_sold = Decimal(sale.quantity_sold)

        # Calculate total revenue
        total_revenue = unit_sale_price * quantity_sold

        # Quantize to 2 decimal places
        total_revenue = total_revenue.quantize(Decimal('0.01'))

        return total_revenue  # Returns Decimal with 2 decimal places.
    except (InvalidOperation, ValueError):
        raise ValueError(
            "Both unit_sale_price and quantity_sold must be valid numbers.")


def calculate_sale_profit_amount(sale):
    """
    Calculate the profit amount for a specific sale.
    
    Args:
        sale (ProductSale): The sale instance to calculate profit for
    
    Returns:
        Decimal: The net profit amount for the sale
    """
    # Calculate total revenue for the sale
    total_revenue = sale.sales_revenue

    # Calculate total cost for this sale instance
    total_cost = sale.cost.total_cost

    # Net profit: Revenue - Total Costs
    net_profit = total_revenue - total_cost

    # Quantize to 2 decimal places
    return net_profit.quantize(Decimal('0.01'))


# update profit amount after each sale, this is private function to update profit table after each sale.
def update_profit_metrics(profit):
    # Check if the profit object is associated with a ProductSale
    if profit.sale:
        # Access the related ProductSale instance
        sale = profit.sale

        # Calculate total revenue from the sale
        total_revenue = sale.sales_revenue

        # Calculate total profit amount from the sale
        total_profit_amount = sale.profit_amount

        # Calculate profit margin (avoid division by zero)
        margin = (total_profit_amount / total_revenue *
                  100) if total_revenue > 0 else Decimal('0.00')

        # Update the Profit amount and margin
        profit.profit_amount = total_profit_amount.quantize(Decimal('0.01'))
        profit.margin = margin.quantize(Decimal('0.01'))

    else:
        # If no associated sale, set profit amount and margin to 0
        profit.profit_amount = Decimal('0.00')
        profit.margin = Decimal('0.00')

    # Commit the changes to the database
    db.session.commit()


def calculate_sales_analytics(products):
    # Initialize totals for sales analytics
    total_sales_revenue = 0
    total_profit_amount = 0
    total_quantity_sold = 0
    total_cost = 0

    for product in products:
        # Fetch sales related to the product
        product_sales = product.sales

        # Process sales for the product
        for sale in product_sales:
            # Include profit if it exists
            profit = sale.profit
            if profit:
                total_profit_amount += float(profit.profit_amount)

            # Include cost if it exists
            cost = sale.cost
            if cost:
                total_cost += float(cost.total_cost)

            # Calculate sales revenue
            total_sales_revenue += float(sale.unit_sale_price) * \
                int(sale.quantity_sold)
            total_quantity_sold += float(sale.quantity_sold)

            # .quantize(Decimal('0.01'))

    return total_sales_revenue, total_profit_amount, total_quantity_sold, total_cost


def calculate_analytics(user):
    # Get sales analytics data from the helper function
    total_sales_revenue, total_profit_amount, total_quantity_sold, total_cost = calculate_sales_analytics(
        user.products)

    # Calculate average profit margin (ensure no division by zero)
    if total_sales_revenue > 0:
        average_profit_margin = round(
            (total_profit_amount / total_sales_revenue) * 100, 2
        )
    else:
        average_profit_margin = 0

    # Prepare the final analytics result
    sales_analytics = {
        "total_sales_revenue": total_sales_revenue,
        "total_profit_amount": total_profit_amount,
        "total_cost": total_cost,
        "total_quantity_sold": total_quantity_sold,
        "average_profit_margin": average_profit_margin
    }

    return sales_analytics






