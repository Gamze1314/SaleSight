# SaleSight App

### Overview

SaleSight is a full-stack web application designed to empower businesses by streamlining the management of sales and profit metrics. It features a Flask-based backend and leverages Flask-RESTful for API development.

* Key Highlight: SaleSight provides users with clear insights into their sales and profit data, enabling data-driven decision-making. The Profit Center page is the hub for understanding your business's financial health.

#### Profit Center Features:

* Data Insights: Access metrics like Total Cost, Total Revenue, Total Items Sold, and Total Profit in a consolidated view.

* Detailed Reports: Dive deeper into product-specific sales and profit information.

* Dynamic Interaction: Add new profit data and monitor updates in real-time.

### Backend Installations

flask, flask-sqlalchemy, flask-restful, flask-migrate, sqlalchemy-serializer, flask-bcrypt, python-dotenv 

[requires]
python_version = "3.8"

pyenv for environment management
pip for package installation

* To clone the repository : 'git clone https://github.com/your-username/salesight.git', 'cd salesight'

* To run the server : 'python app.py'
* To run the React server : 'npm start'
The Proxy is set up in the package.json file.

* To set up the database : 'flask db init', 'flask db migrate -m "Initial Migration"', 'flask db upgrade'


### Key Features

User authentication for login/logout and signup functionalities

RESTful API for user sales and profit data handling

Backend built using Python (Flask and Flask-RESTful)


### Backend Technologies Used

Backend: Flask, Flask-RESTful, Flask-SQLAlchemy

Database: SQLite (or any SQLAlchemy-supported database)

Environment Management: pyenv

Python Version: 3.8.13


### Usage

API Endpoints

User Authentication
/check_session : handles session management
/signup : handles new user registration.
/login : handles user login.
/logout : handles user logout.

User Sale and Profit Data Management:
'/user_sales' : handles GET, POST HTTP requests.
'/user_sales/<int:profit_id>' : handles PATCH HTTP requests.
'/product_sales/<int:product_id>' : handles POST, DELETE requests.


Contributions are welcome! To contribute:
Fork the repository.
Create a feature branch.
Make your changes.
Submit a pull request with a detailed explanation of your changes.