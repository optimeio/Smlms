const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://MbkLms:Nithya1234@ac-jxsqbhi-shard-00-00.phfi4bf.mongodb.net:27017,ac-jxsqbhi-shard-00-01.phfi4bf.mongodb.net:27017,ac-jxsqbhi-shard-00-02.phfi4bf.mongodb.net:27017/mbklms?ssl=true&replicaSet=atlas-7vrrxb-shard-0&authSource=admin&appName=Cluster0';

const courseSchema = new mongoose.Schema({
  title: { type: String },
}, { strict: false });

async function run() {
  try {
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('MongoDB connected.');
    
    const Course = mongoose.model('Course', courseSchema);

    const courses = await Course.find({}, { title: 1 });
    console.log('Courses in DB:', JSON.stringify(courses, null, 2));

    mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err);
  }
}

run();
