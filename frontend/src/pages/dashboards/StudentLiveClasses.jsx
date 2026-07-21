import React, { useState, useEffect } from 'react';
import { useAuth } from '../../state/useAuth';
import { Video, Calendar, Clock, Users, ExternalLink, Loader } from 'lucide-react';
import { PremiumPage, PageHeader, GlassCard, GradientButton, Badge, EmptyState, P } from '../../components/PremiumDesignSystem';
import { io } from 'socket.io-client';

export default function StudentLiveClasses() {
  const { user } = useAuth();
  const [liveClasses, setLiveClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (user) {
      const newSocket = io(window.location.origin, {
        withCredentials: true
      });
      setSocket(newSocket);
      return () => newSocket.close();
    }
  }, [user]);

  useEffect(() => {
    const fetchLiveClasses = async () => {
      try {
        const res = await fetch(`/api/live-classes?studentId=${user._id || user.id || user.email}`);
        const data = await res.json();
        if (data.success) setLiveClasses(data.liveClasses);
      } catch (err) {
        console.error('Failed to fetch live classes:', err);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchLiveClasses();
      const interval = setInterval(fetchLiveClasses, 3000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const getClassInfo = (cls) => {
    const classDate = new Date(cls.timing);
    const diffMin = Math.floor((classDate - new Date()) / 60000);
    const isLive = diffMin <= 15 && diffMin >= -120;
    const isPast = diffMin < -120;
    const isWithin24h = diffMin <= 1440 && diffMin >= -120; // 24 hours = 1440 mins
    let timeStatus = '';
    if (isLive) timeStatus = 'Live Now';
    else if (isPast) timeStatus = 'Ended';
    else {
      const h = Math.floor(diffMin / 60);
      const m = diffMin % 60;
      timeStatus = `Starts in ${h > 0 ? h + 'h ' : ''}${m}m`;
    }
    return { classDate, isLive, isPast, isWithin24h, timeStatus };
  };

  const adminClasses = liveClasses.filter(c => c.assignedByRole !== 'company');
  const companyClasses = liveClasses.filter(c => c.assignedByRole === 'company');



  return (
    <PremiumPage>
      <PageHeader title="Live Classes" subtitle="Join your scheduled live sessions and track upcoming classes." />

      {loading ? (
        <p style={{ color: P.inkMute }}>Loading live classes...</p>
      ) : liveClasses.length === 0 ? (
        <GlassCard>
          <EmptyState icon={<Video size={56} />} title="No Live Classes Scheduled" subtitle="You have no scheduled live classes at this time. Check back later!" />
        </GlassCard>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
          {adminClasses.length > 0 && (
            <LiveClassSection title="Admin Live Classes" classes={adminClasses} badgeColor={P.blue} user={user} socket={socket} />
          )}
          {companyClasses.length > 0 && (
            <LiveClassSection title="Company Live Classes" classes={companyClasses} badgeColor="#F59E0B" user={user} socket={socket} />
          )}
        </div>
      )}
    </PremiumPage>
  );
}

const LiveClassSection = ({ title, classes, badgeColor, user, socket }) => {
  const getClassInfo = (cls) => {
    const classDate = new Date(cls.timing);
    const diffMin = Math.floor((classDate - new Date()) / 60000);
    const isLive = diffMin <= 15 && diffMin >= -120;
    const isPast = diffMin < -120;
    const isWithin24h = diffMin <= 1440 && diffMin >= -120;
    let timeStatus = '';
    if (isLive) timeStatus = 'Live Now';
    else if (isPast) timeStatus = 'Ended';
    else {
      const h = Math.floor(diffMin / 60);
      const m = diffMin % 60;
      timeStatus = `Starts in ${h > 0 ? h + 'h ' : ''}${m}m`;
    }
    return { classDate, isLive, isPast, isWithin24h, timeStatus };
  };

  const todayClasses = classes.filter(cls => {
    const d = new Date(cls.timing);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  });

  const upcomingClasses = classes.filter(cls => {
    const d = new Date(cls.timing);
    const now = new Date();
    return d > now && d.toDateString() !== now.toDateString();
  });

  const pastClasses = classes.filter(cls => {
    const { isPast } = getClassInfo(cls);
    return isPast;
  });

  const ClassCard = ({ cls, idx }) => {
    const { classDate, isLive, isPast, isWithin24h, timeStatus } = getClassInfo(cls);
    const gradients = [['#5B5CFF', '#7C5CFF'], ['#FF5C8A', '#FF758C'], ['#4F8CFF', '#00C6FF'], ['#22C55E', '#43E97B']];
    const [gFrom, gTo] = gradients[idx % gradients.length];
    const [status, setStatus] = useState('idle'); // idle, waiting, admitted, denied

    useEffect(() => {
      if (socket) {
        const handleAdmitted = (data) => {
          setStatus('admitted');
          window.open(data.meetingLink, '_blank');
        };
        const handleDenied = () => {
          setStatus('denied');
          alert('Trainer denied your request to join the class.');
        };
        socket.on('admitted', handleAdmitted);
        socket.on('denied', handleDenied);
        return () => {
          socket.off('admitted', handleAdmitted);
          socket.off('denied', handleDenied);
        };
      }
    }, [socket]);

    const handleJoinClick = () => {
      if (!socket) return;
      setStatus('waiting');
      socket.emit('join_request', {
        classId: cls._id || cls.id,
        studentId: user._id || user.id,
        studentName: user.fullName || user.email,
        studentEmail: user.email
      });
    };

    return (
      <GlassCard style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ height: 4, background: `linear-gradient(90deg, ${gFrom}, ${gTo})` }} />
        <div style={{ padding: 24, flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 52, height: 52, background: `linear-gradient(135deg, ${gFrom}18, ${gTo}18)`, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: gFrom }}>
                <Video size={24} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: P.ink }}>
                  {cls.dayNumber && <span style={{ color: gFrom, marginRight: 6 }}>Day {cls.dayNumber}:</span>}
                  {cls.courseTitle || 'Live Session'}
                </h3>
                {cls.topicName && <p style={{ margin: '4px 0 0', fontSize: 14, fontWeight: 700, color: P.inkSoft }}>{cls.topicName}</p>}
                <p style={{ margin: '4px 0 0', fontSize: 13, fontWeight: 600, color: isLive ? P.green : isPast ? P.inkMute : '#d97706' }}>
                  {timeStatus}
                </p>
              </div>
            </div>
            {isLive && (
              <Badge color="#ef4444" bg="#fee2e2">
                <div style={{ width: 6, height: 6, background: '#ef4444', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
                LIVE
              </Badge>
            )}
          </div>
          <div style={{ background: '#f8fafc', padding: 16, borderRadius: 12, marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: P.inkSoft }}>
              <Calendar size={15} /> <span>{classDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: P.inkSoft }}>
              <Clock size={15} /> <span>{classDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Duration: {cls.duration}</span>
            </div>
          </div>
          <div style={{ marginTop: 'auto' }}>
            {isWithin24h ? (
              <GradientButton
                onClick={handleJoinClick}
                disabled={isPast || status === 'waiting' || status === 'denied'}
                variant={isLive ? 'success' : isPast ? 'outline' : 'primary'}
                style={{ width: '100%' }}
              >
                {status === 'waiting' ? <><Loader size={14} className="spin" /> Waiting for Trainer...</> :
                 status === 'denied' ? 'Access Denied' :
                 isPast ? 'Session Ended' : isLive ? <>Join Now <ExternalLink size={14} /></> : 'Start Session'}
              </GradientButton>
            ) : (
              <GradientButton variant="outline" disabled style={{ width: '100%', opacity: 0.7 }}>
                Available 24h Before
              </GradientButton>
            )}
          </div>
        </div>
      </GlassCard>
    );
  };

  return (
    <div style={{ padding: '24px', background: 'rgba(255,255,255,0.5)', borderRadius: 24, border: `1px solid ${badgeColor}33`, marginBottom: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32, borderBottom: `2px solid ${badgeColor}22`, paddingBottom: 16 }}>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: P.ink }}>{title}</h2>
        <Badge color={badgeColor} bg={`${badgeColor}15`}>{classes.length} Total</Badge>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        {todayClasses.length > 0 && (
          <div>
            <h3 style={{ margin: '0 0 16px 0', fontSize: 18, fontWeight: 800, color: P.ink, display: 'flex', alignItems: 'center', gap: 8 }}>Today's Classes <Badge color={P.red}>{todayClasses.length}</Badge></h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
              {todayClasses.map((cls, idx) => <ClassCard key={idx} cls={cls} idx={idx} />)}
            </div>
          </div>
        )}

        {upcomingClasses.length > 0 && (
          <div>
            <h3 style={{ margin: '0 0 16px 0', fontSize: 18, fontWeight: 800, color: P.ink, display: 'flex', alignItems: 'center', gap: 8 }}>Upcoming Classes <Badge color={P.blue}>{upcomingClasses.length}</Badge></h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
              {upcomingClasses.map((cls, idx) => <ClassCard key={idx} cls={cls} idx={idx} />)}
            </div>
          </div>
        )}

        {pastClasses.length > 0 && (
          <div>
            <h3 style={{ margin: '0 0 16px 0', fontSize: 18, fontWeight: 800, color: P.ink, display: 'flex', alignItems: 'center', gap: 8 }}>Completed Classes <Badge color={P.inkMute}>{pastClasses.length}</Badge></h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
              {pastClasses.map((cls, idx) => <ClassCard key={idx} cls={cls} idx={idx} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
