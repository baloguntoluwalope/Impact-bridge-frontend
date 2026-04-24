import React from 'react';
import { STATUS, URGENCY } from '../../utils/constants';

export default function Badge({ status, urgency, label: lbl, color, bg, size='sm', dot=false }) {
  const cfg  = STATUS[status] || URGENCY.find(u => u.value === urgency) || {};
  const c    = color || cfg.color || '#6B7280';
  const b    = bg    || cfg.bg    || '#F3F4F6';
  const text = lbl   || cfg.label || (status || urgency || '').replace(/_/g,' ');

  const sz = {
    xs: { fontSize:10, padding:'2px 7px',  borderRadius:5 },
    sm: { fontSize:11, padding:'3px 9px',  borderRadius:6 },
    md: { fontSize:13, padding:'5px 12px', borderRadius:8 },
  }[size] || { fontSize:11, padding:'3px 9px', borderRadius:6 };

  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:5, fontWeight:600,
      color:c, background:b, border:`1px solid ${c}22`, whiteSpace:'nowrap', ...sz,
    }}>
      {dot && <span style={{ width:6, height:6, borderRadius:'50%', background:c, flexShrink:0 }} />}
      {text}
    </span>
  );
}