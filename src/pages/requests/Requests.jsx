import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { MdSearch, MdTune, MdClose, MdRefresh, MdWifi } from 'react-icons/md';
import requestService from '../../services/requestService';
import RequestCard from '../../pages/requests/RequestCard';
import Pagination  from '../../components/common/Pagination';
import Empty       from '../../components/common/Empty';
import { CardSkeleton } from '../../components/common/Loader';
import { SDG_CATS, STATES, URGENCY, SORTS } from '../../utils/constants';
import useDebounce from '../../hooks/useDebounce';

export default function Requests() {
  const [page,     setPage]    = useState(1);
  const [search,   setSearch]  = useState('');
  const [category, setCategory]= useState('');
  const [state,    setState]   = useState('');
  const [urgency,  setUrgency] = useState('');
  const [sort,     setSort]    = useState('-created_at');
  const [showF,    setShowF]   = useState(false);

  const q = useDebounce(search, 500);

  // Only send non-empty params
  const params = { page, limit: 12, sort };
  if (q)        params.search   = q;
  if (category) params.category = category;
  if (state)    params.state    = state;
  if (urgency)  params.urgency  = urgency;

  const { data, isLoading, isError, error, isFetching, refetch } = useQuery({
    queryKey:         ['requests', params],
    queryFn:          () => requestService.getAll(params),
    keepPreviousData: true,
    staleTime:        2 * 60000,
    retry:            1,
  });

  const requests = data?.data || data?.requests || [];
  const pgn      = data?.pagination || data?.meta || {};
  const hasF     = q || category || state || urgency;

  const clearAll = () => {
    setSearch(''); setCategory(''); setState(''); setUrgency(''); setSort('-created_at'); setPage(1);
  };

  const selCss = {
    padding: '9px 32px 9px 12px', border: '1.5px solid #e2e8f0', borderRadius: 10,
    fontSize: 13, fontFamily: 'inherit', color: '#334155', outline: 'none', cursor: 'pointer',
    appearance: 'none', flex: 1, minWidth: 140, maxWidth: 200,
    background: `#fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 12 12'%3E%3Cpath fill='%2394A3B8' d='M6 8L1 3h10z'/%3E%3C/svg%3E") right 10px center no-repeat`,
  };

  return (
    <>
      <Helmet><title>Browse Verified Cases — Impact Bridge</title></Helmet>

      {/* Hero header */}
      <div style={{ background: 'linear-gradient(135deg,#0f172a 0%,#1e293b 100%)', padding: '52px 0 48px' }}>
        <div className="container">
          <div style={{ display:'inline-flex', alignItems:'center', gap:7, background:'rgba(232,93,4,.15)', border:'1px solid rgba(232,93,4,.25)', borderRadius:999, padding:'5px 14px', marginBottom:18 }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:'#e85d04', animation:'pulse 2s infinite' }} />
            <span style={{ fontSize:11, fontWeight:700, color:'#e85d04', letterSpacing:'.04em' }}>Manually Verified Cases</span>
          </div>
          <h1 style={{ fontSize:'clamp(1.75rem,3vw,2.5rem)', fontWeight:900, color:'#fff', marginBottom:10, letterSpacing:'-1px' }}>
            Cases Needing Your Support
          </h1>
          <p style={{ fontSize:15, color:'rgba(255,255,255,.5)', maxWidth:520 }}>
            Every case below has been manually reviewed and verified by our team.
            {pgn.total > 0 && <strong style={{ color:'rgba(255,255,255,.75)' }}> {pgn.total.toLocaleString()} cases available.</strong>}
          </p>
        </div>
      </div>

      <div className="container" style={{ padding:'28px 24px 80px' }}>

        {/* Connection error */}
        {isError && (
          <div style={{ display:'flex', alignItems:'center', gap:14, background:'#fef2f2', border:'1px solid #fecaca', borderRadius:14, padding:'18px 20px', marginBottom:24 }}>
            <MdWifi size={24} style={{ color:'#ef4444', flexShrink:0 }} />
            <div style={{ flex:1 }}>
              <p style={{ fontWeight:700, fontSize:14, color:'#991b1b', marginBottom:3 }}>
                {error?.response?.status === 404 ? 'API route not found (404)' : 'Failed to load cases'}
              </p>
              <p style={{ fontSize:13, color:'#b91c1c' }}>
                {error?.response?.status === 404
                  ? 'Make sure your backend is running on http://localhost:5000 and /api/v1/requests is registered.'
                  : error?.message || 'Check your internet connection and try again.'}
              </p>
            </div>
            <button onClick={() => refetch()}
              style={{ padding:'8px 16px', background:'#ef4444', color:'#fff', border:'none', borderRadius:9, fontSize:13, fontWeight:700, cursor:'pointer', flexShrink:0, display:'flex', alignItems:'center', gap:6 }}>
              <MdRefresh size={16} /> Retry
            </button>
          </div>
        )}

        {/* Search + toolbar */}
        <div style={{ display:'flex', gap:10, marginBottom:14, flexWrap:'wrap', alignItems:'center' }}>
          {/* Search */}
          <div style={{ display:'flex', alignItems:'center', gap:8, flex:1, minWidth:240, background:'#fff', border:'1.5px solid #e2e8f0', borderRadius:11, padding:'10px 16px', boxShadow:'0 1px 2px rgba(0,0,0,.04)' }}
            onFocusCapture={e => e.currentTarget.style.borderColor='#e85d04'}
            onBlurCapture={e  => e.currentTarget.style.borderColor='#e2e8f0'}>
            <MdSearch size={18} style={{ color:'#94a3b8', flexShrink:0 }} />
            <input type="search" placeholder="Search verified cases by title or location…" value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              style={{ flex:1, border:'none', outline:'none', fontSize:14, fontFamily:'inherit', color:'#0d0f14', background:'transparent' }} />
            {search && (
              <button onClick={() => { setSearch(''); setPage(1); }} style={{ display:'flex', color:'#94a3b8', background:'none', border:'none', cursor:'pointer', padding:0 }}>
                <MdClose size={16} />
              </button>
            )}
          </div>

          <button onClick={() => setShowF(p => !p)} style={{ display:'flex', alignItems:'center', gap:7, padding:'10px 16px', border:`1.5px solid ${showF?'#e85d04':'#e2e8f0'}`, borderRadius:11, fontSize:13, fontWeight:600, color:showF?'#e85d04':'#475569', background:showF?'#fff4ee':'#fff', cursor:'pointer', position:'relative' }}>
            <MdTune size={17} /> Filters
            {hasF && <span style={{ position:'absolute', top:8, right:8, width:7, height:7, borderRadius:'50%', background:'#e85d04' }} />}
          </button>

          {hasF && (
            <button onClick={clearAll} style={{ display:'flex', alignItems:'center', gap:5, padding:'10px 14px', borderRadius:11, fontSize:13, fontWeight:600, color:'#ef4444', background:'#fef2f2', border:'1.5px solid #fecaca', cursor:'pointer' }}>
              <MdClose size={15} /> Clear
            </button>
          )}

          <button onClick={() => refetch()} style={{ display:'flex', alignItems:'center', gap:6, padding:'10px 14px', borderRadius:11, fontSize:13, fontWeight:600, color:'#475569', background:'#fff', border:'1.5px solid #e2e8f0', cursor:'pointer' }}>
            <MdRefresh size={15} style={{ animation: isFetching ? 'spin .8s linear infinite' : 'none' }} />
            Refresh
          </button>
        </div>

        {/* Filter panel */}
        {showF && (
          <div style={{ display:'flex', gap:10, flexWrap:'wrap', background:'#fff', border:'1px solid #e2e8f0', borderRadius:14, padding:'14px 16px', marginBottom:20 }}>
            <select value={category} onChange={e => { setCategory(e.target.value); setPage(1); }} style={selCss}
              onFocus={e => e.target.style.borderColor='#e85d04'} onBlur={e => e.target.style.borderColor='#e2e8f0'}>
              <option value="">All SDG Categories</option>
              {SDG_CATS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
            <select value={state} onChange={e => { setState(e.target.value); setPage(1); }} style={selCss}
              onFocus={e => e.target.style.borderColor='#e85d04'} onBlur={e => e.target.style.borderColor='#e2e8f0'}>
              <option value="">All States</option>
              {STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={urgency} onChange={e => { setUrgency(e.target.value); setPage(1); }} style={selCss}
              onFocus={e => e.target.style.borderColor='#e85d04'} onBlur={e => e.target.style.borderColor='#e2e8f0'}>
              <option value="">Any Urgency</option>
              {URGENCY.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
            </select>
            <select value={sort} onChange={e => { setSort(e.target.value); setPage(1); }} style={selCss}
              onFocus={e => e.target.style.borderColor='#e85d04'} onBlur={e => e.target.style.borderColor='#e2e8f0'}>
              {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        )}

        {/* Results */}
        {isLoading ? (
          <CardSkeleton count={9} />
        ) : requests.length > 0 ? (
          <>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(310px,1fr))', gap:22, opacity:isFetching?.6:1, transition:'opacity 200ms' }}>
              {requests.map(r => <RequestCard key={r._id} request={r} />)}
            </div>
            <Pagination page={pgn.page} pages={pgn.pages} onPageChange={p => { setPage(p); window.scrollTo({ top:0, behavior:'smooth' }); }} />
          </>
        ) : !isLoading && !isError ? (
          <Empty icon="🔍" title="No verified cases found"
            message={hasF ? 'No cases match your current filters. Try adjusting them.' : 'No verified cases are available right now. Check back soon!'}
            action={hasF ? clearAll : undefined} actionLabel="Clear All Filters" />
        ) : null}
      </div>

      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}} @keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </>
  );
}