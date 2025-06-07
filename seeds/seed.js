require('dotenv').config();
const mongoose = require('mongoose');

const seedCategories = require('./categorySeed');
const seedRooms = require('./roomSeed');

const runSeeds = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Exécuter les seeds dans l'ordre
    await seedCategories();
    await seedRooms();

    console.log('All seeds completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error running seeds:', error);
    process.exit(1);
  }
};

runSeeds(); 