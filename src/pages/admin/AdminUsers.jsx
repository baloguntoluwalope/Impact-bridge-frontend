import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MdSearch, MdBlock, MdCheckCircle, MdClose } from 'react-icons/md';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { TableSkeleton } from '../../components/common/Loader';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import Pagination from '../../components/common/Pagination';
import Empty from '../../components/common/Empty';
import Avatar from '../../components/common/Avatar';
import { ago, currency } from '../../utils/helpers';
import { ROLES } from '../../utils/constants';

const fetchUsers = (params) => api.get('/admin/users', { params }).then(r => r.data);
const suspendUser  = ({ id, reason }) => api.patch(`/admin/users/${id}/suspend`, { reason }).then(r => r.data);
const activateUser = (id)             => api.patch(`/admin/users/${id}/activate`).then(r => r.data);

const ROLE_COLORS = {
  super_admin:          '#EF4444',
  ngo_partner:          '#8B5CF6',
  government_official:  '#3B82F6',
  donor:                '#10B981',
  corporate:            '#F59E0B',
  individual:           '#64748B',
  student:              '#06B6D4',
  school_admin:         '#E85D04',
  community_leader:     '#84CC16',
};

const SEL = { padding:'7px 30px 7px 12px', border:'1.5px solid #E2E8F0', borderRadius:8, fontSize:12, fontWeight:500, outline:'none', cursor:'pointer', background:`#fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 12 12'%3E%3Cpath fill='%2394A3B8' d='M6 8L1 3h10z'/%3E%3C/svg%3E") right 9px center no-repeat`, appearance:'none' };

