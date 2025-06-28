const mongoose = require('mongoose');
const Room = require('../models/Room');
const Category = require('../models/Category');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/TON_NOM_DE_BDD';
const DEFAULT_ROOM_PRICE = 75000;
const DEFAULT_CATEGORY_PRICE = 75000;

async function fixAll() {
  await mongoose.connect(MONGODB_URI);

  // Corriger les chambres sans prix valide
  const roomResult = await Room.updateMany(
    {
      $or: [
        { price: { $exists: false } },
        { price: { $lte: 0 } },
        { price: { $type: 'null' } }
      ]
    },
    { $set: { price: DEFAULT_ROOM_PRICE, isAvailable: true } }
  );
  console.log(`${roomResult.modifiedCount} chambres corrigées avec un prix de ${DEFAULT_ROOM_PRICE} FCFA.`);

  // Corriger les catégories sans pricePerNight valide
  const catResult = await Category.updateMany(
    {
      $or: [
        { pricePerNight: { $exists: false } },
        { pricePerNight: { $lte: 0 } },
        { pricePerNight: { $type: 'null' } }
      ]
    },
    { $set: { pricePerNight: DEFAULT_CATEGORY_PRICE } }
  );
  console.log(`${catResult.modifiedCount} catégories corrigées avec un pricePerNight de ${DEFAULT_CATEGORY_PRICE} FCFA.`);

  await mongoose.disconnect();
}

fixAll().catch(err => {
  console.error('Erreur lors de la correction :', err);
  process.exit(1);
}); 