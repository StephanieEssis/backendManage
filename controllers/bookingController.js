const Booking = require('../models/Booking');
const Room = require('../models/Room');

const bookingController = {
  // Create a new booking
  createBooking: async (req, res) => {
    try {
      const {
        roomId,
        checkIn,
        checkOut,
        guests,
        specialRequests
      } = req.body;

      // Validation des données
      if (!roomId || !checkIn || !checkOut || !guests) {
        return res.status(400).json({
          success: false,
          message: 'Please provide all required fields'
        });
      }

      // Vérifier si la chambre existe
      const room = await Room.findById(roomId);
      if (!room) {
        return res.status(404).json({
          success: false,
          message: 'Room not found'
        });
      }

      // Vérifier si la chambre est disponible pour ces dates
      const existingBooking = await Booking.findOne({
        room: roomId,
        status: { $ne: 'cancelled' },
        $or: [
          {
            checkIn: { $lte: checkOut },
            checkOut: { $gte: checkIn }
          }
        ]
      });

      if (existingBooking) {
        return res.status(400).json({
          success: false,
          message: 'Room is not available for these dates'
        });
      }

      // Calculer le prix total
      const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
      const totalPrice = room.price * nights;

      // Créer la réservation
      const booking = new Booking({
        user: req.user._id,
        room: roomId,
        checkIn,
        checkOut,
        totalPrice,
        guests,
        specialRequests: specialRequests || ''
      });

      await booking.save();

      // Récupérer la réservation avec les détails
      const populatedBooking = await Booking.findById(booking._id)
        .populate('room')
        .populate('user', 'fullName email');

      res.status(201).json({
        success: true,
        message: 'Booking created successfully',
        data: { booking: populatedBooking }
      });
    } catch (error) {
      console.error('Create booking error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create booking',
        error: error.message
      });
    }
  },

  // Get user's bookings
  getUserBookings: async (req, res) => {
    try {
      const bookings = await Booking.find({ user: req.user._id })
        .populate('room')
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        data: {
          bookings,
          count: bookings.length
        }
      });
    } catch (error) {
      console.error('Get user bookings error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch bookings',
        error: error.message
      });
    }
  },

  // Get booking by ID
  getBookingById: async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.id)
        .populate('room')
        .populate('user', 'fullName email');

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      // Vérifier si l'utilisateur est autorisé à voir cette réservation
      if (booking.user._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to view this booking'
        });
      }

      res.json({
        success: true,
        data: { booking }
      });
    } catch (error) {
      console.error('Get booking by ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch booking',
        error: error.message
      });
    }
  },

  // Cancel booking
  cancelBooking: async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.id);

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      // Vérifier si l'utilisateur est autorisé à annuler cette réservation
      if (booking.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to cancel this booking'
        });
      }

      // Vérifier si la réservation peut être annulée
      if (booking.status === 'cancelled') {
        return res.status(400).json({
          success: false,
          message: 'Booking is already cancelled'
        });
      }

      booking.status = 'cancelled';
      await booking.save();

      res.json({
        success: true,
        message: 'Booking cancelled successfully',
        data: { booking }
      });
    } catch (error) {
      console.error('Cancel booking error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to cancel booking',
        error: error.message
      });
    }
  },

  // Get all bookings (admin only)
  getAllBookings: async (req, res) => {
    try {
      const { status, startDate, endDate } = req.query;
      let filter = {};

      // Filtres
      if (status) {
        filter.status = status;
      }
      if (startDate && endDate) {
        filter.checkIn = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        };
      }

      const bookings = await Booking.find(filter)
        .populate('room')
        .populate('user', 'fullName email')
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        data: {
          bookings,
          count: bookings.length
        }
      });
    } catch (error) {
      console.error('Get all bookings error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch bookings',
        error: error.message
      });
    }
  },

  // Update booking status (admin only)
  updateBookingStatus: async (req, res) => {
    try {
      const { status } = req.body;

      if (!status || !['pending', 'confirmed', 'cancelled'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status'
        });
      }

      const booking = await Booking.findById(req.params.id);
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      booking.status = status;
      await booking.save();

      const updatedBooking = await Booking.findById(booking._id)
        .populate('room')
        .populate('user', 'fullName email');

      res.json({
        success: true,
        message: 'Booking status updated successfully',
        data: { booking: updatedBooking }
      });
    } catch (error) {
      console.error('Update booking status error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update booking status',
        error: error.message
      });
    }
  }
};

module.exports = bookingController; 