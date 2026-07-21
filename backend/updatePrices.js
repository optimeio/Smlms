const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sm_groups';

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  name: { type: String },
  originalPrice: { type: String },
  price: { type: String },
  description: { type: String },
  image: { type: String },
  content: { type: String, required: true },
  ppt: { type: String },
  pptName: { type: String },
  video: { type: String },
  videoName: { type: String },
  programType: { type: String, default: 'Student Development Program' },
  createdAt: { type: Date, default: Date.now }
});

async function run() {
  let isMongoConnected = false;
  try {
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 3000 });
    console.log('MongoDB connected.');
    isMongoConnected = true;
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }

  if (isMongoConnected) {
    const Course = mongoose.model('Course', courseSchema);
    const result = await Course.updateMany({}, {
      $set: { originalPrice: '4999', price: '999' }
    });
    console.log('MongoDB courses updated:', result);
    mongoose.disconnect();
  }

  const localFilePath = path.join(__dirname, 'courses.json');
  if (fs.existsSync(localFilePath)) {
    let localData = JSON.parse(fs.readFileSync(localFilePath, 'utf8'));
    localData = localData.map(c => ({
      ...c,
      originalPrice: '4999',
      price: '999'
    }));
    fs.writeFileSync(localFilePath, JSON.stringify(localData, null, 2), 'utf8');
    console.log('Local JSON courses updated.');
  } else {
    console.log('No local courses.json found.');
  }
}

run();
