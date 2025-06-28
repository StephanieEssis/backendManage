const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');

// Routes
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const roomRoutes = require('./routes/roomRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

//DB
const connectDB = require("./db/connectDB")

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configuration CORS
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // 24 heures
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// MongoDB connection
connectDB()

// Routes
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api', bookingRoutes);
app.use('/api', authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // Gestion spécifique des erreurs d'authentification
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ 
      success: false,
      message: 'Token invalide ou expiré' 
    });
  }
  
  // Gestion des erreurs de validation
  if (err.name === 'ValidationError') {
    return res.status(400).json({ 
      success: false,
      message: err.message 
    });
  }
  
  // Erreur par défaut
  res.status(500).json({ 
    success: false,
    message: 'Une erreur est survenue sur le serveur' 
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port localhost:${PORT}`);
});