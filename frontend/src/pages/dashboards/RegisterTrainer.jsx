import { useState } from 'react';
import { useAuth } from '../../state/useAuth';
import { Sparkles, UserCheck } from 'lucide-react';
import { PremiumPage, PageHeader, GlassCard, GradientButton, P } from '../../components/PremiumDesignSystem';

export default function RegisterTrainer() {
  const { user } = useAuth();
  const [trainerForm, setTrainerForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    specialization: '',
    experience: '',
    teachingMode: 'Online',
    courseName: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleRegisterTrainer = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMsg('');
    
    // Validations
    const errs = {};
    if (!trainerForm.fullName || trainerForm.fullName.trim().length < 3) {
      errs.fullName = 'Trainer name must be at least 3 characters.';
    }
    if (!trainerForm.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trainerForm.email)) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!trainerForm.phone || !/^\d{10}$/.test(trainerForm.phone)) {
      errs.phone = 'Please enter a valid 10-digit mobile number.';
    }
    if (!trainerForm.password || trainerForm.password.length < 8) {
      errs.password = 'Password must be at least 8 characters.';
    }
    if (trainerForm.password !== trainerForm.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }
    
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...trainerForm,
          role: 'trainer',
          companyEmail: user?.email // pass company email to associate in DB
        })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Trainer registered successfully! They have been added to your directory.');
        setTrainerForm({
          fullName: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
          specialization: '',
          experience: '',
          teachingMode: 'Online',
          courseName: ''
        });
      } else {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setErrors({ general: data.message || 'Failed to register trainer.' });
        }
      }
    } catch (err) {
      setErrors({ general: 'Server error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const cardStyle = { background: '#fff', borderRadius: 18, border: '1px solid #e2e8f0', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' };
  const labelStyle = { fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 6, display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' };
  const inputSt = { width: '100%', padding: '12px 16px', borderRadius: 10, border: '1px solid #cbd5e1', fontSize: 14, color: '#1e293b', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' };
  const selectSt = { ...inputSt, appearance: 'none', background: 'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23475569\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'/%3E%3C/svg%3E") no-repeat right 16px center/16px' };
  const errorStyle = { fontSize: 12, color: '#ef4444', marginTop: 4, fontWeight: 600 };

  return (
    <PremiumPage>
      <PageHeader
        title="Register Trainer"
        subtitle="Create a new trainer profile and automatically assign them to your company."
        emoji="📝"
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 680, margin: '0 auto', marginTop: 12 }}>
        {successMsg && (
          <div style={{
            background: 'rgba(34,197,94,0.06)',
            color: '#10B981',
            border: '1px solid rgba(34,197,94,0.2)',
            padding: '16px 24px', borderRadius: 12, fontWeight: 700, fontSize: 14,
          }}>
            {successMsg}
          </div>
        )}
        
        {errors.general && (
          <div style={{
            background: 'rgba(239,68,68,0.06)',
            color: '#ef4444',
            border: '1px solid rgba(239,68,68,0.2)',
            padding: '16px 24px', borderRadius: 12, fontWeight: 700, fontSize: 14,
          }}>
            {errors.general}
          </div>
        )}

        <div style={cardStyle}>
          <form onSubmit={handleRegisterTrainer} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div>
                <label style={labelStyle}>Full Name</label>
                <input 
                  type="text" 
                  value={trainerForm.fullName} 
                  onChange={e => setTrainerForm({ ...trainerForm, fullName: e.target.value })} 
                  style={inputSt}
                  placeholder="e.g. Dr. Sarah Jenkins"
                />
                {errors.fullName && <div style={errorStyle}>{errors.fullName}</div>}
              </div>
              
              <div>
                <label style={labelStyle}>Email Address</label>
                <input 
                  type="email" 
                  value={trainerForm.email} 
                  onChange={e => setTrainerForm({ ...trainerForm, email: e.target.value })} 
                  style={inputSt}
                  placeholder="trainer@company.com"
                />
                {errors.email && <div style={errorStyle}>{errors.email}</div>}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div>
                <label style={labelStyle}>Mobile Number</label>
                <input 
                  type="tel" 
                  value={trainerForm.phone} 
                  onChange={e => setTrainerForm({ ...trainerForm, phone: e.target.value })} 
                  style={inputSt}
                  placeholder="10-digit number"
                />
                {errors.phone && <div style={errorStyle}>{errors.phone}</div>}
              </div>
              
              <div>
                <label style={labelStyle}>Expertise / Specialization</label>
                <input 
                  type="text" 
                  value={trainerForm.specialization} 
                  onChange={e => setTrainerForm({ ...trainerForm, specialization: e.target.value })} 
                  style={inputSt}
                  placeholder="e.g. React, Node.js, Python"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div>
                <label style={labelStyle}>Preferred Course Name</label>
                <input 
                  type="text" 
                  value={trainerForm.courseName} 
                  onChange={e => setTrainerForm({ ...trainerForm, courseName: e.target.value })} 
                  style={inputSt}
                  placeholder="e.g. Full Stack Web Development"
                />
              </div>
              
              <div>
                <label style={labelStyle}>Teaching Mode</label>
                <select 
                  value={trainerForm.teachingMode} 
                  onChange={e => setTrainerForm({ ...trainerForm, teachingMode: e.target.value })} 
                  style={selectSt}
                >
                  <option value="Online">Online Sessions</option>
                  <option value="Offline">Offline Classroom</option>
                  <option value="Hybrid">Hybrid Model</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div>
                <label style={labelStyle}>Password</label>
                <input 
                  type="password" 
                  value={trainerForm.password} 
                  onChange={e => setTrainerForm({ ...trainerForm, password: e.target.value })} 
                  style={inputSt}
                  placeholder="Min 8 chars, letters + numbers"
                />
                {errors.password && <div style={errorStyle}>{errors.password}</div>}
              </div>
              
              <div>
                <label style={labelStyle}>Confirm Password</label>
                <input 
                  type="password" 
                  value={trainerForm.confirmPassword} 
                  onChange={e => setTrainerForm({ ...trainerForm, confirmPassword: e.target.value })} 
                  style={inputSt}
                  placeholder="Repeat password"
                />
                {errors.confirmPassword && <div style={errorStyle}>{errors.confirmPassword}</div>}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
              <GradientButton 
                type="submit" 
                disabled={loading}
                style={{ opacity: loading ? 0.7 : 1, padding: '12px 32px' }}
              >
                {loading ? 'Registering...' : '✓ Register Trainer'}
              </GradientButton>
            </div>
          </form>
        </div>
      </div>
    </PremiumPage>
  );
}
