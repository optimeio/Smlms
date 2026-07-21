const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://MbkLms:Nithya1234@ac-jxsqbhi-shard-00-00.phfi4bf.mongodb.net:27017,ac-jxsqbhi-shard-00-01.phfi4bf.mongodb.net:27017,ac-jxsqbhi-shard-00-02.phfi4bf.mongodb.net:27017/mbklms?ssl=true&replicaSet=atlas-7vrrxb-shard-0&authSource=admin&appName=Cluster0';

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
}, { strict: false });

const userSchema = new mongoose.Schema({
  assignedCourses: { type: [String], default: [] },
}, { strict: false });

async function run() {
  try {
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('MongoDB connected.');
    
    const Course = mongoose.model('Course', courseSchema);
    const User = mongoose.model('User', userSchema);

    const replacements = {
      "EV": "Electric Vechicle",
      "Micro Soft Office with PowerPoint": "MicroSoft  PowerPoint With AI",
      "Micro Soft Office with Excel": "MicroSoft Excel with AI",
      "Micro Soft Office with AI": "MicroSoft Office with AI",
      "Cloud": "Cloud Computing"
    };

    // Update Courses
    for (const [oldName, newName] of Object.entries(replacements)) {
      const updateResult = await Course.updateMany(
        { title: oldName },
        { $set: { title: newName } }
      );
      console.log(`Updated Course "${oldName}" to "${newName}":`, updateResult.modifiedCount);
    }

    // Update Users assignedCourses arrays
    const usersToUpdate = await User.find({
      assignedCourses: { $in: Object.keys(replacements) }
    });
    console.log(`Found ${usersToUpdate.length} users with these courses.`);

    let updatedUsers = 0;
    for (let u of usersToUpdate) {
      if (u.assignedCourses) {
        let changed = false;
        u.assignedCourses = u.assignedCourses.map(c => {
          if (replacements[c]) {
            changed = true;
            return replacements[c];
          }
          return c;
        });
        if (changed) {
          await u.save();
          updatedUsers++;
        }
      }
    }
    console.log(`Updated assignedCourses for ${updatedUsers} users successfully.`);

    mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err);
  }
}

run();
