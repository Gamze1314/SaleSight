"""
This module implements the models and define relationships between models."""
from config import db
from sqlalchemy.orm import validates
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
# import re
from sqlalchemy.ext.hybrid import hybrid_property
from decimal import Decimal, InvalidOperation
import re
from helpers import total_revenue_for_sale, calculate_sale_profit_amount

# User has many products through UserProductAssociation
# Product has many users through UserProductAssociation

# User has many sales
# A Sale belongs to a user.

# Product has many sales.
# A Sale belongs to a product.

# A Sale has one cost
# a Sale has one profit.

# Profit belongs to a sale.
# Cost belongs to a sale.

# NOTES
# User profits User => Sale => Profit
# ProductCosts => Product => Sale => Cost

# New update: userProducts table to keep track of product inventory.


class User_Product_Association(db.Model, SerializerMixin):
    __tablename__ = 'user_products'

    serialize_only = ('product_id', 'user_id')

    user_id = db.Column(db.Integer, db.ForeignKey(
        'users.id'), primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey(
        'products.id'), primary_key=True)
    created_at = db.Column(db.DateTime, nullable=False,
                           server_default=db.func.now())
    updated_at = db.Column(db.DateTime, nullable=False,
                           server_default=db.func.now(), onupdate=db.func.now())
    
    # user / product relationship
    user = db.relationship('User', back_populates='_product_associations')
    product = db.relationship('Product', back_populates='_user_associations')


