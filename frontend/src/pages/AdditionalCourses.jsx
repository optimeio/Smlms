import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../state/useAuth';
import '../styles/Courses.css';

export default function AdditionalCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [notification, setNotification] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchApprovedCourses = async () => {
      try {
        const res = await fetch('/api/company-courses');
        const data = await res.json();
        if (data.success) {
          setCourses(data.courses.filter(c => c.status === 'approved'));
        }
      } catch (err) {
        console.error('Failed to fetch additional courses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchApprovedCourses();
  }, []);

  const closeModal = () => setSelectedCourse(null);

  const handlePurchase = (courseId) => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Mock purchase logic
    setNotification('Payment successful! You are now enrolled in this course.');
    setTimeout(() => {
      setNotification('');
      closeModal();
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <div className="courses-page-container">
      <Navbar />

      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          style={{ position: 'fixed', top: 80, left: '50%', transform: 'translateX(-50%)', zIndex: 9999, background: '#10B981', color: '#fff', padding: '16px 24px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 10px 25px rgba(16,185,129,0.3)', fontWeight: 600 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          {notification}
        </motion.div>
      )}

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
      <div className="courses-tech-card courses-tech-1" style={{ transform: `translate(0px, 0px) rotate(8deg)` }}>
        <span>🚀 Industry</span>
      </div>
      <div className="courses-tech-card courses-tech-2" style={{ transform: `translate(0px, 0px) rotate(-6deg)` }}>
        <span>🏢 Partners</span>
      </div>
      <div className="courses-tech-card courses-tech-3" style={{ transform: `translate(0px, 0px) rotate(5deg)` }}>
        <span>💼 Careers</span>
      </div>
      <div className="courses-tech-card courses-tech-4" style={{ transform: `translate(0px, 0px) rotate(-7deg)` }}>
        <span>🌟 Experts</span>
      </div>

      <main className="courses-main-content">
        {/* ---- HERO SECTION (matching Home grid-line background + orange triangle) ---- */}
        <section className="courses-hero-section">
          <div className="courses-container courses-hero-inner">
            <div className="courses-badge animate-pulse-badge">
              <span className="badge-arrow">⬦⬥⬦</span>
              <span className="badge-text">EXPLORE ADDITIONAL PROGRAMS</span>
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
                Additional
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
              Explore exclusive courses proposed by top partner companies. Gain specialized knowledge and skills directly from industry professionals to accelerate your career growth.
            </p>
          </div>
        </section>

        {/* ---- COURSES GRID ---- */}
        <section className="courses-grid-section">
          <div className="courses-container">

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', fontSize: 18, color: '#64748b' }}>
              Loading additional courses...
            </div>
          ) : courses.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', fontSize: 18, color: '#64748b', background: '#fff', borderRadius: 24, boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
              No additional courses available at the moment. Check back soon!
            </div>
          ) : (
            <div className="courses-grid">
              {courses.map((course, idx) => (
                <motion.div 
                  key={course._id || course.id}
                  className="course-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  whileHover={{ y: -8, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
                >
                  <div className="course-card-banner" style={{ background: course.image ? '#ffffff' : 'linear-gradient(135deg, #0F172A, #1E293B)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                    {course.image ? (
                      <img 
                        src={course.image} 
                        alt={course.title} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'inline-block';
                        }}
                      />
                    ) : null}
                    <span style={{ fontSize: '48px', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))', display: course.image ? 'none' : 'inline-block' }}>
                      {course.image ? '' : '📚'}
                    </span>
                  </div>
                  
                  <div className="course-card-content">
                    <h3 className="course-card-title">{course.title}</h3>
                    <p className="course-card-description">{course.syllabus ? (course.syllabus.substring(0, 100) + '...') : 'No description available'}</p>

                    <div style={{ margin: '12px 0', fontSize: '18px', fontWeight: 'bold', color: '#1B1F3B' }}>
                      <del style={{ color: '#94a3b8', marginRight: '8px', fontSize: '14px' }}>₹{course.originalPrice || '5999'}</del>
                      ₹{course.price || '2999'}
                    </div>

                    <div style={{ marginBottom: '16px', textAlign: 'right', paddingRight: '8px' }}>
                      <span style={{ 
                        fontFamily: 'Playfair Display, serif', 
                        fontWeight: 900, 
                        fontSize: '18px', 
                        letterSpacing: '1px', 
                        background: 'linear-gradient(to right, #D97706, #FBBF24, #FFFBEB, #FBBF24, #D97706)',
                        backgroundSize: '200% auto',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        animation: 'shine 3s linear infinite',
                        filter: 'drop-shadow(0 0 4px rgba(251,191,36,0.4))'
                      }}>
                        By {course.companyName}
                      </span>
                    </div>

                    <div className="course-card-footer">
                      <button
                        onClick={() => setSelectedCourse(course)}
                        className="btn-details"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => handlePurchase(course._id || course.id)}
                        className="btn-register-course"
                        style={{ fontSize: '12px', padding: '8px 12px' }}
                      >
                        {user ? 'Purchase' : 'Sign up & Buy'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
      </main>

      {/* Course Modal */}
      <AnimatePresence>
        {selectedCourse && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div 
              className="details-modal"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={closeModal}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
              
              <div className="modal-header" style={{ 
                background: selectedCourse.image ? `url(${selectedCourse.image})` : 'linear-gradient(135deg, #0F172A, #1E293B)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}>
                <div className="modal-emoji" style={{ display: selectedCourse.image ? 'none' : 'block' }}>{selectedCourse.image ? '' : '📚'}</div>
              </div>
              
              <div className="modal-body">
                <span className="modal-badge" style={{ color: '#D97706' }}>COURSE DETAILS &bull; {selectedCourse.companyName}</span>
                <h2 className="modal-title">{selectedCourse.title}</h2>
                <p className="modal-desc" style={{ whiteSpace: 'pre-wrap' }}>{selectedCourse.syllabus}</p>

                <div className="modal-meta">
                  <span className="meta-item">⏱️ <strong>Format:</strong> Self-Paced</span>
                  <span className="meta-item">
                    🎓 <strong>Price:</strong> 
                    {selectedCourse.originalPrice ? (
                      <>
                        <del style={{ color: '#94a3b8', margin: '0 8px', fontWeight: 'normal' }}>₹{selectedCourse.originalPrice}</del>
                        <span style={{ color: '#10B981' }}>₹{selectedCourse.price}</span>
                      </>
                    ) : (
                      <span style={{ color: '#10B981', marginLeft: 8 }}>{selectedCourse.price ? `₹${selectedCourse.price}` : 'Free'}</span>
                    )}
                  </span>
                </div>

                <div className="modal-syllabus-section" style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px dashed #E2E8F0' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 750, color: '#0F172A', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '18px' }}>🚀</span> Premium Advantages
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <svg style={{ color: '#10B981', flexShrink: 0, marginTop: '2px' }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      <div>
                        <strong style={{ display: 'block', fontSize: '13.5px', color: '#1E293B', marginBottom: '2px' }}>Certified Program</strong>
                        <span style={{ fontSize: '12px', color: '#64748B' }}>Globally recognized</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <svg style={{ color: '#10B981', flexShrink: 0, marginTop: '2px' }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      <div>
                        <strong style={{ display: 'block', fontSize: '13.5px', color: '#1E293B', marginBottom: '2px' }}>Expert Mentors</strong>
                        <span style={{ fontSize: '12px', color: '#64748B' }}>Top industry pros</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <svg style={{ color: '#10B981', flexShrink: 0, marginTop: '2px' }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      <div>
                        <strong style={{ display: 'block', fontSize: '13.5px', color: '#1E293B', marginBottom: '2px' }}>Placement Aid</strong>
                        <span style={{ fontSize: '12px', color: '#64748B' }}>Interview support</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <svg style={{ color: '#10B981', flexShrink: 0, marginTop: '2px' }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      <div>
                        <strong style={{ display: 'block', fontSize: '13.5px', color: '#1E293B', marginBottom: '2px' }}>Real Projects</strong>
                        <span style={{ fontSize: '12px', color: '#64748B' }}>Hands-on training</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn-modal-close" onClick={closeModal}>Close</button>
                  <button
                    className="btn-modal-register"
                    onClick={() => {
                      handlePurchase(selectedCourse._id || selectedCourse.id);
                      closeModal();
                    }}
                  >
                    Register Now
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
