---

# Task Manager Application

## Overview

This project is a full-stack task management application similar to Trello, allowing users to create, update, and manage tasks within different columns. Users can move tasks between columns using drag-and-drop functionality. Additionally, users can sign up, log in, and authenticate via Google.

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Running the Application](#running-the-application)
4. [API Endpoints](#api-endpoints)
5. [Data Models](#data-models)
6. [Testing](#testing)
7. [Security](#security)
8. [Bonus Features](#bonus-features)
9. [Deployment](#deployment)
10. [Contributing](#contributing)
11. [License](#license)

## Features

- **User Authentication:** Sign up, login, and Google login.
- **Task Management:** Create, update, delete, and manage tasks within different columns.
- **Drag-and-Drop Functionality:** Move tasks between columns seamlessly.
- **Routing:** Implemented throughout the application.
- **Error Handling:** Client-side and server-side error handling with meaningful messages.
- **Validation:** Server-side validation for task data and user input.

### Bonus Features
- **User Profiles:** Profile avatars.
- **Task Enhancements:** Due dates, reminders, sorting, and searching capabilities.

## Tech Stack

- **Frontend:** React, React Router, react-beautiful-dnd, MUI
- **Backend:** Node.js, Express
- **Database:** MongoDB / PostgreSQL / MySQL
- **Authentication:** JSON Web Tokens (JWT), Google OAuth 2.0
- **Version Control:** Git

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js (v20+)
- npm or yarn
- MongoDB

### Installation

1. **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd task-manager-application
    ```

2. **Install the dependencies:**

    ```bash
    # For backend
    cd backend
    npm install

    # For frontend
    cd ../frontend
    npm install
    ```

3. **Environment Variables:**

   Create a `.env` file in the backend directory for backend with the following variables:

   ```env
   # DB Config
   MONGO_URI=<Your Database URI> # Used MongoDb
   JWT_SECRET=<Your JWT Secret>
   
   # Google Auth Config
   GOOGLE_CLIENT_ID=<Your Google Client ID>
   GOOGLE_CLIENT_SECRET=<Your Google Client Secret>

   # Environment-specific URLs
   FRONTEND_URL=http://localhost:3000  # Change this to your frontend production URL when deploying
   BACKEND_URL=http://localhost:8000   # Change this to your backend production URL when deploying
   ```

   Create a `.env` file in the frontend directory for frontend with the following variables:

   ```env
   # Environment-specific URLs
   REACT_APP_API_URL=http://localhost:8000/api  # Change this to your backend production URL when deploying
   ```

### Running the Application

1. **Run the Backend:**

    ```bash
    cd backend
    npm run start
    ```

2. **Run the Frontend:**

    ```bash
    cd frontend
    npm run start
    ```

3. **Access the Application:**

   Open your browser and navigate to `http://localhost:3000`.

## API Endpoints

### User Authentication

- **POST** `/api/auth/register` - Register a new user
- **POST** `/api/auth/login` - Log in with credentials
- **POST** `/api/auth/google` - Log in with Google

### User Management

- **GET** `/api/user/get` - Get user using the id from token

### Task Management

- **GET** `/api/tasks` - Get all tasks - With/without query params
- **POST** `/api/tasks` - Create a new task
- **PUT** `/api/tasks/:id` - Update a task
- **DELETE** `/api/tasks/:id` - Delete a task

## Data Models

### User Model

```javascript
{
  username: String,
  email: String,
  password: String, // Encrypted
  googleId: String, // Optional
  avatar: String // URL to the user's avatar
  createdAt: Date,
  updatedAt: Date
}
```

### Task Model

```javascript
{
  title: String,
  description: String,
  dueDate: Date, // Optional
  status: String, // e.g., "To Do", "In Progress", "Done"
  userId: String, // Reference to the User
  createdAt: Date,
  updatedAt: Date
}
```

## Testing

Unit tests are included for critical parts of the application, such as API endpoints and data validation.
<!-- 
- **Run Tests:**

    ```bash
    # For backend
    cd backend
    npm run test

    # For frontend
    cd frontend
    npm run test
    ``` -->

## Security

- Implemented JWT for user authentication.
- Used server-side validation to prevent malicious data inputs.
- Protected routes to ensure only authenticated users have access.

## Bonus Features

- **User Profiles:** Allows users to upload avatars.
- **Task Enhancements:** Tasks have due dates, reminders, and can be sorted or searched.

## Deployment

The application is deployed on [Platform] and can be accessed via [Deployed App Link].

To deploy:

1. **Backend Deployment:**
    - Use services like Heroku, AWS, or Firebase Functions.

2. **Frontend Deployment:**
    - Use services like Vercel or Netlify.

## Contributing

Feel free to fork the repository and submit pull requests. For major changes, please open an issue to discuss what you would like to change.

## License

This project is licensed under the MIT License.

---
