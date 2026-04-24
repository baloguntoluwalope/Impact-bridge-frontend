import React, { forwardRef, useState } from 'react';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';

const Input = forwardRef(({
  label, error, hint, icon, type='text', required=false,
  containerStyle={}, labelStyle={}, inputStyle={}, ...rest
}, ref) => {
  const [show, setShow] = useState(false);
  const isPass = type === 'password';
  const t = isPass ? (show ? 'text' : 'password') : type;

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:6, ...containerStyle }}>
      {label && (
        <label style={{ fontSize:13, fontWeight:600, color:'var(--gray-700)', ...labelStyle }}>
          {label}{required && <span style={{ color:'var(--danger)', marginLeft:3 }}>*</span>}
        </label>
      )}
      <div style={{ position:'relative', display:'flex', alignItems:'center' }}>
        {icon && (
          <span style={{
            position:'absolute', left:12, fontSize:17, color:'var(--gray-400)',
            display:'flex', alignItems:'center', pointerEvents:'none', zIndex:1,
          }}>
            {icon}
          </span>
        )}
        <input
          ref={ref}
          type={t}
          style={{
            width:        '100%',
            padding:      `10px ${isPass ? 40 : 14}px 10px ${icon ? 40 : 14}px`,
            fontSize:     14,
            fontFamily:   'var(--font)',
            color:        'var(--gray-900)',
            background:   '#fff',
            border:       `1.5px solid ${error ? 'var(--danger)' : 'var(--gray-200)'}`,
            borderRadius: 10,
            outline:      'none',
            transition:   'border-color 150ms ease, box-shadow 150ms ease',
            ...inputStyle,
          }}
          onFocus={e => {
            e.target.style.borderColor = error ? 'var(--danger)' : 'var(--brand)';
            e.target.style.boxShadow   = error
              ? '0 0 0 3px rgba(239,68,68,.12)'
              : '0 0 0 3px rgba(232,93,4,.12)';
          }}
          onBlur={e => {
            e.target.style.borderColor = error ? 'var(--danger)' : 'var(--gray-200)';
            e.target.style.boxShadow   = 'none';
          }}
          aria-invalid={!!error}
          {...rest}
        />
        {isPass && (
          <button
            type="button"
            onClick={() => setShow(p => !p)}
            style={{
              position:'absolute', right:12, padding:0, margin:0,
              fontSize:17, color:'var(--gray-400)', display:'flex',
              alignItems:'center', lineHeight:1, transition:'color 150ms',
            }}
            onMouseEnter={e => e.currentTarget.style.color='var(--gray-600)'}
            onMouseLeave={e => e.currentTarget.style.color='var(--gray-400)'}
            aria-label={show ? 'Hide password' : 'Show password'}
          >
            {show ? <MdVisibilityOff /> : <MdVisibility />}
          </button>
        )}
      </div>
      {error && <p style={{ fontSize:12, color:'var(--danger)', lineHeight:1.4, marginTop:2 }}>{error}</p>}
      {hint && !error && <p style={{ fontSize:12, color:'var(--gray-400)', lineHeight:1.4, marginTop:2 }}>{hint}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;