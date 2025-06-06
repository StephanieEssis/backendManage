const express = require('express');
const roomController = require('../controllers/roomController');
const auth = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/rooms', roomController.getAllRooms);
router.get('/rooms/:id', roomController.getRoomById);
router.get('/rooms/category/:categoryId', roomController.getRoomsByCategory);
router.get('/rooms/:id/availability', roomController.checkAvailability);

// Protected routes (admin only)
router.post('/rooms', auth, roomController.createRoom);
router.put('/rooms/:id', auth, roomController.updateRoom);
router.delete('/rooms/:id', auth, roomController.deleteRoom);

module.exports = router;