"""
This module implements the models and define relationships between models."""
from config import db
# from sqlalchemy.orm import validates
# from sqlalchemy_serializer import SerializerMixin
# from sqlalchemy.ext.associationproxy import association_proxy
# import re
# from sqlalchemy.ext.hybrid import hybrid_property



class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False,
                           server_default=db.func.now())
    updated_at = db.Column(
        db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

    def __repr__(self):
        return f'User {self.id}, {self.name} ,{self.username}, {self.password_hash}, {self.created_at}, {self.updated_at}'


class Profit(db.Model):
    __tablename__ = 'profits'

    id = db.Column(db.Integer, primary_key=True)
    profit_amount = db.Column(db.Numeric, nullable=False)
    margin = db.Column(db.Numeric, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False,
                           server_default=db.func.now())
    updated_at = db.Column(
        db.DateTime, server_default=db.func.now(), onupdate=db.func.now())
    # foreign keys to connect product, user and sales.
    product_id = db.Column(db.Integer, db.ForeignKey(
        'products.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    sales_id = db.Column(db.Integer, db.ForeignKey(
        'product_sales.id'), nullable=False)

    def __repr__(self):
        return f'Profit {self.id}, {self.profit_amount}, {self.margin}, {self.product_id}, {self.user_id}, {self.sales_id}, {self.created_at}, {self.updated_at}'


class Product(db.Model):
    __tablename__ = 'products'

    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(255), nullable=False)
    unit_price = db.Column(db.Numeric, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    purchased_at = db.Column(db.DateTime, nullable=False,
                             server_default=db.func.now())
    updated_at = db.Column(
        db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

    def __repr__(self):
        return f'Product {self.id}, {self.description}, {self.unit_price}, {self.quantity}, {self.purchased_at}, {self.updated_at}'

#PEP 8 Naming Convention
class ProductSales(db.Model):
    __tablename__ = 'product_sales'

    id = db.Column(db.Integer, primary_key=True)
    unit_sales_price = db.Column(db.Numeric, nullable=False)
    quantity_sold = db.Column(db.Integer, nullable=False)
    sales_profit_margin = db.Column(db.Numeric, nullable=False)
    sale_date = db.Column(db.DateTime, nullable=False,
                          server_default=db.func.now())
    updated_at = db.Column(
        db.DateTime, server_default=db.func.now(), onupdate=db.func.now())
    #foreign key to define relationship between product and associated sales
    product_id = db.Column(db.Integer, db.ForeignKey(
        'products.id'), nullable=False)


class Cost(db.Model):
    __tablename__ = 'costs'

    id = db.Column(db.Integer, primary_key=True)
    marketing_cost = db.Column(db.Numeric, nullable=False)
    shipping_cost = db.Column(db.Numeric, nullable=False)
    packaging_cost = db.Column(db.Numeric, nullable=False)
    #foreign key to define relationship between product and associated costs
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)

    def __repr__(self):
        return f'Cost {self.id}, {self.marketing_cost}, {self.shipping_cost}, {self.packaging_cost}, {self.product_id}'
