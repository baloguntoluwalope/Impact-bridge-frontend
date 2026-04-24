import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MdArrowForward, MdVolunteerActivism, MdBarChart, MdBookmark, MdTrendingUp } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import dashboardSvc from '../../services/dashboardService';
import { CardSkeleton } from '../../components/common/Loader';
// import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Empty from '../../components/common/Empty';
import { currency, fmtDate, ago } from '../../utils/helpers';
import { SDG } from '../../utils/constants';

const StatCard = ({ icon, label, value, sub, color='var(--brand)' }) => (
  <div style={{ background:'#fff', border:'1px solid var(--gray-200)', borderRadius:16, padding:24, display:'flex', flexDirection:'column', gap:12 }}>
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
      <div style={{ width:44, height:44, borderRadius:12, background:`${color}12`, color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>
        {icon}
      </div>
      {sub && <span style={{ fontSize:11, color:'var(--gray-400)', background:'var(--gray-50)', padding:'3px 8px', borderRadius:6 }}>{sub}</span>}
    </div>
    <div>
      <p style={{ fontSize:28, fontWeight:900, color:'var(--gray-900)', letterSpacing:'-1px', fontFamily:'var(--font)' }}>{value}</p>
      <p style={{ fontSize:13, color:'var(--gray-400)', marginTop:4 }}>{label}</p>
    </div>
  </div>
);

export default function DonorDashboard() {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ['donor-dashboard'],
    queryFn:  dashboardSvc.donor,
    staleTime: 60000,
  });

  const summary   = data?.summary         || {};
  const donations = data?.recent_donations || [];
  const bySDG     = data?.impact_by_sdg   || [];

  return (
    <>
      <Helmet><title>My Dashboard — Impact Bridge</title></Helmet>

      {/* Header */}
      <div style={{ marginBottom:32 }}>
        <h1 style={{ fontSize:26, fontWeight:800, color:'var(--gray-900)', letterSpacing:'-.5px', marginBottom:6 }}>
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {user?.first_name}! 👋
        </h1>
        <p style={{ fontSize:14, color:'var(--gray-400)' }}>
          Here's an overview of your impact on Impact Bridge.
        </p>
      </div>

      {isLoading ? (
        <CardSkeleton count={4} />
      ) : (
        <>
          {/* Stats */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:20, marginBottom:32 }} className="donor-stats">
            <StatCard icon={<MdVolunteerActivism />} label="Total Donated" value={currency(summary.total_donated||0)} color="var(--brand)" />
            <StatCard icon="🎯" label="Donations Made" value={(summary.donation_count||0).toLocaleString()} color="var(--success)" />
            <StatCard icon="✅" label="Cases Completed" value={(summary.completed_cases||0).toLocaleString()} color="var(--info)" />
            <StatCard icon="🌍" label="SDGs Supported" value={bySDG.length} color="#8B5CF6" />
          </div>

          {/* Recent + SDG impact */}
          <div style={{ display:'grid', gridTemplateColumns:'1.5fr 1fr', gap:24, marginBottom:32 }} className="donor-grid">

            {/* Recent donations */}
            <div style={{ background:'#fff', border:'1px solid var(--gray-200)', borderRadius:16, overflow:'hidden' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'20px 24px', borderBottom:'1px solid var(--gray-100)' }}>
                <h2 style={{ fontSize:16, fontWeight:700, color:'var(--gray-900)', margin:0 }}>Recent Donations</h2>
                <Link to="/donor/donations" style={{ fontSize:12, color:'var(--brand)', fontWeight:700, display:'flex', alignItems:'center', gap:4 }}>View all <MdArrowForward size={14} /></Link>
              </div>
              {donations.length > 0 ? (
                <div>
                  {donations.map((d, i) => (
                    <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 24px', borderBottom: i < donations.length-1 ? '1px solid var(--gray-50)' : 'none' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                        <div style={{ width:40, height:40, borderRadius:12, background:SDG[d.request?.sdg_number]?.color ? `${SDG[d.request?.sdg_number]?.color}15` : 'var(--brand-50)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>
                          {SDG[d.request?.sdg_number]?.icon || '💙'}
                        </div>
                        <div style={{ minWidth:0 }}>
                          <p style={{ fontWeight:600, fontSize:14, color:'var(--gray-800)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:220 }}>
                            {d.request?.title || 'General Fund'}
                          </p>
                          <p style={{ fontSize:12, color:'var(--gray-400)', marginTop:2 }}>{ago(d.created_at)}</p>
                        </div>
                      </div>
                      <div style={{ textAlign:'right', flexShrink:0 }}>
                        <p style={{ fontWeight:700, color:'var(--brand)', fontSize:14 }}>{currency(d.amount)}</p>
                        <Badge status={d.request?.status} size="xs" style={{ marginTop:4 }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding:'40px 24px' }}>
                  <Empty icon="💙" title="No donations yet" message="Browse verified cases and make your first impact!"
                    action={() => {}} actionLabel="Browse Cases" />
                </div>
              )}
            </div>

            {/* SDG breakdown */}
            <div style={{ background:'#fff', border:'1px solid var(--gray-200)', borderRadius:16, overflow:'hidden' }}>
              <div style={{ padding:'20px 24px', borderBottom:'1px solid var(--gray-100)' }}>
                <h2 style={{ fontSize:16, fontWeight:700, color:'var(--gray-900)', margin:0 }}>Impact by SDG</h2>
              </div>
              {bySDG.length > 0 ? (
                <div style={{ padding:'8px 0' }}>
                  {bySDG.slice(0,8).map((s, i) => {
                    const sdg = SDG[s._id?.sdg] || {};
                    return (
                      <div key={i} style={{ display:'flex', alignItems:'center', gap:14, padding:'10px 24px' }}>
                        <span style={{ fontSize:22, flexShrink:0 }}>{sdg.icon || '🌍'}</span>
                        <div style={{ flex:1, minWidth:0 }}>
                          <p style={{ fontSize:13, fontWeight:600, color:'var(--gray-700)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{sdg.title || `SDG ${s._id?.sdg}`}</p>
                          <div style={{ background:'var(--gray-100)', borderRadius:999, height:5, overflow:'hidden', marginTop:5 }}>
                            <div style={{ width:`${Math.min(100, (s.total / (bySDG[0]?.total||1)) * 100)}%`, height:'100%', background:sdg.color||'var(--brand)', borderRadius:999 }} />
                          </div>
                        </div>
                        <p style={{ fontSize:13, fontWeight:700, color:'var(--gray-800)', flexShrink:0 }}>{currency(s.total)}</p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ padding:'40px 24px' }}>
                  <Empty icon="🌍" title="No SDG data yet" message="Your SDG impact breakdown will appear here after your first donation." />
                </div>
              )}
            </div>
          </div>

          {/* Quick actions */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }} className="donor-actions">
            {[
              { to:'/requests', icon:'🔍', title:'Browse Cases', desc:'Find verified cases to support', color:'var(--brand)' },
              { to:'/donor/impact', icon:'📊', title:'My Impact Report', desc:'See your full donation history', color:'var(--success)' },
              { to:'/sdg', icon:'🌍', title:'Explore SDGs', desc:'Learn about all 17 global goals', color:'#8B5CF6' },
            ].map(a => (
              <Link key={a.to} to={a.to} style={{ background:'#fff', border:'1px solid var(--gray-200)', borderRadius:14, padding:'20px 22px', display:'flex', flexDirection:'column', gap:12, transition:'all 150ms' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor=a.color; e.currentTarget.style.boxShadow=`0 4px 16px ${a.color}15`; e.currentTarget.style.transform='translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='var(--gray-200)'; e.currentTarget.style.boxShadow='none'; e.currentTarget.style.transform='translateY(0)'; }}>
                <span style={{ fontSize:28 }}>{a.icon}</span>
                <div>
                  <p style={{ fontWeight:700, fontSize:15, color:'var(--gray-900)', marginBottom:4 }}>{a.title}</p>
                  <p style={{ fontSize:13, color:'var(--gray-400)' }}>{a.desc}</p>
                </div>
                <MdArrowForward size={18} style={{ color:a.color, marginTop:'auto' }} />
              </Link>
            ))}
          </div>
        </>
      )}

      <style>{`
        @media(max-width:1024px){.donor-stats{grid-template-columns:repeat(2,1fr)!important}.donor-grid{grid-template-columns:1fr!important}}
        @media(max-width:640px){.donor-stats{grid-template-columns:1fr 1fr!important}.donor-actions{grid-template-columns:1fr!important}}
      `}</style>
    </>
  );
}