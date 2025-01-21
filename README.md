# SaleSight App

[Watch the demo video](video/gif.mp4)


### Overview

SaleSight is a full-stack web application designed to empower businesses by streamlining the management of sales and profit metrics. It features a Flask-based backend and leverages Flask-RESTful for API development.


This project is a web application for managing and analyzing sales and profit data. It includes the following key features:

1. **Product Management**: Users can add, edit, and view products and their associated sales data. This is handled in the ProductsPage component, which uses components like ProductForm, ProductsList, and ProductProfitTable.

2. **Sales and Profit Analysis**: Users can view detailed analytics of their sales and profit data. This is handled in the AnalyticsPage component, which uses components like SaleAnalytics, CostAnalytics, and ProfitAnalytics.

3. **User Authentication**: The application includes user authentication to ensure that only authorized users can access certain pages. This is managed using the AuthContext and components like ProtectedRoute.

4. **Data Visualization**: The application uses charts to visualize sales and profit trends over time. This is implemented using the Recharts library in components like ProfitAnalytics.

5. **Context API**: The application uses React's Context API to manage global state, such as sales data and user authentication status. This is seen in the SalesContext and AuthContext.

6. **Financial Tracking**: The system calculates sales revenue and profit for each sale, helping users and administrators track financial performance.
Cost details are managed to ensure accurate tracking of expenses and profitability.
Overall, the project provides a comprehensive solution for managing and analyzing sales and profit data, with a focus on user-friendly interfaces and data visualization.

#### Profit Center Features:

* Data Insights: Access metrics like Total Cost, Total Revenue, Total Items Sold, and Total Profit in a consolidated view.

* Detailed Analytics: Dive deeper into product-specific sales and profit information.

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
/sales_analytics : returns user specific sales analytic data.
'/user_sales' : handles GET, POST HTTP requests.
'/user_sales/<int:sale_id>' : handles DELETE HTTP requests.
'/user_products/<int:product_id>' : handles POST requests.
'/sale/<int:sale_id>' : PATCH request handler for an individual sale (Resource SaleByID)

### Frontend Technologies Used

React
react-router-dom
react-icons/gr
Recharts
Formik
Yup
Tailwind CSS

### Future Improvements

In the next phase of the project, I will be including an admin role to control product entry and manage inventory more effectively. This admin functionality will include full CRUD (Create, Read, Update, Delete) operations, allowing the admin to add new products, update existing product details, delete products, and view all product entries. Additionally, I will enhance the system to manage cost details associated with each product, ensuring accurate tracking of expenses and profitability. This will involve creating new models and relationships to handle cost data, as well as updating existing models to integrate these new features seamlessly.


Contributions are welcome! To contribute:
Fork the repository.
Create a feature branch.
Make your changes.
Submit a pull request with a detailed explanation of your changes.