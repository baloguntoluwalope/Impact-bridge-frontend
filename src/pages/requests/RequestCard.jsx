import React from 'react';
import { Link } from 'react-router-dom';
import { MdLocationOn, MdPeople, MdVerified } from 'react-icons/md';
import { currency, clip, ago, pct as calcPct } from '../../utils/helpers';
import { SDG, URGENCY } from '../../utils/constants';
import ProgressBar from '../../components/common/progressBar';

export default function RequestCard({ request }) {
  const p   = calcPct(request.amount_raised, request.amount_needed);
  const sdg = SDG[request.sdg_number] || {};
  const urg = URGENCY.find(u => u.value === request.urgency) || {};
  const img = request.media?.[0]?.url;

  return (
    <article style={{
      background:'#ffffffb7', border:'1px solid var(--gray-200)', borderRadius:16,
      overflow:'hidden', display:'flex', flexDirection:'column',
      transition:'all 200ms ease',
    }}
    onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='var(--shadow-lg)'; e.currentTarget.style.borderColor='var(--gray-300)'; }}
    onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; e.currentTarget.style.borderColor='var(--gray-200)'; }}
    >
      {/* Image */}
      <div style={{ position:'relative', height:196, overflow:'hidden', flexShrink:0 }}>
        {img
          ? <img src={img} alt={request.title} loading="lazy" style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform 400ms ease' }}
              onMouseEnter={e => e.currentTarget.style.transform='scale(1.05)'}
              onMouseLeave={e => e.currentTarget.style.transform='scale(1)'} />
          : <div style={{ width:'100%', height:'100%', background:`linear-gradient(135deg, ${sdg.color||'#E85D04'}14, var(--gray-100))`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:52 }}>
              {sdg.icon || '🌍'}
            </div>
        }
        {/* SDG chip */}
        {request.sdg_number && (
          <span style={{ position:'absolute', top:12, left:12, background:sdg.color||'var(--brand)', color:'#fff', fontSize:10, fontWeight:800, padding:'3px 9px', borderRadius:999, letterSpacing:'.04em' }}>
            SDG {request.sdg_number}
          </span>
        )}
        {/* Urgency */}
        {['high','critical'].includes(request.urgency) && (
          <span style={{ position:'absolute', top:12, right:12, background: request.urgency==='critical' ? 'var(--danger)' : '#F97316', color:'#fff', fontSize:10, fontWeight:700, padding:'3px 9px', borderRadius:999 }}>
            {request.urgency === 'critical' ? '🚨 Critical' : '⚠️ Urgent'}
          </span>
        )}
      </div>

      {/* Body */}
      <div style={{ padding:'18px 20px', display:'flex', flexDirection:'column', gap:10, flex:1 }}>
        {/* Meta row */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', fontSize:12, color:'var(--gray-400)' }}>
          <span style={{ display:'flex', alignItems:'center', gap:3 }}>
            <MdLocationOn size={13} />
            {request.state}{request.lga ? `, ${request.lga}` : ''}
          </span>
          <span>{ago(request.created_at)}</span>
        </div>

        {/* Title */}
        <h3 style={{ fontSize:15, fontWeight:700, color:'var(--gray-900)', lineHeight:1.4, margin:0 }}>
          <Link to={`/requests/${request._id}`}
            style={{ transition:'color 150ms' }}
            onMouseEnter={e => e.currentTarget.style.color='var(--brand)'}
            onMouseLeave={e => e.currentTarget.style.color='var(--gray-900)'}>
            {clip(request.title, 80)}
          </Link>
        </h3>

        {/* Description */}
        <p style={{ fontSize:13, color:'var(--gray-500)', lineHeight:1.65, margin:0 }}>
          {clip(request.description, 100)}
        </p>

        {/* Progress */}
        <div style={{ marginTop:'auto', paddingTop:4 }}>
          <ProgressBar value={p} max={100} height={6} />
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:8 }}>
            <div>
              <span style={{ fontWeight:700, color:'var(--brand)', fontSize:14 }}>{currency(request.amount_raised)}</span>
              <span style={{ fontSize:12, color:'var(--gray-400)' }}> of {currency(request.amount_needed)}</span>
            </div>
            <span style={{ fontSize:13, fontWeight:700, color:'var(--gray-700)' }}>{p}%</span>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', paddingTop:12, borderTop:'1px solid var(--gray-100)' }}>
          <span style={{ display:'flex', alignItems:'center', gap:5, fontSize:12, color:'var(--gray-400)' }}>
            <MdPeople size={14} />{request.donor_count || 0} donors
          </span>
          <Link to={`/requests/${request._id}`}
            style={{ padding:'7px 16px', background:'var(--brand)', color:'#290f58a4', borderRadius:8, fontSize:12, fontWeight:700, transition:'all 150ms' }}
            onMouseEnter={e => { e.currentTarget.style.background='var(--brand-hover)'; e.currentTarget.style.transform='translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background='var(--brand)'; e.currentTarget.style.transform='translateY(0)'; }}>
            Donate Now
          </Link>
        </div>
      </div>
    </article>
  );
}