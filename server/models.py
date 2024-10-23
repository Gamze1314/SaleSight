"""
This module implements the models and define relationships between models."""
from config import db
from sqlalchemy.orm import validates
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
# import re
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy import select, func


#relationships
# User has many products through Profit(Many-to-Many)
#Product has many users through Profit(multiple users can own or access to products.)
#User has many profits
#Profit belongs to User
#Profit belongs to a product.(one-to-many)

# Product has many sales.
# Sale belongs to a product.  Each sale (ProductSales) refers to a specific Product and is linked to a User

# Product has many costs (One-to-many)
#Cost belongs to a product.


#validations and constraints

# serialization rules.-done=> debug, test in flask shell.


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
    
    #User has many profits
    profits = db.relationship('Profit', back_populates='user')
    
    #User has many Products through Profit.
    products = association_proxy('profits', 'product', creator=lambda p: Profit(product=p))

    def __repr__(self):
        return f'User {self.id}, {self.name} ,{self.username}, {self.password_hash}, {self.created_at}, {self.updated_at}'


class Profit(db.Model, SerializerMixin):
    __tablename__ = 'profits'

    serialize_rules = ('-user.profits', '-product.profits')

    id = db.Column(db.Integer, primary_key=True)
    profit_amount = db.Column(db.Numeric(10, 2), nullable=False)
    margin = db.Column(db.Numeric(10, 2), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False,
                           server_default=db.func.now())
    updated_at = db.Column(
        db.DateTime, server_default=db.func.now(), onupdate=db.func.now())
    # foreign keys to connect product, user and sales.
    product_id = db.Column(db.Integer, db.ForeignKey(
        'products.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    #Profit belongs to a user
    user = db.relationship('User', back_populates='profits')

    #Profit belongs to a product
    product = db.relationship('Product', back_populates='profits')


    def __repr__(self):
        return f'Profit {self.id}, {self.profit_amount}, {self.margin}, {self.product_id}, {self.user_id}, {self.created_at}, {self.updated_at}'


class Product(db.Model, SerializerMixin):
    __tablename__ = 'products'

    serialize_rules = ('-profits.product', '-costs.product', '-sales.product')

    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(255), nullable=False)
    unit_value = db.Column(db.Numeric(10, 2), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    purchased_at = db.Column(db.DateTime, nullable=False,
                             server_default=db.func.now())
    updated_at = db.Column(
        db.DateTime, server_default=db.func.now(), onupdate=db.func.now())
    
    #Product has many profits
    profits = db.relationship('Profit', back_populates='product')

    #Product has many users through Profit.
    users = association_proxy('profits', 'user', creator=lambda p: Profit(product=p))

    #Product has many costs (One-to-many)
    costs = db.relationship('Cost', back_populates='product')

    #Product has many sales (One-to-many)
    sales = db.relationship('ProductSale', back_populates='product')


    def __repr__(self):
        return f'Product {self.id}, {self.description}, {self.unit_price}, {self.quantity}, {self.purchased_at}, {self.updated_at}'


#PEP 8 Naming Convention
class ProductSale(db.Model, SerializerMixin):
    __tablename__ = 'product_sales'

    serialize_rules = ('-product.sales' ,)

    id = db.Column(db.Integer, primary_key=True)
    unit_sale_price = db.Column(db.Numeric(10, 2), nullable=False)
    quantity_sold = db.Column(db.Integer, nullable=False)
    sale_date = db.Column(db.DateTime, nullable=False,
                          server_default=db.func.now())
    updated_at = db.Column(
        db.DateTime, server_default=db.func.now(), onupdate=db.func.now())
    #foreign key to define relationship between product and associated sales
    product_id = db.Column(db.Integer, db.ForeignKey(
        'products.id'), nullable=False)
    

    #ProductSales belongs to a product
    product = db.relationship('Product', back_populates='sales')

    #hybrid properties for profit margin per sale, and sales price by profit margin from Profit table.
    # sales Revenue - total cost = Net Profit
    # then find profit margin per sale.

    #calculate total revenue
    @hybrid_property
    def total_revenue(self):
        return self.unit_sale_price * self.quantity_sold
    
    #calculate the profit per product sale( Revenue - profit_margin / 100)
    @hybrid_property
    def profit_per_sale(self):
        return self.revenue * (self.sale_profit_margin / 100)
    

    #calculate net profit (Revenue - costs)
    @hybrid_property
    def net_profit(self):
        total_cost = sum([cost.marketing_cost + cost.shipping_cost + cost.packaging_cost for cost in self.product.cost])
        return self.total_revenue - total_cost

    
    
    #calculate sales price by profit margin from Profit table.(unit_sales_price)
    # @hybrid_property
    # def sales_price_by_profit_margin(self):
    #     return self.total_revenue + (self.net_profit * (self.sale_profit_margin / 100))



    def __repr__(self):
        return f'ProductSales {self.id}, {self.unit_sales_price}, {self.quantity_sold}, {self.sale_date}, {self.updated_at}, {self.product_id}'


class Cost(db.Model, SerializerMixin):
    __tablename__ = 'costs'

    serialize_rules = ('-product.costs',)

    id = db.Column(db.Integer, primary_key=True)
    marketing_cost = db.Column(db.Numeric(10, 2), nullable=False)
    shipping_cost = db.Column(db.Numeric(10, 2), nullable=False)
    packaging_cost = db.Column(db.Numeric(10, 2), nullable=False)
    #foreign key to define relationship between product and associated costs
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)

    #Cost belongs to a product
    product = db.relationship('Product', back_populates='costs')

    @hybrid_property
    def total_cost(self):
        total_cost = sum([cost.marketing_cost + cost.shipping_cost + cost.packaging_cost for cost in self.product.cost])
        return total_cost

    def __repr__(self):
        return f'Cost {self.id}, {self.marketing_cost}, {self.shipping_cost}, {self.packaging_cost}, {self.product_id}, {self.total_cost}'
