import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { MdEmail } from 'react-icons/md';
import toast from 'react-hot-toast';
import authService from '../../services/authService';
import Button from '../../components/common/Button';
import Input  from '../../components/common/Input';

export default function ForgotPassword() {
  const [email,   setEmail]   = useState('');
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);

  const submit = async e => {
    e.preventDefault();
    if (!email) { toast.error('Please enter your email address'); return; }
    setLoading(true);
    try { await authService.forgotPassword(email); }
    catch {}
    finally { setSent(true); setLoading(false); }
  };

  return (
    <>
      <Helmet><title>Forgot Password — Impact Bridge</title></Helmet>
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--gray-50)', padding:24 }}>
        <div style={{ background:'#fff', border:'1px solid var(--gray-200)', borderRadius:24, padding:'48px 40px', maxWidth:440, width:'100%', boxShadow:'var(--shadow-xl)' }}>
          <Link to="/" style={{ display:'inline-flex', alignItems:'center', gap:8, marginBottom:44 }}>
            <span style={{ fontSize:26 }}>🌍</span>
            <span style={{ fontWeight:800, fontSize:18, color:'var(--gray-900)', letterSpacing:'-.4px' }}>Impact<span style={{ color:'var(--brand)' }}>Bridge</span></span>
          </Link>

          {sent ? (
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:56, marginBottom:20 }}>📬</div>
              <h2 style={{ fontSize:24, fontWeight:800, color:'var(--gray-900)', marginBottom:12, letterSpacing:'-.5px' }}>Check Your Inbox</h2>
              <p style={{ fontSize:14, color:'var(--gray-400)', lineHeight:1.75, marginBottom:32 }}>
                If an account with <strong style={{ color:'var(--gray-700)' }}>{email}</strong> exists,
                we've sent a password reset link. Please check your inbox and spam folder.
              </p>
              <Link to="/login"><Button fullWidth size="lg">Return to Sign In</Button></Link>
            </div>
          ) : (
            <>
              <h1 style={{ fontSize:26, fontWeight:800, color:'var(--gray-900)', marginBottom:10, letterSpacing:'-.5px' }}>Forgot Password?</h1>
              <p style={{ fontSize:14, color:'var(--gray-400)', lineHeight:1.7, marginBottom:32 }}>
                No worries. Enter your email address and we'll send you a secure reset link.
              </p>
              <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:20 }}>
                <Input label="Email Address" type="email" required placeholder="you@example.com"
                  icon={<MdEmail size={17} />} value={email} onChange={e => setEmail(e.target.value)}
                  autoComplete="email" />
                <Button type="submit" loading={loading} fullWidth size="lg">Send Reset Link</Button>
              </form>
              <p style={{ textAlign:'center', marginTop:24, fontSize:13 }}>
                <Link to="/login" style={{ color:'var(--gray-400)', transition:'color 150ms' }}
                  onMouseEnter={e => e.currentTarget.style.color='var(--brand)'}
                  onMouseLeave={e => e.currentTarget.style.color='var(--gray-400)'}>
                  ← Back to Sign In
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
}