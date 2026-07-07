import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function CoursesModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  const courses = [
    {
      title: "Python Course - Master Programming & Build Real-World Projects",
      desc: "Unlock your future in tech with an industry-focused Python course designed for beginners, students, and professionals who want to master programming and build practical software projects.",
      emoji: "🐍",
      gradient: "linear-gradient(135deg, #FF6B00, #FF9F43)"
    },
    {
      title: "Full Stack Development",
      desc: "Learn front-end, back-end, databases, APIs, deployment basics, and real-world application development with a project-first full stack curriculum.",
      emoji: "💻",
      gradient: "linear-gradient(135deg, #FF4D8D, #8B5CF6)"
    },
    {
      title: "Power BI Course - Master Data Visualization, Business Intelligence & Analytics",
      desc: "Build dashboards, reports, data models, and business intelligence workflows that turn raw data into clear decisions for modern teams.",
      emoji: "📊",
      gradient: "linear-gradient(135deg, #38BDF8, #8B5CF6)"
    },
    {
      title: "Digital Marketing Course - Master Online Marketing, SEO, Social Media & Lead Generation",
      desc: "Master SEO, social media strategy, content planning, campaigns, analytics, and lead generation for business growth across digital channels.",
      emoji: "🚀",
      gradient: "linear-gradient(135deg, #FF6B00, #FF4D8D)"
    },
    {
      title: "Mobile App Development Course - Build Android & iOS Apps with Modern Technologies",
      desc: "Create mobile applications with modern UI patterns, API integration, storage workflows, testing basics, and deployment readiness.",
      emoji: "📱",
      gradient: "linear-gradient(135deg, #10B981, #38BDF8)"
    },
    {
      title: "SAP Course - Master Enterprise Resource Planning (ERP) & Business Process Management",
      desc: "Understand ERP concepts, business process flows, SAP fundamentals, and enterprise operations used across modern organizations.",
      emoji: "🏢",
      gradient: "linear-gradient(135deg, #8B5CF6, #38BDF8)"
    },
    {
      title: "Microsoft Excel Course - Master Data Analysis, Reporting & Spreadsheet Automation",
      desc: "Develop strong spreadsheet skills with formulas, reports, dashboards, data cleanup, analysis workflows, and automation-ready practices.",
      emoji: "📈",
      gradient: "linear-gradient(135deg, #FF9F43, #FF6B00)"
    },
    {
      title: "Tally Course - Master Accounting, GST, Payroll & Business Finance Management",
      desc: "Learn accounting entries, GST workflows, payroll basics, inventory, financial reporting, and business finance management with Tally.",
      emoji: "💰",
      gradient: "linear-gradient(135deg, #10B981, #059669)"
    },
    {
      title: "Machine Learning Course - Master AI, Data Modeling & Predictive Analytics",
      desc: "Explore data preparation, model building, prediction workflows, evaluation, and applied machine learning concepts through practical exercises.",
      emoji: "🤖",
      gradient: "linear-gradient(135deg, #8B5CF6, #FF4D8D)"
    },
    {
      title: "Artificial Intelligence (AI) Course - Master Intelligent Systems, Automation & Smart Technologies",
      desc: "Build readiness in AI concepts, intelligent systems, automation, prompt-aware workflows, and smart technology applications for the future.",
      emoji: "🧠",
      gradient: "linear-gradient(135deg, #FF6B00, #8B5CF6)"
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <motion.div
            initial={{ scale: 0.93, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.93, opacity: 0, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              maxWidth: '850px',
              width: '100%',
              maxHeight: '85vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 30px 80px rgba(0, 0, 0, 0.18)',
              border: '1px solid #E2E8F0',
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div style={{
              padding: '28px 32px 20px 32px',
              borderBottom: '1px solid #F1F5F9',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#FAF9F6'
            }}>
              <div>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#FF6B00',
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '4px'
                }}>Explore Programs</span>
                <h2 style={{ fontSize: '24px', fontWeight: 850, color: '#0F172A', margin: 0 }}>Courses</h2>
              </div>
              <button 
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '28px',
                  cursor: 'pointer',
                  color: '#94A3B8',
                  transition: 'color 0.2s',
                  lineHeight: 1
                }}
                onMouseEnter={(e) => e.target.style.color = '#FF6B00'}
                onMouseLeave={(e) => e.target.style.color = '#94A3B8'}
              >
                &times;
              </button>
            </div>

            {/* Subtext info */}
            <div style={{ padding: '16px 32px', backgroundColor: '#FFFDFB', borderBottom: '1px solid #F1F5F9' }}>
              <p style={{ fontSize: '14.5px', color: '#64748B', margin: 0, lineHeight: 1.5 }}>
                Explore premium MBK programs built for practical learning, career readiness, and real-world technical execution.
              </p>
            </div>

            {/* Courses List */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '24px 32px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              backgroundColor: '#FFFFFF'
            }}>
              {courses.map((course, idx) => (
                <div 
                  key={idx}
                  style={{
                    display: 'flex',
                    gap: '24px',
                    padding: '20px',
                    borderRadius: '18px',
                    border: '1px solid #E2E8F0',
                    transition: 'all 0.3s ease',
                    backgroundColor: '#FFFDFB',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.01)'
                  }}
                  className="course-list-item-hover"
                >
                  {/* Left Icon Banner representation */}
                  <div style={{
                    width: '74px',
                    height: '74px',
                    borderRadius: '16px',
                    background: course.gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '36px',
                    flexShrink: 0,
                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.06)'
                  }}>
                    {course.emoji}
                  </div>

                  {/* Body details */}
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', margin: '0 0 6px 0', lineHeight: '1.4' }}>
                      {course.title}
                    </h3>
                    <p style={{ fontSize: '13.5px', color: '#64748B', margin: '0 0 16px 0', lineHeight: '1.5' }}>
                      {course.desc}
                    </p>
                    
                    {/* Action buttons */}
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button 
                        onClick={() => navigate(`/register?type=student`)}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '8px',
                          border: '1.5px solid #FF6B00',
                          backgroundColor: 'transparent',
                          color: '#FF6B00',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#FF6B00';
                          e.target.style.color = '#FFFFFF';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'transparent';
                          e.target.style.color = '#FF6B00';
                        }}
                      >
                        Details
                      </button>
                      
                      <button 
                        onClick={() => navigate(`/register?type=student`)}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '8px',
                          border: 'none',
                          background: 'linear-gradient(135deg, #FF6B00, #FF9F43)',
                          color: '#FFFFFF',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          boxShadow: '0 4px 10px rgba(255, 107, 0, 0.15)',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
                        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                      >
                        Register
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div style={{
              padding: '20px 32px',
              borderTop: '1px solid #F1F5F9',
              textAlign: 'right',
              backgroundColor: '#FAF9F6'
            }}>
              <button 
                onClick={onClose}
                style={{
                  padding: '10px 24px',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  color: '#475569',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.borderColor = '#94A3B8'}
                onMouseLeave={(e) => e.target.style.borderColor = '#CBD5E1'}
              >
                Close View
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
