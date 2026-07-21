import { useState, useEffect } from 'react';
import { Search, Filter, BookOpen, TrendingUp, Users, Award, PlayCircle, Edit2, Trash2, Plus } from 'lucide-react';
import { 
  AdminPage, 
  AdminPageHeader, 
  EnterpriseCard, 
  AdminButton, 
  AdminBadge,
  AdminSearch,
  AdminTableContainer,
  AdminTh,
  AdminTd,
  A 
} from '../../components/AdminDesignSystem';

const stats = [
  { label: 'Total Courses', value: '48', icon: <BookOpen size={24} />, change: '+4 this month' },
  { label: 'Total Enrollments', value: '8,421', icon: <Users size={24} />, change: '+12% vs last month' },
  { label: 'Avg. Completion', value: '76%', icon: <Award size={24} />, change: '+5% overall' },
  { label: 'Platform Revenue', value: '$24.5k', icon: <TrendingUp size={24} />, change: '+18% this quarter' },
];

const categories = ['All', 'Development', 'Design', 'Business', 'Marketing', 'Data Science'];

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  
  useEffect(() => {
    fetch('/api/courses')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.courses.length > 0) {
          setCourses(data.courses);
        } else {
          // Mock data
          setCourses([
            { _id: '1', title: 'Advanced Full Stack Development', category: 'Development', enrollments: 1240, completion: 82, rating: 4.8, status: 'Published', instructor: 'Dr. Alan Turing' },
            { _id: '2', title: 'UI/UX Design Masterclass', category: 'Design', enrollments: 856, completion: 65, rating: 4.9, status: 'Published', instructor: 'Sarah Connor' },
            { _id: '3', title: 'Data Science with Python', category: 'Data Science', enrollments: 2100, completion: 45, rating: 4.7, status: 'Published', instructor: 'Grace Hopper' },
            { _id: '4', title: 'Digital Marketing 101', category: 'Marketing', enrollments: 0, completion: 0, rating: 0, status: 'Draft', instructor: 'John Smith' },
          ]);
        }
      })
      .catch(() => setCourses([]));
  }, []);

  const filteredCourses = courses.filter(c => 
    (activeCategory === 'All' || c.category === activeCategory) &&
    (c.title || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminPage>
      <AdminPageHeader 
        title="Course Management" 
        subtitle="Create, manage, and analyze course performance across the platform."
        emoji="📚"
        actions={
          <AdminButton variant="blue" icon={<Plus size={18} />}>
            Create Course
          </AdminButton>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24, marginBottom: 36 }}>
        {stats.map((stat) => (
          <EnterpriseCard key={stat.label} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: '#EFF6FF', color: A.blue, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {stat.icon}
            </div>
            <div>
              <p style={{ margin: '0 0 4px', fontSize: 13, color: A.inkSoft, fontWeight: 600 }}>{stat.label}</p>
              <h3 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: A.ink, fontFamily: A.font }}>{stat.value}</h3>
              <p style={{ margin: '4px 0 0', fontSize: 12, color: A.green, fontWeight: 600 }}>{stat.change}</p>
            </div>
          </EnterpriseCard>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', gap: 16, flex: 1, minWidth: 300, flexWrap: 'wrap', alignItems: 'center' }}>
          <AdminSearch 
            placeholder="Search courses..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{ 
                  padding: '8px 16px', 
                  borderRadius: 20, 
                  border: `1px solid ${activeCategory === cat ? A.primary : A.border}`, 
                  background: activeCategory === cat ? `${A.primary}15` : A.surface, 
                  color: activeCategory === cat ? A.primary : A.inkSoft, 
                  fontSize: 13, 
                  fontWeight: 600, 
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  fontFamily: A.font,
                  transition: 'all 0.2s'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <AdminTableContainer>
        <thead>
          <tr>
            <AdminTh>Course Details</AdminTh>
            <AdminTh>Instructor</AdminTh>
            <AdminTh>Enrollments</AdminTh>
            <AdminTh>Completion</AdminTh>
            <AdminTh><div style={{ textAlign: 'right' }}>Actions</div></AdminTh>
          </tr>
        </thead>
        <tbody>
          {filteredCourses.map((course) => (
            <tr key={course._id} style={{ transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <AdminTd>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #0F172A, #1E293B)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 4px 12px rgba(15,23,42,0.1)' }}>
                    <PlayCircle size={24} />
                  </div>
                  <div>
                    <p style={{ margin: '0 0 6px', fontWeight: 700, color: A.ink, fontSize: 15 }}>{course.title}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ color: A.inkSoft, fontSize: 13 }}>{course.category}</span>
                      <span style={{ width: 4, height: 4, borderRadius: '50%', background: A.border }}></span>
                      <AdminBadge color={course.status === 'Published' ? A.green : A.inkSoft}>
                        {course.status}
                      </AdminBadge>
                    </div>
                  </div>
                </div>
              </AdminTd>
              <AdminTd>
                <p style={{ margin: 0, fontWeight: 600, color: A.ink, fontSize: 14 }}>{course.instructor || 'Unassigned'}</p>
              </AdminTd>
              <AdminTd>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: A.ink, fontSize: 15, fontWeight: 700 }}>
                  <Users size={16} color={A.inkMute} /> {course.enrollments || 0}
                </div>
              </AdminTd>
              <AdminTd>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ flex: 1, height: 8, background: '#F1F5F9', borderRadius: 4, overflow: 'hidden', minWidth: 100 }}>
                    <div style={{ height: '100%', background: A.green, width: `${course.completion || 0}%`, borderRadius: 4 }} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: A.ink, width: 36 }}>{course.completion || 0}%</span>
                </div>
              </AdminTd>
              <AdminTd>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                  <button style={{ background: A.surface, border: `1px solid ${A.border}`, cursor: 'pointer', color: A.inkSoft, padding: 8, borderRadius: 8, transition: 'all 0.2s' }} onMouseEnter={e => {e.currentTarget.style.color = A.primary; e.currentTarget.style.borderColor = A.primary}} onMouseLeave={e => {e.currentTarget.style.color = A.inkSoft; e.currentTarget.style.borderColor = A.border}}>
                    <Edit2 size={16} />
                  </button>
                  <button style={{ background: A.surface, border: `1px solid ${A.border}`, cursor: 'pointer', color: A.inkSoft, padding: 8, borderRadius: 8, transition: 'all 0.2s' }} onMouseEnter={e => {e.currentTarget.style.color = A.red; e.currentTarget.style.borderColor = A.red}} onMouseLeave={e => {e.currentTarget.style.color = A.inkSoft; e.currentTarget.style.borderColor = A.border}}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </AdminTd>
            </tr>
          ))}
        </tbody>
      </AdminTableContainer>
    </AdminPage>
  );
}