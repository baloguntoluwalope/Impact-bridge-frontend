import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';
import { FaWhatsapp } from 'react-icons/fa';

/* ── Config ─────────────────────────────────────────────────────── */
// Fixed: Using Vite's environment variable syntax
const WA_NUMBER = import.meta.env.VITE_WHATSAPP || '2348012345678';
const GMAIL     = 'support@impactbridge.ng'; 
const PHONE     = '+234 801 234 5678';

const TOPICS = [
  'General Inquiry',
  'Partnership Opportunity',
  'Technical Support',
  'NGO Onboarding',
  'Government Collaboration',
  'Report a Problem',
  'Other',
];

/* ── Helpers ─────────────────────────────────────────────────────── */
function buildWhatsAppURL(name, topic, message) {
  const text = [
    `*ImpactBridge Contact Form*`,
    ``,
    `*Name:* ${name}`,
    `*Topic:* ${topic}`,
    ``,
    `*Message:*`,
    message,
  ].join('\n');
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
}

function buildGmailURL(name, topic, message) {
  const subject = encodeURIComponent(`[ImpactBridge] ${topic} — from ${name}`);
  const body    = encodeURIComponent(
    `Name: ${name}\nTopic: ${topic}\n\n${message}\n\n---\nSent via ImpactBridge contact form`
  );
  return `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(GMAIL)}&su=${subject}&body=${body}`;
}

/* ── Contact info cards ─────────────────────────────────────────── */
const CONTACTS = [
  {
    icon:  <FaWhatsapp size={22} />,
    label: 'WhatsApp',
    value: PHONE,
    sub:   'Fastest response — usually within 1 hour',
    href:  `https://wa.me/${WA_NUMBER}?text=Hello%20ImpactBridge!`,
    color: '#25d366',
    bg:    '#f0fdf4',
    border:'#bbf7d0',
  },
  {
    icon:  <MdEmail size={22} />,
    label: 'Gmail',
    value: GMAIL,
    sub:   'For formal communication and partnerships',
    href:  `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(GMAIL)}`,
    color: '#ea4335',
    bg:    '#fef2f2',
    border:'#fecaca',
  },
  {
    icon:  <MdPhone size={22} />,
    label: 'Phone',
    value: PHONE,
    sub:   'Weekdays 9am – 5pm WAT',
    href:  `tel:${PHONE.replace(/\s/g,'')}`,
    color: '#3b82f6',
    bg:    '#eff6ff',
    border:'#bfdbfe',
  },
  {
    icon:  <MdLocationOn size={22} />,
    label: 'Location',
    value: 'Lagos, Nigeria 🇳🇬',
    sub:   'National platform · all 36 states',
    href:  null,
    color: '#8b5cf6',
    bg:    '#f5f3ff',
    border:'#ddd6fe',
  },
];

