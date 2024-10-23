from config import db, app
from models import User, Product, Profit, ProductSale, Cost
from decimal import Decimal

# app context
with app.app_context():
    db.drop_all()
    db.create_all()

    # create users
    user1 = User(name='John Doe', username='johndoe',
                 password_hash='password123')
    user2 = User(name='Jane Smith', username='janesmith',
                 password_hash='password456')
    db.session.add(user1)
    db.session.add(user2)
    db.session.commit()

    # create products
    product1 = Product(description='Product A', unit_value=10.00, quantity=100)
    product2 = Product(description='Product B', unit_value=20.00, quantity=50)
    db.session.add(product1)
    db.session.add(product2)
    db.session.commit()

    # create costs
    cost1 = Cost(marketing_cost=100.55, shipping_cost=50.00,
                 packaging_cost=20.15, product_id=product1.id)
    cost2 = Cost(marketing_cost=80.10, shipping_cost=40.00,
                 packaging_cost=15.05, product_id=product2.id)
    db.session.add(cost1)
    db.session.add(cost2)
    db.session.commit()

    print(type(cost1.marketing_cost), "cost example")

    # Desired profit margin
    desired_margin1 = Decimal('52.78') 
    desired_margin2 = Decimal('46.52')

    # Total cost per product (unit value + all costs)
    #decimal
    total_cost1 = Decimal(product1.unit_value) + \
                Decimal(cost1.marketing_cost) + \
                Decimal(cost1.shipping_cost) + \
                Decimal(cost1.packaging_cost)

    total_cost2 = Decimal(product2.unit_value) + \
                Decimal(cost2.marketing_cost) + \
                Decimal(cost2.shipping_cost) + \
                Decimal(cost2.packaging_cost)

    # Sale price based on desired margin
    #decimal rounded
    sale_price1 = round(
        total_cost1 * (Decimal(1) + (desired_margin1 / Decimal(100))), 2)
    sale_price2 = round(
        total_cost2 * (Decimal(1) + (desired_margin2 / Decimal(100))), 2)

    # create product sales
    sale1 = ProductSale(unit_sale_price=sale_price1,
                        quantity_sold=30, product_id=product1.id)
    sale2 = ProductSale(unit_sale_price=sale_price2,
                        quantity_sold=10, product_id=product2.id)
    db.session.add(sale1)
    db.session.add(sale2)
    db.session.commit()

    # Calculate profit based on sales revenue and costs
    total_sales1 = sale1.unit_sale_price * sale1.quantity_sold # Revenue from sales
    total_sales2 = sale2.unit_sale_price * sale2.quantity_sold # Revenue from sales

    profit_amount1 = total_sales1 - total_cost1  # Profit for product1
    profit_amount2 = total_sales2 - total_cost2  # Profit for product2
    print(type(profit_amount1), "profit") # decimal

    margin1 = round((profit_amount1 / total_sales1) *
                    100, 2)  # Final margin for product1
    margin2 = round((profit_amount2 / total_sales2) *
                    100, 2)  # Final margin for product2
    
    print(type(margin1), "margin")

    # create profits for products
    profit1 = Profit(profit_amount=profit_amount1, margin=margin1,
                     product_id=product1.id, user_id=user1.id)
    profit2 = Profit(profit_amount=profit_amount2, margin=margin2,
                     product_id=product2.id, user_id=user2.id)
    db.session.add(profit1)
    db.session.add(profit2)
    db.session.commit()

    print("Seed data created successfully.")


    # product unit value + all costs = total cost.
    # sales price = total cost + profit
    # profit margin = (profit / sales price) * 100