export default function AdminUsers() {
  const qc = useQueryClient();
  const [page,    setPage]    = useState(1);
  const [search,  setSearch]  = useState('');
  const [roleFilter, setRole] = useState('');
  const [modal,   setModal]   = useState({ type:null, user:null });
  const [reason,  setReason]  = useState('');
  const [mErr,    setMErr]    = useState('');

  const params = { page, limit:20, ...(roleFilter ? { role:roleFilter } : {}), ...(search ? { search } : {}) };

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', params],
    queryFn:  () => fetchUsers(params),
    keepPreviousData: true,
  });

  const users = data?.data       || [];
  const pgn   = data?.pagination || {};

  const inv = () => qc.invalidateQueries(['admin-users']);

  const { mutate: doSuspend,  isLoading: suspending  } = useMutation({ mutationFn: suspendUser,  onSuccess: () => { toast.success('User suspended'); setModal({ type:null, user:null }); inv(); }, onError: e => setMErr(e?.response?.data?.message||'Failed') });
  const { mutate: doActivate, isLoading: activating  } = useMutation({ mutationFn: activateUser, onSuccess: () => { toast.success('User activated'); inv(); }, onError: e => toast.error(e?.response?.data?.message||'Failed') });

  const openModal = (type, user) => { setModal({ type, user }); setReason(''); setMErr(''); };

  return (
    <>
      <Helmet><title>Manage Users — Impact Bridge Admin</title></Helmet>

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:28, flexWrap:'wrap', gap:16 }}>
        <div>
          <h1 style={{ fontSize:26, fontWeight:800, color:'#0F172A', letterSpacing:'-.5px', marginBottom:6 }}>Manage Users</h1>
          <p style={{ fontSize:14, color:'#64748B' }}>
            {pgn.total ? `${pgn.total.toLocaleString()} total users` : 'All platform users'}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display:'flex', gap:10, marginBottom:20, flexWrap:'wrap' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, background:'#fff', border:'1.5px solid #E2E8F0', borderRadius:10, padding:'8px 14px', flex:1, minWidth:200, transition:'border-color 150ms' }}
          onFocusCapture={e => e.currentTarget.style.borderColor='#E85D04'}
          onBlurCapture={e  => e.currentTarget.style.borderColor='#E2E8F0'}>
          <MdSearch size={18} style={{ color:'#94A3B8', flexShrink:0 }} />
          <input type="search" placeholder="Search by name or email…"
            value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            style={{ flex:1, border:'none', outline:'none', fontSize:13, fontFamily:'inherit', color:'#0F172A', background:'transparent' }}
          />
          {search && <button onClick={() => { setSearch(''); setPage(1); }}><MdClose size={15} style={{ color:'#94A3B8' }} /></button>}
        </div>

        <select value={roleFilter} onChange={e => { setRole(e.target.value); setPage(1); }} style={SEL}>
          <option value="">All Roles</option>
          {Object.entries(ROLES).map(([k, v]) => (
            <option key={v} value={v}>{v.replace(/_/g,' ')}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      {isLoading ? (
        <TableSkeleton rows={10} />
      ) : users.length > 0 ? (
        <div style={{ background:'#fff', border:'1px solid #E2E8F0', borderRadius:16, overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,.05)' }}>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr>
                  {['User','Role','Location','Total Donated','Status','Joined','Actions'].map(h => (
                    <th key={h} style={{ padding:'11px 20px', textAlign:'left', fontSize:10, fontWeight:700, color:'#94A3B8', background:'#F8FAFC', borderBottom:'1px solid #E2E8F0', textTransform:'uppercase', letterSpacing:'.07em', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={u._id} style={{ borderBottom: i<users.length-1 ? '1px solid #F1F5F9' : 'none', transition:'background 100ms' }}
                    onMouseEnter={e => e.currentTarget.style.background='#F8FAFC'}
                    onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                    <td style={{ padding:'14px 20px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                        <Avatar src={u.avatar} name={`${u.first_name} ${u.last_name}`} size={36} />
                        <div>
                          <p style={{ fontWeight:700, fontSize:13, color:'#0F172A' }}>{u.first_name} {u.last_name}</p>
                          <p style={{ fontSize:11, color:'#94A3B8', marginTop:1 }}>{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding:'14px 20px' }}>
                      <span style={{
                        fontSize:10, fontWeight:700, padding:'3px 9px', borderRadius:6,
                        color: ROLE_COLORS[u.role] || '#64748B',
                        background:`${ROLE_COLORS[u.role] || '#64748B'}12`,
                        textTransform:'uppercase', letterSpacing:'.05em',
                      }}>
                        {u.role?.replace(/_/g,' ')}
                      </span>
                    </td>
                    <td style={{ padding:'14px 20px', fontSize:13, color:'#64748B', whiteSpace:'nowrap' }}>
                      {u.state}{u.lga ? `, ${u.lga}` : ''}
                    </td>
                    <td style={{ padding:'14px 20px', fontSize:13, fontWeight:700, color:'#E85D04', whiteSpace:'nowrap' }}>
                      {currency(u.total_donated || 0)}
                    </td>
                    <td style={{ padding:'14px 20px' }}>
                      {u.is_suspended ? (
                        <span style={{ fontSize:11, fontWeight:700, color:'#EF4444', background:'#FEF2F2', padding:'3px 9px', borderRadius:6 }}>Suspended</span>
                      ) : u.is_active ? (
                        <span style={{ fontSize:11, fontWeight:700, color:'#10B981', background:'#ECFDF5', padding:'3px 9px', borderRadius:6 }}>Active</span>
                      ) : (
                        <span style={{ fontSize:11, fontWeight:700, color:'#94A3B8', background:'#F1F5F9', padding:'3px 9px', borderRadius:6 }}>Inactive</span>
                      )}
                    </td>
                    <td style={{ padding:'14px 20px', fontSize:12, color:'#94A3B8', whiteSpace:'nowrap' }}>
                      {ago(u.created_at)}
                    </td>
                    <td style={{ padding:'14px 20px' }}>
                      <div style={{ display:'flex', gap:6 }}>
                        {u.is_suspended ? (
                          <button title="Activate User" onClick={() => doActivate(u._id)} disabled={activating}
                            style={{ width:32, height:32, borderRadius:8, background:'#ECFDF5', color:'#10B981', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', border:'none', transition:'all 120ms' }}
                            onMouseEnter={e => { e.currentTarget.style.background='#10B981'; e.currentTarget.style.color='#fff'; }}
                            onMouseLeave={e => { e.currentTarget.style.background='#ECFDF5'; e.currentTarget.style.color='#10B981'; }}>
                            <MdCheckCircle size={16} />
                          </button>
                        ) : (
                          <button title="Suspend User" onClick={() => openModal('suspend', u)}
                            style={{ width:32, height:32, borderRadius:8, background:'#FEF2F2', color:'#EF4444', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', border:'none', transition:'all 120ms' }}
                            onMouseEnter={e => { e.currentTarget.style.background='#EF4444'; e.currentTarget.style.color='#fff'; }}
                            onMouseLeave={e => { e.currentTarget.style.background='#FEF2F2'; e.currentTarget.style.color='#EF4444'; }}>
                            <MdBlock size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <Empty icon="👥" title="No users found" message="Try adjusting your search or filter." />
      )}

      {pgn.pages > 1 && <Pagination page={pgn.page} pages={pgn.pages} onPageChange={setPage} />}

      {/* Suspend Modal */}
      <Modal isOpen={modal.type==='suspend'} onClose={() => setModal({ type:null, user:null })} title="Suspend User Account" size="sm">
        <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
          <div style={{ display:'flex', alignItems:'center', gap:14, background:'#FEF2F2', borderRadius:12, padding:'14px 16px' }}>
            <Avatar src={modal.user?.avatar} name={`${modal.user?.first_name} ${modal.user?.last_name}`} size={40} />
            <div>
              <p style={{ fontWeight:700, fontSize:14, color:'#0F172A' }}>{modal.user?.first_name} {modal.user?.last_name}</p>
              <p style={{ fontSize:12, color:'#94A3B8' }}>{modal.user?.email}</p>
            </div>
          </div>

          <Alert type="warning" message="This user will immediately lose access to their account and cannot login until reactivated." />

          {mErr && <Alert type="danger" message={mErr} onClose={() => setMErr('')} />}

          <div>
            <label style={{ fontSize:13, fontWeight:700, color:'#334155', display:'block', marginBottom:8 }}>
              Suspension reason <span style={{ color:'#EF4444' }}>*</span>
            </label>
            <textarea value={reason} onChange={e => setReason(e.target.value)} rows={3}
              placeholder="e.g. Suspicious payment activity detected. Under investigation."
              style={{ width:'100%', padding:'10px 14px', border:'1.5px solid #E2E8F0', borderRadius:10, fontSize:13, fontFamily:'inherit', resize:'vertical', outline:'none', transition:'border 150ms' }}
              onFocus={e => e.target.style.borderColor='#E85D04'}
              onBlur={e  => e.target.style.borderColor='#E2E8F0'}
            />
          </div>

          <div style={{ display:'flex', gap:10 }}>
            <Button variant="ghost" fullWidth onClick={() => setModal({ type:null, user:null })}>Cancel</Button>
            <Button variant="danger" loading={suspending} fullWidth
              onClick={() => {
                if (!reason.trim()) { setMErr('Suspension reason is required'); return; }
                doSuspend({ id: modal.user?._id, reason });
              }}>
              Suspend Account
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}