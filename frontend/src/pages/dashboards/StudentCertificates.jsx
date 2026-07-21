import React from 'react';
import { useAuth } from '../../state/useAuth';
import { Download, Award, Share2, Eye, ShieldCheck, Calendar } from 'lucide-react';
import { PremiumPage, PageHeader, GlassCard, GradientButton, Badge, EmptyState, P } from '../../components/PremiumDesignSystem';

export default function StudentCertificates() {
  const { user } = useAuth();
  const completedCourses = user?.completedCourses || [];

  const handlePrint = (courseTitle) => {
    const printWindow = window.open('', '', 'width=1000,height=700');
    printWindow.document.write(`
      <html>
        <head>
          <title>Certificate - ${courseTitle}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
            @page { size: landscape; margin: 0; }
            body { font-family: 'Plus Jakarta Sans', sans-serif; margin: 0; display: flex; align-items: center; justify-content: center; height: 100vh; background: #f7f9ff; }
            .cert { width: 900px; height: 600px; background: #fff; border: 12px solid #1B1F3B; padding: 40px; box-sizing: border-box; position: relative; text-align: center; box-shadow: 0 20px 60px rgba(91,92,255,0.15); }
            .cert::before { content: ''; position: absolute; top: 8px; left: 8px; right: 8px; bottom: 8px; border: 2px solid rgba(91,92,255,0.2); }
            .header { background: linear-gradient(135deg, #5B5CFF, #7C5CFF); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 44px; font-weight: 900; margin-top: 40px; letter-spacing: 1px; }
            .sub { font-size: 18px; color: #64748b; margin-top: 10px; letter-spacing: 4px; text-transform: uppercase; }
            .name { font-size: 40px; font-weight: 800; color: #1B1F3B; margin: 20px 0; border-bottom: 3px solid rgba(91,92,255,0.2); display: inline-block; padding: 0 40px 10px; }
            .course { font-size: 30px; font-weight: 800; background: linear-gradient(135deg, #5B5CFF, #7C5CFF); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 20px 0; }
            .footer { display: flex; justify-content: space-between; margin-top: 70px; padding: 0 60px; }
            .sig { border-top: 2px solid #1B1F3B; padding-top: 10px; font-size: 16px; font-weight: 700; color: #1B1F3B; width: 200px; }
            .date { font-size: 14px; color: #64748b; margin-top: 5px; }
            .logo { font-size: 28px; font-weight: 900; color: #1B1F3B; position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%); }
          </style>
        </head>
        <body>
          <div class="cert">
            <div class="header">Certificate of Completion</div>
            <div class="sub">This is to certify that</div>
            <div class="name">${user?.fullName || 'Student'}</div>
            <div style="font-size:18px;color:#475569;">has successfully completed the course</div>
            <div class="course">${courseTitle}</div>
            <div class="footer">
              <div><div class="sig">MBK Tech Team</div><div class="date">Authorized Signature</div></div>
              <div><div class="sig">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div><div class="date">Date of Completion</div></div>
            </div>
            <div class="logo">MBK LMS</div>
          </div>
          <script>setTimeout(()=>{window.print();window.close();},500);</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const gradients = [
    ['#5B5CFF', '#7C5CFF'], ['#4F8CFF', '#00C6FF'], ['#22C55E', '#43E97B'],
    ['#FF5C8A', '#FF758C'], ['#F59E0B', '#FFC837'], ['#8B5CF6', '#A78BFA'],
  ];

  return (
    <PremiumPage>
      <PageHeader title="My Certificates" emoji="🏆" subtitle="View, download, and share your earned certificates." />

      {completedCourses.length === 0 ? (
        <GlassCard>
          <EmptyState
            icon={<Award size={56} />}
            title="No Certificates Yet"
            subtitle="Complete courses in your active courses section to earn certificates."
          />
        </GlassCard>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 24 }}>
          {completedCourses.map((courseTitle, idx) => {
            const [gFrom, gTo] = gradients[idx % gradients.length];
            const verificationId = `MBK-${Date.now().toString(36).toUpperCase()}-${(idx + 1).toString().padStart(3, '0')}`;

            return (
              <GlassCard key={idx} style={{ padding: 0, overflow: 'hidden' }}>
                {/* Gradient Header */}
                <div style={{ height: 6, background: `linear-gradient(90deg, ${gFrom}, ${gTo})` }} />

                <div style={{ padding: 28 }}>
                  {/* Certificate Icon & Title */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                    <div style={{ width: 56, height: 56, background: `linear-gradient(135deg, ${gFrom}18, ${gTo}18)`, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: gFrom, position: 'relative' }}>
                      <Award size={28} />
                      <div style={{ position: 'absolute', inset: -4, background: `linear-gradient(135deg, ${gFrom}, ${gTo})`, borderRadius: 20, opacity: 0.1, filter: 'blur(8px)', zIndex: -1 }} />
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: P.ink }}>Certificate of Completion</h3>
                      <p style={{ margin: '4px 0 0', fontSize: 13, color: P.inkMute }}>MBK Tech LMS</p>
                    </div>
                  </div>

                  {/* Course Info */}
                  <div style={{ background: '#f8fafc', padding: 20, borderRadius: P.radiusSm, marginBottom: 20 }}>
                    <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: P.inkMute, textTransform: 'uppercase', letterSpacing: '1px' }}>Course Title</p>
                    <p style={{ margin: '6px 0 0', fontSize: 18, color: P.ink, fontWeight: 800 }}>{courseTitle}</p>
                  </div>

                  {/* Meta Info */}
                  <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: P.inkMute }}>
                      <ShieldCheck size={14} /> <span>{verificationId}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: P.inkMute }}>
                      <Calendar size={14} /> <span>{new Date().toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 10 }}>
                    <GradientButton variant="primary" onClick={() => handlePrint(courseTitle)} style={{ flex: 1 }}>
                      <Download size={16} /> Download PDF
                    </GradientButton>
                    <GradientButton variant="ghost" style={{ padding: '12px 14px' }}>
                      <Share2 size={16} />
                    </GradientButton>
                    <GradientButton variant="ghost" style={{ padding: '12px 14px' }}>
                      <Eye size={16} />
                    </GradientButton>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}
    </PremiumPage>
  );
}
