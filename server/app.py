"""
This module defines the routes for the Flask application and serves as the entry point.
"""
from flask import Flask, make_response, request, abort, session
from config import db, app, api, flask_bcrypt
from flask_restful import Resource
from models import User, Product, Profit, ProductSale, Cost
from decimal import Decimal
from helpers import update_profit_metrics

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
        return abort(401, 'User is not authenticated.')


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
            username = data['username']
            password = data['password']

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

            # update profit.product => return object key => value.

            # wrap it in an array.

            response_body = []
            for profit in user_profits:
                profit_dict = profit.to_dict()

                if profit.product:
                    profit_dict["product"] = [
                        profit.product.to_dict(only=('id', 'description'))]

                sales_data = [sale.to_dict()
                              for sale in profit.sales] if profit.sales else []
                cost_data = [cost.to_dict()
                             for cost in profit.costs] if profit.costs else []

                profit_dict["sales"] = sales_data
                profit_dict["costs"] = cost_data

                response_body.append(profit_dict)

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
            data = request.get_json()

            data["description"] = data["description"].title()

            # Create a new Product object
            new_product = Product(
                description=data["description"]
            )

            # Add the new product to the database
            db.session.add(new_product)
            db.session.commit()

            # create new profit entry (initial)
            new_profit = Profit(
                profit_amount=Decimal(0),
                margin=Decimal(0),
                product_id=new_product.id,
                user_id=user_id,
            )

            # Add the new profit to the database
            db.session.add(new_profit)
            db.session.commit()

            # create new cost record for the profit
            new_cost = Cost(
                quantity_purchased=data["quantity_purchased"],
                unit_value=data["unit_value"],
                marketing_cost=data["marketing_cost"],
                shipping_cost=data["shipping_cost"],
                packaging_cost=data["packaging_cost"],
                profit_id=new_profit.id
            )

            # Add the new cost to the database
            db.session.add(new_cost)
            db.session.commit()

            # create new sale record for the profit
            new_sale = ProductSale(
                unit_sale_price=data["unit_sale_price"],
                quantity_sold=data["quantity"],
                profit_id=new_profit.id,
            )

            # Add the new sale to the database
            db.session.add(new_sale)
            db.session.commit()

            # Update profit and cost data
            update_profit_metrics(new_profit)

            response_body = [new_profit.to_dict()]

            return make_response(response_body, 201)
        except Exception as e:
            abort(500, f"An error occurred: {str(e)}")

    # handle Product details update

    def patch(self, profit_id):
        user_id = session.get("user_id")

        if not user_id:
            abort(401, "User is not authenticated.")

        try:
            # Get the update data from the request
            data = request.get_json()

            # breakpoint()
            data["profit_id"] = profit_id

            # product, profit, sale, cost patch request handler
            profit = Profit.query.filter_by(
                id=profit_id, user_id=user_id).first()

            if not profit:
                abort(404, "Profit not found")

            # Update sale and cost data

            relatedCosts = Cost.query.filter_by(profit_id=profit_id).all()

            if not relatedCosts:
                abort(404, "Cost not found")

            for cost in relatedCosts:
                data["unit_value"] = cost.unit_value
                data["quantity"] = cost.quantity_sold
                data["marketing_cost"] = cost.marketing_cost
                data["shipping_cost"] = cost.shipping_cost
                data["packaging_cost"] = cost.packaging_cost

                db.session.commit()

            # sales
            relatedSales = ProductSale.query.filter_by(
                profit_id=profit_id).all()

            if not relatedSales:
                abort(404, "Sale not found")

            for sale in relatedSales:
                data["unit_sale_price"] = sale.unit_sale_price
                data["quantity_sold"] = sale.quantity_sold

                db.session.commit()

            # Update profit metrics.
            update_profit_metrics(profit)

            return make_response({"message": "Product details updated successfully"}, 200)

        except Exception as e:
            abort(500, f"An error occurred: {str(e)}")

    # delete request handler here: deletes profit data with cost and sale only.

    def delete(self, profit_id):
        user_id = session.get("user_id")

        if not user_id:
            abort(401, "User is not authenticated.")

        try:
            # find profit by id
            profit = Profit.query.filter_by(
                id=profit_id, user_id=user_id).first()

            if not profit:
                abort(404, "Profit not found")

            # delete profit (cascade all( sale, cost))
            db.session.delete(profit)
            db.session.commit()

            return make_response({"message": "Product deleted successfully"}, 200)

        except Exception as e:
            abort(500, f"An error occurred: {str(e)}")


# Add the resource to the API
api.add_resource(UserSales, '/user_sales',
                 '/user_sales/<int:profit_id>')


# Update profit metrics and profit_amount by productId (add new sale functionality)
class UpdateProductSales(Resource):
    def post(self, product_id):
        # Get user_id from the session
        user_id = session.get("user_id")

        if not user_id:
            abort(401, "User is not authenticated.")

        try:
            # find product by id
            product = Product.query.filter_by(id=product_id).first()

            if not product:
                abort(404, "Product not found")

            data = request.get_json()

            # create Profit row
            new_profit = Profit(
                profit_amount=Decimal(0),
                margin=Decimal(0),
                product_id=product_id,
                user_id=user_id,
            )

            db.session.add(new_profit)
            db.session.commit()

            new_cost = Cost(
                quantity_purchased=data["quantity_purchased"],
                unit_value=data["unit_value"],
                marketing_cost=data["marketing_cost"],
                shipping_cost=data["shipping_cost"],
                packaging_cost=data["packaging_cost"],
                profit_id=new_profit.id
            )

            db.session.add(new_cost)
            db.session.commit()

            # create sale row for the product
            new_sale = ProductSale(
                unit_sale_price=data["unit_sale_price"],
                quantity_sold=data["quantity"],
                profit_id=new_profit.id
            )

            db.session.add(new_sale)
            db.session.commit()

            # update profit metrics
            update_profit_metrics(new_profit)

            response_body = [new_profit.to_dict()]

            return make_response(response_body, 201)

        # handle errors
        except:
            abort(500, f"An error occurred while updating product sales.")


api.add_resource(UpdateProductSales, '/product_sales/<int:product_id>')


# this script runs the app
if __name__ == '__main__':
    app.run(debug=True, port=5555)
