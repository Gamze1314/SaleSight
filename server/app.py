"""
This module defines the routes for the Flask application and serves as the entry point.
"""
from flask import Flask, make_response, request, abort, session
from config import db, app, api, flask_bcrypt
from flask_restful import Resource
from models import User, Product, Profit, ProductSale, Cost, User_Product_Association
from decimal import Decimal
from helpers import update_profit_metrics, calculate_analytics, calculate_sales_analytics

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


class SalesAnalytics(Resource):

    def get(self):
        user_id = session["user_id"]

        if not user_id:
            abort(401, "User is not authenticated.")

        # Query for the user
        user = User.query.filter_by(id=user_id).first()

        if not user:
            abort(404, "User not found")


        try:
            # Prepare response for total profits, sales revenue, and costs
            response_body = []

            # Initialize overall totals
            total_sales_revenue = 0
            total_profit_amount = 0
            total_quantity_sold = 0
            total_cost = 0

            # Fetch user products
            user_products = user.products

            for product in user_products:

                # Fetch sales related to the product
                product_sales = [sale for sale in product.sales]

                # Process sales for the product
                for sale in product_sales:
                    # Include profit if it exists
                    profit = sale.profit
                    if profit:
                        total_profit_amount += float(profit.profit_amount)

                    # Include cost if it exists
                    cost = sale.cost
                    if cost:

                        total_cost += float(cost.total_cost)

                    # Calculate sales revenue
                    total_sales_revenue += float(sale.unit_sale_price) * \
                        int(sale.quantity_sold)
                    
                    total_quantity_sold += float(sale.quantity_sold)

                # Calculate average profit margin (ensure no division by zero)
            if total_sales_revenue > 0:
                average_profit_margin = round(
                    (total_profit_amount / total_sales_revenue) * 100, 2
                )
            else:
                average_profit_margin = 0

            # Prepare the response object
            response_body.append({
                "total_sales_revenue": total_sales_revenue,
                "total_profit_amount": total_profit_amount,
                "total_cost": total_cost,
                "total_quantity_sold": total_quantity_sold,
                "average_profit_margin": average_profit_margin
            })

            # Return the response with combined totals
            return make_response(response_body, 200)

        except Exception as e:
            db.session.rollback()
            abort(500, f"An error occurred: {str(e)}")

api.add_resource(SalesAnalytics, '/sales_analytics')


#Handles GET and DELETE requests.
class UserProductSales(Resource):
    def get(self):
        user_id = session["user_id"]

        if not user_id:
            abort(401, "User is not authenticated.")

        # Query for the user
        user = User.query.filter_by(id=user_id).first()

        if not user:
            abort(404, "User not found")
# prepare a response for user product sales and associated cost and profit. If there are no sales associated with the user, return 0 values for sales revenue, total cost, and profit amount.

# unit_sale_price
# quantity_sold
# profit_amount
# profit_margin
# quantity_purchased
# total_cost
# sales_revenue

        try:
            response_body = []

            user_products = user.products

            for product in user_products:

                # Prepare product data
                product_data = product.to_dict(only=("id", "description"))

                # Fetch sales related to the product
                product_sales = [sale for sale in product.sales]

                # Initialize totals
                total_sales_revenue = 0
                total_profit_amount = 0
                total_cost = 0
                total_quantity_sold = 0
                sales_data = []

                # Process sales for the product
                for sale in product_sales:
                    sale_dict = sale.to_dict()

                    sale_dict["sale_id"] = sale.id  # Add sale_id

                    # Include profit if it exists
                    profit = sale.profit
                    if profit:
                        sale_dict["profit_id"] = profit.id  # Add profit_id
                        sale_dict["profit_amount"] = float(
                            profit.profit_amount)
                        sale_dict["profit_margin"] = float(profit.margin)
                        total_profit_amount += float(profit.profit_amount)
                    else:
                        sale_dict["profit_id"] = None
                        sale_dict["profit_amount"] = 0
                        sale_dict["profit_margin"] = 0

                    # Include cost if it exists
                    cost = sale.cost
                    if cost:
                        sale_dict["cost_id"] = cost.id  # Add cost_id
                        sale_dict["total_cost"] = float(cost.total_cost)
                        sale_dict["quantity_purchased"] = int(cost.quantity_purchased)
                        total_cost += float(cost.total_cost)
                    else:
                        sale_dict["cost_id"] = None
                        sale_dict["total_cost"] = 0
                        sale_dict["quantity_purchased"] = 0

                    # Calculate sales revenue
                    sale_dict["sales_revenue"] = float(sale.unit_sale_price) * int(sale.quantity_sold)
                    total_sales_revenue += sale_dict["sales_revenue"]

                    #accumulate total quantity sold
                    # Add quantity sold
                    total_quantity_sold += int(sale.quantity_sold)

                    # Add sale to sales data
                    sales_data.append(sale_dict)

                # Add totals to product data
                product_data["sales"] = sales_data
                product_data["total_sales_revenue"] = total_sales_revenue
                product_data["total_profit_amount"] = total_profit_amount
                product_data["total_cost"] = total_cost

                response_body.append(product_data)

            # Return the response with sales, cost, and profit data
            return make_response(response_body, 200)

        except Exception as e:
            db.session.rollback()
            abort(500, f"An error occurred: {str(e)}")

