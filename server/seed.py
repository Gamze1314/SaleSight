from config import db, app, flask_bcrypt
from models import User, Product, Profit, ProductSale, Cost, User_Product_Association
from decimal import Decimal
from helpers import update_profit_metrics


# App context
with app.app_context():
    db.drop_all()
    db.create_all()

    # Create users with hashed passwords
    user1 = User(
        name='John Doe',
        email='john@gmail.com',
        username='johndoe',
        password_hash=flask_bcrypt.generate_password_hash(
            'password123').decode('utf-8')
    )
    user2 = User(
        name='Jane Smith',
        email='jane@gmail.com',
        username='janesmith',
        password_hash=flask_bcrypt.generate_password_hash(
            'bob').decode('utf-8')
    )
    db.session.add_all([user1, user2])
    db.session.commit()

    print("user data seeded successfully")

    # Create products
    product1 = Product(description='Product C')
    product2 = Product(description='Product D')

    db.session.add_all([product1, product2])
    db.session.commit()

    print("Product data seeded successfully")
    # create user product associations
    user_product1 = User_Product_Association(
        user_id=user1.id, product_id=product1.id)
    user_product2 = User_Product_Association(
        user_id=user2.id, product_id=product2.id)

    db.session.add_all([user_product1, user_product2])
    db.session.commit()

    print("User product associations seeded successfully")

    # Create product sales
    sale1 = ProductSale(unit_sale_price=100,
                        quantity_sold=20, product_id=product1.id, user_id=user1.id)

    sale2 = ProductSale(unit_sale_price=200,
                        quantity_sold=10, product_id=product2.id, user_id=user2.id)

    db.session.add_all([sale1, sale2])
    db.session.commit()

    print("Sale data seeded successfully")

    # Create costs
    cost1 = Cost(quantity_purchased=25, unit_value=5, marketing_cost=100.55,
                 shipping_cost=50.00, packaging_cost=20.15, sale_id=sale1.id)

    cost2 = Cost(quantity_purchased=35, unit_value=7, marketing_cost=80.10,
                 shipping_cost=40.00, packaging_cost=15.05, sale_id=sale2.id)

    db.session.add_all([cost1, cost2])
    db.session.commit()

    print("Cost data seeded successfully")

    # create profits => initial profit amount and margin is 0 if no sale is made.
    # after sale creation, the columns will be updated.
    profit1 = Profit(profit_amount=Decimal(
        0), margin=Decimal(0), sale_id=sale1.id)

    profit2 = Profit(profit_amount=Decimal(
        0), margin=Decimal(0), sale_id=sale2.id)

    db.session.add_all([profit1, profit2])
    db.session.commit()

    print("Profit data seeded successfully")

    profits = Profit.query.all()
    for profit in profits:
        # update profit metrics with helper function
        update_profit_metrics(profit)

    db.session.commit()

    print("Profit records updated successfully")
    print("Seed data created successfully.")
