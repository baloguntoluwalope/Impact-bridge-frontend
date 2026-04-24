// import React, { useState } from 'react';
// import { Helmet } from 'react-helmet-async';
// import { Link } from 'react-router-dom';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import {
//   MdVerified, MdPeople, MdPayment, MdArrowForward,
//   MdAccountBalanceWallet, MdTrendingUp, MdRefresh,
//   MdLock, MdLockOpen, MdWarning, MdCheckCircle,
// } from 'react-icons/md';
// import dashboardSvc  from '../../services/dashboardService';
// import walletService from '../../services/walletService';
// import api           from '../../services/api';
// import Badge         from '../../components/common/Badge';
// import Modal         from '../../components/common/Modal';
// import Button        from '../../components/common/Button';
// import Alert         from '../../components/common/Alert';
// import { CardSkeleton, TableSkeleton, Spinner } from '../../components/common/Loader';
// import Empty         from '../../components/common/Empty';
// import { currency, ago, fmtDate } from '../../utils/helpers';
// import toast from 'react-hot-toast';

// /* ─── Sub-components ───────────────────────────────────────────── */

// function KPI({ icon, label, value, sub, color = '#e85d04', to }) {
//   const inner = (
//     <div style={{
//       background: '#fff',
//       border:     '1px solid #e2e8f0',
//       borderRadius: 16,
//       padding:    '22px 24px',
//       boxShadow:  '0 1px 4px rgba(0,0,0,.05)',
//       transition: 'all 160ms ease',
//       cursor:     to ? 'pointer' : 'default',
//     }}
//     onMouseEnter={e => { if (to) { e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${color}15`; } }}
//     onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,.05)'; }}
//     >
//       <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16 }}>
//         <div style={{ width:46, height:46, borderRadius:12, background:`${color}12`, color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>
//           {icon}
//         </div>
//         {to && <MdArrowForward size={16} style={{ color:'#cbd5e1', marginTop:4 }} />}
//       </div>
//       <p style={{ fontSize:28, fontWeight:900, color:'#0d0f14', letterSpacing:'-1.5px', marginBottom:4, fontFamily:'inherit' }}>
//         {value}
//       </p>
//       <p style={{ fontSize:13, color:'#64748b' }}>{label}</p>
//       {sub && <p style={{ fontSize:11, color:'#94a3b8', marginTop:3 }}>{sub}</p>}
//     </div>
//   );
//   return to ? <Link to={to} style={{ textDecoration:'none' }}>{inner}</Link> : inner;
// }

// function SectionHeader({ title, sub, to, toLabel = 'View all' }) {
//   return (
//     <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:18, gap:12 }}>
//       <div>
//         <h2 style={{ fontSize:16, fontWeight:700, color:'#0d0f14', margin:0 }}>{title}</h2>
//         {sub && <p style={{ fontSize:12, color:'#94a3b8', marginTop:3 }}>{sub}</p>}
//       </div>
//       {to && (
//         <Link to={to} style={{ display:'flex', alignItems:'center', gap:4, fontSize:12, fontWeight:700, color:'#e85d04', textDecoration:'none', flexShrink:0, whiteSpace:'nowrap' }}>
//           {toLabel} <MdArrowForward size={13} />
//         </Link>
//       )}
//     </div>
//   );
// }

// /* ─── Wallet Card ──────────────────────────────────────────────── */
// const WALLET_TYPE_META = {
//   case_funding:    { label:'Case',    color:'#e85d04', bg:'#fff4ee', icon:'📋' },
//   project_funding: { label:'Project', color:'#8b5cf6', bg:'#f5f3ff', icon:'📁' },
//   sdg_fund:        { label:'SDG',     color:'#10b981', bg:'#ecfdf5', icon:'🌍' },
//   general:         { label:'General', color:'#3b82f6', bg:'#eff6ff', icon:'💰' },
// };

// function WalletCard({ wallet, onAllocate, onFreeze }) {
//   const meta   = WALLET_TYPE_META[wallet.wallet_type] || WALLET_TYPE_META.general;
//   const frozen = wallet.status === 'frozen';
//   const pctUsed = wallet.total_allocated > 0
//     ? Math.min(Math.round((wallet.total_expended / wallet.total_allocated) * 100), 100)
//     : 0;

//   return (
//     <div style={{
//       background: '#fff',
//       border:     `1px solid ${frozen ? '#fecaca' : '#e2e8f0'}`,
//       borderRadius: 14,
//       padding:    '18px 20px',
//       position:   'relative',
//       overflow:   'hidden',
//       boxShadow:  '0 1px 3px rgba(0,0,0,.04)',
//     }}>
//       {/* Frozen overlay */}
//       {frozen && (
//         <div style={{ position:'absolute', top:10, right:10 }}>
//           <span style={{ fontSize:10, fontWeight:800, color:'#ef4444', background:'#fef2f2', padding:'2px 8px', borderRadius:999, border:'1px solid #fecaca', textTransform:'uppercase', letterSpacing:'.06em' }}>
//             🔒 Frozen
//           </span>
//         </div>
//       )}

//       {/* Header */}
//       <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
//         <div style={{ width:40, height:40, borderRadius:10, background:meta.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>
//           {meta.icon}
//         </div>
//         <div style={{ minWidth:0 }}>
//           <p style={{ fontSize:13, fontWeight:700, color:'#0d0f14', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
//             {wallet.entity_title || wallet.entity_type?.replace(/_/g,' ') || 'Wallet'}
//           </p>
//           <p style={{ fontSize:10, fontWeight:600, color:meta.color, textTransform:'uppercase', letterSpacing:'.06em', marginTop:2 }}>
//             {meta.label} Wallet
//           </p>
//         </div>
//       </div>