/* ── Main component ─────────────────────────────────────────────── */
export default function Contact() {
  const [name,    setName]    = useState('');
  const [topic,   setTopic]   = useState(TOPICS[0]);
  const [message, setMessage] = useState('');
  const [sent,    setSent]    = useState('');   // 'wa' | 'gmail' | ''
  const [errors,  setErrors]  = useState({});

  const validate = () => {
    const e = {};
    if (!name.trim()    || name.trim().length < 2)    e.name    = 'Please enter your name (min 2 chars)';
    if (!message.trim() || message.trim().length < 20) e.message = 'Please describe your inquiry (min 20 chars)';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleWA = () => {
    if (!validate()) return;
    window.open(buildWhatsAppURL(name, topic, message), '_blank', 'noopener,noreferrer');
    setSent('wa');
  };

  const handleGmail = () => {
    if (!validate()) return;
    window.open(buildGmailURL(name, topic, message), '_blank', 'noopener,noreferrer');
    setSent('gmail');
  };

  /* input style helper */
  const inp = (hasErr) => ({
    width:        '100%',
    padding:      '10px 14px',
    border:       `1.5px solid ${hasErr ? '#ef4444' : '#e2e8f0'}`,
    borderRadius: 10,
    fontSize:     14,
    fontFamily:   'inherit',
    color:        '#0d0f14',
    background:   '#fff',
    outline:      'none',
    transition:   'border-color 140ms',
  });

  const focusOrange = e => e.target.style.borderColor = '#e85d04';
  const blurReset   = (hasErr) => e => e.target.style.borderColor = hasErr ? '#ef4444' : '#e2e8f0';

  return (
    <>
      <Helmet><title>Contact Us — Impact Bridge</title></Helmet>

      {/* ── Page header ─────────────────────────────────── */}
      <div style={{ background:'linear-gradient(135deg,#0f172a 0%,#1e293b 100%)', padding:'56px 0' }}>
        <div className="container" style={{ textAlign:'center' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:7, background:'rgba(232,93,4,.15)', border:'1px solid rgba(232,93,4,.25)', borderRadius:999, padding:'5px 16px', marginBottom:18 }}>
            <span style={{ fontSize:11, fontWeight:700, color:'#e85d04', letterSpacing:'.04em' }}>GET IN TOUCH</span>
          </div>
          <h1 style={{ fontSize:'clamp(1.75rem,3vw,2.5rem)', fontWeight:900, color:'#fff', letterSpacing:'-1px', marginBottom:12 }}>
            Contact Impact Bridge
          </h1>
          <p style={{ fontSize:15, color:'rgba(255,255,255,.5)', maxWidth:480, margin:'0 auto' }}>
            Choose how you want to reach us — via WhatsApp for the fastest response,
            or Gmail for formal correspondence.
          </p>
        </div>
      </div>

      <div className="container" style={{ padding:'56px 24px 80px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1.5fr', gap:48, alignItems:'start' }} className="ct-grid">

          {/* ── LEFT: contact info ─────────────────────── */}
          <div>
            <h2 style={{ fontSize:17, fontWeight:800, color:'#0d0f14', letterSpacing:'-.3px', marginBottom:22 }}>
              Reach Us
            </h2>

            <div style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:36 }}>
              {CONTACTS.map(c => {
                const card = (
                  <div style={{
                    display:      'flex',
                    alignItems:   'center',
                    gap:          14,
                    background:   c.bg,
                    border:       `1px solid ${c.border}`,
                    borderRadius: 14,
                    padding:      '16px 18px',
                    cursor:       c.href ? 'pointer' : 'default',
                    transition:   'all 140ms',
                  }}
                  onMouseEnter={e => { if (c.href) { e.currentTarget.style.transform='translateX(4px)'; e.currentTarget.style.boxShadow=`0 4px 16px ${c.color}18`; } }}
                  onMouseLeave={e => { e.currentTarget.style.transform='translateX(0)'; e.currentTarget.style.boxShadow='none'; }}>
                    <div style={{ width:46, height:46, borderRadius:12, background:'#fff', color:c.color, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:`0 2px 8px ${c.color}20`, border:`1px solid ${c.border}` }}>
                      {c.icon}
                    </div>
                    <div style={{ minWidth:0 }}>
                      <p style={{ fontSize:10, fontWeight:700, color: c.color, textTransform:'uppercase', letterSpacing:'.07em', marginBottom:3 }}>
                        {c.label}
                      </p>
                      <p style={{ fontSize:14, fontWeight:700, color:'#0d0f14', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                        {c.value}
                      </p>
                      <p style={{ fontSize:11, color:'#64748b', marginTop:2 }}>{c.sub}</p>
                    </div>
                  </div>
                );

                return c.href ? (
                  <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer" style={{ textDecoration:'none' }}>
                    {card}
                  </a>
                ) : (
                  <div key={c.label}>{card}</div>
                );
              })}
            </div>

            {/* Response times */}
            <div style={{ background:'#0f172a', borderRadius:16, padding:'20px 24px' }}>
              <p style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,.25)', textTransform:'uppercase', letterSpacing:'.1em', marginBottom:14 }}>
                Response Times
              </p>
              {[
                { label:'WhatsApp',             time:'~1 hour',   color:'#25d366' },
                { label:'Gmail / Email',         time:'24–48 hrs', color:'#ea4335' },
                { label:'Partnership requests',  time:'72 hours',  color:'#8b5cf6' },
              ].map(r => (
                <div key={r.label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'9px 0', borderBottom:'1px solid rgba(255,255,255,.05)' }}>
                  <span style={{ fontSize:13, color:'rgba(255,255,255,.5)' }}>{r.label}</span>
                  <span style={{ fontSize:12, fontWeight:700, color:r.color, background:`${r.color}12`, padding:'2px 9px', borderRadius:999 }}>{r.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: compose form ─────────────────────── */}
          <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:20, padding:36, boxShadow:'0 4px 20px rgba(0,0,0,.07)' }}>

            {sent ? (
              /* Success state */
              <div style={{ textAlign:'center', padding:'32px 16px' }}>
                <div style={{ width:72, height:72, borderRadius:'50%', background: sent==='wa'?'#f0fdf4':'#fef2f2', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', fontSize:34 }}>
                  {sent === 'wa' ? '💬' : '📧'}
                </div>
                <h3 style={{ fontSize:22, fontWeight:800, color:'#0d0f14', marginBottom:10 }}>
                  {sent === 'wa' ? 'Opening WhatsApp…' : 'Opening Gmail…'}
                </h3>
                <p style={{ fontSize:14, color:'#64748b', lineHeight:1.7, marginBottom:28 }}>
                  {sent === 'wa'
                    ? 'Your message has been pre-filled in WhatsApp. Just hit Send!'
                    : 'Your email has been pre-filled in Gmail. Review and send it!'}
                </p>
                <div style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap' }}>
                  <button onClick={() => setSent('')}
                    style={{ padding:'10px 22px', border:'1.5px solid #e2e8f0', borderRadius:10, fontSize:13, fontWeight:700, color:'#475569', background:'#fff', cursor:'pointer' }}>
                    Send Another
                  </button>
                  <button
                    onClick={() => {
                      window.open(
                        sent === 'wa'
                          ? buildWhatsAppURL(name, topic, message)
                          : buildGmailURL(name, topic, message),
                        '_blank', 'noopener,noreferrer'
                      );
                    }}
                    style={{ padding:'10px 22px', border:'none', borderRadius:10, fontSize:13, fontWeight:700, color:'#fff', background: sent==='wa'?'#25d366':'#ea4335', cursor:'pointer' }}>
                    Open Again
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2 style={{ fontSize:20, fontWeight:800, color:'#0d0f14', marginBottom:6 }}>Send a Message</h2>
                <p style={{ fontSize:14, color:'#64748b', marginBottom:28 }}>
                  Fill in your details below, then choose to send via WhatsApp or Gmail.
                </p>

                {/* Form fields */}
                <div style={{ display:'flex', flexDirection:'column', gap:18 }}>

                  {/* Name */}
                  <div>
                    <label style={{ fontSize:13, fontWeight:700, color:'#334155', display:'block', marginBottom:6 }}>
                      Your Name *
                    </label>
                    <input
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Chidi Okeke"
                      style={inp(errors.name)}
                      onFocus={focusOrange}
                      onBlur={blurReset(errors.name)}
                    />
                    {errors.name && <p style={{ fontSize:11, color:'#ef4444', marginTop:4 }}>{errors.name}</p>}
                  </div>

                  {/* Topic */}
                  <div>
                    <label style={{ fontSize:13, fontWeight:700, color:'#334155', display:'block', marginBottom:6 }}>
                      Topic
                    </label>
                    <select
                      value={topic}
                      onChange={e => setTopic(e.target.value)}
                      style={{ ...inp(false), padding:'10px 32px 10px 14px', cursor:'pointer', appearance:'none', background:`#fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 12 12'%3E%3Cpath fill='%2394A3B8' d='M6 8L1 3h10z'/%3E%3C/svg%3E") right 12px center no-repeat` }}
                      onFocus={focusOrange}
                      onBlur={blurReset(false)}>
                      {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label style={{ fontSize:13, fontWeight:700, color:'#334155', display:'block', marginBottom:6 }}>
                      Message *
                    </label>
                    <textarea
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      rows={5}
                      placeholder="Describe your inquiry in detail (minimum 20 characters)…"
                      style={{ ...inp(errors.message), resize:'vertical' }}
                      onFocus={focusOrange}
                      onBlur={blurReset(errors.message)}
                    />
                    {errors.message && <p style={{ fontSize:11, color:'#ef4444', marginTop:4 }}>{errors.message}</p>}
                    <p style={{ fontSize:11, color:'#94a3b8', marginTop:5 }}>
                      {message.length} / 20 minimum characters
                    </p>
                  </div>

                  {/* Divider */}
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{ flex:1, height:1, background:'#f1f5f9' }} />
                    <span style={{ fontSize:12, color:'#94a3b8', fontWeight:500 }}>Choose how to send</span>
                    <div style={{ flex:1, height:1, background:'#f1f5f9' }} />
                  </div>

                  {/* Send buttons */}
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>

                    {/* WhatsApp button */}
                    <button onClick={handleWA} style={{
                      display:        'flex',
                      alignItems:     'center',
                      justifyContent: 'center',
                      gap:            9,
                      padding:        '13px 16px',
                      background:     '#25d366',
                      color:          '#fff',
                      border:         'none',
                      borderRadius:   12,
                      fontSize:       14,
                      fontWeight:     700,
                      cursor:         'pointer',
                      transition:     'all 140ms',
                      fontFamily:     'inherit',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background='#1dad54'; e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow='0 6px 18px rgba(37,211,102,.35)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background='#25d366'; e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}>
                      <FaWhatsapp size={18} />
                      Send via WhatsApp
                    </button>

                    {/* Gmail button */}
                    <button onClick={handleGmail} style={{
                      display:        'flex',
                      alignItems:     'center',
                      justifyContent: 'center',
                      gap:            9,
                      padding:        '13px 16px',
                      background:     '#ea4335',
                      color:          '#fff',
                      border:         'none',
                      borderRadius:   12,
                      fontSize:       14,
                      fontWeight:     700,
                      cursor:         'pointer',
                      transition:     'all 140ms',
                      fontFamily:     'inherit',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background='#d33426'; e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow='0 6px 18px rgba(234,67,53,.35)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background='#ea4335'; e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}>
                      <MdEmail size={18} />
                      Send via Gmail
                    </button>
                  </div>

                  {/* Info note */}
                  <div style={{ display:'flex', alignItems:'flex-start', gap:10, background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:10, padding:'12px 14px' }}>
                    <span style={{ fontSize:16, flexShrink:0 }}>ℹ️</span>
                    <p style={{ fontSize:12, color:'#64748b', lineHeight:1.6 }}>
                      Clicking either button will open <strong>WhatsApp</strong> or <strong>Gmail</strong> in a new tab with your message pre-filled.
                      Nothing is sent automatically — you confirm before sending.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media(max-width:900px){ .ct-grid { grid-template-columns:1fr !important; } }
      `}</style>
    </>
  );
}


// import React, { useState } from 'react';
// import { Helmet } from 'react-helmet-async';
// import { Link } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import { MdEmail, MdPhone, MdLocationOn, MdSend, MdCheckCircle } from 'react-icons/md';
// import { FaWhatsapp } from 'react-icons/fa';
// import api from '../services/api';

// // ✅ This uses the Vite-native way to access variables
// const WA = import.meta.env.VITE_WHATSAPP || '2348012345678';

// const CONTACT_TYPES = [
//   { value: 'inquiry',     label: 'General Inquiry'        },
//   { value: 'partnership', label: 'Partnership Opportunity' },
//   { value: 'support',     label: 'Technical Support'       },
//   { value: 'report',      label: 'Report an Issue'         },
//   { value: 'other',       label: 'Other'                   },
// ];

// const INFO = [
//   { icon: <MdEmail size={20} />,    label: 'Email',    val: 'support@impactbridge.ng',  href: 'mailto:support@impactbridge.ng' },
//   { icon: <MdPhone size={20} />,    label: 'Phone',    val: '+234 801 234 5678',        href: 'tel:+2348012345678' },
//   { icon: <FaWhatsapp size={18} />, label: 'WhatsApp', val: 'Chat with us',             href: `https://wa.me/${WA}?text=Hello Impact Bridge!` },
//   { icon: <MdLocationOn size={20}/>,label: 'Location', val: 'Lagos, Nigeria 🇳🇬',       href: null },
// ];

// export default function Contact() {
//   const [form, setForm]       = useState({ name:'', email:'', type:'inquiry', subject:'', message:'' });
//   const [loading, setLoading] = useState(false);
//   const [sent,    setSent]    = useState(false);
//   const [errors,  setErrors]  = useState({});

//   const validate = () => {
//     const e = {};
//     if (!form.name.trim()    || form.name.length < 2)    e.name    = 'Name required (min 2 chars)';
//     if (!form.email.trim()   || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
//     if (!form.subject.trim() || form.subject.length < 5) e.subject = 'Subject required (min 5 chars)';
//     if (!form.message.trim() || form.message.length < 20) e.message = 'Message required (min 20 chars)';
//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

//   const submit = async (e) => {
//     e.preventDefault();
//     if (!validate()) return;
//     setLoading(true);
//     try {
//       await api.post('/contact', form);
//       setSent(true);
//     } catch (err) {
//       toast.error(err?.response?.data?.message || 'Failed to send. Try WhatsApp instead.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const inputStyle = (hasErr) => ({
//     width:        '100%',
//     padding:      '10px 14px',
//     border:       `1.5px solid ${hasErr ? '#ef4444' : '#e2e8f0'}`,
//     borderRadius: 10,
//     fontSize:     14,
//     fontFamily:   'inherit',
//     color:        '#0d0f14',
//     background:   '#fff',
//     outline:      'none',
//     transition:   'border-color 140ms',
//   });

//   const labelStyle = {
//     fontSize: 13,
//     fontWeight: 600,
//     color: '#334155',
//     display: 'block',
//     marginBottom: 6,
//   };

//   return (
//     <>
//       <Helmet><title>Contact Us — Impact Bridge</title></Helmet>

//       {/* Header */}
//       <div style={{ background: 'linear-gradient(135deg,#0f172a 0%,#1e293b 100%)', padding: '56px 0' }}>
//         <div className="container" style={{ textAlign: 'center' }}>
//           <span style={{ display:'inline-block', background:'rgba(232,93,4,.15)', color:'#e85d04', border:'1px solid rgba(232,93,4,.25)', borderRadius:999, padding:'5px 16px', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'.08em', marginBottom:18 }}>
//             Contact Us
//           </span>
//           <h1 style={{ fontSize: 'clamp(1.75rem,3vw,2.5rem)', fontWeight: 900, color: '#fff', letterSpacing: '-1px', marginBottom: 12 }}>
//             Get in Touch
//           </h1>
//           <p style={{ fontSize: 15, color: 'rgba(255,255,255,.5)', maxWidth: 480, margin: '0 auto' }}>
//             Have a question, partnership idea, or need support? We respond within 48 hours.
//           </p>
//         </div>
//       </div>

//       <div className="container" style={{ padding: '60px 24px 80px' }}>
//         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 48, alignItems: 'start' }} className="contact-grid">

//           {/* Left — contact info */}
//           <div>
//             <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0d0f14', letterSpacing: '-.3px', marginBottom: 24 }}>
//               Contact Information
//             </h2>

//             <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 36 }}>
//               {INFO.map(info => (
//                 <div key={info.label} style={{
//                   display: 'flex', alignItems: 'center', gap: 16,
//                   background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '16px 18px',
//                   transition: 'all 140ms', cursor: info.href ? 'pointer' : 'default',
//                 }}>
//                   <div style={{ width: 42, height: 42, borderRadius: 11, background: '#fff4ee', color: '#e85d04', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
//                     {info.icon}
//                   </div>
//                   <div>
//                     <p style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 3 }}>{info.label}</p>
//                     {info.href ? (
//                       <a href={info.href} target={info.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
//                         style={{ fontSize: 14, fontWeight: 600, color: '#334155', transition: 'color 140ms' }}
//                         onMouseEnter={e => e.currentTarget.style.color = '#e85d04'}
//                         onMouseLeave={e => e.currentTarget.style.color = '#334155'}>
//                         {info.val}
//                       </a>
//                     ) : (
//                       <p style={{ fontSize: 14, fontWeight: 600, color: '#334155' }}>{info.val}</p>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Response times */}
//             <div style={{ background: '#0f172a', borderRadius: 16, padding: 24 }}>
//               <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,.3)', textTransform: 'uppercase', letterSpacing: '.09em', marginBottom: 16 }}>
//                 Response Times
//               </p>
//               {[
//                 { type: 'General inquiries',   time: '48 hours' },
//                 { type: 'Partnership requests', time: '72 hours' },
//                 { type: 'Technical support',   time: '24 hours' },
//               ].map(r => (
//                 <div key={r.type} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
//                   <span style={{ fontSize: 13, color: 'rgba(255,255,255,.5)' }}>{r.type}</span>
//                   <span style={{ fontSize: 13, fontWeight: 700, color: '#e85d04' }}>{r.time}</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Right — form */}
//           <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 20, padding: 36, boxShadow: '0 4px 16px rgba(0,0,0,.06)' }}>
//             {sent ? (
//               <div style={{ textAlign: 'center', padding: '40px 20px' }}>
//                 <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
//                   <MdCheckCircle size={40} style={{ color: '#10b981' }} />
//                 </div>
//                 <h3 style={{ fontSize: 22, fontWeight: 800, color: '#0d0f14', marginBottom: 10 }}>Message Sent!</h3>
//                 <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7, marginBottom: 28 }}>
//                   Thank you for reaching out. We'll respond within 48 hours.
//                 </p>
//                 <button onClick={() => { setSent(false); setForm({ name:'', email:'', type:'inquiry', subject:'', message:'' }); }}
//                   style={{ padding: '10px 24px', border: '1.5px solid #e85d04', color: '#e85d04', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', background: 'transparent' }}>
//                   Send Another Message
//                 </button>
//               </div>
//             ) : (
//               <>
//                 <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0d0f14', marginBottom: 6 }}>Send us a message</h2>
//                 <p style={{ fontSize: 14, color: '#64748b', marginBottom: 28 }}>All fields marked * are required.</p>

//                 <form onSubmit={submit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
//                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="contact-name-grid">
//                     <div>
//                       <label style={labelStyle}>Full Name *</label>
//                       <input value={form.name} onChange={set('name')} placeholder="Chidi Okeke" style={inputStyle(errors.name)}
//                         onFocus={e => e.target.style.borderColor = '#e85d04'} onBlur={e => e.target.style.borderColor = errors.name ? '#ef4444' : '#e2e8f0'} />
//                       {errors.name && <p style={{ fontSize: 11, color: '#ef4444', marginTop: 4 }}>{errors.name}</p>}
//                     </div>
//                     <div>
//                       <label style={labelStyle}>Email Address *</label>
//                       <input type="email" value={form.email} onChange={set('email')} placeholder="chidi@example.com" style={inputStyle(errors.email)}
//                         onFocus={e => e.target.style.borderColor = '#e85d04'} onBlur={e => e.target.style.borderColor = errors.email ? '#ef4444' : '#e2e8f0'} />
//                       {errors.email && <p style={{ fontSize: 11, color: '#ef4444', marginTop: 4 }}>{errors.email}</p>}
//                     </div>
//                   </div>

//                   <div>
//                     <label style={labelStyle}>Inquiry Type</label>
//                     <select value={form.type} onChange={set('type')} style={{ ...inputStyle(false), padding: '10px 32px 10px 14px', cursor: 'pointer', appearance: 'none', background: `#fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 12 12'%3E%3Cpath fill='%2394A3B8' d='M6 8L1 3h10z'/%3E%3C/svg%3E") right 12px center no-repeat` }}>
//                       {CONTACT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
//                     </select>
//                   </div>

//                   <div>
//                     <label style={labelStyle}>Subject *</label>
//                     <input value={form.subject} onChange={set('subject')} placeholder="How can we help you?" style={inputStyle(errors.subject)}
//                       onFocus={e => e.target.style.borderColor = '#e85d04'} onBlur={e => e.target.style.borderColor = errors.subject ? '#ef4444' : '#e2e8f0'} />
//                     {errors.subject && <p style={{ fontSize: 11, color: '#ef4444', marginTop: 4 }}>{errors.subject}</p>}
//                   </div>

//                   <div>
//                     <label style={labelStyle}>Message *</label>
//                     <textarea value={form.message} onChange={set('message')} rows={5} placeholder="Describe your inquiry in detail (min 20 characters)…"
//                       style={{ ...inputStyle(errors.message), resize: 'vertical' }}
//                       onFocus={e => e.target.style.borderColor = '#e85d04'} onBlur={e => e.target.style.borderColor = errors.message ? '#ef4444' : '#e2e8f0'} />
//                     {errors.message && <p style={{ fontSize: 11, color: '#ef4444', marginTop: 4 }}>{errors.message}</p>}
//                   </div>

//                   <button type="submit" disabled={loading}
//                     style={{
//                       display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
//                       padding: '13px', background: loading ? '#94a3b8' : '#e85d04', color: '#fff',
//                       borderRadius: 11, fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
//                       border: 'none', transition: 'background 140ms',
//                     }}
//                     onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#c94d03'; }}
//                     onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#e85d04'; }}>
//                     {loading ? 'Sending…' : <><MdSend size={17} /> Send Message</>}
//                   </button>
//                 </form>
//               </>
//             )}
//           </div>
//         </div>
//       </div>

//       <style>{`
//         @media(max-width:900px){ .contact-grid { grid-template-columns:1fr !important; } }
//         @media(max-width:480px){ .contact-name-grid { grid-template-columns:1fr !important; } }
//       `}</style>
//     </>
//   );
// }