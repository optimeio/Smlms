const nodemailer = require('nodemailer');
require('dotenv').config();

async function testEmail() {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  
  if (!emailUser || !emailPass) {
    console.log('No credentials');
    return;
  }
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: emailUser, pass: emailPass },
  });
  
  try {
    const info = await transporter.sendMail({
      from: emailUser,
      to: 'tharaneeshkp@gmail.com',
      subject: 'Test Email',
      text: 'This is a test email.'
    });
    console.log('Email sent:', info.response);
  } catch (err) {
    console.error('Email error:', err.message);
  }
}

testEmail();
