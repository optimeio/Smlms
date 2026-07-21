import { useState } from 'react';
import { BarChart3, TrendingUp, Users, DollarSign, Download, Calendar as CalendarIcon, ArrowUpRight, ArrowDownRight, PieChart } from 'lucide-react';
import { 
  AdminPage, 
  AdminPageHeader, 
  EnterpriseCard, 
  AdminStatWidget, 
  AdminButton,
  A 
} from '../../components/AdminDesignSystem';

const kpis = [
  { label: 'Total Revenue', value: '$124,500', trend: '+14.5%', isPositive: true, icon: <DollarSign size={24} />, gradientFrom: '#6366F1', gradientTo: '#8B5CF6' },
  { label: 'Active Subscriptions', value: '8,421', trend: '+5.2%', isPositive: true, icon: <Users size={24} />, gradientFrom: '#3B82F6', gradientTo: '#06B6D4' },
  { label: 'Avg. Course Value', value: '$450', trend: '-2.1%', isPositive: false, icon: <BarChart3 size={24} />, gradientFrom: '#F59E0B', gradientTo: '#F97316' },
  { label: 'Conversion Rate', value: '4.8%', trend: '+1.2%', isPositive: true, icon: <TrendingUp size={24} />, gradientFrom: '#10B981', gradientTo: '#059669' },
];

export default function AdminReports() {
  const [dateRange, setDateRange] = useState('This Month');

  // Simple pure CSS chart bars
  const revenueData = [
    { month: 'Jan', value: 45, label: '$45k' },
    { month: 'Feb', value: 52, label: '$52k' },
    { month: 'Mar', value: 48, label: '$48k' },
    { month: 'Apr', value: 70, label: '$70k' },
    { month: 'May', value: 65, label: '$65k' },
    { month: 'Jun', value: 85, label: '$85k' },
    { month: 'Jul', value: 110, label: '$110k' },
  ];

  const maxRev = Math.max(...revenueData.map(d => d.value));

  return (
    <AdminPage>
      <AdminPageHeader 
        title="Executive Reporting & Analytics" 
        subtitle="Track platform growth, revenue trends, and key performance indicators."
        emoji="📈"
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', gap: 8, background: A.surface, padding: 6, borderRadius: 12, border: `1px solid ${A.border}`, boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          {['Today', 'This Week', 'This Month', 'This Year'].map(range => (
            <button 
              key={range}
              onClick={() => setDateRange(range)}
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                border: 'none',
                background: dateRange === range ? A.primary : 'transparent',
                color: dateRange === range ? '#fff' : A.inkSoft,
                fontWeight: 600,
                fontSize: 13,
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontFamily: A.font
              }}
            >
              {range}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <AdminButton variant="outline" icon={<CalendarIcon size={16} />}>
            Custom Range
          </AdminButton>
          <AdminButton variant="blue" icon={<Download size={16} />}>
            Export Report
          </AdminButton>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24, marginBottom: 40 }}>
        {kpis.map((kpi) => (
          <AdminStatWidget
            key={kpi.label}
            label={kpi.label}
            value={kpi.value}
            icon={kpi.icon}
            gradientFrom={kpi.gradientFrom}
            gradientTo={kpi.gradientTo}
            trend={kpi.trend}
            trendUp={kpi.isPositive}
          />
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 32, alignItems: 'start' }}>
        <EnterpriseCard>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: A.ink, fontFamily: A.font }}>Revenue Overview</h3>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: A.inkSoft }}>Monthly revenue performance across all channels</p>
            </div>
            <select style={{ padding: '8px 16px', borderRadius: 8, border: `1px solid ${A.border}`, fontSize: 13, fontWeight: 600, color: A.ink, background: A.bg, outline: 'none', fontFamily: A.font }}>
              <option>2023</option>
              <option>2022</option>
            </select>
          </div>
          
          {/* Custom CSS Bar Chart */}
          <div style={{ height: 300, display: 'flex', alignItems: 'flex-end', gap: '4%', padding: '20px 0 0' }}>
            {revenueData.map((d, i) => {
              const heightPercent = (d.value / maxRev) * 100;
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: A.inkSoft }}>{d.label}</div>
                  <div style={{ width: '100%', maxWidth: 48, height: 200, display: 'flex', alignItems: 'flex-end', background: '#F1F5F9', borderRadius: '8px 8px 0 0', overflow: 'hidden' }}>
                    <div style={{ width: '100%', height: `${heightPercent}%`, background: `linear-gradient(180deg, ${A.primary}, ${A.secondary})`, borderRadius: '8px 8px 0 0', transition: 'height 1s cubic-bezier(0.4, 0, 0.2, 1)' }} />
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: A.inkSoft }}>{d.month}</div>
                </div>
              );
            })}
          </div>
        </EnterpriseCard>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <EnterpriseCard>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: '#FFF7ED', color: A.orange, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PieChart size={20} />
              </div>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: A.ink, fontFamily: A.font }}>User Demographics</h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: A.ink }}>Students</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: A.ink }}>65%</span>
                </div>
                <div style={{ width: '100%', height: 8, background: '#F1F5F9', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: '65%', height: '100%', background: A.primary, borderRadius: 4 }} />
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: A.ink }}>Professionals</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: A.ink }}>25%</span>
                </div>
                <div style={{ width: '100%', height: 8, background: '#F1F5F9', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: '25%', height: '100%', background: A.blue, borderRadius: 4 }} />
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: A.ink }}>Corporate</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: A.ink }}>10%</span>
                </div>
                <div style={{ width: '100%', height: 8, background: '#F1F5F9', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: '10%', height: '100%', background: A.orange, borderRadius: 4 }} />
                </div>
              </div>
            </div>
          </EnterpriseCard>

          <EnterpriseCard>
            <h3 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 800, color: A.ink, fontFamily: A.font }}>Top Performing Courses</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { title: 'Full Stack Development', rev: '$24k', change: '+12%' },
                { title: 'UI/UX Masterclass', rev: '$18k', change: '+8%' },
                { title: 'Data Science Bootcamp', rev: '$15k', change: '-2%' },
              ].map((c, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 16, borderBottom: i < 2 ? `1px solid ${A.border}` : 'none' }}>
                  <div>
                    <p style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 700, color: A.ink }}>{c.title}</p>
                    <p style={{ margin: 0, fontSize: 12, color: c.change.includes('+') ? A.green : A.red, fontWeight: 600 }}>{c.change} vs last month</p>
                  </div>
                  <span style={{ fontSize: 15, fontWeight: 800, color: A.ink }}>{c.rev}</span>
                </div>
              ))}
            </div>
          </EnterpriseCard>
        </div>
      </div>
    </AdminPage>
  );
}