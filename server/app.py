"""
This module defines the routes for the Flask application and serves as the entry point.
"""
from flask import Flask, make_response, request,  abort, session, jsonify
from config import db, app , api , flask_bcrypt
from flask_restful import Resource
from models import User, Product, Profit, ProductSale, Cost
from werkzeug.exceptions import NotFound, Unauthorized

# pw_hash = flask_bcrypt.generate_password_hash('hunter2')
# flask_bcrypt.check_password_hash(pw_hash, 'hunter2')  # returns True
# print(pw_hash)


@app.errorhandler(NotFound)
def handle_not_found(e):
    response = make_response("Not Found: The resource you are looking for does not exist", 404)
    return response


@app.route('/cookies')
def set_cookies():
    response = make_response(jsonify({"cookies":request.cookies["user_id"]}), 200)
    return response

#seperate sign up , login and logout resources.

class SignUp(Resource):
    def post(self):
        #request.get_json() => get login info
        try:
            data = request.get_json()
            name = data['name']
            email = data['email']
            username = data['username']
            password = data['password']

            # Check if user already exists
            if User.query.filter_by(username=username).first():
                abort(400, 'Username already exists')

            # Hash the password
            hashed_password = flask_bcrypt.generate_password_hash(
                password).decode('utf-8')
            # create new user for sign up
            #pasword has generatation
            new_user = User(name=name, email=email,
                            username=username, password_hash=hashed_password)
            db.session.add(new_user)
            db.session.commit()

            # log the user in automatically
            session['user_id'] = new_user.id # => adds the id into session.
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
            username = data['username']
            password = data['password']

            # Find the user by username
            user = User.query.filter_by(username=username).first()

            if user and flask_bcrypt.check_password_hash(user.password_hash, password):
                # Store user ID in session to log them in
                session['user_id'] = user.id
                return make_response(user.to_dict(), 200)
            else:
                abort(401, "Invalid username or password")

        except ValueError as e:
            abort(500, e.args[0])

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


@app.route('/')
def index():
    return make_response('This is SalesSight API', 200)

# Define other routes here

#below resources rturned data serialized with all product, sales, profit, user and cost information.

@app.route('/profits')
def profits():
    profits = Profit.query.all()
    return make_response([profit.to_dict() for profit in profits], 200)


@app.route('/products')
def product():
    products = Product.query.all()
    return make_response([product.to_dict() for product in products], 200)


@app.route('/sales')
def sales():
    sales = ProductSale.query.all()
    return make_response([sale.to_dict() for sale in sales], 200)



# this script runs the app
if __name__ == '__main__':
    app.run(debug=True, port=5555)
    