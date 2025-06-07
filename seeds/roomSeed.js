const mongoose = require('mongoose');
const Room = require('../models/Room');
const Category = require('../models/Category');

const rooms = [
  {
    name: 'Chambre Standard 101',
    description: 'Chambre confortable avec lit double et salle de bain privée',
    price: 100,
    capacity: 2,
    status: 'available',
    features: ['WiFi', 'TV', 'Mini-bar', 'Air conditionné'],
    images: [
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
    ],
    amenities: ['WiFi', 'TV', 'Mini-bar', 'Air conditionné'],
    isAvailable: true
  },
  {
    name: 'Chambre Deluxe 201',
    description: 'Chambre spacieuse avec vue panoramique et balcon privé',
    price: 200,
    capacity: 3,
    status: 'available',
    features: ['WiFi', 'TV', 'Mini-bar', 'Air conditionné', 'Vue panoramique'],
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1474&q=80'
    ],
    amenities: ['WiFi', 'TV', 'Mini-bar', 'Air conditionné', 'Vue panoramique', 'Balcon'],
    isAvailable: true
  },
  {
    name: 'Suite Luxe 301',
    description: 'Suite luxueuse avec salon privé et jacuzzi',
    price: 300,
    capacity: 4,
    status: 'available',
    features: ['WiFi', 'TV', 'Mini-bar', 'Air conditionné', 'Salon privé', 'Jacuzzi'],
    images: [
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
    ],
    amenities: ['WiFi', 'TV', 'Mini-bar', 'Air conditionné', 'Salon privé', 'Jacuzzi', 'Service de chambre 24/7'],
    isAvailable: true
  }
];

const seedRooms = async () => {
  try {
    // Récupérer les catégories
    const categories = await Category.find();
    
    // Associer chaque chambre à une catégorie
    const roomsWithCategories = rooms.map((room, index) => ({
      ...room,
      category: categories[index % categories.length]._id
    }));

    await Room.deleteMany({});
    const seededRooms = await Room.insertMany(roomsWithCategories);
    console.log('Rooms seeded successfully');
    return seededRooms;
  } catch (error) {
    console.error('Error seeding rooms:', error);
    throw error;
  }
};

module.exports = seedRooms; 