const mongoose = require('mongoose');
const Room = require('./models/Room');
const Category = require('./models/Category');
require('dotenv').config();

async function resetRooms() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to database');

    // Get categories
    const categories = await Category.find();
    console.log('Available categories:', categories.map(c => c.name));

    // Reset all rooms to available
    await Room.updateMany({}, { isAvailable: true });
    console.log('All rooms reset to available');

    // Add more rooms if needed
    const existingRooms = await Room.countDocuments();
    console.log('Current rooms count:', existingRooms);

    if (existingRooms < 8) {
      console.log('Adding more rooms...');
      
      const standardCategory = categories.find(c => c.name === 'Standard');
      const deluxeCategory = categories.find(c => c.name === 'Deluxe');
      const suiteCategory = categories.find(c => c.name === 'Suite junior');

      const newRooms = [
        {
          name: 'Chambre Standard 102',
          description: 'Chambre confortable avec vue sur la ville',
          price: 75000,
          capacity: 2,
          category: standardCategory._id,
          images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=1474&q=80'],
          amenities: ['WiFi', 'TV', 'Air conditionné', 'Salle de bain privée'],
          isAvailable: true
        },
        {
          name: 'Chambre Standard 103',
          description: 'Chambre moderne avec équipements de base',
          price: 75000,
          capacity: 2,
          category: standardCategory._id,
          images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=1474&q=80'],
          amenities: ['WiFi', 'TV', 'Air conditionné', 'Salle de bain privée'],
          isAvailable: true
        },
        {
          name: 'Chambre Deluxe 202',
          description: 'Chambre spacieuse avec balcon et vue panoramique',
          price: 80000,
          capacity: 3,
          category: deluxeCategory._id,
          images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=1474&q=80'],
          amenities: ['WiFi', 'TV', 'Mini-bar', 'Air conditionné', 'Balcon', 'Vue panoramique'],
          isAvailable: true
        },
        {
          name: 'Chambre Deluxe 203',
          description: 'Chambre de luxe avec équipements premium',
          price: 80000,
          capacity: 3,
          category: deluxeCategory._id,
          images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=1474&q=80'],
          amenities: ['WiFi', 'TV', 'Mini-bar', 'Air conditionné', 'Balcon', 'Vue panoramique'],
          isAvailable: true
        },
        {
          name: 'Suite Junior 301',
          description: 'Suite élégante avec salon séparé',
          price: 120000,
          capacity: 4,
          category: suiteCategory._id,
          images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=1474&q=80'],
          amenities: ['WiFi', 'TV', 'Mini-bar', 'Air conditionné', 'Salon', 'Salle de bain luxueuse'],
          isAvailable: true
        }
      ];

      for (const roomData of newRooms) {
        const room = new Room(roomData);
        await room.save();
        console.log(`Added room: ${roomData.name}`);
      }
    }

    // Final count
    const finalCount = await Room.countDocuments();
    const availableCount = await Room.countDocuments({ isAvailable: true });
    console.log(`\nFinal rooms count: ${finalCount}`);
    console.log(`Available rooms: ${availableCount}`);

    // Show all rooms
    const allRooms = await Room.find();
    console.log('\nAll rooms:');
    allRooms.forEach((room, index) => {
      console.log(`${index + 1}. ${room.name} - ${room.price} FCFA - Available: ${room.isAvailable}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

resetRooms(); 