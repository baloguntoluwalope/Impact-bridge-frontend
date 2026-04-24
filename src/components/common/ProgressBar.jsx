import React from 'react';

export default function ProgressBar({ value=0, max=100, height=7, color, showLabel=false }) {
  const p = Math.min(Math.round((value / max) * 100), 100);
  const c = color || (p >= 100 ? 'var(--success)' : p >= 70 ? 'var(--warning)' : 'var(--brand)');

  return (
    <div>
      {showLabel && (
        <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:'var(--gray-500)', marginBottom:5 }}>
          <span>Progress</span>
          <strong style={{ color:c }}>{p}%</strong>
        </div>
      )}
      <div style={{ background:'var(--gray-100)', borderRadius:999, height, overflow:'hidden' }}>
        <div style={{ width:`${p}%`, height:'100%', background:c, borderRadius:999, transition:'width .8s ease' }} />
      </div>
    </div>
  );
}