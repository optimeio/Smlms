import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TrainerCarousel from '../components/TrainerCarousel';
import '../styles/Courses.css';

const coursesData = [
  {
    id: "python",
    title: "Python Course - Master Programming & Build Real-World Projects",
    desc: "Unlock your future in tech with an industry-focused Python course designed for beginners, students, and professionals who want to master programming and build practical software projects.",
    emoji: "🐍",
    gradient: "linear-gradient(135deg, #FF6B00, #FF9F43)",
    duration: "6 Weeks",
    syllabus: [
      "Python Basics: Variables, Loops & Functions",
      "Object-Oriented Programming (OOP) in Python",
      "Working with Files, APIs, and Databases",
      "Web Scraping and Automation Scripting",
      "Building Desktop UI & Real-World Projects"
    ]
  },
  {
    id: "fullstack",
    title: "Full Stack Development",
    desc: "Learn front-end, back-end, databases, APIs, deployment basics, and real-world application development with a project-first full stack curriculum.",
    emoji: "💻",
    gradient: "linear-gradient(135deg, #FF4D8D, #8B5CF6)",
    duration: "12 Weeks",
    syllabus: [
      "Frontend: HTML5, CSS3, JavaScript (ES6+)",
      "UI Library: React.js & Tailwind CSS",
      "Backend: Node.js & Express.js",
      "Database: MongoDB & SQL Integration",
      "API Development, Authentication, & Deployment"
    ]
  },
  {
    id: "powerbi",
    title: "Power BI Course - Master Data Visualization, Business Intelligence & Analytics",
    desc: "Build dashboards, reports, data models, and business intelligence workflows that turn raw data into clear decisions for modern teams.",
    emoji: "📊",
    gradient: "linear-gradient(135deg, #38BDF8, #8B5CF6)",
    duration: "4 Weeks",
    syllabus: [
      "Introduction to BI & Power BI Desktop Setup",
      "Data Transformation using Power Query",
      "Data Modeling & DAX Formulas",
      "Designing Interactive Reports & Dashboards",
      "Publishing Reports to Power BI Service"
    ]
  },
  {
    id: "digitalmarketing",
    title: "Digital Marketing Course - Master Online Marketing, SEO, Social Media & Lead Generation",
    desc: "Master SEO, social media strategy, content planning, campaigns, analytics, and lead generation for business growth across digital channels.",
    emoji: "🚀",
    gradient: "linear-gradient(135deg, #FF6B00, #FF4D8D)",
    duration: "6 Weeks",
    syllabus: [
      "Fundamentals of Marketing & Customer Personas",
      "Search Engine Optimization (SEO) & Google Analytics",
      "Social Media Marketing & Brand Strategy",
      "Paid Advertising (Google Ads, Meta Ads)",
      "Email Marketing, Lead Generation & Conversion Funnels"
    ]
  },
  {
    id: "mobileapp",
    title: "Mobile App Development Course - Build Android & iOS Apps with Modern Technologies",
    desc: "Create mobile applications with modern UI patterns, API integration, storage workflows, testing basics, and deployment readiness.",
    emoji: "📱",
    gradient: "linear-gradient(135deg, #10B981, #38BDF8)",
    duration: "8 Weeks",
    syllabus: [
      "Introduction to Mobile Frameworks (React Native / Flutter)",
      "Layout & Styling Responsive App Screens",
      "State Management & Client-Side Storage",
      "Integrating Rest APIs & Native Device Features",
      "Testing, Debugging, and App Store Submission"
    ]
  },
  {
    id: "sap",
    title: "SAP Course - Master Enterprise Resource Planning (ERP) & Business Process Management",
    desc: "Understand ERP concepts, business process flows, SAP fundamentals, and enterprise operations used across modern organizations.",
    emoji: "🏢",
    gradient: "linear-gradient(135deg, #8B5CF6, #38BDF8)",
    duration: "8 Weeks",
    syllabus: [
      "ERP Concepts and Enterprise Architecture",
      "Navigation & Basics of SAP GUI",
      "Core Modules: Material Management (MM) & Sales (SD)",
      "Financial Accounting (FI) & Controlling (CO)",
      "SAP Transactions & Standard Business Reporting"
    ]
  },
  {
    id: "excel",
    title: "Microsoft Excel Course - Master Data Analysis, Reporting & Spreadsheet Automation",
    desc: "Develop strong spreadsheet skills with formulas, reports, dashboards, data cleanup, analysis workflows, and automation-ready practices.",
    emoji: "📈",
    gradient: "linear-gradient(135deg, #FF9F43, #FF6B00)",
    duration: "4 Weeks",
    syllabus: [
      "Cell Formatting, Sorting & Filtering",
      "Essential Formulas (VLOOKUP, INDEX-MATCH, XLOOKUP)",
      "Data Analysis using Pivot Tables & Pivot Charts",
      "Advanced Functions & Dashboard Design",
      "Introduction to Excel Macros & Power Query"
    ]
  },
  {
    id: "tally",
    title: "Tally Course - Master Accounting, GST, Payroll & Business Finance Management",
    desc: "Learn accounting entries, GST workflows, payroll basics, inventory, financial reporting, and business finance management with Tally.",
    emoji: "💰",
    gradient: "linear-gradient(135deg, #10B981, #059669)",
    duration: "5 Weeks",
    syllabus: [
      "Double-Entry Accounting Principles",
      "Company Creation & Ledger Accounts in Tally",
      "Voucher Entries & Financial Statements",
      "GST Calculations, Invoicing & E-Way Bills",
      "Payroll Setup, Inventory Control & Banking"
    ]
  },
  {
    id: "ml",
    title: "Machine Learning Course - Master AI, Data Modeling & Predictive Analytics",
    desc: "Explore data preparation, model building, prediction workflows, evaluation, and applied machine learning concepts through practical exercises.",
    emoji: "🤖",
    gradient: "linear-gradient(135deg, #8B5CF6, #FF4D8D)",
    duration: "8 Weeks",
    syllabus: [
      "Mathematical Foundations & Data Preprocessing",
      "Supervised Learning: Regression & Classification",
      "Unsupervised Learning: Clustering & Dimensionality Reduction",
      "Model Evaluation Metrics & Hyperparameter Tuning",
      "Deploying Machine Learning Models as APIs"
    ]
  },
  {
    id: "ai",
    title: "Artificial Intelligence (AI) Course - Master Intelligent Systems, Automation & Smart Technologies",
    desc: "Build readiness in AI concepts, intelligent systems, automation, prompt-aware workflows, and smart technology applications for the future.",
    emoji: "🧠",
    gradient: "linear-gradient(135deg, #FF6B00, #8B5CF6)",
    duration: "6 Weeks",
    syllabus: [
      "Introduction to AI History, Paradigms & Ethics",
      "Neural Networks & Deep Learning Architectures",
      "Natural Language Processing (NLP) & GenAI",
      "Prompt Engineering & Automated Workflows",
      "Building Intelligent Agents and Vision Systems"
    ]
  }
];

