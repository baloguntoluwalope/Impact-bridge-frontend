import React from 'react';

export function Spinner({ size=24, color='var(--brand)', thickness=2.5 }) {
  return (
    <span
      role="status" aria-label="Loading"
      style={{
        display:'inline-block', width:size, height:size, borderRadius:'50%',
        border:`${thickness}px solid ${color}22`,
        borderTop:`${thickness}px solid ${color}`,
        animation:'spin .65s linear infinite', flexShrink:0,
      }}
    />
  );
}

export function PageLoader() {
  return (
    <div style={{
      position:'fixed', inset:0, display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center', gap:16,
      background:'rgba(255,255,255,.96)', zIndex:9999,
    }}>
      <span style={{ fontSize:48, animation:'float 2s ease-in-out infinite' }}>🌍</span>
      <Spinner size={40} thickness={3} />
      <p style={{ fontSize:13, color:'var(--gray-400)', fontWeight:500, letterSpacing:'.02em' }}>
        Loading Impact Bridge…
      </p>
    </div>
  );
}

export function CardSkeleton({ count=3 }) {
  const Bar = ({ w='100%', h=14, mb=0 }) => (
    <div style={{
      width:w, height:h, borderRadius:6, marginBottom:mb,
      background:'linear-gradient(90deg,var(--gray-100) 25%,var(--gray-200) 50%,var(--gray-100) 75%)',
      backgroundSize:'200% 100%', animation:'shimmer 1.5s infinite',
    }} />
  );

  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:24 }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ background:'#fff', border:'1px solid var(--gray-200)', borderRadius:16, overflow:'hidden' }}>
          <div style={{ height:200, background:'linear-gradient(90deg,var(--gray-100) 25%,var(--gray-200) 50%,var(--gray-100) 75%)', backgroundSize:'200% 100%', animation:'shimmer 1.5s infinite' }} />
          <div style={{ padding:20, display:'flex', flexDirection:'column', gap:10 }}>
            <Bar h={18} w="70%" />
            <Bar h={13} />
            <Bar h={13} w="85%" />
            <Bar h={10} w="60%" />
            <div style={{ marginTop:4 }}>
              <Bar h={8} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows=6, cols=5 }) {
  return (
    <div style={{ background:'#fff', border:'1px solid var(--gray-200)', borderRadius:16, overflow:'hidden' }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{ display:'flex', gap:16, padding:'14px 20px', borderBottom:'1px solid var(--gray-100)' }}>
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} style={{
              flex: j===0 ? 3 : 1, height:13, borderRadius:6,
              background:'linear-gradient(90deg,var(--gray-100) 25%,var(--gray-200) 50%,var(--gray-100) 75%)',
              backgroundSize:'200% 100%', animation:'shimmer 1.5s infinite',
            }} />
          ))}
        </div>
      ))}
    </div>
  );
}