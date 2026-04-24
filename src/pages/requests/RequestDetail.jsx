import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import {
  MdLocationOn, MdPeople, MdCalendarToday, MdArrowBack,
  MdShare, MdVolunteerActivism, MdVerified, MdOpenInNew,
} from 'react-icons/md';
import { FaWhatsapp } from 'react-icons/fa';
import requestSvc from '../../services/requestService';
import { PageLoader, CardSkeleton } from '../../components/common/Loader';
import ProgressBar from '../../components/common/ProgressBar.jsx'
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Empty from '../../components/common/Empty';
import DonateModal from '../../components/payments/DonateModal';
import { currency, fmtDate, ago, pct, waLink } from '../../utils/helpers';
import { SDG, WA_PHONE } from '../../utils/constants';

export default function RequestDetail() {
  const { id }                     = useParams();
  const navigate                   = useNavigate();
  const [donating, setDonating]    = useState(false);
  const [tab, setTab]              = useState('about');

  const { data: request, isLoading, error } = useQuery({
    queryKey: ['request', id],
    queryFn:  () => requestSvc.getById(id),
    retry: false,
  });

  const { data: funding } = useQuery({
    queryKey: ['request-funding', id],
    queryFn:  () => requestSvc.getFunding(id, { limit:10 }),
    enabled: !!request,
  });

  if (isLoading) return <PageLoader />;
  if (error || !request) return (
    <div className="container" style={{ padding:'80px 24px' }}>
      <Empty icon="😔" title="Case not found"
        message="This case may have been removed or is not publicly visible."
        action={() => navigate('/requests')} actionLabel="Browse All Cases" />
    </div>
  );

  const p    = pct(request.amount_raised, request.amount_needed);
  const sdg  = SDG[request.sdg_number] || {};
  const link = waLink(WA_PHONE, `Hi! I'd like to know more about: "${request.title}" — ${window.location.href}`);

  const share = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: request.title, url: window.location.href }); }
      catch {}
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  const TAB = ({ name, label }) => (
    <button onClick={() => setTab(name)} style={{ padding:'10px 20px', borderRadius:10, fontSize:14, fontWeight:600, cursor:'pointer', transition:'all 150ms', border:`1.5px solid ${tab===name ? 'var(--brand)' : 'transparent'}`, background: tab===name ? 'var(--brand-50)' : 'transparent', color: tab===name ? 'var(--brand)' : 'var(--gray-500)' }}>
      {label}
    </button>
  );

  const donations = funding?.data || [];

  return (
    <>
      <Helmet>
        <title>{request.title} — Impact Bridge</title>
        <meta name="description" content={request.description?.slice(0, 160)} />
      </Helmet>

      {/* Top bar */}
      <div style={{ background:'#fff', borderBottom:'1px solid var(--gray-100)', padding:'12px 0', position:'sticky', top:'var(--nav-h)', zIndex:50 }}>
        <div className="container" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, flexWrap:'wrap' }}>
          <button onClick={() => navigate(-1)} style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, fontWeight:600, color:'var(--gray-500)', cursor:'pointer', transition:'color 150ms' }}
            onMouseEnter={e => e.currentTarget.style.color='var(--brand)'}
            onMouseLeave={e => e.currentTarget.style.color='var(--gray-500)'}>
            <MdArrowBack size={18} /> Back to Cases
          </button>
          <div style={{ display:'flex', gap:8 }}>
            <Button variant="ghost" size="sm" icon={<MdShare size={16} />} onClick={share}>Share</Button>
            <a href={link} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="sm" icon={<FaWhatsapp size={16} />}>WhatsApp</Button>
            </a>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding:'40px 24px 80px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 380px', gap:40, alignItems:'start' }} className="detail-grid">

          {/* Left — main content */}
          <div>
            {/* Header */}
            <div style={{ marginBottom:32 }}>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:16 }}>
                <Badge status={request.status} size="md" dot />
                {request.sdg_number && (
                  <span style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:12, fontWeight:700, color:'#fff', background: sdg.color||'var(--brand)', padding:'4px 12px', borderRadius:999 }}>
                    {sdg.icon} SDG {request.sdg_number} — {sdg.title}
                  </span>
                )}
                {request.is_featured && (
                  <span style={{ display:'inline-flex', alignItems:'center', gap:4, fontSize:11, fontWeight:700, color:'var(--warning)', background:'var(--warning-50)', padding:'3px 10px', borderRadius:999, border:'1px solid #FDE68A' }}>
                    ⭐ Featured
                  </span>
                )}
              </div>

              <h1 style={{ fontSize:'clamp(1.5rem,3vw,2.1rem)', fontWeight:900, color:'var(--gray-900)', lineHeight:1.2, letterSpacing:'-.5px', marginBottom:16 }}>
                {request.title}
              </h1>

              <div style={{ display:'flex', flexWrap:'wrap', gap:20, fontSize:13, color:'var(--gray-400)' }}>
                <span style={{ display:'flex', alignItems:'center', gap:5 }}>
                  <MdLocationOn size={15} />{request.state}{request.lga ? `, ${request.lga}` : ''}
                </span>
                <span style={{ display:'flex', alignItems:'center', gap:5 }}>
                  <MdCalendarToday size={14} />{fmtDate(request.created_at)}
                </span>
                <span style={{ display:'flex', alignItems:'center', gap:5 }}>
                  <MdPeople size={15} />{request.donor_count || 0} donors
                </span>
                {request.is_verified && (
                  <span style={{ display:'flex', alignItems:'center', gap:5, color:'var(--success)', fontWeight:600 }}>
                    <MdVerified size={15} />Verified by Impact Bridge
                  </span>
                )}
              </div>
            </div>

            {/* Image */}
            {request.media?.[0]?.url && (
              <div style={{ borderRadius:16, overflow:'hidden', marginBottom:32, border:'1px solid var(--gray-200)' }}>
                <img src={request.media[0].url} alt={request.title}
                  style={{ width:'100%', height:360, objectFit:'cover', display:'block' }} />
              </div>
            )}

            {/* Tabs */}
            <div style={{ display:'flex', gap:4, marginBottom:28, background:'var(--gray-50)', padding:5, borderRadius:12, width:'fit-content' }}>
              <TAB name="about"    label="About"        />
              <TAB name="progress" label={`Progress (${request.progress_updates?.length||0})`} />
              <TAB name="donors"   label={`Donors (${request.donor_count||0})`} />
            </div>

            {/* Tab content */}
            {tab === 'about' && (
              <div style={{ lineHeight:1.8, color:'var(--gray-600)', fontSize:15 }}>
                <p style={{ marginBottom:20 }}>{request.description}</p>
                {request.impact_statement && (
                  <div style={{ background:'var(--brand-50)', border:'1px solid var(--brand-100)', borderRadius:14, padding:'16px 20px', marginTop:20 }}>
                    <p style={{ fontSize:13, fontWeight:700, color:'var(--brand)', marginBottom:6 }}>Expected Impact</p>
                    <p style={{ fontSize:14, color:'var(--gray-700)' }}>{request.impact_statement}</p>
                  </div>
                )}
                {request.beneficiaries_count > 0 && (
                  <div style={{ display:'flex', alignItems:'center', gap:12, marginTop:20, background:'var(--gray-50)', borderRadius:12, padding:'14px 18px' }}>
                    <span style={{ fontSize:28 }}>👥</span>
                    <div>
                      <p style={{ fontWeight:700, fontSize:18, color:'var(--gray-900)' }}>{request.beneficiaries_count.toLocaleString()}</p>
                      <p style={{ fontSize:13, color:'var(--gray-400)' }}>Direct beneficiaries</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {tab === 'progress' && (
              <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
                {request.progress_updates?.length > 0 ? (
                  request.progress_updates.map((u, i) => (
                    <div key={i} style={{ background:'#fff', border:'1px solid var(--gray-200)', borderRadius:14, padding:24 }}>
                      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                        <h3 style={{ fontSize:16, fontWeight:700, color:'var(--gray-900)' }}>{u.title}</h3>
                        <span style={{ fontSize:12, color:'var(--gray-400)' }}>{ago(u.created_at)}</span>
                      </div>
                      <p style={{ fontSize:14, color:'var(--gray-600)', lineHeight:1.7 }}>{u.description}</p>
                      {u.media?.length > 0 && (
                        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(120px,1fr))', gap:8, marginTop:16 }}>
                          {u.media.map((m, j) => (
                            <img key={j} src={m.url} alt="Progress" style={{ width:'100%', height:100, objectFit:'cover', borderRadius:8 }} />
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <Empty icon="📋" title="No updates yet" message="Progress updates will appear here as work begins." />
                )}
              </div>
            )}

            {tab === 'donors' && (
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {donations.length > 0 ? (
                  donations.map((d, i) => (
                    <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', background:'#fff', border:'1px solid var(--gray-100)', borderRadius:12, padding:'14px 18px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                        <div style={{ width:38, height:38, borderRadius:'50%', background:'var(--brand-50)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:700, color:'var(--brand)', flexShrink:0 }}>
                          {d.is_anonymous ? '?' : (d.donor?.first_name?.[0] || '?')}
                        </div>
                        <div>
                          <p style={{ fontWeight:600, fontSize:14, color:'var(--gray-800)' }}>
                            {d.is_anonymous ? 'Anonymous Donor' : `${d.donor?.first_name} ${d.donor?.last_name}`}
                          </p>
                          {d.donor_message && <p style={{ fontSize:12, color:'var(--gray-400)', marginTop:2 }}>{d.donor_message}</p>}
                        </div>
                      </div>
                      <div style={{ textAlign:'right', flexShrink:0 }}>
                        <p style={{ fontWeight:700, color:'var(--brand)', fontSize:14 }}>{currency(d.amount)}</p>
                        <p style={{ fontSize:11, color:'var(--gray-400)', marginTop:2 }}>{ago(d.created_at)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <Empty icon="💙" title="Be the first donor!" message="No donations yet. Help make this case a reality." action={() => setDonating(true)} actionLabel="Donate Now" />
                )}
              </div>
            )}
          </div>

          {/* Right — donation sidebar */}
          <div style={{ position:'sticky', top:'calc(var(--nav-h) + 64px)' }}>
            <div style={{ background:'#ffffff42', border:'1px solid var(--gray-200)', borderRadius:20, padding:28, boxShadow:'var(--shadow-md)' }}>
              {/* Progress */}
              <div style={{ marginBottom:24 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:8 }}>
                  <div>
                    <p style={{ fontSize:28, fontWeight:900, color:'var(--brand)', letterSpacing:'-1px', fontFamily:'var(--font)' }}>{currency(request.amount_raised)}</p>
                    <p style={{ fontSize:13, color:'var(--gray-400)', marginTop:2 }}>raised of {currency(request.amount_needed)} goal</p>
                  </div>
                  <span style={{ fontSize:20, fontWeight:900, color: p >= 100 ? 'var(--success)' : 'var(--gray-700)' }}>{p}%</span>
                </div>
                <ProgressBar value={p} max={100} height={10} />
              </div>

              {/* Stats row */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:24 }}>
                {[
                  { label:'Donors', value: request.donor_count || 0 },
                  { label:'Days left', value: request.deadline ? Math.max(0, Math.ceil((new Date(request.deadline) - new Date()) / 86400000)) : '∞' },
                ].map(s => (
                  <div key={s.label} style={{ background:'var(--gray-50)', borderRadius:12, padding:'12px 16px', textAlign:'center' }}>
                    <p style={{ fontWeight:800, fontSize:22, color:'var(--gray-900)' }}>{s.value}</p>
                    <p style={{ fontSize:12, color:'var(--gray-400)', marginTop:3 }}>{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Donate button */}
              <Button fullWidth size="lg" icon={<MdVolunteerActivism size={18} />} onClick={() => setDonating(true)}>
                Donate to This Case
              </Button>

              <div style={{ marginTop:14, display:'flex', alignItems:'center', gap:6, justifyContent:'center', fontSize:12, color:'var(--gray-400)' }}>
                <span>🔒</span> Secured by Korapay · All funds are escrowed
              </div>

              {/* Requester info */}
              {request.requester && (
                <div style={{ marginTop:24, paddingTop:24, borderTop:'1px solid var(--gray-100)' }}>
                  <p style={{ fontSize:12, fontWeight:700, color:'var(--gray-400)', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:14 }}>Submitted by</p>
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{ width:42, height:42, borderRadius:'50%', background:'var(--brand-50)', color:'var(--brand)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:16, flexShrink:0, border:'2px solid var(--brand-100)' }}>
                      {request.requester?.first_name?.[0]}
                    </div>
                    <div>
                      <p style={{ fontWeight:700, fontSize:14, color:'var(--gray-800)' }}>
                        {request.requester.first_name} {request.requester.last_name}
                      </p>
                      <p style={{ fontSize:12, color:'var(--gray-400)', marginTop:2 }}>
                        {request.requester.state}{request.requester.lga ? `, ${request.requester.lga}` : ''}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* NGO */}
              {request.assigned_ngo && (
                <div style={{ marginTop:20, paddingTop:20, borderTop:'1px solid var(--gray-100)' }}>
                  <p style={{ fontSize:12, fontWeight:700, color:'var(--gray-400)', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:10 }}>Executing NGO</p>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <div style={{ width:36, height:36, borderRadius:10, background:'var(--success-50)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, border:'1px solid #A7F3D0' }}>🏢</div>
                    <p style={{ fontWeight:600, fontSize:14, color:'var(--gray-800)' }}>{request.assigned_ngo.name}</p>
                  </div>
                </div>
              )}
            </div>

            {/* WhatsApp inquiry */}
            <a href={link} target="_blank" rel="noopener noreferrer">
              <div style={{ marginTop:14, display:'flex', alignItems:'center', gap:10, background:'#DCFCE7', border:'1px solid #BBF7D0', borderRadius:14, padding:'14px 18px', cursor:'pointer', transition:'all 150ms' }}
                onMouseEnter={e => e.currentTarget.style.background='#BBF7D0'}
                onMouseLeave={e => e.currentTarget.style.background='#DCFCE7'}>
                <FaWhatsapp size={22} style={{ color:'#16A34A', flexShrink:0 }} />
                <div>
                  <p style={{ fontWeight:700, fontSize:13, color:'#15803D' }}>Inquire via WhatsApp</p>
                  <p style={{ fontSize:12, color:'#16A34A', marginTop:2 }}>Chat directly about this case</p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>

      <DonateModal isOpen={donating} onClose={() => setDonating(false)} request={request} />

      <style>{`
        @media(max-width:1024px){.detail-grid{grid-template-columns:1fr!important}.detail-grid>div:last-child{position:static!important}}
      `}</style>
    </>
  );
}