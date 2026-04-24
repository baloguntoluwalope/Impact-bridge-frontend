import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MdVerified, MdCancel, MdInfo, MdOpenInNew } from 'react-icons/md';
import toast from 'react-hot-toast';
import verifSvc from '../../services/verificationService';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Alert from '../../components/common/Alert';
import Pagination from '../../components/common/Pagination';
import { TableSkeleton } from '../../components/common/Loader';
import Empty from '../../components/common/Empty';
import { currency, ago, clip } from '../../utils/helpers';

const SEL = { padding:'7px 30px 7px 12px', border:'1.5px solid var(--gray-200)', borderRadius:8, fontSize:12, fontWeight:500, outline:'none', cursor:'pointer', background:`#fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 12 12'%3E%3Cpath fill='%2394A3B8' d='M6 8L1 3h10z'/%3E%3C/svg%3E") right 9px center no-repeat`, appearance:'none' };

export default function ProjectVerification() {
  const qc = useQueryClient();
  const [page,    setPage]   = useState(1);
  const [modal,   setModal]  = useState({ type:null, item:null });
  const [form,    setForm]   = useState({ reason:'', notes:'', message:'' });
  const [mErr,    setMErr]   = useState('');
  const [creatorFilter, setCreatorFilter] = useState('');

  const { data: stats } = useQuery({ queryKey:['ver-proj-stats'], queryFn: verifSvc.projStats, refetchInterval: 30000 });
  const { data, isLoading } = useQuery({
    queryKey: ['ver-proj-queue', page, creatorFilter],
    queryFn:  () => verifSvc.projQueue({ page, limit:15, ...(creatorFilter ? { creator_type: creatorFilter } : {}) }),
    keepPreviousData: true,
  });

  const items = data?.data || [];
  const pgn   = data?.pagination || {};

  const inv      = () => { qc.invalidateQueries(['ver-proj-queue']); qc.invalidateQueries(['ver-proj-stats']); };
  const openModal = (type, item) => { setModal({ type, item }); setForm({ reason:'', notes:'', message:'' }); setMErr(''); };
  const closeModal = () => { setModal({ type:null, item:null }); setMErr(''); };

  const { mutate: doApprove,  isLoading: approving  } = useMutation({ mutationFn: ({ id, body }) => verifSvc.approveProj(id, body), onSuccess: () => { toast.success('✅ Project approved! Wallet created. Creator emailed.'); closeModal(); inv(); }, onError: e => setMErr(e?.response?.data?.message||'Failed') });
  const { mutate: doReject,   isLoading: rejecting  } = useMutation({ mutationFn: ({ id, body }) => verifSvc.rejectProj(id, body), onSuccess: () => { toast.success('Project rejected — creator notified with reason.'); closeModal(); inv(); }, onError: e => setMErr(e?.response?.data?.message||'Failed') });
  const { mutate: doMoreInfo, isLoading: requesting } = useMutation({ mutationFn: ({ id, body }) => verifSvc.moreInfoProj(id, body), onSuccess: () => { toast.success('Info request sent to project creator.'); closeModal(); inv(); }, onError: e => setMErr(e?.response?.data?.message||'Failed') });

  const S = stats;
  return (
    <>
      <Helmet><title>Project Verification — Impact Bridge Admin</title></Helmet>

      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontSize:26, fontWeight:800, color:'var(--gray-900)', letterSpacing:'-.5px', marginBottom:6 }}>Project Verification Queue</h1>
        <p style={{ fontSize:14, color:'var(--gray-400)' }}>Review sponsored projects submitted by NGOs, corporates, and government. Approved projects are publicly visible for funding.</p>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:16, marginBottom:24 }} className="ver-stats">
        {[
          { l:'Pending',     v: S?.pending    || 0, c:'var(--warning)' },
          { l:'Approved',    v: S?.approved   || 0, c:'var(--success)' },
          { l:'Rejected',    v: S?.rejected   || 0, c:'var(--danger)'  },
          { l:'In Progress', v: S?.in_progress|| 0, c:'var(--brand)'   },
          { l:'Completed',   v: S?.completed  || 0, c:'var(--info)'    },
        ].map(s => (
          <div key={s.l} style={{ background:'#fff', border:'1px solid var(--gray-200)', borderRadius:14, padding:'18px 20px', textAlign:'center' }}>
            <p style={{ fontSize:28, fontWeight:900, color:s.c, letterSpacing:'-1px', fontFamily:'var(--font)' }}>{s.v}</p>
            <p style={{ fontSize:11, color:'var(--gray-400)', fontWeight:600, marginTop:5, textTransform:'uppercase', letterSpacing:'.06em' }}>{s.l}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div style={{ display:'flex', gap:10, marginBottom:20 }}>
        <select value={creatorFilter} onChange={e => setCreatorFilter(e.target.value)} style={SEL}>
          <option value="">All Creator Types</option>
          {['ngo','corporate','government','admin'].map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
        </select>
      </div>

      {/* Table */}
      {isLoading ? (
        <TableSkeleton rows={8} />
      ) : items.length > 0 ? (
        <div style={{ background:'#fff', border:'1px solid var(--gray-200)', borderRadius:16, overflow:'hidden', boxShadow:'var(--shadow-sm)' }}>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr>
                  {['Project','Creator','Budget','Status','Creator Type','Submitted','Actions'].map(h => (
                    <th key={h} style={{ padding:'12px 20px', textAlign:'left', fontSize:10, fontWeight:700, color:'var(--gray-400)', background:'var(--gray-50)', borderBottom:'1px solid var(--gray-200)', textTransform:'uppercase', letterSpacing:'.07em', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={item._id} style={{ borderBottom: i < items.length-1 ? '1px solid var(--gray-50)' : 'none', transition:'background 100ms' }}
                    onMouseEnter={e => e.currentTarget.style.background='var(--gray-50)'}
                    onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                    <td style={{ padding:'14px 20px', maxWidth:260 }}>
                      <div style={{ display:'flex', flexDirection:'column', gap:3 }}>
                        <a href={`/projects/${item._id}`} target="_blank" rel="noopener noreferrer"
                          style={{ fontWeight:700, fontSize:13, color:'var(--gray-900)', display:'flex', alignItems:'center', gap:5 }}
                          onMouseEnter={e => e.currentTarget.style.color='var(--brand)'}
                          onMouseLeave={e => e.currentTarget.style.color='var(--gray-900)'}>
                          {clip(item.title, 55)} <MdOpenInNew size={12} style={{ flexShrink:0, opacity:.5 }} />
                        </a>
                        <span style={{ fontSize:11, color:'var(--gray-400)' }}>
                          SDGs: {item.sdg_goals?.join(', ')} · {item.state}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding:'14px 20px' }}>
                      <p style={{ fontSize:13, fontWeight:600, color:'var(--gray-800)', whiteSpace:'nowrap' }}>{item.created_by?.first_name} {item.created_by?.last_name}</p>
                      <p style={{ fontSize:11, color:'var(--gray-400)', marginTop:2 }}>{item.created_by?.organization_name || item.created_by?.email}</p>
                    </td>
                    <td style={{ padding:'14px 20px', whiteSpace:'nowrap' }}><strong style={{ fontSize:14, color:'var(--brand)' }}>{currency(item.total_budget)}</strong></td>
                    <td style={{ padding:'14px 20px' }}><Badge status={item.status} size="sm" dot /></td>
                    <td style={{ padding:'14px 20px' }}>
                      <span style={{ fontSize:11, fontWeight:700, color:'var(--info)', background:'var(--info-50)', padding:'3px 9px', borderRadius:6, textTransform:'capitalize' }}>
                        {item.creator_type}
                      </span>
                    </td>
                    <td style={{ padding:'14px 20px', fontSize:12, color:'var(--gray-400)', whiteSpace:'nowrap' }}>{ago(item.created_at)}</td>
                    <td style={{ padding:'14px 20px' }}>
                      <div style={{ display:'flex', gap:6 }}>
                        <button title="Approve Project" onClick={() => openModal('approve', item)}
                          style={{ width:32, height:32, borderRadius:8, background:'var(--success-50)', color:'var(--success)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', border:'none', transition:'all 120ms' }}
                          onMouseEnter={e => { e.currentTarget.style.background='var(--success)'; e.currentTarget.style.color='#fff'; }}
                          onMouseLeave={e => { e.currentTarget.style.background='var(--success-50)'; e.currentTarget.style.color='var(--success)'; }}>
                          <MdVerified size={16} />
                        </button>
                        <button title="Request More Info" onClick={() => openModal('more-info', item)}
                          style={{ width:32, height:32, borderRadius:8, background:'var(--warning-50)', color:'var(--warning)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', border:'none', transition:'all 120ms' }}
                          onMouseEnter={e => { e.currentTarget.style.background='var(--warning)'; e.currentTarget.style.color='#fff'; }}
                          onMouseLeave={e => { e.currentTarget.style.background='var(--warning-50)'; e.currentTarget.style.color='var(--warning)'; }}>
                          <MdInfo size={16} />
                        </button>
                        <button title="Reject Project" onClick={() => openModal('reject', item)}
                          style={{ width:32, height:32, borderRadius:8, background:'var(--danger-50)', color:'var(--danger)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', border:'none', transition:'all 120ms' }}
                          onMouseEnter={e => { e.currentTarget.style.background='var(--danger)'; e.currentTarget.style.color='#fff'; }}
                          onMouseLeave={e => { e.currentTarget.style.background='var(--danger-50)'; e.currentTarget.style.color='var(--danger)'; }}>
                          <MdCancel size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <Empty icon="🎉" title="Project queue is empty!" message="No projects are pending approval right now." />
      )}

      {pgn.pages > 1 && <Pagination page={pgn.page} pages={pgn.pages} onPageChange={setPage} />}

      {/* Approve Modal */}
      <Modal isOpen={modal.type==='approve'} onClose={closeModal} title="✅ Approve Sponsored Project" size="md">
        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
          <div style={{ background:'var(--success-50)', border:'1px solid #A7F3D0', borderRadius:12, padding:'14px 18px' }}>
            <p style={{ fontWeight:700, fontSize:15, color:'var(--gray-900)', marginBottom:4 }}>{modal.item?.title}</p>
            <p style={{ fontSize:13, color:'var(--gray-500)' }}>Budget: {currency(modal.item?.total_budget)} · SDGs: {modal.item?.sdg_goals?.join(', ')}</p>
          </div>
          <Alert type="success" message="Approving this project will make it publicly visible, create a project escrow wallet, and email the creator. This action cannot be undone." />
          {mErr && <Alert type="danger" message={mErr} onClose={() => setMErr('')} />}
          <div>
            <label style={{ fontSize:13, fontWeight:700, color:'var(--gray-700)', display:'block', marginBottom:8 }}>Notes (optional)</label>
            <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes:e.target.value }))} rows={3}
              placeholder="Internal approval notes…"
              style={{ width:'100%', padding:'10px 14px', border:'1.5px solid var(--gray-200)', borderRadius:10, fontSize:13, fontFamily:'var(--font)', resize:'vertical', outline:'none', transition:'border 150ms' }}
              onFocus={e => e.target.style.borderColor='var(--brand)'}
              onBlur={e  => e.target.style.borderColor='var(--gray-200)'}
            />
          </div>
          <Button loading={approving} fullWidth size="lg"
            onClick={() => doApprove({ id: modal.item?._id, body:{ notes: form.notes || undefined } })}>
            ✅ Approve Project — Create Wallet & Email Creator
          </Button>
        </div>
      </Modal>

      {/* Reject Modal */}
      <Modal isOpen={modal.type==='reject'} onClose={closeModal} title="❌ Reject Project" size="md">
        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
          <div style={{ background:'var(--danger-50)', border:'1px solid #FECACA', borderRadius:12, padding:'14px 18px' }}>
            <p style={{ fontWeight:700, fontSize:15, color:'var(--gray-900)' }}>{modal.item?.title}</p>
          </div>
          <Alert type="warning" message="The project creator will be emailed the rejection reason immediately." />
          {mErr && <Alert type="danger" message={mErr} onClose={() => setMErr('')} />}
          <div>
            <label style={{ fontSize:13, fontWeight:700, color:'var(--gray-700)', display:'block', marginBottom:8 }}>Rejection reason <span style={{ color:'var(--danger)' }}>*</span></label>
            <textarea value={form.reason} onChange={e => setForm(p => ({ ...p, reason:e.target.value }))} rows={4}
              placeholder="e.g. Budget documentation is incomplete. Please resubmit with a detailed breakdown of all costs per activity."
              style={{ width:'100%', padding:'10px 14px', border:'1.5px solid var(--gray-200)', borderRadius:10, fontSize:13, fontFamily:'var(--font)', resize:'vertical', outline:'none', transition:'border 150ms' }}
              onFocus={e => e.target.style.borderColor='var(--brand)'}
              onBlur={e  => e.target.style.borderColor='var(--gray-200)'}
            />
          </div>
          <div style={{ display:'flex', gap:12 }}>
            <Button variant="ghost" fullWidth onClick={closeModal}>Cancel</Button>
            <Button variant="danger" loading={rejecting} fullWidth
              onClick={() => {
                if (!form.reason.trim()) { setMErr('Rejection reason is required'); return; }
                doReject({ id: modal.item?._id, body:{ reason: form.reason } });
              }}>
              ❌ Reject & Notify Creator
            </Button>
          </div>
        </div>
      </Modal>

      {/* More Info Modal */}
      <Modal isOpen={modal.type==='more-info'} onClose={closeModal} title="📋 Request More Information" size="md">
        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
          <div style={{ background:'var(--warning-50)', border:'1px solid #FDE68A', borderRadius:12, padding:'14px 18px' }}>
            <p style={{ fontWeight:700, fontSize:15, color:'var(--gray-900)' }}>{modal.item?.title}</p>
          </div>
          <Alert type="info" message="An email will be sent to the project creator explaining what is needed." />
          {mErr && <Alert type="danger" message={mErr} onClose={() => setMErr('')} />}
          <div>
            <label style={{ fontSize:13, fontWeight:700, color:'var(--gray-700)', display:'block', marginBottom:8 }}>Message to creator <span style={{ color:'var(--danger)' }}>*</span></label>
            <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message:e.target.value }))} rows={5}
              placeholder="e.g. Your proposal is strong but we need additional documentation:&#10;&#10;1. CAC registration certificate&#10;2. Annual report for the last financial year&#10;3. References from 2 previous project partners"
              style={{ width:'100%', padding:'10px 14px', border:'1.5px solid var(--gray-200)', borderRadius:10, fontSize:13, fontFamily:'var(--font)', resize:'vertical', outline:'none', transition:'border 150ms' }}
              onFocus={e => e.target.style.borderColor='var(--brand)'}
              onBlur={e  => e.target.style.borderColor='var(--gray-200)'}
            />
          </div>
          <div style={{ display:'flex', gap:12 }}>
            <Button variant="ghost" fullWidth onClick={closeModal}>Cancel</Button>
            <Button variant="secondary" loading={requesting} fullWidth
              onClick={() => {
                if (!form.message.trim()) { setMErr('Message is required'); return; }
                doMoreInfo({ id: modal.item?._id, body:{ message: form.message } });
              }}>
              📧 Send Info Request
            </Button>
          </div>
        </div>
      </Modal>

      <style>{`
        @media(max-width:900px){.ver-stats{grid-template-columns:repeat(3,1fr)!important}}
        @media(max-width:560px){.ver-stats{grid-template-columns:repeat(2,1fr)!important}}
      `}</style>
    </>
  );
}




