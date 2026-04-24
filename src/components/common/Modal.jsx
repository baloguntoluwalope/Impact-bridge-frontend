import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MdClose } from 'react-icons/md';

const W = { sm:420, md:560, lg:720, xl:920, full:1100 };

export default function Modal({ isOpen, onClose, title, children, size='md', footer, noPad=false }) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      role="dialog" aria-modal="true" aria-labelledby="modal-title"
      onClick={onClose}
      style={{
        position:'fixed', inset:0, zIndex:1000,
        background:'rgba(15,23,42,.55)',
        display:'flex', alignItems:'center', justifyContent:'center',
        padding:16, backdropFilter:'blur(4px)',
        animation:'fadeIn 150ms ease',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background:'#fff', borderRadius:20, width:'100%',
          maxWidth: W[size] || 560, maxHeight:'92vh',
          display:'flex', flexDirection:'column',
          boxShadow:'0 24px 64px rgba(0,0,0,.2)',
          animation:'scaleIn 200ms ease',
        }}
      >
        {/* Header */}
        <div style={{
          display:'flex', alignItems:'center', justifyContent:'space-between',
          padding:'20px 24px', borderBottom:'1px solid var(--gray-100)',
          flexShrink:0,
        }}>
          <h2 id="modal-title" style={{ fontSize:18, fontWeight:700, margin:0, color:'var(--gray-900)' }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              width:32, height:32, borderRadius:8, display:'flex',
              alignItems:'center', justifyContent:'center',
              color:'var(--gray-400)', transition:'all 150ms ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background='var(--gray-100)'; e.currentTarget.style.color='var(--gray-700)'; }}
            onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='var(--gray-400)'; }}
          >
            <MdClose size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex:1, overflowY:'auto', padding: noPad ? 0 : '24px' }}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div style={{
            padding:'16px 24px', borderTop:'1px solid var(--gray-100)',
            display:'flex', gap:10, justifyContent:'flex-end', flexShrink:0,
          }}>
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}