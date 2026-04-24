import React from 'react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

export default function Pagination({ page, pages, onPageChange }) {
  if (!pages || pages <= 1) return null;

  const range = () => {
    const d = 2, r = [];
    for (let i = Math.max(2, page - d); i <= Math.min(pages - 1, page + d); i++) r.push(i);
    if (page - d > 2) r.unshift('…');
    if (page + d < pages - 1) r.push('…');
    r.unshift(1);
    if (pages !== 1) r.push(pages);
    return r;
  };

  const Btn = ({ p, active, disabled: dis, children, label }) => (
    <button
      onClick={() => !dis && typeof p === 'number' && onPageChange(p)}
      disabled={dis}
      aria-label={label}
      aria-current={active ? 'page' : undefined}
      style={{
        minWidth:34, height:34, padding:'0 6px', borderRadius:8,
        display:'flex', alignItems:'center', justifyContent:'center',
        fontSize:13, fontWeight: active ? 700 : 500,
        border:`1.5px solid ${active ? 'var(--brand)' : 'var(--gray-200)'}`,
        background: active ? 'var(--brand)' : '#fff',
        color:      active ? '#fff'         : 'var(--gray-600)',
        cursor:     dis    ? 'not-allowed'  : 'pointer',
        opacity:    dis    ? .45            : 1,
        transition: 'all 150ms ease',
      }}
      onMouseEnter={e => { if (!active && !dis) { e.currentTarget.style.borderColor='var(--brand)'; e.currentTarget.style.color='var(--brand)'; } }}
      onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor='var(--gray-200)'; e.currentTarget.style.color='var(--gray-600)'; } }}
    >
      {children}
    </button>
  );

  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6, marginTop:36 }}>
      <Btn dis={page===1} p={page-1} label="Previous page"><MdChevronLeft size={18} /></Btn>
      {range().map((p, i) =>
        p === '…'
          ? <span key={`e${i}`} style={{ fontSize:13, color:'var(--gray-400)', padding:'0 4px' }}>…</span>
          : <Btn key={p} p={p} active={page===p} label={`Page ${p}`}>{p}</Btn>
      )}
      <Btn dis={page===pages} p={page+1} label="Next page"><MdChevronRight size={18} /></Btn>
    </div>
  );
}