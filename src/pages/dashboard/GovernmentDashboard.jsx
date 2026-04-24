import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import dashboardSvc from '../../services/dashboardService';
import { CardSkeleton } from '../../components/common/Loader';
import Badge from '../../components/common/Badge';
import { currency, clip } from '../../utils/helpers';
import { SDG, STATES } from '../../utils/constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function GovernmentDashboard() {
  const [state, setState] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['gov-dashboard', state],
    queryFn:  () => dashboardSvc.government(state || undefined),
    staleTime: 120000,
  });

  const sdgProgress  = data?.sdg_progress      || [];
  const stateHeatmap = data?.state_distribution || [];
  const gaps         = data?.funding_gaps       || [];
  const monthly      = data?.monthly_trends     || [];
  const beneficiaries= data?.total_beneficiaries|| 0;

  const chartData = monthly.map(m => ({
    month: `${m._id?.y || ''}-${String(m._id?.m||'').padStart(2,'0')}`,
    amount: Math.round(m.total / 1000),
  }));

  return (
    <>
      <Helmet><title>Government SDG Dashboard — Impact Bridge</title></Helmet>

      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:28, flexWrap:'wrap', gap:16 }}>
        <div>
          <h1 style={{ fontSize:26, fontWeight:800, color:'var(--gray-900)', letterSpacing:'-.5px', marginBottom:6 }}>Government SDG Dashboard</h1>
          <p style={{ fontSize:14, color:'var(--gray-400)' }}>National SDG progress, funding distribution, and impact data.</p>
        </div>
        <select value={state} onChange={e => setState(e.target.value)}
          style={{ padding:'9px 34px 9px 14px', border:'1.5px solid var(--gray-200)', borderRadius:10, fontSize:13, fontWeight:500, outline:'none', cursor:'pointer', background:`#fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 12 12'%3E%3Cpath fill='%2394A3B8' d='M6 8L1 3h10z'/%3E%3C/svg%3E") right 10px center no-repeat`, appearance:'none' }}>
          <option value="">🌍 National View</option>
          {STATES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {isLoading ? <CardSkeleton count={4} /> : (
        <>
          {/* KPIs */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:20, marginBottom:28 }} className="gov-kpi">
            {[
              { l:'SDGs Covered',      v: [...new Set(sdgProgress.map(s => s._id?.sdg))].length || 0, c:'var(--brand)', icon:'🌍' },
              { l:'Active Cases',      v: sdgProgress.reduce((a,s) => a+s.cases,0),                   c:'var(--info)',  icon:'📋' },
              { l:'Total Raised',      v: currency(sdgProgress.reduce((a,s) => a+s.raised,0)),         c:'var(--success)', icon:'💰' },
              { l:'Total Beneficiaries', v: beneficiaries.toLocaleString(),                            c:'#8B5CF6',     icon:'👥' },
            ].map(s => (
              <div key={s.l} style={{ background:'#fff', border:'1px solid var(--gray-200)', borderRadius:16, padding:24 }}>
                <div style={{ fontSize:28, marginBottom:10 }}>{s.icon}</div>
                <p style={{ fontSize:24, fontWeight:900, color:s.c, letterSpacing:'-1px', fontFamily:'var(--font)' }}>{s.v}</p>
                <p style={{ fontSize:13, color:'var(--gray-400)', marginTop:6 }}>{s.l}</p>
              </div>
            ))}
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1.5fr 1fr', gap:24, marginBottom:24 }} className="gov-grid">

            {/* Monthly trends chart */}
            <div style={{ background:'#fff', border:'1px solid var(--gray-200)', borderRadius:16, padding:'24px 24px 16px' }}>
              <h2 style={{ fontSize:16, fontWeight:700, color:'var(--gray-900)', marginBottom:24 }}>Monthly Donation Trends (₦ thousands)</h2>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={chartData} margin={{ top:0, right:0, left:-10, bottom:0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-100)" />
                    <XAxis dataKey="month" tick={{ fontSize:11, fill:'var(--gray-400)' }} />
                    <YAxis tick={{ fontSize:11, fill:'var(--gray-400)' }} />
                    <Tooltip formatter={(v) => [`₦${v}K`, 'Raised']} contentStyle={{ borderRadius:8, border:'1px solid var(--gray-200)', fontSize:13 }} />
                    <Bar dataKey="amount" fill="var(--brand)" radius={[6,6,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ height:220, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--gray-400)', fontSize:14 }}>
                  No trend data available yet
                </div>
              )}
            </div>

            {/* State breakdown */}
            <div style={{ background:'#fff', border:'1px solid var(--gray-200)', borderRadius:16, overflow:'hidden' }}>
              <div style={{ padding:'20px 24px', borderBottom:'1px solid var(--gray-100)' }}>
                <h2 style={{ fontSize:16, fontWeight:700, color:'var(--gray-900)', margin:0 }}>Top States by Cases</h2>
              </div>
              <div style={{ padding:'8px 0', maxHeight:280, overflowY:'auto' }}>
                {stateHeatmap.slice(0,10).map((s, i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', padding:'10px 24px', gap:16 }}>
                    <span style={{ fontSize:13, fontWeight:700, color:'var(--gray-400)', width:20, flexShrink:0 }}>#{i+1}</span>
                    <div style={{ flex:1, minWidth:0 }}>
                      <p style={{ fontSize:13, fontWeight:600, color:'var(--gray-800)' }}>{s._id}</p>
                      <div style={{ background:'var(--gray-100)', borderRadius:999, height:4, overflow:'hidden', marginTop:4 }}>
                        <div style={{ width:`${Math.min(100, (s.cases / (stateHeatmap[0]?.cases||1)) * 100)}%`, height:'100%', background:'var(--brand)', borderRadius:999 }} />
                      </div>
                    </div>
                    <span style={{ fontSize:13, fontWeight:700, color:'var(--gray-700)', flexShrink:0 }}>{s.cases}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SDG Progress */}
          <div style={{ background:'#fff', border:'1px solid var(--gray-200)', borderRadius:16, overflow:'hidden', marginBottom:24 }}>
            <div style={{ padding:'20px 24px', borderBottom:'1px solid var(--gray-100)' }}>
              <h2 style={{ fontSize:16, fontWeight:700, color:'var(--gray-900)', margin:0 }}>SDG Progress Overview</h2>
            </div>
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead>
                  <tr>
                    {['SDG','Category','Cases','Amount Needed','Amount Raised','Beneficiaries'].map(h => (
                      <th key={h} style={{ padding:'10px 20px', textAlign:'left', fontSize:10, fontWeight:700, color:'var(--gray-400)', background:'var(--gray-50)', borderBottom:'1px solid var(--gray-200)', textTransform:'uppercase', letterSpacing:'.06em', whiteSpace:'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sdgProgress.slice(0,20).map((s, i) => {
                    const sdg = SDG[s._id?.sdg] || {};
                    return (
                      <tr key={i} style={{ borderBottom: i < sdgProgress.length-1 ? '1px solid var(--gray-50)' : 'none' }}>
                        <td style={{ padding:'12px 20px' }}>
                          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                            <span style={{ fontSize:20 }}>{sdg.icon || '🌍'}</span>
                            <span style={{ fontSize:12, fontWeight:700, color:sdg.color||'var(--brand)', background:`${sdg.color||'#E85D04'}12`, padding:'2px 7px', borderRadius:5 }}>SDG {s._id?.sdg}</span>
                          </div>
                        </td>
                        <td style={{ padding:'12px 20px', fontSize:13, color:'var(--gray-500)', textTransform:'capitalize' }}>{s._id?.cat?.replace(/_/g,' ')}</td>
                        <td style={{ padding:'12px 20px', fontSize:13, fontWeight:700, color:'var(--gray-800)' }}>{s.cases}</td>
                        <td style={{ padding:'12px 20px', fontSize:13, color:'var(--gray-600)', whiteSpace:'nowrap' }}>{currency(s.needed)}</td>
                        <td style={{ padding:'12px 20px', fontSize:13, fontWeight:700, color:'var(--success)', whiteSpace:'nowrap' }}>{currency(s.raised)}</td>
                        <td style={{ padding:'12px 20px', fontSize:13, fontWeight:700, color:'var(--info)' }}>{s.beneficiaries?.toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Funding gaps */}
          {gaps.length > 0 && (
            <div style={{ background:'#fff', border:'1px solid var(--gray-200)', borderRadius:16, overflow:'hidden' }}>
              <div style={{ padding:'20px 24px', borderBottom:'1px solid var(--gray-100)' }}>
                <h2 style={{ fontSize:16, fontWeight:700, color:'var(--gray-900)', margin:0 }}>⚠️ Critical Funding Gaps</h2>
              </div>
              <div style={{ padding:'8px 0' }}>
                {gaps.slice(0,8).map((g, i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 24px', borderBottom: i<gaps.length-1 ? '1px solid var(--gray-50)' : 'none' }}>
                    <div>
                      <p style={{ fontSize:13, fontWeight:600, color:'var(--gray-800)' }}>{g._id?.state}</p>
                      <p style={{ fontSize:11, color:'var(--gray-400)', marginTop:2 }}>{g._id?.category?.replace(/_/g,' ')} · {g.case_count} cases</p>
                    </div>
                    <div style={{ textAlign:'right' }}>
                      <p style={{ fontSize:14, fontWeight:700, color:'var(--danger)' }}>{currency(g.total_gap)}</p>
                      <p style={{ fontSize:11, color:'var(--gray-400)', marginTop:2 }}>funding gap</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <style>{`
        @media(max-width:1024px){.gov-kpi{grid-template-columns:repeat(2,1fr)!important}.gov-grid{grid-template-columns:1fr!important}}
        @media(max-width:560px){.gov-kpi{grid-template-columns:1fr 1fr!important}}
      `}</style>
    </>
  );
}
