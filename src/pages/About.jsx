import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const TEAM = [
  { 
    name: 'Chukwuemeka Obi', 
    role: 'CEO & Co-Founder', 
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop', // Replace with real URL
    bio: 'Former fintech lead with a passion for social transparency.'
  },
  { 
    name: 'Fatima Al-Hassan', 
    role: 'CTO & Co-Founder', 
    img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop', // Replace with real URL
    bio: 'Systems architect focused on secure, traceable fund routing.'
  },
  { 
    name: 'Adaeze Nwosu', 
    role: 'Head of Verification', 
    img: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=400&fit=crop', // Replace with real URL
    bio: 'Expert in field logistics and grassroots impact auditing.'
  },
  { 
    name: 'Bello Garba', 
    role: 'Head of NGO Relations',
    img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop', // Replace with real URL
    bio: '15+ years experience working with international development partners.'
  },
];

export default function About() {
  return (
    <div className="about-page">
      <Helmet><title>Our Story — Impact Bridge</title></Helmet>

      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <div className="hero-content">
            <span className="badge">Our Journey</span>
            <h1>Turning Generosity <br/>into <span className="text-brand">Traceable Impact</span></h1>
            <p>
              In 2023, we sat in a room in Lagos asking one question: <em>"Why is it so hard to help people when so many want to give?"</em> Impact Bridge was the answer.
            </p>
          </div>
        </div>
      </section>

      {/* Story & Visual Section */}
      <section className="story-section">
        <div className="container">
          <div className="story-grid">
            <div className="story-text">
              <h2 className="section-title">The Problem We're Solving</h2>
              <p>
                Nigeria is a land of incredible communal spirit. But for too long, that spirit has been dampened by a <strong>lack of trust</strong>. Donors aren't sure where their money goes, and verified needs often get buried under noise.
              </p>
              <div className="story-highlight">
                <p>"We didn't just build a website; we built a trust protocol for the Nigerian social sector."</p>
                <cite>— Chukwuemeka Obi, CEO</cite>
              </div>
              <p>
                Our "Story" began by mapping out every point of failure in the traditional giving chain. We fixed them with manual verification, real-time updates, and an infrastructure that treats every ₦1,000 like a billion-dollar investment.
              </p>
            </div>
            <div className="story-image-wrapper">
              <img 
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80" 
                alt="Impact Bridge team in the field" 
                className="main-story-img"
              />
              <div className="floating-stat">
                <h3>36 States</h3>
                <p>Fully Covered</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Meet the Visionaries</h2>
            <p>A diverse team of Nigerians building for a more equitable future.</p>
          </div>
          
          <div className="team-grid">
            {TEAM.map(m => (
              <div key={m.name} className="team-card">
                <div className="team-img-container">
                  <img src={m.img} alt={m.name} className="team-img" />
                </div>
                <div className="team-info">
                  <h3>{m.name}</h3>
                  <p className="team-role">{m.role}</p>
                  <p className="team-bio">{m.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <div className="container">
          <h2>Ready to be part of the story?</h2>
          <div className="cta-buttons">
            <Link to="/register" className="btn btn-white">Join as a Partner</Link>
            <Link to="/contact" className="btn btn-outline">Ask a Question</Link>
          </div>
        </div>
      </section>

      <style>{`
        .about-page { --brand: #E85D04; --brand-dark: #D05404; --gray-900: #0F172A; }
        
        .container { width: 90%; max-width: 1200px; margin: 0 auto; }
        
        /* Hero */
        .about-hero { 
          background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%);
          padding: 100px 0;
          text-align: center;
          color: white;
        }
        .hero-content h1 { font-size: clamp(2.2rem, 5vw, 3.5rem); line-height: 1.1; margin-bottom: 24px; }
        .text-brand { color: var(--brand); }
        .hero-content p { font-size: 1.2rem; color: rgba(255,255,255,0.7); max-width: 700px; margin: 0 auto; }
        
        .badge { 
          background: rgba(232,93,4,0.2); border: 1px solid var(--brand);
          color: #ff9d5c; padding: 6px 16px; border-radius: 99px;
          text-transform: uppercase; font-size: 12px; font-weight: 700; margin-bottom: 20px; display: inline-block;
        }

        /* Story Section */
        .story-section { padding: 100px 0; background: white; }
        .story-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; alignItems: center; }
        .section-title { font-size: 2rem; font-weight: 800; color: var(--gray-900); margin-bottom: 20px; }
        .story-text p { font-size: 16px; line-height: 1.8; color: #64748b; margin-bottom: 15px; }
        .story-highlight { 
          border-left: 4px solid var(--brand); padding: 20px; 
          background: #fff7ed; margin: 30px 0; border-radius: 0 12px 12px 0;
        }
        .story-highlight p { font-style: italic; color: var(--gray-900); font-weight: 600; margin-bottom: 5px; }
        .story-image-wrapper { position: relative; }
        .main-story-img { width: 100%; border-radius: 24px; box-shadow: 20px 20px 60px rgba(0,0,0,0.1); }
        .floating-stat { 
          position: absolute; bottom: -20px; left: -20px; 
          background: var(--brand); color: white; padding: 24px; 
          border-radius: 16px; box-shadow: 0 10px 30px rgba(232,93,4,0.3);
        }

        /* Team Section */
        .team-section { padding: 100px 0; background: #f8fafc; }
        .section-header { text-align: center; margin-bottom: 60px; }
        .team-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); 
          gap: 30px; 
        }
        .team-card { 
          background: white; border-radius: 20px; overflow: hidden;
          transition: transform 0.3s ease; border: 1px solid #e2e8f0;
        }
        .team-card:hover { transform: translateY(-10px); }
        .team-img-container { height: 300px; overflow: hidden; }
        .team-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
        .team-card:hover .team-img { transform: scale(1.05); }
        .team-info { padding: 24px; }
        .team-info h3 { margin-bottom: 5px; color: var(--gray-900); }
        .team-role { color: var(--brand); font-weight: 700; font-size: 14px; margin-bottom: 12px; }
        .team-bio { font-size: 14px; color: #64748b; line-height: 1.5; }

        /* CTA */
        .about-cta { background: var(--brand); padding: 80px 0; color: white; text-align: center; }
        .cta-buttons { display: flex; gap: 20px; justify-content: center; margin-top: 40px; }
        .btn { padding: 14px 32px; border-radius: 12px; font-weight: 700; text-decoration: none; transition: 0.3s; }
        .btn-white { background: white; color: var(--brand); }
        .btn-outline { border: 2px solid rgba(255,255,255,0.4); color: white; }
        .btn:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }

        @media (max-width: 900px) {
          .story-grid { grid-template-columns: 1fr; }
          .story-image-wrapper { order: -1; margin-bottom: 40px; }
          .cta-buttons { flex-direction: column; align-items: center; }
        }
      `}</style>
    </div>
  );
}


// import React from 'react';
// import { Helmet } from 'react-helmet-async';
// import { Link } from 'react-router-dom';

// const TEAM = [
//   { name:'Chukwuemeka Obi',   role:'CEO & Co-Founder',    emoji:'👨🏿‍💼' },
//   { name:'Fatima Al-Hassan',  role:'CTO & Co-Founder',    emoji:'👩🏾‍💻' },
//   { name:'Adaeze Nwosu',      role:'Head of Verification', emoji:'👩🏾‍🔬' },
//   { name:'Bello Garba',       role:'Head of NGO Relations',emoji:'👨🏿‍🤝‍👨🏿' },
// ];

// export default function About() {
//   return (
//     <>
//       <Helmet><title>About Us — Impact Bridge</title></Helmet>

//       {/* Hero */}
//       <div style={{ background:'linear-gradient(135deg,var(--gray-900) 0%,#1E3A5F 100%)', padding:'80px 0 72px', textAlign:'center' }}>
//         <div className="container" style={{ maxWidth:720 }}>
//           <span style={{ display:'inline-block', background:'rgba(232,93,4,.18)', color:'var(--brand-light)', border:'1px solid rgba(232,93,4,.25)', borderRadius:999, padding:'5px 16px', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'.09em', marginBottom:20 }}>
//             Our Story
//           </span>
//           <h1 style={{ fontSize:'clamp(2rem,4vw,3rem)', fontWeight:900, color:'#fff', letterSpacing:'-1.5px', lineHeight:1.08, marginBottom:20 }}>
//             Built to Fix What's Broken
//           </h1>
//           <p style={{ fontSize:17, color:'rgba(255,255,255,.6)', lineHeight:1.75 }}>
//             Nigeria has millions in unmet social needs and billions in untapped generosity. We built Impact Bridge to connect them — transparently, verifiably, and accountably.
//           </p>
//         </div>
//       </div>

//       {/* Mission */}
//       <div style={{ padding:'96px 0', background:'#fff' }}>
//         <div className="container">
//           <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:80, alignItems:'center' }} className="about-grid">
//             <div>
//               <span style={{ display:'inline-block', background:'var(--brand-50)', color:'var(--brand)', border:'1px solid var(--brand-100)', borderRadius:999, padding:'5px 14px', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'.09em', marginBottom:20 }}>Our Mission</span>
//               <h2 style={{ fontSize:'clamp(1.5rem,2.5vw,2rem)', fontWeight:900, color:'var(--gray-900)', letterSpacing:'-.5px', marginBottom:16, lineHeight:1.2 }}>
//                 Every naira of social impact should be traceable.
//               </h2>
//               <p style={{ fontSize:15, color:'var(--gray-500)', lineHeight:1.8, marginBottom:20 }}>
//                 We believe that the gap between those who want to give and those who need help is a trust problem, not a generosity problem. Impact Bridge solves this by making every step transparent — from submission to verification to execution to completion.
//               </p>
//               <p style={{ fontSize:15, color:'var(--gray-500)', lineHeight:1.8 }}>
//                 Our platform creates a national social impact infrastructure aligned with all 17 UN Sustainable Development Goals, giving donors, NGOs, government, and beneficiaries a shared, accountable space to create real change.
//               </p>
//             </div>
//             <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
//               {[
//                 { icon:'🌍', t:'National reach', d:'Active in all 36 states and FCT Abuja' },
//                 { icon:'✅', t:'Zero tolerance for fraud', d:'Every case manually verified before going live' },
//                 { icon:'💰', t:'100% transparent', d:'Every naira tracked from donation to impact' },
//                 { icon:'🤝', t:'SDG-aligned', d:'All 17 UN Sustainable Development Goals covered' },
//               ].map(c => (
//                 <div key={c.t} style={{ background:'var(--gray-50)', borderRadius:14, padding:20, border:'1px solid var(--gray-200)' }}>
//                   <div style={{ fontSize:28, marginBottom:10 }}>{c.icon}</div>
//                   <p style={{ fontWeight:700, fontSize:14, color:'var(--gray-900)', marginBottom:6 }}>{c.t}</p>
//                   <p style={{ fontSize:13, color:'var(--gray-400)', lineHeight:1.6 }}>{c.d}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//         <style>{`@media(max-width:900px){.about-grid{grid-template-columns:1fr!important}}`}</style>
//       </div>

//       {/* Team */}
//       <div style={{ padding:'80px 0', background:'var(--gray-50)' }}>
//         <div className="container">
//           <div style={{ textAlign:'center', marginBottom:52 }}>
//             <h2 style={{ fontSize:'clamp(1.5rem,2.5vw,2rem)', fontWeight:900, color:'var(--gray-900)', letterSpacing:'-.5px', marginBottom:12 }}>The Team Behind Impact Bridge</h2>
//             <p style={{ fontSize:15, color:'var(--gray-400)' }}>Nigerians building for Nigeria.</p>
//           </div>
//           <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:24 }} className="team-grid">
//             {TEAM.map(m => (
//               <div key={m.name} style={{ background:'#fff', border:'1px solid var(--gray-200)', borderRadius:16, padding:28, textAlign:'center', transition:'all 150ms' }}
//                 onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='var(--shadow-lg)'; }}
//                 onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}>
//                 <div style={{ width:72, height:72, borderRadius:'50%', background:'var(--brand-50)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:36, margin:'0 auto 16px', border:'3px solid var(--brand-100)' }}>{m.emoji}</div>
//                 <p style={{ fontWeight:700, fontSize:15, color:'var(--gray-900)', marginBottom:4 }}>{m.name}</p>
//                 <p style={{ fontSize:13, color:'var(--gray-400)' }}>{m.role}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//         <style>{`@media(max-width:900px){.team-grid{grid-template-columns:repeat(2,1fr)!important}}@media(max-width:560px){.team-grid{grid-template-columns:1fr!important}}`}</style>
//       </div>

//       {/* CTA */}
//       <div style={{ padding:'80px 0', background:'var(--brand)', textAlign:'center' }}>
//         <div className="container" style={{ maxWidth:600 }}>
//           <h2 style={{ fontSize:'clamp(1.5rem,2.5vw,2.2rem)', fontWeight:900, color:'#fff', letterSpacing:'-.5px', marginBottom:16 }}>
//             Join the Impact Bridge Movement
//           </h2>
//           <p style={{ fontSize:15, color:'rgba(255,255,255,.8)', marginBottom:32, lineHeight:1.7 }}>
//             Whether you're a donor, NGO, corporate, or government — there's a role for you on Impact Bridge.
//           </p>
//           <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
//             <Link to="/register" style={{ padding:'12px 28px', background:'#fff', color:'var(--brand)', borderRadius:12, fontWeight:700, fontSize:15, transition:'all 150ms' }}
//               onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 8px 24px rgba(0,0,0,.2)'; }}
//               onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}>
//               Create Free Account
//             </Link>
//             <Link to="/contact" style={{ padding:'12px 28px', background:'rgba(255,255,255,.12)', color:'#fff', border:'1.5px solid rgba(255,255,255,.3)', borderRadius:12, fontWeight:700, fontSize:15, transition:'all 150ms' }}
//               onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,.2)'}
//               onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,.12)'}>
//               Contact Us
//             </Link>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
