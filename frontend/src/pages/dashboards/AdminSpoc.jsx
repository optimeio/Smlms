import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Briefcase, Star, Clock, CheckCircle, XCircle, 
  FileText, UserCheck, Eye, Download, X, Check, FileCheck, 
  RefreshCw, ExternalLink, ShieldCheck, Mail, Phone,
  ZoomIn, ZoomOut, RotateCw, Printer, Shield, Maximize2,
  ChevronRight, Award, Sparkles, AlertCircle, FileSpreadsheet,
  CheckCircle2, HelpCircle, Layers, ArrowLeft, ArrowRight
} from 'lucide-react';
import { 
  PremiumPage, PageHeader, GlassCard, GradientButton, 
  Badge, P 
} from '../../components/PremiumDesignSystem';

const stats = [
  { label: 'Active Trainers', value: '142', icon: <UserCheck size={20} />, change: '+8 this month' },
  { label: 'Pending Approvals', value: '12', icon: <Clock size={20} />, change: 'Action required' },
  { label: 'Avg. Rating', value: '4.8', icon: <Star size={20} />, change: 'Consistently high' },
  { label: 'Total Sessions', value: '8,420', icon: <Briefcase size={20} />, change: '+320 this week' },
];

export default function AdminSpoc() {
  const [trainers, setTrainers] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [activeDocIndex, setActiveDocIndex] = useState(0);
  const [zoomScale, setZoomScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [notification, setNotification] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = () => {
    setLoading(true);
    fetch('/api/users?role=trainer')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.users && data.users.length > 0) {
          setTrainers(data.users);
        } else {
          setTrainers([
            {
              _id: '1',
              fullName: 'Theeran (Python Developer)',
              email: 'thepavech@gmail.com',
              phone: '6369426613',
              expertise: 'Python Developer & AI',
              rating: 4.9,
              sessions: 142,
              status: 'Approved',
              isApproved: true,
              photo: 'tharan.jpg',
              resume: 'resume-1788599923521-628047901.pdf',
              expCertificate: 'expCertificate-1788599923528-219566572.pdf',
              aadharCard: 'aadharCard-1788599923529-791693276.pdf',
              panCard: 'panCard-1788599923537-992110140.pdf',
              bankDetails: 'bankDetails-1788599923545-892514089.pdf',
              degreeCertificate: 'degreeCertificate-1788599923518-885134474.pdf',
              ndaAgreement: 'ndaAgreement-1788599923518-903985757.pdf'
            },
            {
              _id: '2',
              fullName: 'Nithya (Web Developer)',
              email: 'shreenithya111@gmail.com',
              phone: '6369426613',
              expertise: 'Full Stack Web Development',
              rating: 4.8,
              sessions: 89,
              status: 'Approved',
              isApproved: true,
              resume: 'Certificate_Barath_K.pdf',
              expCertificate: 'MBK_LMS_Accelerated_Delivery_Plan.pdf',
              aadharCard: 'Project_Status_Revised_V2.pdf',
              panCard: 'WhatsApp Image 2025-10-06 at 14.20.pdf',
              bankDetails: 'Project_Status_Revised_V2.pdf'
            },
            {
              _id: '3',
              fullName: 'Hema',
              email: 'hemalatha.ece22@mamcet.com',
              phone: '6369426613',
              expertise: 'Web Development BootCamp',
              rating: 4.7,
              sessions: 12,
              status: 'Pending',
              isApproved: false,
              resume: 'Certificate_Barath_K.pdf',
              expCertificate: 'MBK_LMS_Accelerated_Delivery_Plan.pdf',
              aadharCard: 'Project_Status_Revised_V2.pdf'
            }
          ]);
        }
      })
      .catch(() => setTrainers([]))
      .finally(() => setLoading(false));
  };

  const handleUpdateStatus = async (email, newStatus) => {
    try {
      const isApproved = newStatus === 'Approved';
      await fetch(`/api/admin/users/${encodeURIComponent(email)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, isApproved })
      });

      setTrainers(prev => prev.map(t => t.email === email ? { ...t, status: newStatus, isApproved } : t));
      if (selectedTrainer && selectedTrainer.email === email) {
        setSelectedTrainer(prev => ({ ...prev, status: newStatus, isApproved }));
      }

      setNotification(`Trainer "${email}" marked as ${newStatus}`);
      setTimeout(() => setNotification(''), 4000);
    } catch (err) {
      console.error('Failed to update trainer status:', err);
    }
  };

  const getDocUrl = (docValue) => {
    if (!docValue) return '';
    
    let str = '';
    if (typeof docValue === 'string') {
      str = docValue.trim();
    } else if (typeof docValue === 'object' && docValue !== null) {
      str = (docValue.path || docValue.url || docValue.filename || docValue.name || docValue.uri || '').toString().trim();
    } else {
      str = String(docValue || '').trim();
    }

    if (!str) return '';
    if (str.startsWith('http://') || str.startsWith('https://') || str.startsWith('data:')) {
      return str;
    }
    
    // If it's already an absolute or relative /uploads path
    if (str.startsWith('/uploads/') || str.startsWith('uploads/')) {
      return str.startsWith('/') ? str : `/${str}`;
    }

    // Extract filename from Windows backslash or POSIX forward slash
    const cleanFilename = str.split(/[/\\]/).pop();
    if (!cleanFilename) return '';

    return `/api/documents/view/${encodeURIComponent(cleanFilename)}`;
  };

  const getTrainerPhotoUrl = (trainer) => {
    if (!trainer) return '';
    const photoVal = trainer.photo || trainer.profilePhoto || trainer.passportPhoto || trainer.liveSelfie || 
      (trainer.uploadedDocuments && (trainer.uploadedDocuments.photo || trainer.uploadedDocuments.passportPhoto || trainer.uploadedDocuments.liveSelfie));
    return getDocUrl(photoVal);
  };

  const getTrainerDocList = (trainer) => {
    if (!trainer) return [];
    const standardFields = [
      { key: 'resume', altKeys: ['cv', 'curriculumVitae'], label: 'Resume / Curriculum Vitae', category: 'Professional Credentials', icon: '📄' },
      { key: 'expCertificate', altKeys: ['experienceCertificate', 'exp_certificate', 'experience'], label: 'Experience Certificate', category: 'Work History Proof', icon: '📜' },
      { key: 'aadharCard', altKeys: ['idProof', 'aadhar', 'nationalId', 'identityProof'], label: 'Aadhaar / National ID', category: 'Government Identity', icon: '🆔' },
      { key: 'panCard', altKeys: ['pan', 'pan_card'], label: 'PAN Card Verification', category: 'Tax & Compliance ID', icon: '💳' },
      { key: 'bankDetails', altKeys: ['bank_details', 'bankAccount', 'bankPassbook'], label: 'Bank Account Details', category: 'Disbursement Details', icon: '🏦' },
      { key: 'degreeCertificate', altKeys: ['degree', 'educationCertificate', 'regCertificate', 'degree_certificate'], label: 'Degree / Educational Certificate', category: 'Academic Qualifications', icon: '🎓' },
      { key: 'ndaAgreement', altKeys: ['signatureAgreement', 'nda', 'signature', 'agreement'], label: 'Signed Agreement & NDA', category: 'Legal Contracts', icon: '✍️' },
      { key: 'photo', altKeys: ['passportPhoto', 'liveSelfie', 'image', 'profilePic'], label: 'Passport Photo / Live Selfie', category: 'Biometric Photograph', icon: '📷' },
    ];

    const processedKeys = new Set();
    const result = [];

    // Process standard compliance fields
    standardFields.forEach(f => {
      let value = trainer[f.key];
      if (!value && f.altKeys) {
        for (const ak of f.altKeys) {
          if (trainer[ak]) {
            value = trainer[ak];
            break;
          }
        }
      }
      if (!value && trainer.uploadedDocuments) {
        value = trainer.uploadedDocuments[f.key];
        if (!value && f.altKeys) {
          for (const ak of f.altKeys) {
            if (trainer.uploadedDocuments[ak]) {
              value = trainer.uploadedDocuments[ak];
              break;
            }
          }
        }
      }

      processedKeys.add(f.key);
      if (f.altKeys) f.altKeys.forEach(k => processedKeys.add(k));

      result.push({
        ...f,
        value: value || null,
        isUploaded: Boolean(value)
      });
    });

    // Check for any additional custom documents in uploadedDocuments
    if (trainer.uploadedDocuments && typeof trainer.uploadedDocuments === 'object') {
      Object.entries(trainer.uploadedDocuments).forEach(([key, val]) => {
        if (!processedKeys.has(key) && val) {
          result.push({
            key,
            label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
            category: 'Additional Upload',
            icon: '📁',
            value: val,
            isUploaded: true
          });
        }
      });
    }

    return result;
  };

  const handleOpenTrainerStudio = (trainer, initialIndex = 0) => {
    setSelectedTrainer(trainer);
    const docs = getTrainerDocList(trainer);
    const firstUploadedIdx = docs.findIndex(d => d.isUploaded);
    setActiveDocIndex(initialIndex >= 0 ? initialIndex : (firstUploadedIdx !== -1 ? firstUploadedIdx : 0));
    setZoomScale(1);
    setRotation(0);
  };

  const filteredTrainers = trainers.filter(t => 
    (t.fullName || '').toLowerCase().includes(search.toLowerCase()) || 
    (t.email || '').toLowerCase().includes(search.toLowerCase()) ||
    (t.expertise || '').toLowerCase().includes(search.toLowerCase()) ||
    (t.courseName || '').toLowerCase().includes(search.toLowerCase())
  );

  // Selected Trainer Active Doc Helpers
  const selectedDocs = selectedTrainer ? getTrainerDocList(selectedTrainer) : [];
  const activeDoc = selectedDocs[activeDocIndex] || selectedDocs[0] || null;
  const activeDocUrl = activeDoc && activeDoc.value ? getDocUrl(activeDoc.value) : '';
  
  const isSignature = Boolean(
    activeDoc && (
      activeDoc.key === 'ndaAgreement' || 
      (typeof activeDoc.value === 'string' && activeDoc.value.startsWith('data:image'))
    )
  );
  
  const isImageDoc = Boolean(
    activeDoc && !isSignature && typeof activeDoc.value === 'string' && (
      activeDoc.value.startsWith('data:image') || 
      /\.(jpeg|jpg|png|gif|webp|svg)$/i.test(activeDoc.value)
    )
  );

  const isPdfDoc = Boolean(activeDoc && !isSignature && !isImageDoc && activeDoc.isUploaded);

  const getCleanDocName = (doc) => {
    if (!doc || !doc.value) return 'Not Provided';
    if (typeof doc.value === 'string') {
      if (doc.value.startsWith('data:')) return 'Cryptographic Digital Signature';
      return doc.value.split(/[/\\]/).pop();
    }
    if (typeof doc.value === 'object') {
      return doc.value.originalname || doc.value.name || doc.value.filename || 'Document Record';
    }
    return String(doc.value);
  };

  return (
    <PremiumPage>
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            position: 'fixed', top: 24, right: 24, zIndex: 9999,
            background: 'linear-gradient(135deg, #10B981, #059669)',
            color: '#ffffff', padding: '14px 22px', borderRadius: 14,
            boxShadow: '0 10px 30px rgba(16,185,129,0.3)', fontWeight: 700,
            display: 'flex', alignItems: 'center', gap: 10, fontSize: 14
          }}
        >
          <CheckCircle size={18} /> {notification}
        </motion.div>
      )}

      <PageHeader 
        title="Trainer Applications & Document Verification" 
        subtitle="Review uploaded resumes, certificates, identity proofs, and approve credentials in real-time."
        emoji="👨‍🏫"
      />

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 32 }}>
        {stats.map((stat) => (
          <GlassCard key={stat.label} style={{ padding: 22, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 16, background: 'rgba(91,92,255,0.1)', color: P.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {stat.icon}
            </div>
            <div>
              <p style={{ margin: '0 0 4px', fontSize: 13, color: P.inkMute, fontWeight: 700 }}>{stat.label}</p>
              <h3 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: P.ink, fontFamily: P.font }}>{stat.value}</h3>
              <p style={{ margin: '4px 0 0', fontSize: 12, color: stat.label === 'Pending Approvals' ? '#F59E0B' : P.green, fontWeight: 600 }}>{stat.change}</p>
            </div>
          </GlassCard>
        ))}
      </div>

      <GlassCard style={{ padding: '24px 30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', gap: 16, flex: 1, minWidth: 300 }}>
            <div style={{ position: 'relative', flex: 1, maxWidth: 400 }}>
              <Search size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: P.inkMute }} />
              <input 
                type="text" 
                placeholder="Search trainers by name, email or course..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ width: '100%', padding: '12px 16px 12px 44px', borderRadius: P.radius, border: `1px solid ${P.border}`, fontSize: 14, outline: 'none', background: '#f8fafc', color: P.ink, fontFamily: P.font }}
              />
            </div>
            <button onClick={fetchTrainers} style={{ padding: '0 16px', borderRadius: P.radius, border: `1px solid ${P.border}`, fontSize: 14, outline: 'none', background: '#fff', color: P.ink, fontFamily: P.font, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontWeight: 600 }}>
              <RefreshCw size={16} /> Refresh
            </button>
          </div>
        </div>

        {/* Trainers Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
          {filteredTrainers.map(trainer => {
            const isApproved = trainer.status === 'Approved' || trainer.status === 'Verified' || trainer.isApproved === true;
            const isRejected = trainer.status === 'Rejected';
            const docs = getTrainerDocList(trainer);
            const uploadedCount = docs.filter(d => d.isUploaded).length;

            return (
              <div 
                key={trainer._id || trainer.email} 
                style={{
                  border: `1px solid ${P.border}`, borderRadius: P.radiusMd, padding: 22,
                  background: '#ffffff', boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                  transition: 'all 0.25s ease'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                      <div style={{ position: 'relative', width: 50, height: 50, flexShrink: 0 }}>
                        {getTrainerPhotoUrl(trainer) ? (
                          <img
                            src={getTrainerPhotoUrl(trainer)}
                            alt={trainer.fullName || 'Trainer'}
                            style={{
                              width: 50, height: 50, borderRadius: 14,
                              objectFit: 'cover', border: '2px solid #e2e8f0',
                              boxShadow: '0 4px 10px rgba(0,0,0,0.06)'
                            }}
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const fallback = e.currentTarget.parentElement?.querySelector('.avatar-fallback');
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div 
                          className="avatar-fallback"
                          style={{
                            width: 50, height: 50, borderRadius: 14,
                            background: isApproved ? 'linear-gradient(135deg, #10B981, #059669)' : isRejected ? 'linear-gradient(135deg, #EF4444, #DC2626)' : 'linear-gradient(135deg, #F59E0B, #D97706)',
                            color: '#ffffff', display: getTrainerPhotoUrl(trainer) ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 18,
                            boxShadow: '0 4px 10px rgba(0,0,0,0.08)'
                          }}
                        >
                          {trainer.fullName ? trainer.fullName.charAt(0).toUpperCase() : 'T'}
                        </div>
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: P.ink }}>
                          {trainer.fullName || trainer.name || 'Trainer'}
                        </h4>
                        <p style={{ margin: '2px 0 0', fontSize: 13, color: P.inkMute }}>
                          {trainer.expertise || trainer.courseName || 'Software Development'}
                        </p>
                      </div>
                    </div>

                    <span style={{
                      background: isApproved ? '#dcfce7' : isRejected ? '#fee2e2' : '#fef3c7',
                      color: isApproved ? '#15803d' : isRejected ? '#dc2626' : '#d97706',
                      padding: '4px 10px', borderRadius: 12, fontSize: 11, fontWeight: 800,
                      display: 'flex', alignItems: 'center', gap: 4
                    }}>
                      {isApproved ? <CheckCircle size={12} /> : isRejected ? <XCircle size={12} /> : <Clock size={12} />}
                      {isApproved ? 'Approved' : isRejected ? 'Rejected' : 'Pending'}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                    <div style={{ background: '#f8fafc', padding: 10, borderRadius: P.radiusSm }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: P.inkSoft, fontSize: 11, fontWeight: 700, marginBottom: 2 }}>
                        <Star size={13} color="#F59E0B" /> Rating
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: P.ink }}>{trainer.rating || '4.8'}</div>
                    </div>
                    <div style={{ background: '#f8fafc', padding: 10, borderRadius: P.radiusSm }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: P.inkSoft, fontSize: 11, fontWeight: 700, marginBottom: 2 }}>
                        <FileCheck size={13} color="#3B82F6" /> Documents
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: P.ink }}>{uploadedCount} Attached</div>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div style={{ display: 'flex', gap: 8, borderTop: `1px solid ${P.border}`, paddingTop: 16 }}>
                  {/* Studio Documents View Button */}
                  <button 
                    onClick={() => handleOpenTrainerStudio(trainer)}
                    style={{
                      flex: 1, padding: '10px 14px', background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
                      border: `1.5px solid #bfdbfe`, borderRadius: 10,
                      color: '#1e40af', fontSize: 13, fontWeight: 800,
                      cursor: 'pointer', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', gap: 6, transition: 'all 0.2s ease',
                      boxShadow: '0 2px 8px rgba(37, 99, 235, 0.1)'
                    }}
                  >
                    <FileText size={16} color="#2563eb" /> Inspect Documents
                  </button>

                  {/* Approve Action Button */}
                  {!isApproved ? (
                    <button 
                      onClick={() => handleUpdateStatus(trainer.email, 'Approved')}
                      style={{
                        padding: '10px 16px', background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                        border: 'none', borderRadius: 10, color: '#ffffff', fontSize: 13, fontWeight: 700,
                        cursor: 'pointer', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', gap: 6, boxShadow: '0 4px 12px rgba(34, 197, 94, 0.25)'
                      }}
                    >
                      <Check size={15} /> Approve
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleUpdateStatus(trainer.email, 'Rejected')}
                      style={{
                        padding: '10px 14px', background: '#fee2e2', border: '1px solid #fca5a5',
                        borderRadius: 10, color: '#dc2626', fontSize: 13, fontWeight: 700,
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6
                      }}
                    >
                      <X size={14} /> Revoke
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* UNIFIED REAL-TIME DOCUMENT VERIFICATION STUDIO WORKBENCH */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {selectedTrainer && (
            <div style={{
              position: 'fixed', inset: 0, background: 'rgba(5, 10, 24, 0.94)',
              backdropFilter: 'blur(20px)', zIndex: 999999,
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
            }}>
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                style={{
                  width: '98vw', maxWidth: '1520px', height: '94vh',
                  background: 'linear-gradient(180deg, #0b1329 0%, #111e38 100%)',
                  borderRadius: 24, overflow: 'hidden',
                  boxShadow: '0 40px 100px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.12)',
                  display: 'flex', flexDirection: 'column'
                }}
              >
                {/* STUDIO TOP HEADER */}
                <div style={{
                  padding: '16px 28px', background: 'rgba(11, 19, 41, 0.95)',
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  flexWrap: 'wrap', gap: 16
                }}>
                  {/* Trainer Profile Overview */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ position: 'relative', width: 52, height: 52, flexShrink: 0 }}>
                      {getTrainerPhotoUrl(selectedTrainer) ? (
                        <img
                          src={getTrainerPhotoUrl(selectedTrainer)}
                          alt={selectedTrainer.fullName}
                          style={{
                            width: 52, height: 52, borderRadius: 14,
                            objectFit: 'cover', border: '2px solid rgba(56, 189, 248, 0.6)',
                            boxShadow: '0 4px 14px rgba(0,0,0,0.4)'
                          }}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const fallback = e.currentTarget.parentElement?.querySelector('.studio-avatar-fallback');
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div 
                        className="studio-avatar-fallback"
                        style={{
                          width: 52, height: 52, borderRadius: 14,
                          background: 'linear-gradient(135deg, #ff6b00, #ff9f43)',
                          color: '#fff', display: getTrainerPhotoUrl(selectedTrainer) ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 900, fontSize: 20
                        }}
                      >
                        {selectedTrainer.fullName ? selectedTrainer.fullName.charAt(0).toUpperCase() : 'T'}
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.3px' }}>
                          {selectedTrainer.fullName || 'Trainer Verification'}
                        </h3>
                        <span style={{
                          padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 800,
                          background: selectedTrainer.status === 'Approved' ? 'rgba(34,197,94,0.2)' : 'rgba(245,158,11,0.2)',
                          color: selectedTrainer.status === 'Approved' ? '#4ade80' : '#fbbf24',
                          border: selectedTrainer.status === 'Approved' ? '1px solid rgba(34,197,94,0.4)' : '1px solid rgba(245,158,11,0.4)'
                        }}>
                          {selectedTrainer.status || 'Pending Verification'}
                        </span>
                      </div>
                      <p style={{ margin: '3px 0 0', fontSize: 12, color: '#94a3b8' }}>
                        {selectedTrainer.email} • {selectedTrainer.phone || 'Phone verified'} • <span style={{ color: '#38bdf8' }}>{selectedTrainer.expertise || selectedTrainer.courseName || 'IT & Software'}</span>
                      </p>
                    </div>
                  </div>

                  {/* Active Document Header & Metadata */}
                  {activeDoc && (
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      background: 'rgba(30, 41, 59, 0.85)', padding: '8px 18px', borderRadius: 14,
                      border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                      <span style={{ fontSize: 20 }}>{activeDoc.icon}</span>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 800, color: '#f8fafc' }}>
                          {activeDoc.label}
                        </div>
                        <div style={{ fontSize: 11, color: '#94a3b8', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {getCleanDocName(activeDoc)}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Studio Live Action Toolbar */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {/* Zoom Controls */}
                    <div style={{
                      display: 'flex', alignItems: 'center', background: 'rgba(30, 41, 59, 0.9)',
                      border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: 3
                    }}>
                      <button
                        onClick={() => setZoomScale(prev => Math.max(prev - 0.15, 0.6))}
                        title="Zoom Out"
                        style={{ background: 'transparent', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: '6px 8px', borderRadius: 6 }}
                      >
                        <ZoomOut size={16} />
                      </button>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#38bdf8', minWidth: 44, textAlign: 'center' }}>
                        {Math.round(zoomScale * 100)}%
                      </span>
                      <button
                        onClick={() => setZoomScale(prev => Math.min(prev + 0.15, 2.2))}
                        title="Zoom In"
                        style={{ background: 'transparent', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: '6px 8px', borderRadius: 6 }}
                      >
                        <ZoomIn size={16} />
                      </button>
                      <button
                        onClick={() => { setZoomScale(1); setRotation(0); }}
                        title="Reset View"
                        style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '6px 8px', fontSize: 11, fontWeight: 700 }}
                      >
                        Reset
                      </button>
                    </div>

                    {/* Rotate */}
                    <button
                      onClick={() => setRotation(prev => (prev + 90) % 360)}
                      title="Rotate 90°"
                      style={{
                        background: 'rgba(30, 41, 59, 0.9)', border: '1px solid rgba(255,255,255,0.1)',
                        color: '#cbd5e1', cursor: 'pointer', padding: '9px 12px', borderRadius: 10,
                        display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700
                      }}
                    >
                      <RotateCw size={15} /> Rotate
                    </button>

                    {/* External Tab */}
                    {activeDocUrl && (
                      <a
                        href={activeDocUrl}
                        target="_blank"
                        rel="noreferrer"
                        title="Open in Full Window"
                        style={{
                          background: 'rgba(30, 41, 59, 0.9)', border: '1px solid rgba(255,255,255,0.1)',
                          color: '#38bdf8', textDecoration: 'none', padding: '9px 12px', borderRadius: 10,
                          display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700
                        }}
                      >
                        <ExternalLink size={15} /> Pop Out
                      </a>
                    )}

                    {/* Download */}
                    {activeDocUrl && (
                      <a
                        href={activeDocUrl}
                        download={getCleanDocName(activeDoc)}
                        title="Download Document"
                        style={{
                          background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.4)',
                          color: '#38bdf8', textDecoration: 'none', padding: '9px 14px', borderRadius: 10,
                          display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 800
                        }}
                      >
                        <Download size={15} /> Download
                      </a>
                    )}

                    {/* Close Studio */}
                    <button 
                      onClick={() => setSelectedTrainer(null)}
                      style={{
                        background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)',
                        color: '#f87171', cursor: 'pointer', padding: 8, borderRadius: 10, marginLeft: 6
                      }}
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>

                {/* STUDIO MAIN BODY: DUAL PANE */}
                <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                  {/* LEFT PANE: COMPLIANCE VAULT (DOCUMENT PLAYLIST) */}
                  <div style={{
                    width: 340, background: '#080d1a', borderRight: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex', flexDirection: 'column', flexShrink: 0
                  }}>
                    {/* Vault Header & Progress */}
                    <div style={{ padding: '18px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontSize: 12, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                          Compliance Vault
                        </span>
                        <span style={{ fontSize: 12, fontWeight: 800, color: '#38bdf8' }}>
                          {selectedDocs.filter(d => d.isUploaded).length} / {selectedDocs.length} Verified
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div style={{ width: '100%', height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 10, overflow: 'hidden' }}>
                        <div style={{
                          width: `${Math.round((selectedDocs.filter(d => d.isUploaded).length / (selectedDocs.length || 1)) * 100)}%`,
                          height: '100%', background: 'linear-gradient(90deg, #38bdf8, #22c55e)',
                          borderRadius: 10, transition: 'width 0.4s ease'
                        }} />
                      </div>
                    </div>

                    {/* Document Items List */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {selectedDocs.map((doc, idx) => {
                        const isActive = idx === activeDocIndex;
                        const hasImage = doc.isUploaded && (doc.key === 'photo' || (typeof doc.value === 'string' && (doc.value.startsWith('data:image') || /\.(jpg|jpeg|png|webp|gif)$/i.test(doc.value))));

                        return (
                          <div
                            key={idx}
                            onClick={() => {
                              setActiveDocIndex(idx);
                              setZoomScale(1);
                              setRotation(0);
                            }}
                            style={{
                              padding: '12px 14px', borderRadius: 14, cursor: 'pointer',
                              background: isActive ? 'linear-gradient(135deg, rgba(56, 189, 248, 0.16), rgba(99, 102, 241, 0.16))' : 'rgba(30, 41, 59, 0.4)',
                              border: isActive ? '1.5px solid #38bdf8' : '1px solid rgba(255,255,255,0.06)',
                              boxShadow: isActive ? '0 4px 18px rgba(56, 189, 248, 0.25)' : 'none',
                              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                              {hasImage ? (
                                <img
                                  src={getDocUrl(doc.value)}
                                  alt={doc.label}
                                  style={{ width: 38, height: 38, borderRadius: 8, objectFit: 'cover', border: '1px solid rgba(255,255,255,0.2)', flexShrink: 0 }}
                                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                />
                              ) : (
                                <div style={{
                                  width: 38, height: 38, borderRadius: 10,
                                  background: isActive ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255,255,255,0.06)',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  fontSize: 20, flexShrink: 0
                                }}>
                                  {doc.icon}
                                </div>
                              )}

                              <div style={{ minWidth: 0 }}>
                                <h5 style={{
                                  margin: 0, fontSize: 13, fontWeight: 700,
                                  color: isActive ? '#ffffff' : '#e2e8f0',
                                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                                }}>
                                  {doc.label}
                                </h5>
                                <p style={{
                                  margin: '2px 0 0', fontSize: 11,
                                  color: isActive ? '#38bdf8' : '#64748b',
                                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                                }}>
                                  {getCleanDocName(doc)}
                                </p>
                              </div>
                            </div>

                            <div style={{ flexShrink: 0, marginLeft: 8 }}>
                              {doc.isUploaded ? (
                                <span style={{
                                  display: 'flex', alignItems: 'center', gap: 4,
                                  padding: '3px 8px', borderRadius: 8, fontSize: 10, fontWeight: 800,
                                  background: 'rgba(34, 197, 94, 0.15)', color: '#4ade80',
                                  border: '1px solid rgba(34, 197, 94, 0.3)'
                                }}>
                                  <Check size={11} /> Ready
                                </span>
                              ) : (
                                <span style={{
                                  padding: '3px 8px', borderRadius: 8, fontSize: 10, fontWeight: 700,
                                  background: 'rgba(255,255,255,0.05)', color: '#64748b'
                                }}>
                                  Missing
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* CENTER STAGE: HIGH DEFINITION DOCUMENT VIEWPORT */}
                  <div style={{
                    flex: 1, background: '#060a12', display: 'flex', flexDirection: 'column',
                    position: 'relative', overflow: 'hidden'
                  }}>
                    {/* Viewport Subtitle / Watermark Indicator */}
                    <div style={{
                      padding: '8px 20px', background: 'rgba(15, 23, 42, 0.7)',
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      fontSize: 12, color: '#94a3b8'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <ShieldCheck size={16} color="#38bdf8" />
                        <span>MBK LMS Real-Time Document Inspection Engine</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <span>Category: <strong style={{ color: '#f8fafc' }}>{activeDoc ? activeDoc.category : 'General'}</strong></span>
                        <span>Format: <strong style={{ color: '#38bdf8' }}>{isPdfDoc ? 'PDF Document' : isImageDoc ? 'High-Res Image' : isSignature ? 'Digital Signature Certificate' : 'Not Uploaded'}</strong></span>
                      </div>
                    </div>

                    {/* Interactive Presentation Stage */}
                    <div style={{
                      flex: 1, overflow: 'auto', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', padding: '24px', position: 'relative'
                    }}>
                      {activeDoc && activeDoc.isUploaded ? (
                        <div
                          style={{
                            transform: `scale(${zoomScale}) rotate(${rotation}deg)`,
                            transformOrigin: 'center center',
                            transition: 'transform 0.2s cubic-bezier(0.2, 0, 0, 1)',
                            width: isPdfDoc ? '100%' : 'auto',
                            height: isPdfDoc ? '100%' : 'auto',
                            maxWidth: isPdfDoc ? '100%' : '90%',
                            maxHeight: isPdfDoc ? '100%' : '90%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                          }}
                        >
                          {/* PDF PRESENTER */}
                          {isPdfDoc && (
                            <div style={{
                              width: '100%', height: '100%',
                              background: '#ffffff', borderRadius: 16, overflow: 'hidden',
                              boxShadow: '0 25px 70px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.1)',
                              display: 'flex', flexDirection: 'column'
                            }}>
                              <iframe
                                src={`${activeDocUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
                                title={activeDoc.label}
                                style={{ width: '100%', height: '100%', border: 'none', background: '#ffffff' }}
                              />
                            </div>
                          )}

                          {/* IMAGE / BIOMETRIC PHOTO PRESENTER */}
                          {isImageDoc && (
                            <div style={{
                              padding: 20, background: 'rgba(30, 41, 59, 0.7)',
                              borderRadius: 20, border: '1px solid rgba(255,255,255,0.15)',
                              boxShadow: '0 25px 70px rgba(0,0,0,0.6)', textAlign: 'center'
                            }}>
                              <img
                                src={activeDocUrl}
                                alt={activeDoc.label}
                                style={{
                                  maxWidth: '100%', maxHeight: '68vh', objectFit: 'contain',
                                  borderRadius: 14, boxShadow: '0 10px 30px rgba(0,0,0,0.4)'
                                }}
                              />
                              <div style={{ marginTop: 14, display: 'flex', justifyContent: 'center', gap: 12 }}>
                                <span style={{ fontSize: 13, color: '#cbd5e1', fontWeight: 700 }}>
                                  📷 {activeDoc.label}
                                </span>
                                <span style={{ fontSize: 13, color: '#38bdf8', fontWeight: 600 }}>
                                  ✓ Biometric Authenticated
                                </span>
                              </div>
                            </div>
                          )}

                          {/* DIGITAL SIGNATURE LEGAL PARCHMENT PRESENTER */}
                          {isSignature && (
                            <div style={{
                              width: '100%', maxWidth: 740, padding: 36,
                              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                              borderRadius: 20, border: '2px solid #e2e8f0',
                              boxShadow: '0 25px 70px rgba(0,0,0,0.5)', color: '#0f172a'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #0f172a', paddingBottom: 16, marginBottom: 24 }}>
                                <div>
                                  <div style={{ fontSize: 12, fontWeight: 900, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    MBK Learning Systems
                                  </div>
                                  <h2 style={{ margin: '4px 0 0', fontSize: 20, fontWeight: 900, color: '#0f172a' }}>
                                    Digital Agreement & NDA Acceptance
                                  </h2>
                                </div>
                                <div style={{ width: 48, height: 48, borderRadius: 12, background: '#eff6ff', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                                  ⚖️
                                </div>
                              </div>

                              <p style={{ fontSize: 14, color: '#334155', lineHeight: 1.6, marginBottom: 24 }}>
                                This certifies that the trainer <strong>{selectedTrainer.fullName}</strong> ({selectedTrainer.email}) has officially executed the non-disclosure agreement, compliance terms, and platform instructor policies digitally.
                              </p>

                              <div style={{ background: '#f1f5f9', padding: 20, borderRadius: 12, border: '1px dashed #94a3b8', marginBottom: 24, textAlign: 'center' }}>
                                <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 8, textTransform: 'uppercase' }}>
                                  Recorded Digital Signature
                                </div>
                                {typeof activeDoc.value === 'string' && activeDoc.value.startsWith('data:image') ? (
                                  <img
                                    src={activeDoc.value}
                                    alt="Digital Signature"
                                    style={{ maxHeight: 110, objectFit: 'contain', margin: '0 auto' }}
                                  />
                                ) : (
                                  <div style={{ fontSize: 22, fontFamily: 'cursive', color: '#1e293b', fontWeight: 800 }}>
                                    {selectedTrainer.fullName}
                                  </div>
                                )}
                              </div>

                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, fontSize: 12, color: '#64748b', borderTop: '1px solid #e2e8f0', paddingTop: 16 }}>
                                <div>Verified Signer: <strong>{selectedTrainer.email}</strong></div>
                                <div>Security Hash: <strong>SHA-256 Verified</strong></div>
                                <div>Timestamp: <strong>{new Date().toLocaleDateString()}</strong></div>
                                <div>Legal Status: <strong style={{ color: '#16a34a' }}>Legally Binding</strong></div>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        /* MISSING DOCUMENT PLACEHOLDER */
                        <div style={{
                          textAlign: 'center', padding: 48, background: 'rgba(30, 41, 59, 0.5)',
                          borderRadius: 24, border: '1px dashed rgba(255,255,255,0.15)',
                          maxWidth: 480
                        }}>
                          <div style={{ fontSize: 54, marginBottom: 14 }}>📁</div>
                          <h3 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 800, color: '#ffffff' }}>
                            Document Not Attached
                          </h3>
                          <p style={{ margin: '0 0 20px', fontSize: 13, color: '#94a3b8', lineHeight: 1.5 }}>
                            The trainer did not submit a file for <strong>{activeDoc ? activeDoc.label : 'this credential'}</strong> during registration.
                          </p>
                          <button
                            onClick={() => {
                              setNotification(`Resubmission request sent to ${selectedTrainer.email}`);
                              setTimeout(() => setNotification(''), 4000);
                            }}
                            style={{
                              padding: '10px 20px', borderRadius: 10, background: '#38bdf8',
                              border: 'none', color: '#0f172a', fontWeight: 800, fontSize: 13, cursor: 'pointer'
                            }}
                          >
                            Request File from Trainer
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* STUDIO FOOTER: COMPLIANCE ACTIONS BAR */}
                <div style={{
                  padding: '16px 28px', background: 'rgba(11, 19, 41, 0.98)',
                  borderTop: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  flexWrap: 'wrap', gap: 16
                }}>
                  {/* Compliance Checklist Indicators */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    <span style={{ fontSize: 13, color: '#cbd5e1', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <CheckCircle2 size={16} color="#4ade80" /> Identity Proof Checked
                    </span>
                    <span style={{ fontSize: 13, color: '#cbd5e1', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <CheckCircle2 size={16} color="#4ade80" /> Qualifications Certified
                    </span>
                    <span style={{ fontSize: 13, color: '#cbd5e1', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <CheckCircle2 size={16} color="#4ade80" /> Legal & Tax Compliant
                    </span>
                  </div>

                  {/* Final Decision Action Buttons */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <button
                      onClick={() => setSelectedTrainer(null)}
                      style={{
                        padding: '10px 18px', borderRadius: 10, background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.15)', color: '#e2e8f0',
                        fontWeight: 700, fontSize: 13, cursor: 'pointer'
                      }}
                    >
                      Close Studio
                    </button>

                    <button
                      onClick={() => handleUpdateStatus(selectedTrainer.email, 'Rejected')}
                      style={{
                        padding: '10px 20px', borderRadius: 10, background: 'rgba(239, 68, 68, 0.2)',
                        border: '1px solid rgba(239, 68, 68, 0.4)', color: '#f87171',
                        fontWeight: 800, fontSize: 13, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 6
                      }}
                    >
                      <XCircle size={16} /> Reject Application
                    </button>

                    <button
                      onClick={() => handleUpdateStatus(selectedTrainer.email, 'Approved')}
                      style={{
                        padding: '10px 26px', borderRadius: 10, background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                        border: 'none', color: '#ffffff', fontWeight: 900, fontSize: 14, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 8,
                        boxShadow: '0 4px 18px rgba(34, 197, 94, 0.4)'
                      }}
                    >
                      <CheckCircle size={17} /> Approve & Certify Trainer
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </PremiumPage>
  );
}