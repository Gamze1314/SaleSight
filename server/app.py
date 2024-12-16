"""
This module defines the routes for the Flask application and serves as the entry point.
"""
from flask import Flask, make_response, request, abort, session
from config import db, app, api, flask_bcrypt
from flask_restful import Resource
from models import User, Product, Profit, ProductSale, Cost
from decimal import Decimal

# pw_hash = flask_bcrypt.generate_password_hash('hunter2')
# flask_bcrypt.check_password_hash(pw_hash, 'hunter2')  # returns True
# print(pw_hash)


class CheckSession(Resource):
    def get(self):
        user_id = session['user_id']  # Safely get user_id from session
        if user_id:
            user = User.query.filter_by(id=user_id).first()
            if user:
                return make_response(user.to_dict(), 200)
            else:
                session['user_id'] = None
                session.clear()  # Clears all session data
        return abort(401, 'User not found')


api.add_resource(CheckSession, '/check_session')


class SignUp(Resource):
    def post(self):
        # request.get_json() => get signup info
        try:
            data = request.get_json()
            name = data['name']
            email = data['email']
            username = data['username']
            password = data['password']

            # Check if user already exists
            if User.query.filter_by(username=username).first():
                abort(400, 'Username already exists')

            # check email already exists
            if User.query.filter_by(email=email).first():
                abort(400, 'Email already exists')

            # check name already exists
            if User.query.filter_by(name=name).first():
                abort(400, 'Name already exists')

            # Hash the password
            hashed_password = flask_bcrypt.generate_password_hash(
                password).decode('utf-8')

            # create new user for sign up
            new_user = User(name=name, email=email,
                            username=username, password_hash=hashed_password)

            db.session.add(new_user)
            db.session.commit()

            # log the user in automatically
            session['user_id'] = new_user.id  # => adds the id into session.
            # make a response with new user serialized and return 201 status code.
            return make_response(new_user.to_dict(), 201)

        except ValueError as e:
            # Handle any unexpected errors
            db.session.rollback()
            abort(500, e.args[0])


api.add_resource(SignUp, '/signup')

# Login Resource


class Login(Resource):
    def post(self):
        try:
            data = request.get_json()
            username = data.get('username')
            password = data.get('password')

            # Check for missing data
            if not username or not password:
                abort(400, "Username and password are required")

            # Find the user by username
            user = User.query.filter_by(username=username).first()

            if not user:
                # Specific error for non-existent user
                abort(401, "Username does not exist")

            if not flask_bcrypt.check_password_hash(user.password_hash, password):
                # Specific error for incorrect password
                abort(401, "Incorrect password")

            # If authentication is successful
            session['user_id'] = user.id
            session.permanent = True
            return make_response(user.to_dict(), 200)

        except ValueError as e:
            abort(500, f"An error occurred: {str(e)}")


api.add_resource(Login, '/login')


# Logout Resource
class LogOut(Resource):
    def delete(self):
        # breakpoint()
        if 'user_id' in session:
            session['user_id'] = None
            session.clear()  # Clears all session data
            return make_response({'message': 'User logged out successfully'}, 200)
        else:
            abort(400, "No user currently logged in")


api.add_resource(LogOut, '/logout')


