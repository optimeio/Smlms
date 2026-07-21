import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../state/useAuth';
import { BookOpen, Plus, X, Upload, CheckCircle2, Edit2 } from 'lucide-react';
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
    originalPrice: ''
  });
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

  const handlePublishCourse = async (e) => {
    e.preventDefault();
    if (!newCourse.title || !newCourse.syllabus || !newCourse.price) {
      alert('Please fill out all required fields.');
      return;
    }
    
    try {
      const url = editCourseId ? `/api/company-courses/${editCourseId}` : '/api/company-courses';
      const method = editCourseId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newCourse,
          companyName: user.companyName || user.fullName || 'Partner Company'
        })
      });
      const data = await res.json();
      if (data.success) {
        setNotification(editCourseId ? 'Course updated successfully' : 'Request has been sent for admin to publish course');
        setTimeout(() => setNotification(''), 3000);
        setShowAddModal(false);
        setEditCourseId(null);
        setNewCourse({ title: '', syllabus: '', image: '', price: '', originalPrice: '' });
        
        // Refresh the list
        fetchProposedCourses();
      } else {
        alert(data.message || 'Failed to save course');
      }
    } catch (err) {
      console.error('Error saving course:', err);
      alert('An error occurred. Please try again later.');
    }
  };

  const handleEditClick = (course) => {
    setEditCourseId(course._id || course.id);
    setNewCourse({
      title: course.title || '',
      syllabus: course.syllabus || '',
      image: course.image || '',
      price: course.price || '',
      originalPrice: course.originalPrice || ''
    });
    setShowAddModal(true);
  };

  // Admin assigns courses by title (strings) to companies
  const assignedCourses = courses.filter(c => user?.assignedCourses?.includes(c.title));

  return (
    <PremiumPage>
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999, background: '#10B981', color: '#fff', padding: '16px 24px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 10px 25px rgba(16,185,129,0.3)', fontWeight: 600 }}
        >
          <CheckCircle2 size={24} />
          {notification}
        </motion.div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <PageHeader
          title="My Courses"
          subtitle="Courses assigned to your company by the Super Admin, and courses you proposed."
          emoji="📚"
          style={{ marginBottom: 0 }}
        />
        <GradientButton onClick={() => { setEditCourseId(null); setNewCourse({ title: '', syllabus: '', image: '', price: '', originalPrice: '' }); setShowAddModal(true); }} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Plus size={20} /> Add Course
        </GradientButton>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: P.inkMute }}>Loading courses...</div>
      ) : (
        <>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: P.ink, fontFamily: P.font, marginBottom: 20 }}>Assigned Courses</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24, marginBottom: 48 }}>
            {assignedCourses.length === 0 ? (
              <GlassCard style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 60 }}>
                <p style={{ color: P.inkMute, margin: 0 }}>No courses have been assigned to your company yet.</p>
              </GlassCard>
            ) : (
              assignedCourses.map((course, idx) => (
              <motion.div
                key={course._id || course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <GlassCard style={{ padding: 0, overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div style={{
                    height: 140,
                    background: 'linear-gradient(135deg, #5B5CFF 0%, #7C5CFF 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                  }}>
                    <span style={{ color: '#fff', fontSize: 36, fontWeight: 900, opacity: 0.85 }}>
                      {course.title.charAt(0)}
                    </span>
                    <div style={{ position: 'absolute', bottom: 12, right: 12 }}>
                      <Badge color="#fff" bg="rgba(255,255,255,0.2)">
                        Active Training
                      </Badge>
                    </div>
                  </div>
                  <div style={{ padding: 24, flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: P.ink, fontFamily: P.font }}>
                      {course.title}
                    </h3>
                    <p style={{ margin: 0, color: P.inkSoft, fontSize: 14, lineHeight: 1.6, flex: 1 }}>
                      {course.content || 'No description available.'}
                    </p>
                  </div>
                </GlassCard>
              </motion.div>
            ))
          )}
          </div>

          <h2 style={{ fontSize: 24, fontWeight: 700, color: P.ink, fontFamily: P.font, marginBottom: 20 }}>Proposed Courses</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
            {companyCourses.length === 0 ? (
              <GlassCard style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 60 }}>
                <p style={{ color: P.inkMute, margin: 0 }}>You haven't proposed any courses yet.</p>
              </GlassCard>
            ) : (
              companyCourses.map((course, idx) => (
                <motion.div key={course._id || course.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                  <GlassCard style={{ padding: 0, overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ height: 160, backgroundImage: course.image ? `url(${course.image})` : 'linear-gradient(135deg, #FF6B00 0%, #FF9F43 100%)', backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                      {!course.image && <span style={{ color: '#fff', fontSize: 36, fontWeight: 900, opacity: 0.85 }}>{course.title.charAt(0)}</span>}
                      <div style={{ position: 'absolute', bottom: 12, right: 12 }}>
                        <Badge color="#fff" bg="rgba(0,0,0,0.5)">{course.status.toUpperCase()}</Badge>
                      </div>
                      <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(255,255,255,0.9)', padding: '4px 12px', borderRadius: 20 }}>
                         <span style={{ fontFamily: 'Playfair Display, serif', fontWeight: 900, color: '#333', fontSize: 16, letterSpacing: 1 }}>{course.companyName}</span>
                      </div>
                      <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 8 }}>
                        <button onClick={() => handleEditClick(course)} style={{ background: 'rgba(255,255,255,0.9)', padding: 8, borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                          <Edit2 size={16} color="#333" />
                        </button>
                      </div>
                    </div>
                    <div style={{ padding: 24, flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: P.ink, fontFamily: P.font }}>{course.title}</h3>
                      <p style={{ margin: 0, color: '#10B981', fontWeight: 700, fontSize: 16 }}>
                        {course.originalPrice ? (
                          <>
                            <del style={{ color: '#94a3b8', marginRight: 8, fontSize: 14 }}>₹{course.originalPrice}</del>
                            ₹{course.price}
                          </>
                        ) : (
                          course.price ? `₹${course.price}` : 'Free'
                        )}
                      </p>
                      <p style={{ margin: 0, color: P.inkSoft, fontSize: 14, lineHeight: 1.6, flex: 1, WebkitLineClamp: 3, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {course.syllabus}
                      </p>
                    </div>
                  </GlassCard>
                </motion.div>
              ))
            )}
          </div>
        </>
      )}

      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              style={{ background: P.panelBg, width: '100%', maxWidth: 500, borderRadius: 24, overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.15)' }}
            >
              <div style={{ padding: '24px 32px', borderBottom: `1px solid ${P.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: P.ink }}>{editCourseId ? 'Edit Course' : 'Add New Course'}</h2>
                <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: P.inkMute }}><X size={24} /></button>
              </div>
              <form onSubmit={handlePublishCourse} style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: P.ink }}>Course Name</label>
                  <input required value={newCourse.title} onChange={e => setNewCourse({...newCourse, title: e.target.value})} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: `1px solid ${P.border}`, background: P.bg, color: P.ink, fontSize: 16 }} placeholder="e.g. Advanced AI Integration" />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: P.ink }}>Syllabus / About</label>
                  <textarea required value={newCourse.syllabus} onChange={e => setNewCourse({...newCourse, syllabus: e.target.value})} rows={4} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: `1px solid ${P.border}`, background: P.bg, color: P.ink, fontSize: 16, resize: 'vertical' }} placeholder="Course description and topics covered..." />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: P.ink }}>Original Price (e.g. 5999)</label>
                    <input type="number" value={newCourse.originalPrice} onChange={e => setNewCourse({...newCourse, originalPrice: e.target.value})} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: `1px solid ${P.border}`, background: P.bg, color: P.ink, fontSize: 16 }} placeholder="Strike-out amount" />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: P.ink }}>Selling Price</label>
                    <input required type="number" value={newCourse.price} onChange={e => setNewCourse({...newCourse, price: e.target.value})} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: `1px solid ${P.border}`, background: P.bg, color: P.ink, fontSize: 16 }} placeholder="Actual amount" />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: P.ink }}>Course Image</label>
                  <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" style={{ display: 'none' }} />
                  <button type="button" onClick={() => fileInputRef.current?.click()} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: `1px dashed ${P.brand}`, background: `${P.brand}10`, color: P.brand, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', fontWeight: 600 }}>
                    <Upload size={18} /> {newCourse.image ? 'Change' : 'Upload'}
                  </button>
                </div>
                {newCourse.image && (
                  <div style={{ height: 120, borderRadius: 12, backgroundImage: `url(${newCourse.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                )}
                <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                  <GradientButton type="button" onClick={() => setShowAddModal(false)} style={{ background: 'transparent', color: P.inkMute, border: 'none' }}>Cancel</GradientButton>
                  <GradientButton type="submit">{editCourseId ? 'Save Changes' : 'Publish Course'}</GradientButton>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PremiumPage>
  );
}
