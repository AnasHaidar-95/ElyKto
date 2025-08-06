# MERN Stack Chat Application

This is a full-stack real-time chat application built using the MERN stack (MongoDB, Express.js, React.js, Node.js) with Socket.io for real-time communication.

## Features

-   **Real-time Chat:** Instant messaging between users.
-   **User Authentication:** Secure user registration and login.
-   **Group Chat:** Create and participate in group conversations.
-   **File Sharing:** Share images, videos, and other files.
-   **Online Status:** See which users are currently online.
-   **Responsive Design:** Works on both desktop and mobile devices.

## Tech Stack

**Backend:**

-   **Node.js:** JavaScript runtime environment.
-   **Express.js:** Web framework for Node.js.
-   **MongoDB:** NoSQL database for storing user and message data.
-   **Mongoose:** ODM for MongoDB.
-   **Socket.io:** Real-time communication library.
-   **JWT:** JSON Web Tokens for authentication.
-   **Bcrypt:** Password hashing.
-   **Cloudinary:** Cloud-based image and video management.
-   **Multer:** Middleware for handling file uploads.

**Frontend:**

-   **React.js:** JavaScript library for building user interfaces.
-   **Vite:** Next-generation front-end tooling.
-   **React Router:** Declarative routing for React.js.
-   **Socket.io Client:** Client-side library for Socket.io.
-   **Tailwind CSS:** A utility-first CSS framework.
-   **Axios:** Promise-based HTTP client.

## Getting Started

### Prerequisites

-   Node.js (v14 or later)
-   MongoDB
-   Cloudinary account

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/AnasHaidar-95/Mern-Stack-Chat-App.git
    cd Marn-Stack-Chat-App
    ```

2.  **Backend Setup:**

    ```bash
    cd Backend
    npm install
    ```

    Create a `.env` file in the `Backend` directory and add the following environment variables:

    ```
    PORT=3000
    DATABASE_URL=<your_mongodb_connection_string>
    CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
    CLOUDINARY_API_KEY=<your_cloudinary_api_key>
    CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>
    ```

3.  **Frontend Setup:**

    ```bash
    cd ../Frontend
    npm install
    ```

### Running the Application

1.  **Start the backend server:**

    ```bash
    cd Backend
    npm run dev
    ```

2.  **Start the frontend development server:**

    ```bash
    cd Frontend
    npm run dev
    ```

The application will be available at `http://localhost:5173`.

## Project Structure

```
Marn-Stack-ChatApp/
├── Backend/
│   ├── config/
│   ├── Controllers/
│   ├── Midlleware/
│   ├── Models/
│   ├── Routes/
│   ├── .env
│   ├── package.json
│   └── server.js
└── Frontend/
    ├── public/
    ├── src/
    │   ├── assets/
    │   ├── pages/
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── socket.js
    ├── package.json
    └── vite.config.js
```

## API Endpoints

The backend provides the following RESTful API endpoints:

-   `POST /register`: Register a new user.
-   `POST /login`: Log in an existing user.
-   `GET /messages/:userId`: Get all messages for a specific user.
-   `POST /upload`: Upload a file.

## Socket.io Events

The application uses the following Socket.io events for real-time communication:

-   `join`: A user joins the chat.
-   `send-message`: A user sends a message.
-   `receive-message`: A user receives a message.
-   `update-online-users`: The list of online users is updated.
-   `disconnect`: A user disconnects from the chat.

## Contributing

Contributions are welcome! Please feel free to submit a pull request.

## License

This project is licensed under the MIT License.
