import React from 'react';
import Button from './Button';

export default function Empty({ icon='🔍', title='Nothing here yet', message='', action, actionLabel='Try Again' }) {
  return (
    <div style={{
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      padding:'72px 24px', textAlign:'center',
      border:'2px dashed var(--gray-200)', borderRadius:20,
    }}>
      <div style={{ fontSize:56, marginBottom:16, lineHeight:1 }}>{icon}</div>
      <h3 style={{ fontSize:20, fontWeight:700, color:'var(--gray-700)', marginBottom:8 }}>{title}</h3>
      {message && <p style={{ fontSize:14, color:'var(--gray-400)', maxWidth:380, lineHeight:1.7 }}>{message}</p>}
      {action && (
        <div style={{ marginTop:24 }}>
          <Button onClick={action} size="sm">{actionLabel}</Button>
        </div>
      )}
    </div>
  );
}