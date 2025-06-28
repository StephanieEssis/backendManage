const mongoose = require('mongoose');
const Room = require('./models/Room');
const Category = require('./models/Category');
require('dotenv').config();

async function checkRooms() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to database');

    // Count all rooms
    const totalRooms = await Room.countDocuments();
    console.log('Total rooms in database:', totalRooms);

    // Get all rooms
    const rooms = await Room.find();
    console.log('\nAll rooms:');
    rooms.forEach((room, index) => {
      console.log(`${index + 1}. ID: ${room._id}`);
      console.log(`   Name: ${room.name || room.number}`);
      console.log(`   Price: ${room.price}`);
      console.log(`   Available: ${room.isAvailable}`);
      console.log(`   Category: ${room.category}`);
      console.log('---');
    });

    // Check available rooms
    const availableRooms = await Room.find({ isAvailable: true });
    console.log('\nAvailable rooms:', availableRooms.length);

    // Check categories
    const categories = await Category.find();
    console.log('\nCategories:', categories.length);
    categories.forEach(cat => {
      console.log(`- ${cat.name} (ID: ${cat._id})`);
    });

    // Check rooms with valid prices
    const roomsWithPrice = await Room.find({ price: { $gt: 0 } });
    console.log('\nRooms with valid price (> 0):', roomsWithPrice.length);

    // Check rooms without category reference
    const roomsWithoutCategory = await Room.find({ category: { $exists: false } });
    console.log('\nRooms without category field:', roomsWithoutCategory.length);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkRooms(); 