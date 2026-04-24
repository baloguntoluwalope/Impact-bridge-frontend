import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { MdLock, MdVolunteerActivism } from 'react-icons/md';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Alert from '../common/Alert';
import { currency } from '../../utils/helpers';
import paymentSvc from '../../services/paymentService';
import { FUND_TYPES, GATEWAYS, PRESETS } from '../../utils/constants';
import { useAuth } from '../../context/AuthContext';

export default function DonateModal({ isOpen, onClose, request }) {
  const { isAuth }         = useAuth();
  const [sel, setSel]      = useState(null);
  const [custom, setCustom]= useState('');
  const [err, setErr]      = useState('');

  const { register, handleSubmit, watch } = useForm({
    defaultValues: { fund_type:'case_funding', payment_gateway:'korapay', is_anonymous:false, message:'' },
  });

  const gw = watch('payment_gateway');
  const amount = sel || parseInt(custom) || 0;

  const { mutate, isLoading } = useMutation({
    mutationFn: paymentSvc.initiate,
    onSuccess: d => {
      if (d?.checkout_url) { window.location.href = d.checkout_url; }
      else toast.error('Could not initiate payment. Please try again.');
    },
    onError: e => setErr(e?.response?.data?.message || 'Payment failed. Please try again.'),
  });

  const onSubmit = vals => {
    if (!isAuth)             { toast.error('Please sign in to donate'); return; }
    if (!amount || amount < 100) { setErr('Minimum donation amount is ₦100'); return; }
    setErr('');
    mutate({ request_id: request?._id, fund_type: vals.fund_type, amount, currency:'NGN', is_anonymous: vals.is_anonymous, message: vals.message, payment_gateway: vals.payment_gateway });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="💙 Make a Donation" size="md">
      <form onSubmit={handleSubmit(onSubmit)} style={{ display:'flex', flexDirection:'column', gap:20 }}>

        {/* Case info */}
        {request && (
          <div style={{ display:'flex', gap:12, background:'var(--brand-50)', border:'1px solid var(--brand-100)', borderRadius:12, padding:'14px 16px' }}>
            <MdVolunteerActivism size={22} style={{ color:'var(--brand)', flexShrink:0, marginTop:2 }} />
            <div>
              <p style={{ fontWeight:700, fontSize:14, color:'var(--gray-900)' }}>{request.title}</p>
              <p style={{ fontSize:12, color:'var(--gray-500)', marginTop:4 }}>
                {currency(request.amount_raised)} raised · Goal: {currency(request.amount_needed)}
              </p>
            </div>
          </div>
        )}

        {err && <Alert type="danger" message={err} onClose={() => setErr('')} />}

        {/* Presets */}
        <div>
          <p style={{ fontSize:13, fontWeight:700, color:'var(--gray-700)', marginBottom:12 }}>Select amount</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, marginBottom:10 }}>
            {PRESETS.map(a => (
              <button key={a} type="button" onClick={() => { setSel(a); setCustom(''); }}
                style={{
                  padding:'10px 6px', textAlign:'center', borderRadius:10, fontSize:13, fontWeight:700, cursor:'pointer',
                  border:`1.5px solid ${sel===a ? 'var(--brand)' : 'var(--gray-200)'}`,
                  background: sel===a ? 'var(--brand)' : '#fff',
                  color:      sel===a ? '#fff'         : 'var(--gray-700)',
                  transition: 'all 150ms',
                }}>
                {currency(a)}
              </button>
            ))}
          </div>
          {/* Custom input */}
          <div style={{ position:'relative' }}>
            <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', fontWeight:700, color:'var(--gray-500)', fontSize:15, pointerEvents:'none' }}>₦</span>
            <input type="number" placeholder="Enter custom amount" value={custom} min={100}
              onChange={e => { setCustom(e.target.value); setSel(null); }}
              style={{ width:'100%', padding:'10px 14px 10px 30px', border:`1.5px solid ${custom ? 'var(--brand)' : 'var(--gray-200)'}`, borderRadius:10, fontSize:14, fontWeight:700, outline:'none', fontFamily:'var(--font)', transition:'border 150ms' }}
              onFocus={e => e.target.style.borderColor='var(--brand)'}
              onBlur={e  => { if (!custom) e.target.style.borderColor='var(--gray-200)'; }}
            />
          </div>
          {amount > 0 && (
            <p style={{ marginTop:10, textAlign:'center', fontSize:13, color:'var(--gray-500)', background:'var(--gray-50)', padding:'8px 14px', borderRadius:8 }}>
              You are donating <strong style={{ color:'var(--brand)' }}>{currency(amount)}</strong>
            </p>
          )}
        </div>

        {/* Fund type */}
        <div>
          <p style={{ fontSize:13, fontWeight:700, color:'var(--gray-700)', marginBottom:10 }}>Fund type</p>
          <select {...register('fund_type')} style={{ width:'100%', padding:'10px 36px 10px 14px', border:'1.5px solid var(--gray-200)', borderRadius:10, fontSize:13, fontFamily:'var(--font)', cursor:'pointer', outline:'none', appearance:'none', background:`#fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2394A3B8' d='M6 8L1 3h10z'/%3E%3C/svg%3E") right 12px center no-repeat` }}>
            {FUND_TYPES.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
          </select>
        </div>

        {/* Gateway */}
        <div>
          <p style={{ fontSize:13, fontWeight:700, color:'var(--gray-700)', marginBottom:10 }}>Payment method</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
            {GATEWAYS.map(g => (
              <label key={g.value} style={{ position:'relative', cursor:'pointer' }}>
                <input type="radio" value={g.value} {...register('payment_gateway')} style={{ position:'absolute', opacity:0, width:0 }} />
                <div style={{
                  padding:'10px 8px', textAlign:'center', borderRadius:10, fontSize:13, fontWeight:700,
                  border:`1.5px solid ${gw===g.value ? 'var(--brand)' : 'var(--gray-200)'}`,
                  background: gw===g.value ? 'var(--brand-50)' : '#fff',
                  color:      gw===g.value ? 'var(--brand)'    : 'var(--gray-700)',
                  transition: 'all 150ms',
                }}>
                  {g.label}
                  {g.rec && <span style={{ display:'block', fontSize:9, color:'var(--success)', fontWeight:700, marginTop:3 }}>Recommended</span>}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Message */}
        <div>
          <p style={{ fontSize:13, fontWeight:700, color:'var(--gray-700)', marginBottom:8 }}>Message (optional)</p>
          <textarea rows={2} maxLength={500} placeholder="Leave an encouraging message for the beneficiary..."
            {...register('message')}
            style={{ width:'100%', padding:'10px 14px', border:'1.5px solid var(--gray-200)', borderRadius:10, fontSize:13, fontFamily:'var(--font)', resize:'vertical', outline:'none', transition:'border 150ms' }}
            onFocus={e => e.target.style.borderColor='var(--brand)'}
            onBlur={e  => e.target.style.borderColor='var(--gray-200)'}
          />
        </div>

        {/* Anonymous */}
        <label style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer', fontSize:13, color:'var(--gray-600)' }}>
          <input type="checkbox" {...register('is_anonymous')} style={{ width:16, height:16, accentColor:'var(--brand)', cursor:'pointer' }} />
          Donate anonymously (name will not be shown publicly)
        </label>

        {/* Security note */}
        <div style={{ display:'flex', alignItems:'center', gap:8, background:'var(--gray-50)', borderRadius:10, padding:'10px 14px', fontSize:12, color:'var(--gray-400)' }}>
          <MdLock size={16} style={{ color:'var(--success)', flexShrink:0 }} />
          Secured by Korapay · Payments are encrypted and webhook-verified · Idempotency protected
        </div>

        <Button type="submit" loading={isLoading} fullWidth size="lg" disabled={!amount || amount < 100}>
          Donate {amount > 0 ? currency(amount) : ''} Now
        </Button>
      </form>
    </Modal>
  );
}