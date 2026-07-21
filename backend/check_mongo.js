const mongoose = require('mongoose');
const MONGO_URI = 'mongodb://MbkLms:Nithya1234@ac-jxsqbhi-shard-00-00.phfi4bf.mongodb.net:27017,ac-jxsqbhi-shard-00-01.phfi4bf.mongodb.net:27017,ac-jxsqbhi-shard-00-02.phfi4bf.mongodb.net:27017/mbklms?ssl=true&replicaSet=atlas-7vrrxb-shard-0&authSource=admin&appName=Cluster0';

const liveClassSchema = new mongoose.Schema({}, { strict: false });
const LiveClass = mongoose.model('LiveClass', liveClassSchema, 'liveclasses');
const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }), 'users');

async function check() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to DB');
  
  let studentId = "tharaneeshkp@gmail.com";
  let finalStudentId = studentId;

  if (studentId && studentId.includes('@')) {
    const sUser = await User.findOne({ email: studentId });
    if (sUser) {
      finalStudentId = sUser._id.toString();
      console.log('Resolved studentId email to _id:', finalStudentId);
    } else {
      console.log('Could not find user for email');
    }
  }

  let query = { trainerId: { $exists: true, $ne: null }, timing: { $exists: true, $ne: null } };
  if (finalStudentId) query.studentIds = finalStudentId;

  console.log('Query:', query);
  
  const classes = await LiveClass.find(query).sort({ createdAt: -1 });
  console.log('Classes found:', classes.length);
  console.log(JSON.stringify(classes, null, 2));

  process.exit(0);
}
check();
