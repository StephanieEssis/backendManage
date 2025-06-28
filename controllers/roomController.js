const Room = require('../models/Room');
const Category = require('../models/Category');

const roomController = {
  // Get all rooms
  getAllRooms: async (req, res) => {
    try {
      const rooms = await Room.find();
      res.status(200).json(rooms);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get room by ID
  getRoomById: async (req, res) => {
    try {
      const room = await Room.findById(req.params.id);
      if (!room) {
        return res.status(404).json({ message: 'Room not found' });
      }
      res.status(200).json(room);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get rooms by category
  getRoomsByCategory: async (req, res) => {
    try {
      const rooms = await Room.find({ category: req.params.categoryId });
      res.status(200).json(rooms);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Check room availability
  checkAvailability: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const room = await Room.findById(req.params.id);

      if (!room) {
        return res.status(404).json({ message: 'Room not found' });
      }

      if (!startDate || !endDate) {
        return res.status(400).json({ message: 'Please provide both start and end dates' });
      }

      // TODO: Implement actual availability check logic
      // For now, we'll just return the room's current availability status
      res.json({
        isAvailable: room.isAvailable,
        room
      });
    } catch (error) {
      console.error('Check availability error:', error);
      res.status(500).json({ message: error.message });
    }
  },

  // Create new room (admin only)
  createRoom: async (req, res) => {
    try {
      const room = new Room(req.body);
      const savedRoom = await room.save();
      res.status(201).json(savedRoom);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Update room (admin only)
  updateRoom: async (req, res) => {
    try {
      const room = await Room.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      
      if (!room) {
        return res.status(404).json({ message: 'Room not found' });
      }
      res.status(200).json(room);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Delete room (admin only)
  deleteRoom: async (req, res) => {
    try {
      const room = await Room.findByIdAndDelete(req.params.id);
      if (!room) {
        return res.status(404).json({ message: 'Room not found' });
      }
      res.status(200).json({ message: 'Room deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = roomController;