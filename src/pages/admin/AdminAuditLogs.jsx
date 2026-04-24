import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { TableSkeleton } from '../../components/common/Loader';
import Pagination from '../../components/common/Pagination';
import Empty from '../../components/common/Empty';
import { fmtDate, ago } from '../../utils/helpers';

const fetchLogs = (params) => api.get('/admin/audit-logs', { params }).then(r => r.data);

const ACTION_COLORS = {
  APPROVE:   { color:'#10b981', bg:'#ecfdf5' },
  VERIFY:    { color:'#10b981', bg:'#ecfdf5' },
  REJECT:    { color:'#ef4444', bg:'#fef2f2' },
  SUSPEND:   { color:'#ef4444', bg:'#fef2f2' },
  CREATE:    { color:'#3b82f6', bg:'#eff6ff' },
  UPDATE:    { color:'#f59e0b', bg:'#fffbeb' },
  DELETE:    { color:'#ef4444', bg:'#fef2f2' },
  FLAG_FRAUD:{ color:'#ef4444', bg:'#fef2f2' },
  ALLOCATE:  { color:'#8b5cf6', bg:'#f5f3ff' },
  FREEZE:    { color:'#f59e0b', bg:'#fffbeb' },
  COMPLETE:  { color:'#10b981', bg:'#ecfdf5' },
};

export default function AdminAuditLogs() {
  const [page,    setPage]   = useState(1);
  const [action,  setAction] = useState('');
  const [resource,setRes]    = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['audit-logs', page, action, resource],
    queryFn:  () => fetchLogs({ page, limit:25, ...(action ? { action } : {}), ...(resource ? { resource } : {}) }),
    keepPreviousData: true,
    staleTime: 30000,
  });

  const logs = data?.data || [];
  const pgn  = data?.pagination || {};

  const selStyle = { padding:'7px 30px 7px 12px', border:'1.5px solid #e2e8f0', borderRadius:8, fontSize:12, fontWeight:500, outline:'none', cursor:'pointer', background:`#fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 12 12'%3E%3Cpath fill='%2394A3B8' d='M6 8L1 3h10z'/%3E%3C/svg%3E") right 9px center no-repeat`, appearance:'none', fontFamily:'inherit' };

  return (
    <>
      <Helmet><title>Audit Logs — Impact Bridge Admin</title></Helmet>

      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontSize:24, fontWeight:800, color:'#0d0f14', letterSpacing:'-.4px', marginBottom:4 }}>Audit Logs</h1>
        <p style={{ fontSize:13, color:'#64748b' }}>Complete audit trail of all admin actions. Auto-deleted after 90 days.</p>
      </div>

      {/* Filters */}
      <div style={{ display:'flex', gap:10, marginBottom:20, flexWrap:'wrap' }}>
        <select value={action} onChange={e => { setAction(e.target.value); setPage(1); }} style={selStyle}>
          <option value="">All Actions</option>
          {['APPROVE','VERIFY','REJECT','CREATE','UPDATE','DELETE','SUSPEND','ACTIVATE','FREEZE','ALLOCATE','FLAG_FRAUD'].map(a => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
        <select value={resource} onChange={e => { setRes(e.target.value); setPage(1); }} style={selStyle}>
          <option value="">All Resources</option>
          {['Request','Project','User','Wallet','Payment','NGO'].map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        {(action || resource) && (
          <button onClick={() => { setAction(''); setRes(''); setPage(1); }}
            style={{ fontSize:12, fontWeight:600, color:'#ef4444', padding:'7px 12px', border:'1.5px solid #fecaca', borderRadius:8, background:'#fef2f2', cursor:'pointer' }}>
            Clear
          </button>
        )}
      </div>

      {isLoading ? <TableSkeleton rows={10} /> : logs.length > 0 ? (
        <>
          <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:16, overflow:'hidden' }}>
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead>
                  <tr>
                    {['Admin','Action','Resource','IP','Timestamp'].map(h => (
                      <th key={h} style={{ padding:'10px 18px', textAlign:'left', fontSize:10, fontWeight:700, color:'#94a3b8', background:'#f8fafc', borderBottom:'1px solid #f1f5f9', textTransform:'uppercase', letterSpacing:'.07em', whiteSpace:'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log, i) => {
                    const ac = ACTION_COLORS[log.action] || { color:'#64748b', bg:'#f1f5f9' };
                    return (
                      <tr key={log._id} style={{ borderBottom: i<logs.length-1 ? '1px solid #f8fafc' : 'none' }}
                        onMouseEnter={e => e.currentTarget.style.background='#f8fafc'}
                        onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                        <td style={{ padding:'12px 18px' }}>
                          <p style={{ fontWeight:700, fontSize:13, color:'#334155' }}>{log.user?.first_name} {log.user?.last_name}</p>
                          <p style={{ fontSize:11, color:'#94a3b8', marginTop:1 }}>{log.user?.email}</p>
                        </td>
                        <td style={{ padding:'12px 18px' }}>
                          <span style={{ fontSize:11, fontWeight:700, padding:'3px 9px', borderRadius:6, color:ac.color, background:ac.bg, textTransform:'uppercase', letterSpacing:'.05em' }}>
                            {log.action}
                          </span>
                        </td>
                        <td style={{ padding:'12px 18px', fontSize:12, color:'#64748b' }}>
                          <span style={{ fontWeight:600, color:'#334155' }}>{log.resource}</span>
                          {log.resource_id && <span style={{ fontSize:10, color:'#94a3b8', fontFamily:'monospace', marginLeft:6 }}>{String(log.resource_id).slice(-8)}</span>}
                        </td>
                        <td style={{ padding:'12px 18px', fontSize:11, color:'#94a3b8', fontFamily:'monospace' }}>
                          {log.ip_address || '—'}
                        </td>
                        <td style={{ padding:'12px 18px', fontSize:11, color:'#94a3b8', whiteSpace:'nowrap' }}>
                          <p>{fmtDate(log.timestamp, 'MMM dd, yyyy')}</p>
                          <p style={{ marginTop:2 }}>{fmtDate(log.timestamp, 'HH:mm:ss')}</p>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination page={pgn.page} pages={pgn.pages} onPageChange={setPage} />
        </>
      ) : (
        <Empty icon="📋" title="No audit logs found" message="Admin actions will be recorded here." />
      )}
    </>
  );
}