import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../state/useAuth';
import { Search, BookOpen, Users, BarChart2, Tag, DollarSign, Clock, Award, Sparkles, X, BarChart3 } from 'lucide-react';
import { PremiumPage, PageHeader, GlassCard, GradientButton, Badge, P } from '../../components/PremiumDesignSystem';

export default function TrainerCourses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [activeTab, setActiveTab] = useState('assigned'); // 'assigned' or 'register'
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showSyllabusModal, setShowSyllabusModal] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch('/api/courses');
        const data = await res.json();
        if (data.success) {
          setCourses(data.courses);
        }
      } catch (err) {
        console.error('Failed to fetch courses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const assignedCourses = courses.filter(c => user.assignedCourses?.includes(c._id || c.id) || false);
  const availableCourses = courses;

  const displayCourses = (activeTab === 'assigned' ? assignedCourses : availableCourses)
    .filter(c => (c.title || '').toLowerCase().includes(searchTerm.toLowerCase()));

  const tabs = [
    { key: 'assigned', label: 'Assigned Courses', count: assignedCourses.length },
    { key: 'register', label: 'Register Course', count: availableCourses.length },
  ];

  return (
    <PremiumPage>
      <PageHeader
        title="My Courses"
        subtitle="Manage your assigned teaching courses and browse new ones."
        emoji="📚"
      />

      {/* Tabs + Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(20px)', borderRadius: 14, padding: 4, border: `1px solid ${P.border}` }}>
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '10px 20px',
                borderRadius: 10,
                border: 'none',
                background: activeTab === tab.key ? `linear-gradient(135deg, ${P.primary}, ${P.secondary})` : 'transparent',
                color: activeTab === tab.key ? '#fff' : P.inkMute,
                fontWeight: 700,
                fontSize: 14,
                cursor: 'pointer',
                fontFamily: P.font,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                transition: 'all 0.3s ease',
              }}
            >
              {tab.label}
              <span style={{
                background: activeTab === tab.key ? 'rgba(255,255,255,0.25)' : 'rgba(99,102,241,0.08)',
                padding: '2px 8px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 800,
              }}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', width: 280 }}>
          <Search size={18} color={P.inkMute} style={{ position: 'absolute', left: 14, top: 12 }} />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px 10px 42px',
              borderRadius: 12,
              border: `1px solid ${P.border}`,
              background: 'rgba(255,255,255,0.7)',
              backdropFilter: 'blur(20px)',
              fontSize: 14,
              fontFamily: P.font,
              color: P.ink,
              outline: 'none',
              boxShadow: P.shadow,
            }}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: P.inkMute }}>Loading courses...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
          {displayCourses.map((course, idx) => (
            <GlassCard
              key={course._id || course.id}
              style={{ padding: 0, overflow: 'hidden' }}
            >
              {/* Course Thumbnail */}
              <div style={{
                height: 180, background: course.image ? '#ffffff' : 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 48, position: 'relative', overflow: 'hidden',
              }}>
                {course.image ? (
                  <img
                    src={course.image}
                    alt={course.title}
                    style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px', boxSizing: 'border-box' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                      if (e.target.nextSibling) {
                        e.target.nextSibling.style.display = 'flex';
                      }
                    }}
                  />
                ) : null}
                <div style={{
                  display: course.image ? 'none' : 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  height: '100%', width: '100%', position: 'absolute', top: 0, left: 0,
                  color: 'rgba(255,255,255,0.6)',
                }}>
                  {course.icon || '📚'}
                </div>
                {/* Gradient overlay */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, background: 'linear-gradient(transparent, rgba(0,0,0,0.15))' }} />
              </div>

              <div style={{ padding: 24 }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: 18, fontWeight: 800, color: P.ink, fontFamily: P.font }}>{course.title}</h3>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <Badge color={P.primary} bg="rgba(99,102,241,0.08)">{course.category}</Badge>
                  <Badge color={P.blue} bg="rgba(59,130,246,0.08)">{course.level}</Badge>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                  <span style={{ fontSize: 22, fontWeight: 900, color: P.ink, fontFamily: P.font }}>₹{course.price || '999'}</span>
                  <del style={{ color: P.inkMute, fontSize: 14 }}>₹{course.originalPrice || '4999'}</del>
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                  {activeTab === 'assigned' ? (
                    <GradientButton variant="ghost" style={{ flex: 1 }}>
                      <BookOpen size={16} /> Manage
                    </GradientButton>
                  ) : (
                    <GradientButton style={{ flex: 1 }}>
                      Request
                    </GradientButton>
                  )}
                  <GradientButton variant="outline" style={{ flex: 1 }} onClick={() => { setSelectedCourse(course); setShowSyllabusModal(true); }}>
                    Syllabus
                  </GradientButton>
                </div>
              </div>
            </GlassCard>
          ))}
          {(activeTab === 'assigned' && assignedCourses.length === 0) && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 60, color: P.inkMute }}>
              No assigned courses yet.
            </div>
          )}
        </div>
      )}

      {/* Syllabus Modal */}
      <AnimatePresence>
        {showSyllabusModal && selectedCourse && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(8, 10, 18, 0.7)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 24
            }}
            onClick={() => setShowSyllabusModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              style={{
                maxWidth: 620, width: '100%', padding: 0, position: 'relative',
                borderRadius: 24, background: 'rgba(255, 255, 255, 0.75)',
                backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                boxShadow: '0 30px 80px rgba(0, 0, 0, 0.28), inset 0 1px 0 rgba(255,255,255,0.6)',
                overflow: 'hidden', color: '#0F172A'
              }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header Gradient Banner */}
              <div style={{
                background: 'linear-gradient(135deg, #FF6B00 0%, #FF8C00 100%)',
                padding: '32px 32px 24px', position: 'relative', overflow: 'hidden'
              }}>
                {/* Close Button */}
                <button 
                  onClick={() => setShowSyllabusModal(false)}
                  style={{
                    position: 'absolute', top: 20, right: 20,
                    width: 36, height: 36, borderRadius: 18,
                    background: 'rgba(255,255,255,0.2)', border: 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#FFFFFF', cursor: 'pointer', transition: 'all 0.2s ease',
                    backdropFilter: 'blur(8px)'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                >
                  <X size={18} />
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <Sparkles size={16} color="#FFFFFF" style={{ opacity: 0.8 }} />
                  <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.5, color: 'rgba(255,255,255,0.9)', textTransform: 'uppercase' }}>
                    COURSE SYLLABUS
                  </span>
                </div>
                
                <h2 style={{ margin: 0, fontSize: 26, fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.5px', lineHeight: 1.2 }}>
                  {selectedCourse.title}
                </h2>
              </div>

              {/* Modal Body */}
              <div style={{ padding: 32 }}>
                {/* Course Metadata grid */}
                <div style={{
                  display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12,
                  marginBottom: 24, padding: 12, borderRadius: 16,
                  background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.03)'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <Clock size={16} style={{ color: '#FF6B00', marginBottom: 4 }} />
                    <span style={{ fontSize: 10, color: '#64748B', fontWeight: 650 }}>DURATION</span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#0F172A' }}>{selectedCourse.duration || '8 Weeks'}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', borderLeft: '1px solid rgba(0,0,0,0.06)', borderRight: '1px solid rgba(0,0,0,0.06)' }}>
                    <BarChart3 size={16} style={{ color: '#FF6B00', marginBottom: 4 }} />
                    <span style={{ fontSize: 10, color: '#64748B', fontWeight: 650 }}>LEVEL</span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#0F172A' }}>{selectedCourse.level || 'All Levels'}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <Award size={16} style={{ color: '#FF6B00', marginBottom: 4 }} />
                    <span style={{ fontSize: 10, color: '#64748B', fontWeight: 650 }}>CREDENTIAL</span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#0F172A' }}>Certified</span>
                  </div>
                </div>

                <p style={{ margin: '0 0 24px 0', fontSize: 14, color: '#475569', lineHeight: 1.6, fontWeight: 500 }}>
                  {selectedCourse.description || selectedCourse.content || 'Explore course syllabus and structured core modules.'}
                </p>
                
                <h3 style={{ margin: '0 0 12px 0', fontSize: 16, fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <BookOpen size={18} style={{ color: '#FF6B00' }} />
                  What you will learn
                </h3>
                
                {/* Syllabus Modules Container */}
                <div style={{
                  maxHeight: 220, overflowY: 'auto', paddingRight: 8, marginBottom: 28,
                  display: 'flex', flexDirection: 'column', gap: 10
                }}>
                  {(selectedCourse.content ? selectedCourse.content.split('\n').filter(Boolean) : ['Syllabus topics pending']).map((item, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      style={{
                        padding: '14px 18px', background: 'rgba(255,255,255,0.9)', 
                        border: '1px solid rgba(0,0,0,0.04)',
                        borderRadius: 14, display: 'flex', gap: 12, alignItems: 'flex-start',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.015)'
                      }}
                    >
                      <span style={{
                        color: '#FFFFFF', fontWeight: 900, fontSize: 11,
                        background: 'linear-gradient(135deg, #FF6B00 0%, #FF8C00 100%)',
                        width: 22, height: 22, borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, boxShadow: '0 2px 6px rgba(255,107,0,0.2)'
                      }}>
                        {idx + 1}
                      </span>
                      <span style={{ fontSize: 14, color: '#334155', lineHeight: 1.5, fontWeight: 600 }}>
                        {item}
                      </span>
                    </motion.div>
                  ))}
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                  <GradientButton variant="outline" onClick={() => setShowSyllabusModal(false)}>
                    Close
                  </GradientButton>
                  <GradientButton variant="primary" onClick={() => setShowSyllabusModal(false)}>
                    Start Teaching
                  </GradientButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PremiumPage>
  );
}
