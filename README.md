IoT Monitoring System Backend
Backend server for the IoT monitoring system with real-time data handling, device management, and alert generation.

Overview
This backend provides:

RESTful API endpoints for sensor data, devices, alerts, and user authentication
Real-time WebSocket communication using Socket.IO
Database storage for sensor readings and device configurations
JWT-based authentication and role-based access control

Technology Stack
Node.js: Runtime environment
Express.js: Web server framework
Socket.IO: Real-time communication
Sequelize: ORM for database operations
MySQL: Database for storing sensor data and user information
JWT: Authentication mechanism

Project Structure
iot-monitoring/
├── config/            # Database configuration
├── middleware/        # Authentication and authorization middleware
├── models/            # Sequelize data models
├── routes/            # API route handlers
├── .env               # Environment variables
├── server.js          # Main server entry point
├── simulate-iot.js    # IoT device simulator
└── README.md          # Project documentation

Setup and Installation
Prerequisites
Node.js (v14+)
MySQL database
npm or yarn
Installation Steps
Clone the repository:
git clone <repository-url>
cd iot-monitoring


Install dependencies:
npm install

Configure environment variables: Create a .env file in the root directory with:

PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=iot_monitoring
JWT_SECRET=your_jwt_secret_key

Initialize the database: Make sure your MySQL server is running, then the application will automatically:

Create the database (if not exists)
Create required tables
Set up relationships between models
Running the Application
Start the Backend Server

node server.js

To start iot-simulation 
node simulate-iot.js