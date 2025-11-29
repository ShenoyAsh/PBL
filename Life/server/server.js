require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const socketio = require('socket.io');

const allRoutes = require('./routes');
const { connectDB } = require('./utils/db');
const { createNotification } = require('./controllers/notificationController');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// --- Initialization ---
const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Store connected users
const users = new Map();

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('New client connected');

  // Add user to the map when they connect
  socket.on('register', (userId) => {
    users.set(userId, socket.id);
    console.log(`User ${userId} connected with socket ${socket.id}`);
  });

  // Remove user from the map when they disconnect
  socket.on('disconnect', () => {
    for (const [userId, socketId] of users.entries()) {
      if (socketId === socket.id) {
        users.delete(userId);
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  });

  // Handle notification read events
  socket.on('notification:read', async (notificationId) => {
    // You can add additional validation here if needed
    socket.emit('notification:read', notificationId);
  });
});

// Make io accessible to routes
app.set('io', io);

// Function to send real-time notification
const sendNotification = (userId, notification) => {
  const socketId = users.get(userId.toString());
  if (socketId) {
    io.to(socketId).emit('notification', notification);
  }
};

// Make sendNotification available globally
app.set('sendNotification', sendNotification);

connectDB();

// --- Data Directory Check ---
// Ensure /data directory exists for Excel files
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
  console.log('Created /data directory for Excel storage.');
}

// --- Core Middleware ---
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Rate Limiting ---
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use(limiter);

// --- Static Asset Serving (for Blood Bank file) ---
app.use('/static', express.static(path.join(__dirname, 'data')));

// --- API Routes ---
app.use('/api', allRoutes);

// --- Global Error Handler ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Something broke!', error: err.message });
});

// --- Start Server ---
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});