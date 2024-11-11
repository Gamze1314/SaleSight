"""
This module defines the routes for the Flask application and serves as the entry point.
"""
from flask import Flask, make_response, request,  abort, session, jsonify
from config import db, app, api, flask_bcrypt
from flask_restful import Resource
from models import User, Product, Profit, ProductSale, Cost
from werkzeug.exceptions import NotFound, Unauthorized
from helpers import profit_by_product

# pw_hash = flask_bcrypt.generate_password_hash('hunter2')
# flask_bcrypt.check_password_hash(pw_hash, 'hunter2')  # returns True
# print(pw_hash)


class CheckSession(Resource):
    def get(self):
        user_id = session.get('user_id')  # Safely get user_id from session
        if user_id:
            user = User.query.filter_by(id=user_id).first()
            if user:
                return make_response(user.to_dict(), 200)
            else:
                session.pop('user_id', None)  # Clean up invalid session
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
        if 'user_id' in session:
            del (session['user_id'])
            session.clear()  # Clears all session data
            return make_response({'message': 'User logged out successfully'}, 200)
        else:
            abort(400, "No user currently logged in")


api.add_resource(LogOut, '/logout')


class Sales(Resource):
    # Returns all sales, revenue, and product data for authenticated user
    def get(self):
        # Get user_id from the session
        user_id = session.get("user_id")

        if not user_id:
            abort(401, "User is not authenticated.")

        # Query for the user
        user = User.query.filter_by(id=user_id).first()

        if not user:
            abort(404, "User not found")

        # Retrieve the user's products
        user_products = user.products

        if not user_products:
            return make_response({"message": "No products found for this user."}, 404)

        # Initialize a response list to hold data for each product
        products_data = []

        for product in user_products:
            # Get all sales and costs related to this product
            sales = ProductSale.query.filter_by(product_id=product.id).all()
            costs = Cost.query.filter_by(product_id=product.id).all()

            # Serialize sales and costs data using only specific fields
            sale_array = [
                sale.to_dict(only=("id", "sale_date", "quantity_sold",
                             "unit_sale_price", "item_revenue", "net_profit", "updated_at"))
                for sale in sales
            ]

            cost_array = [
                cost.to_dict(only=("id", "item_cost"))
                for cost in costs
            ]

            # Structure data for each product with only the needed fields
            product_data = product.to_dict(
                only=("id", "description", "unit_value", "quantity", "purchased_at"))
            product_data.update({"sales": sale_array, "costs": cost_array})

            products_data.append(product_data)

        # Define final response body with user and products data, selecting only specific fields for the user
            response_body = [
                user.to_dict(only=("id", "username", "name")),
                *products_data  # Expanding products_data directly into the array
            ]

        return make_response(response_body, 200)


# Add the resource to the API
api.add_resource(Sales, '/product_sales')


# user_id, product_id
class Profits(Resource):
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


api.add_resource(Profits, '/profits')


# this script runs the app
if __name__ == '__main__':
    app.run(debug=True, port=5555)
