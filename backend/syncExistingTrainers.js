const mongoose = require('mongoose');
const path = require('path');
const { uploadFileToDrive } = require('./googleDriveService');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;
const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

// Define a minimal User model for this script
const userSchema = new mongoose.Schema({
  email: String,
  fullName: String,
  role: String,
  status: String,
  uploadedDocuments: mongoose.Schema.Types.Mixed,
  driveLinks: mongoose.Schema.Types.Mixed
}, { strict: false });

const User = mongoose.model('User', userSchema);

async function syncExistingTrainers() {
  if (!folderId) {
    console.error('No folder ID found in .env');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected.');

    // Find trainers who are approved but don't have driveLinks yet
    const trainers = await User.find({
      role: 'trainer',
      $or: [{ status: 'approved' }, { status: 'Approved' }],
      driveLinks: { $exists: false }
    });

    console.log(`Found ${trainers.length} already approved trainers without Drive links.`);

    for (const user of trainers) {
      if (user.uploadedDocuments) {
        console.log(`\nSyncing documents for ${user.email} (${user.fullName})...`);
        const driveLinks = {};

        for (const [key, filePath] of Object.entries(user.uploadedDocuments)) {
          try {
            const ext = path.extname(filePath);
            const fileName = `${user.fullName}_${key}${ext}`;
            let mimeType = 'application/octet-stream';
            if (ext === '.pdf') mimeType = 'application/pdf';
            else if (ext === '.jpg' || ext === '.jpeg') mimeType = 'image/jpeg';
            else if (ext === '.png') mimeType = 'image/png';

            console.log(`Uploading ${fileName}...`);
            const driveFile = await uploadFileToDrive(filePath, fileName, mimeType, folderId);
            driveLinks[key] = driveFile.webViewLink;
          } catch (err) {
            console.error(`Failed to upload ${key} for ${user.email}:`, err.message);
          }
        }

        if (Object.keys(driveLinks).length > 0) {
          user.driveLinks = driveLinks;
          await user.save();
          console.log(`Saved Drive links for ${user.email}.`);
        }
      }
    }

    console.log('\nSync complete!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

syncExistingTrainers();
