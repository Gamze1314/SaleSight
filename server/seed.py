from config import db, app, flask_bcrypt
from models import User, Product, Profit, ProductSale, Cost
from decimal import Decimal
from helpers import total_revenue_for_sale, profit_by_product, calculate_profit_margin

# App context
with app.app_context():
    db.drop_all()
    db.create_all()

    # Create users with hashed passwords
    user1 = User(
        name='John Doe',
        email='john@gmail.com',
        username='johndoe',
        password_hash=flask_bcrypt.generate_password_hash('password123')
    )
    user2 = User(
        name='Jane Smith',
        email='jane@gmail.com',
        username='janesmith',
        password_hash=flask_bcrypt.generate_password_hash('password456')
    )
    db.session.add_all([user1, user2])
    db.session.commit()

    # Create products
    product1 = Product(description='Product A', unit_value=10.00, quantity=100)
    product2 = Product(description='Product B', unit_value=20.00, quantity=50)
    db.session.add_all([product1, product2])
    db.session.commit()

    # Create costs
    cost1 = Cost(quantity_purchased=25, marketing_cost=100.55,
                 shipping_cost=50.00, packaging_cost=20.15)
    cost2 = Cost(quantity_purchased=35, marketing_cost=80.10,
                 shipping_cost=40.00, packaging_cost=15.05)
    db.session.add_all([cost1, cost2])
    db.session.commit()

    # Calculate total cost and desired margins
    total_cost1 = Decimal(product1.unit_value) + Decimal(cost1.marketing_cost) + \
        Decimal(cost1.shipping_cost) + Decimal(cost1.packaging_cost)
    total_cost2 = Decimal(product2.unit_value) + Decimal(cost2.marketing_cost) + \
        Decimal(cost2.shipping_cost) + Decimal(cost2.packaging_cost)

    desired_margin1 = Decimal('52.78')
    desired_margin2 = Decimal('46.52')

    sale_price1 = round(total_cost1 * (1 + desired_margin1 / 100), 2)
    sale_price2 = round(total_cost2 * (1 + desired_margin2 / 100), 2)

    # Create product sales
    sale1 = ProductSale(unit_sale_price=sale_price1, quantity_sold=30)
    sale2 = ProductSale(unit_sale_price=sale_price2, quantity_sold=10)
    db.session.add_all([sale1, sale2])
    db.session.commit()

    # Calculate profits and margins
    revenue1 = total_revenue_for_sale(sale1)
    revenue2 = total_revenue_for_sale(sale2)

    profit_amount1 = profit_by_product(revenue1, total_cost1)
    profit_amount2 = profit_by_product(revenue2, total_cost2)

    margin1 = calculate_profit_margin(profit_amount1, revenue1)
    margin2 = calculate_profit_margin(profit_amount2, revenue2)

    # Create profits
    profit1 = Profit(profit_amount=profit_amount1,
                     margin=margin1, sale_id=sale1.id, user_id=user1.id)
    profit2 = Profit(profit_amount=profit_amount2,
                     margin=margin2, sale_id=sale2.id, user_id=user2.id)
    db.session.add_all([profit1, profit2])
    db.session.commit()

    print("Seed data created successfully.")
