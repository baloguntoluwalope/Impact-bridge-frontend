import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MdArrowForward, MdTrendingUp, MdVerified } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import dashboardService from '../../services/dashboardService';
import paymentService from '../../services/paymentService';
import { CardSkeleton } from '../../components/common/Loader';
import Badge from '../../components/common/Badge';
import Empty from '../../components/common/Empty';
import { currency, ago } from '../../utils/helpers';
import { SDG } from '../../utils/constants';

export default function CorporateDashboard() {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ['donor-dashboard'],
    queryFn:  dashboardService.donor,
    staleTime: 60000,
  });

  const summary   = data?.summary         || {};
  const donations = data?.recent_donations || [];
  const bySDG     = data?.impact_by_sdg   || [];

  return (
    <>
      <Helmet><title>Corporate CSR Dashboard — Impact Bridge</title></Helmet>

      {/* Header */}
      <div style={{ marginBottom:28 }}>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
          <div>
            <h1 style={{ fontSize:24, fontWeight:800, color:'#0d0f14', letterSpacing:'-.4px', marginBottom:4 }}>
              Corporate CSR Dashboard
            </h1>
            <p style={{ fontSize:13, color:'#64748b' }}>
              {user?.organization_name || user?.first_name} — Track your CSR impact and donations.
            </p>
          </div>
          <Link to="/requests" style={{ display:'flex', alignItems:'center', gap:7, padding:'10px 18px', background:'#e85d04', color:'#fff', borderRadius:10, fontSize:13, fontWeight:700 }}
            onMouseEnter={e => e.currentTarget.style.background='#c94d03'}
            onMouseLeave={e => e.currentTarget.style.background='#e85d04'}>
            Browse Cases <MdArrowForward size={15} />
          </Link>
        </div>
      </div>

      {isLoading ? <CardSkeleton count={4} /> : (
        <>
          {/* KPIs */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:18, marginBottom:24 }} className="corp-stats">
            {[
              { icon:'💰', label:'Total CSR Invested',    value: currency(summary.total_donated||0),   color:'#e85d04' },
              { icon:'🎯', label:'Donations Made',        value: summary.donation_count||0,            color:'#10b981' },
              { icon:'🌍', label:'SDGs Supported',        value: bySDG.length,                         color:'#8b5cf6' },
            ].map(s => (
              <div key={s.label} style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:14, padding:'22px' }}>
                <div style={{ fontSize:28, marginBottom:10 }}>{s.icon}</div>
                <p style={{ fontSize:26, fontWeight:900, color:s.color, letterSpacing:'-1px', marginBottom:4 }}>{s.value}</p>
                <p style={{ fontSize:13, color:'#64748b' }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* SDG impact */}
          {bySDG.length > 0 && (
            <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:16, padding:'22px', marginBottom:20 }}>
              <h2 style={{ fontSize:15, fontWeight:700, color:'#0d0f14', marginBottom:18 }}>CSR Impact by SDG</h2>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:12 }}>
                {bySDG.slice(0,9).map((s, i) => {
                  const sdg = SDG[s._id?.sdg] || {};
                  const col = sdg.color || '#e85d04';
                  return (
                    <div key={i} style={{ background:`${col}08`, border:`1px solid ${col}20`, borderRadius:12, padding:'14px', textAlign:'center' }}>
                      <span style={{ fontSize:28, display:'block', marginBottom:6 }}>{sdg.icon || '🌍'}</span>
                      <p style={{ fontSize:13, fontWeight:700, color:col }}>{currency(s.total)}</p>
                      <p style={{ fontSize:11, color:'#64748b', marginTop:3 }}>{sdg.title || `SDG ${s._id?.sdg}`}</p>
                      <p style={{ fontSize:10, color:'#94a3b8', marginTop:2 }}>{s.count} donation{s.count>1?'s':''}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recent donations */}
          <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:16, overflow:'hidden' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 22px', borderBottom:'1px solid #f1f5f9' }}>
              <h2 style={{ fontSize:15, fontWeight:700, color:'#0d0f14', margin:0 }}>Recent Donations</h2>
              <Link to="/donor/donations" style={{ fontSize:12, color:'#e85d04', fontWeight:700, display:'flex', alignItems:'center', gap:4 }}>
                Full History <MdArrowForward size={13} />
              </Link>
            </div>
            {donations.length > 0 ? (
              donations.slice(0,6).map((d, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 22px', borderBottom: i<5 ? '1px solid #f8fafc' : 'none' }}>
                  <div style={{ width:40, height:40, borderRadius:10, background:'#fff4ee', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>
                    {SDG[d.request?.sdg_number]?.icon || '💙'}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontWeight:600, fontSize:13, color:'#0d0f14', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                      {d.request?.title || 'General Fund'}
                    </p>
                    <p style={{ fontSize:11, color:'#94a3b8', marginTop:2 }}>{ago(d.created_at)}</p>
                  </div>
                  <div style={{ textAlign:'right', flexShrink:0 }}>
                    <p style={{ fontWeight:700, color:'#e85d04', fontSize:14 }}>{currency(d.amount)}</p>
                    <Badge status={d.request?.status} size="xs" />
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding:'40px 22px' }}>
                <Empty icon="💙" title="No donations yet" message="Browse cases and start your CSR journey." action={() => window.location.href='/requests'} actionLabel="Browse Cases" />
              </div>
            )}
          </div>
        </>
      )}

      <style>{`@media(max-width:768px){.corp-stats{grid-template-columns:1fr!important}}`}</style>
    </>
  );
}