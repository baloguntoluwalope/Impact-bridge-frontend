import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MdRefresh, MdWifi, MdArrowForward } from 'react-icons/md';
import projectService from '../../services/projectService';
import Pagination  from '../../components/common/Pagination';
import Empty       from '../../components/common/Empty';
import Badge       from '../../components/common/Badge';
import ProgressBar from '../../components/common/ProgressBar';
import { CardSkeleton } from '../../components/common/Loader';
import { currency, ago, clip, pct } from '../../utils/helpers';
import { SDG, STATES } from '../../utils/constants';

export default function Projects() {
  const [page,    setPage]   = useState(1);
  const [state,   setState]  = useState('');
  const [creator, setCreator]= useState('');

  const params = { page, limit: 12 };
  if (state)   params.state        = state;
  if (creator) params.creator_type = creator;

  const { data, isLoading, isError, error, isFetching, refetch } = useQuery({
    queryKey:         ['projects', params],
    queryFn:          () => projectService.getAll(params),
    keepPreviousData: true,
    staleTime:        2 * 60000,
    retry:            1,
  });

  const projects = data?.data || data?.projects || [];
  const pgn      = data?.pagination || data?.meta || {};

  const selCss = {
    padding:'9px 32px 9px 12px', border:'1.5px solid #e2e8f0', borderRadius:10,
    fontSize:13, fontFamily:'inherit', color:'#334155', outline:'none', cursor:'pointer',
    appearance:'none', minWidth:160,
    background:`#fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 12 12'%3E%3Cpath fill='%2394A3B8' d='M6 8L1 3h10z'/%3E%3C/svg%3E") right 10px center no-repeat`,
  };

  return (
    <>
      <Helmet><title>Sponsored Projects — Impact Bridge</title></Helmet>

      <div style={{ background:'linear-gradient(135deg,#0f172a 0%,#1e293b 100%)', padding:'52px 0 48px' }}>
        <div className="container">
          <span style={{ display:'inline-block', background:'rgba(232,93,4,.15)', color:'#e85d04', border:'1px solid rgba(232,93,4,.25)', borderRadius:999, padding:'5px 14px', fontSize:11, fontWeight:700, letterSpacing:'.04em', marginBottom:18 }}>
            📁 Sponsored Projects
          </span>
          <h1 style={{ fontSize:'clamp(1.75rem,3vw,2.5rem)', fontWeight:900, color:'#fff', marginBottom:10, letterSpacing:'-1px' }}>
            NGO, Corporate &amp; Government Projects
          </h1>
          <p style={{ fontSize:15, color:'rgba(255,255,255,.5)', maxWidth:500 }}>
            Large-scale verified impact projects open for institutional funding.
            {pgn.total > 0 && <strong style={{ color:'rgba(255,255,255,.75)' }}> {pgn.total.toLocaleString()} projects.</strong>}
          </p>
        </div>
      </div>

      <div className="container" style={{ padding:'28px 24px 80px' }}>

        {isError && (
          <div style={{ display:'flex', alignItems:'center', gap:14, background:'#fef2f2', border:'1px solid #fecaca', borderRadius:14, padding:'18px 20px', marginBottom:24 }}>
            <MdWifi size={24} style={{ color:'#ef4444', flexShrink:0 }} />
            <div style={{ flex:1 }}>
              <p style={{ fontWeight:700, fontSize:14, color:'#991b1b', marginBottom:3 }}>
                {error?.response?.status === 404 ? 'API route not found (404)' : 'Failed to load projects'}
              </p>
              <p style={{ fontSize:13, color:'#b91c1c' }}>
                {error?.response?.status === 404
                  ? 'Ensure /api/v1/projects is registered in your backend app.js.'
                  : error?.message}
              </p>
            </div>
            <button onClick={() => refetch()} style={{ padding:'8px 16px', background:'#ef4444', color:'#fff', border:'none', borderRadius:9, fontSize:13, fontWeight:700, cursor:'pointer', flexShrink:0, display:'flex', alignItems:'center', gap:6 }}>
              <MdRefresh size={16} /> Retry
            </button>
          </div>
        )}

        {/* Filters */}
        <div style={{ display:'flex', gap:10, marginBottom:24, flexWrap:'wrap', alignItems:'center' }}>
          <select value={state} onChange={e => { setState(e.target.value); setPage(1); }} style={selCss}
            onFocus={e => e.target.style.borderColor='#e85d04'} onBlur={e => e.target.style.borderColor='#e2e8f0'}>
            <option value="">All States</option>
            {STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={creator} onChange={e => { setCreator(e.target.value); setPage(1); }} style={selCss}
            onFocus={e => e.target.style.borderColor='#e85d04'} onBlur={e => e.target.style.borderColor='#e2e8f0'}>
            <option value="">All Creator Types</option>
            {['ngo','corporate','government'].map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
          </select>
          {(state||creator) && (
            <button onClick={() => { setState(''); setCreator(''); setPage(1); }}
              style={{ padding:'9px 14px', fontSize:13, fontWeight:600, color:'#ef4444', background:'#fef2f2', border:'1.5px solid #fecaca', borderRadius:10, cursor:'pointer' }}>
              Clear
            </button>
          )}
          <button onClick={() => refetch()} style={{ display:'flex', alignItems:'center', gap:6, padding:'9px 14px', borderRadius:10, fontSize:13, fontWeight:600, color:'#475569', background:'#fff', border:'1.5px solid #e2e8f0', cursor:'pointer' }}>
            <MdRefresh size={15} style={{ animation:isFetching?'spin .8s linear infinite':'none' }} /> Refresh
          </button>
        </div>

        {isLoading ? <CardSkeleton count={9} /> : projects.length > 0 ? (
          <>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(310px,1fr))', gap:22, opacity:isFetching?.6:1 }}>
              {projects.map(proj => {
                const p    = pct(proj.amount_funded||0, proj.total_budget||1);
                const sdgN = proj.sdg_goals?.[0];
                const sdgD = SDG[sdgN] || {};
                const col  = sdgD.color || '#e85d04';

                return (
                  <div key={proj._id} style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:16, overflow:'hidden', display:'flex', flexDirection:'column', transition:'all 200ms ease', boxShadow:'0 1px 3px rgba(0,0,0,.05)' }}
                    onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 12px 32px rgba(0,0,0,.1)'; e.currentTarget.style.borderColor=col; }}
                    onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 1px 3px rgba(0,0,0,.05)'; e.currentTarget.style.borderColor='#e2e8f0'; }}>

                    {/* Color top bar */}
                    <div style={{ height:3, background:col, flexShrink:0 }} />

                    {/* Thumb */}
                    <div style={{ height:180, background:`linear-gradient(135deg,${col}15,#f8fafc)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:52, position:'relative', flexShrink:0 }}>
                      {sdgD.icon || '📁'}
                      <span style={{ position:'absolute', bottom:10, left:12, fontSize:10, fontWeight:800, color:'#fff', background:col, padding:'3px 9px', borderRadius:999, textTransform:'uppercase', letterSpacing:'.05em' }}>
                        {proj.creator_type}
                      </span>
                      <span style={{ position:'absolute', top:10, right:10 }}>
                        <Badge status={proj.status} size="xs" dot />
                      </span>
                    </div>

                    <div style={{ padding:'18px 20px', flex:1, display:'flex', flexDirection:'column', gap:12 }}>
                      {/* SDG chips */}
                      <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                        {proj.sdg_goals?.slice(0,3).map(n => (
                          <span key={n} style={{ fontSize:10, fontWeight:700, color:'#fff', background:SDG[n]?.color||'#e85d04', padding:'2px 8px', borderRadius:999 }}>
                            SDG {n}
                          </span>
                        ))}
                      </div>

                      <h3 style={{ fontSize:15, fontWeight:700, color:'#0d0f14', lineHeight:1.35, margin:0 }}>
                        {clip(proj.title, 75)}
                      </h3>

                      {/* Progress */}
                      <div style={{ marginTop:'auto' }}>
                        <ProgressBar value={p} max={100} height={6} color={col} />
                        <div style={{ display:'flex', justifyContent:'space-between', marginTop:7, fontSize:12 }}>
                          <strong style={{ color:col }}>{currency(proj.amount_funded||0)}</strong>
                          <span style={{ color:'#94a3b8' }}>of {currency(proj.total_budget)}</span>
                        </div>
                      </div>

                      {/* Footer */}
                      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', paddingTop:12, borderTop:'1px solid #f1f5f9' }}>
                        <span style={{ fontSize:11, color:'#94a3b8' }}>📍 {proj.state} · {ago(proj.created_at)}</span>
                        <Link to={`/projects/${proj._id}`} style={{ display:'flex', alignItems:'center', gap:4, fontSize:12, fontWeight:700, color:col, textDecoration:'none', transition:'gap 130ms' }}
                          onMouseEnter={e => e.currentTarget.style.gap='8px'}
                          onMouseLeave={e => e.currentTarget.style.gap='4px'}>
                          Details <MdArrowForward size={14} />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <Pagination page={pgn.page} pages={pgn.pages} onPageChange={p => { setPage(p); window.scrollTo({ top:0, behavior:'smooth' }); }} />
          </>
        ) : !isLoading && !isError ? (
          <Empty icon="📁" title="No projects found"
            message={state||creator ? 'Try adjusting your filters.' : 'No sponsored projects are currently available.'}
            action={state||creator ? () => { setState(''); setCreator(''); } : undefined}
            actionLabel="Clear Filters" />
        ) : null}
      </div>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </>
  );
}

// // src/pages/projects/Projects.jsx
// import React, { useState } from 'react';
// import { Helmet } from 'react-helmet-async';
// import { Link } from 'react-router-dom';
// import { useQuery } from '@tanstack/react-query';
// import { MdSearch, MdClose } from 'react-icons/md';
// import projectService from '../../services/projectService';
// import Pagination from '../../components/common/Pagination';
// import Empty from '../../components/common/Empty';
// import Badge from '../../components/common/Badge';
// import { CardSkeleton } from '../../components/common/Loader';
// import ProgressBar from '../../components/common/ProgressBar';
// import { currency, ago, clip, pct } from '../../utils/helpers';
// import { SDG, STATES } from '../../utils/constants';

// export default function Projects() {
//   const [page,  setPage]  = useState(1);
//   const [state, setState] = useState('');
//   const [search,setSearch]= useState('');

//   const { data, isLoading } = useQuery({
//     queryKey: ['projects', page, state],
//     queryFn:  () => projectService.getAll({ page, limit:12, ...(state ? { state } : {}) }),
//     keepPreviousData:true, staleTime:2*60000,
//   });

//   const projects = data?.data || [];
//   const pgn      = data?.pagination || {};

//   return (
//     <>
//       <Helmet><title>Sponsored Projects — Impact Bridge</title></Helmet>

//       <div style={{ background:'linear-gradient(135deg,var(--gray-900) 0%,#1E3A5F 100%)', padding:'56px 0 52px' }}>
//         <div className="container">
//           <span style={{ display:'inline-block', background:'rgba(232,93,4,.18)', color:'var(--brand-light)', border:'1px solid rgba(232,93,4,.25)', borderRadius:999, padding:'5px 16px', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'.09em', marginBottom:18 }}>Sponsored Projects</span>
//           <h1 style={{ fontSize:'clamp(1.75rem,3vw,2.5rem)', fontWeight:900, color:'#fff', marginBottom:12, letterSpacing:'-1px' }}>
//             Corporate, NGO & Government Projects
//           </h1>
//           <p style={{ fontSize:15, color:'rgba(255,255,255,.5)', maxWidth:480 }}>Large-scale social impact projects open for institutional funding.</p>
//         </div>
//       </div>

//       <div className="container" style={{ padding:'32px 24px 80px' }}>
//         {/* Toolbar */}
//         <div style={{ display:'flex', gap:10, marginBottom:24, flexWrap:'wrap' }}>
//           <select value={state} onChange={e => { setState(e.target.value); setPage(1); }}
//             style={{ padding:'9px 34px 9px 14px', border:'1.5px solid var(--gray-200)', borderRadius:10, fontSize:13, fontWeight:500, outline:'none', cursor:'pointer', background:`#fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 12 12'%3E%3Cpath fill='%2394A3B8' d='M6 8L1 3h10z'/%3E%3C/svg%3E") right 10px center no-repeat`, appearance:'none', minWidth:160 }}>
//             <option value="">All States</option>
//             {STATES.map(s => <option key={s} value={s}>{s}</option>)}
//           </select>
//         </div>

//         {isLoading ? <CardSkeleton count={9} /> : projects.length > 0 ? (
//           <>
//             <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:24 }}>
//               {projects.map(proj => {
//                 const p = pct(proj.amount_funded, proj.total_budget);
//                 return (
//                   <Link key={proj._id} to={`/projects/${proj._id}`}
//                     style={{ background:'#fff', border:'1px solid var(--gray-200)', borderRadius:16, overflow:'hidden', display:'flex', flexDirection:'column', transition:'all 200ms ease' }}
//                     onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='var(--shadow-lg)'; e.currentTarget.style.borderColor='var(--brand)'; }}
//                     onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; e.currentTarget.style.borderColor='var(--gray-200)'; }}>
//                     <div style={{ height:180, background:'linear-gradient(135deg,var(--gray-100),var(--gray-50))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:52, flexShrink:0 }}>
//                       {proj.sdg_goals?.slice(0,1).map(n => SDG[n]?.icon).join('') || '🌍'}
//                     </div>
//                     <div style={{ padding:'20px 22px', flex:1, display:'flex', flexDirection:'column', gap:10 }}>
//                       <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
//                         <Badge status={proj.status} size="xs" dot />
//                         <span style={{ fontSize:10, fontWeight:700, color:'var(--info)', background:'var(--info-50)', padding:'2px 8px', borderRadius:5, textTransform:'capitalize' }}>{proj.creator_type}</span>
//                       </div>
//                       <h3 style={{ fontSize:15, fontWeight:700, color:'var(--gray-900)', lineHeight:1.35 }}>{clip(proj.title, 75)}</h3>
//                       <div>
//                         <ProgressBar value={p} max={100} height={6} />
//                         <div style={{ display:'flex', justifyContent:'space-between', marginTop:6, fontSize:12 }}>
//                           <span style={{ fontWeight:700, color:'var(--brand)' }}>{currency(proj.amount_funded)}</span>
//                           <span style={{ color:'var(--gray-400)' }}>of {currency(proj.total_budget)}</span>
//                         </div>
//                       </div>
//                       <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', paddingTop:10, borderTop:'1px solid var(--gray-100)', marginTop:'auto', fontSize:12, color:'var(--gray-400)' }}>
//                         <span>📍 {proj.state}</span>
//                         <span>{ago(proj.created_at)}</span>
//                       </div>
//                     </div>
//                   </Link>
//                 );
//               })}
//             </div>
//             <Pagination page={pgn.page} pages={pgn.pages} onPageChange={p => { setPage(p); window.scrollTo({ top:0, behavior:'smooth' }); }} />
//           </>
//         ) : (
//           <Empty icon="📁" title="No projects found" message="No sponsored projects are currently available." />
//         )}
//       </div>
//     </>
//   );
// }