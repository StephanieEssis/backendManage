const Admin = require('../models/Admin');
const User = require('../models/User');
const Room = require('../models/Room');
const Category = require('../models/Category');
const Booking = require('../models/Booking');
const jwt = require('jsonwebtoken');

const adminController = {
  // Login admin
  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      // Find admin
      const admin = await Admin.findOne({ username });
      if (!admin) {
        return res.status(400).json({ message: 'Invalid username or password' });
      }

      // Check password
      const isMatch = await admin.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid username or password' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { adminId: admin._id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      res.json({
        message: 'Login successful',
        token,
        admin: {
          id: admin._id,
          username: admin.username
        }
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get dashboard statistics
  getDashboardStats: async (req, res) => {
    try {
      const totalRooms = await Room.countDocuments();
      const availableRooms = await Room.countDocuments({ isAvailable: true });
      const totalUsers = await User.countDocuments();
      
      // Bookings by category
      const bookingsByCategory = await Booking.aggregate([
        {
          $lookup: {
            from: 'rooms',
            localField: 'room',
            foreignField: '_id',
            as: 'room'
          }
        },
        { $unwind: '$room' },
        {
          $lookup: {
            from: 'categories',
            localField: 'room.categoryId',
            foreignField: '_id',
            as: 'category'
          }
        },
        { $unwind: '$category' },
        {
          $group: {
            _id: '$category.name',
            count: { $sum: 1 }
          }
        }
      ]);

      // Get booking statistics
      const totalBookings = await Booking.countDocuments();
      const pendingBookings = await Booking.countDocuments({ status: 'pending' });
      const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
      const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });
      const completedBookings = await Booking.countDocuments({ status: 'completed' });

      res.json({
        totalRooms,
        availableRooms,
        totalUsers,
        totalBookings,
        pendingBookings,
        confirmedBookings,
        cancelledBookings,
        completedBookings,
        bookingsByCategory
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get all bookings
  getAllBookings: async (req, res) => {
    try {
      const bookings = await Booking.find()
        .populate('user', 'fullName email phone')
        .populate({
          path: 'room',
          populate: {
            path: 'categoryId',
            model: 'Category'
          }
        })
        .sort({ createdAt: -1 });

      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get all users
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find()
        .select('fullName email phone role createdAt')
        .sort({ createdAt: -1 });

      res.json({ users });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Delete user
  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;
      
      // Vérifier que l'utilisateur existe
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      // Empêcher la suppression d'un admin
      if (user.role === 'admin') {
        return res.status(403).json({ message: 'Impossible de supprimer un administrateur' });
      }

      await User.findByIdAndDelete(id);
      res.json({ message: 'Utilisateur supprimé avec succès' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = adminController;