//       {/* Balance */}
//       <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginBottom:14 }}>
//         {[
//           { label:'Balance',   value:currency(wallet.balance||0),          color:'#0d0f14' },
//           { label:'Allocated', value:currency(wallet.total_allocated||0),   color:'#8b5cf6' },
//           { label:'Expended',  value:currency(wallet.total_expended||0),    color:'#f59e0b' },
//         ].map(s => (
//           <div key={s.label} style={{ background:'#f8fafc', borderRadius:9, padding:'10px 10px' }}>
//             <p style={{ fontSize:15, fontWeight:800, color:s.color, letterSpacing:'-.5px' }}>{s.value}</p>
//             <p style={{ fontSize:10, color:'#94a3b8', marginTop:3, fontWeight:600 }}>{s.label}</p>
//           </div>
//         ))}
//       </div>

//       {/* Progress bar */}
//       {wallet.total_allocated > 0 && (
//         <div style={{ marginBottom:14 }}>
//           <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'#94a3b8', marginBottom:5 }}>
//             <span>Expenditure</span>
//             <span style={{ fontWeight:700, color: pctUsed > 85 ? '#ef4444' : '#64748b' }}>{pctUsed}%</span>
//           </div>
//           <div style={{ background:'#f1f5f9', borderRadius:999, height:6, overflow:'hidden' }}>
//             <div style={{ width:`${pctUsed}%`, height:'100%', background: pctUsed > 85 ? '#ef4444' : meta.color, borderRadius:999, transition:'width .6s ease' }} />
//           </div>
//         </div>
//       )}

//       {/* Actions */}
//       <div style={{ display:'flex', gap:8 }}>
//         <button onClick={() => onAllocate(wallet)}
//           disabled={frozen}
//           style={{ flex:1, padding:'7px 0', borderRadius:8, fontSize:12, fontWeight:700, cursor: frozen ? 'not-allowed' : 'pointer', border:`1.5px solid ${meta.color}`, background:`${meta.color}10`, color:meta.color, opacity:frozen?.5:1, transition:'all 130ms' }}
//           onMouseEnter={e => { if (!frozen) { e.currentTarget.style.background=meta.color; e.currentTarget.style.color='#fff'; } }}
//           onMouseLeave={e => { e.currentTarget.style.background=`${meta.color}10`; e.currentTarget.style.color=meta.color; }}>
//           Allocate
//         </button>
//         <button onClick={() => onFreeze(wallet)}
//           style={{ padding:'7px 10px', borderRadius:8, fontSize:12, fontWeight:700, cursor:'pointer', border:`1.5px solid ${frozen?'#10b981':'#ef4444'}`, background:frozen?'#ecfdf5':'#fef2f2', color:frozen?'#10b981':'#ef4444', transition:'all 130ms' }}
//           title={frozen ? 'Unfreeze wallet' : 'Freeze wallet'}>
//           {frozen ? <MdLockOpen size={15} /> : <MdLock size={15} />}
//         </button>
//       </div>
//     </div>
//   );
// }

// /* ─── Allocate Modal ───────────────────────────────────────────── */
// function AllocateModal({ wallet, onClose }) {
//   const qc = useQueryClient();
//   const [amount, setAmount]   = useState('');
//   const [purpose, setPurpose] = useState('');
//   const [err, setErr]         = useState('');

//   const { mutate, isLoading } = useMutation({
//     mutationFn: () => walletService.allocate(wallet._id, {
//       amount: Number(amount),
//       purpose,
//     }),
//     onSuccess: () => {
//       toast.success(`₦${Number(amount).toLocaleString()} allocated successfully`);
//       qc.invalidateQueries(['admin-wallets']);
//       qc.invalidateQueries(['admin-dashboard']);
//       onClose();
//     },
//     onError: e => setErr(e?.response?.data?.message || 'Allocation failed'),
//   });

//   const submit = () => {
//     if (!amount || Number(amount) < 100) { setErr('Minimum allocation is ₦100'); return; }
//     if (!purpose.trim())                 { setErr('Purpose is required'); return; }
//     setErr('');
//     mutate();
//   };

//   return (
//     <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
//       {/* Wallet info */}
//       <div style={{ background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:12, padding:'14px 16px' }}>
//         <p style={{ fontSize:13, fontWeight:700, color:'#334155', marginBottom:4 }}>
//           {wallet.entity_title || 'Wallet'}
//         </p>
//         <p style={{ fontSize:12, color:'#64748b' }}>
//           Current balance: <strong style={{ color:'#e85d04' }}>{currency(wallet.balance||0)}</strong>
//         </p>
//       </div>

//       {err && <Alert type="danger" message={err} onClose={() => setErr('')} />}

//       <div>
//         <label style={{ fontSize:13, fontWeight:700, color:'#334155', display:'block', marginBottom:7 }}>
//           Amount to Allocate (₦) *
//         </label>
//         <div style={{ position:'relative' }}>
//           <span style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', fontWeight:700, color:'#94a3b8', pointerEvents:'none' }}>₦</span>
//           <input
//             type="number"
//             value={amount}
//             onChange={e => setAmount(e.target.value)}
//             placeholder="0"
//             min={100}
//             style={{ width:'100%', padding:'10px 14px 10px 28px', border:'1.5px solid #e2e8f0', borderRadius:10, fontSize:14, fontFamily:'inherit', color:'#0d0f14', outline:'none', transition:'border 140ms' }}
//             onFocus={e => e.target.style.borderColor='#e85d04'}
//             onBlur={e  => e.target.style.borderColor='#e2e8f0'}
//           />
//         </div>
//       </div>

//       <div>
//         <label style={{ fontSize:13, fontWeight:700, color:'#334155', display:'block', marginBottom:7 }}>
//           Purpose / Note *
//         </label>
//         <textarea
//           value={purpose}
//           onChange={e => setPurpose(e.target.value)}
//           rows={3}
//           placeholder="e.g. Phase 1 construction materials for Kano school roof"
//           style={{ width:'100%', padding:'10px 14px', border:'1.5px solid #e2e8f0', borderRadius:10, fontSize:13, fontFamily:'inherit', resize:'vertical', outline:'none', transition:'border 140ms' }}
//           onFocus={e => e.target.style.borderColor='#e85d04'}
//           onBlur={e  => e.target.style.borderColor='#e2e8f0'}
//         />
//       </div>

