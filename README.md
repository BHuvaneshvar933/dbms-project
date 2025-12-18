## Database Setup

1.  **Create a MySQL Database:**
    Create a new database named `event_management` in your MySQL server.

    ```sql
    CREATE DATABASE event_management;
    ```

## Backend Setup

1.  **Navigate to the backend directory:**

    ```bash
    cd backend
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Create a `.env` file:**
    Create a file named `.env` in the `backend` directory with the following content:

    ```
    PORT=5000
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=your_mysql_password
    DB_NAME=event_management
    JWT_SECRET=secret123
    ```
    *   Replace `your_mysql_password` with your MySQL root password.

## Frontend Setup

1.  **Navigate to the frontend directory:**

    ```bash
    cd frontend
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

## Running the Application

1.  **Start the Backend Server:**
    Open a new terminal, navigate to the `backend` directory, and run:

    ```bash
    cd backend
    npm start
    ```
    You should see output indicating that the MySQL database is connected and the server is running on the specified port (e.g., `Server running on port 5000`).

2.  **Start the Frontend Development Server:**
    Open another new terminal, navigate to the `frontend` directory, and run:

    ```bash
    cd frontend
    npm run dev
    ```
    This will start the React development server, usually on `http://localhost:5173` (or another available port). Your browser should automatically open to this address.
