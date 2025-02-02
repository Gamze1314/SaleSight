"""
This module contains configurations for the Flask API.
"""
import os
from dotenv import load_dotenv  # take environment variables from .env.
load_dotenv()
from flask import Flask
from flask_bcrypt import Bcrypt
from sqlalchemy import MetaData
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_restful import Api
from flask_cors import CORS


app = Flask(__name__, static_folder='../client/build', static_url_path='')

CORS(app)  # Allows cross-origin requests
# creates a bcrpyt object
flask_bcrypt = Bcrypt(app)

DATABASE_URI = os.environ.get('DATABASE_URI')
print(DATABASE_URI)

#production => db uri set up.
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['SESSION_COOKIE_HTTPONLY'] = True

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

api = Api(app)

