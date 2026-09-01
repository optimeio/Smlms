import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../state/useAuth';
import { Plus, X, Upload, CheckCircle2, Edit2, Tag } from 'lucide-react';
import { PremiumPage, PageHeader, GlassCard, Badge, P, GradientButton } from '../../components/PremiumDesignSystem';

export default function CompanyCourses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [companyCourses, setCompanyCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // New Course Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [editCourseId, setEditCourseId] = useState(null);
  const [newCourse, setNewCourse] = useState({
    title: '',
    syllabus: '',
    image: '',
    price: '',
    originalPrice: '',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');
  const [notification, setNotification] = useState('');
  const fileInputRef = useRef(null);

  const fetchProposedCourses = async () => {
    try {
      const compRes = await fetch('/api/company-courses');
      const compData = await compRes.json();
      if (compData.success) {
        setCompanyCourses(compData.courses.filter(c => c.companyName === (user?.companyName || user?.fullName)));
      }
    } catch (err) {
      console.error('Failed to fetch company courses:', err);
    }
  };

  useEffect(() => {
    const fetchAllCourses = async () => {
      try {
        const [res] = await Promise.all([
          fetch('/api/courses')
        ]);
        const data = await res.json();
        
        if (data.success) {
          setCourses(data.courses);
        }
        await fetchProposedCourses();
      } catch (err) {
        console.error('Failed to fetch courses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllCourses();
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewCourse(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.type === 'blur') {
      e.preventDefault();
      const trimmed = tagInput.trim();
      if (trimmed && !newCourse.tags.includes(trimmed)) {
        setNewCourse(prev => ({ ...prev, tags: [...prev.tags, trimmed] }));
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setNewCourse(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tagToRemove) }));
  };

  const handlePublishCourse = async (e) => {
    e.preventDefault();
    if (!newCourse.title || !newCourse.syllabus || !newCourse.price) {
      setNotification('Please fill out all required fields (Course Title, Syllabus, Selling Price).');
      setTimeout(() => setNotification(''), 4000);
      return;
    }
    
    try {
      const url = editCourseId ? `/api/company-courses/${editCourseId}` : '/api/company-courses';
      const method = editCourseId ? 'PUT' : 'POST';
      
      const payload = {
        ...newCourse,
        price: Number(newCourse.price),
        originalPrice: newCourse.originalPrice ? Number(newCourse.originalPrice) : null,
        companyName: user.companyName || user.fullName || 'Partner Company'
      };

      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setNotification(editCourseId ? 'Course updated successfully' : 'Approval sent to admin');
        setTimeout(() => setNotification(''), 4000);
        setShowAddModal(false);
        setEditCourseId(null);
        setNewCourse({ title: '', syllabus: '', image: '', price: '', originalPrice: '', tags: [] });
        
        // Refresh the list
        fetchProposedCourses();
      } else {
        setNotification(data.message || 'Failed to save course. Please check inputs.');
        setTimeout(() => setNotification(''), 4000);
      }
    } catch (err) {
      console.error('Error saving course:', err);
      setNotification('An error occurred. Please try again later.');
      setTimeout(() => setNotification(''), 4000);
    }
  };

  const handleEditClick = (course) => {
    setEditCourseId(course._id || course.id);
    setNewCourse({
      title: course.title || '',
      syllabus: course.syllabus || '',
      image: course.image || '',
      price: course.price || '',
      originalPrice: course.originalPrice || '',
      tags: course.tags || []
    });
    setShowAddModal(true);
  };

  // Admin assigns courses by title (strings) to companies
  const assignedCourses = courses.filter(c => user?.assignedCourses?.includes(c.title));

  return (
    <PremiumPage>
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            style={{ position: 'fixed', top: 30, right: 30, zIndex: 9999999, background: notification.includes('Please') || notification.includes('Failed') || notification.includes('error') ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'linear-gradient(135deg, #10B981, #059669)', color: '#fff', padding: '16px 24px', borderRadius: 16, display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 10px 25px rgba(0,0,0,0.2)', fontWeight: 600 }}
          >
            <CheckCircle2 size={24} />
            {notification}
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
        <PageHeader
          title="My Courses"
          subtitle="Courses assigned to your company by the Super Admin, and courses you proposed."
          emoji="📚"
          style={{ marginBottom: 0 }}
        />
        <GradientButton onClick={() => { setEditCourseId(null); setNewCourse({ title: '', syllabus: '', image: '', price: '', originalPrice: '', tags: [] }); setShowAddModal(true); }} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', fontSize: 16 }}>
          <Plus size={20} /> Create New Course
        </GradientButton>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 80, color: P.inkMute, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
           <div style={{ width: 40, height: 40, border: `4px solid ${P.brand}30`, borderTopColor: P.brand, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
           <span>Loading your premium courses...</span>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: P.ink, fontFamily: P.font, margin: 0 }}>Proposed Courses</h2>
            <Badge color={P.brand} bg={`${P.brand}15`}>{companyCourses.length}</Badge>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 32, marginBottom: 64 }}>
            {companyCourses.length === 0 ? (
              <GlassCard style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 80, background: 'rgba(255,255,255,0.6)', border: `1px dashed ${P.border}` }}>
                <div style={{ fontSize: 64, marginBottom: 16, filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.1))' }}>🚀</div>
                <h3 style={{ fontSize: 24, color: P.ink, fontWeight: 800, marginBottom: 8 }}>Ready to Launch?</h3>
                <p style={{ color: P.inkSoft, margin: '0 0 24px 0', maxWidth: 400, marginLeft: 'auto', marginRight: 'auto' }}>Design a premium course for your employees or the wider platform. Propose your first course today.</p>
                <GradientButton onClick={() => setShowAddModal(true)}><Plus size={18} style={{marginRight: 8}}/>Create Course</GradientButton>
              </GlassCard>
            ) : (
              companyCourses.map((course, idx) => (
                <motion.div key={course._id || course.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1, type: 'spring' }} whileHover={{ y: -8, transition: { duration: 0.2 } }}>
                  <GlassCard style={{ padding: 0, overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', boxShadow: '0 12px 30px rgba(0,0,0,0.06)', borderRadius: 24 }}>
                    <div style={{ height: 200, backgroundImage: course.image ? `url(${course.image})` : 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)' }} />
                      {!course.image && <span style={{ color: '#fff', fontSize: 48, fontWeight: 900, opacity: 0.9, zIndex: 1 }}>{course.title.charAt(0)}</span>}
                      
                      <div style={{ position: 'absolute', top: 16, left: 16, display: 'flex', gap: 8, zIndex: 1 }}>
                        <Badge color="#fff" bg={course.status === 'approved' ? 'rgba(16,185,129,0.9)' : 'rgba(245,158,11,0.9)'} style={{ backdropFilter: 'blur(8px)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                          {course.status.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 8, zIndex: 1 }}>
                        <button onClick={() => handleEditClick(course)} style={{ background: 'rgba(255,255,255,0.95)', padding: 10, borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', transition: 'all 0.2s ease' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
                          <Edit2 size={18} color={P.brand} />
                        </button>
                      </div>
                    </div>
                    
                    <div style={{ padding: 28, flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
                      {course.tags && course.tags.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                          {course.tags.map((tag, i) => (
                            <span key={i} style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', background: `${P.brand}15`, color: P.brand, borderRadius: 20, letterSpacing: 0.5 }}>
                              #{tag.toUpperCase()}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: P.ink, fontFamily: P.font, lineHeight: 1.3 }}>{course.title}</h3>
                      
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                        <span style={{ color: P.ink, fontWeight: 900, fontSize: 24 }}>
                          {course.price ? `₹${course.price.toLocaleString()}` : 'Free'}
                        </span>
                        {course.originalPrice && (
                          <del style={{ color: P.inkMute, fontSize: 16, fontWeight: 600 }}>₹{course.originalPrice.toLocaleString()}</del>
                        )}
                      </div>
                      
                      <p style={{ margin: 0, color: P.inkSoft, fontSize: 15, lineHeight: 1.6, flex: 1, WebkitLineClamp: 3, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {course.syllabus}
                      </p>
                    </div>
                  </GlassCard>
                </motion.div>
              ))
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: P.ink, fontFamily: P.font, margin: 0 }}>Assigned Courses</h2>
            <Badge color={P.inkSoft} bg={P.border}>{assignedCourses.length}</Badge>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 32, marginBottom: 48 }}>
            {assignedCourses.length === 0 ? (
              <GlassCard style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 60, border: `1px dashed ${P.border}` }}>
                <p style={{ color: P.inkMute, margin: 0, fontSize: 16 }}>No courses have been assigned to your company yet.</p>
              </GlassCard>
            ) : (
              assignedCourses.map((course, idx) => (
              <motion.div key={course._id || course.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} whileHover={{ y: -5 }}>
                <GlassCard style={{ padding: 0, overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 24 }}>
                  <div style={{ height: 160, background: 'linear-gradient(135deg, #1B1F3B 0%, #3B4265 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    <span style={{ color: '#fff', fontSize: 40, fontWeight: 900, opacity: 0.9 }}>{course.title.charAt(0)}</span>
                    <div style={{ position: 'absolute', bottom: 16, left: 16 }}>
                      <Badge color="#fff" bg="rgba(255,255,255,0.2)" style={{ backdropFilter: 'blur(8px)' }}>Active Assignment</Badge>
                    </div>
                  </div>
                  <div style={{ padding: 28, flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: P.ink, fontFamily: P.font }}>{course.title}</h3>
                    <p style={{ margin: 0, color: P.inkSoft, fontSize: 14, lineHeight: 1.6, flex: 1 }}>{course.content || 'No description available.'}</p>
                  </div>
                </GlassCard>
              </motion.div>
            ))
          )}
          </div>
        </>
      )}

      {/* MODAL: Fixed height and scrollable content to prevent button cutoff on large images */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }} animate={{ opacity: 1, backdropFilter: 'blur(8px)' }} exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', zIndex: 999999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              style={{ background: P.panelBg, width: '100%', maxWidth: 600, maxHeight: '90vh', borderRadius: 28, overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.1) inset', display: 'flex', flexDirection: 'column' }}
            >
              <div style={{ padding: '28px 36px', borderBottom: `1px solid ${P.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(10px)' }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: P.ink, fontFamily: P.font }}>{editCourseId ? 'Edit Course Details' : 'Design New Course'}</h2>
                  <p style={{ margin: '4px 0 0 0', color: P.inkMute, fontSize: 14 }}>Create a premium learning experience.</p>
                </div>
                <button onClick={() => setShowAddModal(false)} style={{ background: P.bg, border: `1px solid ${P.border}`, cursor: 'pointer', color: P.inkMute, width: 40, height: 40, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#fee2e2'} onMouseOut={e => e.currentTarget.style.background = P.bg}><X size={20} /></button>
              </div>
              
              <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px' }}>
                <form id="courseForm" onSubmit={handlePublishCourse} style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontWeight: 700, color: P.ink, fontSize: 15 }}>Course Title <span style={{color: '#ef4444'}}>*</span></label>
                    <input value={newCourse.title} onChange={e => setNewCourse({...newCourse, title: e.target.value})} style={{ width: '100%', padding: '16px 20px', borderRadius: 16, border: `2px solid transparent`, background: P.bg, color: P.ink, fontSize: 16, boxShadow: '0 2px 5px rgba(0,0,0,0.05) inset', transition: 'all 0.2s' }} onFocus={e => e.target.style.borderColor = P.brand} onBlur={e => e.target.style.borderColor = 'transparent'} placeholder="e.g. Advanced AI Integration & Design" />
                  </div>
                  
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontWeight: 700, color: P.ink, fontSize: 15 }}>Syllabus / About <span style={{color: '#ef4444'}}>*</span></label>
                    <textarea value={newCourse.syllabus} onChange={e => setNewCourse({...newCourse, syllabus: e.target.value})} rows={5} style={{ width: '100%', padding: '16px 20px', borderRadius: 16, border: `2px solid transparent`, background: P.bg, color: P.ink, fontSize: 16, resize: 'vertical', boxShadow: '0 2px 5px rgba(0,0,0,0.05) inset', transition: 'all 0.2s' }} onFocus={e => e.target.style.borderColor = P.brand} onBlur={e => e.target.style.borderColor = 'transparent'} placeholder="Detail the course curriculum, target audience, and key takeaways..." />
                  </div>

                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontWeight: 700, color: P.ink, fontSize: 15 }}><Tag size={16}/> Course Tags</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, padding: '12px 16px', borderRadius: 16, background: P.bg, boxShadow: '0 2px 5px rgba(0,0,0,0.05) inset', minHeight: 56 }}>
                      {newCourse.tags.map((tag, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 12px', background: `${P.brand}20`, color: P.brand, borderRadius: 20, fontWeight: 600, fontSize: 13 }}>
                          {tag}
                          <button type="button" onClick={() => removeTag(tag)} style={{ background: 'none', border: 'none', color: P.brand, cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}><X size={14}/></button>
                        </div>
                      ))}
                      <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={handleAddTag} onBlur={handleAddTag} style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', minWidth: 120, color: P.ink, fontSize: 15 }} placeholder={newCourse.tags.length === 0 ? "Add tags (press Enter)" : "Add more tags..."} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                    <div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontWeight: 700, color: P.ink, fontSize: 15 }}>Original Price (₹)</label>
                      <input type="number" value={newCourse.originalPrice} onChange={e => setNewCourse({...newCourse, originalPrice: e.target.value})} style={{ width: '100%', padding: '16px 20px', borderRadius: 16, border: `2px solid transparent`, background: P.bg, color: P.ink, fontSize: 16, boxShadow: '0 2px 5px rgba(0,0,0,0.05) inset' }} onFocus={e => e.target.style.borderColor = P.brand} onBlur={e => e.target.style.borderColor = 'transparent'} placeholder="e.g. 5999" />
                    </div>
                    <div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontWeight: 700, color: P.ink, fontSize: 15 }}>Selling Price (₹) <span style={{color: '#ef4444'}}>*</span></label>
                      <input type="number" value={newCourse.price} onChange={e => setNewCourse({...newCourse, price: e.target.value})} style={{ width: '100%', padding: '16px 20px', borderRadius: 16, border: `2px solid transparent`, background: P.bg, color: P.ink, fontSize: 16, boxShadow: '0 2px 5px rgba(0,0,0,0.05) inset' }} onFocus={e => e.target.style.borderColor = P.brand} onBlur={e => e.target.style.borderColor = 'transparent'} placeholder="e.g. 4981" />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, fontWeight: 700, color: P.ink, fontSize: 15 }}>Cover Image</label>
                    <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" style={{ display: 'none' }} />
                    
                    {!newCourse.image ? (
                      <div onClick={() => fileInputRef.current?.click()} style={{ width: '100%', padding: '40px 20px', borderRadius: 20, border: `2px dashed ${P.brand}60`, background: `${P.brand}05`, color: P.brand, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.background = `${P.brand}15`} onMouseOut={e => e.currentTarget.style.background = `${P.brand}05`}>
                        <div style={{ background: '#fff', padding: 16, borderRadius: '50%', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                          <Upload size={28} />
                        </div>
                        <span style={{ fontWeight: 700, fontSize: 16 }}>Click to upload cover image</span>
                        <span style={{ fontSize: 13, color: P.inkSoft }}>16:9 ratio recommended</span>
                      </div>
                    ) : (
                      <div style={{ position: 'relative', height: 220, borderRadius: 20, backgroundImage: `url(${newCourse.image})`, backgroundSize: 'cover', backgroundPosition: 'center', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>
                        <button type="button" onClick={() => fileInputRef.current?.click()} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', border: 'none', color: '#fff', fontSize: 16, fontWeight: 700, opacity: 0, transition: 'opacity 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 20, cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.opacity = 1} onMouseOut={e => e.currentTarget.style.opacity = 0}>
                          <Upload size={20} /> Replace Image
                        </button>
                      </div>
                    )}
                  </div>
                </form>
              </div>

              <div style={{ padding: '24px 36px', borderTop: `1px solid ${P.border}`, background: 'rgba(255,255,255,0.5)', display: 'flex', justifyContent: 'flex-end', gap: 16, backdropFilter: 'blur(10px)' }}>
                <button type="button" onClick={() => setShowAddModal(false)} style={{ padding: '14px 28px', borderRadius: 100, border: `1px solid ${P.border}`, background: '#fff', color: P.ink, fontWeight: 700, fontSize: 16, cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.background = P.bg} onMouseOut={e => e.currentTarget.style.background = '#fff'}>Cancel</button>
                <GradientButton form="courseForm" type="submit" style={{ padding: '14px 32px', fontSize: 16 }}>{editCourseId ? 'Save Changes' : 'Publish Course'}</GradientButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PremiumPage>
  );
}
