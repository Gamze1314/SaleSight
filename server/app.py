"""
This module defines the routes for the Flask application and serves as the entry point.
"""
from flask import make_response
from config import app  # Import the app from config.py
from models import User, Product, Profit, ProductSales, Cost


# import Flask login to handle user authentication and authorization.
# Example route


@app.route('/')
def index():
    return make_response('This is SalesSight API', 200)

# Define other routes here


# Ensure this script runs the app
if __name__ == '__main__':
    app.run(debug=True, port=5555)
    