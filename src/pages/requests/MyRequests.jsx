import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  MdAdd, MdArrowForward, MdRefresh, MdOpenInNew,
  MdCheckCircle, MdPending, MdCancel, MdInfo,
} from 'react-icons/md';
import requestService from '../../services/requestService';
import { useAuth } from '../../context/AuthContext';
import Badge from '../../components/common/Badge';
import ProgressBar from '../../components/common/ProgressBar';
import Empty from '../../components/common/Empty';
import Pagination from '../../components/common/Pagination';
import { TableSkeleton } from '../../components/common/Loader';
import { currency, ago, clip, pct } from '../../utils/helpers';

const STATUS_INFO = {
  draft:        { icon:'📝', msg:'Saved as draft. Submit when ready.' },
  submitted:    { icon:'📤', msg:'Submitted and awaiting review by our team.' },
  under_review: { icon:'🔍', msg:'Our team is actively reviewing your request.' },
  verified:     { icon:'✅', msg:'Verified! Your case is live and visible to donors.' },
  rejected:     { icon:'❌', msg:'Not approved. Check rejection reason and resubmit.' },
  funded:       { icon:'💰', msg:'Fully funded! Awaiting execution by assigned NGO.' },
  in_progress:  { icon:'🏗️', msg:'Work has started. Follow progress updates.' },
  completed:    { icon:'🎉', msg:'Project completed successfully!' },
};

