import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  BarElement
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import {
  GraduationCap,
  Home,
  BookOpen,
  Video,
  BarChart3,
  ClipboardList,
  Award,
  Users,
  Presentation,
  UserCog,
  Building2,
  User,
  Settings,
  LogOut,
  Menu,
  Search,
  Bell,
  ChevronDown,
  Pencil,
  BadgeCheck,
  Phone,
  Mail,
  School,
  Star,
  TrendingUp,
  Calendar,
  Code2,
  Layers,
  ArrowRight,
  Hash,
  MapPin,
  Landmark,
  Trophy,
  RefreshCw,
  Clock,
  ArrowUpRight,
  FileText,
  FileQuestion,
  NotebookPen,
  CalendarDays,
  Bot,
  ShieldCheck,
  LayoutDashboard,
} from "lucide-react";
import '../styles/Dashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Reusable Circular SVG Progress Ring Component
const ProgressRing = ({ percentage }) => {
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  return (
    <div style={{ position: 'relative', width: '54px', height: '54px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <svg className="w-[54px] h-[54px] transform -rotate-90">
        <circle cx="27" cy="27" r="22" stroke="#E7E9F5" strokeWidth="3.5" fill="transparent" />
        <circle 
          cx="27" 
          cy="27" 
          r="22" 
          stroke="#FF8A3D" 
          strokeWidth="3.5" 
          fill="transparent"
          strokeDasharray={circumference} 
          strokeDashoffset={strokeDashoffset} 
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.35s' }} 
        />
      </svg>
      <span style={{ position: 'absolute', fontSize: '11px', fontFamily: "'Inter', sans-serif", fontWeight: 700, color: '#1B1F3B' }}>{percentage}%</span>
    </div>
  );
};

const sidebarItems = [
  { icon: Home, label: "Dashboard" },
  { icon: BookOpen, label: "My Courses" },
  { icon: Video, label: "Live Classes" },
  { icon: ClipboardList, label: "Assignments" },
  { icon: Award, label: "Certificates" },
  { icon: Users, label: "Students Directory" },
  { icon: UserCog, label: "Trainers Directory" },
  { icon: Building2, label: "Companies Directory" },
  { icon: User, label: "Profile" },
  { icon: Settings, label: "Settings" },
];

const statCards = [
  {
    icon: BookOpen,
    iconBg: "bg-violet-650",
    value: "12",
    label: "Courses Enrolled",
    sub: "Active Courses",
    subColor: "text-violet-600",
  },
  {
    icon: Award,
    iconBg: "bg-emerald-500",
    value: "08",
    label: "Certificates Earned",
    sub: "View Certificates",
    subColor: "text-emerald-600",
  },
  {
    icon: TrendingUp,
    iconBg: "bg-orange-500",
    value: "78%",
    label: "Learning Progress",
    sub: "Keep Learning",
    subColor: "text-orange-500",
  },
  {
    icon: Calendar,
    iconBg: "bg-blue-500",
    value: "21 Days",
    label: "Current Streak",
    sub: "You're Doing Great!",
    subColor: "text-blue-500",
  },
  {
    icon: Star,
    iconBg: "bg-rose-500",
    value: "1,250",
    label: "Skill Points",
    sub: "Keep Growing",
    subColor: "text-rose-500",
  },
];

const skills = ["React", "Python", "JavaScript", "Node.js", "MongoDB", "HTML", "CSS", "Git"];

const academicDetails = [
  { icon: Building2, label: "College", value: "Mahendra Institution" },
  { icon: Code2, label: "Department", value: "Computer Science Engineering" },
  { icon: Layers, label: "Academic Year", value: "IV Year" },
  { icon: ClipboardList, label: "Register Number", value: "MIU20CS123" },
];

const academicRows = [
  { icon: GraduationCap, label: "College", value: "Mahendra Institution" },
  { icon: Code2, label: "Department", value: "Computer Science Engineering" },
  { icon: Calendar, label: "Academic Year", value: "IV Year" },
  { icon: Hash, label: "Register Number", value: "MIU20CS123" },
];

const achievements = [
  {
    icon: Award,
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    title: "React Developer Certificate",
    sub: "Issued by MBK Tech",
    date: "Apr 20, 2024",
  },
  {
    icon: Trophy,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    title: "Top Performer",
    sub: "Scored highest in React Assessment",
    date: "Mar 15, 2024",
  },
  {
    icon: Star,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-500",
    title: "Python Programming",
    sub: "Certificate of Completion",
    date: "Feb 28, 2024",
  },
];

const cardStyle = {
  background: "#fff",
  border: "1px solid #eef0f3",
  borderRadius: 14,
  padding: "20px 24px",
  flex: 1,
  textAlign: "left",
};

function CardHeader({ icon: Icon, title }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, paddingBottom: 12, borderBottom: "1px solid #f1f2f4" }}>
      <Icon size={16} color="#1f2937" />
      <span style={{ fontWeight: 700, fontSize: 14.5, color: "#1f2937" }}>{title}</span>
    </div>
  );
}

function HeroBanner() {
  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 16,
        background: "linear-gradient(120deg,#c7d2fb 0%,#dbe3fd 45%,#e9edfd 100%)",
        padding: "36px 40px",
        display: "flex",
        alignItems: "center",
        gap: 24,
        textAlign: "left"
      }}
    >
      {/* decorative wave */}
      <svg
        viewBox="0 0 1000 300"
        preserveAspectRatio="none"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.5 }}
      >
        <path
          d="M0,180 C200,100 350,260 550,170 C700,105 850,220 1000,140 L1000,300 L0,300 Z"
          fill="#ffffff"
          opacity="0.35"
        />
        <path
          d="M0,220 C220,150 380,280 600,200 C760,145 880,250 1000,190 L1000,300 L0,300 Z"
          fill="#ffffff"
          opacity="0.25"
        />
      </svg>

      <div
        style={{
          width: 108,
          height: 108,
          borderRadius: "50%",
          padding: 3,
          background: "#fff",
          zIndex: 1,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            background: "linear-gradient(160deg,#6b7280,#9ca3af)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: 34,
            fontWeight: 700,
          }}
        >
          T
        </div>
      </div>

      <div style={{ zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 28, fontWeight: 700, color: "#1e293b" }}>Tharaneesh</span>
          <BadgeCheck size={20} color="#2563eb" fill="#2563eb" strokeWidth={1.5} />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
          <span style={{ fontSize: 13.5, color: "#374151" }}>Student Member</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 10, flexWrap: "wrap" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#374151" }}>
            <MapPin size={14} /> IV Year CSE
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#374151" }}>
            <Landmark size={14} /> Mahendra Institution
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#374151" }}>
            <Phone size={14} /> 6369067085
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8, fontSize: 13, color: "#374151" }}>
          <Mail size={14} /> tharaneeshkp@gmail.com
        </div>
      </div>
    </div>
  );
}

function AboutMeCard() {
  return (
    <div style={cardStyle}>
      <CardHeader icon={User} title="About Me" />
      <p style={{ fontSize: 13.5, color: "#4b5563", lineHeight: 1.7, marginTop: 12 }}>
        Passionate about Full Stack Development and problem solving. Always eager to learn new
        technologies and build impactful solutions.
      </p>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#1f2937", marginTop: 18, marginBottom: 10 }}>
        Skills
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {skills.map((s) => (
          <span
            key={s}
            style={{
              background: "#dbeafe",
              color: "#1d4ed8",
              fontSize: 12.5,
              padding: "5px 12px",
              borderRadius: 20,
              fontWeight: 500,
            }}
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

function AcademicDetailsCard() {
  return (
    <div style={cardStyle}>
      <CardHeader icon={GraduationCap} title="Academic Details" />
      <div style={{ marginTop: 10 }}>
        {academicRows.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 0",
              borderBottom: "1px solid #f1f2f4",
            }}
          >
            <Icon size={15} color="#6b7280" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: "#6b7280", width: 130, flexShrink: 0 }}>{label}</span>
            <span style={{ fontSize: 13.5, color: "#1f2937", fontWeight: 500 }}>{value}</span>
          </div>
        ))}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0" }}>
          <TrendingUp size={15} color="#6b7280" style={{ flexShrink: 0 }} />
          <span style={{ fontSize: 13, color: "#6b7280", width: 130, flexShrink: 0 }}>CGPA</span>
          <span style={{ fontSize: 13.5, color: "#1f2937", fontWeight: 500 }}>8.62 / 10</span>
          <span
            style={{
              marginLeft: 8,
              background: "#d1fae5",
              color: "#059669",
              fontSize: 11.5,
              fontWeight: 600,
              padding: "3px 10px",
              borderRadius: 20,
            }}
          >
            Excellent
          </span>
        </div>
      </div>
    </div>
  );
}

