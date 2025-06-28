const mongoose = require('mongoose');
const Category = require('../models/Category');
const Room = require('../models/Room');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const seedData = async () => {
  try {
    // Créer des catégories
    const categories = await Category.create([
      {
        name: 'Standard',
        description: 'Chambres confortables avec équipements de base',
        pricePerNight: 50000
      },
      {
        name: 'Deluxe',
        description: 'Chambres spacieuses avec équipements premium',
        pricePerNight: 75000
      },
      {
        name: 'Suite',
        description: 'Suites luxueuses avec services exclusifs',
        pricePerNight: 120000
      }
    ]);

    console.log('Catégories créées:', categories.length);

    // Créer des chambres
    const rooms = await Room.create([
      {
        name: 'Chambre Standard 101',
        description: 'Chambre confortable avec lit double et salle de bain privée',
        price: 50000,
        capacity: 2,
        category: categories[0]._id,
        amenities: ['WiFi', 'TV', 'Climatisation', 'Salle de bain privée'],
        isAvailable: true
      },
      {
        name: 'Chambre Standard 102',
        description: 'Chambre confortable avec lit double et salle de bain privée',
        price: 50000,
        capacity: 2,
        category: categories[0]._id,
        amenities: ['WiFi', 'TV', 'Climatisation', 'Salle de bain privée'],
        isAvailable: true
      },
      {
        name: 'Chambre Deluxe 201',
        description: 'Chambre spacieuse avec vue panoramique et équipements premium',
        price: 75000,
        capacity: 3,
        category: categories[1]._id,
        amenities: ['WiFi', 'TV HD', 'Climatisation', 'Salle de bain privée', 'Balcon', 'Mini-bar'],
        isAvailable: true
      },
      {
        name: 'Suite Présidentielle 301',
        description: 'Suite luxueuse avec salon privé et services exclusifs',
        price: 120000,
        capacity: 4,
        category: categories[2]._id,
        amenities: ['WiFi', 'TV 4K', 'Climatisation', 'Salle de bain privée', 'Balcon', 'Mini-bar', 'Jacuzzi', 'Service en chambre'],
        isAvailable: true
      }
    ]);

    console.log('Chambres créées:', rooms.length);

    // Ajout d'un utilisateur admin si non existant
    await User.updateOne(
      { email: 'admin@hotel.com' },
      {
        $setOnInsert: {
          fullName: 'Admin',
          email: 'admin@hotel.com',
          password: await bcrypt.hash('admin123', 8),
          role: 'admin'
        }
      },
      { upsert: true }
    );

    console.log('Données de test créées avec succès !');
  } catch (error) {
    console.error('Erreur lors de la création des données de test:', error);
  }
};

module.exports = seedData; 