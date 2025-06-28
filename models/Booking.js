const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  checkIn: {
    type: Date,
    required: true
  },
  checkOut: {
    type: Date,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  guests: {
    adults: {
      type: Number,
      required: true,
      min: 1
    },
    children: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  specialRequests: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Middleware pour mettre à jour la disponibilité de la chambre
bookingSchema.pre('save', async function(next) {
  try {
    const Room = mongoose.model('Room');
    
    if (this.isNew) {
      // Nouvelle réservation
      await Room.findByIdAndUpdate(this.room, { isAvailable: false });
    } else if (this.isModified('status') && this.status === 'cancelled') {
      // Annulation de réservation
      await Room.findByIdAndUpdate(this.room, { isAvailable: true });
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

// Méthode pour vérifier si une chambre est disponible pour une période donnée
bookingSchema.statics.isRoomAvailable = async function(roomId, checkIn, checkOut) {
  const existingBooking = await this.findOne({
    room: roomId,
    status: { $ne: 'cancelled' },
    $or: [
      {
        checkIn: { $lte: checkOut },
        checkOut: { $gte: checkIn }
      }
    ]
  });
  
  return !existingBooking;
};

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking; 