require('dotenv').config();
const mongoose = require('mongoose');

const seedCategories = require('./categorySeed');
const seedRooms = require('./roomSeed');

const runSeeds = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB successfully');

    console.log('Starting to seed categories...');
    const categories = await seedCategories();
    console.log('Categories seeded:', categories);

    console.log('Starting to seed rooms...');
    const rooms = await seedRooms();
    console.log('Rooms seeded:', rooms);

    console.log('All seeds completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error running seeds:', error);
    process.exit(1);
  }
};

runSeeds(); 