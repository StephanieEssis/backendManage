const mongoose = require('mongoose');
const Room = require('../models/Room');
const Category = require('../models/Category');

const rooms = [
  {
    name: 'Chambre Standard 101',
    description: 'Chambre confortable avec lit double et salle de bain privée',
    price: 75000,
    capacity: 2,
    category: 'Standard',
    images: [
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
    ],
    amenities: ['WiFi', 'TV', 'Mini-bar', 'Air conditionné'],
    isAvailable: true
  },
  {
    name: 'Chambre Deluxe 201',
    description: 'Chambre spacieuse avec vue panoramique et balcon privé',
    price: 80000,
    capacity: 3,
    category: 'Deluxe',
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1474&q=80'
    ],
    amenities: ['WiFi', 'TV', 'Mini-bar', 'Air conditionné', 'Vue panoramique', 'Balcon'],
    isAvailable: true
  },
  {
    name: 'Suite junior 301',
    description: 'Suite luxueuse avec salon privé et jacuzzi',
    price: 85000,
    capacity: 4,
    category: 'Suite junior',
    images: [
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
    ],
    amenities: ['WiFi', 'TV', 'Mini-bar', 'Air conditionné', 'Salon privé', 'Jacuzzi', 'Service de chambre 24/7'],
    isAvailable: true
  },
  {
    name: 'Suite familiale 401',
    description: 'Suites luxueuses avec 2 chambres séparées et salon privé',
    price: 90000,
    capacity: 6,
    category: 'Suite familliale',
    images: [
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
    ],
    amenities: ['WiFi', 'TV', 'Mini-bar', 'Air conditionné', 'Salon privé', '2 Chambres', 'Service de chambre 24/7'],
    isAvailable: true
  }
];

const seedRooms = async () => {
  try {
    // Supprimer toutes les chambres existantes
    await Room.deleteMany({});
    console.log('Existing rooms deleted');

    // Récupérer les catégories
    const categories = await Category.find({});
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.name] = cat._id;
    });

    // Ajouter les IDs des catégories aux chambres
    const roomsWithCategories = rooms.map(room => ({
      ...room,
      category: categoryMap[room.category]
    }));

    // Insérer les nouvelles chambres
    const seededRooms = await Room.insertMany(roomsWithCategories);
    console.log('Rooms seeded successfully');
    console.log('Rooms seeded:', JSON.stringify(seededRooms, null, 2));
  } catch (error) {
    console.error('Error seeding rooms:', error);
  }
};

module.exports = seedRooms; 