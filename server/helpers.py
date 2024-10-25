from models import User, ProductSale, Profit, Product, Cost
from config import db
from decimal import Decimal, InvalidOperation


def total_revenue_for_sale(unit_sale_price, quantity_sold):
    """
    Calculate total revenue for a single sale.

    Parameters:
    unit_sale_price (str or Decimal): The unit sale price of the item.
    quantity_sold (str or Decimal): The quantity of items sold.

    Returns:
    Decimal: The total revenue calculated from the sale.
    """
    try:
        unit_sale_price = Decimal(unit_sale_price)
        quantity_sold = Decimal(quantity_sold)

        # Calculate total revenue
        total_revenue = unit_sale_price * quantity_sold

        # Quantize to 2 decimal places
        total_revenue = total_revenue.quantize(Decimal('0.01'))

        return total_revenue # returns Decimal places.
    except (InvalidOperation, ValueError):
        raise ValueError(
            "Both unit_sale_price and quantity_sold must be valid numbers.")
    
def profit_by_product(revenue, total_cost):
    profit_amount = revenue - total_cost
    return profit_amount.quantize(Decimal('0.01'))


#case; if profit is 0. or less than 0. ?
# item is returned or loss.

def calculate_profit_margin(profit_amount, revenue):
    """
    Calculate the profit margin given the profit amount and revenue.

    Args:
        profit_amount (Decimal): The profit amount.
        revenue (Decimal): The total revenue.

    Returns:
        Decimal: The profit margin rounded to two decimal places.
    """
    if revenue == 0:
        return Decimal('0.00')  # To avoid division by zero

    margin = (profit_amount / revenue) * 100
    return round(margin, 2)  # Round to 2 decimal places



def update_profit_amount(product_id):
    product = Product.query.get(product_id)
    if not product:
        return

    # Calculate total sales revenue
    total_sales = sum(sale.unit_sale_price *
                      sale.quantity_sold for sale in product.sales)

    # Calculate total costs
    total_cost = sum(cost.marketing_cost + cost.shipping_cost +
                     cost.packaging_cost for cost in product.costs)

    # Calculate profit amount
    profit_amount = total_sales - total_cost

    # Update the Profit record
    profit_record = Profit.query.filter_by(product_id=product_id).first()
    if profit_record:
        profit_record.profit_amount = profit_amount
        db.session.commit()


# Adding a Cost:

# When a cost is added, the function or POST request handler commits it to the database, and then calls update_profit_amount to recalculate the profit based on the associated product's sales and costs.
# Adding a Product Sale:

# The add_product_sale function operates similarly for sales. It creates a new ProductSale, commits it, and recalculates the profit.
# Updating Profit:

# The update_profit_amount function queries the Product, calculates total sales and costs, then updates or creates the Profit entry for that product.
