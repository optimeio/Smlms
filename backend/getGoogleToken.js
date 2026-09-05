const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Drive API.
  authorize(JSON.parse(content));
});

function authorize(credentials) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  getAccessToken(oAuth2Client);
}

function getAccessToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('\n======================================================');
  console.log('Authorize this app by visiting this url:\n', authUrl);
  console.log('======================================================\n');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('After you log in and authorize, Google will redirect you to a page that fails to load (localhost). Look at the URL in your browser and copy the "code=" part (everything after code= up until any & symbol).\n\nEnter the code here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(decodeURIComponent(code), (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
        console.log('SUCCESS! You can close this terminal.');
        process.exit(0);
      });
    });
  });
}
