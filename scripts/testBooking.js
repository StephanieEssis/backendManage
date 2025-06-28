const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const User = require('../models/User');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI non définie dans les variables d\'environnement');
  process.exit(1);
}

async function testBooking() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    // Récupérer une chambre et un utilisateur pour le test
    const room = await Room.findOne({});
    const user = await User.findOne({});

    if (!room) {
      console.error('❌ Aucune chambre trouvée');
      return;
    }

    if (!user) {
      console.error('❌ Aucun utilisateur trouvé');
      return;
    }

    console.log('📋 Test avec:');
    console.log('- Chambre:', room.name, '(ID:', room._id, ')');
    console.log('- Utilisateur:', user.fullName, '(ID:', user._id, ')');

    // Créer une réservation de test
    const bookingData = {
      user: user._id,
      room: room._id,
      checkIn: new Date('2024-01-15'),
      checkOut: new Date('2024-01-17'),
      totalPrice: room.price * 2, // 2 nuits
      guests: {
        adults: 2,
        children: 0
      },
      specialRequests: 'Test de réservation'
    };

    console.log('🔄 Création de la réservation...');
    const booking = new Booking(bookingData);
    await booking.save();

    console.log('✅ Réservation créée avec succès!');
    console.log('📊 Détails de la réservation:');
    console.log('- ID:', booking._id);
    console.log('- Chambre:', room.name);
    console.log('- Utilisateur:', user.fullName);
    console.log('- Dates:', booking.checkIn.toDateString(), 'à', booking.checkOut.toDateString());
    console.log('- Prix total:', booking.totalPrice, 'FCFA');
    console.log('- Invités:', booking.guests.adults, 'adultes,', booking.guests.children, 'enfants');
    console.log('- Statut:', booking.status);

    // Vérifier que la chambre est maintenant indisponible
    const updatedRoom = await Room.findById(room._id);
    console.log('🏠 Chambre disponible:', updatedRoom.isAvailable);

    // Supprimer la réservation de test
    console.log('🧹 Suppression de la réservation de test...');
    await Booking.findByIdAndDelete(booking._id);
    console.log('✅ Réservation de test supprimée');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Déconnecté de MongoDB');
  }
}

// Exécuter le test
testBooking(); 