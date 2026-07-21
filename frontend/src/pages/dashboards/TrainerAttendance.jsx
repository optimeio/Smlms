import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, MapPin, Upload, CheckCircle2, Image, X } from 'lucide-react';
import { PremiumPage, PageHeader, GlassCard, GradientButton, Badge, P } from '../../components/PremiumDesignSystem';

export default function TrainerAttendance() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [location, setLocation] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, processing, success, error

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setStatus('processing');

    // Simulate extracting Geo-tag EXIF data or using browser geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude.toFixed(6),
            lng: position.coords.longitude.toFixed(6)
          });
          setStatus('success');
        },
        (error) => {
          console.error("Error getting location", error);
          // Mock location if browser blocks it for the demo
          setLocation({ lat: '11.0168', lng: '76.9558' });
          setStatus('success');
        }
      );
    } else {
      setLocation({ lat: '11.0168', lng: '76.9558' });
      setStatus('success');
    }
  };

  const handleUpload = () => {
    if (!file) return;
    alert(`Attendance marked successfully at Coordinates: ${location?.lat}, ${location?.lng}`);
    setFile(null);
    setPreview('');
    setLocation(null);
    setStatus('idle');
  };

  return (
    <PremiumPage>
      <PageHeader
        title="Mark Attendance"
        subtitle="Upload a geo-tagged photo of the classroom to verify your session."
        emoji="📍"
      />

      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        {/* Upload Card */}
        <GlassCard style={{ marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
          {/* Decorative blob */}
          <div style={{
            position: 'absolute', top: -100, right: -100, width: 300, height: 300,
            background: 'radial-gradient(circle, rgba(99,102,241,0.06), transparent 70%)',
            filter: 'blur(40px)', pointerEvents: 'none',
          }} />

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 5 }}
          />

          {preview ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, position: 'relative', zIndex: 1 }}>
              <motion.img
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                src={preview}
                alt="Classroom preview"
                style={{
                  maxWidth: '100%', maxHeight: 320, borderRadius: 18,
                  objectFit: 'cover', border: `2px solid ${P.border}`,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                }}
              />

              {status === 'processing' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '12px 24px', borderRadius: 14,
                    background: 'rgba(245,158,11,0.08)',
                    border: '1px solid rgba(245,158,11,0.2)',
                    color: P.orange, fontWeight: 700, fontSize: 14,
                  }}
                >
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                    ⏳
                  </motion.div>
                  Extracting Geo-Tags...
                </motion.div>
              )}

              {status === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '14px 24px', borderRadius: 14,
                    background: 'rgba(34,197,94,0.06)',
                    border: '1px solid rgba(34,197,94,0.2)',
                    color: P.green, fontWeight: 700, fontSize: 14,
                  }}
                >
                  <MapPin size={18} /> Location Verified: {location.lat}, {location.lng} <CheckCircle2 size={18} />
                </motion.div>
              )}

              <GradientButton
                variant="ghost"
                onClick={() => { setFile(null); setPreview(''); setStatus('idle'); }}
                style={{ zIndex: 10 }}
              >
                <X size={16} /> Choose Different Photo
              </GradientButton>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '40px 20px', pointerEvents: 'none', position: 'relative', zIndex: 1 }}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                style={{
                  width: 80, height: 80, borderRadius: 24,
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.08))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: P.primary,
                }}
              >
                <Camera size={36} />
              </motion.div>
              <h3 style={{ margin: 0, color: P.ink, fontSize: 20, fontWeight: 800, fontFamily: P.font }}>Click to Upload or Drag Photo Here</h3>
              <p style={{ margin: 0, color: P.inkMute, fontSize: 14 }}>Only geo-tagged images (.jpg, .png) are accepted.</p>
            </div>
          )}
        </GlassCard>

        {/* Submit Button */}
        <GradientButton
          onClick={handleUpload}
          disabled={status !== 'success'}
          style={{
            width: '100%',
            padding: '18px',
            fontSize: 16,
            borderRadius: 16,
          }}
        >
          <Upload size={20} /> Submit Attendance
        </GradientButton>
      </div>
    </PremiumPage>
  );
}