//       <div style={{ display:'flex', gap:10 }}>
//         <Button variant="ghost" fullWidth onClick={onClose}>Cancel</Button>
//         <Button loading={isLoading} fullWidth onClick={submit}>
//           Allocate Funds
//         </Button>
//       </div>
//     </div>
//   );
// }

// /* ─── Main Dashboard ────────────────────────────────────────────── */
// export default function AdminDashboard() {
//   const [walletModal,   setWalletModal]   = useState(null);  // wallet object or null
//   const [freezeConfirm, setFreezeConfirm] = useState(null);  // wallet object or null
//   const [walletPage,    setWalletPage]    = useState(1);
//   const [walletType,    setWalletType]    = useState('');
//   const qc = useQueryClient();

//   /* ── Queries ── */
//   const { data: dash, isLoading: dashLoading, refetch: refetchDash } = useQuery({
//     queryKey: ['admin-dashboard'],
//     queryFn:  dashboardSvc.admin,
//     staleTime: 60000,
//     refetchInterval: 120000,
//   });

//   const { data: walletsData, isLoading: walletsLoading } = useQuery({
//     queryKey: ['admin-wallets', walletPage, walletType],
//     queryFn:  () => walletService.getAllWallets({
//       page:  walletPage,
//       limit: 8,
//       ...(walletType ? { wallet_type: walletType } : {}),
//     }),
//     staleTime: 30000,
//   });

//   /* ── Mutations ── */
//   const { mutate: toggleFreeze, isLoading: freezing } = useMutation({
//     mutationFn: (w) => {
//       const endpoint = w.status === 'frozen'
//         ? api.patch(`/wallets/${w._id}/unfreeze`)
//         : api.patch(`/wallets/${w._id}/freeze`, { reason:'Admin action from dashboard' });
//       return endpoint;
//     },
//     onSuccess: (_, w) => {
//       toast.success(w.status === 'frozen' ? 'Wallet unfrozen' : 'Wallet frozen');
//       qc.invalidateQueries(['admin-wallets']);
//       setFreezeConfirm(null);
//     },
//     onError: e => toast.error(e?.response?.data?.message || 'Action failed'),
//   });

//   /* ── Data ── */
//   const stats    = dash?.stats           || {};
//   const byStatus = dash?.by_status       || [];
//   const payments = dash?.recent_payments || [];
//   const wallets  = walletsData?.data     || [];
//   const wPgn     = walletsData?.pagination || {};

//   const walletSummary = {
//     total:    wallets.reduce((a, w) => a + (w.balance || 0),          0),
//     allocated:wallets.reduce((a, w) => a + (w.total_allocated || 0),  0),
//     expended: wallets.reduce((a, w) => a + (w.total_expended || 0),   0),
//     active:   wallets.filter(w => w.status === 'active').length,
//     frozen:   wallets.filter(w => w.status === 'frozen').length,
//   };

//   const isLoading = dashLoading;

//   /* ── Render ── */
//   return (
//     <>
//       <Helmet><title>Admin Dashboard — Impact Bridge</title></Helmet>

//       {/* ── Page header ─────────────────────────────────── */}
//       <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:28, flexWrap:'wrap', gap:16 }}>
//         <div>
//           <h1 style={{ fontSize:24, fontWeight:800, color:'#0d0f14', letterSpacing:'-.5px', marginBottom:4 }}>
//             Admin Dashboard
//           </h1>
//           <p style={{ fontSize:13, color:'#64748b' }}>
//             {new Date().toLocaleDateString('en-NG', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}
//           </p>
//         </div>
//         <div style={{ display:'flex', gap:10 }}>
//           <button onClick={() => refetchDash()} style={{ display:'flex', alignItems:'center', gap:6, padding:'9px 14px', border:'1.5px solid #e2e8f0', borderRadius:10, fontSize:13, fontWeight:600, color:'#475569', background:'#fff', cursor:'pointer' }}>
//             <MdRefresh size={15} /> Refresh
//           </button>
//           <Link to="/admin/verify/requests" style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 18px', background:'#e85d04', color:'#fff', borderRadius:10, fontSize:13, fontWeight:700, textDecoration:'none', transition:'background 140ms' }}
//             onMouseEnter={e => e.currentTarget.style.background='#c94d03'}
//             onMouseLeave={e => e.currentTarget.style.background='#e85d04'}>
//             <MdVerified size={17} />
//             {stats.pending > 0 ? `Review ${stats.pending} Pending` : 'Verification Queue'}
//           </Link>
//         </div>
//       </div>

//       {isLoading ? (
//         <>
//           <CardSkeleton count={4} />
//           <div style={{ marginTop:20 }}><TableSkeleton rows={5} /></div>
//         </>
//       ) : (
//         <>
//           {/* ── KPI Row ─────────────────────────────────── */}
//           <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:18, marginBottom:24 }} className="a-kpi">
//             <KPI
//               icon={<MdPeople size={22} />}
//               label="Active Users"
//               value={(stats.total_users||0).toLocaleString()}
//               sub={`${stats.new_users_today || 0} new today`}
//               color="#3b82f6"
//               to="/admin/users"
//             />
//             <KPI
//               icon="📋"
//               label="Total Requests"
//               value={(stats.total_requests||0).toLocaleString()}
//               sub={`${stats.pending || 0} pending review`}
//               color="#e85d04"
//               to="/admin/verify/requests"
//             />
//             <KPI
//               icon={<MdPayment size={22} />}
//               label="Total Raised"
//               value={currency(stats.total_amount_raised||0)}
//               sub={`${stats.donation_count || 0} donations`}
//               color="#10b981"
//               to="/admin/payments"
//             />
//             <KPI
//               icon={<MdAccountBalanceWallet size={22} />}
//               label="Escrow Held"
//               value={currency(walletSummary.total)}
//               sub={`${walletSummary.active} active · ${walletSummary.frozen} frozen`}
//               color="#8b5cf6"
//             />
//           </div>

