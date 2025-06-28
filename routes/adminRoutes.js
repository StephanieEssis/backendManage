const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const bookingController = require('../controllers/bookingController');
const { auth, isAdmin } = require('../middleware/auth');

// Public routes
router.post('/login', adminController.login);

// Protected routes
router.get('/dashboard', auth, isAdmin, adminController.getDashboardStats);
router.get('/bookings', auth, isAdmin, adminController.getAllBookings);
router.put('/bookings/:id/status', auth, isAdmin, bookingController.updateBookingStatus);

module.exports = router;