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
import re
from helpers import total_revenue_for_sale

# User has many products through Profit(Many-to-Many)
# Product has many users through Profit(multiple users can own or access to products.)
# User has many profits
# Profit belongs to User
# Profit belongs to a product.(one-to-many)

# Profit has many costs
# Cost  belongs to a profit.
# Profit has many sales
# Sale belongs to a profit.

# if you delete a profit, delete associated cost and sale.

# cascade- delete orphan.


class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    serialize_rules = ('-profits.user', '-password_hash')

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    email = db.Column(db.String(254), unique=True, nullable=False)
    username = db.Column(db.String(60), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False,
                           server_default=db.func.now())
    updated_at = db.Column(
        db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

    __table_args__ = (
        db.CheckConstraint('name != username', name='check_name_not_username'),
    )

    # User has many profits
    profits = db.relationship(
        'Profit', back_populates='user', cascade='all, delete-orphan')

    # User has many Products through Profit.
    products = association_proxy(
        'profits', 'product', creator=lambda p: Profit(product=p))

    @validates('name')
    def validate_name(self, key, value):
        # uppercase name
        if not value:
            raise ValueError(f'{key} can not be empty.')
        if not isinstance(value, str):
            raise TypeError(f'{key} must be a string.')
        if len(value) < 2 or len(value) > 60:
            raise ValueError(
                f'{key} must be between 2 and 60 characters long.')
        return value

    @validates('email')
    def validate_email(self, key, value):
        if not re.match(r"[^@]+@[^@]+\.[^@]+", value):
            raise ValueError(f'{key} must be a valid email address.')
        return value

    # validate username
    @validates('username')
    def validate_username(self, key, value):
        if not value:
            raise ValueError(f'{key} can not be empty.')
        if not isinstance(value, str):
            raise TypeError(f'{key} must be a string.')
        if len(value) < 3 or len(value) > 60:
            raise ValueError(
                f'{key} should be between 3 and 60 characters long.')
        return value

    # validate password
    @validates('password_hash')
    def validate_password(self, key, value):
        if not value:
            raise ValueError(f'{key} should not be empty.')
        return value

    def __repr__(self):
        return f'User {self.id}, {self.name} ,{self.username}, {self.created_at}, {self.updated_at}'



class Product(db.Model, SerializerMixin):
    __tablename__ = 'products'

    serialize_rules = ('-profits.product',)

    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(100), nullable=False)
    purchased_at = db.Column(db.DateTime, nullable=False,
                             server_default=db.func.now())
    updated_at = db.Column(
        db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

    # Product has many profits
    profits = db.relationship('Profit', back_populates='product')

    # Product has many users through Profit.
    users = association_proxy(
        'profits', 'user', creator=lambda p: Profit(product=p))


    # validate description
    @validates('description')
    def validate_description(self, key, value):
        if len(value) < 3 or len(value) > 100:
            raise ValueError(
                'Description should be between 3 and 100 characters long.')
        return value
    
    #CALCULATE INVENTORY DYNAMICALLY
    #QUANTITY_PURCHASED QUANTITY_SOLD


    def __repr__(self):
        return f'Product {self.id}, {self.description}, {self.unit_value}, {self.purchased_at}, {self.updated_at}'


class Cost(db.Model, SerializerMixin):
    __tablename__ = 'costs'

    serialize_rules = ('-profit.costs',)

    id = db.Column(db.Integer, primary_key=True)
    quantity_purchased = db.Column(db.Numeric(10, 2), nullable=False)
    unit_value = db.Column(db.Numeric(10, 2), nullable=False)
    marketing_cost = db.Column(db.Numeric(10, 2), nullable=False)
    shipping_cost = db.Column(db.Numeric(10, 2), nullable=False)
    packaging_cost = db.Column(db.Numeric(10, 2), nullable=False)

    #Cost belongs to a profit.
    profit_id = db.Column(db.Integer, db.ForeignKey('profits.id'), nullable=False)

    profit = db.relationship('Profit', back_populates='costs')

    # validate costs
    @validates('marketing_cost', 'shipping_cost', 'packaging_cost')
    def validate_costs(self, key, value):
        if value >= 0:  # Allow 0 and positive values
            try:
                # Ensure value is a Decimal
                decimal_value = Decimal(value)
                return decimal_value
            except InvalidOperation:
                raise ValueError(
                    f"{key} must be a valid number.")
        else:
            raise ValueError(
                f"{key} must not be less than 0.")

    @hybrid_property
    def total_cost(self):
        """
        Calculate the total cost including the Product unit value.
        """
        #unit_value * purchased
        try:
            # Calculate total cost for the product_id linked to this Cost instance
            total_cost = Decimal(
                self.marketing_cost) + Decimal(self.shipping_cost) + Decimal(self.packaging_cost)

            # Add the Product unit value
            total_cost += Decimal(self.unit_value) * Decimal(self.quantity_purchased)

            return total_cost.quantize(Decimal('0.01'))
        
        except (InvalidOperation, AttributeError) as e:
            raise ValueError(
                "Calculation error: ensure values are numeric and product exists.")

    def __repr__(self):
        return f'Cost {self.id}, {self.marketing_cost}, {self.shipping_cost}, {self.packaging_cost}, {self.total_cost}'


# PEP 8 Naming Convention
class ProductSale(db.Model, SerializerMixin):
    __tablename__ = 'product_sales'

    serialize_rules = ('-profit.sales',)

    id = db.Column(db.Integer, primary_key=True)
    unit_sale_price = db.Column(db.Numeric(10, 2), nullable=False)
    quantity_sold = db.Column(db.Integer, nullable=False)
    sale_date = db.Column(db.DateTime, nullable=False,
                          server_default=db.func.now())
    updated_at = db.Column(
        db.DateTime, server_default=db.func.now(), onupdate=db.func.now())
    
    #sale belongs to a profit. 
    profit_id = db.Column(db.Integer, db.ForeignKey('profits.id'), nullable=False)

    profit = db.relationship('Profit', back_populates='sales')


    # validate quantity sold, min 1
    @validates('quantity_sold')
    def validate_quantity_sold(self, key, value):
        if value < 1:
            raise ValueError('Quantity sold should be greater than 0.')
        return value

    # sales price needs to be validated after the product is loaded.
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

    # Define the revenue for each sale.
    @hybrid_property
    def sales_revenue(self):
        # call total revenue for sale function from helpers.py
        return total_revenue_for_sale(self)

    # Calculates net profit (Revenue - Total Costs)
    @hybrid_property
    def net_profit(self):
        # Calculate the total item revenue for this sale instance
        total_revenue = self.sales_revenue

        # calculate total cost for this sale instance
        total_cost = sum(cost.total_cost for cost in self.profit.costs)

        # Net profit: Revenue - Total Costs
        net_profit = total_revenue - total_cost
        return net_profit.quantize(Decimal('0.01'))


    def __repr__(self):
        return f'ProductSales {self.id}, {self.unit_sale_price}, {self.quantity_sold}, {self.sale_date}, {self.updated_at}, {self.product_id}'
    
    class Profit(db.Model, SerializerMixin):
    __tablename__ = 'profits'

    serialize_rules = ('-user.profits', '-product.profits',
                       '-costs.profit', '-sales.profit')

    id = db.Column(db.Integer, primary_key=True)
    profit_amount = db.Column(db.Numeric(
        precision=10, scale=2), nullable=False)
    # with 2 decimal points, 5 digits precision
    margin = db.Column(db.Numeric(precision=5, scale=2), nullable=False)
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

    # profit has many costs
    costs = db.relationship('Cost', back_populates='profit')

    # profit has many sales.
    sales = db.relationship('ProductSale', back_populates='profit')

    # validate profit amount
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

    # validate profit margin
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

