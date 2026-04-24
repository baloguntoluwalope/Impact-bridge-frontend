import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { MdSearch, MdVerified, MdBusiness } from 'react-icons/md';
import api from '../../services/api';
import { TableSkeleton } from '../../components/common/Loader';
import Empty from '../../components/common/Empty';
import Pagination from '../../components/common/Pagination';
import { ago } from '../../utils/helpers';

const fetchNGOs = (params) => api.get('/ngos', { params }).then(r => r.data);

export default function AdminNGOs() {
  const [page,    setPage]   = useState(1);
  const [search,  setSearch] = useState('');
  const [sdgFilter,setSdg]  = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-ngos', page, search, sdgFilter],
    queryFn:  () => fetchNGOs({ page, limit:20, ...(search ? { search } : {}), ...(sdgFilter ? { sdg: sdgFilter } : {}) }),
    keepPreviousData: true,
  });

  const ngos = data?.data || [];
  const pgn  = data?.pagination || {};

  return (
    <>
      <Helmet><title>NGO Management — Impact Bridge Admin</title></Helmet>

      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontSize:24, fontWeight:800, color:'#0d0f14', letterSpacing:'-.4px', marginBottom:4 }}>NGO Management</h1>
        <p style={{ fontSize:13, color:'#64748b' }}>Manage verified NGO partners on the platform.</p>
      </div>

      {/* Search */}
      <div style={{ display:'flex', gap:10, marginBottom:20, flexWrap:'wrap' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, background:'#fff', border:'1.5px solid #e2e8f0', borderRadius:10, padding:'9px 14px', flex:1, minWidth:200 }}
          onFocusCapture={e => e.currentTarget.style.borderColor='#e85d04'}
          onBlurCapture={e  => e.currentTarget.style.borderColor='#e2e8f0'}>
          <MdSearch size={17} style={{ color:'#94a3b8' }} />
          <input type="search" placeholder="Search NGOs…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            style={{ flex:1, border:'none', outline:'none', fontSize:13, fontFamily:'inherit', color:'#0d0f14', background:'transparent' }} />
        </div>
      </div>

      {isLoading ? <TableSkeleton rows={8} /> : ngos.length > 0 ? (
        <>
          <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:16, overflow:'hidden' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr>
                  {['NGO Name','States','SDG Focus','Cases Handled','Verified','Registered'].map(h => (
                    <th key={h} style={{ padding:'11px 20px', textAlign:'left', fontSize:10, fontWeight:700, color:'#94a3b8', background:'#f8fafc', borderBottom:'1px solid #f1f5f9', textTransform:'uppercase', letterSpacing:'.07em', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ngos.map((ngo, i) => (
                  <tr key={ngo._id} style={{ borderBottom: i<ngos.length-1 ? '1px solid #f8fafc' : 'none' }}
                    onMouseEnter={e => e.currentTarget.style.background='#f8fafc'}
                    onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                    <td style={{ padding:'14px 20px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        {ngo.logo
                          ? <img src={ngo.logo} alt={ngo.name} style={{ width:32, height:32, borderRadius:8, objectFit:'cover', border:'1px solid #e2e8f0' }} />
                          : <div style={{ width:32, height:32, borderRadius:8, background:'#fff4ee', color:'#e85d04', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}><MdBusiness /></div>
                        }
                        <div>
                          <p style={{ fontWeight:700, fontSize:13, color:'#0d0f14' }}>{ngo.name}</p>
                          {ngo.contact_email && <p style={{ fontSize:11, color:'#94a3b8', marginTop:1 }}>{ngo.contact_email}</p>}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding:'14px 20px', fontSize:12, color:'#64748b' }}>
                      {ngo.states_of_operation?.slice(0,3).join(', ')}{ngo.states_of_operation?.length > 3 ? ` +${ngo.states_of_operation.length-3}` : ''}
                    </td>
                    <td style={{ padding:'14px 20px', fontSize:12, color:'#64748b' }}>
                      {ngo.sdg_focus?.slice(0,4).map(n => `SDG ${n}`).join(', ')}
                    </td>
                    <td style={{ padding:'14px 20px', fontWeight:700, fontSize:13, color:'#e85d04' }}>
                      {(ngo.total_cases_handled||0).toLocaleString()}
                    </td>
                    <td style={{ padding:'14px 20px' }}>
                      {ngo.is_verified
                        ? <span style={{ fontSize:11, fontWeight:700, color:'#10b981', background:'#ecfdf5', padding:'3px 9px', borderRadius:6 }}>✅ Verified</span>
                        : <span style={{ fontSize:11, fontWeight:700, color:'#94a3b8', background:'#f1f5f9', padding:'3px 9px', borderRadius:6 }}>Pending</span>
                      }
                    </td>
                    <td style={{ padding:'14px 20px', fontSize:11, color:'#94a3b8' }}>{ago(ngo.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={pgn.page} pages={pgn.pages} onPageChange={setPage} />
        </>
      ) : (
        <Empty icon="🏢" title="No NGOs found" message="NGO partners will appear here once registered on the platform." />
      )}
    </>
  );
}