const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const bookingController = require('../controllers/bookingController');
const roomController = require('../controllers/roomController');
const { auth, isAdmin } = require('../middleware/auth');

// Public routes
router.post('/login', adminController.login);

// Protected routes
router.get('/dashboard', auth, isAdmin, adminController.getDashboardStats);
router.get('/users', auth, isAdmin, adminController.getAllUsers);
router.delete('/users/:id', auth, isAdmin, adminController.deleteUser);
router.get('/bookings', auth, isAdmin, adminController.getAllBookings);
router.put('/bookings/:id/status', auth, isAdmin, bookingController.updateBookingStatus);
router.get('/rooms', auth, isAdmin, roomController.getAllRooms);
router.post('/rooms', auth, isAdmin, roomController.createRoom);
router.put('/rooms/:id', auth, isAdmin, roomController.updateRoom);
router.delete('/rooms/:id', auth, isAdmin, roomController.deleteRoom);

module.exports = router;