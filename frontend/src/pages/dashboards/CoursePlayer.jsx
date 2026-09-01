import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import { motion } from 'framer-motion';

export default function CoursePlayer() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [progress, setProgress] = useState([]); // Array of completed module indices
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch course
        const coursesRes = await fetch('/api/courses');
        const coursesData = await coursesRes.json();
        if (coursesData.success) {
          const foundCourse = coursesData.courses.find(c => c._id === courseId || c.id === courseId || c.title === decodeURIComponent(courseId));
          setCourse(foundCourse);
        }

        // Fetch progress
        const progRes = await fetch(`/api/users/${user.email || user.id || user._id}/progress/${encodeURIComponent(courseId)}`);
        const progData = await progRes.json();
        if (progData.success) {
          setProgress(progData.progress || []);
        }
      } catch (err) {
        console.error('Failed to load course player data:', err);
      } finally {
        setLoading(false);
      }
    };
    if (courseId && (user.email || user.id || user._id)) {
      fetchData();
    }
  }, [courseId, user.email, user.id, user._id]);

  const toggleModuleComplete = async (idx) => {
    let newProgress;
    if (progress.includes(idx)) {
      newProgress = progress.filter(i => i !== idx);
    } else {
      newProgress = [...progress, idx];
    }
    setProgress(newProgress);

    // Save to backend
    try {
      await fetch(`/api/users/${user.email || user.id || user._id}/progress/${encodeURIComponent(courseId)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ progress: newProgress })
      });
    } catch (err) {
      console.error('Failed to save progress:', err);
    }
  };

  const generateCertificate = () => {
    const doc = new jsPDF({ orientation: 'landscape' });
    
    // Background and Border
    doc.setFillColor(248, 250, 252);
    doc.rect(0, 0, 297, 210, 'F');
    doc.setDrawColor(0, 95, 122);
    doc.setLineWidth(5);
    doc.rect(10, 10, 277, 190);
    
    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(40);
    doc.setTextColor(0, 95, 122);
    doc.text("Certificate of Completion", 148.5, 60, { align: "center" });
    
    // Subtext
    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    doc.setTextColor(100, 116, 139);
    doc.text("This is to certify that", 148.5, 85, { align: "center" });
    
    // Student Name
    doc.setFont("helvetica", "bold");
    doc.setFontSize(30);
    doc.setTextColor(15, 23, 42);
    doc.text(user.fullName || "Student", 148.5, 110, { align: "center" });
    
    // Course info
    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    doc.setTextColor(100, 116, 139);
    doc.text(`has successfully completed the course`, 148.5, 130, { align: "center" });
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(2, 132, 199);
    doc.text(course?.title || "Course Name", 148.5, 150, { align: "center" });
    
    // Date
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(100, 116, 139);
    const date = new Date().toLocaleDateString();
    doc.text(`Date Issued: ${date}`, 148.5, 175, { align: "center" });

    // Save
    doc.save(`${course?.title || 'Course'}_Certificate.pdf`);
  };

  if (loading) {
    return <div style={{ padding: '50px', textAlign: 'center', color: '#64748b' }}>Loading Course Environment...</div>;
  }

  if (!course) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h2>Course not found</h2>
        <button onClick={() => navigate(-1)} style={{ padding: '10px 20px', background: '#005F7A', color: '#fff', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>Go Back</button>
      </div>
    );
  }

  // Generate dynamic modules based on course uploads
  const modules = [];
  if (course.video) {
    modules.push({ type: 'video', title: course.videoName || 'Video Lecture', url: course.video, duration: course.duration || 'Video' });
  }
  if (course.ppt) {
    modules.push({ type: 'ppt', title: course.pptName || 'Course Presentation', url: course.ppt, duration: 'Document' });
  }
  if (modules.length === 0) {
    modules.push({ type: 'text', title: 'Course Content', content: course.content || 'No media available for this course.', duration: 'Reading' });
  }

  const activeModule = modules[activeModuleIndex] || modules[0];
  const completionPercentage = Math.round((progress.length / modules.length) * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#f1f5f9' }}>
      {/* Top Navbar */}
      <div style={{ background: '#fff', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#64748b' }}>
            &larr;
          </button>
          <div>
            <h1 style={{ margin: 0, fontSize: '20px', color: '#0f172a' }}>{course.title}</h1>
            <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Module {activeModuleIndex + 1} of {modules.length}</p>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#005F7A', marginBottom: '4px' }}>Your Progress: {completionPercentage}%</div>
            <div style={{ width: '150px', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${completionPercentage}%` }}
                transition={{ duration: 0.5 }}
                style={{ height: '100%', background: 'linear-gradient(90deg, #0ea5e9, #005F7A)' }} 
              />
            </div>
          </div>
          {completionPercentage === 100 && (
            <motion.button 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              onClick={generateCertificate}
              style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '13px', boxShadow: '0 4px 6px rgba(16, 185, 129, 0.2)' }}
            >
              🎓 Download Certificate
            </motion.button>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Main Content Area */}
        <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto' }}>
          <div style={{ width: '100%', aspectRatio: activeModule.type === 'ppt' ? 'auto' : '16/9', height: activeModule.type === 'ppt' ? '70vh' : 'auto', background: '#000', borderRadius: '16px', overflow: 'hidden', position: 'relative', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
            
            {activeModule.type === 'video' && (
              <video 
                controls 
                autoPlay
                src={activeModule.url} 
                style={{ width: '100%', height: '100%', outline: 'none' }} 
                onEnded={() => { if (!progress.includes(activeModuleIndex)) toggleModuleComplete(activeModuleIndex) }}
              />
            )}

            {activeModule.type === 'ppt' && (
              <iframe 
                src={activeModule.url} 
                title={activeModule.title}
                style={{ width: '100%', height: '100%', border: 'none', background: '#fff' }} 
              />
            )}

            {activeModule.type === 'text' && (
              <div style={{ position: 'absolute', inset: 0, padding: '40px', color: '#fff', background: 'linear-gradient(135deg, #1e293b, #0f172a)', overflowY: 'auto' }}>
                <h2 style={{ margin: '0 0 20px 0' }}>{activeModule.title}</h2>
                <div style={{ color: '#cbd5e1', lineHeight: '1.6' }} dangerouslySetInnerHTML={{ __html: activeModule.content }}></div>
              </div>
            )}
            
          </div>

          <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', color: '#0f172a' }}>{activeModule.title}</h3>
              <p style={{ margin: 0, color: '#64748b' }}>{activeModule.type === 'video' ? 'Watch the video lecture completely.' : 'Review the attached document.'}</p>
            </div>
            {!progress.includes(activeModuleIndex) ? (
              <button 
                onClick={() => toggleModuleComplete(activeModuleIndex)}
                style={{ background: '#0ea5e9', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
              >
                Mark as Complete
              </button>
            ) : (
              <button 
                onClick={() => toggleModuleComplete(activeModuleIndex)}
                style={{ background: '#f1f5f9', color: '#10b981', border: '1px solid #10b981', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                ✓ Completed
              </button>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ width: '350px', background: '#fff', borderLeft: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>Course Content</h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>{modules.length} Modules</p>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {modules.map((mod, idx) => {
              const isCompleted = progress.includes(idx);
              const isActive = activeModuleIndex === idx;
              return (
                <div 
                  key={idx}
                  onClick={() => setActiveModuleIndex(idx)}
                  style={{ 
                    padding: '16px 20px', 
                    borderBottom: '1px solid #f1f5f9', 
                    cursor: 'pointer',
                    background: isActive ? '#f8fafc' : '#fff',
                    borderLeft: isActive ? '4px solid #005F7A' : '4px solid transparent',
                    display: 'flex',
                    gap: '12px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleModuleComplete(idx); }}
                    style={{
                      width: '24px', height: '24px', borderRadius: '50%',
                      border: isCompleted ? 'none' : '2px solid #cbd5e1',
                      background: isCompleted ? '#10b981' : 'transparent',
                      color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', padding: 0, flexShrink: 0, marginTop: '2px'
                    }}
                  >
                    {isCompleted && <span style={{ fontSize: '12px' }}>✓</span>}
                  </button>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: isActive ? 700 : 500, color: isActive ? '#005F7A' : '#334155', marginBottom: '4px' }}>
                      {mod.title}
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {mod.type === 'video' ? '▶' : '📄'} {mod.duration}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

