require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lms_db';

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    const db = mongoose.connection.db;
    const collection = db.collection('companycourses');
    
    // Update all documents to have originalPrice: 5999 and price: 2999
    // or just the one with title "Smart Cattle Farming"
    const result = await collection.updateMany(
      {},
      { $set: { originalPrice: 5999, price: 2999 } }
    );
    
    console.log(`Updated ${result.modifiedCount} courses.`);
    process.exit(0);
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });
