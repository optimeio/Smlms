const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware — handle CORS preflight explicitly
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Uploads directory configuration
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
app.use('/uploads', express.static(UPLOADS_DIR));

// Fallback data file setup
const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const COURSES_FILE = path.join(DATA_DIR, 'courses.json');

const DEFAULT_COURSES = [
  { id: '1', title: 'Embedded Systems', content: 'Learn the fundamentals of Embedded Systems, microcontrollers, assembly, and C programming for hardware interfaces.', image: '', ppt: '', pptName: '', video: '', videoName: '' },
  { id: '2', title: 'Electric Vehicles', content: 'Explore Electric Vehicle powertrain, battery management systems, motor control, and EV architecture.', image: '', ppt: '', pptName: '', video: '', videoName: '' },
  { id: '3', title: 'MERN Stack Development', content: 'Master MongoDB, Express.js, React, and Node.js to build modern, full-stack web applications.', image: '', ppt: '', pptName: '', video: '', videoName: '' },
  { id: '4', title: 'IoT & Sensor Networks', content: 'Build smart connected devices using sensor technology, wireless protocols, and cloud platforms.', image: '', ppt: '', pptName: '', video: '', videoName: '' },
  { id: '5', title: 'Python for Data Science', content: 'Learn core Python concepts, data analysis with NumPy/Pandas, and visualization tools.', image: '', ppt: '', pptName: '', video: '', videoName: '' },
  { id: '6', title: 'Machine Learning Fundamentals', content: 'Introduction to supervised and unsupervised machine learning algorithms, training models, and validation.', image: '', ppt: '', pptName: '', video: '', videoName: '' },
  { id: '7', title: 'Cloud Computing (AWS)', content: 'Deploy and maintain scalable web architectures on Amazon Web Services cloud infrastructure.', image: '', ppt: '', pptName: '', video: '', videoName: '' },
  { id: '8', title: 'Cybersecurity Essentials', content: 'Protect networks and systems against digital threats, understand cryptography and secure practices.', image: '', ppt: '', pptName: '', video: '', videoName: '' },
  { id: '9', title: 'Digital Marketing', content: 'Strategies for online marketing, search engine optimization, content creation, and analytics tools.', image: '', ppt: '', pptName: '', video: '', videoName: '' },
  { id: '10', title: 'AutoCAD & Mechanical Design', content: 'Create precise 2D drafting and 3D modeling specifications for mechanical parts and assemblies.', image: '', ppt: '', pptName: '', video: '', videoName: '' }
];

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([]));
}
if (!fs.existsSync(COURSES_FILE)) {
  fs.writeFileSync(COURSES_FILE, JSON.stringify(DEFAULT_COURSES, null, 2));
}

