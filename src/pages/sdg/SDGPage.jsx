import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import sdgService from '../../services/sdgService';
import { SDG } from '../../utils/constants';
import { CardSkeleton } from '../../components/common/Loader';

export default function SDGPage() {
  const { data: sdgs=[], isLoading } = useQuery({ queryKey:['sdg-all'], queryFn: sdgService.getAll, staleTime: 10*60000 });
  const list = sdgs.length > 0 ? sdgs : Object.entries(SDG).map(([n,d]) => ({ number:+n, ...d }));

  return (
    <>
      <Helmet><title>UN Sustainable Development Goals — Impact Bridge</title></Helmet>

      <div style={{ background:'linear-gradient(135deg,var(--gray-900) 0%,#1E3A5F 100%)', padding:'64px 0', textAlign:'center' }}>
        <div className="container">
          <span style={{ display:'inline-block', background:'rgba(232,93,4,.18)', color:'var(--brand-light)', border:'1px solid rgba(232,93,4,.25)', borderRadius:999, padding:'5px 16px', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'.09em', marginBottom:20 }}>UN SDGs</span>
          <h1 style={{ fontSize:'clamp(1.75rem,3vw,2.5rem)', fontWeight:900, color:'#fff', letterSpacing:'-1px', marginBottom:14 }}>
            All 17 Sustainable Development Goals
          </h1>
          <p style={{ fontSize:15, color:'rgba(255,255,255,.55)', maxWidth:560, margin:'0 auto' }}>
            Impact Bridge aligns every case and project with the UN SDGs — enabling targeted funding and real-time national progress tracking.
          </p>
        </div>
      </div>

      <div className="container" style={{ padding:'64px 24px 80px' }}>
        {isLoading ? <CardSkeleton count={17} /> : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:20 }}>
            {list.map(s => {
              const color = s.color || SDG[s.number]?.color || 'var(--brand)';
              const icon  = s.icon  || SDG[s.number]?.icon  || '🌍';
              const title = s.title || SDG[s.number]?.title || `SDG ${s.number}`;

              return (
                <Link key={s.number || s._id} to={`/sdg/${s.number}`}
                  style={{ display:'flex', flexDirection:'column', background:'#fff', border:`1px solid ${color}22`, borderRadius:16, overflow:'hidden', transition:'all 200ms ease' }}
                  onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow=`0 12px 32px ${color}20`; e.currentTarget.style.borderColor=`${color}55`; }}
                  onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; e.currentTarget.style.borderColor=`${color}22`; }}>
                  {/* Color bar */}
                  <div style={{ height:4, background:color, flexShrink:0 }} />
                  <div style={{ padding:'24px 22px', flex:1, display:'flex', flexDirection:'column', gap:14 }}>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                      <span style={{ fontSize:10, fontWeight:800, color, background:`${color}12`, border:`1px solid ${color}25`, borderRadius:6, padding:'3px 8px' }}>SDG {s.number}</span>
                      <span style={{ fontSize:32 }}>{icon}</span>
                    </div>
                    <div>
                      <h3 style={{ fontSize:15, fontWeight:700, color:'var(--gray-900)', lineHeight:1.35, marginBottom:6 }}>{title}</h3>
                      <p style={{ fontSize:12, color:'var(--gray-400)', lineHeight:1.6 }}>{s.description?.slice(0,80) || ''}</p>
                    </div>
                    <div style={{ marginTop:'auto', display:'flex', alignItems:'center', gap:4, fontSize:12, color, fontWeight:600 }}>
                      View cases & content →
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}