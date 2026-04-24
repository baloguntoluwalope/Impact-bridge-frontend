import React from 'react';

const VARIANTS = {
  primary:   { bg:'var(--brand)',     color:'#fff', border:'var(--brand)',     hover: { bg:'var(--brand-hover)', shadow:'0 4px 14px rgba(232,93,4,.35)' } },
  secondary: { bg:'var(--gray-900)',  color:'#fff', border:'var(--gray-900)',  hover: { bg:'var(--gray-800)', shadow:'0 4px 14px rgba(0,0,0,.2)' } },
  outline:   { bg:'transparent',      color:'var(--brand)', border:'var(--brand)', hover: { bg:'var(--brand-50)', shadow:'none' } },
  ghost:     { bg:'transparent',      color:'var(--gray-600)', border:'transparent', hover: { bg:'var(--gray-100)', shadow:'none' } },
  danger:    { bg:'var(--danger)',    color:'#fff', border:'var(--danger)',    hover: { bg:'#DC2626', shadow:'0 4px 14px rgba(239,68,68,.35)' } },
  success:   { bg:'var(--success)',   color:'#fff', border:'var(--success)',   hover: { bg:'#059669', shadow:'0 4px 14px rgba(16,185,129,.35)' } },
  white:     { bg:'#fff',             color:'var(--brand)', border:'#fff',    hover: { bg:'var(--gray-50)', shadow:'0 4px 14px rgba(0,0,0,.15)' } },
};

const SIZES = {
  xs: { h:28, px:10, py:5,  fs:11, r:6  },
  sm: { h:34, px:14, py:7,  fs:13, r:8  },
  md: { h:40, px:18, py:9,  fs:14, r:10 },
  lg: { h:48, px:24, py:11, fs:15, r:12 },
  xl: { h:56, px:32, py:13, fs:16, r:14 },
};

function Spin() {
  return (
    <span style={{
      display:'inline-block', width:15, height:15,
      border:'2px solid rgba(255,255,255,.3)',
      borderTop:'2px solid currentColor',
      borderRadius:'50%', animation:'spin .6s linear infinite', flexShrink:0,
    }} />
  );
}

export default function Button({
  children, variant='primary', size='md', loading=false,
  disabled=false, fullWidth=false, icon, iconRight,
  type='button', style={}, onClick, className='', ...rest
}) {
  const v = VARIANTS[variant] || VARIANTS.primary;
  const s = SIZES[size] || SIZES.md;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={className}
      style={{
        display:         'inline-flex',
        alignItems:      'center',
        justifyContent:  'center',
        gap:             6,
        height:          s.h,
        padding:         `${s.py}px ${s.px}px`,
        fontSize:        s.fs,
        fontWeight:      600,
        fontFamily:      'var(--font)',
        lineHeight:      1,
        borderRadius:    s.r,
        border:          `1.5px solid ${v.border}`,
        background:      v.bg,
        color:           v.color,
        cursor:          disabled||loading ? 'not-allowed' : 'pointer',
        opacity:         disabled ? .55 : 1,
        width:           fullWidth ? '100%' : 'auto',
        whiteSpace:      'nowrap',
        transition:      'all 150ms cubic-bezier(.4,0,.2,1)',
        userSelect:      'none',
        ...style,
      }}
      onMouseEnter={e => {
        if (disabled || loading) return;
        e.currentTarget.style.background  = v.hover.bg;
        e.currentTarget.style.boxShadow   = v.hover.shadow;
        e.currentTarget.style.transform   = 'translateY(-1px)';
        if (variant === 'outline') e.currentTarget.style.borderColor = v.border;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = v.bg;
        e.currentTarget.style.boxShadow  = 'none';
        e.currentTarget.style.transform  = 'translateY(0)';
      }}
      onMouseDown={e => { if (!disabled && !loading) e.currentTarget.style.transform = 'translateY(0) scale(.98)'; }}
      onMouseUp={e   => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
      {...rest}
    >
      {loading ? <Spin /> : (
        <>
          {icon && <span style={{ display:'flex', fontSize:'1.1em' }}>{icon}</span>}
          {children}
          {iconRight && <span style={{ display:'flex', fontSize:'1.1em' }}>{iconRight}</span>}
        </>
      )}
    </button>
  );
}