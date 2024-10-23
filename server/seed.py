''' this module generates seed data for the tables.'''

from config import db, app
from models import User, Product, Profit, ProductSale, Cost

# app context
with app.app_context():
    db.drop_all()
    db.create_all()

    # create users
    user1 = User(name='John Doe', username='johndoe', password_hash='password123')
    user2 = User(name='Jane Smith', username='janesmith', password_hash='password456')
    db.session.add(user1)
    db.session.add(user2)
    db.session.commit()

    # create products
    product1 = Product(description='Product A', unit_value=10.00, quantity=100)
    product2 = Product(description='Product B', unit_value=20.00, quantity=50)
    db.session.add(product1)
    db.session.add(product2)
    db.session.commit()

    # create product sales
    sale1 = ProductSale(unit_sale_price=12.00,
                        quantity_sold=30, product_id=product1.id)
    sale2 = ProductSale(unit_sale_price=25.00,
                        quantity_sold=10, product_id=product2.id)
    db.session.add(sale1)
    db.session.add(sale2)
    db.session.commit()

    # create costs
    cost1 = Cost(marketing_cost=100.55, shipping_cost=50.00,
                 packaging_cost=20.15, product_id=product1.id)
    cost2 = Cost(marketing_cost=80.10, shipping_cost=40.00,
                 packaging_cost=15.05, product_id=product2.id)
    db.session.add(cost1)
    db.session.add(cost2)
    db.session.commit()


    #profit computation using related sales and costs will happen after Cost and Product Sales created.

    # calculate profit amount by margin.
    # Profit Amount = Sale Price × (Profit Margin ÷ 100)
   # Sale Price = Cost Price × (1 + Profit Margin ÷ 100)
   # Profit Margin = (Profit Amount ÷ Sale Price) × 100

    # calculate profit_amount and margin based on costs and sales revenue.
    # For product1
    total_sales1 = sale1.unit_sale_price * sale1.quantity_sold  # 12 * 30 = 360
    total_costs1 = cost1.marketing_cost + cost1.shipping_cost + cost1.packaging_cost # 100 + 50 + 20 = 170
    profit_amount1 = total_sales1 - total_costs1  # 360 - 170 = 190
    margin1 = (profit_amount1 / total_sales1) * \
        100  # (190 / 360) * 100 = 52.78%

    # For product2
    total_sales2 = sale2.unit_sale_price * sale2.quantity_sold  # 25 * 10 = 250
    total_costs2 = cost2.marketing_cost + cost2.shipping_cost + cost2.packaging_cost  # 80 + 40 + 15 = 135
    profit_amount2 = total_sales2 - total_costs2  # 250 - 135 = 115
    margin2 = (profit_amount2 / total_sales2) * 100  # (115 / 250) * 100 = 46%

    # create profits for products
    profit1 = Profit(profit_amount=profit_amount1, margin=margin1,
                     product_id=product1.id, user_id=user1.id)
    profit2 = Profit(profit_amount=profit_amount2, margin=margin2,
                     product_id=product2.id, user_id=user2.id)
    db.session.add(profit1)
    db.session.add(profit2)
    db.session.commit()

    print("Seed data created successfully.")

