import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import {
  MdArrowBack, MdLocationOn, MdCalendarToday,
  MdPeople, MdVerified, MdAccountBalanceWallet,
} from 'react-icons/md';
import projectService from '../../services/projectService';
import { PageLoader } from '../../components/common/Loader';
import ProgressBar from '../../components/common/ProgressBar';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Empty from '../../components/common/Empty';
import { currency, fmtDate, pct, clip } from '../../utils/helpers';
import { SDG } from '../../utils/constants';

export default function ProjectDetail() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const [tab, setTab] = useState('about');

  const { data: project, isLoading, error } = useQuery({
    queryKey: ['project', id],
    queryFn:  () => projectService.getById(id),
    retry: false,
  });

  if (isLoading) return <PageLoader />;
  if (error || !project) return (
    <div style={{ maxWidth:1280, margin:'0 auto', padding:'80px 24px' }}>
      <Empty icon="😔" title="Project not found"
        message="This project may have been removed or is not publicly visible."
        action={() => navigate('/projects')} actionLabel="Browse Projects" />
    </div>
  );

  const p   = pct(project.amount_funded, project.total_budget);
  const sdgNums = project.sdg_goals || [];

  const Tab = ({ name, label }) => (
    <button onClick={() => setTab(name)} style={{
      padding:'9px 20px', borderRadius:10, fontSize:14, fontWeight:600, cursor:'pointer',
      transition:'all 150ms',
      border:`1.5px solid ${tab===name ? '#E85D04' : 'transparent'}`,
      background: tab===name ? '#FFF4EE' : 'transparent',
      color:      tab===name ? '#E85D04' : '#64748B',
    }}>
      {label}
    </button>
  );

  return (
    <>
      <Helmet><title>{project.title} — Impact Bridge Projects</title></Helmet>

      {/* Sticky top bar */}
      <div style={{ background:'#fff', borderBottom:'1px solid #F1F5F9', padding:'12px 0', position:'sticky', top:66, zIndex:50 }}>
        <div style={{ maxWidth:1280, margin:'0 auto', padding:'0 24px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, flexWrap:'wrap' }}>
          <button onClick={() => navigate(-1)} style={{
            display:'flex', alignItems:'center', gap:6, fontSize:13,
            fontWeight:600, color:'#64748B', cursor:'pointer', background:'none', border:'none',
          }}
          onMouseEnter={e => e.currentTarget.style.color='#E85D04'}
          onMouseLeave={e => e.currentTarget.style.color='#64748B'}>
            <MdArrowBack size={18} /> Back to Projects
          </button>
        </div>
      </div>

      <div style={{ maxWidth:1280, margin:'0 auto', padding:'40px 24px 80px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 360px', gap:40, alignItems:'start' }}
          className="proj-detail-grid">

          {/* Left */}
          <div>
            {/* Header */}
            <div style={{ marginBottom:28 }}>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:16 }}>
                <Badge status={project.status} size="md" dot />
                {sdgNums.slice(0,3).map(n => (
                  <span key={n} style={{
                    display:'inline-flex', alignItems:'center', gap:5,
                    fontSize:11, fontWeight:700, color:'#fff',
                    background: SDG[n]?.color || '#E85D04',
                    padding:'3px 10px', borderRadius:999,
                  }}>
                    {SDG[n]?.icon} SDG {n}
                  </span>
                ))}
                <span style={{
                  fontSize:11, fontWeight:700, color:'#3B82F6',
                  background:'#EFF6FF', padding:'3px 10px', borderRadius:999,
                  textTransform:'capitalize',
                }}>
                  {project.creator_type}
                </span>
              </div>

              <h1 style={{ fontSize:'clamp(1.5rem,2.5vw,2rem)', fontWeight:900, color:'#0F172A', lineHeight:1.2, letterSpacing:'-.5px', marginBottom:16 }}>
                {project.title}
              </h1>

              <div style={{ display:'flex', flexWrap:'wrap', gap:20, fontSize:13, color:'#94A3B8' }}>
                {project.state && (
                  <span style={{ display:'flex', alignItems:'center', gap:5 }}>
                    <MdLocationOn size={15} />{project.state}
                  </span>
                )}
                {project.created_at && (
                  <span style={{ display:'flex', alignItems:'center', gap:5 }}>
                    <MdCalendarToday size={14} />{fmtDate(project.created_at)}
                  </span>
                )}
                {project.beneficiaries_target && (
                  <span style={{ display:'flex', alignItems:'center', gap:5 }}>
                    <MdPeople size={15} />{project.beneficiaries_target.toLocaleString()} target beneficiaries
                  </span>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display:'flex', gap:4, marginBottom:28, background:'#F8FAFC', padding:5, borderRadius:12, width:'fit-content' }}>
              <Tab name="about"      label="About"      />
              <Tab name="milestones" label={`Milestones (${project.milestones?.length || 0})`} />
              <Tab name="reports"    label={`Reports (${project.reports?.length || 0})`} />
            </div>

            {/* Tab content */}
            {tab === 'about' && (
              <div style={{ lineHeight:1.8, color:'#64748B', fontSize:15 }}>
                <p style={{ marginBottom:20 }}>{project.description || 'No description available.'}</p>
                {project.impact_statement && (
                  <div style={{ background:'#FFF4EE', border:'1px solid rgba(232,93,4,.15)', borderRadius:14, padding:'16px 20px', marginTop:20 }}>
                    <p style={{ fontWeight:700, fontSize:13, color:'#E85D04', marginBottom:6 }}>Expected Impact</p>
                    <p style={{ fontSize:14, color:'#334155' }}>{project.impact_statement}</p>
                  </div>
                )}
              </div>
            )}

            {tab === 'milestones' && (
              <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                {project.milestones?.length > 0 ? (
                  project.milestones.map((m, i) => (
                    <div key={i} style={{ background:'#fff', border:'1px solid #E2E8F0', borderRadius:14, padding:22 }}>
                      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
                        <h3 style={{ fontSize:15, fontWeight:700, color:'#0F172A' }}>{m.title}</h3>
                        <Badge status={m.status} size="sm" />
                      </div>
                      {m.description && <p style={{ fontSize:13, color:'#64748B', lineHeight:1.7 }}>{m.description}</p>}
                      {m.amount_allocated > 0 && (
                        <p style={{ fontSize:12, color:'#94A3B8', marginTop:10 }}>
                          Budget: {currency(m.amount_allocated)}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <Empty icon="🏗️" title="No milestones added yet" message="Milestones will appear here as the project progresses." />
                )}
              </div>
            )}

            {tab === 'reports' && (
              <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                {project.reports?.length > 0 ? (
                  project.reports.map((r, i) => (
                    <div key={i} style={{ background:'#fff', border:'1px solid #E2E8F0', borderRadius:14, padding:22 }}>
                      <h3 style={{ fontSize:15, fontWeight:700, color:'#0F172A', marginBottom:10 }}>{r.title}</h3>
                      <p style={{ fontSize:13, color:'#64748B', lineHeight:1.7 }}>{r.body}</p>
                      {r.beneficiaries_reached > 0 && (
                        <div style={{ marginTop:12, display:'flex', alignItems:'center', gap:8, fontSize:13, color:'#10B981', fontWeight:600 }}>
                          <MdPeople size={16} />{r.beneficiaries_reached.toLocaleString()} beneficiaries reached
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <Empty icon="📋" title="No reports yet" message="Field reports will appear here once work begins." />
                )}
              </div>
            )}
          </div>

          {/* Right — Sidebar */}
          <div style={{ position:'sticky', top:'calc(66px + 60px)' }}>
            <div style={{ background:'#fff', border:'1px solid #E2E8F0', borderRadius:20, padding:28, boxShadow:'0 4px 16px rgba(0,0,0,.06)' }}>
              {/* Funding progress */}
              <div style={{ marginBottom:24 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:8 }}>
                  <div>
                    <p style={{ fontSize:26, fontWeight:900, color:'#E85D04', letterSpacing:'-1px' }}>{currency(project.amount_funded || 0)}</p>
                    <p style={{ fontSize:13, color:'#94A3B8', marginTop:2 }}>funded of {currency(project.total_budget)} goal</p>
                  </div>
                  <span style={{ fontSize:18, fontWeight:900, color: p >= 100 ? '#10B981' : '#334155' }}>{p}%</span>
                </div>
                <ProgressBar value={p} max={100} height={10} />
              </div>

              {/* Key info */}
              <div style={{ display:'flex', flexDirection:'column', gap:14, marginBottom:24 }}>
                {[
                  { label:'Budget',          value: currency(project.total_budget) },
                  { label:'Start Date',      value: fmtDate(project.start_date) || 'TBD' },
                  { label:'End Date',        value: fmtDate(project.end_date) || 'TBD' },
                  { label:'Target Beneficiaries', value: project.beneficiaries_target?.toLocaleString() || 'N/A' },
                ].map(item => (
                  <div key={item.label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:'1px solid #F1F5F9' }}>
                    <span style={{ fontSize:13, color:'#94A3B8' }}>{item.label}</span>
                    <span style={{ fontSize:13, fontWeight:700, color:'#0F172A' }}>{item.value}</span>
                  </div>
                ))}
              </div>

              {/* Wallet badge */}
              {project.wallet && (
                <div style={{ display:'flex', alignItems:'center', gap:10, background:'#ECFDF5', border:'1px solid #A7F3D0', borderRadius:12, padding:'12px 16px', marginBottom:20 }}>
                  <MdAccountBalanceWallet size={20} style={{ color:'#10B981', flexShrink:0 }} />
                  <div>
                    <p style={{ fontSize:12, fontWeight:700, color:'#166534' }}>Project Wallet Active</p>
                    <p style={{ fontSize:11, color:'#16A34A', marginTop:2 }}>Funds held in secure escrow</p>
                  </div>
                </div>
              )}

              <Button fullWidth size="lg" onClick={() => window.open(`https://wa.me/${process.env.REACT_APP_WHATSAPP || '2348012345678'}?text=Hello! I'd like to know more about the project: ${project.title}`, '_blank')}>
                Inquire via WhatsApp
              </Button>

              {/* Creator */}
              {project.created_by && (
                <div style={{ marginTop:24, paddingTop:24, borderTop:'1px solid #F1F5F9' }}>
                  <p style={{ fontSize:11, fontWeight:700, color:'#94A3B8', textTransform:'uppercase', letterSpacing:'.07em', marginBottom:14 }}>Project Creator</p>
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{ width:42, height:42, borderRadius:12, background:'#FFF4EE', color:'#E85D04', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:16, flexShrink:0 }}>
                      {project.created_by.first_name?.[0]}
                    </div>
                    <div>
                      <p style={{ fontWeight:700, fontSize:14, color:'#0F172A' }}>
                        {project.created_by.first_name} {project.created_by.last_name}
                      </p>
                      {project.created_by.organization_name && (
                        <p style={{ fontSize:12, color:'#94A3B8', marginTop:2 }}>{project.created_by.organization_name}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media(max-width:1024px){
          .proj-detail-grid { grid-template-columns:1fr !important; }
          .proj-detail-grid>div:last-child { position:static !important; }
        }
      `}</style>
    </>
  );
}