from models import User, ProductSale, Profit, Product, Cost
from config import db


def calculate_total_sales():
    pass

def calculate_total_costs():
    pass

def calculate_profit_amount():
    pass



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
