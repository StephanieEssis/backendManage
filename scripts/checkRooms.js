const mongoose = require('mongoose');
const Room = require('../models/Room');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI non définie dans les variables d\'environnement');
  process.exit(1);
}

async function checkRooms() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    // Récupérer toutes les chambres
    const rooms = await Room.find({});
    console.log(`📊 Total des chambres: ${rooms.length}`);

    if (rooms.length === 0) {
      console.log('❌ Aucune chambre trouvée dans la base de données');
      return;
    }

    // Vérifier chaque chambre
    let validRooms = 0;
    let invalidRooms = 0;

    rooms.forEach((room, index) => {
      console.log(`\n🏠 Chambre ${index + 1}:`);
      console.log(`   ID: ${room._id}`);
      console.log(`   Nom: ${room.name}`);
      console.log(`   Prix: ${room.price}`);
      console.log(`   Disponible: ${room.isAvailable}`);
      console.log(`   Capacité: ${room.capacity}`);
      console.log(`   Catégorie: ${room.category}`);

      if (!room.price || room.price <= 0) {
        console.log(`   ❌ PROBLÈME: Prix invalide ou manquant`);
        invalidRooms++;
      } else {
        console.log(`   ✅ Prix valide`);
        validRooms++;
      }
    });

    console.log(`\n📈 Résumé:`);
    console.log(`   Chambres valides: ${validRooms}`);
    console.log(`   Chambres avec problème: ${invalidRooms}`);

    if (invalidRooms > 0) {
      console.log(`\n🔧 Correction automatique des chambres avec prix invalide...`);
      
      const result = await Room.updateMany(
        {
          $or: [
            { price: { $exists: false } },
            { price: { $lte: 0 } },
            { price: { $type: 'null' } }
          ]
        },
        { $set: { price: 75000, isAvailable: true } }
      );
      
      console.log(`✅ ${result.modifiedCount} chambres corrigées avec un prix de 75000 FCFA`);
    }

  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Déconnecté de MongoDB');
  }
}

checkRooms(); 