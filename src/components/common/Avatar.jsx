import React from 'react';
import { initials } from '../../utils/helpers';

export default function Avatar({ src, name, size=40, style={} }) {
  return (
    <div style={{
      width:size, height:size, borderRadius:'50%', overflow:'hidden', flexShrink:0,
      background:'var(--brand-50)', color:'var(--brand)',
      display:'flex', alignItems:'center', justifyContent:'center',
      fontSize:size*.36, fontWeight:700, border:'2px solid var(--brand-100)',
      ...style,
    }}>
      {src
        ? <img src={src} alt={name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
        : initials(name)
      }
    </div>
  );
}