import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import '../styles/Features.css';

export default function Features() {
  const competencies = [
    {
      icon: '⚙️',
      title: 'Engineering Excellence',
      description: 'Precision mechanical engineering and energy technology solutions'
    },
    {
      icon: '📈',
      title: 'Strategic Brand Management',
      description: 'Strengthening brand presence and operations across Tamil Nadu'
    },
    {
      icon: '🌱',
      title: 'Sustainable Innovation',
      description: 'Pioneering clean energy technology and resource optimization'
    },
  ];

  const animateVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <>
      {/* Register Section */}
      <section className="register-section" style={{ padding: '80px 20px', background: 'var(--off-white)', textAlign: 'center' }}>
        <h2 className="section-title" style={{ fontSize: '32px', marginBottom: '20px' }}>Start Your Career Journey</h2>
        <p className="section-subtitle" style={{ fontSize: '18px', marginBottom: '30px', color: 'var(--gray-600)' }}>
          Join thousands of students and leading business partners connecting through MBK Carrierz. Discover training programs, internships, and placement opportunities.
        </p>
        <ul style={{ listStyle: 'none', padding: 0, marginBottom: '30px', fontSize: '16px', color: 'var(--gray-700)' }}>
          <li>✓ Verified Employers & Corporate Partners</li>
          <li>✓ Industry Standard Training & Certification</li>
          <li>✓ Placement Pipelines & Career Mentorship</li>
        </ul>
        <div className="register-buttons" style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
          <Link to="/register?type=student" className="btn btn-primary">Student Register</Link>
          <Link to="/register?type=trainer" className="btn btn-primary">Trainer Register</Link>
          <Link to="/register?type=company" className="btn btn-primary">Company Register</Link>
        </div>
      </section>

      {/* Competencies Section */}
      <section className="features-section" id="competencies">
        <div className="features-header">
          <h2 className="section-title">Core Competencies</h2>
          <p className="section-subtitle">Driving growth and transforming industry standards through strategic innovation</p>
        </div>
        <div className="features-grid">
          {competencies.map((comp, index) => (
            <motion.div
              key={index}
              className="feature-card"
              variants={animateVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ y: -6 }}
            >
              <div className="feature-icon">{comp.icon}</div>
              <h3 className="feature-title">{comp.title}</h3>
              <p className="feature-description">{comp.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}
