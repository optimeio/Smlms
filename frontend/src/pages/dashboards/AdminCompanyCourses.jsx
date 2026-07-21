import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';
import { PremiumPage, PageHeader, GlassCard, Badge, GradientButton, P } from '../../components/PremiumDesignSystem';

export default function AdminCompanyCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/company-courses?status=pending');
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
        setCourses(prev => prev.filter(c => (c._id || c.id) !== id));
        alert('Course approved successfully!');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to approve course');
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
              <p style={{ color: P.inkMute, margin: 0 }}>No pending courses at the moment.</p>
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
                    
                    <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
                      <GradientButton onClick={() => handleApprove(course._id || course.id)} style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, background: '#10B981', borderColor: '#10B981' }}>
                        <CheckCircle size={18} /> Approve
                      </GradientButton>
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
