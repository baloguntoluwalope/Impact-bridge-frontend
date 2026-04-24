import React, { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  MdClose, MdLock, MdVolunteerActivism,
  MdCheckCircle, MdArrowBack, MdPerson,
} from 'react-icons/md';
import { createPortal } from 'react-dom';
import { useAuth } from '../../context/AuthContext';
import paymentService from '../../services/paymentService';
import { currency, pct } from '../../utils/helpers';
import { FUND_TYPES, GATEWAYS, PRESETS, SDG } from '../../utils/constants';
import { v4 as uuid } from 'uuid';

/* ── Step indicators ───────────────────────────────────────────── */
const STEPS = ['Amount', 'Details', 'Review'];

function StepDot({ n, current, label }) {
  const done    = current > n;
  const active  = current === n;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, flex: 1 }}>
      <div style={{
        width:          28, height: 28, borderRadius: '50%',
        display:        'flex', alignItems: 'center', justifyContent: 'center',
        fontSize:       12, fontWeight: 800,
        background:     done ? '#10b981' : active ? '#e85d04' : '#f1f5f9',
        color:          done || active ? '#fff' : '#94a3b8',
        transition:     'all 200ms',
        border:         `2px solid ${done ? '#10b981' : active ? '#e85d04' : '#e2e8f0'}`,
      }}>
        {done ? <MdCheckCircle size={14} /> : n}
      </div>
      <span style={{ fontSize: 10, fontWeight: 600, color: active ? '#e85d04' : done ? '#10b981' : '#94a3b8' }}>
        {label}
      </span>
    </div>
  );
}

function Connector({ done }) {
  return (
    <div style={{ flex: 1, height: 2, background: done ? '#10b981' : '#e2e8f0', marginTop: -18, transition: 'background 200ms' }} />
  );
}

/* ── Progress bar ──────────────────────────────────────────────── */
function MiniProgress({ raised, needed }) {
  const p = pct(raised, needed);
  return (
    <div>
      <div style={{ background: '#f1f5f9', borderRadius: 999, height: 6, overflow: 'hidden' }}>
        <div style={{ width: `${p}%`, height: '100%', background: 'linear-gradient(90deg,#e85d04,#ff7a2f)', borderRadius: 999, transition: 'width .6s ease' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5, fontSize: 12 }}>
        <span style={{ fontWeight: 700, color: '#e85d04' }}>{currency(raised)} raised</span>
        <span style={{ color: '#94a3b8' }}>Goal: {currency(needed)} · {p}%</span>
      </div>
    </div>
  );
}

