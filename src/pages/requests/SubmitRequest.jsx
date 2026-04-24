import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Helmet } from 'react-helmet-async';
import { MdCloudUpload, MdClose } from 'react-icons/md';
import toast from 'react-hot-toast';
import requestSvc from '../../services/requestService';
import Button   from '../../components/common/Button';
import Input    from '../../components/common/Input';
import Textarea from '../../components/common/Textarea';
import Select   from '../../components/common/Select';
import Alert    from '../../components/common/Alert';
import { SDG_CATS, STATES, URGENCY, FUND_TYPES } from '../../utils/constants';

const schema = yup.object({
  title:               yup.string().min(10,'Min 10 characters').max(200).required('Title required'),
  description:         yup.string().min(50,'Min 50 characters').required('Description required'),
  category:            yup.string().required('Category required'),
  amount_needed:       yup.number().min(1000,'Min ₦1,000').max(50000000).required('Amount required').typeError('Enter a valid amount'),
  state:               yup.string().required('State required'),
  lga:                 yup.string().required('LGA required'),
  urgency:             yup.string().required('Urgency required'),
  fund_type:           yup.string().required('Fund type required'),
  beneficiaries_count: yup.number().min(1).required('Number of beneficiaries required').typeError('Enter a valid number'),
  impact_statement:    yup.string().min(20,'Min 20 characters').required('Impact statement required'),
});

