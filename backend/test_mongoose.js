const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.MONGO_URI).then(async () => {
  const userSchema = new mongoose.Schema({ email: String }, { strict: false });
  const User = mongoose.model('User', userSchema);
  const studentIds = ['6a478ed6ae09d920b829fd20'];
  const users = await User.find({ $or: [{ _id: { $in: studentIds } }, { email: { $in: studentIds } }] });
  console.log('Users found by string in Mongoose model:', users.length);
  process.exit(0);
});
