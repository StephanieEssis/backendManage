const Room = require('../models/Room');
const Category = require('../models/Category');

const roomController = {
  // Get all rooms
  getAllRooms: async (req, res) => {
    try {
      const { category, minPrice, maxPrice, capacity } = req.query;
      let filter = {};

      // Filtres
      if (category) {
        filter.category = category;
      }
      if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
      }
      if (capacity) {
        filter.capacity = { $gte: Number(capacity) };
      }

      const rooms = await Room.find(filter)
        .populate('category')
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        data: {
          rooms,
          count: rooms.length
        }
      });
    } catch (error) {
      console.error('Get all rooms error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch rooms',
        error: error.message
      });
    }
  },

  // Get room by ID
  getRoomById: async (req, res) => {
    try {
      const room = await Room.findById(req.params.id).populate('category');
      
      if (!room) {
        return res.status(404).json({
          success: false,
          message: 'Room not found'
        });
      }

      res.json({
        success: true,
        data: { room }
      });
    } catch (error) {
      console.error('Get room by ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch room',
        error: error.message
      });
    }
  },

  // Get rooms by category
  getRoomsByCategory: async (req, res) => {
    try {
      const category = await Category.findById(req.params.categoryId);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }

      const rooms = await Room.find({ category: req.params.categoryId })
        .populate('category')
        .sort({ price: 1 });

      res.json({
        success: true,
        data: {
          category,
          rooms,
          count: rooms.length
        }
      });
    } catch (error) {
      console.error('Get rooms by category error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch rooms by category',
        error: error.message
      });
    }
  },

  // Check room availability
  checkAvailability: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const room = await Room.findById(req.params.id);

      if (!room) {
        return res.status(404).json({
          success: false,
          message: 'Room not found'
        });
      }

      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: 'Please provide both start and end dates'
        });
      }

      // TODO: Implement actual availability check logic
      // For now, we'll just return the room's current availability status
      res.json({
        success: true,
        data: {
          isAvailable: room.isAvailable,
          room
        }
      });
    } catch (error) {
      console.error('Check availability error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to check room availability',
        error: error.message
      });
    }
  },

  // Create new room (admin only)
  createRoom: async (req, res) => {
    try {
      const {
        name,
        description,
        price,
        capacity,
        category,
        images,
        amenities
      } = req.body;

      // Validation des données
      if (!name || !description || !price || !capacity || !category) {
        return res.status(400).json({
          success: false,
          message: 'Please provide all required fields'
        });
      }

      // Vérifier si la catégorie existe
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          message: 'Category not found'
        });
      }

      const room = new Room({
        name,
        description,
        price,
        capacity,
        category,
        images: images || [],
        amenities: amenities || []
      });

      await room.save();

      const populatedRoom = await Room.findById(room._id).populate('category');

      res.status(201).json({
        success: true,
        message: 'Room created successfully',
        data: { room: populatedRoom }
      });
    } catch (error) {
      console.error('Create room error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create room',
        error: error.message
      });
    }
  },

  // Update room (admin only)
  updateRoom: async (req, res) => {
    try {
      const {
        name,
        description,
        price,
        capacity,
        category,
        images,
        amenities,
        isAvailable
      } = req.body;

      const room = await Room.findById(req.params.id);
      if (!room) {
        return res.status(404).json({
          success: false,
          message: 'Room not found'
        });
      }

      // Vérifier si la catégorie existe si elle est fournie
      if (category) {
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
          return res.status(400).json({
            success: false,
            message: 'Category not found'
          });
        }
        room.category = category;
      }

      // Mettre à jour les champs
      if (name) room.name = name;
      if (description) room.description = description;
      if (price) room.price = price;
      if (capacity) room.capacity = capacity;
      if (images) room.images = images;
      if (amenities) room.amenities = amenities;
      if (typeof isAvailable === 'boolean') room.isAvailable = isAvailable;

      await room.save();

      const updatedRoom = await Room.findById(room._id).populate('category');

      res.json({
        success: true,
        message: 'Room updated successfully',
        data: { room: updatedRoom }
      });
    } catch (error) {
      console.error('Update room error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update room',
        error: error.message
      });
    }
  },

  // Delete room (admin only)
  deleteRoom: async (req, res) => {
    try {
      const room = await Room.findById(req.params.id);
      if (!room) {
        return res.status(404).json({
          success: false,
          message: 'Room not found'
        });
      }

      await room.remove();

      res.json({
        success: true,
        message: 'Room deleted successfully'
      });
    } catch (error) {
      console.error('Delete room error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete room',
        error: error.message
      });
    }
  }
};

module.exports = roomController;