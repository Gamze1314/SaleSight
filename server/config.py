"""
This module contains configurations for the Flask API.
"""
from dotenv import load_dotenv  # take environment variables from .env.
load_dotenv()
from flask import Flask
from flask_bcrypt import Bcrypt
from sqlalchemy import MetaData
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_restful import Api
import os
# from datetime import timedelta


# Instantiates app, set attributes
app = Flask(__name__)
# creates a bcrpyt object
flask_bcrypt = Bcrypt(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
print(f"SECRET_KEY from .env: {app.config['SECRET_KEY']}")
app.config['SESSION_COOKIE_HTTPONLY'] = True  # Better security for the cookie
# app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=30)


# Defines metadata, instantiate db
# contains definitions of tables and associated schema constructs for db readability.
convention = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s"
}

metadata = MetaData(naming_convention=convention)

db = SQLAlchemy(metadata=metadata)
migrate = Migrate(app, db)
db.init_app(app)

# Instantiates REST API
api = Api(app)

