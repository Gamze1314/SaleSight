"""
This module defines the routes for the Flask application and serves as the entry point.
"""
import os
from flask import Flask, make_response, request, abort, session, send_from_directory
from config import db, app, api, flask_bcrypt
from flask_restful import Resource
from models import User, Product, Profit, ProductSale, Cost, User_Product_Association
from decimal import Decimal
from helpers import update_profit_metrics, calculate_analytics, calculate_sales_analytics

# pw_hash = flask_bcrypt.generate_password_hash('hunter2')
# flask_bcrypt.check_password_hash(pw_hash, 'hunter2')  # returns True
# print(pw_hash)
REACT_BUILD_DIR = os.path.abspath(os.path.join(os.getcwd(), '../client/build'))

@app.route('/')
def index():
    # Serve the index.html file directly from the React build directory
    index_path = os.path.join(REACT_BUILD_DIR, 'index.html')

    # Check if the index.html exists for debugging purposes
    if not os.path.exists(index_path):
        return f"File not found: {index_path}", 404

    return send_from_directory(REACT_BUILD_DIR, 'index.html')

@app.route('/login')
def login():
    return send_from_directory(REACT_BUILD_DIR, 'index.html')

@app.route('/logout')
def logout():
    session.clear()  # Clears all session data
    return make_response('Logged out successfully.', 200)

@app.route('/signup')
def register():
    return send_from_directory(REACT_BUILD_DIR, 'index.html')



#static files are loading.
@app.route('/static/<folder>/<file>')
def static_proxy(folder, file):
    static_folder = os.path.join(REACT_BUILD_DIR, 'static')
    return send_from_directory(static_folder, os.path.join(folder, file))


class CheckSession(Resource):
    def get(self):
        try:
            # Safely get user_id from session
            user_id = session['user_id']
            if user_id:
                user = User.query.filter_by(id=user_id).first()
                if user:
                    return make_response(user.to_dict(), 200)
                else:
                    session.clear()  # Clears all session data
            else:
                make_response({'message':'User is not authenticated.'}, 401)
        except Exception as e:
                make_response({'message': 'Please enter your credentials to login.'}, 401)


api.add_resource(CheckSession, '/check_session')


class SignUp(Resource):
    def post(self):
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
                abort(401, "The username does not exist.")

            if not flask_bcrypt.check_password_hash(user.password_hash, password):
                # Specific error for incorrect password
                abort(401, "You have entered an incorrect password. Please try again.")

            # If authentication is successful
            session['user_id'] = user.id
            session.permanent = True
            return make_response(user.to_dict(), 200)

        except ValueError as e:
            abort(500, f"Failed to login: {str(e)}")


api.add_resource(Login, '/login')


# Logout Resource
class LogOut(Resource):
    def delete(self):
        try:
            # Check if 'user_id' is in session
            if 'user_id' in session:
                user_id = session['user_id']
                session.clear()  # Clears all session data
                return make_response({'message': 'User logged out successfully'}, 200)
            else:
                abort(400, "No user currently logged in")
        except Exception as e:
            abort(500, "Internal server error")


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
            response_body = {
                "total_sales_revenue": total_sales_revenue,
                "total_profit_amount": total_profit_amount,
                "total_cost": total_cost,
                "total_quantity_sold": total_quantity_sold,
                "average_profit_margin": average_profit_margin
            }

            # Return the response with combined totals
            return make_response(response_body, 200)

        except Exception as e:
            db.session.rollback()
            abort(500, f"An error occurred: {str(e)}")

api.add_resource(SalesAnalytics, '/sales_analytics')


#Handles GET and DELETE requests.
class UserProductSales(Resource):
    def get(self):
        # returns a response for the user sales and associated cost and profit. If there are no sales associated with the user, return 0 values for sales revenue, total cost, and profit amount.
        user_id = session["user_id"]

        if not user_id:
            abort(401, "User is not authenticated.")

        # Query for the user
        user = User.query.filter_by(id=user_id).first()

        if not user:
            abort(404, "User not found")
