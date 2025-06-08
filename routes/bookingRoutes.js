const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { auth } = require('../middleware/auth');

// Routes protégées (utilisateur connecté)
router.post('/bookings', auth, bookingController.createBooking);
router.get('/bookings', auth, bookingController.getUserBookings);
router.get('/bookings/:id', auth, bookingController.getBookingById);
router.put('/bookings/:id/cancel', auth, bookingController.cancelBooking);

// Routes admin
router.get('/admin/bookings', auth, bookingController.getAllBookings);
router.put('/admin/bookings/:id/status', auth, bookingController.updateBookingStatus);

module.exports = router; 