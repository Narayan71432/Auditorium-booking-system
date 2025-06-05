<<<<<<< HEAD
# Auditorium-booking
This project is a full-featured Booking System built using the MERN stack (MongoDB, Express.js, React.js, and Node.js), available as both a responsive website and a mobile application. The system is designed to streamline the booking process for users and admins across multiple platforms with real-time synchronization and a user-friendly interface.
=======
# MERN Login Application

## Prerequisites
- Node.js (v14 or later)
- MongoDB Atlas account

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd mern-login-app
```

### 2. Backend Setup
1. Navigate to backend directory
```bash
cd backend
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the backend directory with:
```
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

4. Start the backend server
```bash
npm run dev
```

### 3. Frontend Setup
1. Navigate to frontend directory
```bash
cd ../frontend
```

2. Install dependencies
```bash
npm install
```

3. Start the React development server
```bash
npm start
```

## Features
- User and Admin login
- Role-based authentication
- JWT token-based security
- MongoDB Atlas database integration

## Technologies Used
- MongoDB
- Express.js
- React.js
- Node.js
- Axios
- JWT
- Bcrypt

## Security Notes
- Always keep your `.env` file secret
- Use strong, unique passwords
- Rotate JWT secrets periodically




npm run build
npx cap sync
npx cap run android
>>>>>>> ae23086 (Initial commit with frontend and backend)
