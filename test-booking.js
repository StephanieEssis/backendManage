const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Room = require('./models/Room');
const Booking = require('./models/Booking');
require('dotenv').config();

async function testBookingCreation() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to database');

    // Find a test user
    const user = await User.findOne({ role: 'user' });
    if (!user) {
      console.log('No user found, creating one...');
      const newUser = new User({
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'user'
      });
      await newUser.save();
      console.log('Test user created');
    }

    // Find a test room
    const room = await Room.findOne({ isAvailable: true });
    if (!room) {
      console.log('No available room found, creating one...');
      const newRoom = new Room({
        number: 'TEST-001',
        type: 'Standard',
        price: 100,
        capacity: 2,
        isAvailable: true,
        amenities: ['WiFi', 'TV'],
        description: 'Test room'
      });
      await newRoom.save();
      console.log('Test room created');
    }

    // Create a test booking
    const testUser = await User.findOne({ role: 'user' });
    const testRoom = await Room.findOne({ isAvailable: true });

    console.log('Test user:', testUser._id);
    console.log('Test room:', testRoom._id);

    const bookingData = {
      user: testUser._id,
      room: testRoom._id,
      checkIn: new Date('2024-12-25'),
      checkOut: new Date('2024-12-27'),
      totalPrice: 200,
      guests: {
        adults: 2,
        children: 0
      },
      specialRequests: 'Test booking'
    };

    console.log('Creating test booking with data:', bookingData);

    const booking = new Booking(bookingData);
    await booking.save();

    console.log('Test booking created successfully:', booking._id);

    // Test populate
    const populatedBooking = await Booking.findById(booking._id)
      .populate('room')
      .populate('user', 'fullName email');

    console.log('Populated booking:', populatedBooking);

    console.log('All tests passed!');
    process.exit(0);

  } catch (error) {
    console.error('Test failed:', error);
    console.error('Error stack:', error.stack);
    process.exit(1);
  }
}

testBookingCreation(); 