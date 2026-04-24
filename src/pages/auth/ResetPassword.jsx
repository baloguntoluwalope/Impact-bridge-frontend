import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { MdLock } from 'react-icons/md';
import toast from 'react-hot-toast';
import authService from '../../services/authService';
import Button from '../../components/common/Button';
import Input  from '../../components/common/Input';
import Alert  from '../../components/common/Alert';

export default function ResetPassword() {
  const [sp]          = useSearchParams();
  const token         = sp.get('token') || '';
  const navigate      = useNavigate();
  const [password,  setPassword]  = useState('');
  const [confirm,   setConfirm]   = useState('');
  const [loading,   setLoading]   = useState(false);
  const [err,       setErr]       = useState('');

  const submit = async e => {
    e.preventDefault();
    setErr('');
    if (!token)               { setErr('Invalid reset link. Please request a new one.'); return; }
    if (password.length < 8)  { setErr('Password must be at least 8 characters'); return; }
    if (password !== confirm) { setErr('Passwords do not match'); return; }
    setLoading(true);
    try {
      await authService.resetPassword(token, password);
      toast.success('✅ Password reset successfully! You can now sign in.');
      navigate('/login');
    } catch (err) {
      setErr(err?.response?.data?.message || 'Reset failed. The link may have expired. Please request a new one.');
    } finally { setLoading(false); }
  };

  return (
    <>
      <Helmet><title>Reset Password — Impact Bridge</title></Helmet>
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--gray-50)', padding:24 }}>
        <div style={{ background:'#fff', border:'1px solid var(--gray-200)', borderRadius:24, padding:'48px 40px', maxWidth:440, width:'100%', boxShadow:'var(--shadow-xl)' }}>
          <Link to="/" style={{ display:'inline-flex', alignItems:'center', gap:8, marginBottom:44 }}>
            <span style={{ fontSize:26 }}>🌍</span>
            <span style={{ fontWeight:800, fontSize:18, color:'var(--gray-900)' }}>Impact<span style={{ color:'var(--brand)' }}>Bridge</span></span>
          </Link>

          <div style={{ width:60, height:60, borderRadius:16, background:'var(--brand-50)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, marginBottom:24, border:'2px solid var(--brand-100)' }}>
            🔐
          </div>

          <h1 style={{ fontSize:26, fontWeight:800, color:'var(--gray-900)', marginBottom:10, letterSpacing:'-.5px' }}>Set New Password</h1>
          <p style={{ fontSize:14, color:'var(--gray-400)', lineHeight:1.7, marginBottom:32 }}>
            Choose a strong new password for your Impact Bridge account.
          </p>

          {err && <div style={{ marginBottom:22 }}><Alert type="danger" message={err} onClose={() => setErr('')} /></div>}

          <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:18 }}>
            <Input label="New Password" type="password" required placeholder="At least 8 characters"
              icon={<MdLock size={17} />} value={password} onChange={e => setPassword(e.target.value)}
              hint="Include uppercase, lowercase, number and special character" />
            <Input label="Confirm Password" type="password" required placeholder="Repeat your new password"
              icon={<MdLock size={17} />} value={confirm} onChange={e => setConfirm(e.target.value)} />
            <Button type="submit" loading={loading} fullWidth size="lg">Reset Password</Button>
          </form>

          <p style={{ textAlign:'center', marginTop:24, fontSize:13 }}>
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