class UserSales(Resource):
    # Returns profits and associated sales and cost data for the authenticated user.
    def get(self):
        user_id = session.get("user_id")

        if not user_id:
            abort(401, "User is not authenticated.")

        # Query for the user
        user = User.query.filter_by(id=user_id).first()

        if not user:
            abort(404, "User not found")

        try:
            user_profits = user.profits

            if not user_profits:
                return make_response({"message": "No sale found for this user."}, 404)

            response_body = [profit.to_dict() for profit in user_profits]

            return make_response(response_body, 200)

        except Exception as e:
            db.session.rollback()
            abort(500, f"An error occurred: {str(e)}")

    # handle Product or Profit ? addition here with sales, cost, profit data.

    def post(self):
        # Get user_id from the session
        user_id = session.get("user_id")

        if not user_id:
            abort(401, "User is not authenticated.")
        try:
            # Retrieve the product data from the request JSON
            product_data = request.get_json()

            product_data["description"] = product_data["description"].upper()

            # Create a new Product object
            new_product = Product(
                description=product_data.get("description"),
                unit_value=product_data.get("unit_value"),
                quantity=product_data.get("quantity")
            )

            # Add the new product to the database
            db.session.add(new_product)
            db.session.commit()

            # Create a new ProductSale object
            # validate if numbers are provided and digit
            if not all(isinstance(x, (int, float, Decimal)) for x in [
                product_data.get("quantity_sold"),
                product_data.get("unit_sale_price"),
                product_data.get("marketing_cost"),
                product_data.get("shipping_cost"),
                product_data.get("packaging_cost")
            ]):
                abort(400, "Invalid data provided for sales, costs, or profit.")

            # Create a new Profit object

            new_sale = ProductSale(
                product_id=new_product.id,
                quantity_sold=product_data.get("quantity_sold"),
                unit_sale_price=product_data.get("unit_sale_price")
            )

            # Add the new sale to the database
            db.session.add(new_sale)
            db.session.commit()

            # Create a new Cost object
            new_cost = Cost(
                product_id=new_product.id,
                marketing_cost=product_data.get("marketing_cost"),
                shipping_cost=product_data.get("shipping_cost"),
                packaging_cost=product_data.get("packaging_cost")
            )

            # Add the new cost to the database
            db.session.add(new_cost)
            db.session.commit()

            # Calculate total sales revenue
            total_sales = new_sale.unit_sale_price * new_sale.quantity_sold

            # Calculate total costs
            total_cost = (
                new_cost.marketing_cost +
                new_cost.shipping_cost +
                new_cost.packaging_cost
            )

            # Calculate profit amount
            profit_amount = total_sales - total_cost

            new_profit = Profit(
                product_id=new_product.id,
                profit_amount=profit_amount,
                margin=product_data.get('profit_margin'),
                user_id=user_id,
            )

            db.session.add(new_profit)
            db.session.commit()

            return make_response({"message": "Product added successfully"}, 201)
        except Exception as e:
            abort(500, f"An error occurred: {str(e)}")

    # handle Product details update

    def patch(self, product_id):
        user_id = session.get("user_id")

        if not user_id:
            abort(401, "User is not authenticated.")

        # Check if the product exists
        product = Product.query.filter_by(
            id=product_id, user_id=user_id).first()

        if not product:
            abort(404, "Product not found")

        # Get the update data from the request
        product_data = request.get_json()

        # Update fields
        if 'description' in product_data:
            # Ensure description is uppercase
            product.description = product_data['description'].upper()
        if 'unit_value' in product_data:
            product.unit_value = product_data['unit_value']
        if 'quantity' in product_data:
            product.quantity = product_data['quantity']

            # Commit the changes to the database
        db.session.commit()

        return make_response({"message": "Product updated successfully"}, 200)


# Add the resource to the API
api.add_resource(UserSales, '/user_sales',
                 '/product_sales/<int:product_id>')


# user_id, product_id
class UserProfits(Resource):
    # returns all profits for the products of authenticated user
    def get(self):
        # Get user_id from the session.
        user_id = session["user_id"]

        if not user_id:
            abort(401, "User is not authenticated.")

        # Get all profit data for the sales
        profit_data = Profit.query.filter_by(user_id=user_id).all()

        response_body = [p.to_dict() for p in profit_data]

        return make_response(response_body, 200)


api.add_resource(UserProfits, '/profits')


class ProductByID(Resource):
    """
    Endpoint to retrieve product details along with associated costs, profits, and sales by ID.
    """

    def get(self, id):
        # Query the product by ID
        product = Product.query.get(id)

        # If the product doesn't exist, returns a 404 error
        if not product:
            abort(404, message="Product not found")

        # Convert product details and related data to dictionaries
        product_data = product.to_dict()

        costs = [cost.to_dict() for cost in product.costs]

        profits = [profit.to_dict(only=('id', 'margin', 'profit_amount'))
                   for profit in product.profits]

        sales = [sale.to_dict(only=(
            'unit_sale_price', 'quantity_sold', 'sale_date')) for sale in product.sales]

        # Construct the response body
        response_body = {
            "id": product_data["id"],
            "description": product_data["description"],
            "unit_value": product_data["unit_value"],
            "quantity": product_data["quantity"],
            "purchased_at": product_data["purchased_at"],
            "costs": costs,
            "profits": profits,
            "sales": sales
        }

        return make_response(response_body, 200)


api.add_resource(ProductByID, '/product/<int:id>')


# this script runs the app
if __name__ == '__main__':
    app.run(debug=True, port=5555)