// Read/write local users fallback
const getLocalUsers = () => {
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

const saveLocalUser = (user) => {
  const users = getLocalUsers();
  users.push(user);
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

const getLocalCourses = () => {
  try {
    const data = fs.readFileSync(COURSES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

const saveLocalCourses = (courses) => {
  fs.writeFileSync(COURSES_FILE, JSON.stringify(courses, null, 2));
};

// Schema definition (only used if MongoDB is active)
const userSchema = new mongoose.Schema({
  fullName: { type: String },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String, required: true },
  role: { type: String, default: 'student' },
  assignedCourses: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now }
}, { strict: false });

let User;
try {
  User = mongoose.model('User', userSchema);
} catch (err) {
  User = mongoose.models.User;
}

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  name: { type: String },
  price: { type: String },
  description: { type: String },
  image: { type: String }, // path to static image file
  content: { type: String, required: true },
  ppt: { type: String }, // path to static PPT file
  pptName: { type: String }, // original file name
  video: { type: String }, // path to static video file
  videoName: { type: String }, // original file name
  programType: { type: String, default: 'Student Development Program' },
  createdAt: { type: Date, default: Date.now }
});

let Course;
try {
  Course = mongoose.model('Course', courseSchema);
} catch (err) {
  Course = mongoose.models.Course;
}

const accessRequestSchema = new mongoose.Schema({
  requesterEmail: { type: String, required: true },
  targetEmail: { type: String, required: true },
  requesterName: { type: String },
  targetName: { type: String },
  requesterRole: { type: String },
  targetRole: { type: String },
  status: { type: String, default: 'Pending', enum: ['Pending', 'Approved', 'Rejected'] },
  createdAt: { type: Date, default: Date.now }
});

let AccessRequest;
try {
  AccessRequest = mongoose.model('AccessRequest', accessRequestSchema);
} catch (e) {
  AccessRequest = mongoose.models.AccessRequest;
}

const REQUESTS_FILE = path.join(DATA_DIR, 'access_requests.json');
if (!fs.existsSync(REQUESTS_FILE)) {
  fs.writeFileSync(REQUESTS_FILE, JSON.stringify([]));
}

const getLocalRequests = () => {
  try {
    const data = fs.readFileSync(REQUESTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

const saveLocalRequest = (reqObj) => {
  const reqs = getLocalRequests();
  reqs.push(reqObj);
  fs.writeFileSync(REQUESTS_FILE, JSON.stringify(reqs, null, 2));
};

const updateLocalRequestStatus = (id, status) => {
  const reqs = getLocalRequests();
  const idx = reqs.findIndex(r => String(r.id) === String(id));
  if (idx !== -1) {
    reqs[idx].status = status;
    fs.writeFileSync(REQUESTS_FILE, JSON.stringify(reqs, null, 2));
    return reqs[idx];
  }
  return null;
};

// Database Connection
let isMongoConnected = false;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sm_groups';

mongoose.set('strictQuery', true);
mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 3000 })
  .then(async () => {
    console.log('MongoDB connected.');
    isMongoConnected = true;
    try {
      const count = await Course.countDocuments();
      if (count === 0) {
        // Map and insert, stripping default ID for MongoDB
        await Course.insertMany(DEFAULT_COURSES.map(({ id, ...c }) => c));
        console.log('Default courses initialized in MongoDB.');
      }
    } catch (err) {
      console.error('Error initializing default courses:', err);
    }
  })
  .catch(async () => {
    console.log('MongoDB unavailable — using local JSON storage.');
    // Fully disconnect so mongoose timers don't cause the process to exit
    try { await mongoose.disconnect(); } catch (_) { /* ignore */ }
  });

// Helper validation functions
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validatePhone = (phone) => {
  const re = /^[6-9]\d{9}$/; // Standard 10 digit Indian mobile numbers
  return re.test(phone);
};

const sendRegistrationEmail = async (email, fullName, role, password) => {
  console.log(`\n========================================`);
  console.log(`  Registration Email for ${email}`);
  console.log(`  Name: ${fullName}`);
  console.log(`  Role: ${role}`);
  console.log(`  Password: ${password}`);
  console.log(`========================================\n`);

  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (emailUser && emailPass && emailPass !== 'your_gmail_app_password_here') {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: emailUser, pass: emailPass },
      });

      await transporter.sendMail({
        from: `"MBK Technology LMS" <${emailUser}>`,
        to: email,
        subject: 'Welcome to MBK LMS — Registration Successful',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #f8fafc; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0;">
            <div style="background: #e28743; padding: 28px 32px; text-align: center;">
              <h1 style="color: #ffffff; font-size: 22px; margin: 0; letter-spacing: 1px;">MBK TECHNOLOGY LMS</h1>
              <p style="color: rgba(255,255,255,0.8); margin: 6px 0 0; font-size: 13px;">Registration Details</p>
            </div>
            <div style="padding: 32px;">
              <p style="color: #334155; font-size: 15px; margin: 0 0 20px;">Hello ${fullName},</p>
              <p style="color: #334155; font-size: 15px; line-height: 1.6; margin: 0 0 28px;">
                You have been successfully registered in our website <strong>MBK LMS</strong>. Below are your registration details and login credentials:
              </p>
              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px; margin-bottom: 28px;">
                <p style="margin: 0 0 8px; font-size: 14px; color: #64748b;"><strong>Role:</strong> ${role}</p>
                <p style="margin: 0 0 8px; font-size: 14px; color: #64748b;"><strong>Email/Username:</strong> ${email}</p>
                <p style="margin: 0; font-size: 14px; color: #64748b;"><strong>Password:</strong> ${password}</p>
              </div>
              <p style="color: #64748b; font-size: 13px; line-height: 1.6; margin: 0;">
                You can now log in using these credentials. Please keep them secure.
              </p>
            </div>
            <div style="background: #f1f5f9; padding: 16px 32px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #94a3b8; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} MBK Technology. All rights reserved.</p>
            </div>
          </div>
        `,
      });
      console.log(`Registration email sent successfully to ${email}`);
    } catch (emailErr) {
      console.error('Registration email sending failed:', emailErr.message);
    }
  } else {
    console.log('Email credentials not configured — credentials logged to console above.');
  }
};

// Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { role } = req.body;
    const userRole = role || 'student';
    
    const email = req.body.email || req.body.hrEmail;
    const phone = req.body.phone || req.body.hrPhone;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const fullName = req.body.fullName || req.body.companyName || '';
    
    const errors = {};
    if (!fullName || fullName.trim().length < 3) {
      errors.fullName = 'Name or Company Name must be at least 3 characters.';
    }
    if (!email || !validateEmail(email)) {
      errors.email = 'Please provide a valid email address.';
    }
    if (!phone || !validatePhone(phone)) {
      errors.phone = 'Please provide a valid 10-digit mobile number.';
    }
    if (!password || password.length < 8) {
      errors.password = 'Password must be at least 8 characters long.';
    } else if (!/(?=.*[A-Za-z])(?=.*\d)/.test(password)) {
      errors.password = 'Password must contain both letters and numbers.';
    }
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }
    
    if (userRole === 'student') {
      const { gender, year, college, department, district } = req.body;
      if (!gender || !['Male', 'Female', 'Other'].includes(gender)) {
        errors.gender = 'Please select a valid gender.';
      }
      if (!year || !['I Year', 'II Year', 'III Year', 'IV Year'].includes(year)) {
        errors.year = 'Please select your academic year.';
      }
      if (!college || college.trim() === '') {
        errors.college = 'College selection is required.';
      }
      if (!department || department.trim() === '') {
        errors.department = 'Department selection is required.';
      }
      
      const validDistricts = [
        'Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore',
        'Dharmapuri', 'Dindigul', 'Erode', 'Kallakurichi', 'Kanchipuram',
        'Kanniyakumari', 'Karur', 'Krishnagiri', 'Madurai', 'Mayiladuthurai',
        'Nagapattinam', 'Namakkal', 'Nilgiris', 'Perambalur', 'Pudukkottai',
        'Ramanathapuram', 'Ranipet', 'Salem', 'Sivaganga', 'Tenkasi',
        'Thanjavur', 'Theni', 'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli',
        'Tirupathur', 'Tiruppur', 'Tiruvallur', 'Tiruvannamalai', 'Tiruvarur',
        'Vellore', 'Viluppuram', 'Virudhunagar'
      ];
      if (!district || !validDistricts.includes(district)) {
        errors.district = 'Please select a valid district from the list.';
      }
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    const userData = {
      ...req.body,
      fullName,
      email,
      phone,
      role: userRole,
      assignedCourses: [],
      createdAt: new Date()
    };

    // Check if user already exists
    if (isMongoConnected) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ success: false, errors: { email: 'Email is already registered.' } });
      }

      // Create new user in Mongo
      const newUser = new User(userData);
      await newUser.save();
      await sendRegistrationEmail(email, fullName, userRole, password);
      return res.status(201).json({ success: true, message: 'Registration successful!', user: { fullName, email, role: userRole } });
    } else {
      const localUsers = getLocalUsers();
      if (localUsers.some(u => u.email === email)) {
        return res.status(400).json({ success: false, errors: { email: 'Email is already registered.' } });
      }

      saveLocalUser(userData);
      await sendRegistrationEmail(email, fullName, userRole, password);
      return res.status(201).json({ success: true, message: 'Registration successful (stored locally)!', user: { fullName, email, role: userRole } });
    }

  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ success: false, message: 'An internal server error occurred.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`[LOGIN ATTEMPT] Email: "${email}", Password: "${password}"`);

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    // Hardcoded admin account
    if (
      (email === 'admin@smgroups.com' && password === 'admin123') ||
      (email === 'thesmgroups@gmail.com' && (password === 'TSMGPVT@2026' || password === '-n TSMGPVT@2026'))
    ) {
      console.log(`[LOGIN SUCCESS] Admin logged in: ${email}`);
      return res.json({ success: true, message: 'Login successful!', user: { fullName: 'Admin', email: email } });
    }

    if (isMongoConnected) {
      const user = await User.findOne({ email });
      if (!user) {
        console.log(`[LOGIN FAILED] User not found in MongoDB: "${email}"`);
        return res.status(400).json({ success: false, message: 'Invalid email or password.' });
      }
      // Trigger nodemon reload for port release
      console.log(`[LOGIN DB COMPARISON] Stored Password: "${user.password}", Input Password: "${password}"`);
      if (user.password !== password) {
        console.log(`[LOGIN FAILED] Password mismatch for: "${email}"`);
        return res.status(400).json({ success: false, message: 'Invalid email or password.' });
      }
      console.log(`[LOGIN SUCCESS] User logged in: ${email}`);
      return res.json({ success: true, message: 'Login successful!', user: { fullName: user.fullName, email: user.email, college: user.college, department: user.department, role: user.role } });
    } else {
      const localUsers = getLocalUsers();
      const user = localUsers.find(u => u.email === email);
      if (!user) {
        console.log(`[LOGIN FAILED] User not found locally: "${email}"`);
        return res.status(400).json({ success: false, message: 'Invalid email or password.' });
      }
      console.log(`[LOGIN LOCAL COMPARISON] Stored Password: "${user.password}", Input Password: "${password}"`);
      if (user.password !== password) {
        console.log(`[LOGIN FAILED] Local password mismatch for: "${email}"`);
        return res.status(400).json({ success: false, message: 'Invalid email or password.' });
      }
      console.log(`[LOGIN SUCCESS] Local user logged in: ${email}`);
      return res.json({ success: true, message: 'Login successful!', user: { fullName: user.fullName, email: user.email, college: user.college, department: user.department, role: user.role } });
    }
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'An internal server error occurred.' });
  }
});

// File Upload helper functions
const saveUploadedFile = (base64Data, originalName) => {
  if (!base64Data || !originalName) return null;
  try {
    if (base64Data.startsWith('/uploads/')) {
      return base64Data;
    }
    const matches = base64Data.match(/^data:(.+);base64,(.+)$/);
    if (!matches) return null;
    const buffer = Buffer.from(matches[2], 'base64');
    const filename = `${Date.now()}_${originalName.replace(/\s+/g, '_')}`;
    const filePath = path.join(UPLOADS_DIR, filename);
    fs.writeFileSync(filePath, buffer);
    return `/uploads/${filename}`;
  } catch (err) {
    console.error('Error saving uploaded file:', err);
    return null;
  }
};

const deleteUploadedFile = (fileUrl) => {
  if (!fileUrl || !fileUrl.startsWith('/uploads/')) return;
  try {
    const filename = path.basename(fileUrl);
    const filePath = path.join(UPLOADS_DIR, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    console.error('Error deleting file:', err);
  }
};

// Course Endpoints
app.get('/api/courses', async (req, res) => {
  try {
    if (isMongoConnected) {
      const courses = await Course.find({}).sort({ createdAt: -1 });
      return res.json({ success: true, courses });
    } else {
      const courses = getLocalCourses();
      return res.json({ success: true, courses });
    }
  } catch (err) {
    console.error('Error fetching courses:', err);
    res.status(500).json({ success: false, message: 'Server error fetching courses.' });
  }
});

app.post('/api/admin/courses', async (req, res) => {
  try {
    const { title, name, price, description, image, imageFile, content, ppt, pptFile, video, videoFile, programType } = req.body;
    const finalContent = content || description || 'No description provided';
    if (!title || !finalContent) {
      return res.status(400).json({ success: false, message: 'Title and content/description are required.' });
    }

    const imagePath = saveUploadedFile(image, imageFile);
    const pptPath = saveUploadedFile(ppt, pptFile);
    const videoPath = saveUploadedFile(video, videoFile);

    const courseData = {
      title,
      name: name || '',
      price: price || '',
      description: description || '',
      image: imagePath || '',
      content: finalContent,
      ppt: pptPath || '',
      pptName: pptFile || '',
      video: videoPath || '',
      videoName: videoFile || '',
      programType: programType || 'Student Development Program',
      createdAt: new Date()
    };

    if (isMongoConnected) {
      const newCourse = new Course(courseData);
      await newCourse.save();
      return res.status(201).json({ success: true, message: 'Course created successfully!', course: newCourse });
    } else {
      const localCourses = getLocalCourses();
      const newId = String(localCourses.length > 0 ? Math.max(...localCourses.map(c => Number(c.id || 0))) + 1 : 1);
      const newCourse = { id: newId, ...courseData };
      localCourses.push(newCourse);
      saveLocalCourses(localCourses);
      return res.status(201).json({ success: true, message: 'Course created locally!', course: newCourse });
    }
  } catch (err) {
    console.error('Error creating course:', err);
    res.status(500).json({ success: false, message: 'Server error creating course.' });
  }
});

app.put('/api/admin/courses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, name, price, description, image, imageFile, content, ppt, pptFile, video, videoFile, programType } = req.body;
    const finalContent = content || description || 'No description provided';

    if (!title || !finalContent) {
      return res.status(400).json({ success: false, message: 'Title and content/description are required.' });
    }

    if (isMongoConnected) {
      const existing = await Course.findById(id);
      if (!existing) {
        return res.status(404).json({ success: false, message: 'Course not found.' });
      }

      const imagePath = image && image.startsWith('/uploads/') ? image : saveUploadedFile(image, imageFile);
      if (image && !image.startsWith('/uploads/') && existing.image) {
        deleteUploadedFile(existing.image);
      }

      const pptPath = ppt && ppt.startsWith('/uploads/') ? ppt : saveUploadedFile(ppt, pptFile);
      if (ppt && !ppt.startsWith('/uploads/') && existing.ppt) {
        deleteUploadedFile(existing.ppt);
      }

      const videoPath = video && video.startsWith('/uploads/') ? video : saveUploadedFile(video, videoFile);
      if (video && !video.startsWith('/uploads/') && existing.video) {
        deleteUploadedFile(existing.video);
      }

      existing.title = title;
      existing.name = name || '';
      existing.price = price || '';
      existing.description = description || '';
      existing.image = imagePath || existing.image;
      existing.content = finalContent;
      existing.ppt = pptPath || existing.ppt;
      existing.pptName = pptFile || existing.pptName;
      existing.video = videoPath || existing.video;
      existing.videoName = videoFile || existing.videoName;
      existing.programType = programType || existing.programType || 'Student Development Program';

      await existing.save();
      return res.json({ success: true, message: 'Course updated successfully!', course: existing });
    } else {
      const localCourses = getLocalCourses();
      const idx = localCourses.findIndex(c => String(c.id) === String(id));
      if (idx === -1) {
        return res.status(404).json({ success: false, message: 'Course not found.' });
      }

      const existing = localCourses[idx];

      const imagePath = image && image.startsWith('/uploads/') ? image : saveUploadedFile(image, imageFile);
      if (image && !image.startsWith('/uploads/') && existing.image) {
        deleteUploadedFile(existing.image);
      }

      const pptPath = ppt && ppt.startsWith('/uploads/') ? ppt : saveUploadedFile(ppt, pptFile);
      if (ppt && !ppt.startsWith('/uploads/') && existing.ppt) {
        deleteUploadedFile(existing.ppt);
      }

      const videoPath = video && video.startsWith('/uploads/') ? video : saveUploadedFile(video, videoFile);
      if (video && !video.startsWith('/uploads/') && existing.video) {
        deleteUploadedFile(existing.video);
      }

      localCourses[idx] = {
        ...existing,
        title,
        name: name || '',
        price: price || '',
        description: description || '',
        image: imagePath || existing.image,
        content: finalContent,
        ppt: pptPath || existing.ppt,
        pptName: pptFile || existing.pptName,
        video: videoPath || existing.video,
        videoName: videoFile || existing.videoName,
        programType: programType || existing.programType || 'Student Development Program'
      };

      saveLocalCourses(localCourses);
      return res.json({ success: true, message: 'Course updated locally!', course: localCourses[idx] });
    }
  } catch (err) {
    console.error('Error updating course:', err);
    res.status(500).json({ success: false, message: 'Server error updating course.' });
  }
});

app.delete('/api/admin/courses/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (isMongoConnected) {
      const deleted = await Course.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Course not found.' });
      }
      deleteUploadedFile(deleted.image);
      deleteUploadedFile(deleted.ppt);
      deleteUploadedFile(deleted.video);
      return res.json({ success: true, message: 'Course deleted successfully!' });
    } else {
      const localCourses = getLocalCourses();
      const idx = localCourses.findIndex(c => String(c.id) === String(id));
      if (idx === -1) {
        return res.status(404).json({ success: false, message: 'Course not found.' });
      }
      const deleted = localCourses.splice(idx, 1)[0];
      saveLocalCourses(localCourses);

      deleteUploadedFile(deleted.image);
      deleteUploadedFile(deleted.ppt);
      deleteUploadedFile(deleted.video);
      return res.json({ success: true, message: 'Course deleted locally!' });
    }
  } catch (err) {
    console.error('Error deleting course:', err);
    res.status(500).json({ success: false, message: 'Server error deleting course.' });
  }
});

// Public endpoint to retrieve all registered trainers
app.get('/api/trainers', async (req, res) => {
  try {
    if (isMongoConnected) {
      const trainers = await User.find({ role: 'trainer' }, '-password');
      return res.json({ success: true, trainers });
    } else {
      const localUsers = getLocalUsers();
      const trainers = localUsers.filter(u => u.role === 'trainer').map(({ password, ...u }) => u);
      return res.json({ success: true, trainers });
    }
  } catch (err) {
    console.error('Error fetching trainers:', err);
    res.status(500).json({ success: false, message: 'Server error fetching trainers.' });
  }
});

// Student/Trainer/Company profile retrieval with masking controls
app.get('/api/users/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const { requester } = req.query; // email of the person requesting the view
    
    let user;
    if (isMongoConnected) {
      const dbUser = await User.findOne({ email }, '-password');
      if (dbUser) user = dbUser.toObject();
    } else {
      const localUsers = getLocalUsers();
      const found = localUsers.find(u => u.email === email);
      if (found) {
        const { password, ...u } = found;
        user = u;
      }
    }
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    
    // Check authorization
    let isAuthorized = false;
    const adminEmails = ['admin@smgroups.com', 'thesmgroups@gmail.com'];
    if (!requester || requester === email || adminEmails.includes(requester)) {
      isAuthorized = true;
    } else {
      // Check if approved access request exists
      if (isMongoConnected) {
        const approved = await AccessRequest.findOne({ requesterEmail: requester, targetEmail: email, status: 'Approved' });
        if (approved) isAuthorized = true;
      } else {
        const localRequests = getLocalRequests();
        const approved = localRequests.find(r => r.requesterEmail === requester && r.targetEmail === email && r.status === 'Approved');
        if (approved) isAuthorized = true;
      }
    }
    
    if (!isAuthorized) {
      // Mask private details
      const maskedUser = {
        ...user,
        fullName: user.fullName || user.companyName || 'Anonymous User',
        role: user.role || 'student',
        // Mask details
        email: '••••••••@••••.•••',
        originalEmail: user.email,
        phone: '••••••••••',
        hrPhone: '••••••••••',
        hrEmail: '••••••••@••••.•••',
        address: 'Hidden (Request Access)',
        resume: 'Hidden (Request Access)',
        expCertificate: 'Hidden (Request Access)',
        aadharCard: 'Hidden (Request Access)',
        panCard: 'Hidden (Request Access)',
        bankDetails: 'Hidden (Request Access)',
        regCertificate: 'Hidden (Request Access)',
        gstCertificate: 'Hidden (Request Access)',
        signatureAgreement: 'Hidden (Request Access)',
        isMasked: true
      };
      
      // Determine access request status
      let reqStatus = 'None';
      if (isMongoConnected) {
        const foundReq = await AccessRequest.findOne({ requesterEmail: requester, targetEmail: email });
        if (foundReq) reqStatus = foundReq.status;
      } else {
        const localRequests = getLocalRequests();
        const foundReq = localRequests.find(r => r.requesterEmail === requester && r.targetEmail === email);
        if (foundReq) reqStatus = foundReq.status;
      }
      maskedUser.accessRequestStatus = reqStatus;
      
      return res.json({ success: true, user: maskedUser });
    }
    
    return res.json({ success: true, user: { ...user, originalEmail: user.email, isMasked: false, accessRequestStatus: 'Approved' } });
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ success: false, message: 'Server error fetching profile.' });
  }
});

app.put('/api/users/:email/profile', async (req, res) => {
  try {
    const { email } = req.params;
    const { fullName, phone, gender, year, district, college, department } = req.body;
    
    const updateData = { fullName, phone, gender, year, district, college, department };

    if (isMongoConnected) {
      const updated = await User.findOneAndUpdate(
        { email },
        updateData,
        { new: true }
      );
      if (!updated) return res.status(404).json({ success: false, message: 'User not found.' });
      return res.json({ success: true, message: 'Profile updated successfully!', user: updated });
    } else {
      const localUsers = getLocalUsers();
      const index = localUsers.findIndex(u => u.email === email);
      if (index === -1) return res.status(404).json({ success: false, message: 'User not found.' });
      
      localUsers[index] = {
        ...localUsers[index],
        ...updateData
      };
      fs.writeFileSync(USERS_FILE, JSON.stringify(localUsers, null, 2));
      return res.json({ success: true, message: 'Profile updated locally!', user: localUsers[index] });
    }
  } catch (err) {
    console.error('Error updating user profile:', err);
    res.status(500).json({ success: false, message: 'Server error updating profile.' });
  }
});

// Directory listing endpoint for user dashboard
app.get('/api/directory', async (req, res) => {
  try {
    if (isMongoConnected) {
      const users = await User.find({}, '-password');
      return res.json({ success: true, users });
    } else {
      const localUsers = getLocalUsers();
      const users = localUsers.map(({ password, ...u }) => u);
      return res.json({ success: true, users });
    }
  } catch (err) {
    console.error('Error fetching directory:', err);
    res.status(500).json({ success: false, message: 'Server error fetching directory.' });
  }
});

// Access request submission endpoint
app.post('/api/access-requests', async (req, res) => {
  try {
    const { requesterEmail, targetEmail, requesterName, targetName, requesterRole, targetRole } = req.body;
    if (!requesterEmail || !targetEmail) {
      return res.status(400).json({ success: false, message: 'Requester and target emails are required.' });
    }

    const newRequest = {
      requesterEmail,
      targetEmail,
      requesterName: requesterName || requesterEmail,
      targetName: targetName || targetEmail,
      requesterRole: requesterRole || 'student',
      targetRole: targetRole || 'student',
      status: 'Pending',
      createdAt: new Date()
    };

    if (isMongoConnected) {
      // Check if request already exists
      const existing = await AccessRequest.findOne({ requesterEmail, targetEmail });
      if (existing) {
        return res.status(400).json({ success: false, message: 'Access request already exists.' });
      }
      const dbReq = new AccessRequest(newRequest);
      await dbReq.save();
      return res.status(201).json({ success: true, message: 'Access request submitted successfully!', request: dbReq });
    } else {
      const localRequests = getLocalRequests();
      const existing = localRequests.find(r => r.requesterEmail === requesterEmail && r.targetEmail === targetEmail);
      if (existing) {
        return res.status(400).json({ success: false, message: 'Access request already exists.' });
      }
      const newId = `req_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      const reqObj = { id: newId, ...newRequest };
      saveLocalRequest(reqObj);
      return res.status(201).json({ success: true, message: 'Access request submitted locally!', request: reqObj });
    }
  } catch (err) {
    console.error('Error creating access request:', err);
    res.status(500).json({ success: false, message: 'Server error submitting access request.' });
  }
});