#POST request handler => creates new product, sale, cost, profit data for new user. 
    def post(self):
        user_id = session.get("user_id")

        if not user_id:
            abort(401, "User is not authenticated.")

        try:
            data = request.get_json()

            #create new product
            # Backend Check: Add a check here to verify if a product with the same name  already exists for the user before adding a new product.
            if Product.query.filter_by(description=data["description"]).first():
                abort(400, "Product already exists")
            
            new_product = Product(description=data["description"])

            db.session.add(new_product)
            db.session.commit()

            #user_product_association ?
            user = User.query.get(user_id)
            association = User_Product_Association(
                user_id=user.id, product_id=new_product.id)
            
            # breakpoint()
            
            db.session.add(association)
            db.session.commit()


            # Create sale row for the product
            new_sale = ProductSale(
                unit_sale_price=data["unit_sale_price"],
                quantity_sold=data["quantity"],
                product_id=new_product.id,
                user_id=user_id
            )
            db.session.add(new_sale)
            db.session.commit()

            # Create new cost
            new_cost = Cost(
                unit_value=data["unit_value"],
                quantity_purchased=data["quantity_purchased"],
                marketing_cost=data["marketing_cost"],
                shipping_cost=data["shipping_cost"],
                packaging_cost=data["packaging_cost"],
                sale_id=new_sale.id
            )
            db.session.add(new_cost)
            db.session.commit()

            # Create new profit
            new_profit = Profit(
                profit_amount=0,
                margin=0,
                sale_id=new_sale.id
            )
            db.session.add(new_profit)
            db.session.commit()

            # Update profit metrics
            update_profit_metrics(new_profit)

            # Prepare the sale data object
            sale_data = {
                "sale_id": new_sale.id,
                "unit_sale_price": f"{new_sale.unit_sale_price:.2f}",
                "quantity_sold": new_sale.quantity_sold,
                "quantity_purchased": new_cost.quantity_purchased,
                "sales_revenue": round(new_sale.unit_sale_price * new_sale.quantity_sold, 2),
                "total_cost": round(new_cost.marketing_cost + new_cost.shipping_cost +
                                    new_cost.packaging_cost + new_cost.unit_value * new_cost.quantity_purchased, 2),
                "profit_id": new_profit.id,
                "profit_amount": round(new_profit.profit_amount, 2),
                "profit_margin": round(new_profit.margin, 2),
                "cost_id": new_cost.id,
                "sale_date": new_sale.sale_date.strftime("%Y-%m-%d %H:%M:%S"),
            }
            
            # returns new product data object and new sale created in an array.
            product_data = new_product.to_dict(only=("id", "description"))
            product_data["sales"] = [sale_data]
            product_data["total_sales_revenue"] = sale_data["quantity_sold"] * sale_data["unit_sale_price"]
            product_data["total_profit_amount"] = sale_data["profit_amount"] 
            product_data["total_cost"] = sale_data["total_cost"]


            # Fetch the user object
            user = User.query.filter_by(id=user_id).first()
            if not user:
                abort(404, "User not found")

            # Prepare the sales analytics data using the helper function
            sales_analytics = calculate_analytics(user)

            # Prepare the response object with both sale data and sales analytics
            response_body = {
                "sale_data": product_data,
                "sales_analytics": sales_analytics
            }

            # Return the response with combined totals and new sale data
            return make_response(response_body, 201)

        except Exception as e:
            db.session.rollback()
            abort(500, f"An error occurred: {str(e)}")