/* ── Amount presets ────────────────────────────────────────────── */
function PresetButton({ amount, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick(amount)}
      style={{
        padding:    '11px 8px',
        textAlign:  'center',
        borderRadius: 10,
        fontSize:   13,
        fontWeight: 700,
        cursor:     'pointer',
        transition: 'all 140ms',
        border:     `1.5px solid ${selected ? '#e85d04' : '#e2e8f0'}`,
        background: selected ? '#e85d04' : '#fff',
        color:      selected ? '#fff'    : '#334155',
      }}
      onMouseEnter={e => { if (!selected) { e.currentTarget.style.borderColor = '#e85d04'; e.currentTarget.style.color = '#e85d04'; } }}
      onMouseLeave={e => { if (!selected) { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#334155'; } }}
    >
      {currency(amount)}
    </button>
  );
}

/* ── Gateway card ──────────────────────────────────────────────── */
function GatewayCard({ gw, selected, onClick }) {
  const COLORS = { korapay: '#10b981', paystack: '#3b82f6', flutterwave: '#f59e0b' };
  const color  = COLORS[gw.value] || '#64748b';

  return (
    <button
      type="button"
      onClick={() => onClick(gw.value)}
      style={{
        flex:       1, padding: '12px 8px', textAlign: 'center',
        borderRadius: 10, cursor: 'pointer', transition: 'all 140ms',
        border:     `1.5px solid ${selected ? color : '#e2e8f0'}`,
        background: selected ? `${color}10` : '#fff',
      }}>
      <p style={{ fontSize: 13, fontWeight: 700, color: selected ? color : '#334155' }}>{gw.label}</p>
      {gw.rec && (
        <span style={{ fontSize: 9, fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '.05em' }}>
          Recommended
        </span>
      )}
    </button>
  );
}

/* ── Main modal ────────────────────────────────────────────────── */
export default function DonateModal({ isOpen, onClose, request }) {
  const { isAuth, user } = useAuth();

  /* State */
  const [step,      setStep]      = useState(1);
  const [preset,    setPreset]    = useState(null);
  const [custom,    setCustom]    = useState('');
  const [fundType,  setFundType]  = useState('case_funding');
  const [gateway,   setGateway]   = useState('korapay');
  const [anon,      setAnon]      = useState(false);
  const [message,   setMessage]   = useState('');
  const [error,     setError]     = useState('');

  /* Derived */
  const amount = preset || parseInt(custom.replace(/[^0-9]/g, ''), 10) || 0;
  const sdg    = SDG[request?.sdg_number] || {};

  /* Reset on close */
  const handleClose = useCallback(() => {
    setStep(1); setPreset(null); setCustom(''); setFundType('case_funding');
    setGateway('korapay'); setAnon(false); setMessage(''); setError('');
    onClose();
  }, [onClose]);

  /* Mutation */
  const { mutate, isLoading } = useMutation({
    mutationFn: (payload) => paymentService.initiate(payload),
    onSuccess: (data) => {
      const url = data?.checkout_url || data?.authorization_url || data?.payment_url;
      if (url) {
        window.location.href = url;
      } else {
        toast.error('Payment link not received. Please try again.');
      }
    },
    onError: (err) => {
      setError(err?.response?.data?.message || 'Payment initiation failed. Please try again.');
      setStep(2); // Go back to details
    },
  });

  const handleSubmit = () => {
    if (!isAuth) { toast.error('Please sign in to donate'); return; }
    if (!amount || amount < 100) { setError('Minimum donation is ₦100'); return; }
    setError('');

    mutate({
      request_id:      request?._id,
      fund_type:       fundType,
      amount,
      currency:        'NGN',
      payment_gateway: gateway,
      is_anonymous:    anon,
      message:         message.trim() || undefined,
    });
  };

  /* Validation per step */
  const canProceed = {
    1: amount >= 100,
    2: true,
    3: true,
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      onClick={handleClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(15,23,42,.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px', backdropFilter: 'blur(4px)',
        animation: 'fadeIn 150ms ease',
      }}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background:   '#fff',
          borderRadius: 22,
          width:        '100%',
          maxWidth:     520,
          maxHeight:    '94vh',
          display:      'flex',
          flexDirection:'column',
          boxShadow:    '0 24px 64px rgba(0,0,0,.2)',
          animation:    'scaleIn 200ms ease',
          overflow:     'hidden',
        }}>

        {/* ── Header ── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px 16px', borderBottom: '1px solid #f1f5f9', flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {step > 1 && (
              <button
                onClick={() => { setError(''); setStep(s => s - 1); }}
                style={{ width: 32, height: 32, borderRadius: 9, background: '#f1f5f9', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                <MdArrowBack size={18} />
              </button>
            )}
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0d0f14', margin: 0 }}>
                <MdVolunteerActivism size={18} style={{ color: '#e85d04', marginRight: 7, verticalAlign: 'middle' }} />
                Make a Donation
              </h2>
              <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
                Step {step} of {STEPS.length} — {STEPS[step - 1]}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            style={{ width: 34, height: 34, borderRadius: 9, background: '#f1f5f9', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', transition: 'all 140ms' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.color = '#ef4444'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#64748b'; }}>
            <MdClose size={19} />
          </button>
        </div>

        {/* ── Step indicators ── */}
        <div style={{ padding: '16px 28px 0', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0 }}>
            {STEPS.map((label, i) => (
              <React.Fragment key={label}>
                <StepDot n={i + 1} current={step} label={label} />
                {i < STEPS.length - 1 && <Connector done={step > i + 1} />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* ── Case info banner ── */}
        {request && (
          <div style={{ margin: '16px 24px 0', background: '#fff4ee', border: '1px solid rgba(232,93,4,.15)', borderRadius: 12, padding: '14px 16px', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              {sdg.icon && <span style={{ fontSize: 20 }}>{sdg.icon}</span>}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#0d0f14', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {request.title}
                </p>
                <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>
                  📍 {request.state}{request.lga ? `, ${request.lga}` : ''} {sdg.title ? `· SDG ${request.sdg_number}` : ''}
                </p>
              </div>
            </div>
            <MiniProgress raised={request.amount_raised || 0} needed={request.amount_needed || 0} />
          </div>
        )}

        {/* ── Body (scrollable) ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>

          {/* Error */}
          {error && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '12px 14px', marginBottom: 18 }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>⚠️</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#991b1b', marginBottom: 2 }}>Something went wrong</p>
                <p style={{ fontSize: 12, color: '#b91c1c' }}>{error}</p>
              </div>
              <button onClick={() => setError('')} style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}>
                <MdClose size={15} />
              </button>
            </div>
          )}

          {/* ══ STEP 1 — Amount ══ */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 12 }}>
                  Select a preset amount
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 9 }}>
                  {PRESETS.map(a => (
                    <PresetButton
                      key={a}
                      amount={a}
                      selected={preset === a}
                      onClick={v => { setPreset(v); setCustom(''); }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 8 }}>
                  Or enter a custom amount
                </p>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', fontWeight: 800, color: '#94a3b8', fontSize: 18, pointerEvents: 'none', zIndex: 1 }}>₦</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="0"
                    value={custom}
                    onChange={e => {
                      const raw = e.target.value.replace(/[^0-9]/g, '');
                      setCustom(raw ? Number(raw).toLocaleString() : '');
                      setPreset(null);
                    }}
                    style={{
                      width:        '100%',
                      padding:      '13px 14px 13px 35px',
                      border:       `1.5px solid ${custom ? '#e85d04' : '#e2e8f0'}`,
                      borderRadius: 10,
                      fontSize:     22,
                      fontWeight:   800,
                      fontFamily:   'inherit',
                      color:        '#0d0f14',
                      outline:      'none',
                      transition:   'border-color 140ms',
                    }}
                    onFocus={e => e.target.style.borderColor = '#e85d04'}
                    onBlur={e  => { if (!custom) e.target.style.borderColor = '#e2e8f0'; }}
                  />
                </div>
              </div>

              {/* Amount display */}
              {amount > 0 && (
                <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 10, padding: '12px 16px', textAlign: 'center' }}>
                  <p style={{ fontSize: 13, color: '#064e3b' }}>
                    You are donating <strong style={{ fontSize: 18, color: '#10b981' }}>{currency(amount)}</strong> to this case
                  </p>
                  {amount < 100 && (
                    <p style={{ fontSize: 11, color: '#ef4444', marginTop: 4 }}>Minimum donation is ₦100</p>
                  )}
                </div>
              )}

              {/* Security note */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, background: '#f8fafc', borderRadius: 10, padding: '10px 14px' }}>
                <MdLock size={15} style={{ color: '#10b981', flexShrink: 0 }} />
                <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>
                  Your donation is secured by Korapay. Funds are held in an escrow wallet until project execution.
                </p>
              </div>
            </div>
          )}

          {/* ══ STEP 2 — Details ══ */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Fund type */}
              <div>
                <label style={{ fontSize: 13, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 8 }}>
                  Fund Type
                </label>
                <select
                  value={fundType}
                  onChange={e => setFundType(e.target.value)}
                  style={{
                    width:         '100%',
                    padding:       '11px 36px 11px 14px',
                    border:        '1.5px solid #e2e8f0',
                    borderRadius:  10,
                    fontSize:      14,
                    fontFamily:    'inherit',
                    color:         '#0d0f14',
                    cursor:        'pointer',
                    appearance:    'none',
                    background:    `#fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 12 12'%3E%3Cpath fill='%2394A3B8' d='M6 8L1 3h10z'/%3E%3C/svg%3E") right 12px center no-repeat`,
                    outline:       'none',
                  }}
                  onFocus={e => e.target.style.borderColor = '#e85d04'}
                  onBlur={e  => e.target.style.borderColor = '#e2e8f0'}>
                  {FUND_TYPES.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                </select>
              </div>

              {/* Payment gateway */}
              <div>
                <label style={{ fontSize: 13, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 10 }}>
                  Payment Method
                </label>
                <div style={{ display: 'flex', gap: 9 }}>
                  {GATEWAYS.map(gw => (
                    <GatewayCard
                      key={gw.value}
                      gw={gw}
                      selected={gateway === gw.value}
                      onClick={setGateway}
                    />
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <label style={{ fontSize: 13, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 8 }}>
                  Message to beneficiary <span style={{ fontWeight: 400, color: '#94a3b8' }}>(optional)</span>
                </label>
                <textarea
                  rows={3}
                  maxLength={300}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Leave an encouraging message for the beneficiary…"
                  style={{
                    width:        '100%',
                    padding:      '10px 14px',
                    border:       '1.5px solid #e2e8f0',
                    borderRadius: 10,
                    fontSize:     13,
                    fontFamily:   'inherit',
                    color:        '#0d0f14',
                    resize:       'vertical',
                    outline:      'none',
                    transition:   'border-color 140ms',
                  }}
                  onFocus={e => e.target.style.borderColor = '#e85d04'}
                  onBlur={e  => e.target.style.borderColor = '#e2e8f0'}
                />
                <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 4, textAlign: 'right' }}>
                  {message.length}/300
                </p>
              </div>

              {/* Anonymous toggle */}
              <label style={{
                display:     'flex',
                alignItems:  'center',
                gap:         12,
                cursor:      'pointer',
                background:  '#f8fafc',
                borderRadius: 10,
                padding:     '12px 16px',
                border:      `1.5px solid ${anon ? '#e85d04' : '#e2e8f0'}`,
                transition:  'all 140ms',
              }}>
                <div
                  onClick={() => setAnon(p => !p)}
                  style={{
                    width:          22,
                    height:         22,
                    borderRadius:   6,
                    border:         `2px solid ${anon ? '#e85d04' : '#e2e8f0'}`,
                    background:     anon ? '#e85d04' : '#fff',
                    display:        'flex',
                    alignItems:     'center',
                    justifyContent: 'center',
                    flexShrink:     0,
                    transition:     'all 140ms',
                    cursor:         'pointer',
                  }}>
                  {anon && <MdCheckCircle size={14} style={{ color: '#fff' }} />}
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 2 }}>
                    <MdPerson size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                    Donate anonymously
                  </p>
                  <p style={{ fontSize: 11, color: '#94a3b8' }}>
                    Your name will not appear on the public donor list
                  </p>
                </div>
              </label>

              {/* Donor info (if not anonymous) */}
              {!anon && user && (
                <div style={{ background: '#f8fafc', borderRadius: 10, padding: '12px 16px', fontSize: 13, color: '#64748b' }}>
                  <p style={{ fontWeight: 700, color: '#334155', marginBottom: 3 }}>Donating as:</p>
                  <p>{user.first_name} {user.last_name} · {user.email}</p>
                </div>
              )}
            </div>
          )}

          {/* ══ STEP 3 — Review & Pay ══ */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Summary card */}
              <div style={{ background: 'linear-gradient(135deg,#e85d04,#c94d03)', borderRadius: 16, padding: '24px', color: '#fff', textAlign: 'center' }}>
                <p style={{ fontSize: 12, fontWeight: 700, opacity: .8, textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 8 }}>
                  Donation Amount
                </p>
                <p style={{ fontSize: 40, fontWeight: 900, letterSpacing: '-2px', lineHeight: 1 }}>
                  {currency(amount)}
                </p>
                <p style={{ fontSize: 12, opacity: .7, marginTop: 8 }}>
                  via {gateway.charAt(0).toUpperCase() + gateway.slice(1)}
                </p>
              </div>

              {/* Review rows */}
              <div style={{ background: '#f8fafc', borderRadius: 12, overflow: 'hidden' }}>
                {[
                  { label: 'Beneficiary',    value: request?.title || 'General Fund' },
                  { label: 'Fund Type',      value: FUND_TYPES.find(f => f.value === fundType)?.label || fundType },
                  { label: 'Gateway',        value: gateway.charAt(0).toUpperCase() + gateway.slice(1) },
                  { label: 'Donor',          value: anon ? 'Anonymous' : `${user?.first_name} ${user?.last_name}` },
                  ...(message ? [{ label: 'Message', value: message }] : []),
                ].map((row, i, arr) => (
                  <div key={row.label} style={{
                    display:       'flex',
                    alignItems:    'flex-start',
                    justifyContent:'space-between',
                    gap:           16,
                    padding:       '12px 16px',
                    borderBottom:  i < arr.length - 1 ? '1px solid #e2e8f0' : 'none',
                  }}>
                    <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, flexShrink: 0 }}>{row.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#334155', textAlign: 'right', wordBreak: 'break-word' }}>{row.value}</span>
                  </div>
                ))}
              </div>

              {/* Security assurances */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { icon: '🔒', text: 'Payment secured by 256-bit SSL encryption' },
                  { icon: '💼', text: 'Funds held in escrow until NGO execution begins' },
                  { icon: '📊', text: 'Full impact report emailed to you after project completion' },
                  { icon: '🧾', text: 'Receipt sent to your email immediately after payment' },
                ].map(item => (
                  <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 12, color: '#64748b' }}>
                    <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Footer / CTA ── */}
        <div style={{ padding: '16px 24px 20px', borderTop: '1px solid #f1f5f9', flexShrink: 0, background: '#fff' }}>
          {step < 3 ? (
            <button
              disabled={!canProceed[step]}
              onClick={() => { setError(''); setStep(s => s + 1); }}
              style={{
                width:         '100%',
                padding:       '14px',
                borderRadius:  12,
                fontSize:      15,
                fontWeight:    800,
                cursor:        canProceed[step] ? 'pointer' : 'not-allowed',
                border:        'none',
                background:    canProceed[step] ? '#e85d04' : '#f1f5f9',
                color:         canProceed[step] ? '#fff'    : '#94a3b8',
                transition:    'all 140ms',
              }}
              onMouseEnter={e => { if (canProceed[step]) { e.currentTarget.style.background = '#c94d03'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
              onMouseLeave={e => { e.currentTarget.style.background = canProceed[step] ? '#e85d04' : '#f1f5f9'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              Continue →
            </button>
          ) : (
            <button
              disabled={isLoading}
              onClick={handleSubmit}
              style={{
                width:          '100%',
                padding:        '15px',
                borderRadius:   12,
                fontSize:       15,
                fontWeight:     800,
                cursor:         isLoading ? 'not-allowed' : 'pointer',
                border:         'none',
                background:     isLoading ? '#94a3b8' : '#e85d04',
                color:          '#fff',
                transition:     'all 140ms',
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                gap:            10,
              }}
              onMouseEnter={e => { if (!isLoading) { e.currentTarget.style.background = '#c94d03'; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(232,93,4,.35)'; } }}
              onMouseLeave={e => { e.currentTarget.style.background = isLoading ? '#94a3b8' : '#e85d04'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
              {isLoading ? (
                <>
                  <span style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid rgba(255,255,255,.3)', borderTop: '2px solid #fff', animation: 'spin .6s linear infinite', display: 'inline-block', flexShrink: 0 }} />
                  Redirecting to {gateway}…
                </>
              ) : (
                <>
                  <MdLock size={17} />
                  Pay {currency(amount)} Securely
                </>
              )}
            </button>
          )}

          <p style={{ textAlign: 'center', fontSize: 11, color: '#94a3b8', marginTop: 10 }}>
            🇳🇬 Funds go directly to Impact Bridge verified escrow · No platform fees deducted
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn  { from{opacity:0}                        to{opacity:1}                }
        @keyframes scaleIn { from{opacity:0;transform:scale(.94)}   to{opacity:1;transform:scale(1)} }
        @keyframes spin    { to{transform:rotate(360deg)}                                        }
      `}</style>
    </div>,
    document.body
  );
}