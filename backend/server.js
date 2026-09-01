const express = require('express');
const cors = require('cors');
const fs = require('fs');
const bcrypt = require('bcrypt');
const path = require('path');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const http = require('http');
const { Server } = require('socket.io');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const dotenv = require('dotenv');
const envConfig = dotenv.parse(fs.readFileSync('.env'));
for (const k in envConfig) {
  process.env[k] = envConfig[k];
}

const app = express();

// Configure Nodemailer Transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: process.env.SMTP_PORT || 587,
  auth: {
    user: process.env.SMTP_USER || 'test@ethereal.email',
    pass: process.env.SMTP_PASS || 'testpass'
  }
});

const sendWelcomeEmail = async (userEmail, courseTitle) => {
  try {
    if (!process.env.SMTP_USER) {
      console.log(`[Mock Email] Welcome email for course "${courseTitle}" sent to ${userEmail}`);
      return;
    }
    await transporter.sendMail({
      from: '"LMS Platform" <noreply@lms.com>',
      to: userEmail,
      subject: `Welcome to ${courseTitle}! 🎓`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #4F46E5;">Welcome to the Course!</h2>
          <p>Hi there,</p>
          <p>Thank you for enrolling in <strong>${courseTitle}</strong>.</p>
          <p>You can now access all the modules and start learning right away from your dashboard.</p>
          <p>Happy Learning!</p>
          <p>Best,<br>The LMS Team</p>
        </div>
      `
    });
    console.log(`Welcome email sent to ${userEmail}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
const PORT = process.env.PORT || 5000;
const httpServer = http.createServer(app);

// Socket.io Setup
const io = new Server(httpServer, {
  cors: {
    origin: true,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // Join a room based on class ID
  socket.on('join_class_room', (classId) => {
    socket.join(classId);
    console.log(`Socket ${socket.id} joined room ${classId}`);
  });

  // Student requests to join
  socket.on('join_request', (data) => {
    // data should contain { classId, studentId, studentName, studentEmail }
    console.log('join_request', data);
    // Broadcast to the room (trainer will receive this)
    socket.to(data.classId).emit('student_waiting', { ...data, socketId: socket.id });
  });

  // Trainer admits student
  socket.on('admit_student', (data) => {
    // data should contain { socketId, meetingLink }
    console.log('admit_student', data);
    io.to(data.socketId).emit('admitted', { meetingLink: data.meetingLink });
  });

  // Trainer denies student
  socket.on('deny_student', (data) => {
    // data should contain { socketId }
    console.log('deny_student', data);
    io.to(data.socketId).emit('denied');
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

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
const LIVE_CLASSES_FILE = path.join(DATA_DIR, 'liveClasses.json');
const ACTIVITY_FILE = path.join(DATA_DIR, 'activities.json');
const ASSIGNMENTS_FILE = path.join(DATA_DIR, 'assignments.json');
const CERTIFICATES_FILE = path.join(DATA_DIR, 'certificates.json');
const COMPANY_COURSES_FILE = path.join(DATA_DIR, 'companyCourses.json');

const DEFAULT_COURSES = [
  { id: '1', title: 'Embedded Systems', content: 'Learn the fundamentals of Embedded Systems, microcontrollers, assembly, and C programming for hardware interfaces.', image: '', ppt: '', pptName: '', video: '', videoName: '' },
  { id: '2', title: 'Electric Vechicle', content: 'Explore Electric Vehicle powertrain, battery management systems, motor control, and EV architecture.', image: '', ppt: '', pptName: '', video: '', videoName: '' },
  { id: '3', title: 'MERN Stack Development', content: 'Master MongoDB, Express.js, React, and Node.js to build modern, full-stack web applications.', image: '', ppt: '', pptName: '', video: '', videoName: '' },
  { id: '4', title: 'IoT & Sensor Networks', content: 'Build smart connected devices using sensor technology, wireless protocols, and cloud platforms.', image: '', ppt: '', pptName: '', video: '', videoName: '' },
  { id: '5', title: 'Python for Data Science', content: 'Learn core Python concepts, data analysis with NumPy/Pandas, and visualization tools.', image: '', ppt: '', pptName: '', video: '', videoName: '' },
  { id: '6', title: 'Machine Learning Fundamentals', content: 'Introduction to supervised and unsupervised machine learning algorithms, training models, and validation.', image: '', ppt: '', pptName: '', video: '', videoName: '' },
  { id: '7', title: 'Cloud Computing', content: 'Deploy and maintain scalable web architectures on Amazon Web Services cloud infrastructure.', image: '', ppt: '', pptName: '', video: '', videoName: '' },
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
if (!fs.existsSync(LIVE_CLASSES_FILE)) {
  fs.writeFileSync(LIVE_CLASSES_FILE, JSON.stringify([]));
}
if (!fs.existsSync(ACTIVITY_FILE)) {
  fs.writeFileSync(ACTIVITY_FILE, JSON.stringify([]));
}
if (!fs.existsSync(ASSIGNMENTS_FILE)) {
  fs.writeFileSync(ASSIGNMENTS_FILE, JSON.stringify([]));
}
if (!fs.existsSync(CERTIFICATES_FILE)) {
  fs.writeFileSync(CERTIFICATES_FILE, JSON.stringify([]));
}
if (!fs.existsSync(COMPANY_COURSES_FILE)) {
  fs.writeFileSync(COMPANY_COURSES_FILE, JSON.stringify([]));
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

function formatAMPM(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; 
  minutes = minutes < 10 ? '0' + minutes : minutes;
  return hours + ':' + minutes + ' ' + ampm;
}

function generateSchedule(startDateStr, dailyStartTime, totalHours, days) {
  const schedule = [];
  if (!startDateStr || !dailyStartTime || !totalHours || !days) return schedule;

  const hoursPerDay = Number(totalHours) / Number(days);
  let currentStart = new Date(startDateStr);
  if (isNaN(currentStart.getTime())) return schedule;

  let startHour = 10;
  let startMin = 0;
  const timeMatch = dailyStartTime.match(/(\d+):(\d+)\s*(AM|PM)?/i);
  if (timeMatch) {
    startHour = parseInt(timeMatch[1], 10);
    startMin = parseInt(timeMatch[2], 10);
    const ampm = timeMatch[3] ? timeMatch[3].toUpperCase() : null;
    if (ampm === 'PM' && startHour < 12) startHour += 12;
    if (ampm === 'AM' && startHour === 12) startHour = 0;
  }

  for (let i = 1; i <= days; i++) {
    const d = new Date(currentStart);
    d.setDate(d.getDate() + (i - 1));

    const dStart = new Date(d);
    dStart.setHours(startHour, startMin, 0);
    const startStr = formatAMPM(dStart);

    const dEnd = new Date(dStart);
    dEnd.setMinutes(dEnd.getMinutes() + hoursPerDay * 60);
    const endStr = formatAMPM(dEnd);

    schedule.push({
      dayNumber: i,
      date: d, // ISO format for easy rendering on frontend
      startTime: startStr,
      endTime: endStr,
      durationHours: hoursPerDay,
      status: 'Upcoming'
    });
  }
  return schedule;
}

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

const getLocalLiveClasses = () => {
  try {
    const data = fs.readFileSync(LIVE_CLASSES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

const saveLocalLiveClasses = (classes) => {
  fs.writeFileSync(LIVE_CLASSES_FILE, JSON.stringify(classes, null, 2));
};

const getLocalActivities = () => {
  try {
    const data = fs.readFileSync(ACTIVITY_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

const saveLocalActivities = (activities) => {
  fs.writeFileSync(ACTIVITY_FILE, JSON.stringify(activities, null, 2));
};

const getLocalAssignments = () => {
  try { return JSON.parse(fs.readFileSync(ASSIGNMENTS_FILE, 'utf8')); } catch (err) { return []; }
};
const saveLocalAssignments = (data) => {
  fs.writeFileSync(ASSIGNMENTS_FILE, JSON.stringify(data, null, 2));
};

const getLocalCertificates = () => {
  try { return JSON.parse(fs.readFileSync(CERTIFICATES_FILE, 'utf8')); } catch (err) { return []; }
};
const saveLocalCertificates = (data) => {
  fs.writeFileSync(CERTIFICATES_FILE, JSON.stringify(data, null, 2));
};

const getLocalCompanyCourses = () => {
  try { return JSON.parse(fs.readFileSync(COMPANY_COURSES_FILE, 'utf8')); } catch (err) { return []; }
};
const saveLocalCompanyCourses = (data) => {
  fs.writeFileSync(COMPANY_COURSES_FILE, JSON.stringify(data, null, 2));
};

// Schema definition (only used if MongoDB is active)
const userSchema = new mongoose.Schema({
  fullName: { type: String },
  companyName: { type: String },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String, required: true },
  role: { type: String, default: 'student' },
  assignedCourses: { type: [String], default: [] },
  purchasedCourses: { type: [String], default: [] },
  courseProgress: { type: Object, default: {} },
  assignedStudents: { type: [String], default: [] },
  assignedTrainers: { type: [String], default: [] },
  profilePhoto: { type: String },
  college: { type: String },
  department: { type: String },
  knowledge: { type: String },
  experience: { type: String },
  expertise: { type: String },
  linkedin: { type: String },
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
  originalPrice: { type: String },
  price: { type: String },
  description: { type: String },
  image: { type: String }, 
  content: { type: String, required: true },
  ppt: { type: String }, 
  pptName: { type: String }, 
  video: { type: String }, 
  videoName: { type: String }, 
  programType: { type: String, default: 'Student Development Program' },
  
  // Schedule Fields
  totalDurationHours: { type: Number },
  trainingDays: { type: Number },
  startDate: { type: Date },
  dailyStartTime: { type: String },
  schedule: [{
    dayNumber: Number,
    date: Date,
    startTime: String,
    endTime: String,
    durationHours: Number,
    status: { type: String, default: 'Upcoming' }
  }],
  
  createdAt: { type: Date, default: Date.now }
});

let Course;
try {
  Course = mongoose.model('Course', courseSchema);
} catch (err) {
  Course = mongoose.models.Course;
}

const activitySchema = new mongoose.Schema({
  actor: { type: String, required: true },
  action: { type: String, required: true },
  details: { type: String },
  timestamp: { type: Date, default: Date.now }
});

let Activity;
try {
  Activity = mongoose.model('Activity', activitySchema);
} catch (err) {
  Activity = mongoose.models.Activity;
}

const liveClassSchema = new mongoose.Schema({
  courseId: { type: String, required: true },
  courseTitle: { type: String },
  trainerId: { type: String, required: true },
  studentIds: { type: [String], default: [] },
  timing: { type: String, required: true },
  duration: { type: String, required: true },
  meetingLink: { type: String },
  assignedByRole: { type: String, default: 'admin' },
  assignerId: { type: String },
  createdAt: { type: Date, default: Date.now }
}, { strict: false });

let LiveClass;
try {
  LiveClass = mongoose.model('LiveClass', liveClassSchema);
} catch (err) {
  LiveClass = mongoose.models.LiveClass;
}

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date },
  assignedTo: { type: [String], default: [] }, // array of emails
  createdBy: { type: String, required: true }, // company email
  courseTitle: { type: String },
  timestamp: { type: Date, default: Date.now }
});

let Assignment;
try {
  Assignment = mongoose.model('Assignment', assignmentSchema);
} catch (err) {
  Assignment = mongoose.models.Assignment;
}

const certificateSchema = new mongoose.Schema({
  studentEmail: { type: String, required: true },
  courseTitle: { type: String, required: true },
  issuedBy: { type: String, required: true }, // company email
  issueDate: { type: Date, default: Date.now },
  certificateUrl: { type: String } // optional link/file
});

let Certificate;
try {
  Certificate = mongoose.model('Certificate', certificateSchema);
} catch (err) {
  Certificate = mongoose.models.Certificate;
}

const companyCourseSchema = new mongoose.Schema({
  id: String,
  title: String,
  syllabus: String,
  image: String,
  price: Number,
  originalPrice: Number,
  companyName: String,
  tags: [String],
  status: { type: String, default: 'pending' }, // 'pending' or 'approved'
  
  // Schedule Fields
  totalDurationHours: { type: Number },
  trainingDays: { type: Number },
  startDate: { type: Date },
  dailyStartTime: { type: String },
  schedule: [{
    dayNumber: Number,
    date: Date,
    startTime: String,
    endTime: String,
    durationHours: Number,
    status: { type: String, default: 'Upcoming' }
  }],
  
  createdAt: { type: Date, default: Date.now }
});

let CompanyCourse;
try {
  CompanyCourse = mongoose.model('CompanyCourse', companyCourseSchema);
} catch (err) {
  CompanyCourse = mongoose.models.CompanyCourse;
}

const accessRequestSchema = new mongoose.Schema({
  requesterEmail: { type: String, required: true },
  targetEmail: { type: String, required: true },
  requesterName: { type: String },
  targetName: { type: String },
  requesterRole: { type: String },
  targetRole: { type: String },
  requestType: { type: String },
  status: { type: String, default: 'Pending', enum: ['Pending', 'Approved', 'Rejected'] },
  createdAt: { type: Date, default: Date.now }
});

let AccessRequest;
try {
  AccessRequest = mongoose.model('AccessRequest', accessRequestSchema);
} catch (e) {
  AccessRequest = mongoose.models.AccessRequest;
}

const jobOfferSchema = new mongoose.Schema({
  companyId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  requirements: { type: Object }, // e.g., { skills: [], degree: '', experience: '' }
  status: { type: String, default: 'Pending', enum: ['Pending', 'Approved', 'SentToStudents', 'Closed'] },
  targetedStudents: { type: [String], default: [] },
  selectedStudents: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now }
});

let JobOffer;
try {
  JobOffer = mongoose.model('JobOffer', jobOfferSchema);
} catch (e) {
  JobOffer = mongoose.models.JobOffer;
}

const JOB_OFFERS_FILE = path.join(DATA_DIR, 'job_offers.json');
if (!fs.existsSync(JOB_OFFERS_FILE)) {
  fs.writeFileSync(JOB_OFFERS_FILE, JSON.stringify([]));
}

const getLocalJobOffers = () => {
  try {
    const data = fs.readFileSync(JOB_OFFERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

const saveLocalJobOffers = (jobs) => {
  fs.writeFileSync(JOB_OFFERS_FILE, JSON.stringify(jobs, null, 2));
};


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
mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 15000, family: 4 })
  .then(async () => {
    console.log('MongoDB connected.');
    isMongoConnected = true;
    try {
      // Seeding disabled to prevent duplicate courses
    } catch (err) {
      console.error(err);
    }
  })
  .catch(async (err) => {
    console.error('MongoDB Connection Error:', err);
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
      return res.json({ success: false, errors });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      ...req.body,
      fullName,
      email,
      phone,
      password: hashedPassword,
      role: userRole,
      assignedCourses: [],
      purchasedCourses: [],
      courseProgress: {},
      createdAt: new Date()
    };

    // Check if user already exists
    if (isMongoConnected) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.json({ success: false, errors: { email: 'Email is already registered.' } });
      }

      // Create new user in Mongo
      const newUser = new User(userData);
      await newUser.save();

      // If registered by a company, auto-associate the trainer's email
      if (userRole === 'trainer' && req.body.companyEmail) {
        await User.findOneAndUpdate(
          { email: req.body.companyEmail },
          { $addToSet: { assignedTrainers: email } },
          { new: true }
        );
      }

      await sendRegistrationEmail(email, fullName, userRole, password);
      return res.status(201).json({ success: true, message: 'Registration successful!', user: { fullName, email, role: userRole } });
    } else {
      const localUsers = getLocalUsers();
      if (localUsers.some(u => u.email === email)) {
        return res.json({ success: false, errors: { email: 'Email is already registered.' } });
      }

      saveLocalUser(userData);

      // If registered by a company locally, auto-associate the trainer's email
      if (userRole === 'trainer' && req.body.companyEmail) {
        const companyIndex = localUsers.findIndex(u => u.email === req.body.companyEmail);
        if (companyIndex !== -1) {
          if (!localUsers[companyIndex].assignedTrainers) localUsers[companyIndex].assignedTrainers = [];
          if (!localUsers[companyIndex].assignedTrainers.includes(email)) {
            localUsers[companyIndex].assignedTrainers.push(email);
            fs.writeFileSync(USERS_FILE, JSON.stringify(localUsers, null, 2));
          }
        }
      }

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
    const email = (req.body.email || '').trim();
    const password = (req.body.password || '').trim();
    console.log(`[LOGIN ATTEMPT] Email: "${email}", Password: "${password}"`);

    if (!email || !password) {
      return res.json({ success: false, message: 'Email and password are required.' });
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
        return res.json({ success: false, message: 'Invalid email or password.' });
      }
      // Trigger nodemon reload for port release
      let isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        // Fallback for legacy plain-text passwords
        if (user.password === password) {
          console.log(`[LOGIN MIGRATION] Migrating plaintext password for user: "${email}"`);
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(password, salt);
          await user.save();
          isMatch = true;
        }
      }

      if (!isMatch) {
        console.log(`[LOGIN FAILED] Password mismatch for: "${email}"`);
        return res.json({ success: false, message: 'Invalid email or password.' });
      }
      console.log(`[LOGIN SUCCESS] User logged in: ${email}`);
      const { password: _, ...userWithoutPassword } = user.toObject();
      return res.json({ success: true, message: 'Login successful!', user: { id: user._id, ...userWithoutPassword } });
    } else {
      const localUsers = getLocalUsers();
      const user = localUsers.find(u => u.email === email);
      if (!user) {
        console.log(`[LOGIN FAILED] User not found locally: "${email}"`);
        return res.json({ success: false, message: 'Invalid email or password.' });
      }
      let isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        if (user.password === password) {
          console.log(`[LOGIN MIGRATION] Migrating local plaintext password for: "${email}"`);
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(password, salt);
          fs.writeFileSync(USERS_FILE, JSON.stringify(localUsers, null, 2));
          isMatch = true;
        }
      }

      if (!isMatch) {
        console.log(`[LOGIN FAILED] Local password mismatch for: "${email}"`);
        return res.json({ success: false, message: 'Invalid email or password.' });
      }
      console.log(`[LOGIN SUCCESS] User logged in locally: ${email}`);
      const { password: _, ...userWithoutPassword } = user;
      return res.json({ success: true, message: 'Login successful!', user: userWithoutPassword });
    }
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'An internal server error occurred.' });
  }
});

// POST /api/auth/change-password
app.post('/api/auth/change-password', async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;
    if (!email || !currentPassword || !newPassword) {
      return res.json({ success: false, message: 'Missing required fields.' });
    }

    if (isMongoConnected) {
      const user = await User.findOne({ email });
      if (!user) return res.json({ success: false, message: 'User not found.' });
      
      let isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch && user.password !== currentPassword) {
        return res.json({ success: false, message: 'Incorrect current password.' });
      }
      
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      await user.save();
      return res.json({ success: true, message: 'Password changed successfully.' });
    } else {
      const localUsers = getLocalUsers();
      const userIndex = localUsers.findIndex(u => u.email === email);
      if (userIndex === -1) return res.json({ success: false, message: 'User not found.' });
      
      let isMatch = await bcrypt.compare(currentPassword, localUsers[userIndex].password);
      if (!isMatch && localUsers[userIndex].password !== currentPassword) {
        return res.json({ success: false, message: 'Incorrect current password.' });
      }
      
      const salt = await bcrypt.genSalt(10);
      localUsers[userIndex].password = await bcrypt.hash(newPassword, salt);
      fs.writeFileSync(USERS_FILE, JSON.stringify(localUsers, null, 2));
      return res.json({ success: true, message: 'Password changed successfully.' });
    }
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
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
    const { title, name, originalPrice, price, description, image, imageFile, content, ppt, pptFile, video, videoFile, programType, totalDurationHours, trainingDays, startDate, dailyStartTime } = req.body;
    const finalContent = content || description || 'No description provided';
    if (!title || !finalContent) {
      return res.status(400).json({ success: false, message: 'Title and content/description are required.' });
    }

    const imagePath = saveUploadedFile(image, imageFile);
    const pptPath = saveUploadedFile(ppt, pptFile);
    const videoPath = saveUploadedFile(video, videoFile);

    const generatedSchedule = generateSchedule(startDate, dailyStartTime, totalDurationHours, trainingDays);

    const courseData = {
      title,
      name: name || '',
      originalPrice: originalPrice || '',
      price: price || '',
      description: description || '',
      image: imagePath || '',
      content: finalContent,
      ppt: pptPath || '',
      pptName: pptFile || '',
      video: videoPath || '',
      videoName: videoFile || '',
      programType: programType || 'Student Development Program',
      totalDurationHours: totalDurationHours || 0,
      trainingDays: trainingDays || 0,
      startDate: startDate || null,
      dailyStartTime: dailyStartTime || '',
      schedule: generatedSchedule,
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
    const { title, name, originalPrice, price, description, image, imageFile, content, ppt, pptFile, video, videoFile, programType, totalDurationHours, trainingDays, startDate, dailyStartTime } = req.body;
    const finalContent = content || description || 'No description provided';

    if (!title || !finalContent) {
      return res.status(400).json({ success: false, message: 'Title and content/description are required.' });
    }

    const generatedSchedule = generateSchedule(startDate, dailyStartTime, totalDurationHours, trainingDays);

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
      existing.originalPrice = originalPrice || '';
      existing.price = price || '';
      existing.description = description || '';
      existing.image = imagePath || existing.image;
      existing.content = finalContent;
      existing.ppt = pptPath || existing.ppt;
      existing.pptName = pptFile || existing.pptName;
      existing.video = videoPath || existing.video;
      existing.videoName = videoFile || existing.videoName;
      existing.programType = programType || existing.programType || 'Student Development Program';
      
      existing.totalDurationHours = totalDurationHours !== undefined ? totalDurationHours : existing.totalDurationHours;
      existing.trainingDays = trainingDays !== undefined ? trainingDays : existing.trainingDays;
      existing.startDate = startDate !== undefined ? startDate : existing.startDate;
      existing.dailyStartTime = dailyStartTime !== undefined ? dailyStartTime : existing.dailyStartTime;
      if (generatedSchedule.length > 0) {
        existing.schedule = generatedSchedule;
      }

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
        programType: programType || existing.programType || 'Student Development Program',
        totalDurationHours: totalDurationHours !== undefined ? totalDurationHours : existing.totalDurationHours,
        trainingDays: trainingDays !== undefined ? trainingDays : existing.trainingDays,
        startDate: startDate !== undefined ? startDate : existing.startDate,
        dailyStartTime: dailyStartTime !== undefined ? dailyStartTime : existing.dailyStartTime,
        schedule: generatedSchedule.length > 0 ? generatedSchedule : existing.schedule,
      };

      saveLocalCourses(localCourses);
      return res.json({ success: true, message: 'Course updated locally!', course: localCourses[idx] });
    }
  } catch (err) {
    console.error('Error updating course:', err);
    res.status(500).json({ success: false, message: 'Server error updating course.' });
  }
});

// Mark course as complete
app.post('/api/users/:userId/complete-course', async (req, res) => {
  try {
    const { userId } = req.params;
    const { courseTitle } = req.body;

    if (!courseTitle) {
      return res.status(400).json({ success: false, message: 'Course title is required' });
    }

    if (isMongoConnected) {
      const user = await User.findOne({ $or: [{ _id: userId }, { email: userId }] });
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      
      if (!user.completedCourses) {
        user.completedCourses = [];
      }
      
      if (!user.completedCourses.includes(courseTitle)) {
        user.completedCourses.push(courseTitle);
        // Using strict:false allows saving properties not strictly defined in the schema
        await user.save();
      }

      return res.json({ success: true, message: 'Course marked as completed', user });
    } else {
      // Local fallback
      const users = getLocalUsers();
      const userIndex = users.findIndex(u => u.id === userId || u.email === userId);
      if (userIndex === -1) return res.status(404).json({ success: false, message: 'User not found' });

      if (!users[userIndex].completedCourses) {
        users[userIndex].completedCourses = [];
      }
      
      if (!users[userIndex].completedCourses.includes(courseTitle)) {
        users[userIndex].completedCourses.push(courseTitle);
        saveLocalUsers(users);
      }

      return res.json({ success: true, message: 'Course marked as completed', user: users[userIndex] });
    }
  } catch (err) {
    console.error('Error completing course:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Fetch progress for a specific user and course
app.get('/api/users/:userId/progress/:courseId', async (req, res) => {
  try {
    const { userId, courseId } = req.params;
    let progress = [];
    if (isMongoConnected) {
      const user = await User.findOne({ $or: [{ _id: userId }, { email: userId }] });
      if (user && user.courseProgress) {
        progress = user.courseProgress[courseId] || [];
      }
    } else {
      const users = getLocalUsers();
      const user = users.find(u => u.id === userId || u.email === userId);
      if (user && user.courseProgress) {
        progress = user.courseProgress[courseId] || [];
      }
    }
    res.json({ success: true, progress });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update progress for a specific user and course
app.post('/api/users/:userId/progress/:courseId', async (req, res) => {
  try {
    const { userId, courseId } = req.params;
    const { progress } = req.body; // array of completed module titles
    
    if (isMongoConnected) {
      const user = await User.findOne({ $or: [{ _id: userId }, { email: userId }] });
      if (user) {
        if (!user.courseProgress) user.courseProgress = {};
        user.courseProgress[courseId] = progress;
        user.markModified('courseProgress');
        await user.save();
      }
    } else {
      const users = getLocalUsers();
      const userIndex = users.findIndex(u => u.id === userId || u.email === userId);
      if (userIndex !== -1) {
        if (!users[userIndex].courseProgress) users[userIndex].courseProgress = {};
        users[userIndex].courseProgress[courseId] = progress;
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
      }
    }
    res.json({ success: true, message: 'Progress updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Enroll in a course (assigns course to user)
app.post('/api/users/:userId/enroll', async (req, res) => {
  try {
    const { userId } = req.params;
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({ success: false, message: 'Course ID is required' });
    }

    if (isMongoConnected) {
      const user = await User.findOne({ $or: [{ _id: userId }, { email: userId }] });
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      
      if (!user.assignedCourses) user.assignedCourses = [];
      if (!user.purchasedCourses) user.purchasedCourses = [];
      
      if (!user.assignedCourses.includes(courseId)) {
        user.assignedCourses.push(courseId);
      }
      if (!user.purchasedCourses.includes(courseId)) {
        user.purchasedCourses.push(courseId);
      }
      await user.save();

      // Trigger Welcome Email
      sendWelcomeEmail(user.email, courseId).catch(console.error);

      return res.json({ success: true, message: 'Enrolled successfully', user });
    } else {
      const users = getLocalUsers();
      const userIndex = users.findIndex(u => u.id === userId || u.email === userId);
      if (userIndex === -1) return res.status(404).json({ success: false, message: 'User not found' });

      if (!users[userIndex].assignedCourses) users[userIndex].assignedCourses = [];
      if (!users[userIndex].purchasedCourses) users[userIndex].purchasedCourses = [];
      
      let modified = false;
      if (!users[userIndex].assignedCourses.includes(courseId)) {
        users[userIndex].assignedCourses.push(courseId);
        modified = true;
      }
      if (!users[userIndex].purchasedCourses.includes(courseId)) {
        users[userIndex].purchasedCourses.push(courseId);
        modified = true;
      }
      
      if (modified) {
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
      }

      // Trigger Welcome Email
      sendWelcomeEmail(users[userIndex].email, courseId).catch(console.error);

      return res.json({ success: true, message: 'Enrolled successfully', user: users[userIndex] });
    }
  } catch (err) {
    console.error('Error enrolling course:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get Admin Analytics (Revenue, Enrollments)
app.get('/api/admin/analytics', async (req, res) => {
  try {
    // Generate mock revenue data for chart
    const revenueData = [
      { name: 'Jan', revenue: 4000, students: 24 },
      { name: 'Feb', revenue: 3000, students: 18 },
      { name: 'Mar', revenue: 5000, students: 30 },
      { name: 'Apr', revenue: 4500, students: 28 },
      { name: 'May', revenue: 6000, students: 35 },
      { name: 'Jun', revenue: 5500, students: 32 },
      { name: 'Jul', revenue: 7000, students: 40 }
    ];

    return res.json({ success: true, analytics: revenueData });
  } catch (err) {
    console.error('Error fetching analytics:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get all users for admin
app.get('/api/admin/users', async (req, res) => {
  try {
    if (isMongoConnected) {
      const users = await User.find({}).sort({ createdAt: -1 });
      return res.json({ success: true, users });
    } else {
      const users = getLocalUsers();
      return res.json({ success: true, users });
    }
  } catch (err) {
    console.error('Error fetching admin users:', err);
    res.status(500).json({ success: false, message: 'Server error' });
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

      // Clean up references to the deleted course title from all users' assignedCourses
      const courseTitle = deleted.title;
      try {
        const User = mongoose.model('User');
        await User.updateMany(
          {},
          { $pull: { assignedCourses: courseTitle } }
        );
        console.log(`Pulled deleted course "${courseTitle}" from all users.`);
      } catch (userErr) {
        console.error('Error pulling deleted course from users:', userErr);
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

      // Clean up local users references too
      const courseTitle = deleted.title;
      try {
        const localUsers = getLocalUsers();
        let usersUpdated = false;
        localUsers.forEach(u => {
          if (u.assignedCourses && u.assignedCourses.includes(courseTitle)) {
            u.assignedCourses = u.assignedCourses.filter(t => t !== courseTitle);
            usersUpdated = true;
          }
        });
        if (usersUpdated) {
          fs.writeFileSync(USERS_FILE, JSON.stringify(localUsers, null, 2));
        }
      } catch (localUserErr) {
        console.error('Error pulling deleted course from local users:', localUserErr);
      }

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

// Live Classes Endpoints
app.get('/api/live-classes', async (req, res) => {
  try {
    const { trainerId, studentId } = req.query;
    let classes = [];

    if (isMongoConnected) {
      let query = { trainerId: { $exists: true, $ne: null }, timing: { $exists: true, $ne: null } };
      
      let finalTrainerId = trainerId;
      let finalStudentId = studentId;

      if (trainerId && trainerId.includes('@')) {
        const tUser = await User.findOne({ email: trainerId });
        if (tUser) finalTrainerId = tUser._id.toString();
      }
      if (studentId && studentId.includes('@')) {
        const sUser = await User.findOne({ email: studentId });
        if (sUser) finalStudentId = sUser._id.toString();
      }

      if (finalTrainerId) query.trainerId = finalTrainerId;
      if (finalStudentId) query.studentIds = finalStudentId;
      console.log('GET /api/live-classes query:', JSON.stringify(query));
      classes = await LiveClass.find(query).sort({ createdAt: -1 });
      console.log('GET /api/live-classes found:', classes.length);
    } else {
      classes = getLocalLiveClasses();
      if (trainerId) {
        classes = classes.filter(c => c.trainerId === trainerId);
      }
      if (studentId) {
        classes = classes.filter(c => c.studentIds?.includes(studentId));
      }
    }
    res.json({ success: true, liveClasses: classes });
  } catch (err) {
    console.error('Error fetching live classes:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/live-classes', async (req, res) => {
  try {
    const { courseId, courseTitle, trainerId, studentIds, timing, duration, meetingLink, assignedByRole, assignerId } = req.body;
    
    if (isMongoConnected) {
      const newClass = new LiveClass({
        courseId,
        courseTitle,
        trainerId,
        studentIds,
        timing,
        duration,
        meetingLink,
        assignedByRole: assignedByRole || 'admin',
        assignerId: assignerId || ''
      });
      await newClass.save();
      
      if (studentIds && studentIds.length > 0) {
        const classDate = new Date(timing).toLocaleString();
        const studentNotification = {
          id: `lc_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
          sender: 'Super Admin',
          text: `You have been assigned to Live Class for course: ${courseTitle}. Date: ${classDate}, Session: ${duration}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString(),
          createdAt: new Date()
        };
        await User.updateMany(
          { email: { $in: studentIds } },
          { $push: { notifications: { $each: [studentNotification], $position: 0 } } }
        );
      }

      res.json({ success: true, message: 'Live class scheduled successfully', liveClass: newClass });
    } else {
      const classes = getLocalLiveClasses();
      const newClass = {
        id: Date.now().toString(),
        courseId,
        courseTitle,
        trainerId,
        studentIds,
        timing,
        duration,
        assignedByRole: assignedByRole || 'admin',
        assignerId: assignerId || '',
        createdAt: new Date().toISOString()
      };
      classes.push(newClass);
      saveLocalLiveClasses(classes);
      
      if (studentIds && studentIds.length > 0) {
        const classDate = new Date(timing).toLocaleString();
        const studentNotification = {
          id: `lc_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
          sender: 'Super Admin',
          text: `You have been assigned to Live Class for course: ${courseTitle}. Date: ${classDate}, Session: ${duration}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString(),
          createdAt: new Date()
        };
        const localUsers = getLocalUsers();
        let changed = false;
        studentIds.forEach(email => {
          const idx = localUsers.findIndex(u => u.email === email);
          if (idx !== -1) {
            localUsers[idx].notifications = localUsers[idx].notifications || [];
            localUsers[idx].notifications.unshift(studentNotification);
            changed = true;
          }
        });
        if (changed) {
          fs.writeFileSync(USERS_FILE, JSON.stringify(localUsers, null, 2));
        }
      }

      res.json({ success: true, message: 'Live class scheduled successfully', liveClass: newClass });
    }
  } catch (err) {
    console.error('Error creating live class:', err);
    res.status(500).json({ success: false, message: 'Server error creating live class.' });
  }
});

app.post('/api/live-classes/batch', async (req, res) => {
  try {
    const { classes } = req.body;
    if (!classes || !Array.isArray(classes) || classes.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid batch data' });
    }
    
    if (isMongoConnected) {
      const docs = classes.map(c => ({
        courseId: c.courseId,
        courseTitle: c.courseTitle,
        trainerId: c.trainerId,
        studentIds: c.studentIds,
        timing: c.timing,
        duration: c.duration,
        meetingLink: c.meetingLink,
        assignedByRole: c.assignedByRole || 'admin',
        assignerId: c.assignerId || '',
        dayNumber: c.dayNumber
      }));
      const inserted = await LiveClass.insertMany(docs);
      
      const allStudentIds = [...new Set(classes.flatMap(c => c.studentIds || []))];
      if (allStudentIds.length > 0) {
        const studentNotification = {
          id: `lc_batch_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
          sender: 'Super Admin',
          text: `You have been assigned to a ${classes.length}-day Live Class for course: ${classes[0].courseTitle}.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString(),
          createdAt: new Date()
        };
        await User.updateMany(
          { email: { $in: allStudentIds } },
          { $push: { notifications: { $each: [studentNotification], $position: 0 } } }
        );
      }
      res.json({ success: true, message: `${classes.length} Live classes scheduled successfully`, liveClasses: inserted });
    } else {
      const existingClasses = getLocalLiveClasses();
      const newClasses = classes.map((c, i) => ({
        id: Date.now().toString() + '_' + i,
        courseId: c.courseId,
        courseTitle: c.courseTitle,
        trainerId: c.trainerId,
        studentIds: c.studentIds,
        timing: c.timing,
        duration: c.duration,
        assignedByRole: c.assignedByRole || 'admin',
        assignerId: c.assignerId || '',
        dayNumber: c.dayNumber,
        createdAt: new Date().toISOString()
      }));
      existingClasses.push(...newClasses);
      saveLocalLiveClasses(existingClasses);
      
      const allStudentIds = [...new Set(classes.flatMap(c => c.studentIds || []))];
      if (allStudentIds.length > 0) {
        const studentNotification = {
          id: `lc_batch_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
          sender: 'Super Admin',
          text: `You have been assigned to a ${classes.length}-day Live Class for course: ${classes[0].courseTitle}.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString(),
          createdAt: new Date()
        };
        const users = getLocalUsers();
        allStudentIds.forEach(email => {
          const user = users.find(u => u.email === email);
          if (user) {
            user.notifications = user.notifications || [];
            user.notifications.unshift(studentNotification);
          }
        });
        saveLocalUsers(users);
      }
      res.json({ success: true, message: `${classes.length} Live classes scheduled successfully`, liveClasses: newClasses });
    }
  } catch (err) {
    console.error('Error scheduling live class batch:', err);
    res.status(500).json({ success: false, message: 'Server error' });
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
    const { fullName, phone, gender, year, district, college, department, profilePhoto, profilePhotoFile, companyName, contactPerson, industry, companySize, website, settings } = req.body;
    
    const updateData = { fullName, phone, gender, year, district, college, department };
    if (companyName !== undefined) updateData.companyName = companyName;
    if (contactPerson !== undefined) updateData.contactPerson = contactPerson;
    if (industry !== undefined) updateData.industry = industry;
    if (companySize !== undefined) updateData.companySize = companySize;
    if (website !== undefined) updateData.website = website;
    if (settings !== undefined) updateData.settings = settings;

    // Handle profile photo upload
    if (profilePhoto && profilePhotoFile) {
      if (profilePhoto.startsWith('/uploads/')) {
        updateData.profilePhoto = profilePhoto;
      } else {
        updateData.profilePhoto = saveUploadedFile(profilePhoto, profilePhotoFile);
      }
    }

    if (isMongoConnected) {
      // Delete old photo if being replaced
      if (updateData.profilePhoto) {
        const existing = await User.findOne({ email });
        if (existing && existing.profilePhoto) deleteUploadedFile(existing.profilePhoto);
      }
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
      
      // Delete old photo if replacing
      if (updateData.profilePhoto && localUsers[index].profilePhoto) {
        deleteUploadedFile(localUsers[index].profilePhoto);
      }

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

// Admin endpoint to delete an access request
app.delete('/api/admin/access-requests/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (isMongoConnected) {
      await AccessRequest.findByIdAndDelete(id);
      res.json({ success: true, message: 'Contact request removed successfully.' });
    } else {
      let reqs = getLocalRequests();
      reqs = reqs.filter(r => r.id !== id && r._id !== id);
      fs.writeFileSync(REQUESTS_FILE, JSON.stringify(reqs, null, 2));
      res.json({ success: true, message: 'Contact request removed successfully.' });
    }
  } catch (err) {
    console.error('Error deleting access request:', err);
    res.status(500).json({ success: false, message: 'Server error deleting request.' });
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
    const { courses, trainers, students } = req.body; 
    
    const updateFields = {};
    if (courses !== undefined) updateFields.assignedCourses = courses;
    if (trainers !== undefined) updateFields.assignedTrainers = trainers;
    if (students !== undefined) updateFields.assignedStudents = students;
    
    const notification = trainers !== undefined ? {
      id: `assign_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      sender: 'Super Admin',
      text: `Your requested trainer has been assigned to your company.`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString(),
      createdAt: new Date()
    } : null;

    if (isMongoConnected) {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

      let newTrainers = [];
      if (trainers !== undefined) {
         const oldTrainers = user.assignedTrainers || [];
         newTrainers = trainers.filter(t => !oldTrainers.includes(t));
      }

      if (courses !== undefined) user.assignedCourses = courses;
      if (trainers !== undefined) user.assignedTrainers = trainers;
      if (students !== undefined) user.assignedStudents = students;
      
      if (notification) {
        const notifications = user.get('notifications') || [];
        notifications.unshift(notification);
        user.set('notifications', notifications);
      }
      
      await user.save();

      if (newTrainers.length > 0) {
        const trainerNotification = {
          id: `t_assign_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
          sender: 'Super Admin',
          text: `You have been assigned to conduct training for company: ${user.fullName || user.companyName || email}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString(),
          createdAt: new Date()
        };
        await User.updateMany(
          { email: { $in: newTrainers } },
          { $push: { notifications: { $each: [trainerNotification], $position: 0 } } }
        );
      }
      return res.json({ success: true, message: 'Assignments updated successfully!', data: updateFields });
    } else {
      const localUsers = getLocalUsers();
      const index = localUsers.findIndex(u => u.email === email);
      if (index === -1) return res.status(404).json({ success: false, message: 'User not found.' });
      
      const user = localUsers[index];
      let newTrainers = [];
      if (trainers !== undefined) {
         const oldTrainers = user.assignedTrainers || [];
         newTrainers = trainers.filter(t => !oldTrainers.includes(t));
      }

      if (courses !== undefined) localUsers[index].assignedCourses = courses;
      if (trainers !== undefined) localUsers[index].assignedTrainers = trainers;
      if (students !== undefined) localUsers[index].assignedStudents = students;

      if (notification) {
        localUsers[index].notifications = localUsers[index].notifications || [];
        localUsers[index].notifications.unshift(notification);
      }

      if (newTrainers.length > 0) {
        const trainerNotification = {
          id: `t_assign_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
          sender: 'Super Admin',
          text: `You have been assigned to conduct training for company: ${user.fullName || user.companyName || email}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString(),
          createdAt: new Date()
        };
        newTrainers.forEach(trainerEmail => {
          const tIdx = localUsers.findIndex(u => u.email === trainerEmail);
          if (tIdx !== -1) {
            localUsers[tIdx].notifications = localUsers[tIdx].notifications || [];
            localUsers[tIdx].notifications.unshift(trainerNotification);
          }
        });
      }

      fs.writeFileSync(USERS_FILE, JSON.stringify(localUsers, null, 2));
      return res.json({ success: true, message: 'Assignments updated locally!', data: updateFields });
    }
  } catch (err) {
    console.error('Error assigning to user:', err);
    res.status(500).json({ success: false, message: 'Server error assigning data.' });
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
    const { email, phone, isRegister, skipUserCheck } = req.body;
    const identifier = email || phone;
    if (!identifier) {
      return res.json({ success: false, message: 'Email or Phone is required.' });
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

    if (!skipUserCheck) {
      if (isRegister) {
        if (userExists) {
          return res.json({ success: false, message: `${email ? 'Email' : 'Phone number'} is already registered.` });
        }
      } else {
        if (!userExists) {
          return res.json({ success: false, message: `No account found with this ${email ? 'email' : 'phone number'}.` });
        }
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
      return res.json({ success: false, message: 'Identifier and OTP are required.' });
    }

    const record = otpStore[identifier];
    if (!record) {
      return res.json({ success: false, message: 'OTP not found. Please request a new one.' });
    }
    if (Date.now() > record.expiresAt) {
      delete otpStore[identifier];
      return res.json({ success: false, message: 'OTP has expired. Please request a new one.' });
    }
    if (record.code !== otp.toString().trim()) {
      return res.json({ success: false, message: 'Incorrect OTP. Please try again.' });
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
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    if (isMongoConnected) {
      const updated = await User.findOneAndUpdate({ email }, { password: hashedNewPassword }, { new: true });
      if (!updated) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }
    } else {
      const localUsers = getLocalUsers();
      const index = localUsers.findIndex(u => u.email === email);
      if (index !== -1) {
        localUsers[index].password = hashedNewPassword;
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

// --- NEW ENDPOINTS (Directories, Profile, Course Assign) ---

// GET /api/users - Fetch users by role
app.get('/api/users', async (req, res) => {
  try {
    const role = req.query.role;
    let users = [];
    if (isMongoConnected) {
      const query = role ? { role } : {};
      users = await User.find(query).select('-password');
    } else {
      const localUsers = getLocalUsers().map(u => {
        if (!u.role) {
          if (u.expertise || u.experienceYears) u.role = 'trainer';
          else if (u.hrEmail || u.companyName) u.role = 'company';
          else u.role = 'student';
        }
        return u;
      });
      users = role ? localUsers.filter(u => u.role === role) : localUsers;
      users = users.map(({ password, ...u }) => u);
    }
    return res.json({ success: true, users });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ success: false, message: 'Server error fetching users.' });
  }
});

// PUT /api/users/profile - Update user profile
app.put('/api/users/profile', async (req, res) => {
  try {
    const { email, fullName, phone, college, department, profilePhoto, knowledge, experience, industry, website, companySize, hrName } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    let photoUrl;
    if (profilePhoto && !profilePhoto.startsWith('/uploads/')) {
      photoUrl = saveUploadedFile(profilePhoto, `profile_${Date.now()}.png`);
    } else {
      photoUrl = profilePhoto;
    }

    const updateData = { fullName, phone, college, department };
    if (photoUrl) updateData.profilePhoto = photoUrl;
    if (knowledge !== undefined) updateData.knowledge = knowledge;
    if (experience !== undefined) updateData.experience = experience;
    if (industry !== undefined) updateData.industry = industry;
    if (website !== undefined) updateData.website = website;
    if (companySize !== undefined) updateData.companySize = companySize;
    if (hrName !== undefined) updateData.hrName = hrName;

    if (isMongoConnected) {
      const user = await User.findOneAndUpdate(
        { email },
        updateData,
        { new: true }
      ).select('-password');
      if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
      return res.json({ success: true, message: 'Profile updated successfully.', user });
    } else {
      const localUsers = getLocalUsers();
      const index = localUsers.findIndex(u => u.email === email);
      if (index === -1) return res.status(404).json({ success: false, message: 'User not found.' });
      
      localUsers[index] = { ...localUsers[index], ...updateData };
      fs.writeFileSync(USERS_FILE, JSON.stringify(localUsers, null, 2));
      const { password, ...userWithoutPassword } = localUsers[index];
      return res.json({ success: true, message: 'Profile updated successfully.', user: userWithoutPassword });
    }
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ success: false, message: 'Server error updating profile.' });
  }
});

// POST /api/admin/assign-course - Assign a course to a student
app.post('/api/admin/assign-course', async (req, res) => {
  try {
    const { email, courseId } = req.body;
    if (!email || !courseId) {
      return res.status(400).json({ success: false, message: 'Email and Course ID are required.' });
    }

    if (isMongoConnected) {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
      
      if (!user.assignedCourses) user.assignedCourses = [];
      if (!user.assignedCourses.includes(courseId)) {
        user.assignedCourses.push(courseId);
        await user.save();
      }
      return res.json({ success: true, message: 'Course assigned successfully.', assignedCourses: user.assignedCourses });
    } else {
      const localUsers = getLocalUsers();
      const index = localUsers.findIndex(u => u.email === email);
      if (index === -1) return res.status(404).json({ success: false, message: 'User not found.' });
      
      if (!localUsers[index].assignedCourses) localUsers[index].assignedCourses = [];
      if (!localUsers[index].assignedCourses.includes(courseId)) {
        localUsers[index].assignedCourses.push(courseId);
        fs.writeFileSync(USERS_FILE, JSON.stringify(localUsers, null, 2));
      }
      return res.json({ success: true, message: 'Course assigned successfully.', assignedCourses: localUsers[index].assignedCourses });
    }
  } catch (err) {
    console.error('Error assigning course:', err);
    res.status(500).json({ success: false, message: 'Server error assigning course.' });
  }
});

// GET /api/users/:email/courses - Get a user's assigned courses
app.get('/api/users/:email/courses', async (req, res) => {
  try {
    const { email } = req.params;
    let assignedCourseIds = [];
    
    if (isMongoConnected) {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
      assignedCourseIds = user.assignedCourses || [];
      
      const validObjectIds = assignedCourseIds.filter(id => mongoose.Types.ObjectId.isValid(id));
      const titles = assignedCourseIds.filter(id => !mongoose.Types.ObjectId.isValid(id));
      
      const courses = await Course.find({ 
        $or: [
          { _id: { $in: validObjectIds } },
          { title: { $in: titles } }
        ]
      });
      return res.json({ success: true, courses });
    } else {
      const localUsers = getLocalUsers();
      const user = localUsers.find(u => u.email === email);
      if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
      assignedCourseIds = user.assignedCourses || [];
      const localCourses = getLocalCourses();
      const courses = localCourses.filter(c => assignedCourseIds.includes(String(c.id)) || assignedCourseIds.includes(String(c._id)));
      return res.json({ success: true, courses });
    }
  } catch (err) {
    console.error('Error fetching assigned courses:', err);
    res.status(500).json({ success: false, message: 'Server error fetching assigned courses.' });
  }
});

// --- PRIVACY ACCESS REQUESTS ---

// POST /api/access-requests - Create a request
app.post('/api/access-requests', async (req, res) => {
  try {
    const { requesterEmail, targetEmail, requesterName, targetName, requesterRole, targetRole } = req.body;
    if (!requesterEmail || !targetEmail) {
      return res.status(400).json({ success: false, message: 'Missing emails.' });
    }
    
    if (isMongoConnected) {
      const existing = await AccessRequest.findOne({ requesterEmail, targetEmail });
      if (existing) {
        return res.status(400).json({ success: false, message: 'Request already exists.' });
      }
      const newReq = new AccessRequest({ requesterEmail, targetEmail, requesterName, targetName, requesterRole, targetRole });
      await newReq.save();
      return res.json({ success: true, message: 'Access request sent successfully.', request: newReq });
    } else {
      const REQUESTS_FILE = path.join(__dirname, 'data', 'accessRequests.json');
      if (!fs.existsSync(REQUESTS_FILE)) fs.writeFileSync(REQUESTS_FILE, '[]');
      const reqs = JSON.parse(fs.readFileSync(REQUESTS_FILE));
      const existing = reqs.find(r => r.requesterEmail === requesterEmail && r.targetEmail === targetEmail);
      if (existing) {
        return res.status(400).json({ success: false, message: 'Request already exists.' });
      }
      const newReq = { 
        id: Date.now().toString(), 
        requesterEmail, targetEmail, requesterName, targetName, requesterRole, targetRole, 
        status: 'Pending', createdAt: new Date().toISOString() 
      };
      reqs.push(newReq);
      fs.writeFileSync(REQUESTS_FILE, JSON.stringify(reqs, null, 2));
      return res.json({ success: true, message: 'Access request sent successfully.', request: newReq });
    }
  } catch (err) {
    console.error('Error creating access request:', err);
    res.status(500).json({ success: false, message: 'Server error creating request.' });
  }
});

// GET /api/access-requests - Fetch requests
app.get('/api/access-requests', async (req, res) => {
  try {
    const { requesterEmail } = req.query;
    const query = requesterEmail ? { requesterEmail } : {};
    
    if (isMongoConnected) {
      const reqs = await AccessRequest.find(query).sort({ createdAt: -1 });
      return res.json({ success: true, requests: reqs });
    } else {
      const REQUESTS_FILE = path.join(__dirname, 'data', 'accessRequests.json');
      if (!fs.existsSync(REQUESTS_FILE)) return res.json({ success: true, requests: [] });
      const reqs = JSON.parse(fs.readFileSync(REQUESTS_FILE));
      const filtered = requesterEmail ? reqs.filter(r => r.requesterEmail === requesterEmail) : reqs;
      return res.json({ success: true, requests: filtered.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)) });
    }
  } catch (err) {
    console.error('Error fetching access requests:', err);
    res.status(500).json({ success: false, message: 'Server error fetching requests.' });
  }
});

// PUT /api/access-requests/:id - Update status
app.put('/api/access-requests/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (isMongoConnected) {
      const updated = await AccessRequest.findByIdAndUpdate(id, { status }, { new: true });
      if (!updated) return res.status(404).json({ success: false, message: 'Request not found.' });
      return res.json({ success: true, request: updated });
    } else {
      const REQUESTS_FILE = path.join(__dirname, 'data', 'accessRequests.json');
      if (!fs.existsSync(REQUESTS_FILE)) return res.status(404).json({ success: false, message: 'Request not found.' });
      const reqs = JSON.parse(fs.readFileSync(REQUESTS_FILE));
      const idx = reqs.findIndex(r => String(r.id) === String(id) || String(r._id) === String(id));
      if (idx === -1) return res.status(404).json({ success: false, message: 'Request not found.' });
      reqs[idx].status = status;
      fs.writeFileSync(REQUESTS_FILE, JSON.stringify(reqs, null, 2));
      return res.json({ success: true, request: reqs[idx] });
    }
  } catch (err) {
    console.error('Error updating access request:', err);
    res.status(500).json({ success: false, message: 'Server error updating request.' });
  }
});

// GET /api/activities - Get all activity logs
app.get('/api/activities', async (req, res) => {
  try {
    if (isMongoConnected) {
      const activities = await Activity.find().sort({ timestamp: -1 }).lean();
      res.json({ success: true, activities });
    } else {
      const activities = getLocalActivities();
      activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      res.json({ success: true, activities });
    }
  } catch (err) {
    console.error('Error fetching activities:', err);
    res.status(500).json({ success: false, message: 'Server error fetching activities.' });
  }
});

// POST /api/activities - Log a new activity
app.post('/api/activities', async (req, res) => {
  try {
    const { actor, action, details } = req.body;
    if (!actor || !action) {
      return res.status(400).json({ success: false, message: 'Actor and Action are required.' });
    }

    if (isMongoConnected) {
      const newActivity = new Activity({ actor, action, details });
      await newActivity.save();
      res.json({ success: true, message: 'Activity logged successfully.', activity: newActivity });
    } else {
      const activities = getLocalActivities();
      const newActivity = {
        id: Date.now().toString(),
        actor,
        action,
        details,
        timestamp: new Date().toISOString()
      };
      activities.push(newActivity);
      saveLocalActivities(activities);
      res.json({ success: true, message: 'Activity logged successfully.', activity: newActivity });
    }
  } catch (err) {
    console.error('Error logging activity:', err);
    res.status(500).json({ success: false, message: 'Server error logging activity.' });
  }
});

// DELETE /api/activities/:id - Remove an activity
app.delete('/api/activities/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (isMongoConnected) {
      await Activity.findByIdAndDelete(id);
      res.json({ success: true, message: 'Activity removed successfully.' });
    } else {
      let activities = getLocalActivities();
      activities = activities.filter(a => a.id !== id && a._id !== id);
      saveLocalActivities(activities);
      res.json({ success: true, message: 'Activity removed successfully.' });
    }
  } catch (err) {
    console.error('Error deleting activity:', err);
    res.status(500).json({ success: false, message: 'Server error deleting activity.' });
  }
});

// GET /api/assignments
app.get('/api/assignments', async (req, res) => {
  try {
    if (isMongoConnected) {
      const assignments = await Assignment.find().sort({ timestamp: -1 }).lean();
      res.json({ success: true, assignments });
    } else {
      res.json({ success: true, assignments: getLocalAssignments() });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching assignments' });
  }
});

// POST /api/assignments
app.post('/api/assignments', async (req, res) => {
  try {
    const { title, description, dueDate, assignedTo, createdBy, courseTitle } = req.body;
    if (isMongoConnected) {
      const newAssignment = new Assignment({ title, description, dueDate, assignedTo, createdBy, courseTitle, submissions: [] });
      await newAssignment.save();
      res.json({ success: true, assignment: newAssignment });
    } else {
      const assignments = getLocalAssignments();
      const newAssignment = { id: Date.now().toString(), title, description, dueDate, assignedTo, createdBy, courseTitle, submissions: [], timestamp: new Date().toISOString() };
      assignments.push(newAssignment);
      saveLocalAssignments(assignments);
      res.json({ success: true, assignment: newAssignment });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error creating assignment' });
  }
});

// POST /api/assignments/:id/submit
app.post('/api/assignments/:id/submit', async (req, res) => {
  try {
    const { id } = req.params;
    const { studentEmail, fileUrl } = req.body;
    if (isMongoConnected) {
      const assignment = await Assignment.findById(id);
      if (!assignment) return res.status(404).json({ success: false, message: 'Not found' });
      
      let finalFileUrl = fileUrl;
      // Process base64 file if it's an uploaded file
      if (fileUrl && fileUrl.startsWith('data:')) {
        const ext = fileUrl.split(';')[0].split('/')[1] || 'pdf';
        finalFileUrl = saveUploadedFile(fileUrl, `submission_${studentEmail}_${Date.now()}.${ext}`);
      }

      if (!assignment.submissions) assignment.submissions = [];
      const existingIdx = assignment.submissions.findIndex(s => s.studentEmail === studentEmail);
      if (existingIdx !== -1) {
        assignment.submissions[existingIdx].fileUrl = finalFileUrl;
      } else {
        assignment.submissions.push({ studentEmail, fileUrl: finalFileUrl, grade: null, feedback: '' });
      }
      
      assignment.markModified('submissions');
      await assignment.save();
      res.json({ success: true, assignment });
    } else {
      res.status(500).json({ success: false, message: 'Local storage submit not implemented' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error submitting assignment' });
  }
});

// POST /api/assignments/:id/grade
app.post('/api/assignments/:id/grade', async (req, res) => {
  try {
    const { id } = req.params;
    const { studentEmail, grade, feedback } = req.body;
    if (isMongoConnected) {
      const assignment = await Assignment.findById(id);
      if (!assignment) return res.status(404).json({ success: false, message: 'Not found' });
      
      const existingIdx = assignment.submissions.findIndex(s => s.studentEmail === studentEmail);
      if (existingIdx !== -1) {
        assignment.submissions[existingIdx].grade = grade;
        assignment.submissions[existingIdx].feedback = feedback;
        assignment.markModified('submissions');
        await assignment.save();
        res.json({ success: true, assignment });
      } else {
        res.status(404).json({ success: false, message: 'Submission not found' });
      }
    } else {
      res.status(500).json({ success: false, message: 'Local storage grade not implemented' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error grading assignment' });
  }
});

// GET /api/certificates
app.get('/api/certificates', async (req, res) => {
  try {
    if (isMongoConnected) {
      const certificates = await Certificate.find().sort({ issueDate: -1 }).lean();
      res.json({ success: true, certificates });
    } else {
      res.json({ success: true, certificates: getLocalCertificates() });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching certificates' });
  }
});

// POST /api/certificates
app.post('/api/certificates', async (req, res) => {
  try {
    const { studentEmail, courseTitle, issuedBy, certificateUrl } = req.body;
    if (isMongoConnected) {
      const newCertificate = new Certificate({ studentEmail, courseTitle, issuedBy, certificateUrl });
      await newCertificate.save();
      res.json({ success: true, certificate: newCertificate });
    } else {
      const certificates = getLocalCertificates();
      const newCertificate = { id: Date.now().toString(), studentEmail, courseTitle, issuedBy, certificateUrl, issueDate: new Date().toISOString() };
      certificates.push(newCertificate);
      saveLocalCertificates(certificates);
      res.json({ success: true, certificate: newCertificate });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error creating certificate' });
  }
});

// GET /api/company-courses
app.get('/api/company-courses', async (req, res) => {
  try {
    const { status } = req.query;
    if (isMongoConnected) {
      const query = status ? { status } : {};
      const courses = await CompanyCourse.find(query).sort({ createdAt: -1 });
      res.json({ success: true, courses });
    } else {
      let courses = getLocalCompanyCourses();
      if (status) courses = courses.filter(c => c.status === status);
      res.json({ success: true, courses: courses.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)) });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching company courses' });
  }
});

// POST /api/company-courses
app.post('/api/company-courses', async (req, res) => {
  try {
    const { title, syllabus, image, price, originalPrice, companyName, totalDurationHours, trainingDays, startDate, dailyStartTime, tags } = req.body;
    const generatedSchedule = generateSchedule(startDate, dailyStartTime, totalDurationHours, trainingDays);
    
    if (isMongoConnected) {
      const newCourse = new CompanyCourse({
        id: Date.now().toString(),
        title, syllabus, image: image && image.startsWith('data:') ? saveUploadedFile(image, `company_course_${Date.now()}.png`) : image, price, originalPrice, companyName, tags, status: 'pending',
        totalDurationHours: totalDurationHours || 0,
        trainingDays: trainingDays || 0,
        startDate: startDate || null,
        dailyStartTime: dailyStartTime || '',
        schedule: generatedSchedule
      });
      await newCourse.save();
      res.json({ success: true, course: newCourse });
    } else {
      const newCourse = {
        id: Date.now().toString(),
        title, syllabus, image: image && image.startsWith('data:') ? saveUploadedFile(image, `company_course_${Date.now()}.png`) : image, price, originalPrice, companyName, tags, status: 'pending',
        totalDurationHours: totalDurationHours || 0,
        trainingDays: trainingDays || 0,
        startDate: startDate || null,
        dailyStartTime: dailyStartTime || '',
        schedule: generatedSchedule,
        createdAt: new Date().toISOString()
      };
      const courses = getLocalCompanyCourses();
      courses.push(newCourse);
      saveLocalCompanyCourses(courses);
      res.json({ success: true, course: newCourse });
    }
  } catch (err) {
    console.error("POST /api/company-courses error:", err);
    res.status(500).json({ success: false, message: 'Error creating company course' });
  }
});

// PUT /api/company-courses/:id (Edit Course)
app.put('/api/company-courses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, syllabus, image, price, originalPrice, totalDurationHours, trainingDays, startDate, dailyStartTime, tags } = req.body;
    const generatedSchedule = generateSchedule(startDate, dailyStartTime, totalDurationHours, trainingDays);
    if (isMongoConnected) {
      const course = await CompanyCourse.findById(id).catch(() => CompanyCourse.findOne({ id }));
      if (course) {
        if (title) course.title = title;
        if (syllabus) course.syllabus = syllabus;
        if (image !== undefined) {
          if (image && image.startsWith('data:')) {
            course.image = saveUploadedFile(image, `company_course_${Date.now()}.png`);
          } else {
            course.image = image;
          }
        }
        if (price !== undefined) course.price = price;
        if (originalPrice !== undefined) course.originalPrice = originalPrice;
        
        if (totalDurationHours !== undefined) course.totalDurationHours = totalDurationHours;
        if (trainingDays !== undefined) course.trainingDays = trainingDays;
        if (startDate !== undefined) course.startDate = startDate;
        if (dailyStartTime !== undefined) course.dailyStartTime = dailyStartTime;
        if (generatedSchedule.length > 0) course.schedule = generatedSchedule;
        if (tags !== undefined) course.tags = tags;
        
        await course.save();
        res.json({ success: true, course });
      } else {
        res.status(404).json({ success: false, message: 'Course not found' });
      }
    } else {
      const courses = getLocalCompanyCourses();
      const courseIndex = courses.findIndex(c => c.id === id || c._id === id);
      if (courseIndex !== -1) {
        if (title) courses[courseIndex].title = title;
        if (syllabus) courses[courseIndex].syllabus = syllabus;
        if (image !== undefined) courses[courseIndex].image = image;
        if (price !== undefined) courses[courseIndex].price = price;
        if (originalPrice !== undefined) courses[courseIndex].originalPrice = originalPrice;
        
        if (totalDurationHours !== undefined) courses[courseIndex].totalDurationHours = totalDurationHours;
        if (trainingDays !== undefined) courses[courseIndex].trainingDays = trainingDays;
        if (startDate !== undefined) courses[courseIndex].startDate = startDate;
        if (dailyStartTime !== undefined) courses[courseIndex].dailyStartTime = dailyStartTime;
        if (generatedSchedule.length > 0) courses[courseIndex].schedule = generatedSchedule;
        
        saveLocalCompanyCourses(courses);
        res.json({ success: true, course: courses[courseIndex] });
      } else {
        res.status(404).json({ success: false, message: 'Course not found' });
      }
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error updating course' });
  }
});

// PUT /api/company-courses/:id/approve
app.put('/api/company-courses/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    if (isMongoConnected) {
      // Find by id whether it's ObjectId or string
      const course = await CompanyCourse.findById(id).catch(() => CompanyCourse.findOne({ id }));
      if (course) {
        course.status = 'approved';
        await course.save();
        res.json({ success: true, course });
      } else {
        res.status(404).json({ success: false, message: 'Course not found' });
      }
    } else {
      const courses = getLocalCompanyCourses();
      const courseIndex = courses.findIndex(c => c.id === id || c._id === id);
      if (courseIndex !== -1) {
        courses[courseIndex].status = 'approved';
        saveLocalCompanyCourses(courses);
        res.json({ success: true, course: courses[courseIndex] });
      } else {
        res.status(404).json({ success: false, message: 'Course not found' });
      }
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error approving company course' });
  }
});

// --- JOB OFFERS API ---

// GET /api/jobs
app.get('/api/jobs', async (req, res) => {
  try {
    const { companyId, studentId } = req.query;
    if (isMongoConnected) {
      let query = {};
      if (companyId) query.companyId = companyId;
      if (studentId) query.targetedStudents = studentId;
      const jobs = await JobOffer.find(query).sort({ createdAt: -1 });
      res.json({ success: true, jobs });
    } else {
      let jobs = getLocalJobOffers();
      if (companyId) jobs = jobs.filter(j => j.companyId === companyId);
      if (studentId) jobs = jobs.filter(j => j.targetedStudents && j.targetedStudents.includes(studentId));
      res.json({ success: true, jobs: jobs.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)) });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching jobs' });
  }
});

// POST /api/jobs
app.post('/api/jobs', async (req, res) => {
  try {
    const { companyId, title, description, requirements } = req.body;
    if (isMongoConnected) {
      const newJob = new JobOffer({
        companyId, title, description, requirements, status: 'Pending'
      });
      await newJob.save();
      res.json({ success: true, job: newJob });
    } else {
      const newJob = {
        _id: Date.now().toString(),
        companyId, title, description, requirements, status: 'Pending',
        targetedStudents: [], selectedStudents: [],
        createdAt: new Date().toISOString()
      };
      const jobs = getLocalJobOffers();
      jobs.push(newJob);
      saveLocalJobOffers(jobs);
      res.json({ success: true, job: newJob });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error creating job offer' });
  }
});

// PUT /api/jobs/:id/send
app.put('/api/jobs/:id/send', async (req, res) => {
  try {
    const { id } = req.params;
    const { studentIds } = req.body; // Array of student IDs or emails

    let jobObj;
    if (isMongoConnected) {
      const job = await JobOffer.findById(id);
      if (job) {
        job.targetedStudents = studentIds;
        job.status = 'SentToStudents';
        await job.save();
        jobObj = job;
      }
    } else {
      const jobs = getLocalJobOffers();
      const jobIndex = jobs.findIndex(j => String(j._id) === String(id) || String(j.id) === String(id));
      if (jobIndex !== -1) {
        jobs[jobIndex].targetedStudents = studentIds;
        jobs[jobIndex].status = 'SentToStudents';
        saveLocalJobOffers(jobs);
        jobObj = jobs[jobIndex];
      }
    }

    if (!jobObj) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;
    
    // Notification for dashboard
    const jobNotification = {
      id: `job_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      sender: 'Super Admin',
      text: `You have received a new job offer: ${jobObj.title}. Check your job offers section!`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString(),
      createdAt: new Date()
    };

    let studentEmails = [];
    if (isMongoConnected) {
      const users = await User.find({ $or: [{ _id: { $in: studentIds } }, { email: { $in: studentIds } }] });
      studentEmails = users.map(u => u.email);
      
      // Push notification to targeted students
      await User.updateMany(
        { _id: { $in: users.map(u => u._id) } },
        { $push: { notifications: { $each: [jobNotification], $position: 0 } } }
      );
    } else {
      const localUsers = getLocalUsers();
      const targeted = localUsers.filter(u => studentIds.includes(String(u._id)) || studentIds.includes(String(u.id)) || studentIds.includes(u.email));
      studentEmails = targeted.map(u => u.email);
      
      // Push notification to targeted students
      let changed = false;
      studentEmails.forEach(email => {
        const uIdx = localUsers.findIndex(u => u.email === email);
        if (uIdx !== -1) {
          localUsers[uIdx].notifications = localUsers[uIdx].notifications || [];
          localUsers[uIdx].notifications.unshift(jobNotification);
          changed = true;
        }
      });
      if (changed) {
        fs.writeFileSync(USERS_FILE, JSON.stringify(localUsers, null, 2));
      }
    }

    // Attempt to send emails
    if (emailUser && emailPass && emailPass !== 'your_gmail_app_password_here') {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: emailUser, pass: emailPass },
      });

      // Fetch Company Name for the beautiful template
      let companyName = 'Our Partner Company';
      if (isMongoConnected) {
        try {
          const cUser = await User.findById(jobObj.companyId);
          if (cUser) companyName = cUser.companyName || cUser.fullName || companyName;
        } catch(e) {}
      } else {
        const localUsers = getLocalUsers();
        const cUser = localUsers.find(u => String(u._id) === String(jobObj.companyId) || String(u.id) === String(jobObj.companyId));
        if (cUser) companyName = cUser.companyName || cUser.fullName || companyName;
      }

      for (const studentEmail of studentEmails) {
        try {
          await transporter.sendMail({
            from: `"MBK Tech Careers" <${emailUser}>`,
            to: studentEmail,
            subject: `Job Offer: ${jobObj.title} at ${companyName}`,
            html: `
              <div style="font-family: 'Inter', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #eaeaea;">
                <div style="background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); padding: 30px; text-align: center;">
                  <img src="cid:mbk_logo" alt="MBK Technology Logo" style="width: 100px; height: 100px; object-fit: cover; border-radius: 50%; margin-bottom: 15px; border: 3px solid rgba(255,255,255,0.3); box-shadow: 0 4px 10px rgba(0,0,0,0.1);" />
                  <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 0.5px;">Job Offer Notification</h1>
                  <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 15px;">A new opportunity awaits you!</p>
                </div>
                
                <div style="padding: 30px;">
                  <p style="color: #334155; font-size: 16px; margin-top: 0;">Hello,</p>
                  <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                    We are excited to inform you that <strong>${companyName}</strong> is looking to hire a <strong>${jobObj.title}</strong> and your profile matches their requirements!
                  </p>

                  <div style="background: #f8fafc; border-left: 4px solid #6366f1; padding: 20px; border-radius: 0 8px 8px 0; margin: 25px 0;">
                    <h3 style="margin: 0 0 10px 0; color: #1e293b; font-size: 18px;">${jobObj.title}</h3>
                    <p style="margin: 0 0 15px 0; color: #64748b; font-size: 15px;">${jobObj.description || 'Exciting role at a fast-growing company.'}</p>
                    
                    <div style="border-top: 1px solid #e2e8f0; padding-top: 15px;">
                      <p style="margin: 0 0 8px 0; font-size: 14px; color: #475569;"><strong>🎓 Degree:</strong> ${jobObj.requirements?.degree || 'Any'}</p>
                      <p style="margin: 0 0 8px 0; font-size: 14px; color: #475569;"><strong>⏱️ Experience:</strong> ${jobObj.requirements?.experience || 'Any'}</p>
                      <p style="margin: 0; font-size: 14px; color: #475569;"><strong>💻 Skills:</strong> ${jobObj.requirements?.skills?.join(', ') || 'Not specified'}</p>
                    </div>
                  </div>

                  <p style="color: #475569; font-size: 15px; line-height: 1.6;">
                    Don't miss out on this opportunity! Log in to your MBK LMS dashboard to review the details and proceed with the next steps.
                  </p>

                  <div style="text-align: center; margin: 30px 0;">
                    <a href="http://localhost:5173/login" style="background: #4F46E5; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block;">View on Dashboard</a>
                  </div>

                  <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
                  
                  <p style="color: #94a3b8; font-size: 13px; text-align: center; margin: 0;">
                    Best regards,<br/>
                    <strong style="color: #64748b;">MBK Tech Placement Team</strong>
                  </p>
                </div>
              </div>
            `,
            attachments: [
              {
                filename: 'mbk_logo.png',
                path: path.join(__dirname, 'assets', 'mbk_logo.png'),
                cid: 'mbk_logo'
              }
            ]
          });
          console.log(`Job offer email sent to ${studentEmail}`);
        } catch (mailErr) {
          console.error(`Failed to send email to ${studentEmail}:`, mailErr);
        }
      }
    } else {
      console.log('Email credentials not configured, skipped sending email. Notifications updated in dashboard.');
    }

    res.json({ success: true, job: jobObj });
  } catch (err) {
    console.error('Error sending job:', err);
    res.status(500).json({ success: false, message: 'Error sending job' });
  }
});

// PUT /api/jobs/:id/select
app.put('/api/jobs/:id/select', async (req, res) => {
  try {
    const { id } = req.params;
    const { studentId } = req.body;
    if (isMongoConnected) {
      const job = await JobOffer.findById(id);
      if (job) {
        if (!job.selectedStudents) job.selectedStudents = [];
        if (!job.selectedStudents.includes(studentId)) {
          job.selectedStudents.push(studentId);
        }
        await job.save();
        res.json({ success: true, job });
      } else {
        res.status(404).json({ success: false, message: 'Job not found' });
      }
    } else {
      const jobs = getLocalJobOffers();
      const jobIndex = jobs.findIndex(j => j._id === id);
      if (jobIndex !== -1) {
        if (!jobs[jobIndex].selectedStudents) jobs[jobIndex].selectedStudents = [];
        if (!jobs[jobIndex].selectedStudents.includes(studentId)) {
          jobs[jobIndex].selectedStudents.push(studentId);
        }
        saveLocalJobOffers(jobs);
        res.json({ success: true, job: jobs[jobIndex] });
      } else {
        res.status(404).json({ success: false, message: 'Job not found' });
      }
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error selecting student' });
  }
});

// GET /api/requests
app.get('/api/requests', async (req, res) => {
  try {
    if (isMongoConnected) {
      const requests = await AccessRequest.find({}).sort({ createdAt: -1 });
      res.json({ success: true, requests });
    } else {
      const requests = getLocalRequests();
      res.json({ success: true, requests: requests.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)) });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching requests' });
  }
});

// POST /api/requests
app.post('/api/requests', async (req, res) => {
  try {
    const { requesterEmail, targetEmail, requesterName, targetName, requesterRole, targetRole, requestType } = req.body;
    if (isMongoConnected) {
      const newRequest = new AccessRequest({ requesterEmail, targetEmail, requesterName, targetName, requesterRole, targetRole, requestType });
      await newRequest.save();
      res.json({ success: true, request: newRequest });
    } else {
      const newRequest = {
        id: Date.now().toString(),
        requesterEmail, targetEmail, requesterName, targetName, requesterRole, targetRole, requestType,
        status: 'Pending',
        createdAt: new Date().toISOString()
      };
      saveLocalRequest(newRequest);
      res.json({ success: true, request: newRequest });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error creating request' });
  }
});

// DELETE /api/requests/:id
app.delete('/api/requests/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (isMongoConnected) {
      await AccessRequest.findByIdAndDelete(id);
      res.json({ success: true, message: 'Request removed successfully.' });
    } else {
      let requests = getLocalRequests();
      requests = requests.filter(r => r.id !== id && r._id !== id);
      fs.writeFileSync(REQUESTS_FILE, JSON.stringify(requests, null, 2));
      res.json({ success: true, message: 'Request removed successfully.' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error deleting request' });
  }
});

// --- Razorpay Integration ---
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID ? process.env.RAZORPAY_KEY_ID.trim() : '',
  key_secret: process.env.RAZORPAY_SECRET ? process.env.RAZORPAY_SECRET.trim() : '',
});

app.post('/api/payment/orders', async (req, res) => {
  try {
    const options = {
      amount: req.body.amount * 100, // amount in smallest currency unit
      currency: "INR",
      receipt: "receipt_order_" + Date.now(),
    };
    const order = await razorpayInstance.orders.create(options);
    if (!order) return res.status(500).json({ success: false, message: "Some error occured" });
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error", error });
  }
});

app.post('/api/payment/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET || '')
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      return res.status(200).json({ success: true, message: "Payment verified successfully" });
    } else {
      return res.status(400).json({ success: false, message: "Invalid signature sent!" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error!" });
  }
});

const server = httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Keep the process alive — prevents Node from exiting when mongoose disconnects
server.on('error', (err) => {
  console.error('Server error:', err);
});

// Heartbeat to keep the event loop alive (mongoose disconnect can drain it)
setInterval(() => {}, 1000 * 60 * 30); // 30-min no-op timer
