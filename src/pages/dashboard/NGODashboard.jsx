import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { MdArrowForward } from 'react-icons/md';
import dashboardSvc from '../../services/dashboardService';
import Badge from '../../components/common/Badge';
import { CardSkeleton } from '../../components/common/Loader';
import Empty from '../../components/common/Empty';
import { currency, ago, clip } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';

export default function NGODashboard() {
  const { user } = useAuth();
  const { data, isLoading } = useQuery({ queryKey:['ngo-dashboard'], queryFn: dashboardSvc.ngo, staleTime: 60000 });

  const stats  = data?.stats         || {};
  const cases  = data?.assigned_cases|| [];

  return (
    <>
      <Helmet><title>NGO Dashboard — Impact Bridge</title></Helmet>

      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontSize:26, fontWeight:800, color:'var(--gray-900)', letterSpacing:'-.5px', marginBottom:6 }}>NGO Dashboard</h1>
        <p style={{ fontSize:14, color:'var(--gray-400)' }}>Manage your assigned cases and submit field reports.</p>
      </div>

      {isLoading ? <CardSkeleton count={4} /> : (
        <>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:20, marginBottom:28 }} className="ngo-stats">
            {[
              { l:'Assigned Cases',  v: stats.verified||0,     c:'var(--brand)'   },
              { l:'In Progress',     v: stats.in_progress||0,  c:'var(--info)'    },
              { l:'Completed',       v: stats.completed||0,    c:'var(--success)' },
              { l:'Reports Pending', v: stats.reports_pending||0, c:'var(--warning)' },
            ].map(s => (
              <div key={s.l} style={{ background:'#fff', border:'1px solid var(--gray-200)', borderRadius:16, padding:24 }}>
                <p style={{ fontSize:28, fontWeight:900, color:s.c, letterSpacing:'-1px', fontFamily:'var(--font)' }}>{s.v}</p>
                <p style={{ fontSize:13, color:'var(--gray-400)', marginTop:6 }}>{s.l}</p>
              </div>
            ))}
          </div>

          <div style={{ background:'#fff', border:'1px solid var(--gray-200)', borderRadius:16, overflow:'hidden' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'20px 24px', borderBottom:'1px solid var(--gray-100)' }}>
              <h2 style={{ fontSize:16, fontWeight:700, color:'var(--gray-900)', margin:0 }}>Assigned Cases</h2>
              <Link to="/ngo/cases" style={{ fontSize:12, color:'var(--brand)', fontWeight:700, display:'flex', alignItems:'center', gap:4 }}>View all <MdArrowForward size={14} /></Link>
            </div>

            {cases.length > 0 ? (
              <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead>
                  <tr>
                    {['Case','Location','Amount','Status','Urgency','Added'].map(h => (
                      <th key={h} style={{ padding:'10px 20px', textAlign:'left', fontSize:10, fontWeight:700, color:'var(--gray-400)', background:'var(--gray-50)', borderBottom:'1px solid var(--gray-100)', textTransform:'uppercase', letterSpacing:'.06em', whiteSpace:'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cases.map((c, i) => (
                    <tr key={c._id} style={{ borderBottom: i<cases.length-1 ? '1px solid var(--gray-50)' : 'none' }}>
                      <td style={{ padding:'12px 20px' }}>
                        <Link to={`/requests/${c._id}`} style={{ fontWeight:700, fontSize:13, color:'var(--gray-900)' }}
                          onMouseEnter={e => e.currentTarget.style.color='var(--brand)'}
                          onMouseLeave={e => e.currentTarget.style.color='var(--gray-900)'}>
                          {clip(c.title, 55)}
                        </Link>
                      </td>
                      <td style={{ padding:'12px 20px', fontSize:13, color:'var(--gray-500)', whiteSpace:'nowrap' }}>{c.state}, {c.lga}</td>
                      <td style={{ padding:'12px 20px', fontSize:13, fontWeight:700, color:'var(--brand)', whiteSpace:'nowrap' }}>{currency(c.amount_needed)}</td>
                      <td style={{ padding:'12px 20px' }}><Badge status={c.status} size="sm" dot /></td>
                      <td style={{ padding:'12px 20px', fontSize:12, color:'var(--gray-400)' }}>{c.urgency}</td>
                      <td style={{ padding:'12px 20px', fontSize:12, color:'var(--gray-400)', whiteSpace:'nowrap' }}>{ago(c.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ padding:'48px 24px' }}><Empty icon="📋" title="No cases assigned yet" message="Cases will appear here once they are assigned to your NGO." /></div>
            )}
          </div>
        </>
      )}

      <style>{`@media(max-width:900px){.ngo-stats{grid-template-columns:repeat(2,1fr)!important}}`}</style>
    </>
  );
}