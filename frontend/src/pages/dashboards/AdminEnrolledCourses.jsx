import React, { useState, useEffect } from 'react';
import { useAuth } from '../../state/useAuth';
import { Users, Search, BookOpen, Clock } from 'lucide-react';
import { PremiumPage, PageHeader, GlassCard, Badge, P } from '../../components/PremiumDesignSystem';

export default function AdminEnrolledCourses() {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('student'); // 'student' or 'trainer'
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, courseRes] = await Promise.all([
          fetch('/api/admin/users'),
          fetch('/api/courses')
        ]);
        const userData = await userRes.json();
        const courseData = await courseRes.json();
        
        if (userData.success) setUsers(userData.users || []);
        if (courseData.success) setCourses(courseData.courses || []);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getCourseTitle = (id) => {
    const c = courses.find(course => course._id === id || course.id === id);
    return c ? c.title : id;
  };

  // Filter users based on role and ensure they have at least one enrolled course
  const enrolledUsers = users.filter(u => {
    const roleMatches = (u.role || 'student').toLowerCase() === activeTab;
    const hasCourses = u.assignedCourses && u.assignedCourses.length > 0;
    return roleMatches && hasCourses;
  });

  const displayedUsers = enrolledUsers.filter(u => 
    (u.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = [
    { key: 'student', label: 'Students', icon: <Users size={16} /> },
    { key: 'trainer', label: 'Trainers', icon: <Users size={16} /> }
  ];

  return (
    <PremiumPage>
      <PageHeader
        title="Enrolled Courses"
        subtitle="View all users who have successfully purchased and enrolled in courses."
        emoji="🎓"
      />

      {/* Tabs & Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
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
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', width: 280 }}>
          <Search size={18} color={P.inkMute} style={{ position: 'absolute', left: 14, top: 12 }} />
          <input
            type="text"
            placeholder="Search by name or email..."
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
        <div style={{ textAlign: 'center', padding: 60, color: P.inkMute }}>Loading enrolled users...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {displayedUsers.length > 0 ? (
            displayedUsers.map((u, idx) => (
              <GlassCard key={idx} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: 18, fontWeight: 800, color: P.ink, fontFamily: P.font }}>{u.fullName}</h3>
                    <p style={{ margin: 0, fontSize: 14, color: P.inkMute }}>{u.email}</p>
                  </div>
                  <Badge color={P.green} bg="rgba(34,197,94,0.1)">{u.assignedCourses.length} Courses</Badge>
                </div>
                
                <div style={{ background: 'rgba(0,0,0,0.02)', padding: 16, borderRadius: 12, border: `1px solid ${P.border}` }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: 13, fontWeight: 700, color: P.inkMute, textTransform: 'uppercase', letterSpacing: 0.5 }}>Purchased Courses</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                    {u.assignedCourses.map((courseId, cIdx) => (
                      <div key={cIdx} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fff', padding: '6px 12px', borderRadius: 8, border: `1px solid ${P.border}`, boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                        <BookOpen size={14} color={P.primary} />
                        <span style={{ fontSize: 14, fontWeight: 600, color: P.ink }}>{getCourseTitle(courseId)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </GlassCard>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: 60, color: P.inkMute, background: 'rgba(255,255,255,0.5)', borderRadius: 16, border: `1px dashed ${P.border}` }}>
              No {activeTab}s have enrolled in any courses yet.
            </div>
          )}
        </div>
      )}
    </PremiumPage>
  );
}