function ProfileCompletionCard() {
  const pct = 85;
  const r = 30;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;

  return (
    <div
      style={{
        ...cardStyle,
        marginTop: 24,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 20,
        flexWrap: "wrap",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <svg width="72" height="72" viewBox="0 0 72 72">
          <circle cx="36" cy="36" r={r} fill="none" stroke="#e5e7eb" strokeWidth="6" />
          <circle
            cx="36"
            cy="36"
            r={r}
            fill="none"
            stroke="#2563eb"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
            transform="rotate(-90 36 36)"
          />
          <text x="36" y="41" textAnchor="middle" fontSize="14" fontWeight="700" fill="#1f2937">
            {pct}%
          </text>
        </svg>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, color: "#1f2937" }}>Profile Completion</div>
          <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4, maxWidth: 380 }}>
            You're almost there! Complete your profile to get better recommendations and opportunities.
          </div>
        </div>
      </div>

      <button
        style={{
          background: "#0c2540",
          color: "#fff",
          border: "none",
          borderRadius: 10,
          padding: "12px 22px",
          fontSize: 13.5,
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: 8,
          cursor: "pointer",
        }}
      >
        Complete Profile <ArrowRight size={15} />
      </button>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Student specific state
  const [newSkill, setNewSkill] = useState('');
  const [skills, setSkills] = useState(['Python', 'Java', 'React']);
  
  // Company specific state
  const [applicants, setApplicants] = useState([
    { id: 1, name: 'John Doe', skills: 'Python, Django, SQL', status: 'Pending Review', isApproved: false },
    { id: 2, name: 'Sarah Connor', skills: 'React, Node, MongoDB', status: 'Shortlisted', isApproved: true },
    { id: 3, name: 'David Miller', skills: 'Java, Spring, Hibernate', status: 'Applied', isApproved: false }
  ]);

  const [jobs, setJobs] = useState([
    { id: 1, title: 'Python Backend Developer', location: 'Salem (Remote)', experience: '1-3 Years', applicants: 12 },
    { id: 2, title: 'Frontend Developer (React)', location: 'Chennai (Hybrid)', experience: 'Freshers', applicants: 24 }
  ]);

  // Trainer specific state
  const [trainerCourses, setTrainerCourses] = useState([
    { id: 1, title: 'Python Full Stack Bootcamp', enrolled: 120, revenue: '$2,400' },
    { id: 2, title: 'Advanced Java Programming', enrolled: 80, revenue: '$1,600' }
  ]);

  const [trainerClasses, setTrainerClasses] = useState([
    { id: 1, batch: 'Python Batch A', date: 'June 30', time: '10:00 AM' },
    { id: 2, batch: 'Java Batch B', date: 'July 1', time: '02:00 PM' }
  ]);

  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Google Cloud recruiters are looking for Python Developers.' },
    { id: 2, text: 'New assignment uploaded in Java BootCamp.' },
    { id: 3, text: 'Your resume draft has been auto-generated successfully.' }
  ]);

  // Additional mock states for all requested views
  const [studentAssignments, setStudentAssignments] = useState([
    { id: 1, title: 'Python Basics & Functions', course: 'Python Full Stack Bootcamp', status: 'Submitted', grade: 'A', deadline: 'July 10, 2026' },
    { id: 2, title: 'DOM Manipulation & Event Listeners', course: 'Frontend Developer (React)', status: 'Pending', grade: '-', deadline: 'July 15, 2026' },
    { id: 3, title: 'Database Design & SQL Joins', course: 'Python Full Stack Bootcamp', status: 'Pending', grade: '-', deadline: 'July 20, 2026' }
  ]);

  const [studentCertificates, setStudentCertificates] = useState([
    { id: 1, title: 'Responsive Web Design Mastery', issueDate: 'May 14, 2026', credentialId: 'MBK-CS-89210' }
  ]);

  const [messages, setMessages] = useState([
    { id: 1, sender: 'Admin Support', text: 'Welcome to MBK CarrierZ LMS! Keep your profile updated to attract recruiters.', time: '2 hours ago' },
    { id: 2, sender: 'Trainer John', text: 'Please submit your DOM Manipulation assignments by tomorrow night.', time: '1 day ago' },
    { id: 3, sender: 'MBK Placements', text: 'Google and Tech Mahindra drives are active. Apply from Job Opportunities.', time: '3 days ago' }
  ]);

  const [companyInterviews, setCompanyInterviews] = useState([
    { id: 1, candidate: 'Sarah Connor', role: 'React Developer', date: 'July 8, 2026', time: '11:00 AM', status: 'Scheduled' },
    { id: 2, candidate: 'David Miller', role: 'Java Developer', date: 'July 12, 2026', time: '02:30 PM', status: 'Scheduled' }
  ]);

  const [companyHired, setCompanyHired] = useState([
    { id: 1, name: 'John Doe', role: 'Python Backend Developer', date: 'June 25, 2026' }
  ]);

  const [trainerAttendance, setTrainerAttendance] = useState([
    { id: 1, batchName: 'Python Batch A', date: 'Today', present: 28, absent: 2 },
    { id: 2, batchName: 'Java Batch B', date: 'Today', present: 24, absent: 1 }
  ]);

  const [newMessageText, setNewMessageText] = useState('');

  const [allCourses, setAllCourses] = useState([]);
  const [studentActiveTab, setStudentActiveTab] = useState('My Courses');
  const [activeSidebarTab, setActiveSidebarTab] = useState('Dashboard');
  const [toast, setToast] = useState(null);

  const [directoryUsers, setDirectoryUsers] = useState([]);
  const [viewingProfile, setViewingProfile] = useState(null);
  const [loadingDirectory, setLoadingDirectory] = useState(false);

  const fetchDirectoryUsers = async () => {
    setLoadingDirectory(true);
    try {
      const res = await fetch('/api/directory');
      const data = await res.json();
      if (data.success) {
        setDirectoryUsers(data.users || []);
      }
    } catch (err) {
      console.error('Error fetching directory:', err);
    } finally {
      setLoadingDirectory(false);
    }
  };

  const handleViewProfile = async (targetUser) => {
    // Notify target user
    try {
      await fetch(`/api/users/${targetUser.email}/view-profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          viewerEmail: user.email,
          viewerName: user.fullName || user.email,
          viewerRole: user.role
        })
      });
    } catch (err) {
      console.error('Error sending view notification:', err);
    }

    // Fetch details
    try {
      const res = await fetch(`/api/users/${targetUser.email}?requester=${user.email}`);
      const data = await res.json();
      if (data.success) {
        setViewingProfile(data.user);
      } else {
        showToast(data.message || 'Failed to load profile details.', 'error');
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      showToast('Network error loading profile details.', 'error');
    }
  };

  const handleRequestAccess = async (targetEmail, targetName, targetRole) => {
    try {
      const res = await fetch('/api/access-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requesterEmail: user.email,
          targetEmail: targetEmail,
          requesterName: user.fullName || user.email,
          targetName: targetName || targetEmail,
          requesterRole: user.role,
          targetRole: targetRole
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast('Access request submitted successfully!');
        if (viewingProfile && viewingProfile.email === targetEmail) {
          setViewingProfile(prev => ({ ...prev, accessRequestStatus: 'Pending' }));
        }
      } else {
        showToast(data.message || 'Failed to submit request.', 'error');
      }
    } catch (err) {
      console.error('Error submitting access request:', err);
      showToast('Network error submitting request.', 'error');
    }
  };

  useEffect(() => {
    if (activeSidebarTab.includes('Directory') || activeSidebarTab === 'Students') {
      fetchDirectoryUsers();
    }
  }, [activeSidebarTab]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchUserProfile = async (email) => {
    try {
      const res = await fetch(`/api/users/${email}?requester=${email}`);
      const data = await res.json();
      if (data.success) {
        const u = data.user;
        if (u && !u.role) {
          u.role = 'student';
        }
        setUser(u);

        // Merge backend notifications into messages state
        if (u.notifications && u.notifications.length > 0) {
          setMessages(prev => {
            const existingIds = new Set(prev.map(m => m.id));
            const newMsgs = u.notifications
              .filter(n => !existingIds.has(n.id))
              .map(n => ({
                id: n.id,
                sender: n.sender || 'System Alert',
                text: n.text,
                time: n.time || 'Just now'
              }));
            return [...newMsgs, ...prev];
          });
        }
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/courses');
      const data = await res.json();
      if (data.success) {
        setAllCourses(data.courses || []);
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
    }
  };

  const handleBuyCourse = async (courseTitle) => {
    try {
      const res = await fetch('/api/users/buy-course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, courseTitle })
      });
      const data = await res.json();
      if (data.success) {
        showToast('Course purchased successfully!');
        setUser(prev => {
          const updated = {
            ...prev,
            assignedCourses: data.courses
          };
          localStorage.setItem('user', JSON.stringify(updated));
          return updated;
        });
      } else {
        showToast(data.message || 'Failed to purchase course.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Network error purchasing course.', 'error');
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
    } else {
      const parsedUser = JSON.parse(storedUser);
      if (!parsedUser.role) {
        parsedUser.role = 'student';
      }
      setUser(parsedUser);
      fetchUserProfile(parsedUser.email);
      fetchCourses();
    }
  }, [navigate]);

  const handleSignOut = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getBase64ImageFromUrl = async (imageUrl) => {
    try {
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.addEventListener("load", () => resolve(reader.result), false);
        reader.addEventListener("error", () => reject(this), false);
        reader.readAsDataURL(blob);
      });
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const handleDownloadResume = (studentName) => {
    if (!window.jspdf) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
      script.onload = () => generatePDF(studentName);
      document.body.appendChild(script);
    } else {
      generatePDF(studentName);
    }
  };

  const generatePDF = async (studentName) => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    try {
      const logoBase64 = await getBase64ImageFromUrl('/logo.png');
      if (logoBase64) {
        doc.addImage(logoBase64, 'PNG', 15, 10, 20, 20);
      }
    } catch (err) {
      console.error("Failed to add logo:", err);
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(0, 95, 122);
    doc.text("MBK CarrierZ", 40, 19);

    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text("Professional Career Profile Resume", 40, 25);
    doc.line(15, 33, 195, 33);

    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text(`Name: ${studentName}`, 15, 45);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Email: ${user.email || 'tharaneeshkp@gmail.com'}`, 15, 53);
    doc.text(`Phone: ${user.phone || '6969067085'}`, 15, 59);
    doc.text(`Location: ${user.district || 'Salem'}, Tamil Nadu`, 15, 65);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 95, 122);
    doc.text("EDUCATION DETAILS", 15, 77);
    doc.line(15, 79, 195, 79);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(15, 23, 42);
    doc.text(`College: ${user.college || 'Government College of Engineering'}`, 15, 87);
    doc.text(`Department: ${user.department || 'Computer Science & Engineering'}`, 15, 93);
    doc.text(`Year of Study: ${user.year || 'IV Year'}`, 15, 99);
    doc.text("Academic CGPA: 8.5 / 10.0", 15, 105);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 95, 122);
    doc.text("TECHNICAL SKILLS", 15, 117);
    doc.line(15, 119, 195, 119);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(15, 23, 42);
    doc.text("Programming: Python, Java, JavaScript (React), Node.js, SQL", 15, 127);
    doc.text("Database & Tools: MongoDB, MySQL, Git, Docker, Postman", 15, 133);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 95, 122);
    doc.text("PROJECTS & INTERNSHIPS", 15, 145);
    doc.line(15, 147, 195, 147);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(15, 23, 42);
    doc.text("Project Title: MBK LMS Platform", 15, 155);
    doc.text("Description: An enterprise learning management system with student progress tracking,", 15, 161);
    doc.text("automated resume generation, and customized placement dashboard functionalities.", 15, 167);

    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.text("Generated automatically via MBK CarrierZ portal. All credentials verified.", 15, 275);

    doc.save(`${studentName.replace(/\s+/g, '_')}_Resume.pdf`);
    showToast('Resume downloaded in PDF format!');
  };

  // Coding Bootcamp Design System variables
  const theme = {
    bg: '#FFFDFB',
    cardBg: '#FFFFFF',
    text: '#0F172A',
    subText: '#64748B',
    border: 'rgba(0,0,0,0.04)',
    primary: '#FF6B00',
    accent: '#FF9F43',
    success: '#10B981',
  };

  const getSidebarItems = () => {
    switch (user.role) {
      case 'student':
        return [
          { name: 'Dashboard', icon: '📊' },
          { name: 'My Courses', icon: '📚' },
          { name: 'Live Classes', icon: '🎥' },
          { name: 'Assignments', icon: '📝' },
          { name: 'Certificates', icon: '🎓' },
          { name: 'Students Directory', icon: '👨‍🎓' },
          { name: 'Trainers Directory', icon: '👨‍🏫' },
          { name: 'Companies Directory', icon: '🏢' },
          { name: 'Profile', icon: '👤' },
          { name: 'Settings', icon: '⚙️' },
          { name: 'Logout', icon: '🚪', action: handleSignOut }
        ];
      case 'trainer':
        return [
          { name: 'Dashboard', icon: '📊' },
          { name: 'My Courses', icon: '📚' },
          { name: 'Live Classes', icon: '🎥' },
          { name: 'Assignments', icon: '📝' },
          { name: 'Reports', icon: '📈' },
          { name: 'Earnings', icon: '💰' },
          { name: 'Messages', icon: '💬' },
          { name: 'Students Directory', icon: '👨‍🎓' },
          { name: 'Trainers Directory', icon: '👨‍🏫' },
          { name: 'Companies Directory', icon: '🏢' },
          { name: 'Profile', icon: '👤' },
          { name: 'Settings', icon: '⚙️' },
          { name: 'Logout', icon: '🚪', action: handleSignOut }
        ];
      case 'company':
        return [
          { name: 'Dashboard', icon: '📊' },
          { name: 'Job Posts', icon: '💼' },
          { name: 'Applicants', icon: '👥' },
          { name: 'Interviews', icon: '🗓️' },
          { name: 'Hired Candidates', icon: '🎉' },
          { name: 'Students Directory', icon: '👨‍🎓' },
          { name: 'Trainers Directory', icon: '👨‍🏫' },
          { name: 'Companies Directory', icon: '🏢' },
          { name: 'Reports', icon: '📈' },
          { name: 'Profile', icon: '👤' },
          { name: 'Settings', icon: '⚙️' },
          { name: 'Logout', icon: '🚪', action: handleSignOut }
        ];
      default:
        return [];
    }
  };

  const renderMessagesView = () => {
    return (
      <div 
        className="border p-6 flex flex-col gap-5 transition-all bg-white"
        style={{ borderColor: theme.border, borderRadius: '18px' }}
      >
        <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: '18px', fontWeight: 700, margin: 0 }}>💬 Messages & Notifications</h3>
        
        <div className="flex flex-col gap-3 min-h-[200px]">
          {messages.map(msg => (
            <div 
              key={msg.id} 
              className="p-4 border bg-[#F5F6FB]"
              style={{ borderColor: theme.border, borderRadius: '12px' }}
            >
              <div className="flex flex-col sm:flex-row sm:justify-between mb-1.5 gap-1">
                <strong className="text-xs sm:text-sm text-[#4C5FD5]">{msg.sender}</strong>
                <span className="text-[10px] sm:text-xs text-slate-400">{msg.time}</span>
              </div>
              <p className="text-xs sm:text-sm m-0 leading-relaxed text-[#1B1F3B]">{msg.text}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessageText}
            onChange={(e) => setNewMessageText(e.target.value)}
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl border outline-none focus:border-[#4C5FD5] focus:ring-1 focus:ring-[#4C5FD5]/20"
            style={{ 
              backgroundColor: '#FFFFFF', 
              borderColor: theme.border,
              color: theme.text
            }}
          />
          <button
            onClick={() => {
              if (newMessageText.trim()) {
                setMessages([...messages, { id: messages.length + 1, sender: 'You', text: newMessageText, time: 'Just now' }]);
                setNewMessageText('');
                showToast('Message sent!');
              }
            }}
            className="px-5 py-2.5 rounded-xl text-white font-bold text-xs sm:text-sm cursor-pointer transition-colors border-0"
            style={{ backgroundColor: theme.primary }}
          >
            Send
          </button>
        </div>
      </div>
    );
  };

  const renderSettingsView = () => {
    return (
      <div 
        className="border p-6 max-w-xl transition-all bg-white"
        style={{ borderColor: theme.border, borderRadius: '18px' }}
      >
        <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: '18px', fontWeight: 700, margin: 0, marginBottom: '20px' }}>⚙️ General Settings</h3>
        
        <div className="flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <div>
              <h4 className="text-xs sm:text-sm font-bold m-0 mb-1">Theme Toggle</h4>
              <p className="text-[11px] sm:text-xs m-0 text-slate-400">Switch style theme variables</p>
            </div>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="px-4 py-2 text-xs sm:text-sm rounded-lg border font-bold cursor-pointer w-full sm:w-auto"
              style={{ 
                borderColor: theme.primary, 
                backgroundColor: isDarkMode ? theme.primary : 'transparent',
                color: isDarkMode ? '#FFFFFF' : theme.primary 
              }}
            >
              {isDarkMode ? 'Dark Mode On' : 'Light Mode On'}
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <div>
              <h4 className="text-xs sm:text-sm font-bold m-0 mb-1">Email Alerts</h4>
              <p className="text-[11px] sm:text-xs m-0 text-slate-400">Receive learning updates</p>
            </div>
            <button
              onClick={() => showToast('Email preferences updated!')}
              className="px-4 py-2 text-xs sm:text-sm rounded-lg border font-bold cursor-pointer w-full sm:w-auto"
              style={{ borderColor: theme.border, color: theme.text }}
            >
              Configure
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderDirectoryView = (targetRole) => {
    const filtered = directoryUsers.filter(u => u.role === targetRole && u.email !== user.email);

    return (
      <div 
        className="border p-6 bg-white flex flex-col gap-6"
        style={{ borderColor: theme.border, borderRadius: '18px' }}
      >
        <div className="flex justify-between items-center">
          <div>
            <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: '20px', fontWeight: 700, margin: 0, textTransform: 'capitalize' }}>
              👥 {targetRole}s Directory
            </h3>
            <p className="text-xs text-slate-400 m-0 mt-1">
              Browse through registered {targetRole}s, view their skills, specs, and resumes.
            </p>
          </div>
          <button 
            onClick={fetchDirectoryUsers} 
            className="py-1.5 px-4 bg-slate-100 hover:bg-slate-200 border-0 rounded-lg text-xs font-bold cursor-pointer"
          >
            🔄 Refresh
          </button>
        </div>

        {loadingDirectory ? (
          <div className="text-center py-10 text-xs sm:text-sm text-slate-400 font-semibold">
            Loading Directory data...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-10 text-xs sm:text-sm text-slate-400 font-semibold">
            No {targetRole}s registered yet.
          </div>
        ) : (
          <div className="w-full overflow-x-auto border rounded-2xl border-slate-200 shadow-sm">
            <table className="w-full border-collapse text-left text-xs sm:text-sm bg-white">
              <thead>
                <tr className="border-b border-slate-200" style={{ backgroundColor: '#F8FAFC' }}>
                  <th className="p-4 font-bold text-slate-650">Name / Profile</th>
                  {targetRole === 'student' && <th className="p-4 font-bold text-slate-650">College & Dept</th>}
                  {targetRole === 'trainer' && <th className="p-4 font-bold text-slate-650">Expertise</th>}
                  {targetRole === 'company' && <th className="p-4 font-bold text-slate-650">Industry</th>}
                  <th className="p-4 font-bold text-slate-650">Skills & Specifications</th>
                  <th className="p-4 font-bold text-slate-650">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((u, idx) => {
                  const displayName = u.fullName || u.companyName || `Candidate #${idx + 101}`;
                  return (
                    <tr key={u.email} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-[#1B1F3B]">{displayName}</div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider">{u.role}</div>
                      </td>
                      {targetRole === 'student' && (
                        <td className="p-4 text-slate-600">
                          <div>{u.college || 'N/A'}</div>
                          <div className="text-[11px] text-slate-400">{u.department || 'N/A'}</div>
                        </td>
                      )}
                      {targetRole === 'trainer' && (
                        <td className="p-4 text-slate-600 font-semibold">{u.expertise || 'N/A'}</td>
                      )}
                      {targetRole === 'company' && (
                        <td className="p-4 text-slate-600 font-semibold">{u.industry || 'N/A'}</td>
                      )}
                      <td className="p-4">
                        {targetRole === 'student' && (
                          <div className="flex flex-wrap gap-1">
                            {Array.isArray(u.skills) ? u.skills.map((s, sIdx) => (
                              <span key={sIdx} className="py-0.5 px-2 bg-[#F3F5FF] rounded text-[10px] font-bold text-slate-600">{s}</span>
                            )) : <span className="text-[11px] text-slate-400">{u.skills || 'N/A'}</span>}
                          </div>
                        )}
                        {targetRole === 'trainer' && (
                          <div className="text-xs text-slate-600">
                            Proposed Course: <strong>{u.courseName || 'N/A'}</strong> ({u.teachingMode || 'N/A'})
                          </div>
                        )}
                        {targetRole === 'company' && (
                          <div className="text-xs text-slate-600">
                            Roles: <strong>{u.jobRoles || 'N/A'}</strong>
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleViewProfile(u)}
                          className="py-1.5 px-3 border-0 text-white font-bold rounded-lg text-xs cursor-pointer"
                          style={{ backgroundColor: theme.primary }}
                        >
                          🔍 View Profile
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  const renderStudentContent = () => {
    switch (activeSidebarTab) {
      case 'Dashboard':
        return (
          <div className="flex flex-col gap-6">
            {/* Stats Row */}
            <div className="lms-stats-row">
              <div className="lms-stat-card">
                <div className="stat-icon purple">📚</div>
                <div className="stat-content">
                  <span className="stat-value">{(user.assignedCourses || []).length}</span>
                  <span className="stat-label">Enrolled Courses</span>
                </div>
              </div>
              <div className="lms-stat-card">
                <div className="stat-icon green">🎓</div>
                <div className="stat-content">
                  <span className="stat-value">{studentCertificates.length}</span>
                  <span className="stat-label">Certificates Earned</span>
                </div>
              </div>
              <div className="lms-stat-card">
                <div className="stat-icon blue">📝</div>
                <div className="stat-content">
                  <span className="stat-value">{studentAssignments.filter(a => a.status === 'Pending').length}</span>
                  <span className="stat-label">Assignments Due</span>
                </div>
              </div>
              <div className="lms-stat-card">
                <div className="stat-icon pink">⏱️</div>
                <div className="stat-content">
                  <span className="stat-value">32h</span>
                  <span className="stat-label">Learning Hours</span>
                </div>
              </div>
            </div>

            {/* Main Grid Area */}
            <div className="dashboard-grid">
              
              {/* Left Column */}
              <div className="flex flex-col gap-8">
                
                {/* Continue Learning */}
                <div className="premium-card">
                  <div className="premium-card-header">
                    <h3 className="premium-card-title">Continue Learning</h3>
                    <span className="premium-card-action">View All</span>
                  </div>
                  
                  <div className="learning-cards-wrapper">
                    {(user.assignedCourses || ['React Fullstack Bootcamp', 'Advanced UI Design']).slice(0,2).map((courseName, idx) => (
                      <div key={idx} className="course-progress-card">
                        <div className={`course-thumb ${idx % 2 === 0 ? '' : 'purple'}`}>
                          {idx % 2 === 0 ? '💻' : '🎨'}
                        </div>
                        <div className="course-info">
                          <h4>{courseName}</h4>
                          <p>By MBK Expert • {Math.floor(Math.random() * 5 + 2)} Lessons Left</p>
                          <div className="progress-container">
                            <div className="progress-bar-bg">
                              <div className="progress-fill" style={{ width: `${idx % 2 === 0 ? '75%' : '40%'}` }}></div>
                            </div>
                            <span className="progress-text">{idx % 2 === 0 ? '75%' : '40%'}</span>
                          </div>
                        </div>
                        <button className="btn-continue">Continue</button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Learning Analytics */}
                <div className="premium-card">
                  <div className="premium-card-header">
                    <h3 className="premium-card-title">Learning Analytics</h3>
                    <select className="border border-slate-200 rounded-lg p-1 text-xs text-slate-500 bg-white">
                      <option>This Week</option>
                      <option>This Month</option>
                    </select>
                  </div>
                  <div style={{ height: '250px' }}>
                    <Line 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: { 
                          y: { beginAtZero: true, grid: { display: false } },
                          x: { grid: { display: false } }
                        }
                      }}
                      data={{
                        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                        datasets: [
                          {
                            fill: true,
                            label: 'Hours Learned',
                            data: [2, 3.5, 1, 4, 2, 5, 1.5],
                            borderColor: '#FF6B00',
                            backgroundColor: 'rgba(255, 107, 0, 0.1)',
                            tension: 0.4
                          }
                        ]
                      }} 
                    />
                  </div>
                </div>

              </div>

              {/* Right Column */}
              <div className="flex flex-col gap-8">
                
                {/* Upcoming Assignments */}
                <div className="premium-card">
                  <div className="premium-card-header">
                    <h3 className="premium-card-title">Upcoming Assignments</h3>
                    <span className="premium-card-action">View All</span>
                  </div>
                  
                  <div className="premium-list">
                    {studentAssignments.filter(a => a.status === 'Pending').slice(0, 3).map((asg, idx) => (
                      <div key={asg.id} className="premium-list-item">
                        <div className="list-icon">📋</div>
                        <div className="list-details">
                          <h5>{asg.title}</h5>
                          <p>{asg.course}</p>
                        </div>
                        <div className={`list-badge ${idx === 0 ? 'badge-urgent' : 'badge-normal'}`}>
                          {idx === 0 ? '2 Days' : '5 Days'}
                        </div>
                      </div>
                    ))}
                    {studentAssignments.filter(a => a.status === 'Pending').length === 0 && (
                      <div className="text-xs text-slate-400 text-center py-4">No pending assignments.</div>
                    )}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="premium-card">
                  <div className="premium-card-header">
                    <h3 className="premium-card-title">Quick Actions</h3>
                  </div>
                  
                  <div className="quick-actions-grid">
                    <div className="action-btn">
                      <span className="action-icon">📝</span>
                      <span>Take Quiz</span>
                    </div>
                    <div className="action-btn">
                      <span className="action-icon">📂</span>
                      <span>Notes</span>
                    </div>
                    <div className="action-btn">
                      <span className="action-icon">📆</span>
                      <span>Calendar</span>
                    </div>
                    <div className="action-btn" onClick={() => handleDownloadResume(user.fullName || 'Student')}>
                      <span className="action-icon">📄</span>
                      <span>Resume</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
            
            {/* Recommended Courses Grid */}
            <div className="premium-card">
              <div className="premium-card-header">
                <h3 className="premium-card-title">Recommended Courses</h3>
                <span className="premium-card-action">Browse All</span>
              </div>
              <div className="recommended-cards">
                <div className="rec-card">
                  <div className="rec-thumb">🤖</div>
                  <h5>AI & Machine Learning</h5>
                  <p>Master deep learning & neural networks.</p>
                </div>
                <div className="rec-card">
                  <div className="rec-thumb">🔐</div>
                  <h5>Cybersecurity Essentials</h5>
                  <p>Learn network defense & cryptography.</p>
                </div>
              </div>
            </div>
            
          </div>
        );

      case 'My Courses':
        return (
          <div className="flex flex-col gap-8">
            <div className="flex border-b gap-6 overflow-x-auto pb-0.5 border-slate-200">
              {['My Courses', 'Course Shop'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setStudentActiveTab(tab)}
                  className="px-4 py-3 text-sm font-bold bg-transparent border-0 cursor-pointer whitespace-nowrap"
                  style={{
                    color: studentActiveTab === tab ? '#4C5FD5' : '#64748B',
                    borderBottom: studentActiveTab === tab ? `3px solid #4C5FD5` : '3px solid transparent',
                  }}
                >
                  {tab === 'My Courses' ? `📚 Active Courses (${(user.assignedCourses || []).length})` : '🛒 Register for Courses'}
                </button>
              ))}
            </div>

            {studentActiveTab === 'My Courses' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {(user.assignedCourses || []).length === 0 ? (
                  <div className="col-span-full border border-slate-200 rounded-2xl p-10 text-center text-sm bg-white text-slate-500">
                    No active course enrollments yet. Browse the Course Shop tab!
                  </div>
                ) : (
                  (user.assignedCourses || []).map((courseTitle, idx) => {
                    const courseDetails = allCourses.find(c => c.title === courseTitle) || { description: 'Access study materials, video lectures, assignments and download your certificate.', price: 'Free' };
                    return (
                      <div 
                        key={idx} 
                        className="border rounded-2xl p-5 flex flex-col justify-between gap-5 shadow-sm bg-white border-slate-250"
                        style={{ borderRadius: '18px', borderColor: '#E7E9F5' }}
                      >
                        <div>
                          <span className="text-[10px] font-bold text-[#4C5FD5] uppercase tracking-wider block mb-1">Enrolled</span>
                          <h4 className="text-sm font-bold text-slate-800 m-0 mb-2 leading-snug">{courseTitle}</h4>
                          <p className="text-xs text-slate-550 m-0 leading-relaxed">
                            {courseDetails.description}
                          </p>
                        </div>
                        <button
                          onClick={() => showToast(`Launching classroom interface for ${courseTitle}...`)}
                          className="w-full py-2.5 rounded-xl border bg-transparent font-bold text-xs cursor-pointer hover:bg-[#F3F5FF] text-[#4C5FD5] transition-colors border-[#4C5FD5]"
                        >
                          Go to Classroom
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {allCourses.filter(c => !(user.assignedCourses || []).includes(c.title)).length === 0 ? (
                  <div className="col-span-full border border-slate-200 rounded-2xl p-10 text-center text-sm bg-white text-slate-500">
                    No new courses available right now. You've registered in all of them!
                  </div>
                ) : (
                  allCourses.filter(c => !(user.assignedCourses || []).includes(c.title)).map((course, idx) => (
                    <div 
                      key={idx} 
                      className="border border-[#E7E9F5] rounded-2xl overflow-hidden flex flex-col justify-between shadow-sm bg-white"
                      style={{ borderRadius: '18px' }}
                    >
                      <div className="h-32 bg-slate-100 relative">
                        {course.image ? (
                          <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex items-center justify-center h-full text-slate-400 text-xs font-semibold">No Preview</div>
                        )}
                        <span className="absolute top-3 right-3 bg-slate-900/80 text-white py-1 px-2.5 rounded-full text-[10px] font-bold">
                          ₹{course.price || 'Free'}
                        </span>
                      </div>
                      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                        <div>
                          <span className="text-[10px] font-bold text-[#4C5FD5] uppercase tracking-widest block mb-1">{course.name || 'Professional Specialization'}</span>
                          <h4 className="text-sm font-bold text-slate-800 m-0 mb-2 leading-snug">{course.title}</h4>
                          <p className="text-xs text-slate-500 m-0 leading-relaxed line-clamp-3">
                            {course.description || course.content}
                          </p>
                        </div>
                        <button
                          onClick={() => handleBuyCourse(course.title)}
                          className="w-full py-2.5 rounded-xl text-white font-bold text-xs cursor-pointer border-0 transition-colors"
                          style={{ backgroundColor: theme.primary }}
                        >
                          Enroll Now
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        );

      case 'Assignments':
        return (
          <div 
            className="border bg-white p-6 shadow-sm"
            style={{ borderRadius: '18px', borderColor: '#E7E9F5' }}
          >
            <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: '18px', fontWeight: 700, margin: 0, marginBottom: '20px' }}>My Assignments</h3>
            <div className="flex flex-col gap-4">
              {studentAssignments.map(asg => (
                <div 
                  key={asg.id} 
                  className="p-5 border border-slate-100 rounded-xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-[#F5F6FB]" 
                  style={{ borderColor: '#E7E9F5' }}
                >
                  <div>
                    <h4 className="text-sm font-bold text-slate-850 m-0 mb-1">{asg.title}</h4>
                    <p className="text-xs text-slate-550 m-0 mb-2">Subject: {asg.course}</p>
                    <span className="text-xs text-rose-500 font-bold">Due Date: {asg.deadline}</span>
                  </div>
                  <div className="flex items-center gap-5 justify-between sm:justify-end self-stretch sm:self-auto border-t sm:border-t-0 pt-3 sm:pt-0">
                    <div className="text-left sm:text-right">
                      <span 
                        className="py-1 px-3 rounded-full text-[10px] font-bold inline-block"
                        style={{
                          backgroundColor: asg.status === 'Submitted' ? '#d1fae5' : '#fef3c7',
                          color: asg.status === 'Submitted' ? '#065f46' : '#b45309'
                        }}
                      >
                        {asg.status}
                      </span>
                      {asg.grade !== '-' && <p className="text-xs font-bold text-[#4C5FD5] m-0 mt-1">Grade: {asg.grade}</p>}
                    </div>
                    {asg.status === 'Pending' && (
                      <button
                        onClick={() => {
                          setStudentAssignments(studentAssignments.map(a => a.id === asg.id ? { ...a, status: 'Submitted', grade: 'A' } : a));
                          showToast('Assignment submitted successfully!');
                        }}
                        className="py-2 px-4 rounded-xl text-white font-bold text-xs cursor-pointer border-0 transition-colors"
                        style={{ backgroundColor: theme.primary }}
                      >
                        Upload Code
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'Live Classes':
        return (
          <div 
            className="border bg-white p-6 shadow-sm"
            style={{ borderRadius: '18px', borderColor: '#E7E9F5' }}
          >
            <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: '18px', fontWeight: 700, margin: 0, marginBottom: '20px' }}>🎥 Live Class Sessions</h3>
            <div className="flex flex-col gap-4">
              {[
                { id: 1, title: 'Python Web Frameworks: Django & Flask', trainer: 'Trainer Daniel Scott', date: 'July 10, 2026', time: '11:00 AM - 12:30 PM', status: 'Scheduled' },
                { id: 2, title: 'React State Management: Redux & Context API', trainer: 'Trainer John Doe', date: 'Today', time: '03:00 PM - 04:30 PM', status: 'Live Now' },
                { id: 3, title: 'Advanced MongoDB Aggregate Pipelines', trainer: 'Trainer Sarah Connor', date: 'July 14, 2026', time: '02:00 PM - 03:30 PM', status: 'Scheduled' }
              ].map(session => (
                <div 
                  key={session.id} 
                  className="p-5 border border-slate-100 rounded-xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-[#F5F6FB]" 
                  style={{ borderColor: '#E7E9F5' }}
                >
                  <div className="text-left">
                    <div className="flex items-center gap-2 mb-1.5">
                      <h4 className="text-sm font-bold text-slate-850 m-0">{session.title}</h4>
                      <span 
                        className="py-0.5 px-2 rounded-full text-[9px] font-bold"
                        style={{
                          backgroundColor: session.status === 'Live Now' ? '#fee2e2' : '#f0fdf4',
                          color: session.status === 'Live Now' ? '#ef4444' : '#15803d'
                        }}
                      >
                        {session.status === 'Live Now' ? '🔴 Live Now' : '📅 Scheduled'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-550 m-0 mb-1">Trainer: <strong>{session.trainer}</strong></p>
                    <span className="text-xs text-slate-450">Session Time: {session.date} • {session.time}</span>
                  </div>
                  <button
                    onClick={() => showToast(session.status === 'Live Now' ? 'Joining video call...' : 'Class has not started yet.')}
                    className="py-2 px-4 rounded-xl text-white font-bold text-xs cursor-pointer border-0 transition-colors"
                    style={{ 
                      backgroundColor: session.status === 'Live Now' ? '#ef4444' : '#64748B',
                      opacity: session.status === 'Live Now' ? 1 : 0.8
                    }}
                  >
                    {session.status === 'Live Now' ? 'Join Live Room' : 'Add to Calendar'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'Certificates':
        return (
          <div 
            className="border bg-white p-6 shadow-sm"
            style={{ borderRadius: '18px', borderColor: '#E7E9F5' }}
          >
            <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: '18px', fontWeight: 700, margin: 0, marginBottom: '20px' }}>My Certificates</h3>
            {studentCertificates.length === 0 ? (
              <p className="text-sm text-center text-slate-500 py-6 m-0">No certificates earned yet. Complete all lessons to generate verified PDF certificates!</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {studentCertificates.map(cert => (
                  <div 
                    key={cert.id} 
                    className="border border-slate-100 rounded-xl p-5 flex flex-col justify-between gap-5 bg-[#F5F6FB]"
                    style={{ borderColor: '#E7E9F5' }}
                  >
                    <div>
                      <span className="text-4xl">🎓</span>
                      <h4 className="text-sm font-bold text-slate-800 mt-3 mb-1.5">{cert.title}</h4>
                      <p className="text-xs text-slate-500 m-0 mb-1">Issue Date: {cert.issueDate}</p>
                      <p className="text-[10px] text-[#4C5FD5] font-bold tracking-wider uppercase">ID: {cert.credentialId}</p>
                    </div>
                    <button
                      onClick={() => showToast('Opening certificate verification link...')}
                      className="py-2 rounded-xl text-white font-bold text-xs cursor-pointer border-0 w-full transition-colors"
                      style={{ backgroundColor: theme.primary }}
                    >
                      Download Certificate
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'Job Opportunities':
        return (
          <div 
            className="border bg-white p-6 shadow-sm"
            style={{ borderRadius: '18px', borderColor: '#E7E9F5' }}
          >
            <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: '18px', fontWeight: 700, margin: 0, marginBottom: '20px' }}>Job Opportunities</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map(job => (
                <div 
                  key={job.id} 
                  className="border border-slate-100 rounded-xl p-5 flex flex-col justify-between gap-5 bg-[#F5F6FB]"
                  style={{ borderColor: '#E7E9F5' }}
                >
                  <div>
                    <span className="text-xs text-[#4C5FD5] font-bold uppercase tracking-widest block mb-1">Hiring Partner</span>
                    <h4 className="text-sm font-bold text-slate-800 m-0 mb-2 leading-snug">{job.title}</h4>
                    <p className="text-xs text-slate-655 m-0 mb-1">📍 Location: {job.location}</p>
                    <p className="text-xs text-slate-500 m-0">💼 Experience: {job.experience}</p>
                  </div>
                  <button
                    onClick={() => showToast(`Applying for ${job.title}...`)}
                    className="w-full py-2.5 rounded-xl text-white font-bold text-xs cursor-pointer border-0 transition-colors"
                    style={{ backgroundColor: theme.primary }}
                  >
                    Apply Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'Messages':
        return renderMessagesView();

      case 'Profile':
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <HeroBanner />
            <div style={{ display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
              <AboutMeCard />
              <AcademicDetailsCard />
            </div>
            <ProfileCompletionCard />
          </div>
        );

      case 'Settings':
        return renderSettingsView();

      case 'Students Directory':
        return renderDirectoryView('student');

      case 'Trainers Directory':
        return renderDirectoryView('trainer');

      case 'Companies Directory':
        return renderDirectoryView('company');

      default:
        return <div className="text-xs text-slate-400">Select sidebar option</div>;
    }
  };

  const renderTrainerContent = () => {
    switch (activeSidebarTab) {
      case 'Dashboard':
        return (
          <div className="flex flex-col gap-6">
            {/* Stats Row */}
            <div className="lms-stats-row">
              <div className="lms-stat-card">
                <div className="stat-icon purple">📚</div>
                <div className="stat-content">
                  <span className="stat-value">{trainerCourses.length}</span>
                  <span className="stat-label">Published Courses</span>
                </div>
              </div>
              <div className="lms-stat-card">
                <div className="stat-icon green">👥</div>
                <div className="stat-content">
                  <span className="stat-value">{trainerCourses.reduce((sum, c) => sum + c.enrolled, 0)}</span>
                  <span className="stat-label">Total Students</span>
                </div>
              </div>
              <div className="lms-stat-card">
                <div className="stat-icon blue">💰</div>
                <div className="stat-content">
                  <span className="stat-value">$4,200</span>
                  <span className="stat-label">Monthly Earnings</span>
                </div>
              </div>
              <div className="lms-stat-card">
                <div className="stat-icon pink">⭐</div>
                <div className="stat-content">
                  <span className="stat-value">4.8</span>
                  <span className="stat-label">Average Rating</span>
                </div>
              </div>
            </div>

            {/* Main Grid Area */}
            <div className="dashboard-grid">
              
              {/* Left Column */}
              <div className="flex flex-col gap-8">
                
                {/* Course Management */}
                <div className="premium-card">
                  <div className="premium-card-header">
                    <h3 className="premium-card-title">Course Management</h3>
                    <span className="premium-card-action">View All</span>
                  </div>
                  
                  <div className="learning-cards-wrapper">
                    {trainerCourses.slice(0, 3).map((course, idx) => (
                      <div key={idx} className="course-progress-card">
                        <div className={`course-thumb ${idx % 2 === 0 ? '' : 'purple'}`}>
                          {idx % 2 === 0 ? '💻' : '🎨'}
                        </div>
                        <div className="course-info">
                          <h4>{course.title}</h4>
                          <p>{course.enrolled} Students Enrolled • 80% Avg. Completion</p>
                          <div className="progress-container">
                            <div className="progress-bar-bg">
                              <div className="progress-fill" style={{ width: '80%' }}></div>
                            </div>
                            <span className="progress-text">Active</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="btn-continue" style={{ background: '#F1F5F9', color: '#0F172A' }}>Edit</button>
                          <button className="btn-continue">Analytics</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Revenue Analytics */}
                <div className="premium-card">
                  <div className="premium-card-header">
                    <h3 className="premium-card-title">Revenue & Enrollments</h3>
                    <select className="border border-slate-200 rounded-lg p-1 text-xs text-slate-500 bg-white">
                      <option>This Year</option>
                      <option>Last Year</option>
                    </select>
                  </div>
                  <div style={{ height: '250px' }}>
                    <Bar 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: { 
                          y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.04)' } },
                          x: { grid: { display: false } }
                        }
                      }}
                      data={{
                        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                        datasets: [
                          {
                            label: 'Revenue ($)',
                            data: [1200, 1900, 1500, 2200, 2800, 3500],
                            backgroundColor: '#FF6B00',
                            borderRadius: 6
                          },
                          {
                            label: 'Enrollments',
                            data: [80, 120, 95, 140, 180, 220],
                            backgroundColor: '#FF9F43',
                            borderRadius: 6
                          }
                        ]
                      }} 
                    />
                  </div>
                </div>

              </div>

              {/* Right Column */}
              <div className="flex flex-col gap-8">
                
                {/* Upcoming Live Classes */}
                <div className="premium-card">
                  <div className="premium-card-header">
                    <h3 className="premium-card-title">Upcoming Live Classes</h3>
                    <span className="premium-card-action">Schedule</span>
                  </div>
                  
                  <div className="premium-list">
                    {[1, 2].map((_, idx) => (
                      <div key={idx} className="premium-list-item">
                        <div className="list-icon">🎥</div>
                        <div className="list-details">
                          <h5>React Patterns & Hooks</h5>
                          <p>Today • 10:00 AM - 11:30 AM</p>
                        </div>
                        <button className="btn-continue" style={{ padding: '6px 12px', fontSize: '11px' }}>Join</button>
                      </div>
                    ))}
                    {trainerCourses.length === 0 && (
                      <div className="text-xs text-slate-400 text-center py-4">No upcoming classes scheduled.</div>
                    )}
                  </div>
                </div>

                {/* Assignment Reviews */}
                <div className="premium-card">
                  <div className="premium-card-header">
                    <h3 className="premium-card-title">Pending Reviews</h3>
                    <span className="premium-card-action">View All</span>
                  </div>
                  
                  <div className="premium-list">
                    {[1, 2, 3].map((_, idx) => (
                      <div key={idx} className="premium-list-item">
                        <div className="list-icon">📋</div>
                        <div className="list-details">
                          <h5>Python Basics Project</h5>
                          <p>Submitted by Student {idx + 1}</p>
                        </div>
                        <div className={`list-badge ${idx === 0 ? 'badge-urgent' : 'badge-normal'}`}>
                          {idx === 0 ? 'Needs Grading' : 'Pending'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="premium-card">
                  <div className="premium-card-header">
                    <h3 className="premium-card-title">Quick Actions</h3>
                  </div>
                  
                  <div className="quick-actions-grid">
                    <div className="action-btn">
                      <span className="action-icon">➕</span>
                      <span>Create Course</span>
                    </div>
                    <div className="action-btn">
                      <span className="action-icon">📤</span>
                      <span>Upload Material</span>
                    </div>
                    <div className="action-btn">
                      <span className="action-icon">📅</span>
                      <span>Schedule Class</span>
                    </div>
                    <div className="action-btn">
                      <span className="action-icon">📥</span>
                      <span>Download Reports</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        );

      case 'My Courses':
        return (
          <div className="border p-6 bg-white" style={{ borderColor: theme.border, borderRadius: '18px' }}>
            <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: '18px', fontWeight: 700, margin: 0, marginBottom: '20px' }}>Courses You Teach</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {trainerCourses.map(course => (
                <div key={course.id} className="border rounded-xl p-5 bg-[#F5F6FB]" style={{ borderColor: theme.border }}>
                  <h4 className="text-xs sm:text-sm font-bold m-0 mb-2">{course.title}</h4>
                  <p className="text-xs m-0 mb-1">👥 Enrolled Students: {course.enrolled}</p>
                  <p className="text-xs m-0 font-bold text-[#4C5FD5]">Revenue: {course.revenue}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'Students Directory':
        return renderDirectoryView('student');

      case 'Trainers Directory':
        return renderDirectoryView('trainer');

      case 'Companies Directory':
        return renderDirectoryView('company');

      case 'Assignments':
        return (
          <div className="border p-6 bg-white" style={{ borderColor: theme.border, borderRadius: '18px' }}>
            <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: '18px', fontWeight: 700, margin: 0, marginBottom: '20px' }}>Manage Assignments</h3>
            <div className="flex flex-col gap-3">
              <div className="p-4 border rounded-xl flex flex-col sm:flex-row justify-between sm:items-center gap-3 bg-[#F5F6FB]" style={{ borderColor: theme.border }}>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold m-0 mb-0.5">Python Basics Assignment 1</h4>
                  <span className="text-[11px] text-slate-400">Assigned: Python Batch A</span>
                </div>
                <button onClick={() => showToast('Fetching submissions...')} className="py-2 px-4 rounded-xl text-white font-bold text-xs cursor-pointer border-0 transition-colors" style={{ backgroundColor: theme.primary }}>View Submissions</button>
              </div>
            </div>
          </div>
        );

      case 'Attendance':
        return (
          <div className="border p-6 bg-white" style={{ borderColor: theme.border, borderRadius: '18px' }}>
            <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: '18px', fontWeight: 700, margin: 0, marginBottom: '20px' }}>📅 Class Attendance</h3>
            <div className="flex flex-col gap-4">
              {trainerAttendance.map(att => (
                <div key={att.id} className="p-4 border rounded-xl flex flex-col sm:flex-row justify-between sm:items-center gap-3 bg-[#F5F6FB]" style={{ borderColor: theme.border }}>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold m-0 mb-1">{att.batchName}</h4>
                    <span className="text-[11px] text-slate-400 font-semibold">Present: {att.present} | Absent: {att.absent}</span>
                  </div>
                  <button onClick={() => {
                    setTrainerAttendance(trainerAttendance.map(a => a.id === att.id ? { ...a, present: a.present + 1 } : a));
                    showToast('Attendance recorded!');
                  }} className="py-2 px-4 rounded-xl text-white font-bold text-xs cursor-pointer border-0 transition-colors" style={{ backgroundColor: theme.primary }}>Mark Present</button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'Reports':
        return (
          <div className="border p-4 sm:p-6 bg-white" style={{ borderColor: theme.border, borderRadius: '18px' }}>
            <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: '18px', fontWeight: 700, margin: 0, marginBottom: '20px' }}>📈 Performance Reports</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 border rounded-xl bg-[#F5F6FB]" style={{ borderColor: theme.border }}>
                <h4 className="text-[11px] uppercase tracking-wider mb-2 text-slate-400">Completion</h4>
                <div className="text-xl font-extrabold text-[#4C5FD5]">87.4%</div>
              </div>
              <div className="p-4 border rounded-xl bg-[#F5F6FB]" style={{ borderColor: theme.border }}>
                <h4 className="text-[11px] uppercase tracking-wider mb-2 text-slate-400">Avg. Score</h4>
                <div className="text-xl font-extrabold text-[#4C5FD5]">84%</div>
              </div>
              <div className="p-4 border rounded-xl bg-[#F5F6FB]" style={{ borderColor: theme.border }}>
                <h4 className="text-[11px] uppercase tracking-wider mb-2 text-slate-400">Satisfaction</h4>
                <div className="text-xl font-extrabold text-green-600">96.5%</div>
              </div>
            </div>
          </div>
        );

      case 'Messages':
        return renderMessagesView();

      case 'Settings':
        return renderSettingsView();

      default:
        return <div className="text-xs text-slate-400">Select sidebar option</div>;
    }
  };

  const renderCompanyContent = () => {
    switch (activeSidebarTab) {
      case 'Dashboard':
        return (
          <div className="flex flex-col gap-6">
            {/* Stat Row */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div 
                style={{
                  border: '1px solid #E7E9F5',
                  borderRadius: '18px',
                  padding: '20px',
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '10px', fontWeight: 700, color: '#64748B', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Job Openings
                </span>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '24px', fontWeight: 700, color: '#1B1F3B', lineHeight: 1 }}>
                  {jobs.length} Jobs
                </span>
              </div>

              <div 
                style={{
                  border: '1px solid #E7E9F5',
                  borderRadius: '18px',
                  padding: '20px',
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '10px', fontWeight: 700, color: '#64748B', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Total Candidates
                </span>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '24px', fontWeight: 700, color: '#1B1F3B', lineHeight: 1 }}>
                  {applicants.length} Enrolled
                </span>
              </div>

              <div 
                style={{
                  border: '1px solid #E7E9F5',
                  borderRadius: '18px',
                  padding: '20px',
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '10px', fontWeight: 700, color: '#64748B', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Scheduled Interviews
                </span>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '24px', fontWeight: 700, color: '#4C5FD5', lineHeight: 1 }}>
                  {companyInterviews.length} Scheduled
                </span>
              </div>

              <div 
                style={{
                  border: '1px solid #E7E9F5',
                  borderRadius: '18px',
                  padding: '20px',
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '10px', fontWeight: 700, color: '#64748B', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Hired Placements
                </span>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '24px', fontWeight: 700, color: '#FF8A3D', lineHeight: 1 }}>
                  {companyHired.length} Hired
                </span>
              </div>
            </div>

            {/* Job Positions summary */}
            <div 
              className="border p-6 bg-white"
              style={{ borderColor: '#E7E9F5', borderRadius: '18px' }}
            >
              <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: '18px', fontWeight: 700, color: '#1B1F3B', marginBottom: '20px', marginTop: 0 }}>Active Job Positions Progress</h3>
              <div className="flex flex-col gap-3.5">
                {jobs.map((job, index) => (
                  <div key={index} className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 p-4 border border-[#E7E9F5] rounded-xl">
                    <div>
                      <div className="text-sm font-bold text-[#1B1F3B] flex items-center gap-2">
                        {job.title}
                        <span className="bg-[#E8F5EE] text-[#2F9E67] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase" style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '0.05em' }}>ACTIVE</span>
                      </div>
                      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '10px', color: '#64748B', marginTop: '4px' }}>Location: <strong>{job.location}</strong></div>
                    </div>
                    <div className="flex flex-col items-start sm:items-end gap-1">
                      <div className="text-xs font-bold text-[#4C5FD5]">{job.applicants} Applied</div>
                      <div className="w-full sm:w-[80px] h-1.5 bg-[#E7E9F5] rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-[#4C5FD5]" style={{ width: '50%' }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'Job Posts':
        return (
          <div className="border p-4 sm:p-6 bg-white border-slate-200" style={{ borderRadius: '18px' }}>
            <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: '18px', fontWeight: 700, margin: 0, marginBottom: '20px' }}>Active Job Openings</h3>
            <div className="flex flex-col gap-4">
              {jobs.map(job => (
                <div key={job.id} className="p-4 border rounded-xl bg-[#F5F6FB]" style={{ borderColor: theme.border }}>
                  <h4 className="text-xs sm:text-sm font-bold m-0 mb-1">{job.title}</h4>
                  <span className="text-[11px] text-slate-400">📍 {job.location} | Experience: {job.experience}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'Applicants':
        return (
          <div className="flex flex-col gap-6">
            <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: '18px', fontWeight: 700, margin: 0 }}>Recent Applicants</h3>
            <div className="flex flex-col gap-4">
              {applicants.map((app) => (
                <div 
                  key={app.id} 
                  className="border rounded-2xl p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4 shadow-sm bg-white border-slate-200" 
                  style={{ borderRadius: '18px' }}
                >
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold m-0 mb-1.5">
                      {app.isApproved ? app.name : `Candidate Profile #${app.id + 500}`}
                    </h4>
                    <span className="text-[10px] font-bold uppercase tracking-wider block mb-2 text-[#4C5FD5]">SKILLS: {app.skills}</span>
                    
                    {!app.isApproved ? (
                      <span className="text-[10px] text-amber-600 font-bold bg-amber-500/10 py-1 px-2 rounded">🔒 Details Locked by Admin</span>
                    ) : (
                      <span className="text-[10px] text-green-600 font-bold bg-green-500/10 py-1 px-2 rounded">✓ Profile Unlocked</span>
                    )}
                  </div>

                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => {
                        if (!app.isApproved) {
                          alert('🔒 Personal details are visible only to Admin until approved.');
                        } else {
                          handleDownloadResume(app.name);
                        }
                      }}
                      className="flex-1 sm:flex-initial py-2 px-4 rounded-xl border bg-transparent font-bold text-xs cursor-pointer hover:bg-slate-50 transition-colors border-slate-200"
                      style={{ color: theme.text }}
                    >
                      Resume
                    </button>
                    
                    <button
                      onClick={() => {
                        setApplicants(applicants.map(a => a.id === app.id ? { ...a, isApproved: true } : a));
                      }}
                      className="flex-1 sm:flex-initial py-2 px-4 rounded-xl text-white font-bold text-xs cursor-pointer border-0 transition-colors"
                      style={{ backgroundColor: theme.primary }}
                    >
                      Unlock Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'Interviews':
        return (
          <div className="border p-4 sm:p-6 bg-white border-slate-200" style={{ borderRadius: '18px' }}>
            <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: '18px', fontWeight: 700, margin: 0, marginBottom: '20px' }}>Scheduled Interviews</h3>
            <div className="flex flex-col gap-4">
              {companyInterviews.map(iv => (
                <div key={iv.id} className="p-4 border rounded-xl flex flex-col sm:flex-row justify-between sm:items-center gap-3 bg-[#F5F6FB]" style={{ borderColor: theme.border }}>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold m-0 mb-1">{iv.candidate}</h4>
                    <p className="text-xs m-0 mb-1 text-slate-400">Role: {iv.role}</p>
                    <span className="text-[11px] font-bold">Date: {iv.date} | Time: {iv.time}</span>
                  </div>
                  <span className="py-1 px-3 rounded-full text-[10px] font-bold bg-green-500/10 text-green-600 block w-fit">{iv.status}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'Hired Candidates':
        return (
          <div className="border p-4 sm:p-6 bg-white border-slate-200" style={{ borderRadius: '18px' }}>
            <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: '18px', fontWeight: 700, margin: 0, marginBottom: '20px' }}>🎉 Hired Candidates</h3>
            <div className="flex flex-col gap-4">
              {companyHired.map(hire => (
                <div key={hire.id} className="p-4 border rounded-xl flex justify-between items-center bg-[#F5F6FB]" style={{ borderColor: theme.border }}>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold m-0 mb-1">{hire.name}</h4>
                    <span className="text-xs text-slate-400 font-semibold">Hired as: <strong>{hire.role}</strong></span>
                  </div>
                  <span className="text-2xl">🏆</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'Reports':
        return (
          <div className="border p-4 sm:p-6 bg-white border-slate-200" style={{ borderRadius: '18px' }}>
            <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: '18px', fontWeight: 700, margin: 0, marginBottom: '20px' }}>📊 Hiring Reports</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 border rounded-xl bg-[#F5F6FB]" style={{ borderColor: theme.border }}>
                <h4 className="text-[11px] uppercase tracking-wider mb-2 text-slate-400">Applicants</h4>
                <div className="text-xl font-extrabold text-[#4C5FD5]">{applicants.length}</div>
              </div>
              <div className="p-4 border rounded-xl bg-[#F5F6FB]" style={{ borderColor: theme.border }}>
                <h4 className="text-[11px] uppercase tracking-wider mb-2 text-slate-400">Shortlist Rate</h4>
                <div className="text-xl font-extrabold text-[#4C5FD5]">45%</div>
              </div>
              <div className="p-4 border rounded-xl bg-[#F5F6FB]" style={{ borderColor: theme.border }}>
                <h4 className="text-[11px] uppercase tracking-wider mb-2 text-slate-400">Avg. Time to Hire</h4>
                <div className="text-xl font-extrabold text-green-600">14 Days</div>
              </div>
            </div>
          </div>
        );

      case 'Profile':
        return (
          <div className="border p-6 max-w-3xl bg-white border-slate-200" style={{ borderRadius: '18px' }}>
            <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: '18px', fontWeight: 700, margin: 0, marginBottom: '20px' }}>🏢 Company Profile</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1.5 text-slate-400">Company Name</label>
                <input type="text" readOnly value={user.fullName || 'ABC Technologies'} className="w-full p-2.5 text-xs sm:text-sm rounded-lg border outline-none cursor-default bg-slate-50 border-slate-200" />
              </div>
              <div>
                <label className="block text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1.5 text-slate-400">Email</label>
                <input type="text" readOnly value={user.email || ''} className="w-full p-2.5 text-xs sm:text-sm rounded-lg border outline-none cursor-default bg-slate-50 border-slate-200" />
              </div>
            </div>
          </div>
        );

      case 'Settings':
        return renderSettingsView();

      case 'Students Directory':
        return renderDirectoryView('student');

      case 'Trainers Directory':
        return renderDirectoryView('trainer');

      case 'Companies Directory':
        return renderDirectoryView('company');

      default:
        return <div className="text-xs text-slate-400">Select sidebar option</div>;
    }
  };


  if (user.role === 'student' && activeSidebarTab === 'Dashboard') {
    const tokens = {
      bg: "#f6f7fb",
      surface: "#ffffff",
      border: "#eaecf1",
      ink: "#161a23",
      inkSoft: "#6b7280",
      inkMute: "#9aa1ac",
      indigo: "#4f46e5",
      indigoSoft: "#eef0ff",
      coral: "#ff7a45",
      coralSoft: "#fff0e8",
      green: "#12b76a",
      greenSoft: "#e7f9f0",
      sky: "#0ea5e9",
      skySoft: "#e6f7fd",
      rose: "#f43f5e",
      roseSoft: "#fdeaf0",
      radiusLg: 18,
      radiusMd: 14,
      shadow: "0 1px 2px rgba(16,24,40,0.04), 0 4px 14px rgba(16,24,40,0.05)",
      shadowHover: "0 6px 20px rgba(16,24,40,0.09)",
    };

    const dateStr = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const stats = [
      { icon: BookOpen, bg: tokens.indigoSoft, fg: tokens.indigo, value: String((user.assignedCourses || []).length + 2), label: "Enrolled Courses" },
      { icon: GraduationCap, bg: tokens.greenSoft, fg: tokens.green, value: String(studentCertificates.length + 1), label: "Certificates Earned" },
      { icon: ClipboardList, bg: tokens.skySoft, fg: tokens.sky, value: String(studentAssignments.filter(a => a.status === 'Pending').length), label: "Assignments Due" },
      { icon: Clock, bg: tokens.roseSoft, fg: tokens.rose, value: "32h", label: "Learning Hours" },
    ];

    const continueLearning = [
      {
        title: "Micro Soft Office with PowerPoint",
        meta: "By MBK Expert · 4 lessons left",
        progress: 75,
        color: tokens.coral,
        icon: "🖥️",
      },
      {
        title: "Micro Soft Office with Excel",
        meta: "By MBK Expert · 5 lessons left",
        progress: 40,
        color: tokens.indigo,
        icon: "🎨",
      },
    ];

    const upcomingAssignments = [
      { title: "DOM Manipulation & Event Listeners", subject: "Frontend Developer (React)", due: "2", unit: "days" },
      { title: "Database Design & SQL Joins", subject: "Python Full Stack Bootcamp", due: "5", unit: "days" },
    ];

    const ProgressRing = ({ pct, size = 56, stroke = 5, color = tokens.coral }) => {
      const r = (size - stroke) / 2;
      const c = 2 * Math.PI * r;
      const offset = c - (pct / 100) * c;
      return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#ffffff55" strokeWidth={stroke} />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
          <text x={size / 2} y={size / 2 + 4} textAnchor="middle" fontSize="12.5" fontWeight="800" fill={tokens.ink}>
            {pct}%
          </text>
        </svg>
      );
    };

    return (
      <div
        className="mbk-root"
        style={{
          display: "flex",
          fontFamily: "'Plus Jakarta Sans','Inter','Segoe UI',sans-serif",
          background: tokens.bg,
          minHeight: "100vh",
          width: '100%',
          textAlign: 'left'
        }}
      >
        <style>{`
          .mbk-root * { box-sizing: border-box; }
          .mbk-card { transition: box-shadow .18s ease, transform .18s ease; }
          .mbk-card:hover { box-shadow: ${tokens.shadowHover}; transform: translateY(-2px); }
          .mbk-nav-item { transition: background .15s ease, color .15s ease; }
          .mbk-nav-item:hover:not(.active) { background: #f3f4f8; }
          .mbk-btn { transition: opacity .15s ease, transform .12s ease; }
          .mbk-btn:hover { opacity: 0.88; }
          .mbk-btn:active { transform: scale(0.97); }
          .mbk-tile { transition: background .15s ease, transform .15s ease; }
          .mbk-tile:hover { background: #eef0ff; transform: translateY(-2px); }
          .mbk-link:hover { text-decoration: underline; }
        `}</style>

        {/* Sidebar */}
        <aside
          style={{
            width: 288,
            background: tokens.surface,
            borderRight: `1px solid ${tokens.border}`,
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "26px 24px 20px" }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: `linear-gradient(135deg, ${tokens.indigo}, #7c6cf2)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 800,
                fontSize: 16,
                letterSpacing: -0.5,
              }}
            >
              MB
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 18, color: tokens.ink, lineHeight: 1.1, letterSpacing: -0.3 }}>
                MBK <span style={{ color: tokens.indigo }}>Carrierz</span>
              </div>
              <div style={{ fontSize: 10.5, letterSpacing: 1.2, color: tokens.inkMute, fontWeight: 600, marginTop: 2 }}>
                LEARNING PLATFORM
              </div>
            </div>
          </div>

          <div style={{ padding: "4px 22px 18px" }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 1, color: tokens.inkMute, marginBottom: 10 }}>
              MAIN MENU
            </div>
            <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {[
                { icon: LayoutDashboard, label: "Dashboard", active: true },
                { icon: BookOpen, label: "My Courses" },
                { icon: Video, label: "Live Classes" },
                { icon: ClipboardList, label: "Assignments" },
                { icon: GraduationCap, label: "Certificates" },
                { icon: Users, label: "Students Directory" },
                { icon: UserCog, label: "Trainers Directory" },
                { icon: Building2, label: "Companies Directory" },
                { icon: User, label: "Profile" },
              ].map(({ icon: Icon, label, active }) => (
                <div
                  key={label}
                  onClick={() => setActiveSidebarTab(label)}
                  className={`mbk-nav-item${active ? " active" : ""}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 14px",
                    borderRadius: 10,
                    fontSize: 14,
                    fontWeight: active ? 700 : 600,
                    cursor: "pointer",
                    color: active ? tokens.indigo : "#3b3f46",
                    background: active ? tokens.indigoSoft : "transparent",
                  }}
                >
                  <Icon size={17} strokeWidth={2.2} />
                  <span>{label}</span>
                </div>
              ))}
            </nav>
          </div>

          <div style={{ padding: "8px 22px 0" }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 1, color: tokens.inkMute, marginBottom: 10 }}>
              SETTINGS
            </div>
            <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {[
                { icon: Settings, label: "Settings" },
                { icon: LogOut, label: "Logout" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  onClick={() => {
                    if (label === 'Logout') {
                      handleSignOut();
                    } else {
                      setActiveSidebarTab(label);
                    }
                  }}
                  className="mbk-nav-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 14px",
                    borderRadius: 10,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                    color: label === "Logout" ? tokens.rose : "#3b3f46",
                  }}
                >
                  <Icon size={17} strokeWidth={2.2} />
                  <span>{label}</span>
                </div>
              ))}
            </nav>
          </div>
        </aside>

        {/* Right Main Content */}
        <div style={{ flex: 1 }}>
          {/* Top Bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "24px 40px 20px",
            }}
          >
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: tokens.ink, letterSpacing: -0.4 }}>
                Dashboard
              </div>
              <div style={{ fontSize: 12.5, color: tokens.inkMute, marginTop: 2 }}>
                {dateStr}
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                className="mbk-btn"
                onClick={() => showToast('Opening search tool...')}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: tokens.skySoft,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <Search size={16} color={tokens.sky} />
              </div>
              <div
                className="mbk-btn"
                onClick={() => showToast('No new notifications.')}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: tokens.coralSoft,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <Bell size={16} color={tokens.coral} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={handleSignOut}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${tokens.indigo}, #7c6cf2)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 14,
                  }}
                >
                  {user.fullName ? user.fullName[0] : 'T'}
                </div>
                <div style={{ lineHeight: 1.25 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: tokens.ink }}>{user.fullName || 'Tharaneesh'}</div>
                  <div style={{ fontSize: 12, color: tokens.inkMute }}>Logout</div>
                </div>
              </div>
            </div>
          </div>

          {/* Welcome Hero */}
          <div
            style={{
              margin: "0 40px 24px",
              position: "relative",
              overflow: "hidden",
              background: `linear-gradient(120deg, ${tokens.indigo} 0%, #7c6cf2 55%, ${tokens.coral} 130%)`,
              borderRadius: tokens.radiusLg,
              padding: "30px 34px",
            }}
          >
            {/* decorative blobs */}
            <svg
              viewBox="0 0 900 260"
              preserveAspectRatio="none"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.5 }}
            >
              <circle cx="780" cy="30" r="140" fill="#ffffff" opacity="0.08" />
              <circle cx="860" cy="200" r="90" fill="#ffffff" opacity="0.08" />
            </svg>

            <div style={{ position: "relative", zIndex: 1 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  background: "rgba(255,255,255,0.18)",
                  color: "#fff",
                  fontSize: 11.5,
                  fontWeight: 700,
                  padding: "5px 12px",
                  borderRadius: 20,
                  marginBottom: 14,
                }}
              >
                <Trophy size={13} /> 50% toward this month's goal
              </div>

              <h2 style={{ fontSize: 27, fontWeight: 800, color: "#fff", margin: 0, letterSpacing: -0.5 }}>
                Welcome back, {user.fullName || 'Tharaneesh'}
              </h2>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.85)", marginTop: 6, marginBottom: 22 }}>
                Pick up right where you left off.
              </p>

              <div
                style={{
                  background: "rgba(255,255,255,0.14)",
                  backdropFilter: "blur(6px)",
                  borderRadius: 14,
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  border: "1px solid rgba(255,255,255,0.18)",
                }}
              >
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.75)", letterSpacing: 0.5 }}>
                    CONTINUE COURSE
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 800, color: "#fff", marginTop: 3 }}>
                    Python Basics & Functions Mastery
                  </div>
                  <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.75)", marginTop: 3 }}>
                    Created by Daniel Walter Scott
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                  <ProgressRing pct={50} color="#ffffff" />
                  <button
                    className="mbk-btn"
                    onClick={() => showToast('Launching Python Basics course...')}
                    style={{
                      background: "#ffffff",
                      color: tokens.indigo,
                      border: "none",
                      borderRadius: 22,
                      padding: "11px 26px",
                      fontSize: 13.5,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Stat Cards */}
          <div style={{ margin: "0 40px 24px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18 }}>
            {stats.map((s) => (
              <div
                key={s.label}
                className="mbk-card"
                style={{
                  background: tokens.surface,
                  border: `1px solid ${tokens.border}`,
                  borderRadius: tokens.radiusMd,
                  padding: "20px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  boxShadow: tokens.shadow,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: s.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <s.icon size={20} color={s.fg} strokeWidth={2.2} />
                </div>
                <div>
                  <div style={{ fontSize: 21, fontWeight: 800, color: tokens.ink, lineHeight: 1.1 }}>
                    {s.value}
                  </div>
                  <div style={{ fontSize: 12.5, color: tokens.inkMute, marginTop: 3 }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Continue Learning + Assignments */}
          <div style={{ margin: "0 40px 24px", display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 18 }}>
            <div
              className="mbk-card"
              style={{
                background: tokens.surface,
                border: `1px solid ${tokens.border}`,
                borderRadius: tokens.radiusLg,
                padding: "24px 26px",
                boxShadow: tokens.shadow,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                <div style={{ fontSize: 16.5, fontWeight: 800, color: tokens.ink, letterSpacing: -0.2 }}>Continue Learning</div>
                <span
                  className="mbk-link"
                  onClick={() => setActiveSidebarTab('My Courses')}
                  style={{
                    fontSize: 12.5,
                    fontWeight: 700,
                    color: tokens.indigo,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                  }}
                >
                  View all <ArrowUpRight size={13} />
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {continueLearning.map((c) => (
                  <div key={c.title} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: 14,
                        background: c.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 22,
                        flexShrink: 0,
                      }}
                    >
                      {c.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14.5, fontWeight: 800, color: tokens.ink }}>{c.title}</div>
                      <div style={{ fontSize: 12, color: tokens.inkMute, marginTop: 2, marginBottom: 9 }}>
                        {c.meta}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ flex: 1, height: 6, borderRadius: 4, background: "#f1f2f4" }}>
                          <div
                            style={{
                              width: `${c.progress}%`,
                              height: "100%",
                              borderRadius: 4,
                              background: c.color,
                            }}
                          />
                        </div>
                        <span style={{ fontSize: 11.5, fontWeight: 700, color: tokens.inkSoft, width: 32 }}>
                          {c.progress}%
                        </span>
                      </div>
                    </div>
                    <button
                      className="mbk-btn"
                      onClick={() => showToast(`Launching classroom for ${c.title}...`)}
                      style={{
                        background: c.color,
                        color: "#fff",
                        border: "none",
                        borderRadius: 9,
                        padding: "8px 16px",
                        fontSize: 12.5,
                        fontWeight: 700,
                        cursor: "pointer",
                        flexShrink: 0,
                      }}
                    >
                      Continue
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="mbk-card"
              style={{
                background: tokens.surface,
                border: `1px solid ${tokens.border}`,
                borderRadius: tokens.radiusLg,
                padding: "24px 26px",
                boxShadow: tokens.shadow,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                <div style={{ fontSize: 16.5, fontWeight: 800, color: tokens.ink, letterSpacing: -0.2 }}>Upcoming Assignments</div>
                <span
                  className="mbk-link"
                  onClick={() => setActiveSidebarTab('Assignments')}
                  style={{
                    fontSize: 12.5,
                    fontWeight: 700,
                    color: tokens.indigo,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                  }}
                >
                  View all <ArrowUpRight size={13} />
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {upcomingAssignments.map((a) => (
                  <div
                    key={a.title}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      background: "#f7f8fb",
                      borderRadius: 12,
                      padding: "13px 15px",
                    }}
                  >
                    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          background: tokens.indigoSoft,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <FileText size={14} color={tokens.indigo} />
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 800, color: tokens.ink, lineHeight: 1.35 }}>
                          {a.title}
                        </div>
                        <div style={{ fontSize: 11.5, color: tokens.inkMute, marginTop: 3 }}>{a.subject}</div>
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: 10.5,
                        fontWeight: 800,
                        color: tokens.rose,
                        textAlign: "center",
                        lineHeight: 1.3,
                        flexShrink: 0,
                      }}
                    >
                      {a.due}
                      <br />
                      {a.unit.toUpperCase()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Analytics + Quick Actions */}
          <div style={{ margin: "0 40px 24px", display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 18 }}>
            <div
              className="mbk-card"
              style={{
                background: tokens.surface,
                border: `1px solid ${tokens.border}`,
                borderRadius: tokens.radiusLg,
                padding: "24px 26px",
                boxShadow: tokens.shadow,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <div style={{ fontSize: 16.5, fontWeight: 800, color: tokens.ink, letterSpacing: -0.2 }}>
                  Learning Analytics
                </div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: tokens.inkSoft,
                    border: `1px solid ${tokens.border}`,
                    borderRadius: 8,
                    padding: "5px 12px",
                    cursor: "pointer",
                  }}
                >
                  This week ▾
                </div>
              </div>
              
              {/* Analytics Chart Inline SVG */}
              <svg viewBox="0 0 780 220" style={{ width: "100%", height: 220 }}>
                <defs>
                  <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={tokens.indigo} stopOpacity="0.22" />
                    <stop offset="100%" stopColor={tokens.indigo} stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[0, 1, 2, 3, 4, 5].map((v) => {
                  const y = 220 - 24 - (v / 5) * (220 - 24 - 10);
                  return (
                    <g key={v}>
                      <line x1={30} y1={y} x2={770} y2={y} stroke="#f1f2f4" strokeWidth="1" />
                      <text x={22} y={y + 4} textAnchor="end" fontSize="11" fill={tokens.inkMute}>
                        {v.toFixed(1)}
                      </text>
                    </g>
                  );
                })}
                <path d="M30,132 L155,66 L280,176 L405,52.8 L530,154 L655,8.8 L770,132 L770,196 L30,196 Z" fill="url(#areaFill)" />
                <path d="M30,132 L155,66 L280,176 L405,52.8 L530,154 L655,8.8 L770,132" fill="none" stroke={tokens.indigo} strokeWidth="2.75" strokeLinecap="round" />
                
                <circle cx={30} cy={132} r="4.5" fill="#ffffff" stroke={tokens.indigo} strokeWidth="2.75" />
                <circle cx={155} cy={66} r="4.5" fill="#ffffff" stroke={tokens.indigo} strokeWidth="2.75" />
                <circle cx={280} cy={176} r="4.5" fill="#ffffff" stroke={tokens.indigo} strokeWidth="2.75" />
                <circle cx={405} cy={52.8} r="4.5" fill="#ffffff" stroke={tokens.indigo} strokeWidth="2.75" />
                <circle cx={530} cy={154} r="4.5" fill="#ffffff" stroke={tokens.indigo} strokeWidth="2.75" />
                <circle cx={655} cy={8.8} r="4.5" fill="#ffffff" stroke={tokens.indigo} strokeWidth="2.75" />
                <circle cx={770} cy={132} r="4.5" fill="#ffffff" stroke={tokens.indigo} strokeWidth="2.75" />

                <text x={30} y={216} textAnchor="middle" fontSize="11.5" fontWeight="600" fill={tokens.inkSoft}>Mon</text>
                <text x={155} y={216} textAnchor="middle" fontSize="11.5" fontWeight="600" fill={tokens.inkSoft}>Tue</text>
                <text x={280} y={216} textAnchor="middle" fontSize="11.5" fontWeight="600" fill={tokens.inkSoft}>Wed</text>
                <text x={405} y={216} textAnchor="middle" fontSize="11.5" fontWeight="600" fill={tokens.inkSoft}>Thu</text>
                <text x={530} y={216} textAnchor="middle" fontSize="11.5" fontWeight="600" fill={tokens.inkSoft}>Fri</text>
                <text x={655} y={216} textAnchor="middle" fontSize="11.5" fontWeight="600" fill={tokens.inkSoft}>Sat</text>
                <text x={770} y={216} textAnchor="middle" fontSize="11.5" fontWeight="600" fill={tokens.inkSoft}>Sun</text>
              </svg>
            </div>

            <div
              className="mbk-card"
              style={{
                background: tokens.surface,
                border: `1px solid ${tokens.border}`,
                borderRadius: tokens.radiusLg,
                padding: "24px 26px",
                boxShadow: tokens.shadow,
              }}
            >
              <div style={{ fontSize: 16.5, fontWeight: 800, color: tokens.ink, marginBottom: 16, letterSpacing: -0.2 }}>
                Quick Actions
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[
                  { icon: FileQuestion, label: "Take Quiz", action: () => showToast('Launching quiz engine...') },
                  { icon: NotebookPen, label: "Notes", action: () => showToast('Opening notes editor...') },
                  { icon: CalendarDays, label: "Calendar", action: () => showToast('Opening calendar...') },
                  { icon: FileText, label: "Resume", action: () => showToast('Resume downloaded in PDF format!') },
                ].map((q) => (
                  <div
                    key={q.label}
                    onClick={q.action}
                    className="mbk-tile"
                    style={{
                      background: "#f7f8fb",
                      borderRadius: 12,
                      padding: "20px 12px",
                      textAlign: "center",
                      cursor: "pointer",
                    }}
                  >
                    <q.icon size={20} color={tokens.indigo} strokeWidth={2.2} style={{ marginBottom: 8 }} />
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: tokens.ink }}>{q.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recommended Courses */}
          <div style={{ margin: "0 40px 40px" }}>
            <div
              className="mbk-card"
              style={{
                background: tokens.surface,
                border: `1px solid ${tokens.border}`,
                borderRadius: tokens.radiusLg,
                padding: "24px 26px",
                boxShadow: tokens.shadow,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                <div style={{ fontSize: 16.5, fontWeight: 800, color: tokens.ink, letterSpacing: -0.2 }}>Recommended Courses</div>
                <span
                  className="mbk-link"
                  onClick={() => showToast('Redirecting to Course Shop...')}
                  style={{
                    fontSize: 12.5,
                    fontWeight: 700,
                    color: tokens.indigo,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                  }}
                >
                  Browse all <ArrowUpRight size={13} />
                </span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
                {[
                  {
                    title: "AI & Machine Learning",
                    desc: "Master deep learning and neural networks.",
                    icon: Bot,
                    bg: tokens.indigoSoft,
                    fg: tokens.indigo,
                  },
                  {
                    title: "Cybersecurity Essentials",
                    desc: "Learn network defense and cryptography.",
                    icon: ShieldCheck,
                    bg: tokens.coralSoft,
                    fg: tokens.coral,
                  },
                ].map((r) => (
                  <div
                    key={r.title}
                    onClick={() => handleBuyCourse(r.title)}
                    className="mbk-card"
                    style={{
                      border: `1px solid ${tokens.border}`,
                      borderRadius: 14,
                      padding: "20px 20px",
                      cursor: "pointer",
                      display: "flex",
                      gap: 16,
                      alignItems: "flex-start",
                      background: '#fff'
                    }}
                  >
                    <div
                      style={{
                        width: 46,
                        height: 46,
                        borderRadius: 12,
                        background: r.bg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <r.icon size={21} color={r.fg} strokeWidth={2.2} />
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: tokens.ink }}>{r.title}</div>
                      <div style={{ fontSize: 12.5, color: tokens.inkMute, marginTop: 5 }}>{r.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  if (user.role === 'student' && activeSidebarTab === 'Assignments') {
    return (
      <div style={{ display: "flex", fontFamily: "'Inter','Segoe UI',sans-serif", background: "#fafafc", minHeight: "100vh", width: '100%' }}>
        {/* Sidebar */}
        <aside
          style={{
            width: 300,
            background: "#ffffff",
            borderRight: "1px solid #eceef1",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "24px 26px" }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                background: "#fdeaea",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
              }}
            >
              🦁
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 20, color: "#3d5afe", lineHeight: 1.1 }}>MBK</div>
              <div style={{ fontSize: 10.5, letterSpacing: 1, color: "#9aa1ac", fontWeight: 600 }}>
                CARRIERZ
              </div>
            </div>
          </div>

          <div style={{ borderTop: "1px solid #eceef1", margin: "0 0 18px" }} />

          {/* Main menu */}
          <div style={{ padding: "0 22px" }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1,
                color: "#9aa1ac",
                marginBottom: 10,
              }}
            >
              MAIN MENU
            </div>

            <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {[
                { emoji: "📊", label: "Dashboard" },
                { emoji: "🎓", label: "My Courses" },
                { emoji: "🎥", label: "Live Classes" },
                { emoji: "📝", label: "Assignments", active: true },
                { emoji: "🎓", label: "Certificates" },
                { emoji: "🧑🎓", label: "Students Directory" },
                { emoji: "🧑🏫", label: "Trainers Directory" },
                { emoji: "🏢", label: "Companies Directory" },
                { emoji: "👤", label: "Profile" },
              ].map(({ emoji, label, active }) => (
                <div
                  key={label}
                  onClick={() => setActiveSidebarTab(label)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 14px",
                    borderRadius: 10,
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: "pointer",
                    color: active ? "#ffffff" : "#3b3f46",
                    background: active ? "#6b6bf5" : "transparent",
                  }}
                >
                  <span style={{ fontSize: 18 }}>{emoji}</span>
                  <span>{label}</span>
                </div>
              ))}
            </nav>
          </div>

          <div style={{ padding: "26px 22px 0" }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1,
                color: "#9aa1ac",
                marginBottom: 10,
              }}
            >
              SETTINGS
            </div>
            <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div
                onClick={() => setActiveSidebarTab('Settings')}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 14px",
                  borderRadius: 10,
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: "pointer",
                  color: "#3b3f46",
                }}
              >
                <span style={{ fontSize: 18 }}>⚙️</span>
                <span>Settings</span>
              </div>
              <div
                onClick={handleSignOut}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 14px",
                  borderRadius: 10,
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: "pointer",
                  color: "#3b3f46",
                }}
              >
                <span style={{ fontSize: 18 }}>🔋</span>
                <span>Logout</span>
              </div>
            </nav>
          </div>
        </aside>

        {/* Main Panel */}
        <div style={{ flex: 1 }}>
          {/* Top bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "22px 40px 18px",
            }}
          >
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "#5b3fd6", margin: 0 }}>Dashboard</h1>

            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  background: "#e6f4fb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Search size={16} color="#2fa9d8" />
              </div>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  background: "#fff4e0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Bell size={16} color="#f2a93b" fill="#f2a93b" />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={handleSignOut}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "#3d5afe",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 14,
                  }}
                >
                  {user.fullName ? user.fullName[0] : 'T'}
                </div>
                <div style={{ lineHeight: 1.25 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1f2937" }}>{user.fullName || 'Tharaneesh'}</div>
                  <div style={{ fontSize: 12, color: "#9aa1ac" }}>Logout</div>
                </div>
              </div>
            </div>
          </div>

          {/* My Assignments card */}
          <div
            style={{
              margin: "0 40px",
              background: "#ffffff",
              border: "1px solid #eceef1",
              borderRadius: 14,
              padding: "22px 28px 8px",
            }}
          >
            <div style={{ fontSize: 20, fontWeight: 800, color: "#1f2937", marginBottom: 16 }}>
              My Assignments
            </div>

            {[
              {
                title: "Python Basics & Functions",
                subject: "Python Full Stack Bootcamp",
                dueDate: "July 10, 2026",
                status: "Submitted",
                grade: "A",
              },
              {
                title: "DOM Manipulation & Event Listeners",
                subject: "Frontend Developer (React)",
                dueDate: "July 15, 2026",
                status: "Pending",
              },
              {
                title: "Database Design & SQL Joins",
                subject: "Python Full Stack Bootcamp",
                dueDate: "July 20, 2026",
                status: "Pending",
              },
            ].map((a, i) => (
              <div
                key={a.title}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  padding: "16px 0",
                  borderTop: i === 0 ? "1px solid #eceef1" : "1px solid #f1f2f4",
                }}
              >
                <div>
                  <div style={{ fontSize: 15.5, fontWeight: 800, color: "#1f2937" }}>{a.title}</div>
                  <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>
                    Subject: {a.subject}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#e11d48", marginTop: 4 }}>
                    Due Date: {a.dueDate}
                  </div>
                </div>

                <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 20 }}>
                  {a.status === "Submitted" ? (
                    <>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#16a34a" }}>Submitted</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#3d5afe", marginTop: 2 }}>
                        Grade: {a.grade}
                      </div>
                    </>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#d97706" }}>Pending</span>
                      <button
                        onClick={() => showToast('Uploading project files...')}
                        style={{
                          background: "#f2a93b",
                          color: "#ffffff",
                          border: "none",
                          borderRadius: 6,
                          padding: "7px 14px",
                          fontSize: 12.5,
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        Upload Code
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (user.role === 'student' && activeSidebarTab === 'My Courses') {
    // Start with the user's template static active courses
    const defaultCourses = [
      { title: "Micro Soft Office with PowerPoint" },
      { title: "Micro Soft Office with Excel" },
    ];
    // Combine with database assigned courses, ensuring no duplicates
    const dbCourses = (user.assignedCourses || []).map(title => ({ title }));
    const activeCourses = [...defaultCourses];
    dbCourses.forEach(dbc => {
      if (!activeCourses.some(ac => ac.title === dbc.title)) {
        activeCourses.push(dbc);
      }
    });

    return (
      <div style={{ display: "flex", fontFamily: "'Inter','Segoe UI',sans-serif", background: "#fafafc", minHeight: "100vh", width: '100%' }}>
        {/* Sidebar */}
        <aside
          style={{
            width: 300,
            background: "#ffffff",
            borderRight: "1px solid #eceef1",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "24px 26px" }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                background: "#fdeaea",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
              }}
            >
              🦁
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 20, color: "#3d5afe", lineHeight: 1.1 }}>MBK</div>
              <div style={{ fontSize: 10.5, letterSpacing: 1, color: "#9aa1ac", fontWeight: 600 }}>
                CARRIERZ
              </div>
            </div>
          </div>

          <div style={{ borderTop: "1px solid #eceef1", margin: "0 0 18px" }} />

          {/* Main menu */}
          <div style={{ padding: "0 22px" }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1,
                color: "#9aa1ac",
                marginBottom: 10,
              }}
            >
              MAIN MENU
            </div>

            <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {[
                { emoji: "📊", label: "Dashboard" },
                { emoji: "🎓", label: "My Courses", active: true },
                { emoji: "🎥", label: "Live Classes" },
                { emoji: "📝", label: "Assignments" },
                { emoji: "🎓", label: "Certificates" },
                { emoji: "🧑🎓", label: "Students Directory" },
                { emoji: "🧑🏫", label: "Trainers Directory" },
                { emoji: "🏢", label: "Companies Directory" },
                { emoji: "👤", label: "Profile" },
              ].map(({ emoji, label, active }) => (
                <div
                  key={label}
                  onClick={() => setActiveSidebarTab(label)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 14px",
                    borderRadius: 10,
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: "pointer",
                    color: active ? "#ffffff" : "#3b3f46",
                    background: active ? "#6b6bf5" : "transparent",
                  }}
                >
                  <span style={{ fontSize: 18 }}>{emoji}</span>
                  <span>{label}</span>
                </div>
              ))}
            </nav>
          </div>

          <div style={{ padding: "26px 22px 0" }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1,
                color: "#9aa1ac",
                marginBottom: 10,
              }}
            >
              SETTINGS
            </div>
            <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div
                onClick={() => setActiveSidebarTab('Settings')}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 14px",
                  borderRadius: 10,
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: "pointer",
                  color: "#3b3f46",
                }}
              >
                <span style={{ fontSize: 18 }}>⚙️</span>
                <span>Settings</span>
              </div>
              <div
                onClick={handleSignOut}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 14px",
                  borderRadius: 10,
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: "pointer",
                  color: "#3b3f46",
                }}
              >
                <span style={{ fontSize: 18 }}>🔋</span>
                <span>Logout</span>
              </div>
            </nav>
          </div>
        </aside>

        {/* Main Panel */}
        <div style={{ flex: 1 }}>
          {/* Top bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "22px 40px 18px",
            }}
          >
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "#5b3fd6", margin: 0 }}>Dashboard</h1>

            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  background: "#e6f4fb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Search size={16} color="#2fa9d8" />
              </div>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  background: "#fff4e0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Bell size={16} color="#f2a93b" fill="#f2a93b" />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={handleSignOut}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "#3d5afe",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 14,
                  }}
                >
                  {user.fullName ? user.fullName[0] : 'T'}
                </div>
                <div style={{ lineHeight: 1.25 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1f2937" }}>{user.fullName || 'Tharaneesh'}</div>
                  <div style={{ fontSize: 12, color: "#9aa1ac" }}>Logout</div>
                </div>
              </div>
            </div>
          </div>

          {/* My Courses card */}
          <div style={{ margin: "0 40px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 28, borderBottom: "1px solid #eceef1" }}>
              <div
                onClick={() => setStudentActiveTab('My Courses')}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  paddingBottom: 12,
                  borderBottom: studentActiveTab === 'My Courses' ? "2px solid #3d5afe" : "2px solid transparent",
                  color: studentActiveTab === 'My Courses' ? "#3d5afe" : "#6b7280",
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                <BarChart3 size={16} /> Active Courses ({activeCourses.length})
              </div>
              <div
                onClick={() => setStudentActiveTab('Course Shop')}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  paddingBottom: 12,
                  borderBottom: studentActiveTab === 'Course Shop' ? "2px solid #3d5afe" : "2px solid transparent",
                  color: studentActiveTab === 'Course Shop' ? "#3d5afe" : "#6b7280",
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                <GraduationCap size={16} /> Register for Courses
              </div>
            </div>

            {studentActiveTab === 'My Courses' ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 20, marginTop: 24 }}>
                {activeCourses.map((c) => (
                  <div
                    key={c.title}
                    style={{
                      width: 340,
                      background: "#ffffff",
                      border: "1px solid #eceef1",
                      borderRadius: 12,
                      padding: "18px 22px 22px",
                      textAlign: 'left'
                    }}
                  >
                    <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.5, color: "#3d5afe" }}>
                      ENROLLED
                    </div>
                    <div style={{ fontSize: 17, fontWeight: 800, color: "#1f2937", marginTop: 6, marginBottom: 20 }}>
                      {c.title}
                    </div>
                    <button
                      onClick={() => showToast(`Launching classroom interface for ${c.title}...`)}
                      style={{
                        width: "100%",
                        background: "#ffffff",
                        color: "#3d5afe",
                        border: "1px solid #3d5afe",
                        borderRadius: 20,
                        padding: "10px 0",
                        fontSize: 13.5,
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      Go to Classroom
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 20, marginTop: 24 }}>
                {allCourses.filter(c => !activeCourses.some(ac => ac.title === c.title)).map((course, idx) => (
                  <div
                    key={idx}
                    style={{
                      width: 340,
                      background: "#ffffff",
                      border: "1px solid #eceef1",
                      borderRadius: 12,
                      padding: "18px 22px 22px",
                      textAlign: 'left'
                    }}
                  >
                    <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.5, color: "#d97706" }}>
                      AVAILABLE
                    </div>
                    <div style={{ fontSize: 17, fontWeight: 800, color: "#1f2937", marginTop: 6, marginBottom: 20 }}>
                      {course.title}
                    </div>
                    <button
                      onClick={() => handleBuyCourse(course.title)}
                      style={{
                        width: "100%",
                        background: "#3d5afe",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: 20,
                        padding: "10px 0",
                        fontSize: 13.5,
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      Register Now
                    </button>
                  </div>
                ))}
                {allCourses.filter(c => !activeCourses.some(ac => ac.title === c.title)).length === 0 && (
                  <div style={{ width: '100%', border: "1px solid #eceef1", borderRadius: 12, padding: "20px", textAlign: "center", background: "#fff", fontSize: 13.5, color: "#6b7280" }}>
                    No new courses available right now. You've registered in all of them!
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (user.role === 'student' && activeSidebarTab === 'Live Classes') {
    return (
      <div style={{ display: "flex", fontFamily: "'Inter','Segoe UI',sans-serif", background: "#fafafc", minHeight: "100vh", width: '100%' }}>
        {/* Sidebar */}
        <aside
          style={{
            width: 300,
            background: "#ffffff",
            borderRight: "1px solid #eceef1",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "24px 26px" }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                background: "#fdeaea",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
              }}
            >
              🦁
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 20, color: "#3d5afe", lineHeight: 1.1 }}>MBK</div>
              <div style={{ fontSize: 10.5, letterSpacing: 1, color: "#9aa1ac", fontWeight: 600 }}>
                CARRIERZ
              </div>
            </div>
          </div>

          <div style={{ borderTop: "1px solid #eceef1", margin: "0 0 18px" }} />

          {/* Main menu */}
          <div style={{ padding: "0 22px" }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1,
                color: "#9aa1ac",
                marginBottom: 10,
              }}
            >
              MAIN MENU
            </div>

            <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {[
                { emoji: "📊", label: "Dashboard" },
                { emoji: "🎓", label: "My Courses" },
                { emoji: "🎥", label: "Live Classes", active: true },
                { emoji: "📝", label: "Assignments" },
                { emoji: "🎓", label: "Certificates" },
                { emoji: "🧑🎓", label: "Students Directory" },
                { emoji: "🧑🏫", label: "Trainers Directory" },
                { emoji: "🏢", label: "Companies Directory" },
                { emoji: "👤", label: "Profile" },
              ].map(({ emoji, label, active }) => (
                <div
                  key={label}
                  onClick={() => setActiveSidebarTab(label)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 14px",
                    borderRadius: 10,
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: "pointer",
                    color: active ? "#ffffff" : "#3b3f46",
                    background: active ? "#6b6bf5" : "transparent",
                  }}
                >
                  <span style={{ fontSize: 18 }}>{emoji}</span>
                  <span>{label}</span>
                </div>
              ))}
            </nav>
          </div>

          <div style={{ padding: "26px 22px 0" }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1,
                color: "#9aa1ac",
                marginBottom: 10,
              }}
            >
              SETTINGS
            </div>
            <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div
                onClick={() => setActiveSidebarTab('Settings')}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 14px",
                  borderRadius: 10,
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: "pointer",
                  color: "#3b3f46",
                }}
              >
                <span style={{ fontSize: 18 }}>⚙️</span>
                <span>Settings</span>
              </div>
              <div
                onClick={handleSignOut}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 14px",
                  borderRadius: 10,
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: "pointer",
                  color: "#3b3f46",
                }}
              >
                <span style={{ fontSize: 18 }}>🔋</span>
                <span>Logout</span>
              </div>
            </nav>
          </div>
        </aside>

        {/* Main Panel */}
        <div style={{ flex: 1 }}>
          {/* Top bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "22px 40px 18px",
            }}
          >
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "#5b3fd6", margin: 0 }}>Dashboard</h1>

            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  background: "#e6f4fb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Search size={16} color="#2fa9d8" />
              </div>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  background: "#fff4e0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Bell size={16} color="#f2a93b" fill="#f2a93b" />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={handleSignOut}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "#3d5afe",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 14,
                  }}
                >
                  {user.fullName ? user.fullName[0] : 'T'}
                </div>
                <div style={{ lineHeight: 1.25 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1f2937" }}>{user.fullName || 'Tharaneesh'}</div>
                  <div style={{ fontSize: 12, color: "#9aa1ac" }}>Logout</div>
                </div>
              </div>
            </div>
          </div>

          {/* Live Class Sessions card */}
          <div
            style={{
              margin: "0 40px",
              background: "#ffffff",
              border: "1px solid #eceef1",
              borderRadius: 14,
              padding: "22px 28px 8px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <Users size={20} color="#5b3fd6" />
              <span style={{ fontSize: 19, fontWeight: 800, color: "#1f2937" }}>
                Live Class Sessions
              </span>
            </div>

            {[
              {
                title: "Python Web Frameworks: Django & Flask",
                trainer: "Trainer Daniel Scott",
                time: "July 10, 2026 • 11:00 AM - 12:30 PM",
                status: "Scheduled",
              },
              {
                title: "React State Management: Redux & Context API",
                trainer: "Trainer John Doe",
                time: "Today • 03:00 PM - 04:30 PM",
                status: "Live Now",
              },
              {
                title: "Advanced MongoDB Aggregate Pipelines",
                trainer: "Trainer Sarah Connor",
                time: "July 14, 2026 • 02:00 PM - 03:30 PM",
                status: "Scheduled",
              },
            ].map((c, i) => (
              <div
                key={c.title}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  padding: "16px 0",
                  borderTop: i === 0 ? "1px solid #eceef1" : "1px solid #f1f2f4",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 15.5, fontWeight: 800, color: "#1f2937" }}>
                      {c.title}
                    </span>
                    {c.status === "Live Now" ? (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                          fontSize: 11.5,
                          fontWeight: 700,
                          color: "#e11d48",
                        }}
                      >
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: "#e11d48",
                            display: "inline-block",
                          }}
                        />
                        Live Now
                      </span>
                    ) : (
                      <span style={{ fontSize: 11.5, fontWeight: 700, color: "#3d5afe" }}>
                        ⏱ Scheduled
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 13, color: "#374151", marginTop: 4 }}>
                    Trainer: <strong>{c.trainer}</strong>
                  </div>
                  <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>
                    Session Time: {c.time}
                  </div>
                </div>

                <div style={{ flexShrink: 0, marginLeft: 20 }}>
                  {c.status === "Live Now" ? (
                    <button
                      onClick={() => showToast('Joining video call...')}
                      style={{
                        background: "#e11d48",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: 6,
                        padding: "8px 16px",
                        fontSize: 12.5,
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      Join Live Room
                    </button>
                  ) : (
                    <button
                      onClick={() => showToast('Class has not started yet.')}
                      style={{
                        background: "#ffffff",
                        color: "#374151",
                        border: "1px solid #d1d5db",
                        borderRadius: 6,
                        padding: "8px 16px",
                        fontSize: 12.5,
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      Add to Calendar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (user.role === 'student' && activeSidebarTab === 'Certificates') {
    return (
      <div style={{ display: "flex", fontFamily: "'Inter','Segoe UI',sans-serif", background: "#fafafc", minHeight: "100vh", width: '100%' }}>
        {/* Sidebar */}
        <aside
          style={{
            width: 300,
            background: "#ffffff",
            borderRight: "1px solid #eceef1",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
            textAlign: 'left'
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "24px 26px" }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                background: "#fdeaea",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
              }}
            >
              🦁
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 20, color: "#3d5afe", lineHeight: 1.1 }}>MBK</div>
              <div style={{ fontSize: 10.5, letterSpacing: 1, color: "#9aa1ac", fontWeight: 600 }}>
                CARRIERZ
              </div>
            </div>
          </div>

          <div style={{ borderTop: "1px solid #eceef1", margin: "0 0 18px" }} />

          {/* Main menu */}
          <div style={{ padding: "0 22px" }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1,
                color: "#9aa1ac",
                marginBottom: 10,
              }}
            >
              MAIN MENU
            </div>

            <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {[
                { emoji: "📊", label: "Dashboard" },
                { emoji: "🎓", label: "My Courses" },
                { emoji: "🎥", label: "Live Classes" },
                { emoji: "📝", label: "Assignments" },
                { emoji: "🎓", label: "Certificates" },
                { emoji: "🧑‍🎓", label: "Students Directory" },
                { emoji: "🧑‍🏫", label: "Trainers Directory" },
                { emoji: "🏢", label: "Companies Directory" },
                { emoji: "👤", label: "Profile" },
              ].map(({ emoji, label }) => {
                const active = activeSidebarTab === label;
                return (
                  <div
                    key={label}
                    onClick={() => setActiveSidebarTab(label)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "12px 14px",
                      borderRadius: 10,
                      fontSize: 15,
                      fontWeight: 700,
                      cursor: "pointer",
                      color: active ? "#ffffff" : "#3b3f46",
                      background: active ? "#6b6bf5" : "transparent",
                    }}
                  >
                    <span style={{ fontSize: 18 }}>{emoji}</span>
                    <span>{label}</span>
                  </div>
                );
              })}
            </nav>
          </div>

          <div style={{ padding: "26px 22px 0" }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1,
                color: "#9aa1ac",
                marginBottom: 10,
              }}
            >
              SETTINGS
            </div>
            <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div
                onClick={() => setActiveSidebarTab('Settings')}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 14px",
                  borderRadius: 10,
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: "pointer",
                  color: activeSidebarTab === 'Settings' ? '#6b6bf5' : '#3b3f46',
                }}
              >
                <span style={{ fontSize: 18 }}>⚙️</span>
                <span>Settings</span>
              </div>
              <div
                onClick={handleSignOut}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 14px",
                  borderRadius: 10,
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: "pointer",
                  color: "#3b3f46",
                }}
              >
                <span style={{ fontSize: 18 }}>🔋</span>
                <span>Logout</span>
              </div>
            </nav>
          </div>
        </aside>

        {/* Main Panel */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", textAlign: 'left' }}>
          {/* TopBar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "22px 40px 18px",
            }}
          >
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "#5b3fd6", margin: 0 }}>Certificates</h1>

            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  background: "#e6f4fb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Search size={16} color="#2fa9d8" />
              </div>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  background: "#fff4e0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Bell size={16} color="#f2a93b" fill="#f2a93b" />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={handleSignOut}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "#3d5afe",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 14,
                  }}
                >
                  {user.fullName ? user.fullName[0] : 'T'}
                </div>
                <div style={{ lineHeight: 1.25 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1f2937" }}>{user.fullName || 'Tharaneesh'}</div>
                  <div style={{ fontSize: 12, color: "#9aa1ac" }}>Logout</div>
                </div>
              </div>
            </div>
          </div>

          {/* Directory Card */}
          <div
            style={{
              margin: "0 40px",
              background: "#ffffff",
              border: "1px solid #eceef1",
              borderRadius: 14,
              padding: "22px 28px 28px",
            }}
          >
            <div style={{ fontSize: 20, fontWeight: 800, color: "#1f2937", marginBottom: 20 }}>
              My Certificates
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
              {[
                { title: "Responsive Web Design Mastery", issueDate: "May 14, 2026", id: "MBK-CS-89210" }
              ].map((c) => (
                <div
                  key={c.id}
                  style={{
                    width: 280,
                    background: "#f7f8fa",
                    border: "1px solid #eceef1",
                    borderRadius: 10,
                    overflow: "hidden",
                  }}
                >
                  <div style={{ padding: "20px 20px 16px" }}>
                    <div style={{ fontSize: 26, marginBottom: 12 }}>🎓</div>
                    <div style={{ fontSize: 15.5, fontWeight: 800, color: "#1f2937", marginBottom: 6 }}>
                      {c.title}
                    </div>
                    <div style={{ fontSize: 12.5, color: "#8a909a", marginBottom: 4 }}>
                      Issue Date: {c.issueDate}
                    </div>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: "#3d5afe" }}>
                      ID: {c.id}
                    </div>
                  </div>

                  <button
                    onClick={() => showToast('Downloading certificate pdf...')}
                    style={{
                      width: "100%",
                      background: "#f2a93b",
                      color: "#ffffff",
                      border: "none",
                      padding: "12px 0",
                      fontSize: 13.5,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Download Certificate
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (user.role === 'student' && activeSidebarTab === 'Students Directory') {
    return (
      <div style={{ display: "flex", fontFamily: "'Inter','Segoe UI',sans-serif", background: "#fafafc", minHeight: "100vh", width: '100%' }}>
        {/* Sidebar */}
        <aside
          style={{
            width: 300,
            background: "#ffffff",
            borderRight: "1px solid #eceef1",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
            textAlign: 'left'
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "24px 26px" }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                background: "#fdeaea",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
              }}
            >
              🦁
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 20, color: "#3d5afe", lineHeight: 1.1 }}>MBK</div>
              <div style={{ fontSize: 10.5, letterSpacing: 1, color: "#9aa1ac", fontWeight: 600 }}>
                CARRIERZ
              </div>
            </div>
          </div>

          <div style={{ borderTop: "1px solid #eceef1", margin: "0 0 18px" }} />

          {/* Main menu */}
          <div style={{ padding: "0 22px" }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1,
                color: "#9aa1ac",
                marginBottom: 10,
              }}
            >
              MAIN MENU
            </div>

            <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {[
                { emoji: "📊", label: "Dashboard" },
                { emoji: "🎓", label: "My Courses" },
                { emoji: "🎥", label: "Live Classes" },
                { emoji: "📝", label: "Assignments" },
                { emoji: "🎓", label: "Certificates" },
                { emoji: "🧑‍🎓", label: "Students Directory" },
                { emoji: "🧑‍🏫", label: "Trainers Directory" },
                { emoji: "🏢", label: "Companies Directory" },
                { emoji: "👤", label: "Profile" },
              ].map(({ emoji, label }) => {
                const active = activeSidebarTab === label;
                return (
                  <div
                    key={label}
                    onClick={() => setActiveSidebarTab(label)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "12px 14px",
                      borderRadius: 10,
                      fontSize: 15,
                      fontWeight: 700,
                      cursor: "pointer",
                      color: active ? "#ffffff" : "#3b3f46",
                      background: active ? "#6b6bf5" : "transparent",
                    }}
                  >
                    <span style={{ fontSize: 18 }}>{emoji}</span>
                    <span>{label}</span>
                  </div>
                );
              })}
            </nav>
          </div>

          <div style={{ padding: "26px 22px 0" }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1,
                color: "#9aa1ac",
                marginBottom: 10,
              }}
            >
              SETTINGS
            </div>
            <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div
                onClick={() => setActiveSidebarTab('Settings')}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 14px",
                  borderRadius: 10,
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: "pointer",
                  color: activeSidebarTab === 'Settings' ? '#6b6bf5' : '#3b3f46',
                }}
              >
                <span style={{ fontSize: 18 }}>⚙️</span>
                <span>Settings</span>
              </div>
              <div
                onClick={handleSignOut}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 14px",
                  borderRadius: 10,
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: "pointer",
                  color: "#3b3f46",
                }}
              >
                <span style={{ fontSize: 18 }}>🔋</span>
                <span>Logout</span>
              </div>
            </nav>
          </div>
        </aside>

        {/* Main Panel */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", textAlign: 'left' }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "22px 40px 18px",
            }}
          >
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "#5b3fd6", margin: 0 }}>Students Directory</h1>

            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  background: "#e6f4fb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Search size={16} color="#2fa9d8" />
              </div>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  background: "#fff4e0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Bell size={16} color="#f2a93b" fill="#f2a93b" />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={handleSignOut}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "#3d5afe",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 14,
                  }}
                >
                  {user.fullName ? user.fullName[0] : 'T'}
                </div>
                <div style={{ lineHeight: 1.25 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1f2937" }}>{user.fullName || 'Tharaneesh'}</div>
                  <div style={{ fontSize: 12, color: "#9aa1ac" }}>Logout</div>
                </div>
              </div>
            </div>
          </div>

          {/* Directory Card */}
          <div
            style={{
              margin: "0 40px",
              background: "#ffffff",
              border: "1px solid #eceef1",
              borderRadius: 14,
              padding: "22px 28px",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Users size={20} color="#5b3fd6" />
                  <span style={{ fontSize: 19, fontWeight: 800, color: "#1f2937" }}>
                    Students Directory
                  </span>
                </div>
                <p style={{ fontSize: 13.5, color: "#8a909a", marginTop: 8, marginLeft: 30 }}>
                  Browse through registered students, view their skills, specs, and resumes.
                </p>
              </div>

              <button
                onClick={() => fetchDirectoryUsers()}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  background: "#eef1ff",
                  color: "#3d5afe",
                  border: "none",
                  borderRadius: 8,
                  padding: "7px 14px",
                  fontSize: 12.5,
                  fontWeight: 700,
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                <RefreshCw size={13} /> Refresh
              </button>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 20 }}>
              <thead>
                <tr>
                  {["Name / Profile", "College & Dept", "Skills & Specifications", "Action"].map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: "left",
                        fontSize: 14.5,
                        fontWeight: 800,
                        color: "#1f2937",
                        padding: "10px 0",
                        borderBottom: "1px solid #eceef1",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "mrs.Tharaneesh", college: "Government College of Engineering", dept: "Computer Science", skills: ["Python", "Java", "React"] },
                ].map((s) => (
                  <tr key={s.name} style={{ borderBottom: "1px solid #f1f2f4" }}>
                    <td style={{ padding: "12px 0", verticalAlign: "top" }}>
                      <div style={{ fontSize: 14.5, fontWeight: 700, color: "#1f2937" }}>{s.name}</div>
                      <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 0.5, color: "#a5abb5" }}>
                        STUDENT
                      </div>
                    </td>
                    <td style={{ padding: "12px 0", verticalAlign: "top" }}>
                      <div style={{ fontSize: 14.5, fontWeight: 600, color: "#374151" }}>{s.college}</div>
                      <div style={{ fontSize: 13, color: "#8a909a", marginTop: 2 }}>{s.dept}</div>
                    </td>
                    <td style={{ padding: "12px 0", verticalAlign: "top" }}>
                      {s.skills.map((sk) => (
                        <span
                          key={sk}
                          style={{ fontSize: 13.5, fontWeight: 700, color: "#374151", marginRight: 16 }}
                        >
                          {sk}
                        </span>
                      ))}
                    </td>
                    <td style={{ padding: "12px 0", verticalAlign: "top" }}>
                      <button
                        onClick={() => handleViewProfile({ email: 'tharaneeshkp@gmail.com', fullName: s.name, role: 'student' })}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          background: "#f2a93b",
                          color: "#ffffff",
                          border: "none",
                          borderRadius: 6,
                          padding: "7px 14px",
                          fontSize: 12.5,
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        <Search size={13} /> View Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (user.role === 'student' && activeSidebarTab === 'Trainers Directory') {
    return (
      <div style={{ display: "flex", fontFamily: "'Inter','Segoe UI',sans-serif", background: "#fafafc", minHeight: "100vh", width: '100%' }}>
        {/* Sidebar */}
        <aside
          style={{
            width: 300,
            background: "#ffffff",
            borderRight: "1px solid #eceef1",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
            textAlign: 'left'
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "24px 26px" }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                background: "#fdeaea",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
              }}
            >
              🦁
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 20, color: "#3d5afe", lineHeight: 1.1 }}>MBK</div>
              <div style={{ fontSize: 10.5, letterSpacing: 1, color: "#9aa1ac", fontWeight: 600 }}>
                CARRIERZ
              </div>
            </div>
          </div>

          <div style={{ borderTop: "1px solid #eceef1", margin: "0 0 18px" }} />

          {/* Main menu */}
          <div style={{ padding: "0 22px" }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1,
                color: "#9aa1ac",
                marginBottom: 10,
              }}
            >
              MAIN MENU
            </div>

            <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {[
                { emoji: "📊", label: "Dashboard" },
                { emoji: "🎓", label: "My Courses" },
                { emoji: "🎥", label: "Live Classes" },
                { emoji: "📝", label: "Assignments" },
                { emoji: "🎓", label: "Certificates" },
                { emoji: "🧑‍🎓", label: "Students Directory" },
                { emoji: "🧑‍🏫", label: "Trainers Directory" },
                { emoji: "🏢", label: "Companies Directory" },
                { emoji: "👤", label: "Profile" },
              ].map(({ emoji, label }) => {
                const active = activeSidebarTab === label;
                return (
                  <div
                    key={label}
                    onClick={() => setActiveSidebarTab(label)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "12px 14px",
                      borderRadius: 10,
                      fontSize: 15,
                      fontWeight: 700,
                      cursor: "pointer",
                      color: active ? "#ffffff" : "#3b3f46",
                      background: active ? "#6b6bf5" : "transparent",
                    }}
                  >
                    <span style={{ fontSize: 18 }}>{emoji}</span>
                    <span>{label}</span>
                  </div>
                );
              })}
            </nav>
          </div>

          <div style={{ padding: "26px 22px 0" }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1,
                color: "#9aa1ac",
                marginBottom: 10,
              }}
            >
              SETTINGS
            </div>
            <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div
                onClick={() => setActiveSidebarTab('Settings')}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 14px",
                  borderRadius: 10,
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: "pointer",
                  color: activeSidebarTab === 'Settings' ? '#6b6bf5' : '#3b3f46',
                }}
              >
                <span style={{ fontSize: 18 }}>⚙️</span>
                <span>Settings</span>
              </div>
              <div
                onClick={handleSignOut}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 14px",
                  borderRadius: 10,
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: "pointer",
                  color: "#3b3f46",
                }}
              >
                <span style={{ fontSize: 18 }}>🔋</span>
                <span>Logout</span>
              </div>
            </nav>
          </div>
        </aside>

        {/* Main Panel */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", textAlign: 'left' }}>
          {/* TopBar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "22px 40px 18px",
            }}
          >
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "#5b3fd6", margin: 0 }}>Trainers Directory</h1>

            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  background: "#e6f4fb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Search size={16} color="#2fa9d8" />
              </div>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  background: "#fff4e0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Bell size={16} color="#f2a93b" fill="#f2a93b" />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={handleSignOut}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "#3d5afe",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 14,
                  }}
                >
                  {user.fullName ? user.fullName[0] : 'T'}
                </div>
                <div style={{ lineHeight: 1.25 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1f2937" }}>{user.fullName || 'Tharaneesh'}</div>
                  <div style={{ fontSize: 12, color: "#9aa1ac" }}>Logout</div>
                </div>
              </div>
            </div>
          </div>

          {/* Directory Card */}
          <div
            style={{
              margin: "0 40px",
              background: "#ffffff",
              border: "1px solid #eceef1",
              borderRadius: 14,
              padding: "22px 28px",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Users size={20} color="#5b3fd6" />
                  <span style={{ fontSize: 19, fontWeight: 800, color: "#1f2937" }}>
                    Trainers Directory
                  </span>
                </div>
                <p style={{ fontSize: 13.5, color: "#8a909a", marginTop: 8, marginLeft: 30 }}>
                  Browse through registered trainers, view their skills, specs, and resumes.
                </p>
              </div>

              <button
                onClick={() => fetchDirectoryUsers()}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  background: "#eef1ff",
                  color: "#3d5afe",
                  border: "none",
                  borderRadius: 8,
                  padding: "7px 14px",
                  fontSize: 12.5,
                  fontWeight: 700,
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                <RefreshCw size={13} /> Refresh
              </button>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 20 }}>
              <thead>
                <tr>
                  {["Name / Profile", "Expertise", "Skills & Specifications", "Action"].map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: "left",
                        fontSize: 14.5,
                        fontWeight: 800,
                        color: "#1f2937",
                        padding: "10px 0",
                        borderBottom: "1px solid #eceef1",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Dhoni", expertise: "Software Dev", course: "Web Development BootCamp", mode: "Online" },
                  { name: "nithya", expertise: "python development", course: "fsghtyng", mode: "Online" },
                  { name: "Praveen Kumar", expertise: "python developer", course: "python", mode: "Online" },
                ].map((t) => (
                  <tr key={t.name} style={{ borderBottom: "1px solid #f1f2f4" }}>
                    <td style={{ padding: "12px 0", verticalAlign: "top" }}>
                      <div style={{ fontSize: 14.5, fontWeight: 700, color: "#1f2937" }}>{t.name}</div>
                      <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 0.5, color: "#a5abb5" }}>
                        TRAINER
                      </div>
                    </td>
                    <td style={{ padding: "12px 0", verticalAlign: "top" }}>
                      <span style={{ fontSize: 14.5, fontWeight: 700, color: "#374151" }}>
                        {t.expertise}
                      </span>
                    </td>
                    <td style={{ padding: "12px 0", verticalAlign: "top" }}>
                      <span style={{ fontSize: 13.5, color: "#4b5563" }}>
                        Proposed Course: <strong style={{ color: "#1f2937" }}>{t.course}</strong>{" "}
                        ({t.mode})
                      </span>
                    </td>
                    <td style={{ padding: "12px 0", verticalAlign: "top" }}>
                      <button
                        onClick={() => handleViewProfile({ email: t.name + '@gmail.com', fullName: t.name, role: 'trainer' })}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          background: "#f2a93b",
                          color: "#ffffff",
                          border: "none",
                          borderRadius: 6,
                          padding: "7px 14px",
                          fontSize: 12.5,
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        <Search size={13} /> View Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (user.role === 'student' && activeSidebarTab === 'Companies Directory') {
    return (
      <div style={{ display: "flex", fontFamily: "'Inter','Segoe UI',sans-serif", background: "#fafafc", minHeight: "100vh", width: '100%' }}>
        {/* Sidebar */}
        <aside
          style={{
            width: 300,
            background: "#ffffff",
            borderRight: "1px solid #eceef1",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
            textAlign: 'left'
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "24px 26px" }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                background: "#fdeaea",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
              }}
            >
              🦁
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 20, color: "#3d5afe", lineHeight: 1.1 }}>MBK</div>
              <div style={{ fontSize: 10.5, letterSpacing: 1, color: "#9aa1ac", fontWeight: 600 }}>
                CARRIERZ
              </div>
            </div>
          </div>

          <div style={{ borderTop: "1px solid #eceef1", margin: "0 0 18px" }} />

          {/* Main menu */}
          <div style={{ padding: "0 22px" }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1,
                color: "#9aa1ac",
                marginBottom: 10,
              }}
            >
              MAIN MENU
            </div>

            <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {[
                { emoji: "📊", label: "Dashboard" },
                { emoji: "🎓", label: "My Courses" },
                { emoji: "🎥", label: "Live Classes" },
                { emoji: "📝", label: "Assignments" },
                { emoji: "🎓", label: "Certificates" },
                { emoji: "🧑‍🎓", label: "Students Directory" },
                { emoji: "🧑‍🏫", label: "Trainers Directory" },
                { emoji: "🏢", label: "Companies Directory" },
                { emoji: "👤", label: "Profile" },
              ].map(({ emoji, label }) => {
                const active = activeSidebarTab === label;
                return (
                  <div
                    key={label}
                    onClick={() => setActiveSidebarTab(label)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "12px 14px",
                      borderRadius: 10,
                      fontSize: 15,
                      fontWeight: 700,
                      cursor: "pointer",
                      color: active ? "#ffffff" : "#3b3f46",
                      background: active ? "#6b6bf5" : "transparent",
                    }}
                  >
                    <span style={{ fontSize: 18 }}>{emoji}</span>
                    <span>{label}</span>
                  </div>
                );
              })}
            </nav>
          </div>

          <div style={{ padding: "26px 22px 0" }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1,
                color: "#9aa1ac",
                marginBottom: 10,
              }}
            >
              SETTINGS
            </div>
            <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div
                onClick={() => setActiveSidebarTab('Settings')}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 14px",
                  borderRadius: 10,
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: "pointer",
                  color: activeSidebarTab === 'Settings' ? '#6b6bf5' : '#3b3f46',
                }}
              >
                <span style={{ fontSize: 18 }}>⚙️</span>
                <span>Settings</span>
              </div>
              <div
                onClick={handleSignOut}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 14px",
                  borderRadius: 10,
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: "pointer",
                  color: "#3b3f46",
                }}
              >
                <span style={{ fontSize: 18 }}>🔋</span>
                <span>Logout</span>
              </div>
            </nav>
          </div>
        </aside>

        {/* Main Panel */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", textAlign: 'left' }}>
          {/* TopBar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "22px 40px 18px",
            }}
          >
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "#5b3fd6", margin: 0 }}>Companies Directory</h1>

            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  background: "#e6f4fb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Search size={16} color="#2fa9d8" />
              </div>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  background: "#fff4e0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Bell size={16} color="#f2a93b" fill="#f2a93b" />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={handleSignOut}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "#3d5afe",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 14,
                  }}
                >
                  {user.fullName ? user.fullName[0] : 'T'}
                </div>
                <div style={{ lineHeight: 1.25 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1f2937" }}>{user.fullName || 'Tharaneesh'}</div>
                  <div style={{ fontSize: 12, color: "#9aa1ac" }}>Logout</div>
                </div>
              </div>
            </div>
          </div>

          {/* Directory Card */}
          <div
            style={{
              margin: "0 40px",
              background: "#ffffff",
              border: "1px solid #eceef1",
              borderRadius: 14,
              padding: "22px 28px",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Users size={20} color="#5b3fd6" />
                  <span style={{ fontSize: 19, fontWeight: 800, color: "#1f2937" }}>
                    Companys Directory
                  </span>
                </div>
                <p style={{ fontSize: 13.5, color: "#8a909a", marginTop: 8, marginLeft: 30 }}>
                  Browse through registered companys, view their skills, specs, and resumes.
                </p>
              </div>

              <button
                onClick={() => fetchDirectoryUsers()}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  background: "#eef1ff",
                  color: "#3d5afe",
                  border: "none",
                  borderRadius: 8,
                  padding: "7px 14px",
                  fontSize: 12.5,
                  fontWeight: 700,
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                <RefreshCw size={13} /> Refresh
              </button>
            </div>

            <div style={{ padding: "60px 0", textAlign: "center" }}>
              <span style={{ fontSize: 14, color: "#9aa1ac", fontWeight: 500 }}>
                No companys registered yet.
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="lms-dashboard-wrapper"
      style={{
        backgroundColor: '#F5F6FB',
        color: '#1B1F3B',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      
      {/* MOBILE DRAWER SIDEBAR */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/60 lg:hidden flex transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <aside 
            className="w-[280px] h-full p-6 flex flex-col justify-between shadow-2xl transition-transform duration-300 transform translate-x-0"
            style={{ backgroundColor: '#FFFFFF' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              {/* Logo */}
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img 
                    src="/logo.png" 
                    alt="MBK Technology Logo" 
                    className="h-12 w-12 object-contain" 
                  />
                  <div className="lms-logo-text">
                    <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#4C5FD5', fontFamily: "'Inter', sans-serif", lineHeight: 1.1 }}>MBK</h2>
                    <p style={{ fontSize: '10px', color: '#64748B', textTransform: 'uppercase', fontWeight: 800, margin: '2px 0 0 0', letterSpacing: '1.2px', fontFamily: "'Inter', sans-serif" }}>CarrierZ</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-slate-400 hover:text-slate-655 text-2xl bg-transparent border-0 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Dynamic Menu items */}
              <nav className="flex flex-col gap-1.5">
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '9px', fontWeight: 700, color: '#A3AED0', letterSpacing: '0.08em', textTransform: 'uppercase', paddingLeft: '16px', marginBottom: '6px', display: 'block' }}>Main Menu</span>
                {getSidebarItems().filter(item => item.name !== 'Logout' && item.name !== 'Settings').map((item) => (
                  <div
                    key={item.name}
                    onClick={() => {
                      setActiveSidebarTab(item.name);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl cursor-pointer text-sm font-semibold transition-all duration-250 ${
                      activeSidebarTab === item.name 
                        ? 'text-white font-bold' 
                        : 'text-slate-500 hover:bg-[#F3F5FF] hover:text-[#4C5FD5]'
                    }`}
                    style={{
                      backgroundColor: activeSidebarTab === item.name ? '#4C5FD5' : 'transparent',
                    }}
                  >
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                  </div>
                ))}

                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '9px', fontWeight: 700, color: '#A3AED0', letterSpacing: '0.08em', textTransform: 'uppercase', paddingLeft: '16px', marginTop: '16px', marginBottom: '6px', display: 'block' }}>Settings</span>
                {getSidebarItems().filter(item => item.name === 'Logout' || item.name === 'Settings').map((item) => (
                  <div
                    key={item.name}
                    onClick={() => {
                      if (item.action) {
                        item.action();
                      } else {
                        setActiveSidebarTab(item.name);
                        setIsMobileMenuOpen(false);
                      }
                    }}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl cursor-pointer text-sm font-semibold transition-all duration-250 ${
                      activeSidebarTab === item.name 
                        ? 'text-white font-bold' 
                        : (item.name === 'Logout' ? 'text-rose-500 hover:bg-rose-50' : 'text-slate-500 hover:bg-[#F3F5FF] hover:text-[#4C5FD5]')
                    }`}
                    style={{
                      backgroundColor: activeSidebarTab === item.name ? '#4C5FD5' : 'transparent',
                    }}
                  >
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                  </div>
                ))}
              </nav>
            </div>
            
            <div className="text-[11px] text-slate-400 pt-4 border-t border-slate-100">
              © 2026 MBK CarrierZ
            </div>
          </aside>
        </div>
      )}

      {/* DESKTOP SIDEBAR */}
      <aside className="lms-sidebar" style={{ backgroundColor: '#FFFFFF', borderRight: '1px solid #E7E9F5' }}>
        <div>
          {/* Logo brand area */}
          <div className="lms-logo-area" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px', paddingBottom: '16px', borderBottom: '1px solid #E7E9F5' }}>
            <img 
              src="/logo.png" 
              alt="MBK Technology Logo" 
              className="h-12 w-12 object-contain" 
            />
            <div className="lms-logo-text">
              <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#4C5FD5', fontFamily: "'Inter', sans-serif", lineHeight: 1.1 }}>MBK</h2>
              <p style={{ fontSize: '10px', color: '#64748B', textTransform: 'uppercase', fontWeight: 800, margin: '2px 0 0 0', letterSpacing: '1.2px', fontFamily: "'Inter', sans-serif" }}>CarrierZ</p>
            </div>
          </div>

          {/* Dynamic Menu items */}
          <nav className="lms-menu-section" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '9px', fontWeight: 700, color: '#A3AED0', letterSpacing: '0.08em', textTransform: 'uppercase', paddingLeft: '16px', marginBottom: '6px', display: 'block' }}>Main Menu</span>
            {getSidebarItems().filter(item => item.name !== 'Logout' && item.name !== 'Settings').map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveSidebarTab(item.name)}
                className={`lms-menu-item flex items-center gap-3 px-4 py-2.5 rounded-xl border-0 outline-none w-full text-left font-semibold text-xs sm:text-sm transition-all duration-150 ${
                  activeSidebarTab === item.name 
                    ? 'text-white' 
                    : 'text-slate-500 hover:bg-[#F3F5FF] hover:text-[#4C5FD5]'
                }`}
                style={{
                  backgroundColor: activeSidebarTab === item.name ? '#4C5FD5' : 'transparent',
                }}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.name}</span>
              </button>
            ))}

            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '9px', fontWeight: 700, color: '#A3AED0', letterSpacing: '0.08em', textTransform: 'uppercase', paddingLeft: '16px', marginTop: '16px', marginBottom: '6px', display: 'block' }}>Settings</span>
            {getSidebarItems().filter(item => item.name === 'Logout' || item.name === 'Settings').map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  if (item.action) {
                    item.action();
                  } else {
                    setActiveSidebarTab(item.name);
                  }
                }}
                className={`lms-menu-item flex items-center gap-3 px-4 py-2.5 rounded-xl border-0 outline-none w-full text-left font-semibold text-xs sm:text-sm transition-all duration-150 ${
                  activeSidebarTab === item.name 
                    ? 'text-white' 
                    : (item.name === 'Logout' ? 'text-rose-500 hover:bg-rose-50' : 'text-slate-500 hover:bg-[#F3F5FF] hover:text-[#4C5FD5]')
                }`}
                style={{
                  backgroundColor: activeSidebarTab === item.name ? '#4C5FD5' : 'transparent',
                }}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* RIGHT MAIN PANEL */}
      <div className="lms-main-content" style={{ backgroundColor: '#F5F6FB', minHeight: '100vh', padding: '30px 40px' }}>
        {/* Top Header */}
        <div className="lms-header-bar flex items-center justify-between mb-8 pb-4 border-b border-[#E7E9F5]">
          <div className="flex items-center gap-4">
            {/* Hamburger Button for mobile */}
            <button 
              className="mobile-hamburger-btn p-2 text-xl hover:bg-slate-100 rounded-xl"
              onClick={() => setIsMobileMenuOpen(true)}
              style={{ display: 'none' }}
            >
              ☰
            </button>
            <h2 className="text-lg font-bold text-[#1B1F3B] m-0" style={{ fontFamily: "'Inter', sans-serif" }}>Dashboard</h2>
          </div>

          {/* Right Header items */}
          <div className="flex items-center gap-5">
            {/* Search Icon */}
            <button className="border-none bg-transparent text-slate-400 hover:text-[#4C5FD5] cursor-pointer text-lg p-1">
              🔍
            </button>
            {/* Notifications Icon */}
            <button className="border-none bg-transparent text-slate-400 hover:text-[#4C5FD5] cursor-pointer text-lg p-1">
              🔔
            </button>

            {/* Profile Menu */}
            <div className="flex items-center gap-2.5 cursor-pointer">
              <div 
                className="w-9 h-9 rounded-full text-white flex items-center justify-center font-bold text-xs sm:text-sm"
                style={{ backgroundColor: '#4C5FD5', fontFamily: "'Inter', sans-serif" }}
              >
                {user.fullName ? user.fullName[0] : 'U'}
              </div>
              <div className="hidden sm:block text-left" onClick={handleSignOut}>
                <p className="m-0 text-xs font-bold leading-none mb-0.5 text-slate-800">{user.fullName}</p>
                <span className="text-[10px] block text-slate-400">Logout</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div>
          {/* Welcome Header */}
          {activeSidebarTab === 'Dashboard' && (
            <div className="mb-8 text-left">
              <h1 className="text-3xl font-bold m-0 mb-1 leading-tight text-[#1B1F3B]" style={{ fontFamily: "'Inter', sans-serif" }}>
                {user.role === 'trainer' ? 'Welcome back Trainer 👋' : user.role === 'company' ? `Welcome back ${user.fullName || 'ABC Technologies'} 👋` : `Welcome back ${user.fullName || 'John Doe'} 👋`}
              </h1>
              <p className="text-xs sm:text-sm m-0 text-slate-500 font-semibold">
                {user.role === 'trainer'
                  ? "You've completed 50% of your teaching goal this month"
                  : user.role === 'company'
                  ? "You've reviewed 50% of your applicants this month"
                  : "You've learned 50% of your goal this month"}
              </p>

              {/* Coding-Bootcamp-style Hero progress card */}
              <div 
                className="mt-6 p-6 rounded-2xl bg-white border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                style={{ borderColor: '#E7E9F5', borderRadius: '18px' }}
              >
                <div>
                  <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: '18px', fontWeight: 700, color: '#1B1F3B', margin: '0 0 4px 0' }}>
                    {user.role === 'trainer' ? 'Python Full Stack Bootcamp' : user.role === 'company' ? 'Frontend Developer (React) Drive' : 'Python Basics & Functions Mastery'}
                  </h3>
                  <span className="text-xs text-slate-400 font-semibold">Created by Daniel Walter Scott</span>
                </div>
                <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                  <ProgressRing percentage={50} />
                  <button 
                    onClick={() => setActiveSidebarTab('My Courses')}
                    className="py-2.5 px-6 rounded-xl text-white font-bold text-xs sm:text-sm cursor-pointer border-0 bg-[#4C5FD5] hover:bg-[#2A3EB1] transition-colors"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          )}

          {user.role === 'student' && renderStudentContent()}
          {user.role === 'trainer' && renderTrainerContent()}
          {user.role === 'company' && renderCompanyContent()}
        </div>
      </div>

      {toast && (
        <div 
          className="fixed bottom-6 right-6 text-white py-3 px-5 rounded-xl shadow-lg z-50 font-bold text-xs sm:text-sm bg-[#2F9E67]"
        >
          {toast.msg}
        </div>
      )}

      {viewingProfile && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(27, 31, 59, 0.6)',
          backdropFilter: 'blur(8px)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '30px',
            maxWidth: '560px',
            width: '100%',
            boxShadow: '0 25px 60px rgba(76,95,213,0.15)',
            border: '1px solid #E7E9F5',
            color: '#1B1F3B',
            position: 'relative'
          }}>
            <button
              onClick={() => setViewingProfile(null)}
              style={{
                position: 'absolute',
                top: '18px',
                right: '18px',
                border: 'none',
                background: 'transparent',
                fontSize: '22px',
                cursor: 'pointer',
                color: '#64748B'
              }}
            >
              ×
            </button>

            <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: '18px', fontWeight: 800, color: '#4C5FD5', marginBottom: '20px' }}>
              👤 User Profile Details
            </h3>

            {/* Profile Container */}
            <div style={{
              border: '1px solid #E7E9F5',
              borderRadius: '16px',
              padding: '20px',
              backgroundColor: '#F8FAFC',
              maxHeight: '360px',
              overflowY: 'auto',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #4C5FD5', paddingBottom: '10px', marginBottom: '14px' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 850, fontFamily: "'Inter', sans-serif" }}>
                    {viewingProfile.fullName || viewingProfile.companyName || 'Anonymous Profile'}
                  </h4>
                  <span style={{ fontSize: '11px', color: '#64748B', textTransform: 'uppercase', fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>
                    Role: {viewingProfile.role || 'student'}
                  </span>
                </div>
              </div>

              {/* Masked Contact Info Card */}
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #E7E9F5',
                padding: '14px',
                marginBottom: '16px'
              }}>
                <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', color: '#4C5FD5', display: 'block', marginBottom: '6px', fontFamily: "'Inter', sans-serif" }}>
                  🔒 Contact Details (Protected)
                </span>
                <p style={{ margin: 0, fontSize: '12.5px', color: '#64748B' }}>📧 Email: {viewingProfile.email}</p>
                <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: '#64748B' }}>
                  📞 Phone: {viewingProfile.phone || viewingProfile.hrPhone || '••••••••••'}
                </p>
                <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: '#64748B' }}>
                  📍 Location: {viewingProfile.location || viewingProfile.district || '••••••••••'}
                </p>
              </div>

              {/* Student details */}
              {viewingProfile.role === 'student' && (
                <>
                  <div style={{ marginBottom: '14px' }}>
                    <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', color: '#4C5FD5', display: 'block', marginBottom: '4px', fontFamily: "'Inter', sans-serif" }}>Education Specification</span>
                    <p style={{ margin: 0, fontSize: '13px', fontWeight: 700 }}>{viewingProfile.college || 'N/A'}</p>
                    <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748B' }}>
                      Degree: {viewingProfile.degree || 'N/A'} • Dept: {viewingProfile.department || 'N/A'}
                    </p>
                    <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748B' }}>
                      Graduation Year: {viewingProfile.gradYear || 'N/A'} • CGPA: {viewingProfile.cgpa || 'N/A'}
                    </p>
                  </div>

                  <div style={{ marginBottom: '14px' }}>
                    <span style={{ fontSize: '10px', fontWeight: 850, textTransform: 'uppercase', color: '#4C5FD5', display: 'block', marginBottom: '4px', fontFamily: "'Inter', sans-serif" }}>Skills</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                      {Array.isArray(viewingProfile.skills) ? viewingProfile.skills.map((s, idx) => (
                        <span key={idx} style={{ padding: '2px 8px', fontSize: '10px', fontWeight: 700, backgroundColor: '#F3F5FF', color: '#4C5FD5', borderRadius: '4px' }}>{s}</span>
                      )) : viewingProfile.skills || 'N/A'}
                    </div>
                  </div>

                  {(viewingProfile.projectTitle || viewingProfile.projectDesc) && (
                    <div style={{ marginBottom: '14px' }}>
                      <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', color: '#4C5FD5', display: 'block', marginBottom: '4px', fontFamily: "'Inter', sans-serif" }}>Academic Projects</span>
                      <p style={{ margin: 0, fontSize: '12.5px', fontWeight: 700 }}>{viewingProfile.projectTitle || 'Untitled Project'}</p>
                      <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748B', lineHeight: '1.4' }}>{viewingProfile.projectDesc}</p>
                    </div>
                  )}
                </>
              )}

              {/* Trainer details */}
              {viewingProfile.role === 'trainer' && (
                <>
                  <div style={{ marginBottom: '14px' }}>
                    <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', color: '#4C5FD5', display: 'block', marginBottom: '4px', fontFamily: "'Inter', sans-serif" }}>Specification</span>
                    <p style={{ margin: 0, fontSize: '12.5px', fontWeight: 700 }}>Expertise: {viewingProfile.expertise || 'N/A'}</p>
                    <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748B' }}>
                      Experience: {viewingProfile.experienceYears ? `${viewingProfile.experienceYears} Years` : 'N/A'}
                    </p>
                  </div>

                  {viewingProfile.summary && (
                    <div style={{ marginBottom: '14px' }}>
                      <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', color: '#4C5FD5', display: 'block', marginBottom: '4px', fontFamily: "'Inter', sans-serif" }}>Summary</span>
                      <p style={{ margin: 0, fontSize: '12px', color: '#64748B', lineHeight: '1.4' }}>{viewingProfile.summary}</p>
                    </div>
                  )}

                  {(viewingProfile.courseName || viewingProfile.category) && (
                    <div style={{ marginBottom: '14px' }}>
                      <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', color: '#4C5FD5', display: 'block', marginBottom: '4px', fontFamily: "'Inter', sans-serif" }}>Proposed Course</span>
                      <p style={{ margin: 0, fontSize: '12.5px', fontWeight: 700 }}>{viewingProfile.courseName}</p>
                      <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748B' }}>
                        Category: {viewingProfile.category} • Duration: {viewingProfile.duration || 'N/A'}
                      </p>
                      <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748B' }}>
                        Level: {viewingProfile.level} • Mode: {viewingProfile.teachingMode}
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* Company details */}
              {viewingProfile.role === 'company' && (
                <>
                  <div style={{ marginBottom: '14px' }}>
                    <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', color: '#4C5FD5', display: 'block', marginBottom: '4px', fontFamily: "'Inter', sans-serif" }}>Corporate Profile</span>
                    <p style={{ margin: 0, fontSize: '12.5px', fontWeight: 700 }}>Industry: {viewingProfile.industry || 'N/A'}</p>
                    <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748B' }}>
                      Company Size: {viewingProfile.companySize || 'N/A'}
                    </p>
                  </div>

                  {viewingProfile.companyDesc && (
                    <div style={{ marginBottom: '14px' }}>
                      <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', color: '#4C5FD5', display: 'block', marginBottom: '4px', fontFamily: "'Inter', sans-serif" }}>About Company</span>
                      <p style={{ margin: 0, fontSize: '12px', color: '#64748B', lineHeight: '1.4' }}>{viewingProfile.companyDesc}</p>
                    </div>
                  )}

                  <div style={{ marginBottom: '14px' }}>
                    <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', color: '#4C5FD5', display: 'block', marginBottom: '4px', fontFamily: "'Inter', sans-serif" }}>Recruitment details</span>
                    <p style={{ margin: 0, fontSize: '12px', color: '#64748B' }}><strong>Job Roles:</strong> {viewingProfile.jobRoles || 'N/A'}</p>
                    <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748B' }}><strong>Required Skills:</strong> {viewingProfile.requiredSkills || 'N/A'}</p>
                    <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748B' }}><strong>Work Mode:</strong> {viewingProfile.workMode || 'N/A'}</p>
                  </div>
                </>
              )}
            </div>

            {/* Privacy Badge */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: '#0284C7',
              backgroundColor: '#F0F9FF',
              border: '1px solid #BAE6FD',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 700,
              marginBottom: '20px'
            }}>
              <span>🛡️</span> Private details are protected until approved.
            </div>

            {/* Modal actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setViewingProfile(null)}
                style={{ padding: '10px 16px', backgroundColor: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: '8px', cursor: 'pointer', fontSize: '12.5px', fontWeight: 700 }}
              >
                Close
              </button>

              {viewingProfile.isMasked && (
                <button
                  disabled={viewingProfile.accessRequestStatus === 'Pending' || viewingProfile.accessRequestStatus === 'Approved'}
                  onClick={() => handleRequestAccess(viewingProfile.originalEmail, viewingProfile.fullName || viewingProfile.companyName, viewingProfile.role)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: viewingProfile.accessRequestStatus === 'Pending' ? '#E2E8F0' : '#4C5FD5',
                    color: viewingProfile.accessRequestStatus === 'Pending' ? '#94A3B8' : '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: viewingProfile.accessRequestStatus === 'Pending' ? 'not-allowed' : 'pointer',
                    fontSize: '12.5px',
                    fontWeight: 700
                  }}
                >
                  {viewingProfile.accessRequestStatus === 'Pending' 
                    ? '⌛ Access Pending Admin approval' 
                    : viewingProfile.accessRequestStatus === 'Approved'
                    ? '✓ Access Approved'
                    : '🔒 Request Contact Access'}
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
