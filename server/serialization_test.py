from datetime import datetime
from decimal import Decimal
from config import app
from models import User, Product, ProductSale, User_Product_Association, Profit, Cost

# Create test data
with app.app_context():
    try:
        # 1. Get a User
        user = User.query.first()

        # 2. Get product
        product = Product.query.first()

        # 3. Get sale
        sale = ProductSale.query.first()

        # 4. Get cost
        cost = Cost.query.first()

        # 5. Get profit
        profit = Profit.query.first()

        # 6. Association - Ensure association data is available (if relevant)
        # Example for User-Product association, if such an association exists
        association = User_Product_Association.query.first()  # Adjust query as necessary
        if association:
            association_json = association.to_dict()
            print("\nAssociation Serialization:")
            print(association_json)
        else:
            print("\nNo association found.")

        # Test serialization for each model
        # User serialization
        user_json = user.to_dict() if user else None
        if user_json:
            print("\nUser Serialization:")
            print(user_json)

        # Product serialization
        product_json = product.to_dict() if product else None
        if product_json:
            print("\nProduct Serialization:")
            print(product_json)

        # Sale serialization
        sale_json = sale.to_dict() if sale else None
        if sale_json:
            print("\nSale Serialization:")
            print(sale_json)

        # Cost serialization
        cost_json = cost.to_dict() if cost else None
        if cost_json:
            print("\nCost Serialization:")
            print(cost_json)

        # Profit serialization
        profit_json = profit.to_dict() if profit else None
        if profit_json:
            print("\nProfit Serialization:")
            print(profit_json)

    except Exception as e:
        print(f"Serialization error: {str(e)}")


# Example usage:
if __name__ == "__main__":
    pass