# delete request handler here: deletes sale data and associated cost and profit.
    def delete(self, sale_id):
        user_id = session["user_id"]

        if not user_id:
            abort(401, "User is not authenticated.")

        try:
            # Fetch the sale object by its sale_id
            sale = ProductSale.query.filter_by(id=sale_id).first()

            if not sale:
                abort(404, "Sale data does not exist.")

            # Fetch associated profit and cost for the sale
            profit = sale.profit  # Assuming Sale has a relationship to Profit
            cost = sale.cost  # Assuming Sale has a relationship to Cost

            # Delete related cost if it exists
            if cost:
                db.session.delete(cost)

            # Delete related profit if it exists
            if profit:
                db.session.delete(profit)

            # Delete the sale
            db.session.delete(sale)
            db.session.commit()

            #calculate_analytics , pass user
            user_id = session["user_id"]
            user = User.query.filter_by(id=user_id).first()
            calculate_sales_analytics(user.products)
            sales_analytics = calculate_analytics(user)

            return make_response({"message": "Sale, profit, and cost deleted successfully", "sales_analytics": sales_analytics}, 200)

        except Exception as e:
            db.session.rollback()  # Rollback in case of an error
            abort(500, f"An error occurred: {str(e)}")



# Add the resource to the API
api.add_resource(UserProductSales, '/user_sales', '/user_sales/<int:sale_id>')


#handles POST requests.(product sale by product id)
class UserProducts(Resource):
    # Creates new sale, cost, profit data for the selected product.
    def post(self, product_id):
        user_id = session["user_id"]

        if not user_id:
            abort(401, "User is not authenticated.")

        try:
            # Find product by ID
            product = Product.query.filter_by(id=product_id).first()
            if not product:
                abort(404, "Product not found")

            data = request.get_json()

            # breakpoint()

            # Create sale row for the product
            new_sale = ProductSale(
                unit_sale_price=data["unit_sale_price"],
                quantity_sold=data["quantity"],
                product_id=product_id,
                user_id=user_id
            )
            db.session.add(new_sale)
            db.session.commit()

            # Create new cost
            new_cost = Cost(
                unit_value=data["unit_value"],
                quantity_purchased=data["quantity_purchased"],
                marketing_cost=data["marketing_cost"],
                shipping_cost=data["shipping_cost"],
                packaging_cost=data["packaging_cost"],
                sale_id=new_sale.id
            )
            db.session.add(new_cost)
            db.session.commit()

            # Create new profit
            new_profit = Profit(
                profit_amount=0,
                margin=0,
                sale_id=new_sale.id
            )
            db.session.add(new_profit)
            db.session.commit()

            # Update profit metrics
            update_profit_metrics(new_profit)

            # Prepare the sale data object
            sale_data = {
                "sale_id": new_sale.id,
                "unit_sale_price": f"{new_sale.unit_sale_price:.2f}",
                "quantity_sold": new_sale.quantity_sold,
                "quantity_purchased": new_cost.quantity_purchased,
                "sales_revenue": round(new_sale.unit_sale_price * new_sale.quantity_sold, 2),
                "total_cost": round(new_cost.marketing_cost + new_cost.shipping_cost +
                                    new_cost.packaging_cost + new_cost.unit_value * new_cost.quantity_purchased, 2),
                "profit_id": new_profit.id,
                "profit_amount": round(new_profit.profit_amount, 2),
                "profit_margin": round(new_profit.margin, 2),
                "cost_id": new_cost.id,
                "sale_date": new_sale.sale_date.strftime("%Y-%m-%d %H:%M:%S"),
            }

            product_data = product.to_dict(only=("id","description"))
            # product sales array update here.(calculates total sales revenues, ttl cost, and ttl profit for a product), adds keys to product_data
            product_data["sales"] = [sale.to_dict() for sale in product.sales]
            #get all sales_revenues from sale objects and find the total(updated)

            updated_total_sales_revenue = 0
            updated_profit_amount = 0
            updated_total_cost = 0

            for sale in product.sales:
                updated_total_sales_revenue += float(sale.unit_sale_price * sale.quantity_sold)
                updated_profit_amount += float(sale.profit_amount)

                cost = sale.cost 

                if cost:
                    updated_total_cost += float(cost.total_cost)

                profit = sale.profit

                if profit:
                    updated_profit_amount += float(profit.profit_amount)


            product_data["total_sales_revenue"] = updated_total_sales_revenue
            product_data["total_profit_amount"] = updated_profit_amount
            product_data["total_cost"] = updated_total_cost

            # Fetch the user object
            user = User.query.filter_by(id=user_id).first()
            if not user:
                abort(404, "User not found")

            # Prepare the sales analytics data using the helper function
            sales_analytics = calculate_analytics(user)

            # Prepare the response object with both sale data and sales analytics
            response_body = {
                "sale_data": product_data,
                "sales_analytics": sales_analytics
            }

            # Return the response with combined totals and new sale data
            return make_response(response_body, 201)

        except Exception as e:
            db.session.rollback()
            abort(500, f"An error occurred: {str(e)}")


