# Auditorium Booking System

A full-featured auditorium booking system built using the MERN stack (MongoDB, Express.js, React.js, and Node.js). Accessible as both a responsive website and a mobile application, this system streamlines the booking process for users and admins with real-time synchronization and a user-friendly interface.

---

## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [Clone the Repository](#clone-the-repository)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Mobile App Setup (Optional)](#mobile-app-setup-optional)
- [Technologies Used](#technologies-used)
- [Security Notes](#security-notes)

---

## Features

- User and Admin authentication (role-based)
- Real-time booking management
- Responsive design for web and mobile
- JWT token-based security
- Integration with MongoDB Atlas
- Password encryption with Bcrypt
- Intuitive UI/UX for easy auditorium booking
- Admin dashboard for managing bookings and users

---

## Demo

<!-- Optionally add screenshots, GIFs, or a live demo link here -->
<!-- ![App Screenshot](screenshot.png) -->

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)
- [MongoDB Atlas](https://www.mongodb.com/atlas)
- [npm](https://www.npmjs.com/)
- [Capacitor](https://capacitorjs.com/) (for mobile app)

---

## Installation

### Clone the Repository

```bash
git clone https://github.com/Narayan71432/Auditorium-booking-system.git
cd Auditorium-booking-system
```

---

### Backend Setup

1. Navigate to the backend directory:
    ```bash
    cd backend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file in the backend directory with the following content:
    ```
    MONGODB_URI=your_mongodb_atlas_connection_string
    JWT_SECRET=your_jwt_secret_key
    PORT=5000
    ```

4. Start the backend server:
    ```bash
    npm run dev
    ```

---

### Frontend Setup

1. Navigate to the frontend directory:
    ```bash
    cd ../frontend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Start the React development server:
    ```bash
    npm start
    ```

---

### Mobile App Setup (Optional)

1. Build the React app for production:
    ```bash
    npm run build
    ```

2. Sync with Capacitor:
    ```bash
    npx cap sync
    ```

3. Run the app on Android:
    ```bash
    npx cap run android
    ```

---

## Technologies Used

- MongoDB Atlas
- Express.js
- React.js
- Node.js
- JWT (JSON Web Tokens)
- Bcrypt
- Axios
- Capacitor (for mobile integration)
- CSS

---

## Security Notes

- Keep your `.env` file confidential and never commit it to version control.
- Use strong, unique passwords for all accounts.
- Rotate your JWT secrets periodically.
- Regularly update dependencies to patch vulnerabilities.

---

**Contributions are welcome!**  
Feel free to open issues or submit pull requests for new features, bug fixes, or improvements.

---
