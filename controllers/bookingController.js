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

      // Validate required fields
      if (!roomId || !checkIn || !checkOut || !guests) {
        return res.status(400).json({ message: 'Please provide all required fields' });
      }

      // Check if room exists
      const room = await Room.findById(roomId);
      if (!room) {
        return res.status(404).json({ message: 'Room not found' });
      }

      // Check if room is available for these dates
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
        return res.status(400).json({ message: 'Room is not available for these dates' });
      }

      // Calculate total price
      const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
      const totalPrice = room.price * nights;

      // Create booking
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

      // Get booking with details
      const populatedBooking = await Booking.findById(booking._id)
        .populate('room')
        .populate('user', 'fullName email');

      res.status(201).json({
        message: 'Booking created successfully',
        booking: populatedBooking
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get user's bookings
  getUserBookings: async (req, res) => {
    try {
      const bookings = await Booking.find({ user: req.user._id })
        .populate('room')
        .sort({ createdAt: -1 });

      res.json({
        bookings,
        count: bookings.length
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get booking by ID
  getBookingById: async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.id)
        .populate('room')
        .populate('user', 'fullName email');

      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      // Check if user is authorized to view this booking
      if (booking.user._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to view this booking' });
      }

      res.json({ booking });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Cancel booking
  cancelBooking: async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.id);

      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      // Check if user is authorized to cancel this booking
      if (booking.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to cancel this booking' });
      }

      // Check if booking can be cancelled
      if (booking.status === 'cancelled') {
        return res.status(400).json({ message: 'Booking is already cancelled' });
      }

      booking.status = 'cancelled';
      await booking.save();

      res.json({
        message: 'Booking cancelled successfully',
        booking
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get all bookings (admin only)
  getAllBookings: async (req, res) => {
    try {
      const { status, startDate, endDate } = req.query;
      let filter = {};

      // Apply filters
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
        bookings,
        count: bookings.length
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update booking status (admin only)
  updateBookingStatus: async (req, res) => {
    try {
      const { status } = req.body;

      if (!status || !['pending', 'confirmed', 'cancelled'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }

      const booking = await Booking.findById(req.params.id);
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      booking.status = status;
      await booking.save();

      res.json({
        message: 'Booking status updated successfully',
        booking
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = bookingController; 