class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    serialize_rules = (
        '-password_hash', '-_product_associations', '-sales.user')
    
    serialize_only = ('id', 'name', 'username', 'email')

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

    sales = db.relationship('ProductSale', back_populates='user')

    # Relationship to association table
    _product_associations = db.relationship(
        'User_Product_Association', back_populates='user')

    products = association_proxy(
        '_product_associations', 'product', creator=lambda p: Product(product=p))

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

    serialize_rules = ('-sales.product', '-_user_associations')

    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(100), nullable=False)
    purchased_at = db.Column(db.DateTime, nullable=False,
                             server_default=db.func.now())
    updated_at = db.Column(
        db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

    # product has many sales
    sales = db.relationship('ProductSale', back_populates='product')

    # Relationship to association table
    _user_associations = db.relationship(
        'User_Product_Association', back_populates='product')

    # product has many users.(association_proxy thru association table)
    users = association_proxy(
        '_user_associations',
        'user',
        creator=lambda u: User_Product_Association(user=u)
    )

    # validate description
    @validates('description')
    def validate_description(self, key, value):
        if len(value) < 3 or len(value) > 100:
            raise ValueError(
                'Description should be between 3 and 100 characters long.')
        return value

    def __repr__(self):
        return f'Product {self.id}, {self.description} {self.purchased_at}, {self.updated_at}'



# PEP 8 Naming Convention
class ProductSale(db.Model, SerializerMixin):
    __tablename__ = 'product_sales'

    # serialize_rules = ('-product.sales', '-user.sales', '-costs.sale', '-profits.sale', 'sales_revenue',
    #                    'profit_amount', 'profit_margin')
    serialize_only = ('unit_sale_price', 'quantity_sold', 'sale_date', 'sales_revenue',
                      'profit_amount', 'profit_margin')

    id = db.Column(db.Integer, primary_key=True)
    unit_sale_price = db.Column(db.Numeric(10, 2), nullable=False)
    quantity_sold = db.Column(db.Integer, nullable=False)
    sale_date = db.Column(db.DateTime, nullable=False,
                          server_default=db.func.now())
    updated_at = db.Column(
        db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

    # sale belongs to a product
    product_id = db.Column(db.Integer, db.ForeignKey(
        'products.id'), nullable=False)

    # sale belongs to an user.
    user_id = db.Column(db.Integer, db.ForeignKey(
        'users.id'), nullable=False)

    product = db.relationship('Product', back_populates='sales')
    user = db.relationship('User', back_populates='sales')
    # sale has one cost
    cost = db.relationship('Cost', back_populates='sale',
                        uselist=False, cascade="all, delete-orphan")
    # a sale has one profit
    profit = db.relationship('Profit', back_populates='sale',
                          uselist=False, cascade="all, delete-orphan")

    @validates('quantity_sold')
    def validate_quantity_sold(self, key, value):
        # can be 0 or greater than 0.
        if not isinstance(value, int):
            raise TypeError('Quantity sold must be an integer.')
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

    # # Calculates net profit (Revenue - Total Costs)
    @hybrid_property
    def profit_amount(self):
        # Calculate the total item revenue for this sale instance
        return calculate_sale_profit_amount(self)

    @hybrid_property
    def profit_margin(self):
        # Calculate the total item revenue for this sale instance
        total_revenue = self.sales_revenue

        # zero revenue case to avoid division by zero
        if total_revenue == 0:
            return Decimal('0.00')

        # Profit margin: (Revenue - Total Costs) / Revenue * 100
        profit_margin = self.profit_amount / total_revenue * 100

        return profit_margin.quantize(Decimal('0.01'))

    def __repr__(self):
        return f'ProductSales {self.id}, {self.unit_sale_price}, {self.quantity_sold},{self.profit_amount}, {self.profit_margin} {self.sale_date}, {self.updated_at}'
    
class Cost(db.Model, SerializerMixin):
    __tablename__ = 'costs'

    serialize_rules = ('-sale.cost', 'total_cost')

    id = db.Column(db.Integer, primary_key=True)
    quantity_purchased = db.Column(db.Integer, nullable=False)
    unit_value = db.Column(db.Numeric(10, 2), nullable=False)
    marketing_cost = db.Column(db.Numeric(10, 2), nullable=False)
    shipping_cost = db.Column(db.Numeric(10, 2), nullable=False)
    packaging_cost = db.Column(db.Numeric(10, 2), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False,
                           server_default=db.func.now())
    updated_at = db.Column(
        db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

    sale_id = db.Column(db.Integer, db.ForeignKey(
        'product_sales.id'), nullable=False)

    # Cost belongs to a sale
    sale = db.relationship(
        'ProductSale', back_populates='cost', uselist=False)

    # validate costs
    @validates('marketing_cost', 'shipping_cost', 'packaging_cost', 'unit_value')
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
        
    #validate quantity_purchased
    @validates('quantity_purchased')
    def validate_quantity_purchased(self, key, value):
        # Check if the value is non-negative
        if value >= 0:  # Allow 0 and positive values
            try:
                # Ensure value is an integer
                value = int(value)
            except ValueError:
                raise ValueError(f"{key} must be a valid integer.")
        else:
            raise ValueError(f"{key} must not be less than 0.")

        # Check if quantity_purchased is greater than or equal to quantity_sold
        if self.sale and self.sale.quantity_sold > value:
            raise ValueError(f"{key} must not be less than quantity sold.")

        return value


    @hybrid_property
    def total_cost(self):
        """
        Calculate the total cost including the Product unit value.
        """
        # unit_value * purchased
        try:
            # Calculate total cost for the product_id linked to this Cost instance
            total_cost = Decimal(
                self.marketing_cost) + Decimal(self.shipping_cost) + Decimal(self.packaging_cost)

            # Add the Product unit value
            total_cost += Decimal(self.unit_value) * \
                Decimal(self.quantity_purchased)

            return total_cost.quantize(Decimal('0.01'))

        except (InvalidOperation, AttributeError) as e:
            raise ValueError(
                "Calculation error: ensure values are numeric and product exists.")

    def __repr__(self):
        return f'Cost {self.id}, {self.marketing_cost}, {self.shipping_cost}, {self.packaging_cost}, {self.total_cost}'


class Profit(db.Model, SerializerMixin):
    __tablename__ = 'profits'

    serialize_rules = ('-sale.profit',)

    id = db.Column(db.Integer, primary_key=True)
    profit_amount = db.Column(db.Numeric(
        precision=10, scale=2), nullable=False)
    # with 2 decimal points, 5 digits precision
    margin = db.Column(db.Numeric(precision=5, scale=2), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False,
                           server_default=db.func.now())
    updated_at = db.Column(
        db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

    sale_id = db.Column(db.Integer, db.ForeignKey(
        'product_sales.id'), nullable=False)

    sale = db.relationship(
        'ProductSale', back_populates='profit', uselist=False)

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
        return f'Profit {self.id}, {self.profit_amount}, {self.sale_id}, {self.margin}, {self.created_at}, {self.updated_at}'
