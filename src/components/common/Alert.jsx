import React from 'react';
import { MdCheckCircle, MdError, MdWarning, MdInfo, MdClose } from 'react-icons/md';

const CFG = {
  success: { c:'var(--success)', bg:'var(--success-50)', bd:'#A7F3D0', Icon:MdCheckCircle },
  danger:  { c:'var(--danger)',  bg:'var(--danger-50)',  bd:'#FECACA', Icon:MdError      },
  warning: { c:'var(--warning)', bg:'var(--warning-50)', bd:'#FDE68A', Icon:MdWarning    },
  info:    { c:'var(--info)',    bg:'var(--info-50)',    bd:'#BFDBFE', Icon:MdInfo       },
};

export default function Alert({ type='info', title, message, onClose, style={} }) {
  const { c, bg, bd, Icon } = CFG[type] || CFG.info;
  return (
    <div style={{
      display:'flex', alignItems:'flex-start', gap:12, padding:'14px 16px',
      background:bg, border:`1px solid ${bd}`, borderRadius:12, ...style,
    }}>
      <Icon size={20} style={{ color:c, flexShrink:0, marginTop:1 }} />
      <div style={{ flex:1, minWidth:0 }}>
        {title && <p style={{ fontSize:14, fontWeight:700, color:c, marginBottom: message ? 3 : 0 }}>{title}</p>}
        {message && <p style={{ fontSize:13, color:'var(--gray-600)', lineHeight:1.55 }}>{message}</p>}
      </div>
      {onClose && (
        <button onClick={onClose} style={{ color:c, opacity:.7, display:'flex', flexShrink:0, padding:2 }}>
          <MdClose size={17} />
        </button>
      )}
    </div>
  );
}