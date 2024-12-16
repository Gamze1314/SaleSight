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
    # Sum the total costs from all associated costs for the profit
    total_cost = sum(cost.total_cost for cost in sale.profit.costs)

    # Net profit: Revenue - Total Costs
    net_profit = total_revenue - total_cost

    # Quantize to 2 decimal places
    return net_profit.quantize(Decimal('0.01'))


# update profit amount after each sale
def update_profit_metrics(profit):
    #if sale instance is created => updates profit amount and margin.
    if profit.sales:
        total_revenue = sum(sale.sales_revenue for sale in profit.sales)

        # Calculate total profit amount using the profit_amount hybrid property
        total_profit_amount = sum(sale.profit_amount for sale in profit.sales)

        # Calculate profit margin
        # Avoid division by zero( if there is no sale.)
        margin = (total_profit_amount / total_revenue *
                100) if total_revenue > 0 else Decimal('0.00')

        # Update the Profit amount and margin.
        profit.profit_amount = total_profit_amount.quantize(Decimal('0.01'))
        profit.margin = margin.quantize(Decimal('0.01'))

    else:
        profit.profit_amount = Decimal('0.00')
        profit.margin = Decimal('0.00')

    db.session.commit()


