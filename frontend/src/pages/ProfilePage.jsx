import { useState, useMemo, useCallback, useRef } from 'react';
import { useAuth } from '../state/useAuth';
import Cropper from 'react-easy-crop';
import { generatePremiumResume } from '../utils/resumeGenerator';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Save, X, FileText, Edit2, Shield, User, Briefcase, Award, GraduationCap, MapPin, Building, Target, Users } from 'lucide-react';
import { PremiumPage, PageHeader, GlassCard, GradientButton, Badge, P } from '../components/PremiumDesignSystem';

const defaultSkills = ['React', 'Python', 'JavaScript', 'Node.js', 'MongoDB', 'HTML', 'CSS', 'Git'];

const defaultAcademicDetails = [
  { label: 'College', value: 'Mahendra Institution' },
  { label: 'Department', value: 'Computer Science Engineering' },
  { label: 'Academic year', value: 'IV year' },
  { label: 'Register number', value: 'MIU20CS123' },
];

const defaultAchievements = [
  { title: 'React developer certificate', sub: 'Issued by MBK tech', date: 'Apr 20, 2024', color: '#7C6FF0', icon: '🏆' },
  { title: 'Top performer', sub: 'Scored highest in React assessment', date: 'Mar 15, 2024', color: '#22B07D', icon: '⭐' },
  { title: 'Python programming', sub: 'Certificate of completion', date: 'Feb 28, 2024', color: '#F4933C', icon: '⚙️' },
];

// Helper to extract cropped image as base64
const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

