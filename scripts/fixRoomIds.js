const mongoose = require('mongoose');
const Room = require('../models/Room');
const Category = require('../models/Category');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI non définie dans les variables d\'environnement');
  process.exit(1);
}

async function fixRoomIds() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connecté à MongoDB');

    // 1. Vérifier et corriger les catégories
    console.log('\n=== Vérification des catégories ===');
    const categories = await Category.find({});
    console.log(`Nombre de catégories trouvées: ${categories.length}`);
    
    if (categories.length === 0) {
      console.log('Aucune catégorie trouvée. Création des catégories par défaut...');
      const defaultCategories = [
        {
          name: 'Standard',
          description: 'Chambres confortables avec équipements de base',
          pricePerNight: 75000
        },
        {
          name: 'Deluxe',
          description: 'Chambres spacieuses avec vue panoramique',
          pricePerNight: 80000
        },
        {
          name: 'Suite junior',
          description: 'Suites luxueuses avec salon privé',
          pricePerNight: 85000
        },
        {
          name: 'Suite familiale',
          description: 'Suites luxueuses avec 2 chambres séparées et salon privé',
          pricePerNight: 90000
        }
      ];
      
      const createdCategories = await Category.insertMany(defaultCategories);
      console.log(`${createdCategories.length} catégories créées`);
    }

    // 2. Vérifier et corriger les chambres
    console.log('\n=== Vérification des chambres ===');
    const rooms = await Room.find({});
    console.log(`Nombre de chambres trouvées: ${rooms.length}`);

    if (rooms.length === 0) {
      console.log('Aucune chambre trouvée. Création des chambres par défaut...');
      
      const categories = await Category.find({});
      const categoryMap = {};
      categories.forEach(cat => {
        categoryMap[cat.name] = cat._id;
      });

      const defaultRooms = [
        {
          name: 'Chambre Standard 101',
          description: 'Chambre confortable avec lit double et salle de bain privée',
          price: 75000,
          capacity: 2,
          category: categoryMap['Standard'] || categories[0]._id,
          images: [
            'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&h=600&fit=crop'
          ],
          amenities: ['WiFi', 'TV', 'Mini-bar', 'Air conditionné'],
          isAvailable: true
        },
        {
          name: 'Chambre Deluxe 201',
          description: 'Chambre spacieuse avec vue panoramique et balcon privé',
          price: 80000,
          capacity: 3,
          category: categoryMap['Deluxe'] || categories[1]?._id || categories[0]._id,
          images: [
            'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop'
          ],
          amenities: ['WiFi', 'TV', 'Mini-bar', 'Air conditionné', 'Vue panoramique', 'Balcon'],
          isAvailable: true
        },
        {
          name: 'Suite Junior 301',
          description: 'Suite luxueuse avec salon privé et jacuzzi',
          price: 85000,
          capacity: 4,
          category: categoryMap['Suite junior'] || categories[2]?._id || categories[0]._id,
          images: [
            'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&h=600&fit=crop'
          ],
          amenities: ['WiFi', 'TV', 'Mini-bar', 'Air conditionné', 'Salon privé', 'Jacuzzi', 'Service de chambre 24/7'],
          isAvailable: true
        }
      ];

      const createdRooms = await Room.insertMany(defaultRooms);
      console.log(`${createdRooms.length} chambres créées`);
    } else {
      // Corriger les chambres existantes
      console.log('\n=== Correction des chambres existantes ===');
      
      for (const room of rooms) {
        const updates = {};
        
        // Vérifier et corriger l'ID
        if (!room._id) {
          console.log(`Chambre sans ID trouvée: ${room.name}`);
          continue;
        }

        // Vérifier et corriger le nom
        if (!room.name || room.name.trim() === '') {
          updates.name = 'Chambre sans nom';
          console.log(`Chambre ${room._id}: nom corrigé`);
        }

        // Vérifier et corriger la description
        if (!room.description || room.description.trim() === '') {
          updates.description = 'Aucune description disponible';
          console.log(`Chambre ${room._id}: description corrigée`);
        }

        // Vérifier et corriger le prix
        if (!room.price || room.price <= 0) {
          updates.price = 75000;
          console.log(`Chambre ${room._id}: prix corrigé à 75000`);
        }

        // Vérifier et corriger la capacité
        if (!room.capacity || room.capacity <= 0) {
          updates.capacity = 2;
          console.log(`Chambre ${room._id}: capacité corrigée à 2`);
        }

        // Vérifier et corriger les images
        if (!room.images || room.images.length === 0) {
          updates.images = ['https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&h=600&fit=crop'];
          console.log(`Chambre ${room._id}: images corrigées`);
        }

        // Vérifier et corriger les équipements
        if (!room.amenities || room.amenities.length === 0) {
          updates.amenities = ['WiFi', 'TV', 'Air conditionné'];
          console.log(`Chambre ${room._id}: équipements corrigés`);
        }

        // Vérifier et corriger la disponibilité
        if (room.isAvailable === undefined) {
          updates.isAvailable = true;
          console.log(`Chambre ${room._id}: disponibilité corrigée`);
        }

        // Appliquer les corrections
        if (Object.keys(updates).length > 0) {
          await Room.findByIdAndUpdate(room._id, updates);
          console.log(`Chambre ${room._id} (${room.name}) corrigée`);
        }
      }
    }

    // 3. Afficher un résumé final
    console.log('\n=== Résumé final ===');
    const finalRooms = await Room.find({}).populate('category');
    console.log(`Nombre total de chambres: ${finalRooms.length}`);
    
    finalRooms.forEach(room => {
      console.log(`- ${room.name} (ID: ${room._id}) - Prix: ${room.price} FCFA - Disponible: ${room.isAvailable}`);
    });

    console.log('\n✅ Correction des IDs des chambres terminée avec succès!');

  } catch (error) {
    console.error('❌ Erreur lors de la correction:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Déconnecté de MongoDB');
  }
}

// Exécuter le script
fixRoomIds(); 