// Profile view notification logging endpoint
app.post('/api/users/:email/view-profile', async (req, res) => {
  try {
    const { email } = req.params; // target user email
    const { viewerEmail, viewerName, viewerRole } = req.body;
    if (!email || !viewerEmail) {
      return res.status(400).json({ success: false, message: 'Target and viewer emails are required.' });
    }

    const notification = {
      id: `view_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      sender: 'System Alert',
      text: `${viewerName || viewerEmail} (${viewerRole || 'user'}) viewed your profile.`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString(),
      createdAt: new Date()
    };

    if (isMongoConnected) {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
      
      const notifications = user.get('notifications') || [];
      notifications.unshift(notification);
      user.set('notifications', notifications);
      await user.save();
      
      return res.json({ success: true, message: 'Profile view notification logged.' });
    } else {
      const localUsers = getLocalUsers();
      const user = localUsers.find(u => u.email === email);
      if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
      
      user.notifications = user.notifications || [];
      user.notifications.unshift(notification);
      fs.writeFileSync(USERS_FILE, JSON.stringify(localUsers, null, 2));
      
      return res.json({ success: true, message: 'Profile view notification logged locally.' });
    }
  } catch (err) {
    console.error('Error logging profile view:', err);
    res.status(500).json({ success: false, message: 'Server error logging profile view.' });
  }
});

// Admin endpoint to view access requests
app.get('/api/admin/access-requests', async (req, res) => {
  try {
    if (isMongoConnected) {
      const requests = await AccessRequest.find({}).sort({ createdAt: -1 });
      return res.json({ success: true, requests });
    } else {
      const requests = getLocalRequests().reverse();
      return res.json({ success: true, requests });
    }
  } catch (err) {
    console.error('Error fetching access requests:', err);
    res.status(500).json({ success: false, message: 'Server error fetching requests.' });
  }
});

// Admin endpoint to update access request status (approve/reject)
app.put('/api/admin/access-requests/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'Approved' or 'Rejected'

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status update.' });
    }

    if (isMongoConnected) {
      const updated = await AccessRequest.findByIdAndUpdate(id, { status }, { new: true });
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Access request not found.' });
      }
      return res.json({ success: true, message: `Request successfully ${status.toLowerCase()}!`, request: updated });
    } else {
      const updated = updateLocalRequestStatus(id, status);
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Access request not found.' });
      }
      return res.json({ success: true, message: `Request successfully ${status.toLowerCase()} locally!`, request: updated });
    }
  } catch (err) {
    console.error('Error updating access request:', err);
    res.status(500).json({ success: false, message: 'Server error updating request status.' });
  }
});

// Admin endpoints
app.get('/api/admin/users', async (req, res) => {
  try {
    if (isMongoConnected) {
      const users = await User.find({}, '-password');
      return res.json({ success: true, users });
    } else {
      const localUsers = getLocalUsers();
      // Exclude passwords
      const users = localUsers.map(({ password, ...u }) => u);
      return res.json({ success: true, users });
    }
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ success: false, message: 'Server error fetching students.' });
  }
});

app.put('/api/admin/users/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const { fullName, phone, gender, year, district, college, department, isApproved, status } = req.body;
    
    const updateData = {};
    if (fullName !== undefined) updateData.fullName = fullName;
    if (phone !== undefined) updateData.phone = phone;
    if (gender !== undefined) updateData.gender = gender;
    if (year !== undefined) updateData.year = year;
    if (district !== undefined) updateData.district = district;
    if (college !== undefined) updateData.college = college;
    if (department !== undefined) updateData.department = department;
    if (isApproved !== undefined) updateData.isApproved = isApproved;
    if (status !== undefined) updateData.status = status;

    if (isMongoConnected) {
      const updated = await User.findOneAndUpdate(
        { email },
        updateData,
        { new: true }
      );
      if (!updated) return res.status(404).json({ success: false, message: 'User not found.' });
      return res.json({ success: true, message: 'User updated successfully!', user: updated });
    } else {
      const localUsers = getLocalUsers();
      const index = localUsers.findIndex(u => u.email === email);
      if (index === -1) return res.status(404).json({ success: false, message: 'User not found.' });
      
      localUsers[index] = {
        ...localUsers[index],
        ...updateData
      };
      fs.writeFileSync(USERS_FILE, JSON.stringify(localUsers, null, 2));
      return res.json({ success: true, message: 'User updated locally!', user: localUsers[index] });
    }
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ success: false, message: 'Server error updating user.' });
  }
});

app.delete('/api/admin/users/:email', async (req, res) => {
  try {
    const { email } = req.params;
    if (isMongoConnected) {
      const deleted = await User.findOneAndDelete({ email });
      if (!deleted) return res.status(404).json({ success: false, message: 'Student not found.' });
      return res.json({ success: true, message: 'Student deleted successfully!' });
    } else {
      const localUsers = getLocalUsers();
      const index = localUsers.findIndex(u => u.email === email);
      if (index === -1) return res.status(404).json({ success: false, message: 'Student not found.' });
      
      localUsers.splice(index, 1);
      fs.writeFileSync(USERS_FILE, JSON.stringify(localUsers, null, 2));
      return res.json({ success: true, message: 'Student deleted locally!' });
    }
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ success: false, message: 'Server error deleting student.' });
  }
});

app.post('/api/admin/users/:email/assign', async (req, res) => {
  try {
    const { email } = req.params;
    const { courses } = req.body; // array of courses
    
    if (isMongoConnected) {
      const updated = await User.findOneAndUpdate(
        { email },
        { assignedCourses: courses },
        { new: true }
      );
      if (!updated) return res.status(404).json({ success: false, message: 'Student not found.' });
      return res.json({ success: true, message: 'Courses assigned successfully!', courses: updated.assignedCourses });
    } else {
      const localUsers = getLocalUsers();
      const index = localUsers.findIndex(u => u.email === email);
      if (index === -1) return res.status(404).json({ success: false, message: 'Student not found.' });
      
      localUsers[index].assignedCourses = courses;
      fs.writeFileSync(USERS_FILE, JSON.stringify(localUsers, null, 2));
      return res.json({ success: true, message: 'Courses assigned locally!', courses: localUsers[index].assignedCourses });
    }
  } catch (err) {
    console.error('Error assigning courses:', err);
    res.status(500).json({ success: false, message: 'Server error assigning courses.' });
  }
});

app.post('/api/users/buy-course', async (req, res) => {
  try {
    const { email, courseTitle } = req.body;
    if (!email || !courseTitle) {
      return res.status(400).json({ success: false, message: 'Email and course title are required.' });
    }

    if (isMongoConnected) {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

      if (!user.assignedCourses) {
        user.assignedCourses = [];
      }

      if (user.assignedCourses.includes(courseTitle)) {
        return res.status(400).json({ success: false, message: 'Course is already owned/assigned.' });
      }

      user.assignedCourses.push(courseTitle);
      await user.save();
      return res.json({ success: true, message: 'Course purchased successfully!', courses: user.assignedCourses });
    } else {
      const localUsers = getLocalUsers();
      const index = localUsers.findIndex(u => u.email === email);
      if (index === -1) return res.status(404).json({ success: false, message: 'User not found.' });

      if (!localUsers[index].assignedCourses) {
        localUsers[index].assignedCourses = [];
      }

      if (localUsers[index].assignedCourses.includes(courseTitle)) {
        return res.status(400).json({ success: false, message: 'Course is already owned/assigned.' });
      }

      localUsers[index].assignedCourses.push(courseTitle);
      fs.writeFileSync(USERS_FILE, JSON.stringify(localUsers, null, 2));
      return res.json({ success: true, message: 'Course purchased successfully (stored locally)!', courses: localUsers[index].assignedCourses });
    }
  } catch (err) {
    console.error('Error buying course:', err);
    res.status(500).json({ success: false, message: 'Server error buying course.' });
  }
});

// ============================================================
// PASSWORD RESET — OTP via Email
// ============================================================

// In-memory OTP store  { email -> { code, expiresAt } }
const otpStore = {};

// POST /api/auth/send-otp
app.post('/api/auth/send-otp', async (req, res) => {
  try {
    const { email, phone, isRegister } = req.body;
    const identifier = email || phone;
    if (!identifier) {
      return res.status(400).json({ success: false, message: 'Email or Phone is required.' });
    }

    // Check that this email/phone exists in the system
    let userExists = false;
    if (isMongoConnected) {
      const query = email ? { email } : { phone };
      const user = await User.findOne(query);
      userExists = !!user;
    } else {
      const localUsers = getLocalUsers();
      userExists = localUsers.some(u => email ? u.email === email : u.phone === phone);
    }

    // Also allow admin emails to reset
    const adminEmails = ['admin@smgroups.com', 'thesmgroups@gmail.com'];
    if (email && adminEmails.includes(email)) userExists = true;

    if (isRegister) {
      if (userExists) {
        return res.status(400).json({ success: false, message: `${email ? 'Email' : 'Phone number'} is already registered.` });
      }
    } else {
      if (!userExists) {
        return res.status(404).json({ success: false, message: `No account found with this ${email ? 'email' : 'phone number'}.` });
      }
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
    otpStore[identifier] = { code: otp, expiresAt };

    // Always log OTP to console so it can be used during development
    console.log(`\n========================================`);
    console.log(`  OTP for ${email}: ${otp}`);
    console.log(`  Valid for 10 minutes`);
    console.log(`========================================\n`);

    // Try to send email (best-effort — works without credentials too)
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;
    let emailSent = false;

    if (emailUser && emailPass && emailPass !== 'your_gmail_app_password_here') {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: { user: emailUser, pass: emailPass },
        });

        const isRegisterFlow = !!isRegister;
        const emailSubject = isRegisterFlow 
          ? 'Your Email Verification Code — MBK Technology LMS' 
          : 'Your Password Reset OTP — MBK Technology LMS';
        const emailHeading = isRegisterFlow
          ? 'Email Verification'
          : 'Password Reset Request';
        const emailText = isRegisterFlow
          ? 'We received a request to verify your email for registration. Use the verification code below to complete your registration. This code is valid for <strong>10 minutes</strong>.'
          : 'We received a request to reset your password. Use the verification code below to proceed. This code is valid for <strong>10 minutes</strong>.';
        const emailFooterText = isRegisterFlow
          ? 'If you did not request email verification, you can safely ignore this email.'
          : 'If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.';

        await transporter.sendMail({
          from: `"MBK Technology LMS" <${emailUser}>`,
          to: email,
          subject: emailSubject,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #f8fafc; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0;">
              <div style="background: #e28743; padding: 28px 32px; text-align: center;">
                <h1 style="color: #ffffff; font-size: 22px; margin: 0; letter-spacing: 1px;">MBK TECHNOLOGY LMS</h1>
                <p style="color: rgba(255,255,255,0.8); margin: 6px 0 0; font-size: 13px;">${emailHeading}</p>
              </div>
              <div style="padding: 32px;">
                <p style="color: #334155; font-size: 15px; margin: 0 0 20px;">Hello,</p>
                <p style="color: #334155; font-size: 15px; line-height: 1.6; margin: 0 0 28px;">
                  ${emailText}
                </p>
                <div style="background: #ffffff; border: 2px dashed #e28743; border-radius: 10px; padding: 24px; text-align: center; margin-bottom: 28px;">
                  <p style="color: #94a3b8; font-size: 12px; letter-spacing: 2px; margin: 0 0 8px; text-transform: uppercase; font-weight: 600;">Your Verification Code</p>
                  <p style="color: #e28743; font-size: 40px; font-weight: 800; letter-spacing: 10px; margin: 0;">${otp}</p>
                </div>
                <p style="color: #64748b; font-size: 13px; line-height: 1.6; margin: 0;">
                  ${emailFooterText}
                </p>
              </div>
              <div style="background: #f1f5f9; padding: 16px 32px; text-align: center; border-top: 1px solid #e2e8f0;">
                <p style="color: #94a3b8; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} MBK Technology. All rights reserved.</p>
              </div>
            </div>
          `,
        });
        emailSent = true;
        console.log(`Email sent successfully to ${email}`);
      } catch (emailErr) {
        console.error('Email sending failed (OTP still valid):', emailErr.message);
      }
    } else {
      console.log('Email credentials not configured — OTP logged to console above. Set EMAIL_USER and EMAIL_PASS in .env to enable email delivery.');
    }

    const message = emailSent
      ? 'Verification code sent to your email!'
      : 'Verification code generated! Check the server console for the code.';

    return res.json({ success: true, message, emailSent });
  } catch (err) {
    console.error('Send OTP error:', err);
    return res.status(500).json({ success: false, message: 'Server error generating OTP.' });
  }
});