//           {/* ── Main row: Payments + Status ──────────────── */}
//           <div style={{ display:'grid', gridTemplateColumns:'1.6fr 1fr', gap:20, marginBottom:24 }} className="a-main">

//             {/* Payments table */}
//             <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:16, overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,.05)' }}>
//               <div style={{ padding:'18px 22px', borderBottom:'1px solid #f1f5f9' }}>
//                 <SectionHeader title="Recent Payments" sub="Latest transactions" to="/admin/payments" />
//               </div>
//               {payments.length > 0 ? (
//                 <table style={{ width:'100%', borderCollapse:'collapse' }}>
//                   <thead>
//                     <tr>
//                       {['Donor','Case','Amount','Gateway','Time'].map(h => (
//                         <th key={h} style={{ padding:'9px 18px', textAlign:'left', fontSize:10, fontWeight:700, color:'#94a3b8', background:'#f8fafc', borderBottom:'1px solid #f1f5f9', textTransform:'uppercase', letterSpacing:'.07em', whiteSpace:'nowrap' }}>
//                           {h}
//                         </th>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {payments.slice(0,8).map((p, i) => (
//                       <tr key={i}
//                         style={{ borderBottom: i < payments.length-1 ? '1px solid #f8fafc' : 'none', transition:'background 100ms' }}
//                         onMouseEnter={e => e.currentTarget.style.background='#f8fafc'}
//                         onMouseLeave={e => e.currentTarget.style.background='transparent'}>
//                         <td style={{ padding:'11px 18px', fontSize:13, fontWeight:600, color:'#334155', whiteSpace:'nowrap' }}>
//                           {p.donor?.first_name} {p.donor?.last_name?.[0]}.
//                         </td>
//                         <td style={{ padding:'11px 18px', fontSize:12, color:'#64748b', maxWidth:160, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
//                           {p.request?.title || 'General Fund'}
//                         </td>
//                         <td style={{ padding:'11px 18px', fontSize:13, fontWeight:700, color:'#10b981', whiteSpace:'nowrap' }}>
//                           {currency(p.amount)}
//                         </td>
//                         <td style={{ padding:'11px 18px' }}>
//                           <span style={{ fontSize:10, fontWeight:700, textTransform:'capitalize', color: p.gateway==='korapay'?'#10b981': p.gateway==='paystack'?'#3b82f6':'#f59e0b', background: p.gateway==='korapay'?'#ecfdf5': p.gateway==='paystack'?'#eff6ff':'#fffbeb', padding:'2px 7px', borderRadius:5 }}>
//                             {p.gateway}
//                           </span>
//                         </td>
//                         <td style={{ padding:'11px 18px', fontSize:11, color:'#94a3b8', whiteSpace:'nowrap' }}>
//                           {ago(p.created_at)}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               ) : (
//                 <div style={{ padding:'40px 22px' }}>
//                   <Empty icon="💰" title="No payments yet" />
//                 </div>
//               )}
//             </div>

//             {/* Right column: Status + Quick links */}
//             <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

//               {/* Request status breakdown */}
//               <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:16, overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,.05)' }}>
//                 <div style={{ padding:'16px 20px', borderBottom:'1px solid #f1f5f9' }}>
//                   <SectionHeader title="Request Status" />
//                 </div>
//                 <div style={{ padding:'6px 0' }}>
//                   {byStatus.length > 0 ? byStatus.map((s, i) => {
//                     const maxCount = byStatus[0]?.count || 1;
//                     return (
//                       <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'9px 18px' }}>
//                         <Badge status={s._id} size="xs" dot />
//                         <div style={{ flex:1 }}>
//                           <div style={{ height:5, background:'#f1f5f9', borderRadius:999, overflow:'hidden' }}>
//                             <div style={{ width:`${Math.round((s.count/maxCount)*100)}%`, height:'100%', background:'#e85d04', borderRadius:999 }} />
//                           </div>
//                         </div>
//                         <span style={{ fontWeight:800, fontSize:14, color:'#0d0f14', minWidth:28, textAlign:'right' }}>
//                           {s.count}
//                         </span>
//                       </div>
//                     );
//                   }) : (
//                     <p style={{ padding:'20px 18px', fontSize:13, color:'#94a3b8' }}>No data yet</p>
//                   )}
//                 </div>
//               </div>

//               {/* Quick action links */}
//               <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
//                 {[
//                   { to:'/admin/verify/requests', icon:'✅', label:'Verify',   color:'#10b981' },
//                   { to:'/admin/users',           icon:'👥', label:'Users',    color:'#3b82f6' },
//                   { to:'/admin/ngos',            icon:'🏢', label:'NGOs',     color:'#8b5cf6' },
//                   { to:'/admin/analytics',       icon:'📊', label:'Analytics',color:'#f59e0b' },
//                 ].map(a => (
//                   <Link key={a.to} to={a.to} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8, padding:'16px 8px', background:'#fff', border:'1px solid #e2e8f0', borderRadius:12, textDecoration:'none', transition:'all 140ms', textAlign:'center' }}
//                     onMouseEnter={e => { e.currentTarget.style.borderColor=a.color; e.currentTarget.style.background=`${a.color}06`; e.currentTarget.style.transform='translateY(-2px)'; }}
//                     onMouseLeave={e => { e.currentTarget.style.borderColor='#e2e8f0'; e.currentTarget.style.background='#fff'; e.currentTarget.style.transform='translateY(0)'; }}>
//                     <span style={{ fontSize:22 }}>{a.icon}</span>
//                     <span style={{ fontSize:12, fontWeight:700, color:'#334155' }}>{a.label}</span>
//                   </Link>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* ── Wallet Section ───────────────────────────── */}
//           <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:20, overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,.05)' }}>

