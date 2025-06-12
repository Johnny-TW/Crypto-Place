# Crypto Place Backend

## Overview
This project is a backend application for the Crypto Place, built using Node.js and Express. It provides APIs to interact with cryptocurrency data and supports CORS for cross-origin requests.

## Project Structure
```
crypto-place-backend
├── src
│   ├── app.js                # Entry point of the application
│   ├── config
│   │   └── cors.config.js    # CORS configuration
│   ├── controllers
│   │   └── api.controller.js  # API request handling logic
│   ├── routes
│   │   └── api.routes.js      # API routing
│   ├── services
│   │   └── proxy.service.js    # Logic for handling external API requests
│   └── utils
│       └── logger.js          # Logging utility
├── package.json               # NPM configuration file
├── .env                       # Environment variables
├── .gitignore                 # Files and folders to ignore in version control
└── README.md                  # Project documentation
```

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm (Node package manager)

### Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd crypto-place-backend
   ```
3. Install the dependencies:
   ```
   npm install
   ```

### Configuration
- Create a `.env` file in the root directory and add your environment variables, such as database connection strings and API keys.

### Running the Application
To start the server, run:
```
npm start
```
The application will be running on `http://localhost:3000`.

### API Documentation
Refer to the `src/controllers/api.controller.js` for details on available API endpoints and their usage.

### License
This project is licensed under the MIT License.