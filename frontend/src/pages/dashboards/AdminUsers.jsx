import { useState, useEffect } from 'react';
import { Search, Filter, GraduationCap, Users, BookOpen, Clock, Activity, MoreVertical, CheckCircle2, ChevronRight, Award } from 'lucide-react';
import { PremiumPage, PageHeader, GlassCard, GradientButton, P } from '../../components/PremiumDesignSystem';

const stats = [
  { label: 'Total Enrolled', value: '3,284', icon: <Users size={20} />, change: '+12% this month' },
  { label: 'Active Students', value: '2,910', icon: <Activity size={20} />, change: '+5% this week' },
  { label: 'Avg. Progress', value: '68%', icon: <BookOpen size={20} />, change: '+2% overall' },
  { label: 'Certificates Issued', value: '1,492', icon: <Award size={20} />, change: '+144 this week' },
];

export default function AdminUsers() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [filterCourse, setFilterCourse] = useState('All');
  
  useEffect(() => {
    fetch('/api/users?role=student')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.users.length > 0) {
          setStudents(data.users);
        } else {
          // Mock data for UI demonstration
          setStudents([
            { _id: '1', fullName: 'Sarah Connor', email: 'sarah@example.com', batch: 'FSD-2026', coursesCount: 3, progress: 85, status: 'Active' },
            { _id: '2', fullName: 'John Smith', email: 'john@example.com', batch: 'FSD-2026', coursesCount: 2, progress: 42, status: 'Active' },
            { _id: '3', fullName: 'Emily Chen', email: 'emily@example.com', batch: 'DS-2026', coursesCount: 4, progress: 95, status: 'Active' },
            { _id: '4', fullName: 'Michael Brown', email: 'michael@example.com', batch: 'UI-2026', coursesCount: 1, progress: 10, status: 'Inactive' },
          ]);
        }
      })
      .catch(() => {
        setStudents([]);
      });
  }, []);

  const filteredStudents = students.filter(s => 
    (s.fullName || '').toLowerCase().includes(search.toLowerCase()) || 
    (s.email || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PremiumPage>
      <PageHeader 
        title="Student Management" 
        subtitle="Manage enrollments, monitor progress, and oversee academic records."
        emoji="🎓"
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 32 }}>
        {stats.map((stat) => (
          <GlassCard key={stat.label} style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 16, background: 'rgba(91,92,255,0.1)', color: P.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {stat.icon}
            </div>
            <div>
              <p style={{ margin: '0 0 4px', fontSize: 13, color: P.inkMute, fontWeight: 700 }}>{stat.label}</p>
              <h3 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: P.ink, fontFamily: P.font }}>{stat.value}</h3>
              <p style={{ margin: '4px 0 0', fontSize: 12, color: P.green, fontWeight: 600 }}>{stat.change}</p>
            </div>
          </GlassCard>
        ))}
      </div>

      <GlassCard style={{ padding: '24px 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', gap: 16, flex: 1, minWidth: 300 }}>
            <div style={{ position: 'relative', flex: 1, maxWidth: 400 }}>
              <Search size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: P.inkMute }} />
              <input 
                type="text" 
                placeholder="Search students by name or email..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ width: '100%', padding: '12px 16px 12px 44px', borderRadius: P.radius, border: `1px solid ${P.border}`, fontSize: 14, outline: 'none', background: '#f8fafc', color: P.ink, fontFamily: P.font }}
              />
            </div>
            <select 
              value={filterCourse}
              onChange={e => setFilterCourse(e.target.value)}
              style={{ padding: '0 16px', borderRadius: P.radius, border: `1px solid ${P.border}`, fontSize: 14, outline: 'none', background: '#fff', color: P.ink, fontFamily: P.font, minWidth: 150 }}
            >
              <option value="All">All Courses</option>
              <option value="FSD">Full Stack Dev</option>
              <option value="DS">Data Science</option>
            </select>
          </div>
          <GradientButton>+ Add Student</GradientButton>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${P.border}`, color: P.inkMute, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <th style={{ padding: '16px 0', fontWeight: 800 }}>Student Profile</th>
                <th style={{ padding: '16px', fontWeight: 800 }}>Batch / Status</th>
                <th style={{ padding: '16px', fontWeight: 800 }}>Enrolled</th>
                <th style={{ padding: '16px', fontWeight: 800 }}>Progress</th>
                <th style={{ padding: '16px', textAlign: 'right', fontWeight: 800 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student._id} style={{ borderBottom: `1px solid ${P.border}`, transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '16px 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #e0e7ff, #c7d2fe)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5', fontWeight: 800 }}>
                        {student.fullName ? student.fullName.charAt(0).toUpperCase() : 'S'}
                      </div>
                      <div>
                        <p style={{ margin: 0, fontWeight: 800, color: P.ink, fontSize: 15 }}>{student.fullName || 'Unknown'}</p>
                        <p style={{ margin: 0, color: P.inkMute, fontSize: 13 }}>{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <p style={{ margin: 0, fontWeight: 700, color: P.inkSoft, fontSize: 14 }}>{student.batch || 'Unassigned'}</p>
                    <span style={{ display: 'inline-block', marginTop: 4, padding: '2px 8px', borderRadius: 12, fontSize: 11, fontWeight: 800, background: student.status === 'Inactive' ? '#fee2e2' : '#dcfce7', color: student.status === 'Inactive' ? '#b91c1c' : '#15803d' }}>
                      {student.status || 'Active'}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: P.inkSoft, fontSize: 14, fontWeight: 600 }}>
                      <BookOpen size={16} color={P.blue} /> {student.coursesCount || 0} Courses
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ flex: 1, height: 8, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ height: '100%', background: 'linear-gradient(90deg, #6366F1, #8B5CF6)', width: `${student.progress || 0}%`, borderRadius: 4 }} />
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 800, color: P.ink, width: 36 }}>{student.progress || 0}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: P.inkMute, padding: 8, borderRadius: '50%' }} onMouseEnter={e => {e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = P.primary}} onMouseLeave={e => {e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = P.inkMute}}>
                      <MoreVertical size={20} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: P.inkMute }}>No students found matching your search.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </PremiumPage>
  );
}