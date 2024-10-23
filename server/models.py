"""
This module implements the models and define relationships between models."""
from config import db
from sqlalchemy.orm import validates
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
# import re
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy import select, func
from decimal import Decimal, InvalidOperation

# User has many products through Profit(Many-to-Many)
# Product has many users through Profit(multiple users can own or access to products.)
# User has many profits
# Profit belongs to User
# Profit belongs to a product.(one-to-many)

# Product has many sales.
# Sale belongs to a product.  Each sale (ProductSales) refers to a specific Product and is linked to a User

# Product has many costs (One-to-many)
# Cost belongs to a product.


class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    serialize_rules = ('-profits.user', '-password_hash')

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False,
                           server_default=db.func.now())
    updated_at = db.Column(
        db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

    # User has many profits
    profits = db.relationship('Profit', back_populates='user')

    # User has many Products through Profit.
    products = association_proxy(
        'profits', 'product', creator=lambda p: Profit(product=p))

    #validate name and username
    @validates('username')
    def validate_username(self, key, value):
        if len(value) < 3 or len(value) > 50:
            raise ValueError('Username should be between 3 and 50 characters long.')
        if not value.isalpha():
            raise ValueError('Name should contain only alphabetic characters.')
        return value
    
    # validate password
    @validates('password_hash')
    def validate_password(self, key, value):
        if not value:
            raise ValueError(f'{key} should not be empty.')
        return value

    def __repr__(self):
        return f'User {self.id}, {self.name} ,{self.username}, {self.password_hash}, {self.created_at}, {self.updated_at}'


class Profit(db.Model, SerializerMixin):
    __tablename__ = 'profits'

    serialize_rules = ('-user.profits', '-product.profits')

    id = db.Column(db.Integer, primary_key=True)
    profit_amount = db.Column(db.Numeric(precision=10, scale=2), nullable=False)
    margin = db.Column(db.Numeric(precision=5, scale=2), nullable=False)  # with 2 decimal points, 5 digits precision
    created_at = db.Column(db.DateTime, nullable=False,
                           server_default=db.func.now())
    updated_at = db.Column(
        db.DateTime, server_default=db.func.now(), onupdate=db.func.now())
    # foreign keys to connect product, user and sales.
    product_id = db.Column(db.Integer, db.ForeignKey(
        'products.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    # Profit belongs to a user
    user = db.relationship('User', back_populates='profits')

    # Profit belongs to a product
    product = db.relationship('Product', back_populates='profits')

    #validate profit amount
    @validates('profit_amount')
    def validate_profit_amount(self, key, value):
        # Ensure the value is a Decimal and has at most 2 decimal places
        if not isinstance(value, Decimal):
            try:
                value = Decimal(value)  # Convert to Decimal
            except (InvalidOperation, ValueError):
                raise ValueError(f'{key} must be a valid decimal number.')
            
        # Check for at most 2 decimal places
        if value.quantize(Decimal('0.01')) != value:
            raise ValueError(f'{key} must have exactly 2 decimal places.')

        return value
    
    #validate profit margin
    @validates('margin')
    def validate_margin(self, key, value):
        # Ensure the value is a Decimal and has at most 2 decimal places
        if isinstance(value, Decimal):
            value = round(value, 2)
        # Convert value to string and check for the decimal precision
        str_value = f'{value:.2f}'
        if '.' in str_value and len(str_value.split('.')[-1]) > 2:
            raise ValueError(f'{key} must have exactly 2 decimal places.')
        return value


    def __repr__(self):
        return f'Profit {self.id}, {self.profit_amount}, {self.margin}, {self.product_id}, {self.user_id}, {self.created_at}, {self.updated_at}'


class Product(db.Model, SerializerMixin):
    __tablename__ = 'products'

    serialize_rules = ('-profits.product', '-costs.product', '-sales.product')

    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(100), nullable=False)
    unit_value = db.Column(db.Numeric(precision=10, scale=2), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    purchased_at = db.Column(db.DateTime, nullable=False,
                             server_default=db.func.now())
    updated_at = db.Column(
        db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

    # Product has many profits
    profits = db.relationship('Profit', back_populates='product')

    # Product has many users through Profit.
    users = association_proxy(
        'profits', 'user', creator=lambda p: Profit(product=p))

    # Product has many costs (One-to-many)
    costs = db.relationship('Cost', back_populates='product')

    # Product has many sales (One-to-many)
    sales = db.relationship('ProductSale', back_populates='product')

    # validate description
    @validates('description')
    def validate_description(self, key, value):
        if len(value) < 3 or len(value) > 100:
            raise ValueError('Description should be between 3 and 100 characters long.')
        return value
    
    @validates('quantity')
    def validate_quantity(self, key, value):
        if value < 1:
            raise ValueError('Quantity should be greater than 0.')
        return value

    def __repr__(self):
        return f'Product {self.id}, {self.description}, {self.unit_value}, {self.quantity}, {self.purchased_at}, {self.updated_at}'


# PEP 8 Naming Convention
class ProductSale(db.Model, SerializerMixin):
    __tablename__ = 'product_sales'

    serialize_rules = ('-product.sales',)

    id = db.Column(db.Integer, primary_key=True)
    unit_sale_price = db.Column(db.Numeric(10, 2), nullable=False)
    quantity_sold = db.Column(db.Integer, nullable=False)
    sale_date = db.Column(db.DateTime, nullable=False,
                          server_default=db.func.now())
    updated_at = db.Column(
        db.DateTime, server_default=db.func.now(), onupdate=db.func.now())
    # foreign key to define relationship between product and associated sales
    product_id = db.Column(db.Integer, db.ForeignKey(
        'products.id'), nullable=False)

    # ProductSales belongs to a product
    product = db.relationship('Product', back_populates='sales')

    #validate quantity sold, min 1
    @validates('quantity_sold')
    def validate_quantity_sold(self, key, value):
        if value < 1:
            raise ValueError('Quantity sold should be greater than 0.')
        return value
    
    #sales price needs to be validated after the product is loaded.

    @validates('unit_sale_price')
    def validate_unit_sale_price(self, key, value):
        # Check if the value is already a Decimal
        if not isinstance(value, Decimal):
            try:
                value = Decimal(value)  # Convert to Decimal
            except (InvalidOperation, ValueError):
                raise ValueError(f'{key} must be a valid decimal number.')

        # Check for exactly 2 decimal places
        if value != value.quantize(Decimal('0.01')):
            raise ValueError(f'{key} must have exactly 2 decimal places.')

        # value is a positive number ?
        if value < 0:
            raise ValueError(f'{key} must be a positive number.')

        return value

    # calculate total revenue
    @hybrid_property
    def total_revenue(self):
        return self.unit_sale_price * self.quantity_sold

    # calculate the profit per product sale( Revenue - profit_margin / 100)
    @hybrid_property
    def profit_per_sale(self):
        return self.revenue * (self.sale_profit_margin / 100)

    # calculate net profit (Revenue - costs)

    @hybrid_property
    def net_profit(self):
        total_cost = sum([cost.marketing_cost + cost.shipping_cost +
                         cost.packaging_cost for cost in self.product.cost])
        return self.total_revenue - total_cost

    def __repr__(self):
        return f'ProductSales {self.id}, {self.unit_sales_price}, {self.quantity_sold}, {self.sale_date}, {self.updated_at}, {self.product_id}'


class Cost(db.Model, SerializerMixin):
    __tablename__ = 'costs'

    serialize_rules = ('-product.costs',)

    id = db.Column(db.Integer, primary_key=True)
    marketing_cost = db.Column(db.Numeric(10, 2), nullable=False)
    shipping_cost = db.Column(db.Numeric(10, 2), nullable=False)
    packaging_cost = db.Column(db.Numeric(10, 2), nullable=False)
    # foreign key to define relationship between product and associated costs
    product_id = db.Column(db.Integer, db.ForeignKey(
        'products.id'), nullable=False)

    # Cost belongs to a product
    product = db.relationship('Product', back_populates='costs')

    #validate costs
    @validates('marketing_cost','shipping_cost', 'packaging_cost')
    def validate_costs(self, key, value):
        if value < 0:
            raise ValueError(f'{key} cost should be a positive number.')
        return value

    @hybrid_property
    def total_cost(self):
        total_cost = sum([cost.marketing_cost + cost.shipping_cost +
                         cost.packaging_cost for cost in self.product.cost])
        return Decimal(total_cost)

    def __repr__(self):
        return f'Cost {self.id}, {self.marketing_cost}, {self.shipping_cost}, {self.packaging_cost}, {self.product_id}, {self.total_cost}'
