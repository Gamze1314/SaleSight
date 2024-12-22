# SaleSight Project

### Overview

SaleSight is a full-stack web application designed to empower businesses by streamlining the management of sales and profit metrics. It features a Flask-based backend and leverages Flask-RESTful for API development.

* Key Highlight: SaleSight provides users with clear insights into their sales and profit data, enabling data-driven decision-making. The Profit Center page is the hub for understanding your business's financial health.

Profit Center Features:

Data Insights: Access metrics like Total Cost, Total Revenue, Total Items Sold, and Total Profit in a consolidated view.

Detailed Reports: Dive deeper into product-specific sales and profit information.

Dynamic Interaction: Add new profit data and monitor updates in real-time.

Features

User authentication and session management

RESTful API for user data handling

Graceful handling of missing session data

Backend built using Python (Flask and Flask-RESTful)



Technologies Used

Backend: Flask, Flask-RESTful, Flask-SQLAlchemy

Database: SQLite (or any SQLAlchemy-supported database)

Environment Management: pyenv

Python Version: 3.8.13



Installation

Prerequisites

Python 3.8.13

pyenv for environment management (optional but recommended)

pip for package installation



Usage

API Endpoints

Below are the key API endpoints provided by SaleSight:

User Authentication

GET /user

Description: Fetches user information from the session.

Response:

Success: { "message": "User ID found", "user_id": "<user_id>" }

Error: { "error": "User not logged in" }



Session Management

The application uses Flask sessions to store and manage user data securely. Always check for the session keys before accessing them to avoid KeyError exceptions.



Development Workflow

Create new features in a dedicated branch.

Write unit tests for all new functionalities.

Submit a pull request and ensure all tests pass before merging.



Contribution

Contributions are welcome! To contribute:

Fork the repository.

Create a feature branch.

Make your changes.

Submit a pull request with a detailed explanation of your changes.