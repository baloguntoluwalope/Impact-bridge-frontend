import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  MdArrowForward, MdVerified, MdSecurity,
  MdAccountBalanceWallet, MdBarChart, MdPeople, MdPublic,
} from 'react-icons/md';
import requestService from '../services/requestService';
import sdgService     from '../services/sdgService';
import RequestCard    from '../pages/requests/RequestCard';
import { CardSkeleton } from '../components/common/Loader';
import { SDG, WA_PHONE } from '../utils/constants';
import { useAuth } from '../context/AuthContext';

/* ── Animated counter (no dependency needed) ─────────────────────── */
function AnimatedNumber({ target, prefix = '', suffix = '', duration = 2000 }) {
  const [count,   setCount]   = useState(0);
  const [started, setStarted] = useState(false);
  const ref    = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

/* ── Stat Bar ────────────────────────────────────────────────────── */
const STATS = [
  { target:12500, suffix:'+',  label:'Lives Impacted',  icon:'❤️' },
  { target:450,   suffix:'M+', label:'₦ Raised',        icon:'💰', prefix:'₦' },
  { target:1247,  suffix:'+',  label:'Cases Verified',  icon:'✅' },
  { target:17,    suffix:'',   label:'SDGs Covered',    icon:'🌍' },
];

function StatBar() {
  return (
    <div style={{ background:'#F8FAFC', borderTop:'1px solid #E2E8F0' }}>
      <div style={{ maxWidth:1280, margin:'0 auto', padding:'40px 24px' }}>
        <div style={{
          display:'grid',
          gridTemplateColumns:'repeat(4,1fr)',
          gap:24, textAlign:'center',
        }}
        className="stat-grid">
          {STATS.map((s, i) => (
            <div key={i}>
              <div style={{ fontSize:32, marginBottom:10, lineHeight:1 }}>{s.icon}</div>
              <div style={{
                fontSize:'clamp(1.6rem,3vw,2.25rem)',
                fontWeight:900, color:'#E85D04',
                lineHeight:1, fontFamily:'Inter,sans-serif',
                letterSpacing:'-1px', marginBottom:6,
              }}>
                <AnimatedNumber target={s.target} prefix={s.prefix||''} suffix={s.suffix} />
              </div>
              <div style={{ fontSize:13, color:'#64748B', fontWeight:500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
      <style>{`@media(max-width:640px){.stat-grid{grid-template-columns:repeat(2,1fr)!important}}`}</style>
    </div>
  );
}

/* ── Hero ────────────────────────────────────────────────────────── */
function Hero() {
  const { isAuth } = useAuth();

  return (
    <section style={{ background:'#ffffff', position:'relative', overflow:'hidden', minHeight:520 }}>
      {/* Soft ambient bg */}
      <div style={{
        position:'absolute', inset:0,
        background:'radial-gradient(ellipse 90% 60% at 65% -10%, rgba(232,93,4,.055) 0%, transparent 65%)',
        pointerEvents:'none',
      }} />

      <div style={{ maxWidth:1280, margin:'0 auto', padding:'80px 24px 72px', position:'relative', zIndex:1 }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:72, alignItems:'center' }}
          className="hero-grid">

          {/* ── Copy ── */}
          <div>
            {/* Pill */}
            <div style={{
              display:'inline-flex', alignItems:'center', gap:8,
              background:'#FFF4EE', border:'1px solid rgba(232,93,4,.2)',
              borderRadius:999, padding:'7px 18px', marginBottom:28,
            }}>
              <span style={{
                width:7, height:7, borderRadius:'50%',
                background:'#E85D04', flexShrink:0,
                animation:'pulse 2s infinite',
              }} />
              <span style={{ fontSize:12, fontWeight:700, color:'#E85D04', letterSpacing:'.03em' }}>
                National Social Impact Platform 🇳🇬
              </span>
            </div>

            {/* Headline */}
            <h1 style={{
              fontSize:'clamp(2.1rem,4.5vw,3.6rem)',
              fontWeight:900, color:'#0F172A',
              lineHeight:1.07, letterSpacing:'-2px',
              marginBottom:22, fontFamily:'Inter,sans-serif',
            }}>
              Real Needs.{' '}
              <span style={{
                backgroundImage:'linear-gradient(135deg,#E85D04 0%,#FF7A2F 100%)',
                WebkitBackgroundClip:'text',
                WebkitTextFillColor:'transparent',
                backgroundClip:'text',
              }}>
                Verified Funding.
              </span>
              <br />Proven Impact.
            </h1>

            <p style={{
              fontSize:17, color:'#64748B', lineHeight:1.75,
              maxWidth:500, marginBottom:32,
            }}>
              Impact Bridge connects verified individuals, schools, and communities
              with transparent funding from donors, NGOs, and government —
              every naira traceable, every impact proven.
            </p>

            {/* Trust badges */}
            <div style={{ display:'flex', flexWrap:'wrap', gap:20, marginBottom:36 }}>
              {[
                { icon:<MdVerified size={16} />,  text:'Verified cases only' },
                { icon:<MdSecurity size={16} />,  text:'Korapay secured'     },
                { icon:<MdBarChart size={16} />,  text:'Transparent impact'  },
              ].map((b, i) => (
                <div key={i} style={{
                  display:'flex', alignItems:'center', gap:7,
                  fontSize:13, color:'#475569', fontWeight:600,
                }}>
                  <span style={{ color:'#E85D04' }}>{b.icon}</span>
                  {b.text}
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
              <Link to="/requests" style={{
                display:'inline-flex', alignItems:'center', gap:8,
                padding:'13px 28px', background:'#E85D04', color:'#fff',
                borderRadius:12, fontWeight:700, fontSize:15,
                boxShadow:'0 6px 20px rgba(232,93,4,.3)',
                transition:'all 200ms ease',
                textDecoration:'none',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background    = '#C24E03';
                e.currentTarget.style.transform     = 'translateY(-2px)';
                e.currentTarget.style.boxShadow     = '0 10px 28px rgba(232,93,4,.4)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background    = '#E85D04';
                e.currentTarget.style.transform     = 'translateY(0)';
                e.currentTarget.style.boxShadow     = '0 6px 20px rgba(232,93,4,.3)';
              }}>
                Browse Verified Cases <MdArrowForward size={18} />
              </Link>

              <Link to={isAuth ? '/submit-request' : '/register'} style={{
                display:'inline-flex', alignItems:'center', gap:8,
                padding:'13px 28px', background:'#fff', color:'#0F172A',
                border:'1.5px solid #E2E8F0', borderRadius:12,
                fontWeight:700, fontSize:15,
                transition:'all 200ms ease', textDecoration:'none',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#E85D04';
                e.currentTarget.style.color       = '#E85D04';
                e.currentTarget.style.transform   = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#E2E8F0';
                e.currentTarget.style.color       = '#0F172A';
                e.currentTarget.style.transform   = 'translateY(0)';
              }}>
                {isAuth ? 'Submit a Request' : 'Create Free Account'}
              </Link>
            </div>
          </div>

          {/* ── Visual Card ── */}
          <div style={{ position:'relative' }} className="hero-visual">
            {/* Main card */}
            <div style={{
              background:'#fff', borderRadius:20, padding:28,
              boxShadow:'0 24px 64px rgba(0,0,0,.1)',
              border:'1px solid #E2E8F0',
              animation:'float 4s ease-in-out infinite',
              position:'relative', zIndex:1,
            }}>
              {/* Status */}
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:18 }}>
                <span style={{
                  fontSize:11, fontWeight:700, color:'#10B981',
                  background:'#ECFDF5', padding:'4px 10px',
                  borderRadius:6, border:'1px solid #A7F3D0',
                }}>✅ Verified</span>
                <span style={{ fontSize:12, color:'#94A3B8' }}>1h ago</span>
              </div>

              <h3 style={{ fontSize:16, fontWeight:700, color:'#0F172A', marginBottom:8, lineHeight:1.4 }}>
                School Roof Repair for 200 Students — Kano State
              </h3>
              <p style={{ fontSize:12, color:'#94A3B8', marginBottom:18 }}>
                📍 Kano · 📚 SDG 4: Quality Education
              </p>

              {/* Progress */}
              <div style={{ background:'#F1F5F9', borderRadius:999, height:8, overflow:'hidden', marginBottom:10 }}>
                <div style={{
                  width:'72%', height:'100%',
                  background:'linear-gradient(90deg,#E85D04,#FF7A2F)',
                  borderRadius:999,
                }} />
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:20 }}>
                <strong style={{ color:'#E85D04', fontSize:14 }}>₦720,000 raised</strong>
                <span style={{ color:'#94A3B8', fontSize:12 }}>72% · Goal: ₦1M</span>
              </div>

              {/* Donors row */}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <div style={{ display:'flex' }}>
                    {['A','B','C','D'].map((l, i) => (
                      <div key={l} style={{
                        width:28, height:28, borderRadius:'50%',
                        background:'#E85D04', color:'#fff',
                        fontSize:10, fontWeight:700,
                        display:'flex', alignItems:'center', justifyContent:'center',
                        border:'2px solid #fff',
                        marginLeft: i > 0 ? -8 : 0,
                      }}>{l}</div>
                    ))}
                  </div>
                  <span style={{ fontSize:12, color:'#64748B' }}>48 donors</span>
                </div>
                <div style={{
                  padding:'8px 16px', background:'#E85D04',
                  color:'#fff', borderRadius:8, fontSize:12, fontWeight:700,
                }}>
                  Donate Now
                </div>
              </div>
            </div>

            {/* Floating chips */}
            <div style={{
              position:'absolute', top:-16, right:-16,
              background:'#fff', borderRadius:14,
              padding:'12px 16px', boxShadow:'0 8px 24px rgba(0,0,0,.1)',
              border:'1px solid #E2E8F0',
              display:'flex', alignItems:'center', gap:10,
              animation:'float 5s ease-in-out .8s infinite',
              zIndex:2, minWidth:180,
            }}>
              <span style={{ fontSize:22 }}>💰</span>
              <div>
                <p style={{ fontSize:13, fontWeight:700, color:'#0F172A' }}>₦50,000</p>
                <p style={{ fontSize:11, color:'#94A3B8' }}>Donated just now</p>
              </div>
            </div>

            <div style={{
              position:'absolute', top:150, right:-28,
              background:'#fff', borderRadius:14,
              padding:'12px 16px', boxShadow:'0 8px 24px rgba(0,0,0,.1)',
              border:'1px solid #E2E8F0',
              display:'flex', alignItems:'center', gap:10,
              animation:'float 4.5s ease-in-out 1.6s infinite',
              zIndex:2, minWidth:180,
            }}>
              <span style={{ fontSize:22 }}>🎯</span>
              <div>
                <p style={{ fontSize:13, fontWeight:700, color:'#10B981' }}>Completed!</p>
                <p style={{ fontSize:11, color:'#94A3B8' }}>200 students helped</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <StatBar />

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1}50%{opacity:.4} }
        @keyframes float { 0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)} }
        @media(max-width:960px){
          .hero-grid    { grid-template-columns:1fr !important; gap:40px !important; }
          .hero-visual  { display:none !important; }
        }
      `}</style>
    </section>
  );
}

/* ── HowItWorks ──────────────────────────────────────────────────── */
const STEPS = [
  { n:'01', icon:'📝', title:'Submit Your Need',  desc:'Individuals, schools, and communities submit requests with evidence, location, and funding goal.', color:'#E85D04' },
  { n:'02', icon:'🔍', title:'Verification',      desc:'Our admin team manually reviews every submission. Fraudulent cases are rejected with clear reasons.', color:'#F59E0B' },
  { n:'03', icon:'🌐', title:'Published Live',    desc:'Verified cases become visible to thousands of donors, NGOs, corporates, and government partners.', color:'#10B981' },
  { n:'04', icon:'💰', title:'Secure Funding',    desc:'Donations processed via Korapay and held in an escrow wallet — every naira controlled and traceable.', color:'#8B5CF6' },
  { n:'05', icon:'🏗️', title:'NGO Execution',     desc:'Assigned NGO partners execute the project, submitting verified field reports and progress updates.', color:'#3B82F6' },
  { n:'06', icon:'✅', title:'Proven Impact',     desc:'Before/after media and completion reports are published for every donor to see.', color:'#059669' },
];

function HowItWorks() {
  return (
    <section style={{ background:'#F8FAFC', padding:'96px 0' }}>
      <div style={{ maxWidth:1280, margin:'0 auto', padding:'0 24px' }}>
        <div style={{ textAlign:'center', maxWidth:640, margin:'0 auto 60px' }}>
          <span style={{
            display:'inline-block', background:'#FFF4EE', color:'#E85D04',
            border:'1px solid rgba(232,93,4,.2)', borderRadius:999,
            padding:'6px 18px', fontSize:11, fontWeight:700,
            textTransform:'uppercase', letterSpacing:'.09em', marginBottom:18,
          }}>How It Works</span>
          <h2 style={{ fontSize:'clamp(1.75rem,3vw,2.5rem)', fontWeight:900, color:'#0F172A', letterSpacing:'-1px', marginBottom:16 }}>
            From Need to Verified Impact
          </h2>
          <p style={{ fontSize:16, color:'#64748B', lineHeight:1.75 }}>
            A transparent, fraud-resistant process ensures every naira creates real, traceable change.
          </p>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 }} className="steps-grid">
          {STEPS.map((s, i) => (
            <div key={i} style={{
              background:'#fff', border:'1px solid #E2E8F0',
              borderRadius:16, padding:28, position:'relative',
              overflow:'hidden', transition:'all 200ms ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = s.color;
              e.currentTarget.style.boxShadow   = `0 8px 28px ${s.color}18`;
              e.currentTarget.style.transform   = 'translateY(-3px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#E2E8F0';
              e.currentTarget.style.boxShadow   = 'none';
              e.currentTarget.style.transform   = 'translateY(0)';
            }}>
              <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:s.color, borderRadius:'16px 16px 0 0' }} />
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
                <span style={{
                  fontSize:11, fontWeight:800, color:s.color,
                  background:`${s.color}12`, border:`1.5px solid ${s.color}30`,
                  borderRadius:8, padding:'4px 10px',
                }}>{s.n}</span>
                <span style={{ fontSize:32 }}>{s.icon}</span>
              </div>
              <h3 style={{ fontSize:16, fontWeight:700, color:'#0F172A', marginBottom:10 }}>{s.title}</h3>
              <p style={{ fontSize:13, color:'#64748B', lineHeight:1.7 }}>{s.desc}</p>
            </div>
          ))}
        </div>

        <div style={{
          marginTop:40, display:'flex', alignItems:'center', gap:16,
          background:'#FFF4EE', border:'1px solid rgba(232,93,4,.15)',
          borderRadius:16, padding:'20px 28px', maxWidth:700, margin:'40px auto 0',
        }}>
          <span style={{ fontSize:28, flexShrink:0 }}>🔒</span>
          <p style={{ fontSize:14, color:'#64748B', lineHeight:1.65 }}>
            All payments processed via <strong style={{ color:'#E85D04' }}>Korapay</strong> with webhook
            verification and idempotency protection. No direct disbursement without controlled allocation.
          </p>
        </div>
      </div>
      <style>{`
        @media(max-width:960px){.steps-grid{grid-template-columns:repeat(2,1fr)!important}}
        @media(max-width:560px){.steps-grid{grid-template-columns:1fr!important}}
      `}</style>
    </section>
  );
}

/* ── Featured Cases ──────────────────────────────────────────────── */
function FeaturedCases() {
  const { data: cases = [], isLoading } = useQuery({
    queryKey: ['featured'],
    queryFn:  () => requestService.getFeatured(6),
    staleTime: 5 * 60000,
  });

  return (
    <section style={{ padding:'96px 0', background:'#fff' }}>
      <div style={{ maxWidth:1280, margin:'0 auto', padding:'0 24px' }}>
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:24, marginBottom:48, flexWrap:'wrap' }}>
          <div>
            <span style={{
              display:'inline-block', background:'#FFF4EE', color:'#E85D04',
              border:'1px solid rgba(232,93,4,.2)', borderRadius:999,
              padding:'6px 18px', fontSize:11, fontWeight:700,
              textTransform:'uppercase', letterSpacing:'.09em', marginBottom:16,
            }}>Active Cases</span>
            <h2 style={{ fontSize:'clamp(1.75rem,3vw,2.5rem)', fontWeight:900, color:'#0F172A', letterSpacing:'-1px', marginBottom:12 }}>
              Verified Cases Needing Your Support
            </h2>
            <p style={{ fontSize:15, color:'#64748B', maxWidth:480, lineHeight:1.7 }}>
              Every case has been manually verified by our team. Your donation goes directly to the cause.
            </p>
          </div>
          <Link to="/requests" style={{
            display:'inline-flex', alignItems:'center', gap:8,
            padding:'10px 20px', border:'1.5px solid #E85D04',
            color:'#E85D04', borderRadius:10, fontSize:13, fontWeight:700,
            flexShrink:0, transition:'all 150ms', whiteSpace:'nowrap',
            textDecoration:'none',
          }}
          onMouseEnter={e => { e.currentTarget.style.background='#E85D04'; e.currentTarget.style.color='#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#E85D04'; }}>
            See All Cases <MdArrowForward size={16} />
          </Link>
        </div>

        {isLoading ? (
          <CardSkeleton count={6} />
        ) : cases.length > 0 ? (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:24 }}>
            {cases.map(r => <RequestCard key={r._id} request={r} />)}
          </div>
        ) : (
          <div style={{ textAlign:'center', padding:'56px 24px', border:'2px dashed #E2E8F0', borderRadius:20, color:'#94A3B8' }}>
            <p style={{ fontSize:48, marginBottom:12 }}>🌍</p>
            <p style={{ fontWeight:600, fontSize:16, color:'#64748B' }}>
              Connecting to Impact Bridge server…
            </p>
            <p style={{ fontSize:14, color:'#94A3B8', marginTop:8 }}>
              Start your backend server and this section will populate with verified cases.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

/* ── Why Us ──────────────────────────────────────────────────────── */
const WHY = [
  { icon:<MdVerified size={26} />,             color:'#10B981', title:'100% Verified Cases',        desc:'Every request manually reviewed. No fake cases. No fraud. Only real needs reach donors.' },
  { icon:<MdSecurity size={26} />,             color:'#3B82F6', title:'Korapay Secured Payments',   desc:'Industry-leading security with webhook verification and idempotency protection.' },
  { icon:<MdAccountBalanceWallet size={26} />, color:'#8B5CF6', title:'Escrow Wallet System',       desc:'All funds held in controlled wallets. No direct disbursement without allocation approval.' },
  { icon:<MdBarChart size={26} />,             color:'#E85D04', title:'Real-Time Impact Tracking',  desc:'Before/after media, progress reports, and completion certificates for every funded case.' },
  { icon:<MdPeople size={26} />,               color:'#F59E0B', title:'NGO Execution Network',      desc:'Vetted NGO partners execute on the ground and submit verified field reports.' },
  { icon:<MdPublic size={26} />,               color:'#06B6D4', title:'National SDG Intelligence',  desc:'Government officials access real-time SDG data, heatmaps, and funding gap analytics.' },
];

function WhyUs() {
  return (
    <section style={{ padding:'96px 0', background:'#F8FAFC' }}>
      <div style={{ maxWidth:1280, margin:'0 auto', padding:'0 24px' }}>
        <div style={{ textAlign:'center', maxWidth:640, margin:'0 auto 60px' }}>
          <span style={{
            display:'inline-block', background:'#FFF4EE', color:'#E85D04',
            border:'1px solid rgba(232,93,4,.2)', borderRadius:999,
            padding:'6px 18px', fontSize:11, fontWeight:700,
            textTransform:'uppercase', letterSpacing:'.09em', marginBottom:18,
          }}>Why Impact Bridge</span>
          <h2 style={{ fontSize:'clamp(1.75rem,3vw,2.5rem)', fontWeight:900, color:'#0F172A', letterSpacing:'-1px', marginBottom:16 }}>
            Built Different. For Nigeria.
          </h2>
          <p style={{ fontSize:16, color:'#64748B', lineHeight:1.75 }}>
            Not another donation app. A fully transparent, fraud-resistant, execution-enabled national social impact infrastructure.
          </p>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 }} className="why-grid">
          {WHY.map((w, i) => (
            <div key={i} style={{
              background:'#fff', border:'1px solid #E2E8F0',
              borderRadius:16, padding:28, transition:'all 200ms ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = w.color;
              e.currentTarget.style.boxShadow   = `0 8px 28px ${w.color}18`;
              e.currentTarget.style.transform   = 'translateY(-3px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#E2E8F0';
              e.currentTarget.style.boxShadow   = 'none';
              e.currentTarget.style.transform   = 'translateY(0)';
            }}>
              <div style={{
                width:54, height:54, borderRadius:14,
                background:`${w.color}12`, color:w.color,
                display:'flex', alignItems:'center', justifyContent:'center',
                marginBottom:20, border:`1.5px solid ${w.color}25`,
              }}>
                {w.icon}
              </div>
              <h3 style={{ fontSize:16, fontWeight:700, color:'#0F172A', marginBottom:10 }}>{w.title}</h3>
              <p style={{ fontSize:13, color:'#64748B', lineHeight:1.7 }}>{w.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media(max-width:960px){.why-grid{grid-template-columns:repeat(2,1fr)!important}}
        @media(max-width:560px){.why-grid{grid-template-columns:1fr!important}}
      `}</style>
    </section>
  );
}

