import React, { useState, useEffect } from 'react';
import { useAuth } from '../../state/useAuth';
import { BookOpen, Search, Filter, ChevronRight, Star, Clock, BarChart3, Tag, Award, Sparkles, X } from 'lucide-react';
import { PremiumPage, PageHeader, GlassCard, GradientButton, Badge, EmptyState, P } from '../../components/PremiumDesignSystem';
import { motion, AnimatePresence } from 'framer-motion';

export default function StudentCourses() {
  const { user, login } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showSyllabusModal, setShowSyllabusModal] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch('/api/courses');
        const data = await res.json();
        if (data.success) setCourses(data.courses);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const activeCourses = courses.filter(c => user?.assignedCourses?.includes(c._id || c.id) || false);
  const availableCourses = courses;

  const handleCompleteCourse = async (courseTitle) => {
    try {
      const res = await fetch(`/api/users/${user._id || user.id || user.email}/complete-course`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseTitle })
      });
      const data = await res.json();
      if (data.success) {
        const updatedUser = { ...user, completedCourses: data.user.completedCourses };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        window.location.reload();
      }
    } catch (err) {
      console.error('Failed to complete course:', err);
    }
  };

  const filteredAvailable = searchQuery
    ? availableCourses.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : availableCourses;

  const gradients = [
    ['#5B5CFF', '#7C5CFF'], ['#FF5C8A', '#FF758C'], ['#4F8CFF', '#00C6FF'],
    ['#22C55E', '#43E97B'], ['#F59E0B', '#FFC837'], ['#8B5CF6', '#A78BFA'],
  ];

  return (
    <PremiumPage>
      <PageHeader
        title="My Courses"
        subtitle="View your active enrolled courses and browse new courses to register."
        actions={
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: P.inkMute }} />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ padding: '10px 14px 10px 40px', borderRadius: 12, border: `1px solid ${P.border}`, fontSize: 14, width: 260, outline: 'none', background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', color: P.ink, fontFamily: P.font }}
              />
            </div>
          </div>
        }
      />

      {loading ? (
        <p style={{ color: P.inkMute }}>Loading courses...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
          {/* Active Courses */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <h3 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: P.ink }}>Active Courses</h3>
              <Badge color={P.green}>{activeCourses.length} enrolled</Badge>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
              {activeCourses.length > 0 ? activeCourses.map((course, idx) => {
                const [gFrom, gTo] = gradients[idx % gradients.length];
                const isCompleted = user?.completedCourses?.includes(course.title);
                return (
                  <GlassCard key={course._id || course.id} style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={{ height: 180, background: course.image ? 'transparent' : `linear-gradient(135deg, ${gFrom}22, ${gTo}22)`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                      {course.image ? (
                        <img src={course.image} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px', boxSizing: 'border-box' }} onError={e => { e.target.style.display = 'none'; }} />
                      ) : (
                        <div style={{ fontSize: 48, opacity: 0.4 }}>{course.icon || '📚'}</div>
                      )}
                      <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 6 }}>
                        <Badge color={P.blue}>{course.level || 'Beginner'}</Badge>
                        {isCompleted && <Badge color={P.green}>✓ Completed</Badge>}
                      </div>
                    </div>
                    <div style={{ padding: 24 }}>
                      <h3 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 800, color: P.ink }}>{course.title}</h3>
                      <p style={{ margin: '0 0 16px', fontSize: 13, color: P.inkSoft }}>{course.category || 'General'}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                        <span style={{ fontSize: 22, fontWeight: 900, color: P.ink }}>₹{course.price || '999'}</span>
                        <span style={{ fontSize: 14, color: P.inkMute, textDecoration: 'line-through' }}>₹{course.originalPrice || '4999'}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 12 }}>
                        <GradientButton variant="outline" style={{ flex: 1 }} onClick={() => { setSelectedCourse(course); setShowSyllabusModal(true); }}>View Syllabus</GradientButton>
                        {isCompleted ? (
                          <GradientButton variant="success" disabled style={{ flex: 1 }}>Completed ✓</GradientButton>
                        ) : (
                          <GradientButton variant="primary" onClick={() => handleCompleteCourse(course.title)} style={{ flex: 1 }}>Mark Complete</GradientButton>
                        )}
                      </div>
                    </div>
                  </GlassCard>
                );
              }) : (
                <GlassCard style={{ gridColumn: '1 / -1' }}>
                  <EmptyState icon={<BookOpen size={48} />} title="No active courses" subtitle="Browse the courses below to enroll!" />
                </GlassCard>
              )}
            </div>
          </div>

          {/* ═══════════ Register Courses — Premium Section ═══════════ */}
          <div>
            {/* Section Header with Gradient Accent */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 14,
                  background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 8px 24px rgba(91,92,255,0.25)',
                  fontSize: 20
                }}>📚</div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: P.ink, letterSpacing: '-0.5px' }}>Register Course</h3>
                  <p style={{ margin: '2px 0 0', fontSize: 13, color: P.inkSoft, fontWeight: 500 }}>
                    Browse and enroll in industry-leading programs
                  </p>
                </div>
              </div>
              <Badge color={P.secondary}>{filteredAvailable.length} available</Badge>
            </div>

            {/* Course Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))', gap: 28 }}>
              {filteredAvailable.map((course, idx) => {
                const [gFrom, gTo] = gradients[idx % gradients.length];
                const discountPercent = course.originalPrice && course.price
                  ? Math.round(((parseInt(course.originalPrice) - parseInt(course.price)) / parseInt(course.originalPrice)) * 100)
                  : 80;

                return (
                  <motion.div
                    key={course._id || course.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: idx * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
                    whileHover={{ y: -6, transition: { duration: 0.3 } }}
                    style={{
                      background: 'rgba(255,255,255,0.85)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      border: '1px solid rgba(91,92,255,0.06)',
                      borderRadius: 22,
                      overflow: 'hidden',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                      cursor: 'pointer',
                      position: 'relative',
                      transition: 'box-shadow 0.35s ease'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 20px 60px rgba(0,0,0,0.1), 0 0 0 1px ${gFrom}22`; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.04)'; }}
                  >
                    {/* Image Container */}
                    <div style={{
                      height: 200, position: 'relative', overflow: 'hidden',
                      background: course.image ? '#F8FAFC' : `linear-gradient(135deg, ${gFrom}18, ${gTo}18)`,
                    }}>
                      {course.image ? (
                        <img
                          src={course.image} alt={course.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                          onError={e => { e.target.style.display = 'none'; }}
                          onMouseEnter={e => { e.target.style.transform = 'scale(1.05)'; }}
                          onMouseLeave={e => { e.target.style.transform = 'scale(1)'; }}
                        />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontSize: 56, opacity: 0.3 }}>{course.icon || '📚'}</span>
                        </div>
                      )}

                      {/* Gradient overlay at bottom of image */}
                      <div style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0, height: 60,
                        background: 'linear-gradient(0deg, rgba(255,255,255,0.95) 0%, transparent 100%)',
                        pointerEvents: 'none'
                      }} />

                      {/* Top badges row */}
                      <div style={{ position: 'absolute', top: 14, left: 14, right: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        {/* Level badge */}
                        <span style={{
                          padding: '5px 12px', borderRadius: 20,
                          background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(10px)',
                          fontSize: 11, fontWeight: 800, color: gFrom,
                          border: `1px solid ${gFrom}30`,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                          letterSpacing: '0.3px'
                        }}>
                          {course.level || 'Beginner'}
                        </span>

                        {/* Discount badge */}
                        {discountPercent > 0 && (
                          <span style={{
                            padding: '5px 10px', borderRadius: 20,
                            background: 'linear-gradient(135deg, #FF5C8A, #FF758C)',
                            fontSize: 11, fontWeight: 800, color: '#FFFFFF',
                            boxShadow: '0 4px 12px rgba(255,92,138,0.3)',
                            display: 'flex', alignItems: 'center', gap: 3
                          }}>
                            <Tag size={11} /> {discountPercent}% OFF
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div style={{ padding: '20px 24px 24px' }}>
                      {/* Category + Rating */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{
                          fontSize: 11, fontWeight: 700, color: gFrom,
                          textTransform: 'uppercase', letterSpacing: '1px',
                          display: 'flex', alignItems: 'center', gap: 5
                        }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: gFrom, display: 'inline-block' }} />
                          {course.programType || course.category || 'General'}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                          {[1,2,3,4,5].map(s => (
                            <Star key={s} size={12} fill={s <= 4 ? '#F59E0B' : 'none'} stroke={s <= 4 ? '#F59E0B' : '#CBD5E1'} strokeWidth={2} />
                          ))}
                          <span style={{ fontSize: 12, fontWeight: 700, color: P.inkSoft, marginLeft: 4 }}>4.0</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 style={{
                        margin: '0 0 14px', fontSize: 18, fontWeight: 800,
                        color: P.ink, lineHeight: 1.3, letterSpacing: '-0.3px',
                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                      }}>{course.title}</h3>

                      {/* Meta info row */}
                      <div style={{ display: 'flex', gap: 16, marginBottom: 18 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          <Clock size={13} color={P.inkMute} />
                          <span style={{ fontSize: 12, fontWeight: 600, color: P.inkSoft }}>{course.duration || '8 Weeks'}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          <BarChart3 size={13} color={P.inkMute} />
                          <span style={{ fontSize: 12, fontWeight: 600, color: P.inkSoft }}>{course.modules || '12'} Modules</span>
                        </div>
                      </div>

                      {/* Price + Actions */}
                      <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '16px 0 0',
                        borderTop: '1px solid rgba(91,92,255,0.06)'
                      }}>
                        {/* Price area */}
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                          <span style={{
                            fontSize: 26, fontWeight: 900, color: P.ink,
                            letterSpacing: '-0.5px', fontVariantNumeric: 'tabular-nums'
                          }}>₹{course.price || '999'}</span>
                          <span style={{
                            fontSize: 14, fontWeight: 600, color: P.inkMute,
                            textDecoration: 'line-through'
                          }}>₹{course.originalPrice || '4999'}</span>
                        </div>

                        {/* Action buttons */}
                        <div style={{ display: 'flex', gap: 8 }}>
                          <motion.button
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={(e) => { e.stopPropagation(); setSelectedCourse(course); setShowSyllabusModal(true); }}
                            style={{
                              padding: '9px 16px', borderRadius: 12,
                              border: '1px solid rgba(91,92,255,0.15)',
                              background: 'rgba(91,92,255,0.04)',
                              color: 'var(--primary)', fontSize: 13, fontWeight: 700,
                              cursor: 'pointer', fontFamily: P.font,
                              transition: 'all 0.2s'
                            }}
                          >Syllabus</motion.button>

                          <motion.button
                            whileHover={{ scale: 1.04, boxShadow: `0 8px 24px ${gFrom}40` }}
                            whileTap={{ scale: 0.97 }}
                            style={{
                              padding: '9px 20px', borderRadius: 12,
                              border: 'none',
                              background: `linear-gradient(135deg, ${gFrom}, ${gTo})`,
                              color: '#FFFFFF', fontSize: 13, fontWeight: 700,
                              cursor: 'pointer', fontFamily: P.font,
                              boxShadow: `0 4px 16px ${gFrom}30`,
                              display: 'flex', alignItems: 'center', gap: 6,
                              transition: 'box-shadow 0.3s ease'
                            }}
                          >
                            Enroll <ChevronRight size={14} />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
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
                    Start Learning
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
