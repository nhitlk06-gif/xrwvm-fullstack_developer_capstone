# Cars Dealership - Full Stack Application Development Capstone Project

Welcome to the **Cars Dealership** web application project, developed as part of the **IBM Full Stack Software Developer Capstone Project**.

## Project Overview
Cars Dealership is a national car retailer in the United States with dealership branches spread across various states. This full-stack web application enables customers to browse dealership branches, filter dealerships by state, view detailed dealer information, read customer reviews with sentiment analysis, and submit their own dealership reviews.

## Architecture & Technology Stack
- **Frontend**: React.js, HTML5, CSS3, Bootstrap 5, JavaScript
- **Backend**: Python 3, Django, Django REST Framework
- **Microservices**:
  - **Dealership & Reviews Service**: Node.js, Express.js, MongoDB / Mongoose
  - **Sentiment Analysis Service**: Python, Flask, NLTK (VADER Sentiment Intensity Analyzer)
  - **Car Makes & Models**: SQLite, Django ORM
- **Containerization & CI/CD**:
  - Docker & Docker Compose
  - GitHub Actions for continuous integration & code linting (Flake8 & JSHint)
  - Deployment on Cloud Infrastructure / Kubernetes / Code Engine

## Key Features
1. **User Authentication & Management**: Sign up, Login, and Logout functionality with session management.
2. **Dealership Directory**: View all dealerships nationwide, with real-time state filtering (e.g., Kansas).
3. **Dealer Details & Reviews**: View individual dealer profiles with past customer reviews.
4. **Sentiment Analysis**: Microservice analyzing customer review text dynamically as Positive, Neutral, or Negative.
5. **Review Submission**: Authenticated users can write and post reviews with car make, car model, and purchase dates.
6. **Car Inventory**: Database of car makes and models integrated with Django Admin management.