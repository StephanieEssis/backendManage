const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const { auth } = require('../middleware/auth');

// Routes publiques
router.get('/', roomController.getAllRooms);
router.get('/:id', roomController.getRoomById);
router.get('/category/:categoryId', roomController.getRoomsByCategory);
router.get('/:id/availability', roomController.checkAvailability);

// Routes protégées (admin only)
router.post('/', auth, roomController.createRoom);
router.put('/:id', auth, roomController.updateRoom);
router.delete('/:id', auth, roomController.deleteRoom);

module.exports = router;