export default function SubmitRequest() {
  const navigate         = useNavigate();
  const [files,  setFiles]  = useState([]);
  const [loading,setLoading]= useState(false);
  const [err,    setErr]    = useState('');

  const { register, handleSubmit, formState:{ errors } } = useForm({ resolver: yupResolver(schema), defaultValues: { urgency:'medium', fund_type:'case_funding' } });

  const handleFiles = e => {
    const f = Array.from(e.target.files);
    if (f.length + files.length > 10) { toast.error('Maximum 10 files'); return; }
    setFiles(p => [...p, ...f]);
  };

  const removeFile = i => setFiles(p => p.filter((_,j) => j !== i));

  const onSubmit = async data => {
    setLoading(true); setErr('');
    try {
      const fd = new FormData();
      Object.entries(data).forEach(([k,v]) => fd.append(k, v));
      files.forEach(f => fd.append('media', f));
      const res = await requestSvc.create(fd);
      toast.success('🎉 Request submitted successfully! It will be reviewed within 48 hours.');
      navigate('/donor/dashboard');
    } catch (e) {
      setErr(e?.response?.data?.message || 'Failed to submit. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <>
      <Helmet><title>Submit a Request — Impact Bridge</title></Helmet>

      <div style={{ maxWidth:720, margin:'0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom:36 }}>
          <h1 style={{ fontSize:28, fontWeight:800, color:'var(--gray-900)', letterSpacing:'-.5px', marginBottom:10 }}>Submit a Request</h1>
          <p style={{ fontSize:14, color:'var(--gray-500)', lineHeight:1.7 }}>
            Your request will be reviewed by our team within 48 hours. Verified requests are made visible to donors, NGOs, and government partners.
          </p>
        </div>

        {/* Info box */}
        <div style={{ display:'flex', gap:12, background:'var(--info-50)', border:'1px solid #BFDBFE', borderRadius:14, padding:'16px 20px', marginBottom:32 }}>
          <span style={{ fontSize:22, flexShrink:0 }}>ℹ️</span>
          <div>
            <p style={{ fontWeight:700, fontSize:14, color:'var(--info)', marginBottom:4 }}>What happens after you submit?</p>
            <p style={{ fontSize:13, color:'var(--gray-600)', lineHeight:1.65 }}>
              Our team verifies every submission. You'll receive an email notification with the decision. Verified requests are published and can receive donations within minutes.
            </p>
          </div>
        </div>

        {err && <div style={{ marginBottom:24 }}><Alert type="danger" message={err} onClose={() => setErr('')} /></div>}

        <form onSubmit={handleSubmit(onSubmit)} style={{ display:'flex', flexDirection:'column', gap:20 }}>
          <Input label="Request Title" required placeholder="e.g. School Roof Repair for 200 Students in Kano"
            error={errors.title?.message}
            hint="Be specific and descriptive — this is the first thing donors see"
            {...register('title')} />

          <Textarea label="Detailed Description" required rows={6}
            placeholder="Describe the situation in detail. What is the problem? Who is affected? What will the funds be used for? What evidence do you have?"
            error={errors.description?.message} hint="Minimum 50 characters"
            {...register('description')} />

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            <Select label="SDG Category" required error={errors.category?.message} {...register('category')}>
              <option value="">Select SDG category</option>
              {SDG_CATS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </Select>
            <Select label="Fund Type" required error={errors.fund_type?.message} {...register('fund_type')}>
              {FUND_TYPES.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
            </Select>
          </div>

          <Input label="Amount Needed (₦)" type="number" required
            placeholder="e.g. 500000"
            error={errors.amount_needed?.message}
            hint="Minimum ₦1,000 · Maximum ₦50,000,000"
            {...register('amount_needed')} />

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            <Select label="State" required error={errors.state?.message} {...register('state')}>
              <option value="">Select state</option>
              {STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </Select>
            <Input label="LGA" required placeholder="Your LGA" error={errors.lga?.message} {...register('lga')} />
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            <Select label="Urgency Level" required error={errors.urgency?.message} {...register('urgency')}>
              {URGENCY.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
            </Select>
            <Input label="Number of Beneficiaries" type="number" required
              placeholder="e.g. 200"
              error={errors.beneficiaries_count?.message}
              {...register('beneficiaries_count')} />
          </div>

          <Textarea label="Expected Impact Statement" required rows={3}
            placeholder="What specific, measurable outcome will this funding achieve? e.g. Provide safe learning environment for 200 students..."
            error={errors.impact_statement?.message} {...register('impact_statement')} />

          {/* File upload */}
          <div>
            <p style={{ fontSize:13, fontWeight:700, color:'var(--gray-700)', marginBottom:10 }}>
              Supporting Evidence
              <span style={{ fontSize:12, fontWeight:400, color:'var(--gray-400)', marginLeft:6 }}>Photos, videos, documents (max 10 files, 50MB each)</span>
            </p>

            <label style={{
              display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:10,
              padding:'32px 20px', border:`2px dashed ${files.length > 0 ? 'var(--brand)' : 'var(--gray-300)'}`,
              borderRadius:14, cursor:'pointer', background: files.length > 0 ? 'var(--brand-50)' : 'var(--gray-50)',
              transition:'all 150ms',
            }}>
              <input type="file" multiple accept="image/*,video/*,.pdf,.doc,.docx" onChange={handleFiles} style={{ display:'none' }} />
              <MdCloudUpload size={36} style={{ color: files.length > 0 ? 'var(--brand)' : 'var(--gray-400)' }} />
              <div style={{ textAlign:'center' }}>
                <p style={{ fontWeight:600, fontSize:14, color: files.length > 0 ? 'var(--brand)' : 'var(--gray-600)' }}>
                  {files.length > 0 ? `${files.length} file(s) selected` : 'Click to upload evidence'}
                </p>
                <p style={{ fontSize:12, color:'var(--gray-400)', marginTop:4 }}>
                  Drag and drop or click to browse
                </p>
              </div>
            </label>

            {files.length > 0 && (
              <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginTop:12 }}>
                {files.map((f, i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:6, background:'var(--gray-100)', borderRadius:8, padding:'6px 12px', fontSize:12, color:'var(--gray-700)' }}>
                    <span>{f.name.length > 24 ? f.name.slice(0,22)+'…' : f.name}</span>
                    <button type="button" onClick={() => removeFile(i)} style={{ display:'flex', color:'var(--gray-400)', marginLeft:2 }}>
                      <MdClose size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Declaration */}
          <div style={{ background:'var(--warning-50)', border:'1px solid #FDE68A', borderRadius:14, padding:'16px 20px' }}>
            <p style={{ fontWeight:700, fontSize:14, color:'var(--warning)', marginBottom:8 }}>⚠️ Declaration</p>
            <p style={{ fontSize:13, color:'var(--gray-600)', lineHeight:1.7 }}>
              By submitting this request, I confirm that all information provided is accurate and truthful.
              I understand that false or misleading information will result in immediate rejection and possible account suspension.
              I agree to cooperate fully with the verification team.
            </p>
          </div>

          <div style={{ display:'flex', gap:12, paddingTop:8 }}>
            <Button type="button" variant="ghost" size="lg" onClick={() => navigate(-1)} style={{ flex:1 }}>Cancel</Button>
            <Button type="submit" loading={loading} size="lg" style={{ flex:2 }}>Submit Request for Verification</Button>
          </div>
        </form>
      </div>
    </>
  );
}