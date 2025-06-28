const mongoose = require('mongoose');
const Room = require('../models/Room');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/TON_NOM_DE_BDD';
const DEFAULT_PRICE = 75000;

async function fixRooms() {
  await mongoose.connect(MONGODB_URI);
  const result = await Room.updateMany(
    {
      $or: [
        { price: { $exists: false } },
        { price: { $lte: 0 } },
        { price: { $type: 'null' } }
      ]
    },
    { $set: { price: DEFAULT_PRICE, isAvailable: true } }
  );
  console.log(`${result.modifiedCount} chambres corrigées avec un prix de ${DEFAULT_PRICE} FCFA.`);
  await mongoose.disconnect();
}

fixRooms().catch(err => {
  console.error('Erreur lors de la correction des chambres :', err);
  process.exit(1);
}); 