export default function MyRequests() {
  const { user }   = useAuth();
  const navigate   = useNavigate();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['my-requests', page, statusFilter],
    queryFn:  () => requestService.getMine({ page, limit: 10, ...(statusFilter ? { status: statusFilter } : {}) }),
    staleTime: 30000,
  });

  const requests   = data?.data       || [];
  const pagination = data?.pagination || {};

  const statuses = ['submitted','under_review','verified','rejected','funded','in_progress','completed'];

  return (
    <>
      <Helmet><title>My Requests — Impact Bridge</title></Helmet>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:28, flexWrap:'wrap', gap:16 }}>
        <div>
          <h1 style={{ fontSize:24, fontWeight:800, color:'#0d0f14', letterSpacing:'-.4px', marginBottom:4 }}>
            My Requests
          </h1>
          <p style={{ fontSize:13, color:'#64748b' }}>
            Track the status of all your submitted social impact requests.
          </p>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={() => refetch()} style={{ display:'flex', alignItems:'center', gap:6, padding:'9px 14px', borderRadius:10, fontSize:13, fontWeight:600, color:'#475569', background:'#fff', border:'1.5px solid #e2e8f0', cursor:'pointer' }}>
            <MdRefresh size={15} /> Refresh
          </button>
          <Link to="/submit-request" style={{ display:'flex', alignItems:'center', gap:7, padding:'9px 18px', background:'#e85d04', color:'#fff', borderRadius:10, fontSize:13, fontWeight:700, transition:'all 140ms' }}
            onMouseEnter={e => e.currentTarget.style.background='#c94d03'}
            onMouseLeave={e => e.currentTarget.style.background='#e85d04'}>
            <MdAdd size={17} /> Submit New Request
          </Link>
        </div>
      </div>

      {/* Status filter tabs */}
      <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:20 }}>
        {[{ value:'', label:'All' }, ...statuses.map(s => ({ value:s, label:s.replace(/_/g,' ') }))].map(tab => (
          <button key={tab.value} onClick={() => { setStatusFilter(tab.value); setPage(1); }}
            style={{
              padding:'6px 14px', borderRadius:999, fontSize:12, fontWeight:600, cursor:'pointer',
              border:`1.5px solid ${statusFilter===tab.value ? '#e85d04' : '#e2e8f0'}`,
              background: statusFilter===tab.value ? '#fff4ee' : '#fff',
              color:      statusFilter===tab.value ? '#e85d04' : '#64748b',
              textTransform:'capitalize', transition:'all 140ms',
            }}>
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <TableSkeleton rows={5} />
      ) : requests.length > 0 ? (
        <>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {requests.map(req => {
              const info  = STATUS_INFO[req.status] || STATUS_INFO.submitted;
              const p     = pct(req.amount_raised, req.amount_needed);
              return (
                <div key={req._id} style={{
                  background:'#fff', border:'1px solid #e2e8f0', borderRadius:16,
                  overflow:'hidden', boxShadow:'0 1px 3px rgba(0,0,0,.05)',
                  transition:'all 150ms',
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow='var(--shadow-md)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow='0 1px 3px rgba(0,0,0,.05)'}>

                  {/* Status bar */}
                  <div style={{
                    height:3,
                    background: {
                      verified:'#10b981', completed:'#10b981',
                      funded:'#8b5cf6', in_progress:'#f59e0b',
                      rejected:'#ef4444',
                    }[req.status] || '#e85d04',
                  }} />

                  <div style={{ padding:'20px 22px' }}>
                    <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:16, marginBottom:14 }}>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
                          <Badge status={req.status} size="sm" dot />
                          <span style={{ fontSize:11, color:'#94a3b8' }}>{ago(req.created_at)}</span>
                        </div>
                        <h3 style={{ fontSize:16, fontWeight:700, color:'#0d0f14', marginBottom:6, lineHeight:1.35 }}>
                          {req.title}
                        </h3>
                        {/* Status message */}
                        <div style={{ display:'flex', alignItems:'center', gap:8, fontSize:13, color:'#475569' }}>
                          <span>{info.icon}</span>
                          <span>{info.msg}</span>
                        </div>
                      </div>

                      <div style={{ textAlign:'right', flexShrink:0 }}>
                        <p style={{ fontSize:18, fontWeight:900, color:'#e85d04' }}>{currency(req.amount_needed)}</p>
                        <p style={{ fontSize:12, color:'#94a3b8', marginTop:2 }}>Goal amount</p>
                      </div>
                    </div>

                    {/* Progress (only for funded+ cases) */}
                    {['funded','in_progress','completed'].includes(req.status) && (
                      <div style={{ marginBottom:14 }}>
                        <ProgressBar value={p} max={100} height={7} showLabel />
                        <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:'#94a3b8', marginTop:6 }}>
                          <span>{currency(req.amount_raised)} raised</span>
                          <span>{req.donor_count || 0} donors</span>
                        </div>
                      </div>
                    )}

                    {/* Rejection reason */}
                    {req.status === 'rejected' && req.verification?.rejection_reason && (
                      <div style={{ display:'flex', alignItems:'flex-start', gap:10, background:'#fef2f2', border:'1px solid #fecaca', borderRadius:10, padding:'12px 14px', marginBottom:14 }}>
                        <MdCancel size={16} style={{ color:'#ef4444', flexShrink:0, marginTop:1 }} />
                        <div>
                          <p style={{ fontSize:12, fontWeight:700, color:'#991b1b', marginBottom:2 }}>Rejection Reason</p>
                          <p style={{ fontSize:12, color:'#b91c1c', lineHeight:1.6 }}>{req.verification.rejection_reason}</p>
                        </div>
                      </div>
                    )}

                    {/* Under review notice */}
                    {req.status === 'under_review' && (
                      <div style={{ display:'flex', alignItems:'center', gap:10, background:'#fffbeb', border:'1px solid #fde68a', borderRadius:10, padding:'10px 14px', marginBottom:14 }}>
                        <MdInfo size={16} style={{ color:'#f59e0b', flexShrink:0 }} />
                        <p style={{ fontSize:12, color:'#92400e' }}>Our team typically completes verification within 24–48 hours.</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', paddingTop:12, borderTop:'1px solid #f1f5f9' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:12, fontSize:12, color:'#94a3b8' }}>
                        <span>📍 {req.state}{req.lga ? `, ${req.lga}` : ''}</span>
                        <span>🏷️ {req.category?.replace(/_/g,' ')}</span>
                      </div>
                      <div style={{ display:'flex', gap:8 }}>
                        {req.status === 'verified' && (
                          <Link to={`/requests/${req._id}`}
                            style={{ display:'flex', alignItems:'center', gap:5, padding:'7px 14px', background:'#e85d04', color:'#fff', borderRadius:8, fontSize:12, fontWeight:700 }}>
                            View Live Case <MdOpenInNew size={13} />
                          </Link>
                        )}
                        {['draft','submitted'].includes(req.status) && (
                          <Link to={`/submit-request?edit=${req._id}`}
                            style={{ display:'flex', alignItems:'center', gap:5, padding:'7px 14px', border:'1.5px solid #e2e8f0', color:'#475569', borderRadius:8, fontSize:12, fontWeight:700 }}>
                            Edit Request
                          </Link>
                        )}
                        {req.status === 'rejected' && (
                          <Link to="/submit-request"
                            style={{ display:'flex', alignItems:'center', gap:5, padding:'7px 14px', background:'#e85d04', color:'#fff', borderRadius:8, fontSize:12, fontWeight:700 }}>
                            Resubmit
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <Pagination page={pagination.page} pages={pagination.pages} onPageChange={p => { setPage(p); window.scrollTo({ top:0, behavior:'smooth' }); }} />
        </>
      ) : (
        <Empty
          icon="📋"
          title="No requests yet"
          message="You haven't submitted any requests yet. Start by clicking 'Submit New Request' above."
          action={() => navigate('/submit-request')}
          actionLabel="Submit Your First Request"
        />
      )}
    </>
  );
}