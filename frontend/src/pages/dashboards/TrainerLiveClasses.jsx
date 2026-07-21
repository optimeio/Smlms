import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../state/useAuth';
import { Video, Users, Clock, Play, Square, Wifi, Check, X } from 'lucide-react';
import { PremiumPage, PageHeader, GlassCard, GradientButton, Badge, P } from '../../components/PremiumDesignSystem';
import { io } from 'socket.io-client';

export default function TrainerLiveClasses() {
  const { user } = useAuth();
  const [liveClasses, setLiveClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [waitingStudents, setWaitingStudents] = useState([]);

  useEffect(() => {
    if (user) {
      // Connect to socket
      const newSocket = io(window.location.origin, {
        withCredentials: true
      });
      
      newSocket.on('connect', () => {
        console.log('Trainer socket connected');
      });

      newSocket.on('student_waiting', (data) => {
        setWaitingStudents(prev => {
          if (!prev.find(s => s.socketId === data.socketId)) {
            return [...prev, data];
          }
          return prev;
        });
      });

      setSocket(newSocket);

      return () => newSocket.close();
    }
  }, [user]);

  useEffect(() => {
    const fetchLiveClasses = async () => {
      try {
        const res = await fetch(`/api/live-classes?trainerId=${user._id || user.id || user.email}`);
        const data = await res.json();
        if (data.success) {
          setLiveClasses(data.liveClasses);
          // Join rooms for all assigned live classes
          if (socket && socket.connected) {
            data.liveClasses.forEach(cls => {
              socket.emit('join_class_room', cls._id || cls.id);
            });
          }
        }
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
  }, [user, socket]);

  const handleAdmit = (student) => {
    // find the meeting link from liveClasses
    const cls = liveClasses.find(c => (c._id || c.id) === student.classId);
    const meetingLink = cls?.externalLink || cls?.meetingLink || 'https://meet.google.com/eup-rgcq-ing';
    socket.emit('admit_student', { socketId: student.socketId, meetingLink });
    setWaitingStudents(prev => prev.filter(s => s.socketId !== student.socketId));
  };

  const handleDeny = (student) => {
    socket.emit('deny_student', { socketId: student.socketId });
    setWaitingStudents(prev => prev.filter(s => s.socketId !== student.socketId));
  };

  return (
    <PremiumPage>
      <PageHeader
        title="Live Classes"
        subtitle="Manage your active live sessions."
        emoji="🎥"
      />

      {/* Waiting Room Notifications */}
      {waitingStudents.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
          {waitingStudents.map((student, idx) => (
            <div key={idx} style={{ padding: 16, background: '#fff', borderRadius: 12, border: `1px solid ${P.blue}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: P.ink }}>{student.studentName}</h4>
                <p style={{ margin: 0, fontSize: 13, color: P.inkSoft }}>Wants to join your live class.</p>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <GradientButton onClick={() => handleAdmit(student)} style={{ padding: '8px 16px', fontSize: 14 }}><Check size={16} /> Admit</GradientButton>
                <GradientButton variant="danger" onClick={() => handleDeny(student)} style={{ padding: '8px 16px', fontSize: 14 }}><X size={16} /> Deny</GradientButton>
              </div>
            </div>
          ))}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: P.inkMute }}>Loading live classes...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
          {liveClasses.filter(c => c.assignedByRole !== 'company').length > 0 && (
            <LiveClassSection title="Admin Assigned Live Classes" classes={liveClasses.filter(c => c.assignedByRole !== 'company')} badgeColor={P.blue} />
          )}
          {liveClasses.filter(c => c.assignedByRole === 'company').length > 0 && (
            <LiveClassSection title="Company Assigned Live Classes" classes={liveClasses.filter(c => c.assignedByRole === 'company')} badgeColor="#F59E0B" />
          )}
          {liveClasses.length === 0 && (
            <GlassCard style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 60 }}>
              <div style={{ color: P.inkMute, fontSize: 14 }}>No live classes currently assigned.</div>
            </GlassCard>
          )}
        </div>
      )}
    </PremiumPage>
  );
}

const LiveClassSection = ({ title, classes, badgeColor }) => {
  return (
    <div style={{ padding: '24px', background: 'rgba(255,255,255,0.5)', borderRadius: 24, border: `1px solid ${badgeColor}33`, marginBottom: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32, borderBottom: `2px solid ${badgeColor}22`, paddingBottom: 16 }}>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: P.ink }}>{title}</h2>
        <Badge color={badgeColor} bg={`${badgeColor}15`}>{classes.length} Sessions</Badge>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 24 }}>
          {classes.map((cls, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
            >
              <GlassCard style={{ position: 'relative', overflow: 'hidden', padding: 0 }}>
                {/* Top gradient stripe */}
                <div style={{
                  height: 6,
                  background: 'linear-gradient(90deg, #6366F1, #8B5CF6, #3B82F6)',
                  borderRadius: '24px 24px 0 0',
                }} />

                <div style={{ padding: 24 }}>
                  {/* Live Badge */}
                  <div style={{
                    position: 'absolute', top: 20, right: 20,
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                    <Badge color="#fff" bg="linear-gradient(135deg, #EF4444, #F43F5E)">
                      <style>{`
                        @keyframes livePulse {
                          0%, 100% { opacity: 1; }
                          50% { opacity: 0.3; }
                        }
                      `}</style>
                      <div style={{ width: 7, height: 7, background: '#fff', borderRadius: '50%', animation: 'livePulse 1.5s ease-in-out infinite' }} />
                      LIVE
                    </Badge>
                  </div>

                  {/* Course Header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                    <div style={{
                      width: 56, height: 56, borderRadius: 18,
                      background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
                      boxShadow: '0 8px 24px rgba(99,102,241,0.3)',
                      flexShrink: 0,
                    }}>
                      <Video size={26} />
                    </div>
                    <div style={{ paddingRight: 60 }}>
                      <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: P.ink, fontFamily: P.font }}>
                        {cls.dayNumber && <span style={{ color: badgeColor, marginRight: 6 }}>Day {cls.dayNumber}:</span>}
                        {cls.courseTitle || 'Live Session'}
                      </h3>
                      {cls.topicName && <p style={{ margin: '4px 0 0', fontSize: 14, fontWeight: 700, color: P.inkSoft }}>{cls.topicName}</p>}
                    </div>
                  </div>

                  {/* Session Details */}
                  <div style={{
                    background: 'rgba(99,102,241,0.03)',
                    padding: 16, borderRadius: 14,
                    border: `1px solid ${P.border}`,
                    marginBottom: 20,
                    display: 'flex', flexDirection: 'column', gap: 12,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: P.inkMute, fontWeight: 600 }}>
                        <Users size={15} /> Students Assigned
                      </div>
                      <span style={{ fontWeight: 800, color: P.ink }}>{cls.studentIds?.length || 0}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: P.inkMute, fontWeight: 600 }}>
                        <Clock size={15} /> Start Time
                      </div>
                      <span style={{ fontWeight: 700, color: P.ink }}>{new Date(cls.timing).toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: P.inkMute, fontWeight: 600 }}>
                        <Wifi size={15} /> Duration
                      </div>
                      <span style={{ fontWeight: 700, color: P.ink }}>{cls.duration}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: 12 }}>
                    <GradientButton
                      onClick={() => window.open(cls.externalLink || 'https://meet.google.com/eup-rgcq-ing', '_blank')}
                      style={{ flex: 2 }}
                    >
                      <Play size={16} /> Start Session
                    </GradientButton>
                    <GradientButton variant="danger" style={{ flex: 1 }}>
                      <Square size={14} /> End Class
                    </GradientButton>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
    </div>
  );
};
