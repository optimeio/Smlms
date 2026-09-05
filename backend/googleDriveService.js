const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');
const TOKEN_PATH = path.join(__dirname, 'token.json');

let driveService = null;

function initializeDriveService() {
  if (driveService) return driveService;
  
  try {
    if (!fs.existsSync(CREDENTIALS_PATH) || !fs.existsSync(TOKEN_PATH)) {
      console.warn("Google Drive credentials or token missing. Uploads will fail.");
      return null;
    }
    
    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    const token = JSON.parse(fs.readFileSync(TOKEN_PATH));
    oAuth2Client.setCredentials(token);
    
    driveService = google.drive({ version: 'v3', auth: oAuth2Client });
    return driveService;
  } catch (err) {
    console.error("Failed to initialize Google Drive service:", err);
    return null;
  }
}

/**
 * Creates a folder in Google Drive (or returns existing one with the same name).
 * @param {string} folderName - The name of the folder to create.
 * @param {string} parentFolderId - The ID of the parent folder.
 * @returns {Promise<string>} - The folder ID.
 */
const createDriveFolder = async (folderName, parentFolderId) => {
  const drive = initializeDriveService();
  if (!drive) throw new Error("Google Drive Service is not initialized.");

  // Check if folder already exists
  const query = `name='${folderName}' and '${parentFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`;
  const existing = await drive.files.list({
    q: query,
    fields: 'files(id, name)',
  });

  if (existing.data.files.length > 0) {
    console.log(`Folder "${folderName}" already exists. Using existing folder.`);
    return existing.data.files[0].id;
  }

  // Create new folder
  const response = await drive.files.create({
    requestBody: {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [parentFolderId],
    },
    fields: 'id',
  });

  console.log(`Created folder "${folderName}" with ID: ${response.data.id}`);
  return response.data.id;
};

/**
 * Uploads a file to Google Drive.
 * @param {string} filePath - The local path to the file.
 * @param {string} fileName - The desired name of the file on Drive.
 * @param {string} mimeType - The MIME type of the file.
 * @param {string} folderId - The ID of the parent folder in Google Drive.
 * @returns {Promise<Object>} - The created file's metadata.
 */
const uploadFileToDrive = async (filePath, fileName, mimeType, folderId) => {
  const drive = initializeDriveService();
  if (!drive) throw new Error("Google Drive Service is not initialized.");

  try {
    const response = await drive.files.create({
      requestBody: {
        name: fileName,
        parents: [folderId],
      },
      media: {
        mimeType: mimeType,
        body: fs.createReadStream(filePath),
      },
      fields: 'id, webViewLink, webContentLink',
    });
    
    // Make the file publicly viewable
    await drive.permissions.create({
      fileId: response.data.id,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      }
    });

    return response.data;
  } catch (error) {
    console.error(`Error uploading ${fileName} to Google Drive:`, error);
    throw error;
  }
};

module.exports = {
  uploadFileToDrive,
  createDriveFolder
};