#data required;
# unit_sale_price
# quantity_sold
#quantity purchased
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
                total_quantity_purchased = 0  # Initialize total_quantity_purchased
                sales_data = []

                # Process sales for the product
                for sale in product_sales:
                    sale_dict = sale.to_dict()

                    sale_dict["sale_id"] = sale.id  # Add sale_id

                    # Include profit if it exists
                    profit = sale.profit
                    if profit:
                        sale_dict["profit_id"] = profit.id  # Add profit_id
                        sale_dict["profit_amount"] = float(profit.profit_amount)
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
                        # Add quantity purchased
                        total_quantity_purchased += int(cost.quantity_purchased)
                    else:
                        sale_dict["cost_id"] = None
                        sale_dict["total_cost"] = 0
                        sale_dict["quantity_purchased"] = 0

                    # Calculate sales revenue
                    sale_dict["sales_revenue"] = float(
                        sale.unit_sale_price) * int(sale.quantity_sold)
                    total_sales_revenue += sale_dict["sales_revenue"]

                    # Accumulate total quantity sold
                    total_quantity_sold += int(sale.quantity_sold)

                    # Add sale to sales data
                    sales_data.append(sale_dict)

                # Add totals to product data
                product_data["sales"] = sales_data
                product_data["total_sales_revenue"] = total_sales_revenue
                product_data["total_profit_amount"] = total_profit_amount
                product_data["total_cost"] = total_cost
                product_data["total_quantity_sold"] = total_quantity_sold
                product_data["total_quantity_purchased"] = total_quantity_purchased

                response_body.append(product_data)

            # Return the response with sales, cost, and profit data
            return make_response(response_body, 200)

        except Exception as e:
            db.session.rollback()
            abort(500, f"An error occurred: {str(e)}")

