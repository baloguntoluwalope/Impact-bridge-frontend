import React, { forwardRef } from 'react';

const Textarea = forwardRef(({ label, error, hint, required=false, rows=4, style={}, ...rest }, ref) => (
  <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
    {label && (
      <label style={{ fontSize:13, fontWeight:600, color:'var(--gray-700)' }}>
        {label}{required && <span style={{ color:'var(--danger)', marginLeft:3 }}>*</span>}
      </label>
    )}
    <textarea
      ref={ref}
      rows={rows}
      style={{
        width:'100%', padding:'10px 14px', fontSize:14, fontFamily:'var(--font)',
        color:'var(--gray-900)', background:'#fff', resize:'vertical',
        border:`1.5px solid ${error ? 'var(--danger)' : 'var(--gray-200)'}`,
        borderRadius:10, outline:'none',
        transition:'border-color 150ms ease, box-shadow 150ms ease', ...style,
      }}
      onFocus={e => { e.target.style.borderColor='var(--brand)'; e.target.style.boxShadow='0 0 0 3px rgba(232,93,4,.12)'; }}
      onBlur={e  => { e.target.style.borderColor=error?'var(--danger)':'var(--gray-200)'; e.target.style.boxShadow='none'; }}
      {...rest}
    />
    {error && <p style={{ fontSize:12, color:'var(--danger)' }}>{error}</p>}
    {hint && !error && <p style={{ fontSize:12, color:'var(--gray-400)' }}>{hint}</p>}
  </div>
));

Textarea.displayName = 'Textarea';
export default Textarea;