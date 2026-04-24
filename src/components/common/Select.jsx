import React, { forwardRef } from 'react';

const Select = forwardRef(({ label, error, hint, required=false, children, style={}, ...rest }, ref) => (
  <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
    {label && (
      <label style={{ fontSize:13, fontWeight:600, color:'var(--gray-700)' }}>
        {label}{required && <span style={{ color:'var(--danger)', marginLeft:3 }}>*</span>}
      </label>
    )}
    <select
      ref={ref}
      style={{
        width:'100%', padding:'10px 36px 10px 14px', fontSize:14, fontFamily:'var(--font)',
        color:'var(--gray-900)', background:'#fff', cursor:'pointer', appearance:'none',
        backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2394A3B8' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
        backgroundRepeat:'no-repeat', backgroundPosition:'right 12px center',
        border:`1.5px solid ${error ? 'var(--danger)' : 'var(--gray-200)'}`,
        borderRadius:10, outline:'none',
        transition:'border-color 150ms ease, box-shadow 150ms ease', ...style,
      }}
      onFocus={e => { e.target.style.borderColor='var(--brand)'; e.target.style.boxShadow='0 0 0 3px rgba(232,93,4,.12)'; }}
      onBlur={e  => { e.target.style.borderColor=error?'var(--danger)':'var(--gray-200)'; e.target.style.boxShadow='none'; }}
      {...rest}
    >
      {children}
    </select>
    {error && <p style={{ fontSize:12, color:'var(--danger)' }}>{error}</p>}
    {hint && !error && <p style={{ fontSize:12, color:'var(--gray-400)' }}>{hint}</p>}
  </div>
));

Select.displayName = 'Select';
export default Select;