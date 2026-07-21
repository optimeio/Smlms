const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.MONGO_URI).then(async () => {
  const User = mongoose.connection.db.collection('users');
  const studentIds = ['6a478ed6ae09d920b829fd20'];
  const users = await User.find({ $or: [{ _id: { $in: studentIds } }, { email: { $in: studentIds } }] }).toArray();
  console.log('Users found by string:', users.length);
  
  const oIds = studentIds.map(id => new mongoose.Types.ObjectId(id));
  const users2 = await User.find({ $or: [{ _id: { $in: oIds } }, { email: { $in: studentIds } }] }).toArray();
  console.log('Users found by ObjectId:', users2.length);
  process.exit(0);
});