const gradientsList = [
  "linear-gradient(135deg, #FF6B00, #FF9F43)",
  "linear-gradient(135deg, #FF4D8D, #8B5CF6)",
  "linear-gradient(135deg, #38BDF8, #8B5CF6)",
  "linear-gradient(135deg, #FF6B00, #FF4D8D)",
  "linear-gradient(135deg, #10B981, #38BDF8)",
  "linear-gradient(135deg, #8B5CF6, #38BDF8)"
];

export default function Courses() {
  const navigate = useNavigate();
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [coursesList, setCoursesList] = useState([]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setCoords({
        x: (e.clientX - window.innerWidth / 2) / 30,
        y: (e.clientY - window.innerHeight / 2) / 30
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    function getCourseEmoji(title) {
      const t = title.toLowerCase();
      if (t.includes('python')) return '🐍';
      if (t.includes('cyber')) return '🛡️';
      if (t.includes('autocad') || t.includes('design')) return '📐';
      if (t.includes('marketing')) return '🚀';
      if (t.includes('cloud') || t.includes('aws')) return '☁️';
      if (t.includes('mern') || t.includes('web') || t.includes('stack') || t.includes('fullstack')) return '💻';
      if (t.includes('vehicle') || t.includes('ev')) return '⚡';
      if (t.includes('machine learning') || t.includes('ml') || t.includes('ai')) return '🤖';
      if (t.includes('iot') || t.includes('sensor')) return '📡';
      if (t.includes('embed')) return '🔌';
      if (t.includes('power bi') || t.includes('data')) return '📊';
      if (t.includes('sap')) return '🏢';
      if (t.includes('excel')) return '📈';
      if (t.includes('tally') || t.includes('accounting')) return '💰';
      return '📚';
    }

    async function getCourses() {
      try {
        const res = await fetch('/api/courses');
        const data = await res.json();
        if (data.success && data.courses && data.courses.length > 0) {
          const mapped = data.courses.map((c, idx) => ({
            id: c._id || c.id,
            title: c.title,
            desc: c.description || c.content || 'No description available',
            image: c.image || null,
            emoji: getCourseEmoji(c.title),
            gradient: gradientsList[idx % gradientsList.length],
            duration: c.duration || '8 Weeks',
            syllabus: c.content ? c.content.split('\n').filter(Boolean) : ['Syllabus details pending']
          }));
          setCoursesList(mapped);
        } else {
          setCoursesList(coursesData);
        }
      } catch (err) {
        console.error('Failed to fetch courses:', err);
        setCoursesList(coursesData);
      }
    }
    getCourses();
  }, []);

  return (
    <div className="courses-page-container">
      <Navbar />

      {/* ---- Decorative Particles (matching Home) ---- */}
      <div className="courses-sparkle courses-sparkle-1">✦</div>
      <div className="courses-sparkle courses-sparkle-2">✦</div>
      <div className="courses-plus courses-plus-1">+</div>
      <div className="courses-plus courses-plus-2">+</div>
      <div className="courses-dot courses-dot-1"></div>
      <div className="courses-dot courses-dot-2"></div>
      <div className="courses-floating-circle courses-circle-1"></div>
      <div className="courses-floating-circle courses-circle-2"></div>

      {/* ---- Glassmorphism Floating Tech Cards ---- */}
      <div className="courses-tech-card courses-tech-1" style={{ transform: `translate(${coords.x * 0.7}px, ${coords.y * 0.7}px) rotate(8deg)` }}>
        <span>🐍 Python</span>
      </div>
      <div className="courses-tech-card courses-tech-2" style={{ transform: `translate(${coords.x * 1.1}px, ${coords.y * 1.1}px) rotate(-6deg)` }}>
        <span>📊 Power BI</span>
      </div>
      <div className="courses-tech-card courses-tech-3" style={{ transform: `translate(${coords.x * 0.8}px, ${coords.y * 0.8}px) rotate(5deg)` }}>
        <span>💻 Full Stack</span>
      </div>
      <div className="courses-tech-card courses-tech-4" style={{ transform: `translate(${coords.x * 1.0}px, ${coords.y * 1.0}px) rotate(-7deg)` }}>
        <span>🧠 AI & ML</span>
      </div>

      <main className="courses-main-content">
        {/* ---- HERO SECTION (matching Home grid-line background + orange triangle) ---- */}
        <section className="courses-hero-section">
          <div className="courses-container courses-hero-inner">
            <div className="courses-badge animate-pulse-badge">
              <span className="badge-arrow">⬦⬥⬦</span>
              <span className="badge-text">EXPLORE PROGRAMS</span>
              <span className="badge-line"></span>
            </div>

            <h1 className="courses-title">
              <motion.span
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                style={{ display: 'inline-block' }}
              >
                Explore Our
              </motion.span>{" "}
              <motion.span
                className="heading-journey-text"
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100, damping: 9, delay: 0.2 }}
                style={{ display: 'inline-block' }}
              >
                Premium
              </motion.span>{" "}
              <br />
              <motion.span
                initial={{ opacity: 0, x: -35 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                style={{ display: 'inline-block' }}
              >
                <span className="highlight-text">Courses</span>
              </motion.span>
            </h1>

            <p className="courses-subtitle">
              Industry-focused programs built for practical learning, career readiness, and real-world technical execution by certified experts.
            </p>
          </div>
        </section>

        {/* ---- COURSES GRID ---- */}
        <section className="courses-grid-section">
          <div className="courses-container">
            <div className="courses-grid">
              {coursesList.map((course) => (
                <motion.div
                  key={course.id}
                  className="course-card"
                  whileHover={{ y: -8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <div className="course-card-banner" style={{ background: course.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                    {course.image ? (
                      <img src={course.image} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontSize: '48px', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))' }}>{course.emoji}</span>
                    )}
                  </div>
                  <div className="course-card-content">
                    <h3 className="course-card-title">{course.title}</h3>
                    <p className="course-card-description">{course.desc}</p>


                    <div className="course-card-footer">
                      <button
                        onClick={() => setSelectedCourse(course)}
                        className="btn-details"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => navigate(`/register?type=student&course=${encodeURIComponent(course.title)}`)}
                        className="btn-register-course"
                      >
                        Register
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ---- BOTTOM FEATURES BANNER (matching Home) ---- */}
        <section className="courses-bottom-bar">
          <div className="courses-container">
            <div className="courses-features-bar">

              <div className="courses-feature-item">
                <div className="courses-feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                    <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>
                  </svg>
                </div>
                <div className="courses-feature-text">
                  <h5>Expert Training</h5>
                  <p>Industry-certified mentors</p>
                </div>
              </div>

              <div className="courses-feature-divider"></div>

              <div className="courses-feature-item">
                <div className="courses-feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="7"/>
                    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
                  </svg>
                </div>
                <div className="courses-feature-text">
                  <h5>Certified Programs</h5>
                  <p>Recognized certificates</p>
                </div>
              </div>

              <div className="courses-feature-divider"></div>

              <div className="courses-feature-item">
                <div className="courses-feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                </div>
                <div className="courses-feature-text">
                  <h5>100% Secure</h5>
                  <p>Your data is protected</p>
                </div>
              </div>

              <div className="courses-feature-divider"></div>

              <div className="courses-feature-item">
                <div className="courses-feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                  </svg>
                </div>
                <div className="courses-feature-text">
                  <h5>Career Growth</h5>
                  <p>Build your future with us</p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Trainer Carousel */}
        <div className="courses-carousel-wrapper">
          <TrainerCarousel />
        </div>
      </main>

      {/* Course Details Modal */}
      <AnimatePresence>
        {selectedCourse && (
          <div className="modal-overlay" onClick={() => setSelectedCourse(null)}>
            <motion.div
              className="details-modal"
              initial={{ scale: 0.93, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.93, opacity: 0, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header" style={{ background: selectedCourse.gradient }}>
                <span className="modal-emoji">{selectedCourse.emoji}</span>
                <button className="modal-close" onClick={() => setSelectedCourse(null)}>&times;</button>
              </div>

              <div className="modal-body">
                <span className="modal-badge">COURSE DETAILS</span>
                <h2 className="modal-title">{selectedCourse.title}</h2>
                <p className="modal-desc">{selectedCourse.desc}</p>

                <div className="modal-meta">
                  <span className="meta-item">⏱️ <strong>Duration:</strong> {selectedCourse.duration}</span>
                  <span className="meta-item">🎓 <strong>Certificate:</strong> Included</span>
                </div>

                <div className="modal-syllabus-section">
                  <h3>What you will learn:</h3>
                  <ul className="modal-syllabus-list">
                    {selectedCourse.syllabus.map((item, idx) => (
                      <li key={idx}>✨ {item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn-modal-close" onClick={() => setSelectedCourse(null)}>Close</button>
                <button
                  className="btn-modal-register"
                  onClick={() => {
                    setSelectedCourse(null);
                    navigate(`/register?type=student&course=${encodeURIComponent(selectedCourse.title)}`);
                  }}
                >
                  Register Now
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