//             {/* Wallet header */}
//             <div style={{ background:'linear-gradient(135deg,#0f172a 0%,#1e293b 100%)', padding:'24px 28px' }}>
//               <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
//                 <div>
//                   <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
//                     <MdAccountBalanceWallet size={22} style={{ color:'#e85d04' }} />
//                     <h2 style={{ fontSize:17, fontWeight:800, color:'#fff', margin:0 }}>Escrow Wallet Management</h2>
//                   </div>
//                   <p style={{ fontSize:13, color:'rgba(255,255,255,.5)', margin:0 }}>
//                     Monitor, allocate, and control all case and project escrow wallets
//                   </p>
//                 </div>

//                 {/* Wallet summary pills */}
//                 <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
//                   {[
//                     { label:'Total Held',  value:currency(walletSummary.total),     color:'#e85d04' },
//                     { label:'Allocated',   value:currency(walletSummary.allocated),  color:'#8b5cf6' },
//                     { label:'Expended',    value:currency(walletSummary.expended),   color:'#f59e0b' },
//                   ].map(s => (
//                     <div key={s.label} style={{ background:'rgba(255,255,255,.07)', border:'1px solid rgba(255,255,255,.1)', borderRadius:10, padding:'10px 16px', textAlign:'center' }}>
//                       <p style={{ fontSize:14, fontWeight:900, color:s.color, letterSpacing:'-.5px' }}>{s.value}</p>
//                       <p style={{ fontSize:10, color:'rgba(255,255,255,.4)', fontWeight:600, marginTop:3, textTransform:'uppercase', letterSpacing:'.06em' }}>{s.label}</p>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* Wallet filters */}
//             <div style={{ display:'flex', alignItems:'center', gap:10, padding:'16px 24px', borderBottom:'1px solid #f1f5f9', flexWrap:'wrap' }}>
//               <span style={{ fontSize:13, fontWeight:600, color:'#64748b', flexShrink:0 }}>Filter:</span>
//               {[
//                 { value:'',                label:'All Types'  },
//                 { value:'case_funding',    label:'Cases'      },
//                 { value:'project_funding', label:'Projects'   },
//                 { value:'sdg_fund',        label:'SDG Funds'  },
//                 { value:'general',         label:'General'    },
//               ].map(f => (
//                 <button key={f.value} onClick={() => { setWalletType(f.value); setWalletPage(1); }}
//                   style={{ padding:'5px 14px', borderRadius:999, fontSize:12, fontWeight:600, cursor:'pointer', border:`1.5px solid ${walletType===f.value?'#e85d04':'#e2e8f0'}`, background:walletType===f.value?'#fff4ee':'#fff', color:walletType===f.value?'#e85d04':'#64748b', transition:'all 130ms' }}>
//                   {f.label}
//                 </button>
//               ))}

//               <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:8 }}>
//                 {walletSummary.frozen > 0 && (
//                   <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:12, color:'#ef4444', fontWeight:600, background:'#fef2f2', padding:'5px 10px', borderRadius:7, border:'1px solid #fecaca' }}>
//                     <MdWarning size={14} /> {walletSummary.frozen} frozen
//                   </div>
//                 )}
//                 <span style={{ fontSize:12, color:'#94a3b8' }}>
//                   {wPgn.total || wallets.length} wallet{(wPgn.total || wallets.length) !== 1 ? 's' : ''}
//                 </span>
//               </div>
//             </div>

//             {/* Wallet grid */}
//             <div style={{ padding:'20px 24px' }}>
//               {walletsLoading ? (
//                 <div style={{ display:'flex', justifyContent:'center', padding:'40px' }}>
//                   <Spinner size={32} />
//                 </div>
//               ) : wallets.length > 0 ? (
//                 <>
//                   <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:16 }}>
//                     {wallets.map(w => (
//                       <WalletCard
//                         key={w._id}
//                         wallet={w}
//                         onAllocate={setWalletModal}
//                         onFreeze={setFreezeConfirm}
//                       />
//                     ))}
//                   </div>

//                   {/* Pagination */}
//                   {wPgn.pages > 1 && (
//                     <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, marginTop:24 }}>
//                       <button
//                         disabled={walletPage <= 1}
//                         onClick={() => setWalletPage(p => p - 1)}
//                         style={{ padding:'6px 14px', border:'1.5px solid #e2e8f0', borderRadius:8, fontSize:13, fontWeight:600, color: walletPage<=1?'#cbd5e1':'#475569', cursor: walletPage<=1?'not-allowed':'pointer', background:'#fff' }}>
//                         ← Prev
//                       </button>
//                       <span style={{ fontSize:13, color:'#64748b' }}>
//                         Page {walletPage} of {wPgn.pages}
//                       </span>
//                       <button
//                         disabled={walletPage >= wPgn.pages}
//                         onClick={() => setWalletPage(p => p + 1)}
//                         style={{ padding:'6px 14px', border:'1.5px solid #e2e8f0', borderRadius:8, fontSize:13, fontWeight:600, color: walletPage>=wPgn.pages?'#cbd5e1':'#475569', cursor: walletPage>=wPgn.pages?'not-allowed':'pointer', background:'#fff' }}>
//                         Next →
//                       </button>
//                     </div>
//                   )}
//                 </>
//               ) : (
//                 <div style={{ padding:'40px 0' }}>
//                   <Empty
//                     icon="🏦"
//                     title="No wallets yet"
//                     message="Escrow wallets are created automatically when a request is verified and funded."
//                   />
//                 </div>
//               )}
//             </div>
//           </div>
//         </>
//       )}

//       {/* ── Allocate Modal ──────────────────────────────── */}
//       <Modal
//         isOpen={!!walletModal}
//         onClose={() => setWalletModal(null)}
//         title="💸 Allocate Funds"
//         size="sm"
//       >
//         {walletModal && (
//           <AllocateModal wallet={walletModal} onClose={() => setWalletModal(null)} />
//         )}
//       </Modal>

