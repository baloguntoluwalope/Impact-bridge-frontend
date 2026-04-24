import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import analyticsService from '../../services/analyticsService';
import { CardSkeleton } from '../../components/common/Loader';
import Empty from '../../components/common/Empty';
import { currency } from '../../utils/helpers';
import { SDG } from '../../utils/constants';

export default function AdminAnalytics() {
  const { data: platform, isLoading: pLoading } = useQuery({ queryKey:['analytics-platform'], queryFn: analyticsService.platform, staleTime: 180000 });
  const { data: trends,   isLoading: tLoading } = useQuery({ queryKey:['analytics-trends'],   queryFn: () => analyticsService.trends(12), staleTime: 180000 });
  const { data: sdgDist,  isLoading: sLoading } = useQuery({ queryKey:['analytics-sdg'],      queryFn: analyticsService.sdgDist, staleTime: 180000 });
  const { data: regional, isLoading: rLoading } = useQuery({ queryKey:['analytics-regional'], queryFn: analyticsService.regional, staleTime: 180000 });

  const trendChartData = (trends || []).map(t => ({
    month:  `${t.year || t._id?.y || ''}/${String(t.month || t._id?.m || '').padStart(2,'0')}`,
    amount: Math.round((t.total_amount||0) / 1000),
    donations: t.total_count || 0,
  }));

  const sdgChartData = (sdgDist || []).slice(0,10).map(s => ({
    name:  SDG[s._id?.sdg]?.title || `SDG ${s._id?.sdg}`,
    value: Math.round((s.total_amount||0) / 1000),
    color: SDG[s._id?.sdg]?.color || '#e85d04',
  }));

  const isLoading = pLoading || tLoading || sLoading || rLoading;

  return (
    <>
      <Helmet><title>Analytics — Impact Bridge Admin</title></Helmet>

      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontSize:24, fontWeight:800, color:'#0d0f14', letterSpacing:'-.4px', marginBottom:4 }}>Platform Analytics</h1>
        <p style={{ fontSize:13, color:'#64748b' }}>Real-time impact metrics across all 36 states and 17 SDGs.</p>
      </div>

      {isLoading ? <CardSkeleton count={4} /> : (
        <>
          {/* Platform KPIs */}
          {platform && (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:24 }} className="analytics-kpi">
              {[
                { icon:'👥', label:'Active Users',    value:(platform.users?.total||0).toLocaleString(),        color:'#3b82f6' },
                { icon:'📋', label:'Total Requests',  value:(platform.requests?.total||0).toLocaleString(),     color:'#e85d04' },
                { icon:'💰', label:'Total Raised',    value:currency(platform.donations?.total_amount||0),      color:'#10b981' },
                { icon:'❤️', label:'Beneficiaries',  value:(platform.beneficiaries?.total||0).toLocaleString(), color:'#8b5cf6' },
              ].map(s => (
                <div key={s.label} style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:14, padding:'20px 22px', boxShadow:'0 1px 3px rgba(0,0,0,.04)' }}>
                  <div style={{ fontSize:26, marginBottom:10 }}>{s.icon}</div>
                  <p style={{ fontSize:24, fontWeight:900, color:s.color, letterSpacing:'-1px', marginBottom:4 }}>{s.value}</p>
                  <p style={{ fontSize:12, color:'#64748b' }}>{s.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Charts row */}
          <div style={{ display:'grid', gridTemplateColumns:'1.5fr 1fr', gap:20, marginBottom:20 }} className="analytics-charts">

            {/* Donation trends */}
            <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:16, padding:'22px', boxShadow:'0 1px 3px rgba(0,0,0,.04)' }}>
              <h2 style={{ fontSize:15, fontWeight:700, color:'#0d0f14', marginBottom:22 }}>Monthly Donations (₦ thousands)</h2>
              {trendChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={trendChartData} margin={{ top:0, right:0, left:-10, bottom:0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize:10, fill:'#94a3b8' }} />
                    <YAxis tick={{ fontSize:10, fill:'#94a3b8' }} />
                    <Tooltip
                      formatter={v => [`₦${v}K`,'Raised']}
                      contentStyle={{ borderRadius:10, border:'1px solid #e2e8f0', fontSize:12 }}
                    />
                    <Bar dataKey="amount" fill="#e85d04" radius={[6,6,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ height:220, display:'flex', alignItems:'center', justifyContent:'center', color:'#94a3b8', fontSize:13 }}>No trend data yet</div>
              )}
            </div>

            {/* SDG distribution pie */}
            <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:16, padding:'22px', boxShadow:'0 1px 3px rgba(0,0,0,.04)' }}>
              <h2 style={{ fontSize:15, fontWeight:700, color:'#0d0f14', marginBottom:22 }}>Donations by SDG</h2>
              {sdgChartData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={140}>
                    <PieChart>
                      <Pie data={sdgChartData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={2}>
                        {sdgChartData.map((e, i) => <Cell key={i} fill={e.color} />)}
                      </Pie>
                      <Tooltip formatter={v => [`₦${v}K`]} contentStyle={{ borderRadius:10, border:'1px solid #e2e8f0', fontSize:12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ display:'flex', flexDirection:'column', gap:6, marginTop:8 }}>
                    {sdgChartData.slice(0,5).map((s, i) => (
                      <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', fontSize:11 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                          <span style={{ width:8, height:8, borderRadius:'50%', background:s.color, flexShrink:0 }} />
                          <span style={{ color:'#64748b', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:110 }}>{s.name}</span>
                        </div>
                        <span style={{ fontWeight:700, color:'#334155', flexShrink:0 }}>₦{s.value}K</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div style={{ height:200, display:'flex', alignItems:'center', justifyContent:'center', color:'#94a3b8', fontSize:13 }}>No SDG data yet</div>
              )}
            </div>
          </div>

          {/* Regional table */}
          {regional && regional.length > 0 && (
            <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:16, overflow:'hidden', boxShadow:'0 1px 3px rgba(0,0,0,.04)' }}>
              <div style={{ padding:'18px 22px', borderBottom:'1px solid #f1f5f9' }}>
                <h2 style={{ fontSize:15, fontWeight:700, color:'#0d0f14', margin:0 }}>Regional Impact</h2>
              </div>
              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse' }}>
                  <thead>
                    <tr>
                      {['State','Cases','Amount Needed','Amount Raised','Beneficiaries'].map(h => (
                        <th key={h} style={{ padding:'10px 20px', textAlign:'left', fontSize:10, fontWeight:700, color:'#94a3b8', background:'#f8fafc', borderBottom:'1px solid #f1f5f9', textTransform:'uppercase', letterSpacing:'.07em', whiteSpace:'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {regional.slice(0,15).map((r, i) => (
                      <tr key={i} style={{ borderBottom: i<14 ? '1px solid #f8fafc' : 'none' }}
                        onMouseEnter={e => e.currentTarget.style.background='#f8fafc'}
                        onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                        <td style={{ padding:'12px 20px', fontWeight:700, fontSize:13, color:'#334155' }}>{r._id}</td>
                        <td style={{ padding:'12px 20px', fontSize:13, color:'#64748b' }}>{r.cases?.toLocaleString()}</td>
                        <td style={{ padding:'12px 20px', fontSize:13, color:'#64748b' }}>{currency(r.needed||0)}</td>
                        <td style={{ padding:'12px 20px', fontSize:13, fontWeight:700, color:'#10b981' }}>{currency(r.raised||0)}</td>
                        <td style={{ padding:'12px 20px', fontSize:13, color:'#64748b' }}>{(r.beneficiaries||0).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      <style>{`
        @media(max-width:1024px){ .analytics-kpi{grid-template-columns:repeat(2,1fr)!important} .analytics-charts{grid-template-columns:1fr!important} }
        @media(max-width:560px){  .analytics-kpi{grid-template-columns:1fr 1fr!important} }
      `}</style>
    </>
  );
}