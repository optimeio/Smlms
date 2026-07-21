import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

export default function Footer() {
  const [modalInfo, setModalInfo] = useState(null);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const footerSections = [
    {
      title: 'Quick Register',
      links: [
        { label: 'Student Register', to: '/register?type=student' },
        { label: 'Trainer Register', to: '/register?type=trainer' },
        { label: 'Company Register', to: '/register?type=company' }
      ]
    },
    {
      title: 'Support',
      links: [
        { label: 'WhatsApp Support', to: 'https://wa.me/918807653965', external: true },
        { label: 'Official YouTube', to: 'https://www.youtube.com/@MbkTechnology8', external: true }
      ]
    }
  ];

  const handleBottomLinkClick = (e, type) => {
    e.preventDefault();
    if (type === 'privacy') {
      setModalInfo({
        title: 'Privacy Policy',
        content: 'MBK Technology values your privacy. We collect and process user registration data solely for program enrollment, career development services, and placement verification. Your data is protected by industry standard encryption and will never be shared with unverified third parties.'
      });
    } else if (type === 'terms') {
      setModalInfo({
        title: 'Terms of Service',
        content: 'By using MBK Technology platforms, you agree to participate in learning activities with academic integrity. Trainers are expected to deliver courses with standard certifications, and company representatives agree to verify student placement applications in good faith.'
      });
    } else if (type === 'cookies') {
      setModalInfo({
        title: 'Cookie Settings',
        content: 'We use cookies to improve your user experience, remember your login state, and analyze website traffic. You can configure your browser to block cookies, but some platform features may become unavailable.'
      });
    }
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="back-to-top-container">
          <button onClick={scrollToTop} className="back-to-top-btn" aria-label="Back to top">
            <span className="arrow-up">↑</span> Back to Top
          </button>
        </div>

        <div className="footer-content">
          <motion.div
            className="footer-section about"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="footer-logo-container">
              <img src="/logo.png" alt="MBK Technology Logo" className="footer-logo-img" />
              <h2 className="footer-brand-name">MBK Technology</h2>
            </div>
            <p className="footer-description">
              IInd Floor, OM Shiva Towers, 259-B, Advaitha Ashram Rd, Fairlands, Salem, Tamil Nadu - 636004, India
            </p>
            <div className="footer-contact-info">
              <p className="footer-contact-item">
                <span className="contact-icon">📞</span> <a href="tel:+918807653965" className="contact-link">+91 88076 53965</a>
              </p>
              <p className="footer-contact-item">
                <span className="contact-icon">🌐</span> <a href="https://www.mbktechnologies.info" target="_blank" rel="noopener noreferrer" className="contact-link">www.mbktechnologies.info</a>
              </p>
            </div>
          </motion.div>

          {footerSections.map((section, index) => (
            <motion.div
              key={index}
              className="footer-section"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (index + 1) * 0.1 }}
            >
              <h3 className="footer-section-title">{section.title}</h3>
              <ul className="footer-links-list">
                {section.links.map((link, i) => (
                  <li key={i} className="footer-link-item">
                    {link.external ? (
                      <a href={link.to} target="_blank" rel="noopener noreferrer" className="footer-link">
                        <span className="link-arrow">›</span> {link.label}
                      </a>
                    ) : (
                      <Link to={link.to} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="footer-link">
                        <span className="link-arrow">›</span> {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>&copy; 2026 MBK Technology. All rights reserved.</p>
          </div>
          <div className="footer-links-bottom">
            <a href="#" onClick={(e) => handleBottomLinkClick(e, 'privacy')}>Privacy Policy</a>
            <a href="#" onClick={(e) => handleBottomLinkClick(e, 'terms')}>Terms of Service</a>
            <a href="#" onClick={(e) => handleBottomLinkClick(e, 'cookies')}>Cookie Settings</a>
          </div>
        </div>
      </div>

      {/* Interactive Footer Modal */}
      <AnimatePresence>
        {modalInfo && (
          <div className="footer-modal-overlay" onClick={() => setModalInfo(null)}>
            <motion.div
              className="footer-modal"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="footer-modal-header">
                <h3>{modalInfo.title}</h3>
                <button className="footer-modal-close" onClick={() => setModalInfo(null)}>&times;</button>
              </div>
              <div className="footer-modal-body">
                <p>{modalInfo.content}</p>
              </div>
              <div className="footer-modal-footer">
                <button className="footer-modal-btn" onClick={() => setModalInfo(null)}>Understand</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
}
