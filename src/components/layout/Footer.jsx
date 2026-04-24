import React from 'react';
import { Link } from 'react-router-dom';
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';
import { FaTwitter, FaInstagram, FaLinkedin, FaWhatsapp } from 'react-icons/fa';
import { SDG, WA_PHONE } from '../../utils/constants';

const Col = ({ title, links }) => (
  <div className="footer-col">
    <h4 className="footer-title">{title}</h4>
    <div className="footer-links">
      {links.map(({ to, label }) => (
        <Link key={to} to={to} className="footer-link">
          {label}
        </Link>
      ))}
    </div>
  </div>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-root">
      <div className="container">
        {/* Top Section: Main Navigation */}
        <div className="footer-main-grid">
          
          {/* Brand & Socials */}
          <div className="footer-brand-section">
            <Link to="/" className="footer-logo">
              <span className="logo-emoji">🌍</span>
              <span className="logo-text">
                Impact<span className="brand-accent">Bridge</span>
              </span>
            </Link>
            <p className="brand-desc">
              Connecting verified needs to transparent funding. Every naira traceable. Every impact proven.
            </p>
            <div className="social-row">
              {[
                { href: `https://wa.me/${WA_PHONE}`, icon: <FaWhatsapp />, label: 'WhatsApp' },
                { href: 'https://twitter.com', icon: <FaTwitter />, label: 'Twitter' },
                { href: 'https://instagram.com', icon: <FaInstagram />, label: 'Instagram' },
                { href: 'https://linkedin.com', icon: <FaLinkedin />, label: 'LinkedIn' },
              ].map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="social-btn">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Columns */}
          <Col title="Platform" links={[
            { to: '/requests', label: 'Browse Cases' },
            { to: '/projects', label: 'Projects' },
            { to: '/sdg', label: 'SDG Goals' },
            { to: '/about', label: 'About Us' },
          ]} />

          <Col title="Join As" links={[
            { to: '/register?role=donor', label: 'Donor' },
            { to: '/register?role=ngo_partner', label: 'NGO Partner' },
            { to: '/register?role=corporate', label: 'Corporate CSR' },
            { to: '/register?role=government_official', label: 'Government' },
          ]} />

          <Col title="Legal" links={[
            { to: '/privacy', label: 'Privacy Policy' },
            { to: '/terms', label: 'Terms of Service' },
            { to: '/contact', label: 'Contact Us' },
          ]} />

          {/* Contact Column */}
          <div className="footer-col">
            <h4 className="footer-title">Contact</h4>
            <div className="contact-list">
              {[
                { icon: <MdEmail />, text: 'support@impactbridge.ng' },
                { icon: <MdPhone />, text: '+234 801 234 5678' },
                { icon: <MdLocationOn />, text: 'Lagos, Nigeria 🇳🇬' },
              ].map((c, i) => (
                <div key={i} className="contact-item">
                  <span className="contact-icon">{c.icon}</span>
                  <span className="contact-text">{c.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SDG Middle Strip */}
        <div className="sdg-strip">
          <span className="sdg-label">Aligned with UN SDGs:</span>
          <div className="sdg-grid">
            {Object.entries(SDG).map(([n, d]) => (
              <Link key={n} to={`/sdg/${n}`} title={d.title}
                className="sdg-box"
                style={{ 
                  '--sdg-color': d.color,
                  '--sdg-bg': `${d.color}18`,
                  '--sdg-border': `${d.color}30` 
                }}>
                {n}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p>© {currentYear} Impact Bridge · National Social Impact Operating System</p>
          <p className="bottom-credit">Built with 💙 for Nigeria 🇳🇬</p>
        </div>
      </div>

      <style>{`
        .footer-root {
          background: var(--gray-900);
          color: rgba(255,255,255,.7);
          border-top: 1px solid rgba(255,255,255,.05);
        }

        /* Responsive Grid Logic */
        .footer-main-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 40px;
          padding: 72px 0 56px;
        }

        /* Brand section takes more space on desktop */
        @media (min-width: 1024px) {
          .footer-main-grid {
            grid-template-columns: 2fr 1fr 1fr 1fr 1.5fr;
          }
        }

        .footer-logo {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
          text-decoration: none;
        }

        .logo-emoji { fontSize: 28px; }
        .logo-text { font-weight: 800; fontSize: 22px; color: #fff; letter-spacing: -0.5px; }
        .brand-accent { color: var(--brand); }

        .brand-desc {
          font-size: 14px;
          line-height: 1.7;
          color: rgba(255,255,255,.45);
          max-width: 300px;
          margin-bottom: 24px;
        }

        .social-row { display: flex; gap: 12px; }
        .social-btn {
          width: 38px; height: 38px; border-radius: 10px;
          background: rgba(255,255,255,.05);
          display: flex; align-items: center; justify-content: center;
          color: rgba(255,255,255,.5); font-size: 16px;
          transition: all 0.2s ease;
        }
        .social-btn:hover {
          background: var(--brand);
          color: #fff;
          transform: translateY(-3px);
        }

        .footer-title {
          font-size: 11px; font-weight: 700;
          color: rgba(255,255,255,.3);
          text-transform: uppercase; letter-spacing: .12em;
          margin-bottom: 20px;
        }

        .footer-links { display: flex; flexDirection: column; gap: 12px; }
        .footer-link {
          font-size: 14px; color: rgba(255,255,255,.5);
          text-decoration: none; transition: color 0.2s;
        }
        .footer-link:hover { color: var(--brand); }

        .contact-list { display: flex; flex-direction: column; gap: 14px; }
        .contact-item { display: flex; align-items: flex-start; gap: 12px; font-size: 14px; color: rgba(255,255,255,.45); }
        .contact-icon { color: var(--brand); font-size: 18px; }

        /* SDG Strip Styling */
        .sdg-strip {
          border-top: 1px solid rgba(255,255,255,.06);
          border-bottom: 1px solid rgba(255,255,255,.06);
          padding: 20px 0;
          display: flex; align-items: center; gap: 16px; flex-wrap: wrap;
        }
        .sdg-label { font-size: 12px; color: rgba(255,255,255,.3); }
        .sdg-grid { display: flex; flex-wrap: wrap; gap: 6px; }
        .sdg-box {
          width: 28px; height: 28px; border-radius: 6px;
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 800; text-decoration: none;
          color: var(--sdg-color); background: var(--sdg-bg);
          border: 1px solid var(--sdg-border); transition: all 0.2s;
        }
        .sdg-box:hover {
          background: var(--sdg-color);
          color: #fff;
          transform: scale(1.1);
        }

        .footer-bottom {
          padding: 24px 0;
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 16px;
          font-size: 13px; color: rgba(255,255,255,.25);
        }

        @media (max-width: 768px) {
          .footer-main-grid { gap: 32px; padding: 48px 0; }
          .footer-bottom { justify-content: center; text-align: center; }
          .sdg-strip { justify-content: center; }
        }
      `}</style>
    </footer>
  );
}


// import React from 'react';
// import { Link } from 'react-router-dom';
// import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';
// import { FaTwitter, FaInstagram, FaLinkedin, FaWhatsapp } from 'react-icons/fa';
// import { SDG, WA_PHONE } from '../../utils/constants';

// const Col = ({ title, links }) => (
//   <div>
//     <p style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,.35)', textTransform:'uppercase', letterSpacing:'.1em', marginBottom:20 }}>{title}</p>
//     <div style={{ display:'flex', flexDirection:'column', gap:13 }}>
//       {links.map(({ to, label }) => (
//         <Link key={to} to={to} style={{ fontSize:14, color:'rgba(255,255,255,.5)', transition:'color 150ms' }}
//           onMouseEnter={e => e.currentTarget.style.color='var(--brand)'}
//           onMouseLeave={e => e.currentTarget.style.color='rgba(255,255,255,.5)'}>
//           {label}
//         </Link>
//       ))}
//     </div>
//   </div>
// );

// export default function Footer() {
//   return (
//     <footer style={{ background:'var(--gray-900)', color:'rgba(255,255,255,.7)' }}>

//       {/* Main */}
//       <div className="container" style={{ padding:'72px 24px 56px' }}>
//         <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr 1.6fr', gap:48 }} className="footer-grid">

//           {/* Brand */}
//           <div>
//             <Link to="/" style={{ display:'inline-flex', alignItems:'center', gap:10, marginBottom:18 }}>
//               <span style={{ fontSize:30 }}>🌍</span>
//               <span style={{ fontWeight:800, fontSize:22, color:'#fff', letterSpacing:'-.4px' }}>
//                 Impact<span style={{ color:'var(--brand)' }}>Bridge</span>
//               </span>
//             </Link>
//             <p style={{ fontSize:14, lineHeight:1.8, color:'rgba(255,255,255,.45)', maxWidth:280, marginBottom:24 }}>
//               Connecting verified needs to transparent funding. Every naira traceable. Every impact proven.
//             </p>
//             <div style={{ display:'flex', gap:10 }}>
//               {[
//                 { href:`https://wa.me/${WA_PHONE}`, icon:<FaWhatsapp />,  label:'WhatsApp' },
//                 { href:'https://twitter.com',        icon:<FaTwitter />,   label:'Twitter'  },
//                 { href:'https://instagram.com',       icon:<FaInstagram />, label:'Instagram'},
//                 { href:'https://linkedin.com',        icon:<FaLinkedin />,  label:'LinkedIn' },
//               ].map(s => (
//                 <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
//                   style={{ width:36, height:36, borderRadius:10, background:'rgba(255,255,255,.06)', display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,.5)', fontSize:15, transition:'all 150ms' }}
//                   onMouseEnter={e => { e.currentTarget.style.background='var(--brand)'; e.currentTarget.style.color='#fff'; e.currentTarget.style.transform='translateY(-2px)'; }}
//                   onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,.06)'; e.currentTarget.style.color='rgba(255,255,255,.5)'; e.currentTarget.style.transform='translateY(0)'; }}>
//                   {s.icon}
//                 </a>
//               ))}
//             </div>
//           </div>

//           <Col title="Platform" links={[
//             { to:'/requests', label:'Browse Cases' },
//             { to:'/projects', label:'Projects'     },
//             { to:'/sdg',      label:'SDG Goals'    },
//             { to:'/about',    label:'About Us'     },
//           ]} />

//           <Col title="Join As" links={[
//             { to:'/register?role=donor',               label:'Donor'           },
//             { to:'/register?role=ngo_partner',         label:'NGO Partner'     },
//             { to:'/register?role=corporate',           label:'Corporate CSR'   },
//             { to:'/register?role=government_official', label:'Government'      },
//           ]} />

//           <Col title="Legal" links={[
//             { to:'/privacy',  label:'Privacy Policy' },
//             { to:'/terms',    label:'Terms of Service'},
//             { to:'/contact',  label:'Contact Us'     },
//           ]} />

//           {/* Contact */}
//           <div>
//             <p style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,.35)', textTransform:'uppercase', letterSpacing:'.1em', marginBottom:20 }}>Contact</p>
//             <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
//               {[
//                 { icon:<MdEmail />,       text:'support@impactbridge.ng' },
//                 { icon:<MdPhone />,       text:'+234 801 234 5678'       },
//                 { icon:<MdLocationOn />,  text:'Lagos, Nigeria 🇳🇬'     },
//               ].map((c, i) => (
//                 <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:10, fontSize:14, color:'rgba(255,255,255,.45)' }}>
//                   <span style={{ color:'var(--brand)', flexShrink:0, fontSize:17, marginTop:1 }}>{c.icon}</span>
//                   {c.text}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* SDG strip */}
//       <div style={{ borderTop:'1px solid rgba(255,255,255,.06)', borderBottom:'1px solid rgba(255,255,255,.06)', padding:'14px 0' }}>
//         <div className="container" style={{ display:'flex', alignItems:'center', gap:16, flexWrap:'wrap' }}>
//           <span style={{ fontSize:12, color:'rgba(255,255,255,.3)', flexShrink:0 }}>Aligned with UN SDGs:</span>
//           <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
//             {Object.entries(SDG).map(([n, d]) => (
//               <Link key={n} to={`/sdg/${n}`} title={d.title}
//                 style={{ width:26, height:26, borderRadius:5, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:800, color:d.color, background:`${d.color}18`, border:`1px solid ${d.color}30`, transition:'all 150ms' }}
//                 onMouseEnter={e => { e.currentTarget.style.background=d.color; e.currentTarget.style.color='#fff'; }}
//                 onMouseLeave={e => { e.currentTarget.style.background=`${d.color}18`; e.currentTarget.style.color=d.color; }}>
//                 {n}
//               </Link>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Bottom */}
//       <div style={{ padding:'20px 0' }}>
//         <div className="container" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12, fontSize:13, color:'rgba(255,255,255,.25)' }}>
//           <p>© {new Date().getFullYear()} Impact Bridge · National Social Impact Operating System</p>
//           <p>Built with 💙 for Nigeria 🇳🇬</p>
//         </div>
//       </div>

//       <style>{`
//         @media(max-width:1024px) { .footer-grid { grid-template-columns:1fr 1fr 1fr !important; } .footer-grid>div:first-child { grid-column:1/-1; } }
//         @media(max-width:640px)  { .footer-grid { grid-template-columns:1fr 1fr !important; } }
//       `}</style>
//     </footer>
//   );
// }