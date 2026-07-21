import { Link } from 'react-router-dom';

const cards = [
  { label: 'Overview', path: '/app/a', description: 'Quick summary of your key learning stats.' },
  { label: 'Activity', path: '/app/b', description: 'Recent activity updates and notifications.' },
  { label: 'Analytics', path: '/app/c', description: 'Performance metrics and engagement trends.' },
  { label: 'Preferences', path: '/app/d', description: 'Adjust your dashboard settings and preferences.' },
];

export default function DashboardLanding() {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#1B1F3B' }}>Dashboard Home</h2>
          <p style={{ margin: '4px 0 0', fontSize: 14, color: '#64748B' }}>
            Choose a view to continue. Your dashboard is split into four sections for fast navigation.
          </p>
        </div>
      </div>
      <div className="mbk-grid-responsive" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
        {cards.map((card) => (
          <article key={card.label} style={{ background: '#fff', border: '1px solid #eef0f3', borderRadius: 14, padding: 24 }}>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#1b1f3b' }}>{card.label}</h3>
            <p style={{ margin: '8px 0 0', fontSize: 13, color: '#64748b' }}>{card.description}</p>
            <Link to={card.path} style={{ display: 'inline-block', marginTop: 18, padding: '8px 16px', background: '#f3f5ff', color: '#4c5fd5', borderRadius: 8, textDecoration: 'none', fontWeight: 600, fontSize: 13 }}>
              Open {card.label}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
