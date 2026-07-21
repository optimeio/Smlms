const mongoose = require('mongoose');
require('dotenv').config();

const userSchema = new mongoose.Schema({
  fullName: { type: String },
  email: { type: String, required: true, unique: true },
}, { strict: false });

const User = mongoose.model('User', userSchema);

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const studentIds = ['6a478ed6ae09d920b829fd20'];
  const users = await User.find({ $or: [{ _id: { $in: studentIds } }, { email: { $in: studentIds } }] });
  console.log('Users found:', users.map(u => u.email));
  process.exit(0);
});
