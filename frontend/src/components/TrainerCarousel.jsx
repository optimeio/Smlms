import React from 'react';
import '../styles/TrainerCarousel.css';

const trainersRow1Static = [
  {
    id: 1,
    name: "Dr. Aravind Swamy",
    role: "Solid Works Specialist & CAD Lead",
    experience: "22+ Years Experience",
    avatarInitials: "AS",
    avatarBg: "linear-gradient(135deg, #FF6B00, #FF9E53)",
    skills: ["SolidWorks", "Catia", "CAD/CAM"],
    rating: "5.0",
    students: "1,800+"
  },
  {
    id: 2,
    name: "Meera Nair",
    role: "Senior Data Analyst & Mentor",
    experience: "12+ Years Experience",
    avatarInitials: "MN",
    avatarBg: "linear-gradient(135deg, #8B5CF6, #C084FC)",
    skills: ["Python", "SQL", "Tableau"],
    rating: "4.9",
    students: "950+"
  },
  {
    id: 3,
    name: "Vikram Malhotra",
    role: "CNC Programming & CAM Architect",
    experience: "20+ Years Experience",
    avatarInitials: "VM",
    avatarBg: "linear-gradient(135deg, #10B981, #34D399)",
    skills: ["CNC Programming", "Mastercam", "GD&T"],
    rating: "5.0",
    students: "1,400+"
  },
  {
    id: 4,
    name: "Sarah Jenkins",
    role: "AI & Machine Learning Lead",
    experience: "15+ Years Experience",
    avatarInitials: "SJ",
    avatarBg: "linear-gradient(135deg, #EC4899, #F472B6)",
    skills: ["PyTorch", "TensorFlow", "Deep Learning"],
    rating: "4.9",
    students: "1,120+"
  }
];

const trainersRow2Static = [
  {
    id: 5,
    name: "Deepak Sharma",
    role: "Product Design Consultant",
    experience: "18+ Years Experience",
    avatarInitials: "DS",
    avatarBg: "linear-gradient(135deg, #3B82F6, #60A5FA)",
    skills: ["AutoCAD", "Fusion 360", "Ansys"],
    rating: "4.9",
    students: "1,250+"
  },
  {
    id: 6,
    name: "Anjali Mehta",
    role: "Business Intelligence Specialist",
    experience: "10+ Years Experience",
    avatarInitials: "AM",
    avatarBg: "linear-gradient(135deg, #F59E0B, #FBBF24)",
    skills: ["Data Warehousing", "ETL", "Excel"],
    rating: "4.8",
    students: "820+"
  },
  {
    id: 7,
    name: "Karthik R.",
    role: "Tool & Die Engineering Expert",
    experience: "25+ Years Experience",
    avatarInitials: "KR",
    avatarBg: "linear-gradient(135deg, #EF4444, #F87171)",
    skills: ["Mold Design", "Press Tools", "Creo"],
    rating: "5.0",
    students: "2,200+"
  },
  {
    id: 8,
    name: "Lisa Thompson",
    role: "Cloud Architecture Mentor",
    experience: "14+ Years Experience",
    avatarInitials: "LT",
    avatarBg: "linear-gradient(135deg, #06B6D4, #22D3EE)",
    skills: ["AWS", "Azure", "DevOps"],
    rating: "4.8",
    students: "980+"
  }
];

const gradients = [
  "linear-gradient(135deg, #FF6B00, #FF9E53)",
  "linear-gradient(135deg, #8B5CF6, #C084FC)",
  "linear-gradient(135deg, #10B981, #34D399)",
  "linear-gradient(135deg, #EC4899, #F472B6)",
  "linear-gradient(135deg, #3B82F6, #60A5FA)",
  "linear-gradient(135deg, #F59E0B, #FBBF24)",
  "linear-gradient(135deg, #EF4444, #F87171)",
  "linear-gradient(135deg, #06B6D4, #22D3EE)"
];

export default function TrainerCarousel() {
  const row1 = trainersRow1Static;
  const row2 = trainersRow2Static;

  // Duplicate array contents for seamless infinite scrolling loop
  const duplicatedRow1 = [...row1, ...row1, ...row1, ...row1];
  const duplicatedRow2 = [...row2, ...row2, ...row2, ...row2];

  const renderCard = (trainer, idx) => (
    <div className="trainer-card-wrapper" key={`${trainer.id}-${idx}`}>
      <div className="trainer-card-inner">
        {/* Dynamic Glowing Background Effect */}
        <div className="trainer-glow-spot" style={{ background: trainer.avatarBg }}></div>
        
        <div className="trainer-card-header">
          <div className="trainer-avatar-glow" style={{ background: trainer.avatarBg, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {trainer.photo ? (
              <img src={trainer.photo} alt={trainer.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span>{trainer.avatarInitials}</span>
            )}
          </div>
          <div className="trainer-meta-info">
            <h4 className="trainer-card-name">{trainer.name}</h4>
            <div className="trainer-rating-wrapper">
              <span className="trainer-star">★</span>
              <span className="trainer-rating">{trainer.rating}</span>
              <span className="trainer-students">({trainer.students} students)</span>
            </div>
          </div>
        </div>

        <div className="trainer-card-body">
          <p className="trainer-card-role">{trainer.role}</p>
          <div className="trainer-exp-badge">
            <svg className="exp-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="7"/>
              <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
            </svg>
            <span>{trainer.experience}</span>
          </div>
        </div>

        <div className="trainer-skills-wrapper">
          {trainer.skills.map((skill, sIdx) => (
            <span key={sIdx} className="trainer-skill-tag">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <section className="trainer-carousel-section">
      <div className="landing-container">
        <div className="trainer-section-header">
          <div className="community-badge justify-center animate-pulse-badge">
            <span className="badge-arrow">⬦⬥⬦</span>
            <span className="badge-text">MEET OUR MENTORS</span>
            <span className="badge-line"></span>
          </div>
          <h2 className="trainer-section-title">
            Learn from <span className="highlight-text-blue">World-Class Experts</span>
          </h2>
          <p className="trainer-section-subtitle">
            Get trained by certified professionals with decades of industry experience in SolidWorks, CAD, Data Analysis, and emerging technologies.
          </p>
        </div>
      </div>

      <div className="marquee-outer-container">
        {/* Row 1: Scrolling Left */}
        <div className="marquee-track track-left">
          <div className="marquee-content animate-marquee-left">
            {duplicatedRow1.map((trainer, idx) => renderCard(trainer, idx))}
          </div>
        </div>

        {/* Row 2: Scrolling Right */}
        <div className="marquee-track track-right">
          <div className="marquee-content animate-marquee-right">
            {duplicatedRow2.map((trainer, idx) => renderCard(trainer, idx))}
          </div>
        </div>
      </div>
    </section>
  );
}
