// src/pages/sdg/SDGDetail.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { MdArrowBack, MdOpenInNew } from 'react-icons/md';
import sdgService from '../../services/sdgService';
import requestService from '../../services/requestService';
import { PageLoader, CardSkeleton } from '../../components/common/Loader';
import RequestCard from '../../pages/requests/RequestCard';
import Pagination from '../../components/common/Pagination';
import Empty from '../../components/common/Empty';
import { SDG } from '../../utils/constants';

export default function SDGDetail() {
  const { number } = useParams();
  const navigate   = useNavigate();
  const [casePage, setCasePage] = useState(1);

  const { data: sdg, isLoading } = useQuery({
    queryKey: ['sdg', number],
    queryFn:  () => sdgService.getByNumber(number),
    staleTime: 10*60000,
  });

  const { data: casesData } = useQuery({
    queryKey: ['sdg-cases', number, casePage],
    queryFn:  () => requestService.getAll({ page:casePage, limit:9, category: sdg?.category || SDG[number]?.cat }),
    enabled:  !!number,
  });

  if (isLoading) return <PageLoader />;

  const sdgInfo   = SDG[number] || {};
  const color     = sdg?.color  || sdgInfo.color  || 'var(--brand)';
  const icon      = sdg?.icon   || sdgInfo.icon   || '🌍';
  const title     = sdg?.title  || sdgInfo.title  || `SDG ${number}`;
  const cases     = casesData?.data       || [];
  const pgn       = casesData?.pagination || {};

  return (
    <>
      <Helmet><title>SDG {number} — {title} | Impact Bridge</title></Helmet>

      {/* Header */}
      <div style={{ background:`linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`, padding:'56px 0' }}>
        <div className="container">
          <button onClick={() => navigate(-1)} style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:13, fontWeight:600, color:'rgba(255,255,255,.75)', marginBottom:20, cursor:'pointer', background:'none', border:'none', transition:'color 150ms' }}
            onMouseEnter={e => e.currentTarget.style.color='#fff'}
            onMouseLeave={e => e.currentTarget.style.color='rgba(255,255,255,.75)'}>
            <MdArrowBack size={17} /> Back to SDGs
          </button>
          <div style={{ display:'flex', alignItems:'center', gap:20 }}>
            <div style={{ width:80, height:80, borderRadius:20, background:'rgba(255,255,255,.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:44, flexShrink:0 }}>{icon}</div>
            <div>
              <div style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,.6)', textTransform:'uppercase', letterSpacing:'.09em', marginBottom:8 }}>SDG {number}</div>
              <h1 style={{ fontSize:'clamp(1.5rem,3vw,2.25rem)', fontWeight:900, color:'#fff', lineHeight:1.1, letterSpacing:'-.5px' }}>{title}</h1>
            </div>
          </div>
          {sdg?.description && (
            <p style={{ fontSize:15, color:'rgba(255,255,255,.7)', maxWidth:600, lineHeight:1.75, marginTop:20 }}>{sdg.description}</p>
          )}
        </div>
      </div>

      {/* Stats */}
      {sdg && (
        <div style={{ borderBottom:'1px solid var(--gray-200)', background:'#fff' }}>
          <div className="container" style={{ padding:'24px' }}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24, maxWidth:600 }}>
              {[
                { l:'Active Cases',   v: sdg.active_cases   || 0 },
                { l:'Content Items',  v: sdg.content_count  || 0 },
                { l:'Total Raised',   v: `₦${((sdg.stats?.total_raised||0)/1000000).toFixed(1)}M` },
              ].map(s => (
                <div key={s.l} style={{ textAlign:'center' }}>
                  <p style={{ fontSize:22, fontWeight:900, color, letterSpacing:'-1px' }}>{s.v}</p>
                  <p style={{ fontSize:12, color:'var(--gray-400)', fontWeight:500 }}>{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Cases */}
      <div className="container" style={{ padding:'48px 24px 80px' }}>
        <div style={{ marginBottom:32 }}>
          <h2 style={{ fontSize:22, fontWeight:800, color:'var(--gray-900)', letterSpacing:'-.5px', marginBottom:8 }}>Active Cases — SDG {number}</h2>
          <p style={{ fontSize:14, color:'var(--gray-400)' }}>Verified cases seeking funding in this SDG category.</p>
        </div>

        {cases.length > 0 ? (
          <>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:24 }}>
              {cases.map(r => <RequestCard key={r._id} request={r} />)}
            </div>
            <Pagination page={pgn.page} pages={pgn.pages} onPageChange={setCasePage} />
          </>
        ) : (
          <Empty icon={icon} title={`No active cases for ${title}`} message="No verified cases are currently seeking funding in this SDG category." />
        )}
      </div>
    </>
  );
}
