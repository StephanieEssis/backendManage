const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { auth, isAdmin } = require('../middleware/auth');

// Public routes
router.post('/login', adminController.login);

// Protected routes
router.get('/dashboard', auth, isAdmin, adminController.getDashboardStats);
router.get('/bookings', auth, isAdmin, adminController.getAllBookings);

module.exports = router;