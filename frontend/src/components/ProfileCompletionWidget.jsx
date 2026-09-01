import { useNavigate } from 'react-router-dom';
import { useAuth } from '../state/useAuth';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { GlassCard, GradientButton, P } from './PremiumDesignSystem';

export default function ProfileCompletionWidget() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  // Determine required fields based on role
  let requiredFields = [];
  let rolePrefix = 'a'; // default student

  switch (user.role) {
    case 'Student':
      requiredFields = ['fullName', 'phone', 'college', 'department', 'profilePhoto'];
      rolePrefix = 'a';
      break;
    case 'Trainer':
      requiredFields = ['fullName', 'phone', 'knowledge', 'expertise', 'experience', 'profilePhoto'];
      rolePrefix = 'b';
      break;
    case 'Company':
      requiredFields = ['fullName', 'phone', 'industry', 'website', 'companySize', 'hrName', 'profilePhoto'];
      rolePrefix = 'c';
      break;
    case 'Super Admin':
    case 'Admin':
      // Admins usually don't need a profile completion widget
      return null;
    default:
      return null;
  }

  // Calculate completion percentage
  let filledFieldsCount = 0;
  for (const field of requiredFields) {
    if (user[field] && user[field].toString().trim() !== '') {
      filledFieldsCount++;
    }
  }

  const completionPercentage = Math.round((filledFieldsCount / requiredFields.length) * 100);

  // If fully complete, don't show the widget
  if (completionPercentage === 100) return null;

  return (
    <GlassCard hover={false} style={{ marginBottom: 32, padding: '24px 32px', background: 'linear-gradient(135deg, rgba(255, 92, 138, 0.05), rgba(91, 92, 255, 0.05))', border: `1px solid ${P.primary}33`, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{ background: `${P.primary}22`, color: P.primary, padding: 8, borderRadius: 12 }}>
              <AlertCircle size={24} />
            </div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: P.ink }}>Complete Your Profile</h3>
          </div>
          <p style={{ margin: 0, fontSize: 14, color: P.inkSoft, lineHeight: 1.5 }}>
            Your profile is only {completionPercentage}% complete. A complete profile helps us personalize your experience and provides better visibility across the platform.
          </p>
        </div>
        <GradientButton onClick={() => navigate(`/app/${rolePrefix}/profile`)}>
          Complete Profile Now <ArrowRight size={16} style={{ marginLeft: 6 }} />
        </GradientButton>
      </div>

      <div style={{ width: '100%', height: 8, background: 'rgba(0,0,0,0.05)', borderRadius: 4, overflow: 'hidden' }}>
        <div 
          style={{ 
            width: `${completionPercentage}%`, 
            height: '100%', 
            background: `linear-gradient(90deg, ${P.primary}, ${P.secondary})`,
            borderRadius: 4,
            transition: 'width 0.5s ease-in-out'
          }} 
        />
      </div>
    </GlassCard>
  );
}