//       {/* ── Freeze Confirm Modal ────────────────────────── */}
//       <Modal
//         isOpen={!!freezeConfirm}
//         onClose={() => setFreezeConfirm(null)}
//         title={freezeConfirm?.status === 'frozen' ? '🔓 Unfreeze Wallet' : '🔒 Freeze Wallet'}
//         size="sm"
//       >
//         {freezeConfirm && (
//           <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
//             <Alert
//               type={freezeConfirm.status === 'frozen' ? 'info' : 'warning'}
//               message={
//                 freezeConfirm.status === 'frozen'
//                   ? 'Unfreezing this wallet will allow allocations and expenditures to resume.'
//                   : 'Freezing this wallet will prevent any allocations or expenditures until it is unfrozen.'
//               }
//             />
//             <div style={{ background:'#f8fafc', borderRadius:12, padding:'14px 16px' }}>
//               <p style={{ fontSize:13, fontWeight:700, color:'#334155', marginBottom:3 }}>
//                 {freezeConfirm.entity_title || 'Wallet'}
//               </p>
//               <p style={{ fontSize:12, color:'#64748b' }}>
//                 Balance: <strong style={{ color:'#e85d04' }}>{currency(freezeConfirm.balance||0)}</strong>
//               </p>
//             </div>
//             <div style={{ display:'flex', gap:10 }}>
//               <Button variant="ghost" fullWidth onClick={() => setFreezeConfirm(null)}>Cancel</Button>
//               <Button
//                 variant={freezeConfirm.status === 'frozen' ? 'success' : 'danger'}
//                 loading={freezing}
//                 fullWidth
//                 onClick={() => toggleFreeze(freezeConfirm)}
//               >
//                 {freezeConfirm.status === 'frozen' ? 'Unfreeze' : 'Freeze'} Wallet
//               </Button>
//             </div>
//           </div>
//         )}
//       </Modal>

//       <style>{`
//         @media(max-width:1024px) {
//           .a-kpi  { grid-template-columns:repeat(2,1fr) !important; }
//           .a-main { grid-template-columns:1fr !important; }
//         }
//         @media(max-width:560px) {
//           .a-kpi { grid-template-columns:1fr 1fr !important; }
//         }
//       `}</style>
//     </>
//   );
// }



import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MdVerified, MdPeople, MdPayment, MdBarChart, MdArrowForward, MdTrendingUp } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import dashboardSvc from '../../services/dashboardService';
import { CardSkeleton, TableSkeleton } from '../../components/common/Loader';
import Badge from '../../components/common/Badge';
import Empty from '../../components/common/Empty';
import { currency, ago } from '../../utils/helpers';

function KPICard({ icon, label, value, sub, color = '#e85d04', trend }) {
  return (
    <div style={{
      background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16,
      padding: '22px 24px', boxShadow: 'var(--shadow-xs)',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: `${color}12`, color,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
        }}>
          {icon}
        </div>
        {trend !== undefined && (
          <span style={{
            fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 999,
            color:      trend >= 0 ? '#10b981' : '#ef4444',
            background: trend >= 0 ? '#ecfdf5' : '#fef2f2',
          }}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <p style={{ fontSize: 28, fontWeight: 900, color: '#0d0f14', letterSpacing: '-1px', marginBottom: 4 }}>{value}</p>
      <p style={{ fontSize: 13, color: '#64748b' }}>{label}</p>
      {sub && <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 3 }}>{sub}</p>}
    </div>
  );
}

