"""
This module defines the routes for the Flask application and serves as the entry point.
"""
from flask import Flask, make_response, request,  abort, session, jsonify
from config import db, app, api, flask_bcrypt
from flask_restful import Resource
from models import User, Product, Profit, ProductSale, Cost
from werkzeug.exceptions import NotFound, Unauthorized

# pw_hash = flask_bcrypt.generate_password_hash('hunter2')
# flask_bcrypt.check_password_hash(pw_hash, 'hunter2')  # returns True
# print(pw_hash)


# seperate sign up , login and logout resources.
class CheckSession(Resource):
    def get(self):
        user_id = session.get('user_id')
        if user_id:
            user = User.query.get(user_id)
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
            session.pop('user_id', None)
            return make_response({'message': 'User logged out successfully'}, 200)
        else:
            abort(400, "No user currently logged in")


api.add_resource(LogOut, '/logout')


# Define other routes here

# below resources rturned data serialized with all product, sales, profit, user and cost information.

# @app.route('/profits')
# def profits():
#     profits = Profit.query.all()
#     return make_response([profit.to_dict() for profit in profits], 200)


# @app.route('/products')
# def product():
#     products = Product.query.all()
#     return make_response([product.to_dict() for product in products], 200)


# @app.route('/sales')
# def sales():
#     sales = ProductSale.query.all()
# return make_response([sale.to_dict() for sale in sales], 200)


# Resources for sales, costs, and profits.
class Sales(Resource):
    # returns all sales, revenue, and product data for authenticated user.
    def get(self):
        # Get user_id from the session.
        user_id = session.get("user_id")

        if not user_id:
            abort(401, "User is not authenticated.")

        # GET ALL THE SALES FOR THIS USER.
        sales = ProductSale.query.all()

        # revenue = sum(quantity * unit sales price) => hybrid property
        response_body = [sale.to_dict() for sale in sales]

        return make_response(response_body, 200)


api.add_resource(Sales, '/product_sales')


class Profits(Resource):
    # returns all profits for the products of authenticated user
    def get(self):
        # Get user_id from the session.
        user_id = session.get("user_id")

        if not user_id:
            abort(401, "User is not authenticated.")
        
        #Get all profit data for the sales
        profit_data = Profit.query.all()

        response_body = [p.to_dict() for p in profit_data]

        return make_response(response_body, 200)


api.add_resource(Profits, '/profits')



class Costs(Resource):
    # returns all costs for the products of authenticated user
    def get(self):
        # Get user_id from the session.
        user_id = session.get("user_id")

        if not user_id:
            abort(401, "User is not authenticated.")
        
        #get costs 
        cost_data = Cost.query.all()

        response_body = [c.to_dict() for c in cost_data]

        return make_response(response_body, 200)
    
api.add_resource(Costs, '/costs')



# this script runs the app
if __name__ == '__main__':
    app.run(debug=True, port=5555)