// POST /api/auth/verify-otp
app.post('/api/auth/verify-otp', (req, res) => {
  try {
    const { email, phone, otp } = req.body;
    const identifier = email || phone;
    if (!identifier || !otp) {
      return res.status(400).json({ success: false, message: 'Identifier and OTP are required.' });
    }

    const record = otpStore[identifier];
    if (!record) {
      return res.status(400).json({ success: false, message: 'OTP not found. Please request a new one.' });
    }
    if (Date.now() > record.expiresAt) {
      delete otpStore[identifier];
      return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
    }
    if (record.code !== otp.toString().trim()) {
      return res.status(400).json({ success: false, message: 'Incorrect OTP. Please try again.' });
    }

    // Mark OTP as verified (keep entry but flag it so reset can proceed)
    otpStore[identifier].verified = true;
    return res.json({ success: true, message: 'OTP verified successfully.' });
  } catch (err) {
    console.error('Verify OTP error:', err);
    return res.status(500).json({ success: false, message: 'Server error during OTP verification.' });
  }
});

// POST /api/auth/reset-password
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ success: false, message: 'Email and new password are required.' });
    }

    const record = otpStore[email];
    if (!record || !record.verified) {
      return res.status(403).json({ success: false, message: 'OTP not verified. Please complete verification first.' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long.' });
    }
    if (!/(?=.*[A-Za-z])(?=.*\d)/.test(newPassword)) {
      return res.status(400).json({ success: false, message: 'Password must contain both letters and numbers.' });
    }

    // Update password
    if (isMongoConnected) {
      const updated = await User.findOneAndUpdate({ email }, { password: newPassword }, { new: true });
      if (!updated) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }
    } else {
      const localUsers = getLocalUsers();
      const index = localUsers.findIndex(u => u.email === email);
      if (index !== -1) {
        localUsers[index].password = newPassword;
        fs.writeFileSync(USERS_FILE, JSON.stringify(localUsers, null, 2));
      }
    }

    // Clear OTP record
    delete otpStore[email];

    return res.json({ success: true, message: 'Password reset successfully.' });
  } catch (err) {
    console.error('Reset password error:', err);
    return res.status(500).json({ success: false, message: 'Server error resetting password.' });
  }
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Keep the process alive — prevents Node from exiting when mongoose disconnects
server.on('error', (err) => {
  console.error('Server error:', err);
});

// Heartbeat to keep the event loop alive (mongoose disconnect can drain it)
setInterval(() => {}, 1000 * 60 * 30); // 30-min no-op timer
