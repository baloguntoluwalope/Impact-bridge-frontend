import React, { useState, useRef } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import authService from '../../services/authService';
import Button from '../../components/common/Button';

export default function VerifyEmail() {
  const [sp]         = useSearchParams();
  const email        = sp.get('email') || '';
  const navigate     = useNavigate();
  const [otp, setOtp]= useState(['','','','','','']);
  const [loading, setLoading]   = useState(false);
  const [resending, setResending]= useState(false);
  const inputs = useRef([]);

  const onChange = (v, i) => {
    if (!/^\d*$/.test(v)) return;
    const n = [...otp]; n[i] = v.slice(-1); setOtp(n);
    if (v && i < 5) inputs.current[i+1]?.focus();
  };

  const onKey = (e, i) => { if (e.key === 'Backspace' && !otp[i] && i > 0) inputs.current[i-1]?.focus(); };

  const onPaste = e => {
    const p = e.clipboardData.getData('text').replace(/\D/g,'').slice(0,6);
    if (p.length === 6) { setOtp(p.split('')); inputs.current[5]?.focus(); }
  };

  const submit = async e => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length !== 6) { toast.error('Please enter the complete 6-digit code'); return; }
    setLoading(true);
    try {
      await authService.verifyEmail(email, code);
      toast.success('✅ Email verified! You can now sign in.');
      navigate('/login');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Invalid or expired code. Please try again.');
    } finally { setLoading(false); }
  };

  const resend = async () => {
    setResending(true);
    try { await authService.resendOTP(email); toast.success('📧 New code sent to your email'); }
    catch { toast.error('Failed to resend. Please try again.'); }
    finally { setResending(false); }
  };

  return (
    <>
      <Helmet><title>Verify Email — Impact Bridge</title></Helmet>
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--gray-50)', padding:24 }}>
        <div style={{ background:'#fff', border:'1px solid var(--gray-200)', borderRadius:24, padding:'52px 44px', maxWidth:460, width:'100%', textAlign:'center', boxShadow:'var(--shadow-xl)' }}>
          {/* Icon */}
          <div style={{ width:72, height:72, borderRadius:20, background:'var(--brand-50)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:34, margin:'0 auto 24px', border:'2px solid var(--brand-100)' }}>
            📧
          </div>

          <h1 style={{ fontSize:26, fontWeight:800, color:'var(--gray-900)', marginBottom:12, letterSpacing:'-.5px' }}>Check Your Email</h1>
          <p style={{ fontSize:14, color:'var(--gray-400)', lineHeight:1.75, marginBottom:36 }}>
            We sent a 6-digit verification code to<br />
            <strong style={{ color:'var(--gray-700)' }}>{email || 'your email address'}</strong>
          </p>

          <form onSubmit={submit}>
            <div style={{ display:'flex', gap:10, justifyContent:'center', marginBottom:28 }} onPaste={onPaste}>
              {otp.map((d, i) => (
                <input key={i}
                  ref={el => inputs.current[i] = el}
                  type="text" inputMode="numeric" maxLength={1} value={d}
                  onChange={e => onChange(e.target.value, i)}
                  onKeyDown={e => onKey(e, i)}
                  style={{
                    width:52, height:62, textAlign:'center', fontSize:26, fontWeight:800,
                    fontFamily:'var(--font)', caret:'transparent',
                    border:`2px solid ${d ? 'var(--brand)' : 'var(--gray-200)'}`,
                    borderRadius:12, outline:'none', color:'var(--gray-900)',
                    background: d ? 'var(--brand-50)' : '#fff',
                    transition:'all 150ms', letterSpacing:'-.02em',
                  }}
                  onFocus={e => { e.target.style.borderColor='var(--brand)'; e.target.style.boxShadow='0 0 0 3px rgba(232,93,4,.12)'; }}
                  onBlur={e  => { e.target.style.borderColor=d?'var(--brand)':'var(--gray-200)'; e.target.style.boxShadow='none'; }}
                />
              ))}
            </div>

            <Button type="submit" loading={loading} fullWidth size="lg">Verify Email</Button>
          </form>

          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, marginTop:24, fontSize:13, color:'var(--gray-400)', flexWrap:'wrap' }}>
            <span>Didn't receive it?</span>
            <button onClick={resend} disabled={resending}
              style={{ color:'var(--brand)', fontWeight:700, fontSize:13, transition:'opacity 150ms' }}
              onMouseEnter={e => e.currentTarget.style.opacity='.7'}
              onMouseLeave={e => e.currentTarget.style.opacity='1'}>
              {resending ? 'Sending…' : 'Resend Code'}
            </button>
          </div>

          <p style={{ marginTop:20, fontSize:13 }}>
            <Link to="/login" style={{ color:'var(--gray-400)', transition:'color 150ms' }}
              onMouseEnter={e => e.currentTarget.style.color='var(--brand)'}
              onMouseLeave={e => e.currentTarget.style.color='var(--gray-400)'}>
              ← Back to Sign In
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}