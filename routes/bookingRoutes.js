const express = require('express');
const router = express.Router();
const { auth, isAdmin } = require('../middleware/auth');
const bookingController = require('../controllers/bookingController');

// Routes pour les clients
router.post('/', auth, bookingController.createBooking);
router.get('/my-bookings', auth, bookingController.getUserBookings);
router.get('/:id', auth, bookingController.getBookingById);
router.put('/:id/cancel', auth, bookingController.cancelBooking);

// Routes pour l'admin
router.get('/admin/all', auth, isAdmin, bookingController.getAllBookings);
router.put('/admin/:id/status', auth, isAdmin, bookingController.updateBookingStatus);

module.exports = router; 