# Login Service

This project implements a login service using Express and MongoDB. It provides user authentication functionalities including login and registration.

## Project Structure

```
login-service
├── src
│   ├── app.js                # Initializes the Express application and sets up middleware
│   ├── server.js             # Starts the server and listens on a specified port
│   ├── config
│   │   └── db.js             # MongoDB connection configuration
│   ├── controllers
│   │   └── authController.js  # Handles user authentication logic
│   ├── routes
│   │   └── authRoutes.js      # Sets up authentication routes
│   ├── models
│   │   └── User.js            # Defines the User model
│   ├── services
│   │   └── authService.js      # Contains authentication logic
│   ├── middleware
│   │   └── authMiddleware.js    # Middleware for protecting routes
│   └── utils
│       └── validators.js       # Utility functions for input validation
├── package.json               # npm configuration file
├── .env.example               # Example environment variables
├── .gitignore                 # Files and directories to ignore by Git
└── README.md                  # Project documentation
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd login-service
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Configuration

1. Create a `.env` file in the root directory and configure the necessary environment variables based on the `.env.example` file.

## Usage

1. Start the server:
   ```
   npm start
   ```
2. The server will be running on `http://localhost:3000` (or the port specified in your configuration).

## API Endpoints

- **POST /api/auth/register**: Register a new user
- **POST /api/auth/login**: Log in an existing user

## License

This project is licensed under the MIT License.