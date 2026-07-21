import React from 'react';

export function Card({ children, style = {} }) {
  return (
    <div style={{
      background: "#fff",
      border: "1px solid #eef0f3",
      borderRadius: 14,
      padding: "20px 24px",
      textAlign: "left",
      boxShadow: "0 1px 2px rgba(16,24,40,0.04)",
      ...style
    }}>
      {children}
    </div>
  );
}

export function CardHeader({ icon: Icon, title, badge, action }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 12, borderBottom: "1px solid #f1f2f4", marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {Icon && (React.isValidElement(Icon) ? Icon : typeof Icon === 'string' ? <span>{Icon}</span> : <Icon size={16} color="#1f2937" />)}
        <span style={{ fontWeight: 700, fontSize: 14.5, color: "#1f2937" }}>{title}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {badge && (
          <span style={{ padding: "4px 8px", background: "#f3f5ff", color: "#4c5fd5", borderRadius: 6, fontSize: 11, fontWeight: 700 }}>
            {badge}
          </span>
        )}
        {action}
      </div>
    </div>
  );
}

export function StatCard({ label, value, emoji, color = "#4c5fd5", bg = "#f3f5ff" }) {
  return (
    <Card style={{ padding: "16px 20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12, background: bg, color: color,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20
        }}>
          {emoji}
        </div>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#1B1F3B", lineHeight: 1.1 }}>{value}</div>
          <div style={{ fontSize: 12.5, color: "#64748B", fontWeight: 600, marginTop: 4 }}>{label}</div>
        </div>
      </div>
    </Card>
  );
}

export function Grid({ children, columns = 3, gap = 20, style = {} }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: `repeat(auto-fit, minmax(280px, 1fr))`,
      gap: gap,
      marginBottom: 20,
      ...style
    }}>
      {children}
    </div>
  );
}
