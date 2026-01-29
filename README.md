# Smart City Issue Reporting System

A comprehensive web application designed to empower citizens to report urban issues (such as potholes, broken streetlights, or sanitation problems) and enable city administrators to track and manage these reports efficiently.

## Features

*   **Citizen Reporting:** Users can easily report issues with a title, description, and upload an image.
*   **Geolocation:** Reports are tagged with precise location data and visualized on an interactive map.
*   **Admin Dashboard:** Administrators can view all reports, filter them, update their status (Open, In Progress, Resolved), and view statistics.
*   **PDF Reports:** Admins can generate and download PDF reports of the current issue list.
*   **Notifications:** Users receive real-time notifications when the status of their reported issue changes.
*   **Likes:** Users can like issues to show support or priority.
*   **Responsive Design:** Fully optimized for both desktop and mobile devices.

## Prerequisites

Before you begin, ensure you have the following installed:
*   [Node.js](https://nodejs.org/) (v18 or higher)
*   [Docker](https://www.docker.com/) and Docker Compose (for the database)

## Installation & Setup

### 1. Database Setup
The project uses PostgreSQL with PostGIS enabled. We provide a `docker-compose.yml` file for easy setup.

```bash
# Start the database container
docker-compose up -d
```

### 2. Backend Setup
Navigate to the `backend` directory to install dependencies and initialize the database.

```bash
cd backend

# Install dependencies
npm install

# Create environment file (if not present, standard defaults are usually fine for dev)
# Ensure your .env matches the docker credentials if you changed them.

# Start the server (this will also create initial tables if they don't exist)
npm run dev
```

### 3. Frontend Setup
Navigate to the `frontend` directory.

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Usage

1.  **Access the Application:** Open your browser and go to `http://localhost:5173`.
2.  **Register:** Click "Get Started" or "Register" to create a new account.
3.  **Report an Issue:** Log in and use the "Report Issue" button to submit a new report. You can toggle between List View and Map View.
4.  **Admin Access:**
    *   By default, new users are registered as `CITIZEN`.
    *   To access the Admin Dashboard, you must have the `ADMIN` role.
    *   You can manually promote a user to admin by accessing the database:
        ```sql
        UPDATE users SET role = 'ADMIN' WHERE email = 'your-email@example.com';
        ```
    *   Once promoted, an "Admin Dashboard" link will appear in the navigation bar.

## Tech Stack

*   **Frontend:** React, Vite, Tailwind CSS, Leaflet Maps
*   **Backend:** Node.js, Express
*   **Database:** PostgreSQL (with PostGIS)
*   **Tools:** Docker, JWT Authentication

