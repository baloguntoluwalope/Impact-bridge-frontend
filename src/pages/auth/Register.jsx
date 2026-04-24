import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Helmet } from 'react-helmet-async';
import { MdPerson, MdEmail, MdPhone } from 'react-icons/md';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import Button   from '../../components/common/Button';
import Input    from '../../components/common/Input';
import Select   from '../../components/common/Select';
import Alert    from '../../components/common/Alert';
import { STATES, ROLE_OPTIONS } from '../../utils/constants';

const schema = yup.object({
  first_name: yup.string().min(2).required('First name required'),
  last_name:  yup.string().min(2).required('Last name required'),
  email:      yup.string().email('Invalid email').required('Email required'),
  phone:      yup.string().matches(/^(\+234|234|0)[789][01]\d{8}$/, 'Invalid Nigerian phone').required('Phone required'),
  password:   yup.string().min(8, 'At least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, 'Must include uppercase, lowercase, number and special character')
    .required('Password required'),
  role:       yup.string().required('Please select a role'),
  state:      yup.string().required('State required'),
  lga:        yup.string().required('LGA required'),
});

const BENEFITS = [
  { icon: '✅', text: '100% verified cases — zero fraud tolerance' },
  { icon: '🔒', text: 'Korapay-secured escrow payments' },
  { icon: '📊', text: 'Real-time transparent fund tracking' },
  { icon: '🌍', text: 'All 17 UN SDGs covered nationwide' },
  { icon: '🏢', text: 'Vetted NGO execution network' },
  { icon: '📱', text: 'Full-featured mobile dashboard' },
];

export default function Register() {
  const { register: regUser } = useAuth();
  const [sp]                  = useSearchParams();
  const [loading, setL]       = useState(false);
  const [err,     setErr]     = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { role: sp.get('role') || 'donor' },
  });

  const onSubmit = async data => {
    setL(true); setErr('');
    try { await regUser(data); }
    catch (e) { setErr(e?.response?.data?.message || 'Registration failed. Please try again.'); }
    finally { setL(false); }
  };

  return (
    <>
      <Helmet><title>Create Account — Impact Bridge</title></Helmet>
      <div style={{ display: 'flex', minHeight: '100vh' }}>

        {/* Left panel */}
        <div style={{
          width: '38%', flexShrink: 0, position: 'sticky', top: 0, height: '100vh',
          background: 'linear-gradient(145deg,#0f172a 0%,#1e1b4b 60%,#0f172a 100%)',
          display: 'flex', flexDirection: 'column', padding: '40px 44px', overflow: 'hidden',
        }} className="auth-panel">

          <div style={{ position: 'absolute', width: 350, height: 350, borderRadius: '50%', background: 'rgba(232,93,4,.08)', top: -80, left: -60, filter: 'blur(50px)', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 56 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#e85d04,#ff7a2f)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🌍</div>
              <span style={{ fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: '-.4px' }}>Impact<span style={{ color: '#e85d04' }}>Bridge</span></span>
            </Link>

            <h2 style={{ fontSize: 'clamp(1.7rem,2.5vw,2.2rem)', fontWeight: 900, color: '#fff', lineHeight: 1.15, letterSpacing: '-1px', marginBottom: 14 }}>
              Join Nigeria's premier social impact platform.
            </h2>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,.5)', lineHeight: 1.75, marginBottom: 40 }}>
              Create your free account and start making a traceable difference across all 36 states.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 'auto' }}>
              {BENEFITS.map((b, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, color: 'rgba(255,255,255,.65)', fontWeight: 500 }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{b.icon}</span>
                  {b.text}
                </div>
              ))}
            </div>

            <div style={{ marginTop: 36, background: 'rgba(232,93,4,.1)', border: '1px solid rgba(232,93,4,.2)', borderRadius: 14, padding: '18px 20px' }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#e85d04', marginBottom: 8 }}>17 SDGs. 36 States. One Platform.</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,.45)', lineHeight: 1.65 }}>
                From healthcare to education, clean water to climate action — Impact Bridge tracks every naira of social impact across Nigeria.
              </p>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 32px', background: '#f8fafc', overflowY: 'auto' }}>
          <div style={{ width: '100%', maxWidth: 480 }}>
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 26, fontWeight: 800, color: '#0d0f14', marginBottom: 8, letterSpacing: '-.5px' }}>Create Your Account</h2>
              <p style={{ fontSize: 14, color: '#64748b' }}>
                Already have an account? <Link to="/login" style={{ color: '#e85d04', fontWeight: 700 }}>Sign in →</Link>
              </p>
            </div>

            {err && <div style={{ marginBottom: 20 }}><Alert type="danger" message={err} onClose={() => setErr('')} /></div>}

            <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="name-grid">
                <Input label="First Name" required placeholder="Amara" icon={<MdPerson size={17} />}
                  error={errors.first_name?.message} autoComplete="given-name" {...register('first_name')} />
                <Input label="Last Name" required placeholder="Okafor" icon={<MdPerson size={17} />}
                  error={errors.last_name?.message} autoComplete="family-name" {...register('last_name')} />
              </div>

              <Input label="Email Address" type="email" required placeholder="amara@example.com"
                icon={<MdEmail size={17} />} error={errors.email?.message}
                autoComplete="email" {...register('email')} />

              <Input label="Phone Number" required placeholder="08012345678"
                icon={<MdPhone size={17} />} hint="Format: 080XXXXXXXX or +234XXXXXXXXXX"
                error={errors.phone?.message} autoComplete="tel" {...register('phone')} />

              <Input label="Password" type="password" required placeholder="Create a strong password"
                hint="Min 8 chars · uppercase · lowercase · number · special char"
                error={errors.password?.message} autoComplete="new-password" {...register('password')} />

              <Select label="Joining as" required error={errors.role?.message} {...register('role')}>
                <option value="">Select your role</option>
                {ROLE_OPTIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </Select>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <Select label="State" required error={errors.state?.message} {...register('state')}>
                  <option value="">Select state</option>
                  {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </Select>
                <Input label="LGA" required placeholder="Your LGA"
                  error={errors.lga?.message} {...register('lga')} />
              </div>

              <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6 }}>
                By creating an account you agree to our{' '}
                <Link to="/terms" style={{ color: '#e85d04' }}>Terms of Service</Link> and{' '}
                <Link to="/privacy" style={{ color: '#e85d04' }}>Privacy Policy</Link>.
              </p>

              <Button type="submit" loading={loading} fullWidth size="lg">
                Create Free Account
              </Button>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        @media(max-width:768px){ .auth-panel { display:none !important; } }
        @media(max-width:480px){ .name-grid  { grid-template-columns:1fr !important; } }
      `}</style>
    </>
  );
}