import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MdAdd, MdArrowForward, MdOpenInNew } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import requestService from '../../services/requestService';
import Badge from '../../components/common/Badge';
import ProgressBar from '../../components/common/ProgressBar';
import { Spinner } from '../../components/common/Loader';
import Empty from '../../components/common/Empty';
import { currency, ago, pct } from '../../utils/helpers';

const STATUS_INFO = {
  draft:        { emoji:'📝', text:'Draft — not submitted yet.' },
  submitted:    { emoji:'📤', text:'Submitted — awaiting review by our team.' },
  under_review: { emoji:'🔍', text:'Under review — team is verifying your request.' },
  verified:     { emoji:'✅', text:'Verified and LIVE — donors can see your case!' },
  rejected:     { emoji:'❌', text:'Not approved — see reason below.' },
  funded:       { emoji:'💰', text:'Fully funded! Work will begin soon.' },
  in_progress:  { emoji:'🏗️', text:'Work has started on your request.' },
  completed:    { emoji:'🎉', text:'Completed! Impact achieved.' },
};

export default function RequesterDashboard() {
  const { user }   = useAuth();
  const navigate   = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['my-requests-dash'],
    queryFn:  () => requestService.getMine({ limit: 20 }),
    staleTime: 30000,
    retry: 1,
  });

  const requests = data?.data || data?.requests || [];

  const counts = {
    total:     requests.length,
    live:      requests.filter(r => r.status === 'verified').length,
    funded:    requests.filter(r => ['funded','in_progress','completed'].includes(r.status)).length,
    rejected:  requests.filter(r => r.status === 'rejected').length,
    raised:    requests.reduce((a, r) => a + (r.amount_raised || 0), 0),
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <>
      <Helmet><title>My Dashboard — Impact Bridge</title></Helmet>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:28, flexWrap:'wrap', gap:16 }}>
        <div>
          <h1 style={{ fontSize:24, fontWeight:800, color:'#0d0f14', letterSpacing:'-.4px', marginBottom:4 }}>
            {greeting}, {user?.first_name}! 👋
          </h1>
          <p style={{ fontSize:13, color:'#64748b' }}>
            Track the status of all your submitted requests.
          </p>
        </div>
        <Link to="/submit-request" style={{ display:'flex', alignItems:'center', gap:7, padding:'10px 20px', background:'#e85d04', color:'#fff', borderRadius:10, fontSize:13, fontWeight:700, textDecoration:'none', transition:'background 140ms', flexShrink:0 }}
          onMouseEnter={e => e.currentTarget.style.background='#c94d03'}
          onMouseLeave={e => e.currentTarget.style.background='#e85d04'}>
          <MdAdd size={17} /> Submit New Request
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:28 }} className="req-kpi">
        {[
          { icon:'📋', label:'Total Requests',  value:counts.total,               color:'#e85d04' },
          { icon:'✅', label:'Live on Platform', value:counts.live,               color:'#10b981' },
          { icon:'💰', label:'Total Raised',    value:currency(counts.raised),    color:'#8b5cf6' },
          { icon:'❌', label:'Rejected',        value:counts.rejected,            color:'#ef4444' },
        ].map(s => (
          <div key={s.label} style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:14, padding:'20px 22px', boxShadow:'0 1px 3px rgba(0,0,0,.04)' }}>
            <div style={{ fontSize:26, marginBottom:10 }}>{s.icon}</div>
            <p style={{ fontSize:22, fontWeight:900, color:s.color, letterSpacing:'-1px', marginBottom:4 }}>{s.value}</p>
            <p style={{ fontSize:12, color:'#64748b' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Pipeline */}
      <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:16, padding:'20px 24px', marginBottom:22, boxShadow:'0 1px 3px rgba(0,0,0,.04)' }}>
        <h2 style={{ fontSize:15, fontWeight:700, color:'#0d0f14', marginBottom:18 }}>Verification Pipeline</h2>
        <div style={{ display:'flex', alignItems:'center', overflowX:'auto', paddingBottom:4 }}>
          {[
            { label:'Submitted',    color:'#3b82f6',  n:requests.filter(r=>r.status==='submitted').length },
            { label:'Under Review', color:'#f59e0b',  n:requests.filter(r=>r.status==='under_review').length },
            { label:'Verified',     color:'#10b981',  n:requests.filter(r=>r.status==='verified').length },
            { label:'Funded',       color:'#8b5cf6',  n:requests.filter(r=>['funded','in_progress','completed'].includes(r.status)).length },
          ].map((step, i, arr) => (
            <React.Fragment key={step.label}>
              <div style={{ textAlign:'center', minWidth:90, flexShrink:0 }}>
                <div style={{ width:44, height:44, borderRadius:'50%', background:`${step.color}15`, border:`2px solid ${step.color}`, color:step.color, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:18, margin:'0 auto 8px' }}>
                  {step.n}
                </div>
                <p style={{ fontSize:11, fontWeight:600, color:'#64748b' }}>{step.label}</p>
              </div>
              {i < arr.length - 1 && (
                <div style={{ flex:1, height:2, background:'#e2e8f0', minWidth:24, opacity:.5 }} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Request list */}
      <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:16, overflow:'hidden', boxShadow:'0 1px 3px rgba(0,0,0,.04)' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 22px', borderBottom:'1px solid #f1f5f9' }}>
          <h2 style={{ fontSize:15, fontWeight:700, color:'#0d0f14', margin:0 }}>My Requests</h2>
          <Link to="/my-requests" style={{ fontSize:12, color:'#e85d04', fontWeight:700, display:'flex', alignItems:'center', gap:4, textDecoration:'none' }}>
            All requests <MdArrowForward size={13} />
          </Link>
        </div>

        {isLoading ? (
          <div style={{ display:'flex', justifyContent:'center', padding:'40px' }}>
            <Spinner size={32} />
          </div>
        ) : isError ? (
          <div style={{ padding:'40px 22px', textAlign:'center', color:'#64748b', fontSize:13 }}>
            Failed to load requests. Make sure you're logged in.
          </div>
        ) : requests.length > 0 ? (
          <div>
            {requests.slice(0, 6).map((req, i) => {
              const info = STATUS_INFO[req.status] || STATUS_INFO.submitted;
              const p    = pct(req.amount_raised, req.amount_needed);
              return (
                <div key={req._id} style={{ display:'flex', alignItems:'center', gap:16, padding:'16px 22px', borderBottom:i<Math.min(requests.length,6)-1?'1px solid #f8fafc':'none', transition:'background 100ms' }}
                  onMouseEnter={e => e.currentTarget.style.background='#f8fafc'}
                  onMouseLeave={e => e.currentTarget.style.background='transparent'}>

                  {/* Status emoji */}
                  <div style={{ width:44, height:44, borderRadius:12, background:'#f1f5f9', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>
                    {info.emoji}
                  </div>

                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontWeight:700, fontSize:14, color:'#0d0f14', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', marginBottom:5 }}>
                      {req.title}
                    </p>
                    <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
                      <Badge status={req.status} size="xs" dot />
                      <span style={{ fontSize:11, color:'#94a3b8' }}>{ago(req.created_at)}</span>
                      <span style={{ fontSize:11, color:'#94a3b8' }}>Goal: {currency(req.amount_needed)}</span>
                    </div>
                    {['funded','in_progress','completed'].includes(req.status) && (
                      <div style={{ marginTop:7 }}>
                        <ProgressBar value={p} max={100} height={5} />
                        <p style={{ fontSize:11, color:'#94a3b8', marginTop:3 }}>{currency(req.amount_raised)} raised · {p}%</p>
                      </div>
                    )}
                    {req.status === 'rejected' && req.verification?.rejection_reason && (
                      <p style={{ fontSize:12, color:'#ef4444', marginTop:5, background:'#fef2f2', padding:'6px 10px', borderRadius:7 }}>
                        ❌ {req.verification.rejection_reason}
                      </p>
                    )}
                  </div>

                  {req.status === 'verified' && (
                    <Link to={`/requests/${req._id}`} title="View live case"
                      style={{ width:34, height:34, borderRadius:9, background:'#ecfdf5', color:'#10b981', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, textDecoration:'none', border:'1px solid #d1fae5' }}>
                      <MdOpenInNew size={16} />
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ padding:'48px 22px' }}>
            <Empty icon="📋" title="No requests yet"
              message="Submit your first request to get started. It will be reviewed within 48 hours."
              action={() => navigate('/submit-request')} actionLabel="Submit Now" />
          </div>
        )}
      </div>

      <style>{`@media(max-width:768px){.req-kpi{grid-template-columns:1fr 1fr!important}}`}</style>
    </>
  );
}