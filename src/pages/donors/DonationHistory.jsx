import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import paymentService from '../../services/paymentService';
import { CardSkeleton } from '../../components/common/Loader';
import Badge from '../../components/common/Badge';
import Pagination from '../../components/common/Pagination';
import Empty from '../../components/common/Empty';
import { currency, fmtDate, ago } from '../../utils/helpers';
import { SDG } from '../../utils/constants';

export default function DonationHistory() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['donation-history', page],
    queryFn:  () => paymentService.history({ page, limit:20 }),
    staleTime: 60000,
  });

  const payments = Array.isArray(data) ? data : data?.payments || [];
  const pgn      = data?.pagination || {};

  return (
    <>
      <Helmet><title>My Donations — Impact Bridge</title></Helmet>

      <div style={{ marginBottom:32 }}>
        <h1 style={{ fontSize:26, fontWeight:800, color:'#0F172A', letterSpacing:'-.5px', marginBottom:6 }}>
          My Donations
        </h1>
        <p style={{ fontSize:14, color:'#64748B' }}>Your complete donation history on Impact Bridge.</p>
      </div>

      {isLoading ? (
        <CardSkeleton count={5} cols={1} />
      ) : payments.length > 0 ? (
        <>
          {/* Summary */}
          <div style={{ background:'linear-gradient(135deg,#E85D04,#C24E03)', borderRadius:16, padding:24, marginBottom:28, color:'#fff' }}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24, textAlign:'center' }}>
              {[
                { label:'Total Donated',   value: currency(payments.reduce((a, p) => a + (p.amount||0), 0)) },
                { label:'Total Donations', value: payments.length },
                { label:'Cases Supported', value: [...new Set(payments.filter(p => p.request).map(p => p.request?._id||p.request))].length },
              ].map(s => (
                <div key={s.label}>
                  <p style={{ fontSize:24, fontWeight:900, letterSpacing:'-1px' }}>{s.value}</p>
                  <p style={{ fontSize:12, opacity:.8, marginTop:4 }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* List */}
          <div style={{ background:'#fff', border:'1px solid #E2E8F0', borderRadius:16, overflow:'hidden' }}>
            {payments.map((p, i) => {
              const sdg = SDG[p.request?.sdg_number] || {};
              return (
                <div key={p._id || i} style={{
                  display:'flex', alignItems:'center', gap:16,
                  padding:'18px 24px',
                  borderBottom: i < payments.length-1 ? '1px solid #F1F5F9' : 'none',
                  transition:'background 100ms',
                }}
                onMouseEnter={e => e.currentTarget.style.background='#F8FAFC'}
                onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                  {/* SDG icon */}
                  <div style={{
                    width:48, height:48, borderRadius:14, flexShrink:0,
                    background: sdg.color ? `${sdg.color}15` : '#FFF4EE',
                    display:'flex', alignItems:'center', justifyContent:'center', fontSize:24,
                  }}>
                    {sdg.icon || '💙'}
                  </div>

                  {/* Info */}
                  <div style={{ flex:1, minWidth:0 }}>
                    {p.request ? (
                      <Link to={`/requests/${p.request._id || p.request}`} style={{ fontWeight:700, fontSize:14, color:'#0F172A', display:'block', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', transition:'color 150ms' }}
                        onMouseEnter={e => e.currentTarget.style.color='#E85D04'}
                        onMouseLeave={e => e.currentTarget.style.color='#0F172A'}>
                        {p.request?.title || 'Funded Case'}
                      </Link>
                    ) : (
                      <p style={{ fontWeight:700, fontSize:14, color:'#0F172A' }}>
                        {p.fund_type?.replace(/_/g,' ') || 'General Fund'}
                      </p>
                    )}
                    <p style={{ fontSize:12, color:'#94A3B8', marginTop:4 }}>
                      {p.gateway} · {fmtDate(p.created_at)} · {ago(p.created_at)}
                    </p>
                  </div>

                  {/* Status + Amount */}
                  <div style={{ textAlign:'right', flexShrink:0 }}>
                    <p style={{ fontWeight:800, fontSize:16, color:'#E85D04', marginBottom:6 }}>
                      {currency(p.amount)}
                    </p>
                    <Badge status={p.status} size="xs" />
                  </div>
                </div>
              );
            })}
          </div>

          {pgn.pages > 1 && (
            <Pagination page={pgn.page} pages={pgn.pages} onPageChange={p => { setPage(p); window.scrollTo({ top:0, behavior:'smooth' }); }} />
          )}
        </>
      ) : (
        <Empty icon="💙" title="No donations yet"
          message="You haven't made any donations yet. Browse verified cases and make your first impact!"
          action={() => window.location.href='/requests'} actionLabel="Browse Cases" />
      )}
    </>
  );
}