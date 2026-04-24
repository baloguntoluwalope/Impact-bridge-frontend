
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MdVerified, MdCancel, MdInfo, MdRateReview, MdGavel, MdOpenInNew } from 'react-icons/md';
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
import { SDG_CATS, STATES, URGENCY } from '../../utils/constants';

const SEL = { padding:'7px 30px 7px 12px', border:'1.5px solid var(--gray-200)', borderRadius:8, fontSize:12, fontWeight:500, outline:'none', cursor:'pointer', background:`#fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 12 12'%3E%3Cpath fill='%2394A3B8' d='M6 8L1 3h10z'/%3E%3C/svg%3E") right 9px center no-repeat`, appearance:'none' };

export default function VerificationQueue() {
  const qc = useQueryClient();
  const [page,    setPage]   = useState(1);
  const [filters, setFilters]= useState({ state:'', category:'', urgency:'' });
  const [modal,   setModal]  = useState({ type:null, item:null });
  const [form,    setForm]   = useState({ reason:'', notes:'', message:'', ngo_id:'' });
  const [mErr,    setMErr]   = useState('');

  const setF = (k, v) => setFilters(p => ({ ...p, [k]:v }));

  const { data: stats  } = useQuery({ queryKey:['ver-req-stats'], queryFn: verifSvc.reqStats,           refetchInterval: 30000 });
  const { data, isLoading } = useQuery({
    queryKey: ['ver-req-queue', page, filters],
    queryFn:  () => verifSvc.reqQueue({ page, limit:15, ...filters }),
    keepPreviousData: true,
  });

  const items = data?.data || [];
  const pgn   = data?.pagination || {};

  const inv = () => { qc.invalidateQueries(['ver-req-queue']); qc.invalidateQueries(['ver-req-stats']); };

  const openModal = (type, item) => { setModal({ type, item }); setForm({ reason:'', notes:'', message:'', ngo_id:'' }); setMErr(''); };
  const closeModal = ()            => { setModal({ type:null, item:null }); setMErr(''); };

  const { mutate: doReview,  isLoading: reviewing }  = useMutation({ mutationFn: id => verifSvc.setUnderReview(id), onSuccess: () => { toast.success('Moved to under review — requester notified'); inv(); }, onError: e => toast.error(e?.response?.data?.message||'Failed') });
  const { mutate: doVerify,  isLoading: verifying }  = useMutation({ mutationFn: ({ id, body }) => verifSvc.verifyReq(id, body), onSuccess: () => { toast.success('✅ Request verified and published! Requester emailed.'); closeModal(); inv(); }, onError: e => setMErr(e?.response?.data?.message||'Failed') });
  const { mutate: doReject,  isLoading: rejecting }  = useMutation({ mutationFn: ({ id, body }) => verifSvc.rejectReq(id, body), onSuccess: () => { toast.success('Request rejected — requester notified with reason.'); closeModal(); inv(); }, onError: e => setMErr(e?.response?.data?.message||'Failed') });
  const { mutate: doMoreInfo,isLoading: requesting } = useMutation({ mutationFn: ({ id, body }) => verifSvc.moreInfoReq(id, body), onSuccess: () => { toast.success('Info request sent to requester via email.'); closeModal(); inv(); }, onError: e => setMErr(e?.response?.data?.message||'Failed') });

  const STAT = stats;
  const statItems = [
    { label:'Pending',      value: STAT?.pending      || 0, color:'var(--warning)' },
    { label:'Submitted',    value: STAT?.submitted    || 0, color:'var(--info)'    },
    { label:'Under Review', value: STAT?.under_review || 0, color:'#8B5CF6'        },
    { label:'Verified',     value: STAT?.verified     || 0, color:'var(--success)' },
    { label:'Rejected',     value: STAT?.rejected     || 0, color:'var(--danger)'  },
  ];

  return (
    <>
      <Helmet><title>Verification Queue — Impact Bridge Admin</title></Helmet>

      {/* Header */}
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontSize:26, fontWeight:800, color:'var(--gray-900)', letterSpacing:'-.5px', marginBottom:6 }}>Requests Verification Queue</h1>
        <p style={{ fontSize:14, color:'var(--gray-400)' }}>
          Review and verify submitted requests. Only verified requests become visible to donors.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:16, marginBottom:24 }} className="ver-stats">
        {statItems.map(s => (
          <div key={s.label} style={{ background:'#fff', border:'1px solid var(--gray-200)', borderRadius:14, padding:'18px 20px', textAlign:'center' }}>
            <p style={{ fontSize:28, fontWeight:900, color:s.color, letterSpacing:'-1px', fontFamily:'var(--font)' }}>{s.value}</p>
            <p style={{ fontSize:11, color:'var(--gray-400)', fontWeight:600, marginTop:5, textTransform:'uppercase', letterSpacing:'.06em' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display:'flex', gap:10, flexWrap:'wrap', marginBottom:20 }}>
        <select value={filters.state}    onChange={e => setF('state',e.target.value)}    style={SEL}><option value="">All States</option>{STATES.map(s => <option key={s} value={s}>{s}</option>)}</select>
        <select value={filters.category} onChange={e => setF('category',e.target.value)} style={SEL}><option value="">All Categories</option>{SDG_CATS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}</select>
        <select value={filters.urgency}  onChange={e => setF('urgency',e.target.value)}  style={SEL}><option value="">Any Urgency</option>{URGENCY.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}</select>
        {Object.values(filters).some(Boolean) && (
          <button onClick={() => setFilters({ state:'', category:'', urgency:'' })} style={{ fontSize:12, color:'var(--danger)', fontWeight:600, padding:'7px 12px', border:'1.5px solid #FECACA', borderRadius:8, background:'var(--danger-50)' }}>
            Clear
          </button>
        )}
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
                  {['Case','Requester','Amount','Status','Urgency','Age','Actions'].map(h => (
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
                        <a href={`/requests/${item._id}`} target="_blank" rel="noopener noreferrer"
                          style={{ fontWeight:700, fontSize:13, color:'var(--gray-900)', display:'flex', alignItems:'center', gap:5, transition:'color 150ms' }}
                          onMouseEnter={e => e.currentTarget.style.color='var(--brand)'}
                          onMouseLeave={e => e.currentTarget.style.color='var(--gray-900)'}>
                          {clip(item.title, 55)}
                          <MdOpenInNew size={12} style={{ flexShrink:0, opacity:.5 }} />
                        </a>
                        <span style={{ fontSize:11, color:'var(--gray-400)' }}>📍 {item.state}{item.lga ? `, ${item.lga}` : ''}</span>
                        <span style={{ fontSize:11, color:'var(--brand)', fontWeight:600 }}>{item.category?.replace(/_/g,' ')}</span>
                      </div>
                    </td>
                    <td style={{ padding:'14px 20px' }}>
                      <p style={{ fontSize:13, fontWeight:600, color:'var(--gray-800)', whiteSpace:'nowrap' }}>{item.requester?.first_name} {item.requester?.last_name}</p>
                      <p style={{ fontSize:11, color:'var(--gray-400)', marginTop:2 }}>{item.requester?.email}</p>
                    </td>
                    <td style={{ padding:'14px 20px', whiteSpace:'nowrap' }}><strong style={{ fontSize:14, color:'var(--brand)' }}>{currency(item.amount_needed)}</strong></td>
                    <td style={{ padding:'14px 20px' }}><Badge status={item.status} size="sm" dot /></td>
                    <td style={{ padding:'14px 20px' }}>
                      {item.urgency && <Badge urgency={item.urgency} label={item.urgency} color={URGENCY.find(u => u.value===item.urgency)?.color} size="xs" />}
                    </td>
                    <td style={{ padding:'14px 20px', fontSize:12, color:'var(--gray-400)', whiteSpace:'nowrap' }}>{ago(item.created_at)}</td>
                    <td style={{ padding:'14px 20px' }}>
                      <div style={{ display:'flex', gap:6 }}>
                        {item.status === 'submitted' && (
                          <button title="Move to Under Review" onClick={() => doReview(item._id)} disabled={reviewing}
                            style={{ width:32, height:32, borderRadius:8, background:'var(--info-50)', color:'var(--info)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', border:'none', transition:'all 120ms', fontSize:17 }}
                            onMouseEnter={e => e.currentTarget.style.background='var(--info)' || (e.currentTarget.style.color='#fff')}
                            onMouseLeave={e => e.currentTarget.style.background='var(--info-50)' || (e.currentTarget.style.color='var(--info)')}>
                            <MdRateReview size={16} />
                          </button>
                        )}
                        <button title="Approve & Publish" onClick={() => openModal('verify', item)}
                          style={{ width:32, height:32, borderRadius:8, background:'var(--success-50)', color:'var(--success)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', border:'none', transition:'all 120ms', fontSize:17 }}
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
                        <button title="Reject Request" onClick={() => openModal('reject', item)}
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
        <Empty icon="🎉" title="Verification queue is empty!" message="All submissions have been reviewed. Great work." />
      )}

      {pgn.pages > 1 && <Pagination page={pgn.page} pages={pgn.pages} onPageChange={setPage} />}

      {/* ── VERIFY MODAL ── */}
      <Modal isOpen={modal.type==='verify'} onClose={closeModal} title="✅ Approve and Publish Request" size="md">
        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
          <div style={{ background:'var(--success-50)', border:'1px solid #A7F3D0', borderRadius:12, padding:'14px 18px' }}>
            <p style={{ fontWeight:700, fontSize:15, color:'var(--gray-900)', marginBottom:4 }}>{modal.item?.title}</p>
            <p style={{ fontSize:13, color:'var(--gray-500)' }}>{modal.item?.state} · {currency(modal.item?.amount_needed)}</p>
          </div>

          <Alert type="success" message="Approving this request will make it publicly visible to donors. The requester will be notified via email immediately." />

          {mErr && <Alert type="danger" message={mErr} onClose={() => setMErr('')} />}

          <div>
            <label style={{ fontSize:13, fontWeight:700, color:'var(--gray-700)', display:'block', marginBottom:8 }}>Internal notes (optional)</label>
            <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes:e.target.value }))} rows={3}
              placeholder="Verification notes for internal record…"
              style={{ width:'100%', padding:'10px 14px', border:'1.5px solid var(--gray-200)', borderRadius:10, fontSize:13, fontFamily:'var(--font)', resize:'vertical', outline:'none', transition:'border 150ms' }}
              onFocus={e => e.target.style.borderColor='var(--brand)'}
              onBlur={e  => e.target.style.borderColor='var(--gray-200)'}
            />
          </div>

          <div>
            <label style={{ fontSize:13, fontWeight:700, color:'var(--gray-700)', display:'block', marginBottom:8 }}>Assign NGO (optional)</label>
            <input value={form.ngo_id} onChange={e => setForm(p => ({ ...p, ngo_id:e.target.value }))}
              placeholder="NGO ID to assign as executing partner"
              style={{ width:'100%', padding:'10px 14px', border:'1.5px solid var(--gray-200)', borderRadius:10, fontSize:13, fontFamily:'var(--font)', outline:'none', transition:'border 150ms' }}
              onFocus={e => e.target.style.borderColor='var(--brand)'}
              onBlur={e  => e.target.style.borderColor='var(--gray-200)'}
            />
          </div>

          <Button loading={verifying} fullWidth size="lg"
            onClick={() => doVerify({ id: modal.item?._id, body:{ notes: form.notes || undefined, ngo_id: form.ngo_id || undefined } })}>
            ✅ Approve & Publish — Email Requester
          </Button>
        </div>
      </Modal>

      {/* ── REJECT MODAL ── */}
      <Modal isOpen={modal.type==='reject'} onClose={closeModal} title="❌ Reject Request" size="md">
        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
          <div style={{ background:'var(--danger-50)', border:'1px solid #FECACA', borderRadius:12, padding:'14px 18px' }}>
            <p style={{ fontWeight:700, fontSize:15, color:'var(--gray-900)', marginBottom:4 }}>{modal.item?.title}</p>
            <p style={{ fontSize:13, color:'var(--gray-500)' }}>{modal.item?.state} · {currency(modal.item?.amount_needed)}</p>
          </div>

          <Alert type="warning" message="The requester will be emailed the rejection reason immediately. Be clear and constructive so they can improve their submission." />

          {mErr && <Alert type="danger" message={mErr} onClose={() => setMErr('')} />}

          <div>
            <label style={{ fontSize:13, fontWeight:700, color:'var(--gray-700)', display:'block', marginBottom:8 }}>
              Rejection reason <span style={{ color:'var(--danger)' }}>*</span>
            </label>
            <textarea value={form.reason} onChange={e => setForm(p => ({ ...p, reason:e.target.value }))} rows={4} required
              placeholder="e.g. Insufficient supporting documentation. No photos of the affected area were provided. Please upload clear evidence of the damage."
              style={{ width:'100%', padding:'10px 14px', border:`1.5px solid ${form.reason ? 'var(--gray-200)' : 'var(--gray-200)'}`, borderRadius:10, fontSize:13, fontFamily:'var(--font)', resize:'vertical', outline:'none', transition:'border 150ms' }}
              onFocus={e => e.target.style.borderColor='var(--brand)'}
              onBlur={e  => e.target.style.borderColor='var(--gray-200)'}
            />
          </div>

          <div>
            <label style={{ fontSize:13, fontWeight:700, color:'var(--gray-700)', display:'block', marginBottom:8 }}>Internal notes (not shown to requester)</label>
            <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes:e.target.value }))} rows={2}
              placeholder="Internal admin notes…"
              style={{ width:'100%', padding:'10px 14px', border:'1.5px solid var(--gray-200)', borderRadius:10, fontSize:13, fontFamily:'var(--font)', resize:'vertical', outline:'none', transition:'border 150ms' }}
              onFocus={e => e.target.style.borderColor='var(--brand)'}
              onBlur={e  => e.target.style.borderColor='var(--gray-200)'}
            />
          </div>

          <div style={{ display:'flex', gap:12 }}>
            <Button variant="ghost" fullWidth onClick={closeModal}>Cancel</Button>
            <Button variant="danger" loading={rejecting} fullWidth
              onClick={() => {
                if (!form.reason.trim()) { setMErr('Rejection reason is required. The requester will receive this in their email.'); return; }
                doReject({ id: modal.item?._id, body:{ reason: form.reason, notes: form.notes || undefined } });
              }}>
              ❌ Reject & Notify Requester
            </Button>
          </div>
        </div>
      </Modal>

      {/* ── MORE INFO MODAL ── */}
      <Modal isOpen={modal.type==='more-info'} onClose={closeModal} title="📋 Request Additional Information" size="md">
        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
          <div style={{ background:'var(--warning-50)', border:'1px solid #FDE68A', borderRadius:12, padding:'14px 18px' }}>
            <p style={{ fontWeight:700, fontSize:15, color:'var(--gray-900)', marginBottom:4 }}>{modal.item?.title}</p>
          </div>

          <Alert type="info" message="An email will be sent to the requester explaining what additional information is needed. Verification is paused for 7 days pending their response." />

          {mErr && <Alert type="danger" message={mErr} onClose={() => setMErr('')} />}

          <div>
            <label style={{ fontSize:13, fontWeight:700, color:'var(--gray-700)', display:'block', marginBottom:8 }}>
              Message to requester <span style={{ color:'var(--danger)' }}>*</span>
            </label>
            <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message:e.target.value }))} rows={5} required
              placeholder="e.g. Thank you for your submission. To proceed with verification, please provide:&#10;&#10;1. A letter from the school principal confirming the damage&#10;2. Clear photos of the affected area taken within the last 30 days&#10;3. At least one contractor quote for the repairs"
              style={{ width:'100%', padding:'10px 14px', border:'1.5px solid var(--gray-200)', borderRadius:10, fontSize:13, fontFamily:'var(--font)', resize:'vertical', outline:'none', transition:'border 150ms' }}
              onFocus={e => e.target.style.borderColor='var(--brand)'}
              onBlur={e  => e.target.style.borderColor='var(--gray-200)'}
            />
          </div>

          <div style={{ display:'flex', gap:12 }}>
            <Button variant="ghost" fullWidth onClick={closeModal}>Cancel</Button>
            <Button variant="secondary" loading={requesting} fullWidth
              onClick={() => {
                if (!form.message.trim()) { setMErr('Message is required. The requester will receive this in their email.'); return; }
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












