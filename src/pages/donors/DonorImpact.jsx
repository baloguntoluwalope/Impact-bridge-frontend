import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { MdArrowForward } from 'react-icons/md';
import dashboardService from '../../services/dashboardService';
import { CardSkeleton } from '../../components/common/Loader';
import Empty from '../../components/common/Empty';
import ProgressBar from '../../components/common/ProgressBar';
import Badge from '../../components/common/Badge';
import { currency, ago, pct } from '../../utils/helpers';
import { SDG } from '../../utils/constants';

export default function DonorImpact() {
  const { data, isLoading } = useQuery({
    queryKey: ['donor-dashboard'],
    queryFn:  dashboardService.donor,
    staleTime: 60000,
  });

  const bySDG   = data?.impact_by_sdg   || [];
  const cases   = data?.recent_donations || [];

  return (
    <>
      <Helmet><title>My Impact — Impact Bridge</title></Helmet>

      <div style={{ marginBottom:32 }}>
        <h1 style={{ fontSize:26, fontWeight:800, color:'#0F172A', letterSpacing:'-.5px', marginBottom:6 }}>
          My Impact Report
        </h1>
        <p style={{ fontSize:14, color:'#64748B' }}>See how your donations are creating real change across Nigeria.</p>
      </div>

      {isLoading ? <CardSkeleton count={4} /> : (
        <>
          {/* SDG breakdown */}
          {bySDG.length > 0 && (
            <div style={{ background:'#fff', border:'1px solid #E2E8F0', borderRadius:20, padding:32, marginBottom:28 }}>
              <h2 style={{ fontSize:18, fontWeight:800, color:'#0F172A', marginBottom:24, letterSpacing:'-.3px' }}>
                Your Impact by SDG Goal
              </h2>
              <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
                {bySDG.map((s, i) => {
                  const sdg = SDG[s._id?.sdg] || {};
                  const color = sdg.color || '#E85D04';
                  const maxVal = bySDG[0]?.total || 1;
                  return (
                    <div key={i} style={{ display:'grid', gridTemplateColumns:'200px 1fr 120px', gap:20, alignItems:'center' }}
                      className="impact-row">
                      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                        <div style={{ width:40, height:40, borderRadius:10, background:`${color}15`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>
                          {sdg.icon || '🌍'}
                        </div>
                        <div>
                          <p style={{ fontWeight:700, fontSize:13, color:'#0F172A' }}>{sdg.title || `SDG ${s._id?.sdg}`}</p>
                          <p style={{ fontSize:11, color:'#94A3B8', marginTop:2 }}>{s.count} donation{s.count > 1 ? 's' : ''}</p>
                        </div>
                      </div>
                      <div>
                        <ProgressBar value={s.total} max={maxVal} height={8} color={color} />
                      </div>
                      <p style={{ fontWeight:800, fontSize:15, color, textAlign:'right' }}>{currency(s.total)}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Cases supported */}
          <div style={{ background:'#fff', border:'1px solid #E2E8F0', borderRadius:20, padding:32 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
              <h2 style={{ fontSize:18, fontWeight:800, color:'#0F172A', letterSpacing:'-.3px', margin:0 }}>
                Cases You've Supported
              </h2>
              <Link to="/donor/donations" style={{ fontSize:13, color:'#E85D04', fontWeight:700, display:'flex', alignItems:'center', gap:4, textDecoration:'none' }}>
                Full History <MdArrowForward size={14} />
              </Link>
            </div>

            {cases.length > 0 ? (
              <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                {cases.filter(d => d.request).map((d, i) => {
                  const sdg = SDG[d.request?.sdg_number] || {};
                  const p   = pct(d.request?.amount_raised, d.request?.amount_needed);
                  return (
                    <div key={i} style={{
                      display:'flex', alignItems:'center', gap:16,
                      background:'#F8FAFC', borderRadius:12, padding:'16px 20px',
                      border:'1px solid #E2E8F0',
                    }}>
                      <div style={{ width:44, height:44, borderRadius:12, background:`${sdg.color||'#E85D04'}15`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>
                        {sdg.icon || '🌍'}
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <Link to={`/requests/${d.request._id || d.request}`} style={{ fontWeight:700, fontSize:14, color:'#0F172A', display:'block', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', transition:'color 150ms', textDecoration:'none' }}
                          onMouseEnter={e => e.currentTarget.style.color='#E85D04'}
                          onMouseLeave={e => e.currentTarget.style.color='#0F172A'}>
                          {d.request?.title}
                        </Link>
                        <div style={{ marginTop:6 }}>
                          <ProgressBar value={p} max={100} height={5} />
                        </div>
                        <p style={{ fontSize:11, color:'#94A3B8', marginTop:4 }}>{p}% funded · {ago(d.created_at)}</p>
                      </div>
                      <div style={{ textAlign:'right', flexShrink:0 }}>
                        <p style={{ fontWeight:800, color:'#E85D04', fontSize:14 }}>{currency(d.amount)}</p>
                        <Badge status={d.request?.status} size="xs" style={{ marginTop:6 }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <Empty icon="🌍" title="No impact data yet"
                message="Your supported cases will appear here after your first donation."
                action={() => window.location.href='/requests'} actionLabel="Browse Cases" />
            )}
          </div>
        </>
      )}

      <style>{`@media(max-width:640px){.impact-row{grid-template-columns:1fr!important}}`}</style>
    </>
  );
}