async function getCroppedImg(imageSrc, pixelCrop) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) return null;

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return canvas.toDataURL('image/jpeg');
}

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showPhotoViewer, setShowPhotoViewer] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    college: user?.college || '',
    department: user?.department || '',
    knowledge: user?.knowledge || '',
    expertise: user?.expertise || '',
    experience: user?.experience || '',
    linkedin: user?.linkedin || '',
    profilePhoto: user?.profilePhoto || '',
    industry: user?.industry || '',
    website: user?.website || '',
    companySize: user?.companySize || '',
    hrName: user?.hrName || ''
  });

  // Cropper State
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      let imageDataUrl = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
      setImageSrc(imageDataUrl);
      setShowCropper(true);
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropSave = async () => {
    try {
      const croppedBase64 = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (croppedBase64) {
        setFormData(prev => ({ ...prev, profilePhoto: croppedBase64 }));
      }
      setShowCropper(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownloadResume = () => {
    generatePremiumResume(profile, false);
  };

  const profile = useMemo(() => {
    const isTrainer = user?.role?.toLowerCase() === 'trainer';
    const isCompany = user?.role?.toLowerCase() === 'company';
    return {
      fullName: user?.companyName || user?.fullName || (isCompany ? 'Company Name' : (isTrainer ? 'Trainer Name' : 'Student Name')),
      email: user?.email || (isCompany ? 'contact@company.com' : (isTrainer ? 'trainer@example.com' : 'student@example.com')),
      phone: user?.phone || '6369067085',
      college: user?.college || (isCompany ? 'Corporate Partner' : (isTrainer ? 'MBK Tech' : defaultAcademicDetails[0].value)),
      department: user?.department || (isCompany ? 'HR & Training' : (isTrainer ? 'Software Engineering' : defaultAcademicDetails[1].value)),
      academicYear: user?.year || defaultAcademicDetails[2].value,
      registerNumber: user?.registerNumber || (isCompany ? 'CMP-001' : defaultAcademicDetails[3].value),
      cgpa: user?.cgpa || '8.62',
      status: isCompany ? 'Active Partner' : (isTrainer ? 'Active Trainer' : 'Active Student'),
      role: user?.role || 'Student',
      location: user?.location || user?.district || 'Salem, Tamil Nadu',
      skills: Array.isArray(user?.skills) && user.skills.length > 0 ? user.skills : defaultSkills,
      about: user?.about || (isCompany ? 'Corporate partner managing employee training.' : (isTrainer ? 'Experienced technical trainer.' : 'Passionate about learning and solving problems. Always eager to grow.')),
      assignedCourses: Array.isArray(user?.assignedCourses) ? user.assignedCourses : [],
      profilePhoto: user?.profilePhoto || 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200&h=200&fit=crop',
      knowledge: user?.knowledge || '',
      experience: user?.experience || (isTrainer ? '5' : ''),
      expertise: user?.expertise || (isTrainer ? 'Web Development' : ''),
      linkedin: user?.linkedin || ''
    };
  }, [user]);

  const handleSave = async () => {
    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: profile.email, ...formData })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert('Profile updated successfully!');
        if (updateUser) {
          updateUser(data.user); // update the context
        }
        setIsEditing(false);
      } else {
        alert(data.message || 'Failed to update profile.');
      }
    } catch (err) {
      alert('Error saving profile. Please try again.');
    }
  };

  const achievements = defaultAchievements;
  const completion = 85;
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (completion / 100) * circumference;

  const isCompany = profile.role?.toLowerCase() === 'company';
  const isTrainer = profile.role?.toLowerCase() === 'trainer';

  const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: 12, border: `1px solid ${P.border}`,
    fontSize: 14, color: P.ink, outline: 'none', boxSizing: 'border-box',
    background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(8px)', fontFamily: P.font,
    transition: 'border-color .2s, box-shadow .2s',
  };
  const labelStyle = { fontSize: 13, fontWeight: 700, color: P.inkSoft, marginBottom: 8, display: 'block' };

  return (
    <PremiumPage>
      <style>{`
        @keyframes premium-shine {
          0%, 100% { opacity: 0.2; transform: scale(0.6) rotate(0deg); text-shadow: 0 0 2px rgba(91, 92, 255, 0.2); }
          50% { opacity: 0.9; transform: scale(1.2) rotate(45deg); text-shadow: 0 0 15px rgba(91, 92, 255, 1), 0 0 30px rgba(91, 92, 255, 0.6); }
        }
        .premium-star {
          position: absolute;
          color: ${P.primary};
          font-family: serif;
          pointer-events: none;
          z-index: 0;
          user-select: none;
          animation: premium-shine 4s ease-in-out infinite;
        }
      `}</style>
      
      {/* Premium Shining Stars */}
      <div className="premium-star" style={{ top: '10%', left: '8%', fontSize: '24px', animationDuration: '4s', animationDelay: '0s' }}>✦</div>
      <div className="premium-star" style={{ top: '25%', left: '88%', fontSize: '18px', animationDuration: '5s', animationDelay: '1s' }}>✦</div>
      <div className="premium-star" style={{ top: '55%', left: '4%', fontSize: '28px', animationDuration: '3.5s', animationDelay: '2s' }}>✦</div>
      <div className="premium-star" style={{ top: '85%', left: '15%', fontSize: '22px', animationDuration: '4.5s', animationDelay: '1.5s' }}>✦</div>
      <div className="premium-star" style={{ top: '35%', left: '78%', fontSize: '26px', animationDuration: '3.8s', animationDelay: '2.5s' }}>✦</div>

      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(20px)',
          borderRadius: P.radius,
          padding: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 24,
          marginBottom: 24,
          boxShadow: P.shadow,
          border: `1px solid rgba(255, 255, 255, 0.8)`,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'absolute', right: -100, top: -100, width: 300, height: 300, background: `radial-gradient(circle, ${P.primary}22 0%, transparent 70%)`, filter: 'blur(40px)', zIndex: 0 }} />
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, minWidth: 0, position: 'relative', zIndex: 1 }}>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', inset: -4, background: `linear-gradient(135deg, ${P.primary}, ${P.secondary})`, borderRadius: '50%', opacity: 0.5, filter: 'blur(8px)' }} />
            <img 
              style={{ width: 110, height: 110, borderRadius: '50%', border: '4px solid #fff', objectFit: 'cover', background: '#fff', position: 'relative', zIndex: 1, cursor: 'zoom-in' }} 
              src={profile.profilePhoto} 
              alt="Profile" 
              onClick={() => setShowPhotoViewer(true)}
            />
            <div style={{ position: 'absolute', bottom: 0, right: 0, width: 32, height: 32, background: P.green, borderRadius: '50%', border: '4px solid #fff', zIndex: 2 }} />
          </div>
          
          <div style={{ minWidth: 0 }}>
            <h1 style={{ margin: 0, fontSize: 32, fontWeight: 900, color: P.ink, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', fontFamily: P.font, letterSpacing: '-0.5px' }}>
              {profile.fullName} 
              <Badge color={P.blue} bg="rgba(79,140,255,0.1)">Verified</Badge>
            </h1>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 8, flexWrap: 'wrap' }}>
              <Badge color={P.green} bg="rgba(34,197,94,0.1)">{profile.status}</Badge>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: P.inkSoft, fontWeight: 600 }}>
                <MapPin size={16} /> {profile.location}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 12, fontSize: 14, color: P.inkMute, flexWrap: 'wrap' }}>
              {profile.experience && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Briefcase size={16}/> {profile.experience} Experience</span>
              )}
              {profile.college && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Building size={16}/> {profile.college}</span>
              )}
            </div>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: 12, position: 'relative', zIndex: 1 }}>
          <GradientButton onClick={handleDownloadResume} variant="primary">
            <FileText size={16} /> View Resume
          </GradientButton>
          <GradientButton onClick={() => {
            setFormData({
              fullName: profile.fullName,
              phone: profile.phone,
              college: profile.college,
              department: profile.department,
              knowledge: profile.knowledge,
              expertise: profile.expertise,
              experience: profile.experience,
              linkedin: profile.linkedin,
              profilePhoto: profile.profilePhoto !== 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200&h=200&fit=crop' ? profile.profilePhoto : ''
            });
            setIsEditing(true);
          }} variant="outline">
            <Edit2 size={16} /> Edit Profile
          </GradientButton>
        </div>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, marginBottom: 24 }}>
        {!isTrainer && !isCompany && (
          <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
              <h3 style={{ margin: '0 0 16px 0', fontSize: 20, fontWeight: 800, color: P.ink, display: 'flex', alignItems: 'center', gap: 10, fontFamily: P.font }}>
                <User size={20} color={P.primary} /> About Me
              </h3>
              <p style={{ fontSize: 14, color: P.inkSoft, lineHeight: 1.6, margin: 0 }}>
                {profile.about}
              </p>
            </div>
            
            <div>
              <h4 style={{ margin: '0 0 12px 0', fontSize: 14, fontWeight: 800, color: P.ink, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Skills & Knowledge</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {profile.knowledge ? profile.knowledge.split(',').map(s => s.trim()).map(s => (
                  <Badge key={s} color={P.primary} bg={`rgba(91,92,255,0.08)`}>{s}</Badge>
                )) : profile.skills.map((s) => (
                  <Badge key={s} color={P.primary} bg={`rgba(91,92,255,0.08)`}>{s}</Badge>
                ))}
              </div>
            </div>
          </GlassCard>
        )}

        <GlassCard>
          <h3 style={{ margin: '0 0 20px 0', fontSize: 20, fontWeight: 800, color: P.ink, display: 'flex', alignItems: 'center', gap: 10, fontFamily: P.font }}>
            {isCompany ? <Building size={20} color={P.blue} /> : <GraduationCap size={20} color={P.blue} />}
            {isCompany ? 'Company Details' : 'Professional & Academic Details'}
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {(isTrainer ? [
              { label: 'Expertise Area', value: profile.expertise || 'Not specified', icon: <Target size={16} /> },
              { label: 'Experience', value: profile.experience || 'Not specified', icon: <Briefcase size={16} /> },
              { label: 'LinkedIn', value: profile.linkedin || 'Not specified', icon: <Award size={16} /> },
            ] : isCompany ? [
              { label: 'Industry', value: user?.industry || 'Not specified', icon: <Target size={16} /> },
              { label: 'Company Size', value: user?.companySize || 'Not specified', icon: <Users size={16} /> },
              { label: 'Website', value: user?.website || 'Not specified', icon: <Building size={16} /> },
              { label: 'Contact Person', value: user?.hrName || 'Not specified', icon: <User size={16} /> },
            ] : [
              { label: 'College', value: profile.college, icon: <Building size={16} /> },
              { label: 'Department', value: profile.department, icon: <Award size={16} /> },
              { label: 'Register number', value: profile.registerNumber, icon: <FileText size={16} /> },
            ]).map((d) => (
              <div key={d.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 16, borderBottom: `1px solid ${P.border}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: P.inkMute, fontWeight: 600, fontSize: 13 }}>
                  {d.icon} {d.label}
                </div>
                <div style={{ fontWeight: 700, color: P.ink, fontSize: 14 }}>
                  {d.value}
                </div>
              </div>
            ))}
            
            {!isTrainer && !isCompany && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: P.inkMute, fontWeight: 600, fontSize: 13 }}>
                  <Award size={16} /> CGPA
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontWeight: 800, color: P.ink, fontSize: 16 }}>{profile.cgpa} <span style={{ color: P.inkMute, fontSize: 13, fontWeight: 600 }}>/ 10</span></span>
                  <Badge color={P.green} bg="rgba(34,197,94,0.1)">Excellent</Badge>
                </div>
              </div>
            )}
          </div>
        </GlassCard>
      </div>

      <GlassCard style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
        {isCompany ? (
          <div style={{ minWidth: 0, flex: 1 }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: 18, fontWeight: 800, color: P.ink, fontFamily: P.font }}>
              Company Platform Overview
            </h3>
            <p style={{ margin: 0, fontSize: 14, color: P.inkSoft, lineHeight: 1.6 }}>
              You are currently managing <strong style={{ color: P.ink }}>{user?.assignedCourses?.length || 0}</strong> active courses, <strong style={{ color: P.ink }}>{user?.assignedTrainers?.length || 0}</strong> trainers, and <strong style={{ color: P.ink }}>{user?.assignedStudents?.length || 0}</strong> students on the platform.
            </p>
          </div>
        ) : (
          <>
            <div style={{ position: 'relative', width: 80, height: 80, flexShrink: 0 }}>
              <svg width="80" height="80" viewBox="0 0 80 80" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="40" cy="40" r={radius} fill="none" stroke="rgba(91,92,255,0.1)" strokeWidth="8" />
                <motion.circle
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: offset }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  cx="40"
                  cy="40"
                  r={radius}
                  fill="none"
                  stroke={P.primary}
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeLinecap="round"
                />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, color: P.ink }}>
                {completion}%
              </div>
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <h3 style={{ margin: '0 0 6px 0', fontSize: 18, fontWeight: 800, color: P.ink, fontFamily: P.font }}>
                Profile Completion
              </h3>
              <p style={{ margin: 0, fontSize: 14, color: P.inkSoft, lineHeight: 1.6 }}>
                You're almost there! Complete your profile to get better recommendations and opportunities.
              </p>
            </div>
            <GradientButton variant="primary">
              Complete Profile
            </GradientButton>
          </>
        )}
      </GlassCard>

      {/* Cropper Modal */}
      <AnimatePresence>
        {showCropper && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              style={{ background: '#fff', borderRadius: P.radius, padding: 32, width: '100%', maxWidth: 450, boxShadow: P.shadowHover, border: `1px solid rgba(255,255,255,0.8)` }}
            >
              <h3 style={{ margin: '0 0 20px', fontSize: 20, fontWeight: 800, color: P.ink, fontFamily: P.font }}>Adjust Profile Photo</h3>
              <div style={{ position: 'relative', height: 300, background: '#1e293b', borderRadius: 16, overflow: 'hidden', marginBottom: 20 }}>
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape="round"
                  showGrid={false}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: P.inkSoft }}>Zoom:</span>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  onChange={(e) => setZoom(e.target.value)}
                  style={{ flex: 1 }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                <GradientButton variant="ghost" onClick={() => setShowCropper(false)}>Cancel</GradientButton>
                <GradientButton onClick={handleCropSave}>Confirm & Save</GradientButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditing && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              style={{ background: '#fff', borderRadius: P.radius, padding: 32, width: '100%', maxWidth: 550, maxHeight: '90vh', overflowY: 'auto', boxShadow: P.shadowHover, border: `1px solid rgba(255,255,255,0.8)` }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: P.ink, fontFamily: P.font }}>Edit Profile</h2>
                <button onClick={() => setIsEditing(false)} style={{ background: 'rgba(91,92,255,0.1)', border: 'none', width: 36, height: 36, borderRadius: 10, cursor: 'pointer', color: P.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={20}/></button>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32 }}>
                <div style={{ width: 88, height: 88, borderRadius: '50%', overflow: 'hidden', border: `4px solid rgba(91,92,255,0.2)`, position: 'relative', background: '#f8fafc', flexShrink: 0 }}>
                  {formData.profilePhoto ? (
                    <img src={formData.profilePhoto} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: P.inkMute }}><Camera size={24} /></div>
                  )}
                </div>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  style={{ display: 'none' }} 
                  ref={fileInputRef} 
                />
                <GradientButton onClick={() => fileInputRef.current.click()} variant="outline">
                  <Camera size={16} /> Choose New Photo
                </GradientButton>
              </div>

              <div style={{ display: 'grid', gap: 20 }}>
                <div>
                  <label style={labelStyle}>Full Name</label>
                  <input style={inputStyle} value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
                </div>
                <div>
                  <label style={labelStyle}>Phone Number</label>
                  <input style={inputStyle} value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                </div>
                
                {profile.role?.toLowerCase() === 'trainer' ? (
                  <>
                    <div>
                      <label style={labelStyle}>Expertise Area</label>
                      <select style={inputStyle} value={formData.expertise} onChange={(e) => setFormData({...formData, expertise: e.target.value})}>
                        <option value="">Select expertise</option>
                        <option value="Web Development">Web Development</option>
                        <option value="Data Science">Data Science</option>
                        <option value="Embedded Systems">Embedded Systems</option>
                        <option value="Mobile Development">Mobile Development</option>
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Years of Experience</label>
                      <input style={inputStyle} placeholder="e.g. 5 Years" value={formData.experience} onChange={(e) => setFormData({...formData, experience: e.target.value})} />
                    </div>
                    <div>
                      <label style={labelStyle}>LinkedIn URL</label>
                      <input style={inputStyle} placeholder="https://linkedin.com/..." value={formData.linkedin} onChange={(e) => setFormData({...formData, linkedin: e.target.value})} />
                    </div>
                  </>
                ) : profile.role?.toLowerCase() === 'company' ? (
                  <>
                    <div>
                      <label style={labelStyle}>Industry</label>
                      <input style={inputStyle} placeholder="e.g. Technology, Education" value={formData.industry} onChange={(e) => setFormData({...formData, industry: e.target.value})} />
                    </div>
                    <div>
                      <label style={labelStyle}>Company Size</label>
                      <input style={inputStyle} placeholder="e.g. 11-50 employees" value={formData.companySize} onChange={(e) => setFormData({...formData, companySize: e.target.value})} />
                    </div>
                    <div>
                      <label style={labelStyle}>Website</label>
                      <input style={inputStyle} placeholder="https://..." value={formData.website} onChange={(e) => setFormData({...formData, website: e.target.value})} />
                    </div>
                    <div>
                      <label style={labelStyle}>Contact Person (HR)</label>
                      <input style={inputStyle} placeholder="Full Name" value={formData.hrName} onChange={(e) => setFormData({...formData, hrName: e.target.value})} />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label style={labelStyle}>College</label>
                      <input style={inputStyle} value={formData.college} onChange={(e) => setFormData({...formData, college: e.target.value})} />
                    </div>
                    <div>
                      <label style={labelStyle}>Department</label>
                      <input style={inputStyle} value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} />
                    </div>
                    <div>
                      <label style={labelStyle}>Knowledge / Skills</label>
                      <input style={inputStyle} placeholder="e.g. React, Python, Data Science" value={formData.knowledge} onChange={(e) => setFormData({...formData, knowledge: e.target.value})} />
                    </div>
                  </>
                )}
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 32, paddingTop: 20, borderTop: `1px solid ${P.border}` }}>
                <GradientButton variant="ghost" onClick={() => setIsEditing(false)}>Cancel</GradientButton>
                <GradientButton onClick={handleSave}><Save size={16} /> Save Changes</GradientButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Photo Lightbox Viewer */}
      <AnimatePresence>
        {showPhotoViewer && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={() => setShowPhotoViewer(false)}
            style={{ 
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
              background: 'rgba(11, 16, 40, 0.85)', backdropFilter: 'blur(20px)', 
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
              zIndex: 9999, cursor: 'zoom-out' 
            }}
          >
            {/* Animated glowing backplate */}
            <motion.div
              drag
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              dragElastic={0.8}
              whileDrag={{ scale: 1.03, cursor: 'grabbing' }}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 120 }}
              style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'grab' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Radial gradient glow behind the photo */}
              <div style={{
                position: 'absolute', inset: -40,
                background: `radial-gradient(circle, ${P.primary}44 0%, ${P.secondary}22 50%, transparent 100%)`,
                filter: 'blur(50px)', zIndex: 0, pointerEvents: 'none'
              }} />

              {/* Main image container */}
              <div style={{
                position: 'relative', zIndex: 1,
                padding: 16, background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(30px)', border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '50%', boxShadow: '0 30px 80px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.1)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
              }}>
                <img 
                  src={profile.profilePhoto} 
                  alt="Profile Full View" 
                  style={{ 
                    width: '340px', height: '340px', 
                    borderRadius: '50%', objectFit: 'cover',
                    border: '4px solid rgba(255,255,255,0.8)',
                    boxShadow: '0 15px 40px rgba(0,0,0,0.4)',
                    background: '#fff'
                  }} 
                />
                
                {/* Floating User Info Plate - absolute positioned at bottom */}
                <div style={{
                  position: 'absolute', bottom: -20,
                  padding: '12px 32px', background: 'rgba(11,16,40,0.8)',
                  backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 30, textAlign: 'center',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
                  whiteSpace: 'nowrap'
                }}>
                  <div style={{ fontWeight: 800, fontSize: 18, color: '#fff', letterSpacing: '-0.3px', fontFamily: P.font }}>
                    {profile.fullName || 'User Profile'}
                  </div>
                  <div style={{ fontSize: 12, color: P.primary, fontWeight: 900, marginTop: 4, textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                    {profile.role || profile.status || 'Member'}
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.15)', borderColor: 'rgba(255,255,255,0.3)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowPhotoViewer(false)}
                style={{
                  marginTop: 24, width: 44, height: 44, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
                  color: '#fff', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', backdropFilter: 'blur(10px)', zIndex: 2, transition: 'border-color 0.2s'
                }}
              >
                ✕
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PremiumPage>
  );
}