api.add_resource(UserProducts, '/user_products/<int:product_id>')

class SaleByID(Resource):


    def patch(self, sale_id):
        """
    Update the sale details and calculate the updated profit metrics, and sales revenue.

    Args:
        sale_id (int): The ID of the sale to be updated.

    Returns:
        Response: The response object containing the updated sale data and sales analytics.
    """
        user_id = session["user_id"]

        if not user_id:
            abort(401, "User is not authenticated.")

        # find the sale by id
        sale = ProductSale.query.filter_by(id=sale_id).first()

        if not sale:
            abort(404, "The sale does not exist.")

        try:
            data = request.get_json()

            # updates sales price, quantity sold in sale object.
            # check if quantity sold is not more than quantity purchased.
            cost = sale.cost
            if not sale.quantity_sold < cost.quantity_purchased:
                abort(405, "The update not allowed. The quantity sold is greater than total purchased.")
            
            sale.quantity_sold = data["quantitySold"]
            sale.unit_sale_price = data["unitSalePrice"]

            db.session.commit()

            profit = sale.profit
            update_profit_metrics(profit)

            product = Product.query.filter_by(id=sale.product_id).first()

            # Prepare the sale data object
            sale_data = {
                "sale_id": sale.id,
                "unit_sale_price": f"{sale.unit_sale_price:.2f}",
                "quantity_sold": sale.quantity_sold,
                "quantity_purchased": cost.quantity_purchased,
                "sales_revenue": round(sale.unit_sale_price * sale.quantity_sold, 2),
                "total_cost": round(cost.marketing_cost + cost.shipping_cost +
                                    cost.packaging_cost + cost.unit_value * cost.quantity_purchased, 2),
                "profit_id": profit.id,
                "profit_amount": round(profit.profit_amount, 2),
                "profit_margin": round(profit.margin, 2),
                "cost_id": cost.id,
                "sale_date": sale.sale_date.strftime("%Y-%m-%d %H:%M:%S"),
            }

            # Initialize product data
            product_data = {
                "description": product.description,
                "id": product.id,
                "sales": [],
                "total_sales_revenue": 0,
                "total_profit_amount": 0,
                "total_cost": 0
            }

            # Calculate updated totals and prepare sales data
            for sale in product.sales:
                product_data["total_sales_revenue"] += float(
                    sale.unit_sale_price * sale.quantity_sold)
                product_data["total_profit_amount"] += float(sale.profit_amount)

                cost = sale.cost
                if cost:
                    product_data["total_cost"] += float(cost.total_cost)

                profit = sale.profit
                if profit:
                    product_data["total_profit_amount"] += float(profit.profit_amount)

                product_data["sales"].append({
                    "cost_id": cost.id if cost else None,
                    "profit_amount": round(profit.profit_amount, 2) if profit else None,
                    "profit_id": profit.id if profit else None,
                    "profit_margin": round(profit.margin, 2) if profit else None,
                    "quantity_purchased": cost.quantity_purchased if cost else None,
                    "quantity_sold": sale.quantity_sold,
                    "sale_date": sale.sale_date.strftime("%Y-%m-%d %H:%M:%S"),
                    "unit_sale_price": f"{sale.unit_sale_price:.2f}",
                })

            # Fetch the user object
            user = User.query.filter_by(id=user_id).first()
            if not user:
                abort(404, "User not found")

            # Prepare the sales analytics data using the helper function
            sales_analytics = calculate_analytics(user)

            # Prepare the response object with both sale data and sales analytics
            response_body = {
                "sale_data": product_data,
                "sales_analytics": sales_analytics
            }

            return make_response(response_body, 200)
        
        except Exception as e:
            db.session.rollback()
            abort(500, f"An error occurred: {str(e)}")


api.add_resource(SaleByID, '/sale/<int:sale_id>')


# this script runs the app
if __name__ == '__main__':
    app.run(debug=True, port=5555)
