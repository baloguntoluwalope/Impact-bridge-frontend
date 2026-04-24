import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Helmet } from 'react-helmet-async';
import { MdEmail, MdLock, MdArrowForward, MdShield, MdTrendingUp, MdPeople } from 'react-icons/md';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Input  from '../../components/common/Input';
import Alert  from '../../components/common/Alert';

const schema = yup.object({
  email:    yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'At least 6 characters').required('Password is required'),
});

const STATS = [
  { icon: '✅', value: '1,247+', label: 'Verified Cases' },
  { icon: '💰', value: '₦450M+', label: 'Funds Raised' },
  { icon: '❤️', value: '12,500+', label: 'Lives Impacted' },
];

export default function Login() {
  const { login }         = useAuth();
  const [loading, setL]   = useState(false);
  const [err,     setErr] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async data => {
    setL(true); setErr('');
    try {
      await login(data.email, data.password);
    } catch (e) {
      setErr(e?.response?.data?.message || 'Invalid email or password');
    } finally { setL(false); }
  };

  return (
    <>
      <Helmet><title>Sign In — Impact Bridge</title></Helmet>
      <div style={{ display: 'flex', minHeight: '100vh' }}>

        {/* Left — Brand Panel */}
        <div style={{
          width: '42%', flexShrink: 0, position: 'sticky', top: 0, height: '100vh',
          background: 'linear-gradient(145deg, #0f172a 0%, #1e1b4b 60%, #0f172a 100%)',
          display: 'flex', flexDirection: 'column', padding: '40px 44px',
          overflow: 'hidden',
        }} className="auth-panel">

          {/* Decorative orbs */}
          <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'rgba(232,93,4,.08)', top: -120, right: -80, filter: 'blur(60px)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'rgba(99,102,241,.08)', bottom: -80, left: -60, filter: 'blur(50px)', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Logo */}
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 64 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#e85d04,#ff7a2f)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                🌍
              </div>
              <span style={{ fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: '-.4px' }}>
                Impact<span style={{ color: '#e85d04' }}>Bridge</span>
              </span>
            </Link>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(232,93,4,.15)', border: '1px solid rgba(232,93,4,.25)', borderRadius: 999, padding: '5px 14px', marginBottom: 24 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#e85d04', animation: 'pulse 2s infinite' }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: '#e85d04', letterSpacing: '.04em' }}>Nigeria's #1 Impact Platform</span>
              </div>

              <h1 style={{ fontSize: 'clamp(1.9rem,3vw,2.6rem)', fontWeight: 900, color: '#fff', lineHeight: 1.1, letterSpacing: '-1.5px', marginBottom: 16 }}>
                Welcome back to the platform.
              </h1>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,.5)', lineHeight: 1.75, maxWidth: 340, marginBottom: 48 }}>
                Continue creating transparent, verified social impact across all 36 states and FCT.
              </p>

              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 44 }}>
                {STATS.map(s => (
                  <div key={s.label} style={{
                    background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.07)',
                    borderRadius: 14, padding: '18px 14px', textAlign: 'center',
                  }}>
                    <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
                    <p style={{ fontSize: 18, fontWeight: 900, color: '#e85d04', letterSpacing: '-1px' }}>{s.value}</p>
                    <p style={{ fontSize: 10, color: 'rgba(255,255,255,.35)', fontWeight: 600, marginTop: 4, textTransform: 'uppercase', letterSpacing: '.06em' }}>{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Feature pills */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  { icon: <MdShield size={16} />,     text: 'Every case manually verified — zero fraud' },
                  { icon: <MdTrendingUp size={16} />, text: 'Real-time funding transparency' },
                  { icon: <MdPeople size={16} />,     text: '3,400+ active donors nationwide' },
                ].map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, color: 'rgba(255,255,255,.6)', fontWeight: 500 }}>
                    <span style={{ color: '#e85d04', flexShrink: 0 }}>{f.icon}</span>
                    {f.text}
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonial */}
            <div style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 16, padding: '20px 22px' }}>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,.65)', lineHeight: 1.7, fontStyle: 'italic', marginBottom: 14 }}>
                "Impact Bridge helped our NGO verify 47 school projects this year with full funding transparency."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: '#e85d04', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: '#fff' }}>A</div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Adaeze Okafor</p>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,.35)' }}>NGO Director, Lagos</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right — Form Panel */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 32px', background: '#f8fafc', overflowY: 'auto' }}>
          <div style={{ width: '100%', maxWidth: 420 }}>

            {/* Header */}
            <div style={{ marginBottom: 36 }}>
              <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0d0f14', marginBottom: 8, letterSpacing: '-.5px' }}>
                Sign In
              </h2>
              <p style={{ fontSize: 14, color: '#64748b' }}>
                Don't have an account?{' '}
                <Link to="/register" style={{ color: '#e85d04', fontWeight: 700 }}>Create one free →</Link>
              </p>
            </div>

            {err && <div style={{ marginBottom: 20 }}><Alert type="danger" message={err} onClose={() => setErr('')} /></div>}

            <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <Input
                label="Email Address" type="email" required
                placeholder="you@example.com"
                icon={<MdEmail size={17} />}
                error={errors.email?.message}
                autoComplete="email"
                {...register('email')}
              />

              <div>
                <Input
                  label="Password" type="password" required
                  placeholder="Your password"
                  icon={<MdLock size={17} />}
                  error={errors.password?.message}
                  autoComplete="current-password"
                  {...register('password')}
                />
                <div style={{ textAlign: 'right', marginTop: 8 }}>
                  <Link to="/forgot-password" style={{ fontSize: 12, color: '#e85d04', fontWeight: 600 }}>
                    Forgot password?
                  </Link>
                </div>
              </div>

              <Button type="submit" loading={loading} fullWidth size="lg">
                Sign In to Impact Bridge
              </Button>
            </form>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
              <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
              <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>OR</span>
              <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
            </div>

            <Link to="/register" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '11px', border: '1.5px solid #e2e8f0', borderRadius: 10,
              fontSize: 13, fontWeight: 600, color: '#334155', transition: 'all 140ms',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#e85d04'; e.currentTarget.style.color = '#e85d04'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#334155'; }}>
              Create Organisation Account <MdArrowForward size={16} />
            </Link>

            <p style={{ textAlign: 'center', marginTop: 24, fontSize: 12, color: '#94a3b8' }}>
              By signing in you agree to our{' '}
              <Link to="/terms" style={{ color: '#e85d04' }}>Terms</Link> &{' '}
              <Link to="/privacy" style={{ color: '#e85d04' }}>Privacy Policy</Link>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        @media(max-width:768px){
          .auth-panel { display:none !important; }
        }
      `}</style>
    </>
  );
}