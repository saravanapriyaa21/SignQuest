import React from "react";

export default function ProgressBar({ value = 0, label = "" }) {
  const pct = Math.min(100, Math.max(0, Math.round(value)));
  return (
    <div className="progressCard">
      <div className="progressHeader">{label}</div>
      <div className="bar">
        <div className="fill" style={{ width: `${pct}%` }} />
      </div>
      <div style={{ fontSize: 12, color: "#666", marginTop: 6 }}>{pct}%</div>
    </div>
  );
}