function QuickAction({ to, icon, label, desc, color }) {
  return (
    <Link to={to} style={{
      display: 'flex', alignItems: 'center', gap: 14,
      background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14,
      padding: '16px 18px', transition: 'all 150ms ease',
      boxShadow: 'var(--shadow-xs)', textDecoration: 'none',
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${color}15`; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-xs)'; }}>
      <div style={{ width: 42, height: 42, borderRadius: 12, background: `${color}12`, color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontWeight: 700, fontSize: 14, color: '#0d0f14', marginBottom: 2 }}>{label}</p>
        <p style={{ fontSize: 12, color: '#94a3b8' }}>{desc}</p>
      </div>
      <MdArrowForward size={16} style={{ color, flexShrink: 0 }} />
    </Link>
  );
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn:  dashboardSvc.admin,
    staleTime: 60000,
    refetchInterval: 120000,
  });

  const stats    = data?.stats           || {};
  const byStatus = data?.by_status       || [];
  const payments = data?.recent_payments || [];

  return (
    <>
      <Helmet><title>Admin Dashboard — Impact Bridge</title></Helmet>

      {/* Page header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0d0f14', letterSpacing: '-.4px', marginBottom: 4 }}>
              Admin Dashboard
            </h1>
            <p style={{ fontSize: 13, color: '#64748b' }}>
              Platform overview · {new Date().toLocaleDateString('en-NG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <Link to="/admin/verify/requests">
            <button style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 18px', background: '#e85d04', color: '#fff',
              borderRadius: 10, fontSize: 13, fontWeight: 700,
              cursor: 'pointer', border: 'none', transition: 'all 140ms',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#c94d03'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#e85d04'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              <MdVerified size={17} />
              {stats.pending > 0 ? `Review ${stats.pending} Pending` : 'Verification Queue'}
            </button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <>
          <CardSkeleton count={4} />
          <div style={{ marginTop: 24 }}><TableSkeleton /></div>
        </>
      ) : (
        <>
          {/* KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18, marginBottom: 24 }} className="kpi-grid">
            <KPICard icon={<MdPeople size={22} />}   label="Active Users"          value={(stats.total_users||0).toLocaleString()}       color="#3b82f6" />
            <KPICard icon="📋"                        label="Total Requests"        value={(stats.total_requests||0).toLocaleString()}     color="#e85d04" />
            <KPICard icon={<MdVerified size={22} />}  label="Pending Verification"  value={(stats.pending||0).toLocaleString()}            color="#f59e0b" />
            <KPICard icon={<MdPayment size={22} />}   label="Total Funds Raised"    value={currency(stats.total_amount_raised||0)}         color="#10b981" />
          </div>

          {/* Main grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 20, marginBottom: 20 }} className="admin-main">

            {/* Recent payments */}
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, overflow: 'hidden', boxShadow: 'var(--shadow-xs)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', borderBottom: '1px solid #f1f5f9' }}>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: '#0d0f14', margin: 0 }}>Recent Payments</h2>
                <Link to="/admin/payments" style={{ fontSize: 12, color: '#e85d04', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                  View all <MdArrowForward size={13} />
                </Link>
              </div>
              {payments.length > 0 ? (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {['Donor','Case','Amount','Time'].map(h => (
                        <th key={h} style={{ padding: '10px 18px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: '#94a3b8', background: '#f8fafc', borderBottom: '1px solid #f1f5f9', textTransform: 'uppercase', letterSpacing: '.07em' }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {payments.slice(0, 8).map((p, i) => (
                      <tr key={i} style={{ borderBottom: i < payments.length - 1 ? '1px solid #f8fafc' : 'none' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <td style={{ padding: '12px 18px', fontSize: 13, fontWeight: 600, color: '#334155', whiteSpace: 'nowrap' }}>
                          {p.donor?.first_name} {p.donor?.last_name?.[0]}.
                        </td>
                        <td style={{ padding: '12px 18px', fontSize: 12, color: '#64748b', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {p.request?.title || 'General Fund'}
                        </td>
                        <td style={{ padding: '12px 18px', fontSize: 13, fontWeight: 700, color: '#10b981', whiteSpace: 'nowrap' }}>
                          {currency(p.amount)}
                        </td>
                        <td style={{ padding: '12px 18px', fontSize: 11, color: '#94a3b8', whiteSpace: 'nowrap' }}>
                          {ago(p.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div style={{ padding: '40px 22px' }}>
                  <Empty icon="💰" title="No payments yet" />
                </div>
              )}
            </div>

            {/* Status breakdown */}
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, overflow: 'hidden', boxShadow: 'var(--shadow-xs)' }}>
              <div style={{ padding: '18px 22px', borderBottom: '1px solid #f1f5f9' }}>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: '#0d0f14', margin: 0 }}>Request Status</h2>
              </div>
              <div style={{ padding: '8px 0' }}>
                {byStatus.map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 22px' }}>
                    <Badge status={s._id} size="sm" dot />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 80, height: 5, background: '#f1f5f9', borderRadius: 999, overflow: 'hidden' }}>
                        <div style={{ width: `${Math.min(100, (s.count / (byStatus[0]?.count || 1)) * 100)}%`, height: '100%', background: '#e85d04', borderRadius: 999 }} />
                      </div>
                      <span style={{ fontWeight: 800, fontSize: 15, color: '#0d0f14', minWidth: 30, textAlign: 'right' }}>{s.count}</span>
                    </div>
                  </div>
                ))}
                {byStatus.length === 0 && (
                  <div style={{ padding: '30px 22px', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
                    No data yet
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }} className="quick-actions">
            <QuickAction to="/admin/verify/requests" icon="✅" label="Verify Requests"  desc="Review submissions queue" color="#10b981" />
            <QuickAction to="/admin/verify/projects" icon="📁" label="Verify Projects"  desc="Approve NGO projects"     color="#8b5cf6" />
            <QuickAction to="/admin/users"           icon="👥" label="Manage Users"     desc="View all platform users"  color="#3b82f6" />
            <QuickAction to="/admin/payments"        icon="💰" label="All Payments"     desc="Full payment history"     color="#f59e0b" />
          </div>
        </>
      )}

      <style>{`
        @media(max-width:1024px){
          .kpi-grid      { grid-template-columns:repeat(2,1fr) !important; }
          .admin-main    { grid-template-columns:1fr !important; }
          .quick-actions { grid-template-columns:repeat(2,1fr) !important; }
        }
        @media(max-width:560px){
          .kpi-grid      { grid-template-columns:1fr 1fr !important; }
          .quick-actions { grid-template-columns:1fr !important; }
        }
      `}</style>
    </>
  );
}

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MdArrowForward, MdVerified, MdPeople, MdPayment, MdBarChart } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import dashboardSvc from '../../services/dashboardService';
import { CardSkeleton, TableSkeleton } from '../../components/common/Loader';
import Badge from '../../components/common/Badge';
import Empty from '../../components/common/Empty';
import { currency, ago } from '../../utils/helpers';

const KPI = ({ icon, label, value, trend, color='var(--brand)' }) => (
  <div style={{ background:'#fff', border:'1px solid var(--gray-200)', borderRadius:16, padding:24 }}>
    <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:16 }}>
      <div style={{ width:46, height:46, borderRadius:13, background:`${color}12`, color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>{icon}</div>
      {trend !== undefined && (
        <span style={{ fontSize:12, fontWeight:700, color: trend >= 0 ? 'var(--success)' : 'var(--danger)', background: trend >= 0 ? 'var(--success-50)' : 'var(--danger-50)', padding:'3px 9px', borderRadius:999 }}>
          {trend >= 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <p style={{ fontSize:28, fontWeight:900, color:'var(--gray-900)', letterSpacing:'-1px', marginBottom:4 }}>{value}</p>
    <p style={{ fontSize:13, color:'var(--gray-400)' }}>{label}</p>
  </div>
);

export default function AdminDashboard() {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn:  dashboardSvc.admin,
    staleTime: 60000,
    refetchInterval: 120000,
  });

  const stats   = data?.stats          || {};
  const byStatus= data?.by_status      || [];
  const payments= data?.recent_payments|| [];
  const bySDG   = data?.by_sdg         || [];

  return (
    <>
      <Helmet><title>Admin Dashboard — Impact Bridge</title></Helmet>

      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:32, flexWrap:'wrap', gap:16 }}>
        <div>
          <h1 style={{ fontSize:26, fontWeight:800, color:'var(--gray-900)', letterSpacing:'-.5px', marginBottom:6 }}>Admin Dashboard</h1>
          <p style={{ fontSize:14, color:'var(--gray-400)' }}>Platform overview · {new Date().toLocaleDateString('en-NG', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}</p>
        </div>
        <Link to="/admin/verify/requests">
          <button style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 18px', background:'var(--brand)', color:'#fff', borderRadius:10, fontSize:13, fontWeight:700, cursor:'pointer', border:'none', transition:'all 150ms' }}
            onMouseEnter={e => { e.currentTarget.style.background='var(--brand-hover)'; e.currentTarget.style.transform='translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background='var(--brand)'; e.currentTarget.style.transform='translateY(0)'; }}>
            <MdVerified size={17} />
            {stats.pending > 0 ? `Verify ${stats.pending} Pending` : 'Verification Queue'}
          </button>
        </Link>
      </div>

      {isLoading ? (
        <>
          <CardSkeleton count={4} />
          <div style={{ marginTop:24 }}><TableSkeleton /></div>
        </>
      ) : (
        <>
          {/* KPIs */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:20, marginBottom:28 }} className="admin-kpi">
            <KPI icon={<MdPeople />}   label="Active Users"       value={(stats.total_users||0).toLocaleString()}     color="var(--info)"    />
<KPI icon="📋"             label="Total Requests"     value={(stats.total_requests||0).toLocaleString()}  color="var(--brand)"   />
<KPI icon={<MdVerified />} label="Pending Verification" value={(stats.pending||0).toLocaleString()} color="var(--warning)" />
<KPI icon={<MdPayment />}  label="Total Raised"       value={currency(stats.total_amount_raised||0)}     color="var(--success)" />
</div>
<div style={{ display:'grid', gridTemplateColumns:'1.6fr 1fr', gap:24, marginBottom:24 }} className="admin-grid">

        {/* Recent payments */}
        <div style={{ background:'#fff', border:'1px solid var(--gray-200)', borderRadius:16, overflow:'hidden' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'20px 24px', borderBottom:'1px solid var(--gray-100)' }}>
            <h2 style={{ fontSize:16, fontWeight:700, color:'var(--gray-900)', margin:0 }}>Recent Payments</h2>
            <Link to="/admin/payments" style={{ fontSize:12, color:'var(--brand)', fontWeight:700, display:'flex', alignItems:'center', gap:4 }}>View all <MdArrowForward size={14} /></Link>
          </div>
          {payments.length > 0 ? (
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr>
                  {['Donor','Case','Amount','Time'].map(h => (
                    <th key={h} style={{ padding:'10px 20px', textAlign:'left', fontSize:11, fontWeight:700, color:'var(--gray-400)', background:'var(--gray-50)', borderBottom:'1px solid var(--gray-100)', textTransform:'uppercase', letterSpacing:'.06em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {payments.map((p, i) => (
                  <tr key={i} style={{ borderBottom: i < payments.length-1 ? '1px solid var(--gray-50)' : 'none' }}>
                    <td style={{ padding:'12px 20px', fontSize:13, fontWeight:600, color:'var(--gray-800)' }}>{p.donor?.first_name} {p.donor?.last_name?.[0]}.</td>
                    <td style={{ padding:'12px 20px', fontSize:13, color:'var(--gray-500)', maxWidth:180, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.request?.title || 'General'}</td>
                    <td style={{ padding:'12px 20px', fontSize:13, fontWeight:700, color:'var(--brand)' }}>{currency(p.amount)}</td>
                    <td style={{ padding:'12px 20px', fontSize:12, color:'var(--gray-400)', whiteSpace:'nowrap' }}>{ago(p.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ padding:'40px 24px' }}><Empty icon="💰" title="No payments yet" /></div>
          )}
        </div>

        {/* Request status breakdown */}
        <div style={{ background:'#fff', border:'1px solid var(--gray-200)', borderRadius:16, overflow:'hidden' }}>
          <div style={{ padding:'20px 24px', borderBottom:'1px solid var(--gray-100)' }}>
            <h2 style={{ fontSize:16, fontWeight:700, color:'var(--gray-900)', margin:0 }}>Request Status</h2>
          </div>
          <div style={{ padding:'8px 0' }}>
            {byStatus.map((s, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 24px' }}>
                <Badge status={s._id} size="sm" dot />
                <span style={{ fontWeight:800, fontSize:16, color:'var(--gray-900)' }}>{s.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14 }} className="admin-links">
        {[
          { to:'/admin/verify/requests', icon:'✅', label:'Verify Requests',   color:'var(--success)' },
          { to:'/admin/verify/projects', icon:'📁', label:'Verify Projects',   color:'var(--info)' },
          { to:'/admin/users',           icon:'👥', label:'Manage Users',      color:'#8B5CF6' },
          { to:'/admin/payments',        icon:'💰', label:'Payment History',   color:'var(--warning)' },
        ].map(l => (
          <Link key={l.to} to={l.to}
            style={{ display:'flex', alignItems:'center', gap:12, background:'#fff', border:'1px solid var(--gray-200)', borderRadius:14, padding:'16px 18px', transition:'all 150ms' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor=l.color; e.currentTarget.style.boxShadow=`0 4px 14px ${l.color}15`; e.currentTarget.style.transform='translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor='var(--gray-200)'; e.currentTarget.style.boxShadow='none'; e.currentTarget.style.transform='translateY(0)'; }}>
            <span style={{ fontSize:24 }}>{l.icon}</span>
            <span style={{ fontSize:13, fontWeight:600, color:'var(--gray-800)' }}>{l.label}</span>
            <MdArrowForward size={16} style={{ color:l.color, marginLeft:'auto' }} />
          </Link>
        ))}
      </div>
    </>
  )}

  <style>{`
    @media(max-width:1024px){.admin-kpi{grid-template-columns:repeat(2,1fr)!important}.admin-grid{grid-template-columns:1fr!important}.admin-links{grid-template-columns:repeat(2,1fr)!important}}
    @media(max-width:560px){.admin-kpi{grid-template-columns:1fr 1fr!important}.admin-links{grid-template-columns:1fr!important}}
  `}</style>
</>
  );
}