#POST request handler => creates new product, sale, cost, profit data for new user. 
    def post(self):
        user_id = session["user_id"]

        if not user_id:
            abort(401, "User is not authenticated.")

        data = request.get_json()

        prod_description = data["description"]
        # prod desc. upper
        formatted = prod_description.upper()

        # Backend Check: Add a check here to verify if a product with the same name  already exists for the user before adding a new product.
        existing_product = Product.query.filter_by(
                        description=formatted).first()
        if existing_product and existing_product.description.upper() == formatted:
            abort(400, "Product already exists")
            
        try:

            new_product = Product(description=formatted)

            db.session.add(new_product)
            db.session.commit()

            #user_product_association ?
            user = User.query.get(user_id)
            association = User_Product_Association(
                user_id=user.id, product_id=new_product.id)
            
            
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
            product_data["total_sales_revenue"] = float(sale_data["quantity_sold"]) * float(sale_data["unit_sale_price"])
            # accumulate total quantity sold
            # Add quantity sold
            product_data["total_quantity_sold"] = int(sale_data["quantity_sold"])
            product_data["total_quantity_purchased"] = sale_data["quantity_purchased"]
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

            # Re-attach the sale object to the session (merge it)
            # sale = db.session.merge(sale)

            # Now the sale object is attached to the session, and you can access the 'product' relationship
            product = sale.product  # This should now work without DetachedInstanceError

            # Delete related cost and profit if they exist
            profit = sale.profit
            cost = sale.cost

            if cost:
                db.session.delete(cost)
            if profit:
                db.session.delete(profit)

            # Delete the sale
            db.session.delete(sale)
            db.session.commit()

            # Calculate analytics
            user = User.query.filter_by(id=user_id).first()
            sales_analytics = calculate_analytics(user)

            # Recalculate totals and sales data
            total_sales_revenue = 0
            total_profit_amount = 0
            total_cost = 0
            total_quantity_sold = 0
            total_quantity_purchased = 0
            sales_data = []

            # Iterate over the sales data associated with the product
            for sale in product.sales:
                sale_dict = sale.to_dict()
                total_sales_revenue += float(sale_dict["sales_revenue"])
                total_profit_amount += float(sale_dict["profit_amount"])
                total_cost += float(sale.cost.total_cost)
                total_quantity_sold += int(sale_dict["quantity_sold"])
                total_quantity_purchased += int(sale.cost.quantity_purchased)
                

                sales_data.append({
                    "sale_id": sale.id,
                    "sales_revenue": sale.sales_revenue,
                    "cost_id": sale.cost.id if sale.cost else None,
                    "profit_amount": round(sale.profit.profit_amount, 2) if sale.profit else None,
                    "profit_id": sale.profit.id if sale.profit else None,
                    "profit_margin": round(sale.profit.margin, 2) if sale.profit else None,
                    "quantity_purchased": sale.cost.quantity_purchased if sale.cost else None,
                    "quantity_sold": sale.quantity_sold,
                    "sale_date": sale.sale_date.strftime("%Y-%m-%d %H:%M:%S"),
                    "unit_sale_price": f"{sale.unit_sale_price:.2f}",
                })


            # Prepare the updated product data
            product_data = product.to_dict(only=("id", "description"))
            product_data["sales"] = sales_data
            product_data["total_sales_revenue"] = total_sales_revenue
            product_data["total_quantity_sold"] = total_quantity_sold
            product_data["total_quantity_purchased"] = total_quantity_purchased
            product_data["total_profit_amount"] = total_profit_amount
            product_data["total_cost"] = total_cost

            return make_response({"sale_data": product_data, "sales_analytics": sales_analytics}, 200)

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

            product_data = product.to_dict(only=("id","description"))
            # product sales array update here.(calculates total sales revenues, ttl cost, and ttl profit for a product), adds keys to product_data
            product_data["sales"] = []
            #get all sales_revenues from sale objects and find the total(updated)

            updated_total_sales_revenue = 0
            updated_profit_amount = 0
            updated_total_cost = 0
            #add quantity sold, purchased
            updated_total_quantity_sold = 0
            #add total_quantity_purchased
            updated_total_quantity_purchased = 0

            #loop through all sales of the product, calculate total sales revenue, total profit amount, total cost and total quantity sold

            for sale in product.sales:
                updated_total_sales_revenue += float(sale.unit_sale_price * sale.quantity_sold)
                updated_profit_amount += float(sale.profit_amount)
                updated_total_quantity_sold += int(sale.quantity_sold)

                cost = sale.cost 

                if cost:
                    #QUANTITY_PURCHASED KEY
                    updated_total_cost += float(cost.total_cost)
                    updated_total_quantity_purchased += int(cost.quantity_purchased)


                profit = sale.profit

                if profit:
                    updated_profit_amount += float(profit.profit_amount)

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

                
                product_data["sales"].append(sale_data)

            product_data["total_sales_revenue"] = updated_total_sales_revenue
            product_data["total_profit_amount"] = updated_profit_amount
            product_data["total_cost"] = updated_total_cost
            product_data["total_quantity_sold"] = updated_total_quantity_sold
            product_data["total_quantity_purchased"] = updated_total_quantity_purchased

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
            product = Product.query.filter_by(id=sale.product_id).first()
            # check if quantity sold is not more than quantity purchased.
            cost = sale.cost
            total_quantity_purchased = sum(sale.cost.quantity_purchased for sale in product.sales)

            if not data["quantitySold"] <= total_quantity_purchased:
                abort(400, "The update not allowed. The quantity sold is greater than total purchased.")
            #updates the fields.
            sale.quantity_sold = data["quantitySold"]
            sale.unit_sale_price = data["unitSalePrice"]

            db.session.commit()

            profit = sale.profit
            update_profit_metrics(profit)



            # Initialize product data
            product_data = {
                "description": product.description,
                "id": product.id,
                "sales": [],
                "total_sales_revenue": 0,
                "total_profit_amount": 0,
                "total_quantity_sold": 0,
                "total_quantity_purchased": 0,
                "total_cost": 0
            }

            # Calculate updated totals and prepare sales data
            for sale in product.sales:
                product_data["total_sales_revenue"] += float(
                    sale.unit_sale_price * sale.quantity_sold)
                product_data["total_profit_amount"] += float(sale.profit_amount)
                product_data["total_quantity_sold"] += sale.quantity_sold
                product_data["total_quantity_purchased"] += sale.cost.quantity_purchased

                cost = sale.cost
                if cost:
                    product_data["total_cost"] += float(cost.total_cost)

                profit = sale.profit
                if profit:
                    product_data["total_profit_amount"] += float(profit.profit_amount)

                product_data["sales"].append({
                    "sale_id": sale.id,
                    "sales_revenue": sale.sales_revenue,
                    "total_cost": sale.cost.total_cost,
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

            # the sales analytics data calculated with the helper function
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
    app.run(debug=True, port=6000)

# gunicorn: Required for running the application in a production WSGI server.
# honcho start -f Procfile.dev  => to run both react and flask servers.
