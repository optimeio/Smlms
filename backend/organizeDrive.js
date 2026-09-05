const { google } = require('googleapis');
const fs = require('fs');
require('dotenv').config();

const creds = JSON.parse(fs.readFileSync('credentials.json'));
const { client_secret, client_id, redirect_uris } = creds.installed;
const auth = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
auth.setCredentials(JSON.parse(fs.readFileSync('token.json')));
const drive = google.drive({ version: 'v3', auth });
const rootFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

async function organizeExistingFiles() {
  // 1. Get all files in root folder that start with "Anbu_"
  const res = await drive.files.list({
    q: `'${rootFolderId}' in parents and trashed=false and mimeType != 'application/vnd.google-apps.folder'`,
    fields: 'files(id, name)',
  });

  const files = res.data.files;
  console.log(`Found ${files.length} files in root folder.`);

  // Group files by trainer name (everything before the first underscore)
  const groups = {};
  for (const file of files) {
    const underscoreIdx = file.name.indexOf('_');
    if (underscoreIdx > 0) {
      const trainerName = file.name.substring(0, underscoreIdx);
      if (!groups[trainerName]) groups[trainerName] = [];
      groups[trainerName].push(file);
    }
  }

  console.log('Trainer groups:', Object.keys(groups));

  for (const [trainerName, trainerFiles] of Object.entries(groups)) {
    // Create folder for trainer
    const folder = await drive.files.create({
      requestBody: {
        name: trainerName,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [rootFolderId],
      },
      fields: 'id',
    });
    const folderId = folder.data.id;
    console.log(`Created folder "${trainerName}" (${folderId})`);

    // Move each file into the folder
    for (const file of trainerFiles) {
      await drive.files.update({
        fileId: file.id,
        addParents: folderId,
        removeParents: rootFolderId,
        fields: 'id, parents',
      });
      console.log(`  Moved: ${file.name}`);
    }
  }

  // Also delete the LMS_Test_Upload.txt file
  const testFiles = files.filter(f => f.name === 'LMS_Test_Upload.txt');
  for (const tf of testFiles) {
    await drive.files.delete({ fileId: tf.id });
    console.log(`Deleted test file: ${tf.name}`);
  }

  console.log('\nDone! Your Drive is now organized.');
  process.exit(0);
}

organizeExistingFiles().catch(err => { console.error(err); process.exit(1); });
