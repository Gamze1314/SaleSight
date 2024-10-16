"""
This module implements the models and define relationships between models."""
from config import db
from sqlalchemy.orm import validates
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
# import re
# from sqlalchemy.ext.hybrid import hybrid_property


#relationships
# User has many products through Profit(Many-to-Many)
#Product has many users through Profit(multiple users can own or access to products.)
#User has many profits
#Profit belongs to User
#Profit belongs to a product.(one-to-many)
#profit belongs to a sale.(one-to-one)



# Product has many sales.
# Sale belongs to a product.  Each sale (ProductSales) refers to a specific Product and is linked to a User

# Product has many costs (One-to-many)
#Cost belongs to a product.



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
    
    #User has many profits
    profits = db.relationship('Profit', back_populates='user')
    
    #User has many Products through Profit.
    products = association_proxy('profits', 'product', creator=lambda p: Profit(product=p))

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
    
    #Profit belongs to a user
    user = db.relationship('User', back_populates='profits')

    #Profit belongs to a product
    product = db.relationship('Product', back_populates='profits')


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
    
    #Product has many profits
    profits = db.relationship('Profit', back_populates='product')

    #Product has many users through Profit.
    users = association_proxy('profits', 'user', creator=lambda p: Profit(product=p))

    #Product has many costs (One-to-many)
    costs = db.relationship('Cost', back_populates='product')

    #Product has many sales (One-to-many)
    sales = db.relationship('ProductSales', back_populates='product')



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
    

    #ProductSales belongs to a product
    product = db.relationship('Product', back_populates='sales')



class Cost(db.Model):
    __tablename__ = 'costs'

    id = db.Column(db.Integer, primary_key=True)
    marketing_cost = db.Column(db.Numeric, nullable=False)
    shipping_cost = db.Column(db.Numeric, nullable=False)
    packaging_cost = db.Column(db.Numeric, nullable=False)
    #foreign key to define relationship between product and associated costs
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)

    #Cost belongs to a product
    product = db.relationship('Product', back_populates='costs')

    def __repr__(self):
        return f'Cost {self.id}, {self.marketing_cost}, {self.shipping_cost}, {self.packaging_cost}, {self.product_id}'