/* ── SDG Section ─────────────────────────────────────────────────── */
function SDGSection() {
  const { data: sdgs = [] } = useQuery({
    queryKey: ['sdg-all'],
    queryFn:  sdgService.getAll,
    staleTime: 10 * 60000,
  });

  const list = sdgs.length > 0
    ? sdgs
    : Object.entries(SDG).map(([n, d]) => ({ number:+n, ...d }));

  return (
    <section style={{ padding:'96px 0', background:'#0F172A' }}>
      <div style={{ maxWidth:1280, margin:'0 auto', padding:'0 24px' }}>
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:24, marginBottom:48, flexWrap:'wrap' }}>
          <div>
            <span style={{
              display:'inline-block', background:'rgba(255,255,255,.07)',
              color:'rgba(255,255,255,.7)', border:'1px solid rgba(255,255,255,.1)',
              borderRadius:999, padding:'6px 18px', fontSize:11, fontWeight:700,
              textTransform:'uppercase', letterSpacing:'.09em', marginBottom:18,
            }}>UN SDGs</span>
            <h2 style={{ fontSize:'clamp(1.75rem,3vw,2.5rem)', fontWeight:900, color:'#fff', letterSpacing:'-1px', marginBottom:12 }}>
              Aligned with All 17 Global Goals
            </h2>
            <p style={{ fontSize:15, color:'rgba(255,255,255,.5)', maxWidth:480, lineHeight:1.7 }}>
              Every case and project is tagged to a specific SDG — enabling targeted funding and national progress tracking.
            </p>
          </div>
          <Link to="/sdg" style={{
            display:'inline-flex', alignItems:'center', gap:8,
            padding:'10px 20px', border:'1.5px solid #E85D04',
            color:'#E85D04', borderRadius:10, fontSize:13, fontWeight:700,
            flexShrink:0, transition:'all 150ms', whiteSpace:'nowrap',
            textDecoration:'none',
          }}
          onMouseEnter={e => { e.currentTarget.style.background='#E85D04'; e.currentTarget.style.color='#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#E85D04'; }}>
            Explore All SDGs <MdArrowForward size={16} />
          </Link>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(128px,1fr))', gap:10 }}>
          {list.map(s => {
            const num   = s.number;
            const color = s.color || SDG[num]?.color || '#E85D04';
            const icon  = s.icon  || SDG[num]?.icon  || '🌍';
            const title = s.title || SDG[num]?.title  || `SDG ${num}`;
            return (
              <Link key={num || s._id} to={`/sdg/${num}`} style={{
                display:'flex', flexDirection:'column', alignItems:'center',
                padding:'18px 10px', textAlign:'center',
                background:'rgba(255,255,255,.04)',
                border:'1px solid rgba(255,255,255,.07)',
                borderRadius:14, gap:8, transition:'all 200ms ease',
                textDecoration:'none',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background   = `${color}18`;
                e.currentTarget.style.borderColor  = `${color}45`;
                e.currentTarget.style.transform    = 'translateY(-4px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background   = 'rgba(255,255,255,.04)';
                e.currentTarget.style.borderColor  = 'rgba(255,255,255,.07)';
                e.currentTarget.style.transform    = 'translateY(0)';
              }}>
                <span style={{
                  fontSize:9, fontWeight:800, color,
                  background:`${color}22`, border:`1px solid ${color}35`,
                  borderRadius:5, padding:'2px 7px',
                }}>SDG {num}</span>
                <span style={{ fontSize:28 }}>{icon}</span>
                <span style={{ fontSize:11, color:'rgba(255,255,255,.55)', fontWeight:600, lineHeight:1.3 }}>
                  {title}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── CTA ─────────────────────────────────────────────────────────── */
function CTA() {
  const { isAuth } = useAuth();
  return (
    <section style={{
      padding:'96px 0',
      background:'linear-gradient(135deg,#E85D04 0%,#C24E03 100%)',
      position:'relative', overflow:'hidden',
    }}>
      <div style={{ position:'absolute', width:600, height:600, borderRadius:'50%', background:'rgba(255,255,255,.04)', top:-200, right:-150, pointerEvents:'none' }} />
      <div style={{ position:'absolute', width:400, height:400, borderRadius:'50%', background:'rgba(255,255,255,.03)', bottom:-120, left:-80, pointerEvents:'none' }} />

      <div style={{ maxWidth:680, margin:'0 auto', padding:'0 24px', position:'relative', zIndex:1, textAlign:'center' }}>
        <div style={{ fontSize:60, marginBottom:24, lineHeight:1 }}>🌍</div>
        <h2 style={{ fontSize:'clamp(2rem,4vw,3rem)', fontWeight:900, color:'#fff', letterSpacing:'-1.5px', lineHeight:1.08, marginBottom:20 }}>
          Ready to Create Real Impact in Nigeria?
        </h2>
        <p style={{ fontSize:17, color:'rgba(255,255,255,.82)', lineHeight:1.75, marginBottom:40, maxWidth:520, margin:'0 auto 40px' }}>
          Whether you want to donate, submit a need, partner as an NGO, or access national SDG data — Impact Bridge is your platform.
        </p>

        <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap', marginBottom:36 }}>
          {isAuth ? (
            <Link to="/requests" style={{
              padding:'13px 32px', background:'#fff', color:'#E85D04',
              borderRadius:12, fontWeight:700, fontSize:15,
              transition:'all 200ms', textDecoration:'none',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 8px 24px rgba(0,0,0,.2)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}>
              Browse Verified Cases
            </Link>
          ) : (
            <>
              <Link to="/register" style={{
                padding:'13px 32px', background:'#fff', color:'#E85D04',
                borderRadius:12, fontWeight:700, fontSize:15,
                transition:'all 200ms', textDecoration:'none',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 8px 24px rgba(0,0,0,.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}>
                Create Free Account
              </Link>
              <Link to="/requests" style={{
                padding:'13px 32px', background:'rgba(255,255,255,.12)',
                color:'#fff', border:'1.5px solid rgba(255,255,255,.3)',
                borderRadius:12, fontWeight:700, fontSize:15,
                transition:'all 200ms', textDecoration:'none',
              }}
              onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,.2)'; e.currentTarget.style.transform='translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,.12)'; e.currentTarget.style.transform='translateY(0)'; }}>
                Browse Cases First
              </Link>
            </>
          )}
        </div>

        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, flexWrap:'wrap' }}>
          <span style={{ fontSize:13, color:'rgba(255,255,255,.5)' }}>Join as:</span>
          {['Donor','NGO Partner','Corporate','Government','Individual'].map(r => (
            <Link key={r} to="/register" style={{
              padding:'5px 14px', background:'rgba(255,255,255,.1)',
              color:'rgba(255,255,255,.85)', border:'1px solid rgba(255,255,255,.18)',
              borderRadius:999, fontSize:12, fontWeight:600,
              transition:'all 150ms', textDecoration:'none',
            }}
            onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,.2)'}
            onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,.1)'}>
              {r}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Page ────────────────────────────────────────────────────────── */
export default function Home() {
  return (
    <>
      <Helmet>
        <title>Impact Bridge — National Social Impact Operating System</title>
        <meta name="description" content="Connecting verified needs to transparent funding. Every naira traceable. Every impact proven." />
      </Helmet>
      <Hero />
      <HowItWorks />
      <FeaturedCases />
      <WhyUs />
      <SDGSection />
      <CTA />
    </>
  );
}