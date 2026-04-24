import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { MdSearch, MdClose, MdDownload } from 'react-icons/md';
import api from '../../services/api';
import { TableSkeleton } from '../../components/common/Loader';
import Badge from '../../components/common/Badge';
import Pagination from '../../components/common/Pagination';
import Empty from '../../components/common/Empty';
import { currency, fmtDate, ago, clip } from '../../utils/helpers';

const fetchPayments = (params) => api.get('/admin/payments', { params }).then(r => r.data);

const GATEWAY_COLORS = {
  korapay:     '#10B981',
  paystack:    '#3B82F6',
  flutterwave: '#F59E0B',
};

const SEL = { padding:'7px 30px 7px 12px', border:'1.5px solid #E2E8F0', borderRadius:8, fontSize:12, fontWeight:500, outline:'none', cursor:'pointer', background:`#fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 12 12'%3E%3Cpath fill='%2394A3B8' d='M6 8L1 3h10z'/%3E%3C/svg%3E") right 9px center no-repeat`, appearance:'none' };

export default function AdminPayments() {
  const [page,    setPage]    = useState(1);
  const [status,  setStatus]  = useState('');
  const [gateway, setGateway] = useState('');

  const params = { page, limit:20, ...(status ? { status } : {}), ...(gateway ? { gateway } : {}) };

  const { data, isLoading } = useQuery({
    queryKey: ['admin-payments', params],
    queryFn:  () => fetchPayments(params),
    keepPreviousData: true,
  });

  const payments = data?.data       || [];
  const summary  = data?.summary    || [];
  const pgn      = data?.pagination || {};

  return (
    <>
      <Helmet><title>Payments — Impact Bridge Admin</title></Helmet>

      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontSize:26, fontWeight:800, color:'#0F172A', letterSpacing:'-.5px', marginBottom:6 }}>Payment Management</h1>
        <p style={{ fontSize:14, color:'#64748B' }}>All payment transactions across the platform.</p>
      </div>

      {/* Gateway summary */}
      {summary.length > 0 && (
        <div style={{ display:'grid', gridTemplateColumns:`repeat(${summary.length},1fr)`, gap:16, marginBottom:24 }}>
          {summary.map(s => (
            <div key={s._id} style={{ background:'#fff', border:'1px solid #E2E8F0', borderRadius:14, padding:'20px 22px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
                <div style={{ width:10, height:10, borderRadius:'50%', background: GATEWAY_COLORS[s._id] || '#64748B' }} />
                <span style={{ fontSize:12, fontWeight:700, color:'#64748B', textTransform:'capitalize' }}>{s._id}</span>
              </div>
              <p style={{ fontSize:22, fontWeight:900, color:'#0F172A', letterSpacing:'-1px', marginBottom:4 }}>
                {currency(s.total_amount)}
              </p>
              <p style={{ fontSize:12, color:'#94A3B8' }}>{s.count.toLocaleString()} transactions</p>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div style={{ display:'flex', gap:10, marginBottom:20, flexWrap:'wrap' }}>
        <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }} style={SEL}>
          <option value="">All Statuses</option>
          {['success','pending','failed','refunded','disputed'].map(s => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>
          ))}
        </select>
        <select value={gateway} onChange={e => { setGateway(e.target.value); setPage(1); }} style={SEL}>
          <option value="">All Gateways</option>
          {['korapay','paystack','flutterwave'].map(g => (
            <option key={g} value={g}>{g.charAt(0).toUpperCase()+g.slice(1)}</option>
          ))}
        </select>
        {(status || gateway) && (
          <button onClick={() => { setStatus(''); setGateway(''); setPage(1); }}
            style={{ fontSize:12, color:'#EF4444', fontWeight:600, padding:'7px 12px', border:'1.5px solid #FECACA', borderRadius:8, background:'#FEF2F2', cursor:'pointer' }}>
            Clear
          </button>
        )}
      </div>

      {/* Table */}
      {isLoading ? (
        <TableSkeleton rows={10} />
      ) : payments.length > 0 ? (
        <div style={{ background:'#fff', border:'1px solid #E2E8F0', borderRadius:16, overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,.05)' }}>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr>
                  {['Reference','Donor','Case','Amount','Gateway','Status','Date'].map(h => (
                    <th key={h} style={{ padding:'11px 20px', textAlign:'left', fontSize:10, fontWeight:700, color:'#94A3B8', background:'#F8FAFC', borderBottom:'1px solid #E2E8F0', textTransform:'uppercase', letterSpacing:'.07em', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {payments.map((p, i) => (
                  <tr key={p._id} style={{ borderBottom: i<payments.length-1 ? '1px solid #F1F5F9' : 'none', transition:'background 100ms' }}
                    onMouseEnter={e => e.currentTarget.style.background='#F8FAFC'}
                    onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                    <td style={{ padding:'13px 20px' }}>
                      <p style={{ fontFamily:'monospace', fontSize:11, color:'#64748B', fontWeight:600 }}>
                        {p.reference?.slice(0,22) || '—'}
                      </p>
                    </td>
                    <td style={{ padding:'13px 20px' }}>
                      <p style={{ fontSize:13, fontWeight:600, color:'#0F172A', whiteSpace:'nowrap' }}>
                        {p.donor ? `${p.donor.first_name} ${p.donor.last_name?.[0]}.` : 'Unknown'}
                      </p>
                    </td>
                    <td style={{ padding:'13px 20px', maxWidth:200 }}>
                      <p style={{ fontSize:12, color:'#64748B', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                        {p.request?.title ? clip(p.request.title, 40) : 'General Fund'}
                      </p>
                    </td>
                    <td style={{ padding:'13px 20px', whiteSpace:'nowrap' }}>
                      <strong style={{ fontSize:14, color: p.status==='success' ? '#10B981' : '#334155' }}>
                        {currency(p.amount)}
                      </strong>
                    </td>
                    <td style={{ padding:'13px 20px' }}>
                      <span style={{
                        fontSize:11, fontWeight:700, padding:'3px 9px', borderRadius:6,
                        color:       GATEWAY_COLORS[p.gateway] || '#64748B',
                        background:  `${GATEWAY_COLORS[p.gateway] || '#64748B'}12`,
                        textTransform:'capitalize',
                      }}>
                        {p.gateway}
                      </span>
                    </td>
                    <td style={{ padding:'13px 20px' }}>
                      <Badge status={p.status} size="sm" dot />
                    </td>
                    <td style={{ padding:'13px 20px', fontSize:12, color:'#94A3B8', whiteSpace:'nowrap' }}>
                      {fmtDate(p.created_at, 'MMM dd, HH:mm')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <Empty icon="💰" title="No payments found" message="Try adjusting your filters." />
      )}

      {pgn.pages > 1 && <Pagination page={pgn.page} pages={pgn.pages} onPageChange={setPage} />}
    </>
  );
}