import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Trash2, PauseCircle } from 'lucide-react';
import { PremiumPage, PageHeader, GlassCard, Badge, GradientButton, P } from '../../components/PremiumDesignSystem';

export default function AdminCompanyCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/company-courses'); // Fetch all, not just pending
      const data = await res.json();
      if (data.success) {
        setCourses(data.courses);
      }
    } catch (err) {
      console.error('Failed to fetch company courses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleApprove = async (id) => {
    try {
      const res = await fetch(`/api/company-courses/${id}/approve`, {
        method: 'PUT'
      });
      const data = await res.json();
      if (data.success) {
        setCourses(prev => prev.map(c => (c._id || c.id) === id ? { ...c, status: 'approved' } : c));
        alert('Course approved successfully!');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to approve course');
    }
  };

  const handleStopPublishing = async (id) => {
    if (!window.confirm("Are you sure you want to stop publishing this course?")) return;
    try {
      const res = await fetch(`/api/company-courses/${id}/stop`, { method: 'PUT' });
      const data = await res.json();
      if (data.success) {
        setCourses(prev => prev.map(c => (c._id || c.id) === id ? { ...c, status: 'stopped' } : c));
      }
    } catch (err) {
      alert('Failed to stop publishing course');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this course?")) return;
    try {
      const res = await fetch(`/api/company-courses/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setCourses(prev => prev.filter(c => (c._id || c.id) !== id));
      }
    } catch (err) {
      alert('Failed to delete course');
    }
  };

  return (
    <PremiumPage>
      <PageHeader
        title="Company Courses Approval"
        subtitle="Review and approve courses proposed by companies."
        emoji="📋"
      />

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: P.inkMute }}>Loading pending courses...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
          {courses.length === 0 ? (
            <GlassCard style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 60 }}>
              <p style={{ color: P.inkMute, margin: 0 }}>No company courses found.</p>
            </GlassCard>
          ) : (
            courses.map((course, idx) => (
              <motion.div
                key={course._id || course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <GlassCard style={{ padding: 0, overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div style={{
                    height: 160,
                    backgroundImage: course.image ? `url(${course.image})` : 'linear-gradient(135deg, #10B981 0%, #3B82F6 100%)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                  }}>
                    {!course.image && (
                      <span style={{ color: '#fff', fontSize: 36, fontWeight: 900, opacity: 0.85 }}>
                        {course.title.charAt(0)}
                      </span>
                    )}
                    <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(255,255,255,0.9)', padding: '4px 12px', borderRadius: 20 }}>
                       <span style={{ fontFamily: 'Playfair Display, serif', fontWeight: 900, color: '#333', fontSize: 16, letterSpacing: 1 }}>{course.companyName}</span>
                    </div>
                    <div style={{ position: 'absolute', top: 12, right: 12 }}>
                       <Badge variant={course.status === 'approved' ? 'success' : 'warning'}>
                         {course.status === 'approved' ? 'Approved' : 'Pending'}
                       </Badge>
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
                    
                    <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {course.status !== 'approved' ? (
                        <GradientButton onClick={() => handleApprove(course._id || course.id)} style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, background: '#10B981', borderColor: '#10B981', padding: '10px' }}>
                          <CheckCircle size={18} /> Approve
                        </GradientButton>
                      ) : (
                        <div style={{ textAlign: 'center', padding: '10px', color: '#10B981', fontWeight: 600, background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px' }}>
                          <CheckCircle size={18} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                          Approved
                        </div>
                      )}
                      
                      <div style={{ display: 'flex', gap: 8 }}>
                        {course.status === 'approved' && (
                          <button onClick={() => handleStopPublishing(course._id || course.id)} style={{ flex: 1, padding: '10px', background: '#f59e0b', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                            <PauseCircle size={16} /> Stop Publishing
                          </button>
                        )}
                        <button onClick={() => handleDelete(course._id || course.id)} style={{ flex: 1, padding: '10px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                          <Trash2 size={16} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))
          )}
        </div>
      )}
    </PremiumPage>
  );
}
