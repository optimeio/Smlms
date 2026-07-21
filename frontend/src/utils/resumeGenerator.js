import logoImg from '../assets/logo.png';

export const generatePremiumResume = (user, hidePrivateDetails = false) => {
  const printWindow = window.open('', '', 'width=1000,height=1200');
  
  // Fallbacks for arrays
  const skillsList = user.knowledge 
    ? user.knowledge.split(',').map(s => s.trim()) 
    : (user.skills || []);
  const skillsHtml = skillsList.map(s => `<span class="skill">${s}</span>`).join('');
  
  const isTrainer = user.role?.toLowerCase() === 'trainer';
  const trainerExpertise = user.expertise || user.specialization || 'Not specified';
  const trainerCourse = user.courseName || '';
  
  // High premium CSS styling
  printWindow.document.write(`
    <html>
      <head>
        <title>Resume - ${user.fullName}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;700;800&family=Inter:wght@400;500;600&display=swap');
          
          @page { size: A4 portrait; margin: 0; }
          body { 
            font-family: 'Inter', sans-serif;
            margin: 0; 
            padding: 0;
            color: #1e293b;
            background-color: #5b6274;
            display: flex;
            justify-content: center;
          }
          .resume {
            width: 210mm;
            min-height: 297mm;
            background: #ffffff;
            position: relative;
            box-shadow: 0 20px 50px rgba(0,0,0,0.5);
            display: flex;
            flex-direction: row;
            overflow: hidden;
          }
          
          /* Left Sidebar */
          .sidebar {
            width: 35%;
            background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
            color: #f8fafc;
            padding: 40px 30px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
          }
          
          .logo-container {
            background: #ffffff;
            padding: 15px;
            border-radius: 12px;
            text-align: center;
            margin-bottom: 40px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
          }
          .logo {
            width: 100%;
            max-width: 140px;
            object-fit: contain;
          }
          
          .sidebar-section { margin-bottom: 40px; }
          .sidebar-title {
            font-family: 'Outfit', sans-serif;
            font-size: 18px;
            font-weight: 700;
            color: #38bdf8;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 20px;
            border-bottom: 2px solid rgba(56, 189, 248, 0.2);
            padding-bottom: 8px;
          }
          
          .contact-item {
            margin-bottom: 16px;
            display: flex;
            flex-direction: column;
            gap: 4px;
          }
          .contact-label { font-size: 11px; color: #94a3b8; text-transform: uppercase; font-weight: 600; letter-spacing: 1px; }
          .contact-value { font-size: 14px; font-weight: 500; color: #f8fafc; word-break: break-all; }
          .private-badge {
            background: rgba(239, 68, 68, 0.2);
            color: #fca5a5;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
            display: inline-block;
            border: 1px solid rgba(239, 68, 68, 0.4);
          }
          
          /* Right Main Area */
          .main {
            width: 65%;
            padding: 50px 40px;
            box-sizing: border-box;
            background: #ffffff;
          }
          
          .header {
            margin-bottom: 40px;
          }
          .name {
            font-family: 'Outfit', sans-serif;
            font-size: 46px;
            font-weight: 800;
            color: #0f172a;
            margin: 0 0 5px 0;
            line-height: 1.1;
            letter-spacing: -0.5px;
          }
          .role {
            font-family: 'Outfit', sans-serif;
            font-size: 22px;
            font-weight: 500;
            color: #4c5fd5;
            margin: 0;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          
          .main-section {
            margin-bottom: 35px;
          }
          .main-title {
            font-family: 'Outfit', sans-serif;
            font-size: 24px;
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 15px;
          }
          .main-title::after {
            content: '';
            flex: 1;
            height: 2px;
            background: linear-gradient(90deg, #e2e8f0 0%, rgba(226, 232, 240, 0) 100%);
          }
          
          .about-text {
            font-size: 15px;
            line-height: 1.7;
            color: #475569;
            text-align: justify;
          }
          
          .timeline-item {
            position: relative;
            padding-left: 25px;
            margin-bottom: 25px;
            border-left: 2px solid #e2e8f0;
          }
          .timeline-item::before {
            content: '';
            position: absolute;
            left: -8px;
            top: 5px;
            width: 14px;
            height: 14px;
            background: #4c5fd5;
            border-radius: 50%;
            border: 3px solid #ffffff;
            box-shadow: 0 0 0 2px #e2e8f0;
          }
          .timeline-title { font-family: 'Outfit', sans-serif; font-size: 18px; font-weight: 700; color: #0f172a; margin: 0 0 4px 0; }
          .timeline-subtitle { font-size: 14px; font-weight: 600; color: #4c5fd5; margin: 0 0 8px 0; }
          .timeline-desc { font-size: 14px; color: #64748b; line-height: 1.6; margin: 0; }
          
          .skills-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
          }
          .skill {
            background: #f8fafc;
            color: #334155;
            padding: 8px 16px;
            border-radius: 30px;
            font-size: 13px;
            font-weight: 600;
            border: 1px solid #e2e8f0;
            box-shadow: 0 2px 4px rgba(0,0,0,0.02);
          }
          
        </style>
      </head>
      <body>
        <div class="resume">
          <!-- Sidebar -->
          <div class="sidebar">
            <div class="logo-container">
              <img class="logo" src="${window.location.origin}${logoImg}" alt="MBK Logo" onerror="this.style.display='none'" />
            </div>
            
            <div class="sidebar-section">
              <div class="sidebar-title">Contact</div>
              
              <div class="contact-item">
                <span class="contact-label">Email Address</span>
                ${hidePrivateDetails 
                  ? '<span class="private-badge">Hidden (Private)</span>' 
                  : `<span class="contact-value">${user.email || 'Not provided'}</span>`}
              </div>
              
              <div class="contact-item">
                <span class="contact-label">Phone Number</span>
                ${hidePrivateDetails 
                  ? '<span class="private-badge">Hidden (Private)</span>' 
                  : `<span class="contact-value">${user.phone || 'Not provided'}</span>`}
              </div>
              
              ${user.linkedin ? `
                <div class="contact-item">
                  <span class="contact-label">LinkedIn</span>
                  <span class="contact-value">${user.linkedin}</span>
                </div>
              ` : ''}
            </div>
            
            ${isTrainer ? `
            <div class="sidebar-section">
              <div class="sidebar-title">Expertise</div>
              <div class="contact-item">
                <span class="contact-label">Primary Area</span>
                <span class="contact-value" style="color: #38bdf8;">${trainerExpertise}</span>
              </div>
            </div>
            ` : `
            <div class="sidebar-section">
              <div class="sidebar-title">Academic Info</div>
              <div class="contact-item">
                <span class="contact-label">Institution</span>
                <span class="contact-value">${user.college || 'Not specified'}</span>
              </div>
              <div class="contact-item">
                <span class="contact-label">CGPA</span>
                <span class="contact-value" style="color: #38bdf8; font-size: 18px;">${user.cgpa || 'N/A'} / 10</span>
              </div>
            </div>
            `}
          </div>
          
          <!-- Main Area -->
          <div class="main">
            <div class="header">
              <h1 class="name">${user.fullName || 'Unknown'}</h1>
              <h2 class="role">${isTrainer ? (trainerExpertise !== 'Not specified' ? trainerExpertise : 'Professional Trainer') : (user.department || 'Student')}</h2>
            </div>
            
            ${user.about ? `
              <div class="main-section">
                <div class="main-title">Professional Summary</div>
                <div class="about-text">${user.about}</div>
              </div>
            ` : ''}
            
            <div class="main-section">
              <div class="main-title">Experience & Background</div>
              
              <div class="timeline-item">
                <h3 class="timeline-title">${user.experience || (isTrainer && trainerCourse ? trainerCourse : 'Entry Level / Fresher')}</h3>
                <h4 class="timeline-subtitle">${isTrainer && user.teachingMode ? user.teachingMode + ' Teaching' : 'Professional Experience'}</h4>
                <p class="timeline-desc">Specialized in delivering high-quality results, adapting to fast-paced environments, and consistently improving skillsets through continuous learning.</p>
              </div>
              
              ${!isTrainer && user.college ? `
                <div class="timeline-item">
                  <h3 class="timeline-title">${user.department || 'Degree Program'}</h3>
                  <h4 class="timeline-subtitle">${user.college}</h4>
                  <p class="timeline-desc">Register Number: ${user.registerNumber || 'N/A'}</p>
                </div>
              ` : ''}
            </div>
            
            <div class="main-section">
              <div class="main-title">Skills & Proficiencies</div>
              <div class="skills-grid">
                ${skillsHtml || '<span class="skill">Continuous Learner</span><span class="skill">Problem Solving</span>'}
              </div>
            </div>
            
          </div>
        </div>
      </body>
    </html>
  `);
  printWindow.document.close();
};
