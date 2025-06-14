const express = require('express');
const router = express.Router();
const { auth, isAdmin } = require('../middleware/auth');
const bookingController = require('../controllers/bookingController');

// Routes pour les clients
router.post('/bookings', auth, bookingController.createBooking);
router.get('/bookings/my-bookings', auth, bookingController.getUserBookings);
router.get('/bookings/:id', auth, bookingController.getBookingById);
router.put('/bookings/:id/cancel', auth, bookingController.cancelBooking);

// Routes pour l'admin
router.get('/admin/bookings', auth, isAdmin, bookingController.getAllBookings);
router.put('/admin/bookings/:id/status', auth, isAdmin, bookingController.updateBookingStatus);

module.exports = router; 