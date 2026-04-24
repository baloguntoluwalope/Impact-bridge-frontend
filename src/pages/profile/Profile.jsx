import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { MdEdit, MdCameraAlt, MdLock, MdSave } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';
import Button   from '../../components/common/Button';
import Input    from '../../components/common/Input';
import Alert    from '../../components/common/Alert';
import Avatar   from '../../components/common/Avatar';
import { STATES } from '../../utils/constants';

const profileSchema = yup.object({
  first_name: yup.string().min(2).required('First name required'),
  last_name:  yup.string().min(2).required('Last name required'),
  phone:      yup.string().required('Phone required'),
  state:      yup.string().required('State required'),
  lga:        yup.string().required('LGA required'),
  bio:        yup.string().max(300),
});

const pwSchema = yup.object({
  current_password: yup.string().required('Current password required'),
  new_password:     yup.string().min(8,'At least 8 characters').required('New password required'),
  confirm:          yup.string().oneOf([yup.ref('new_password')], 'Passwords do not match').required(),
});

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [tab,         setTab]        = useState('profile');
  const [profileLoad, setProfileLoad]= useState(false);
  const [pwLoad,      setPwLoad]     = useState(false);
  const [profileErr,  setProfileErr] = useState('');
  const [pwErr,       setPwErr]      = useState('');
  const [avatarLoad,  setAvatarLoad] = useState(false);

  const fullName = `${user?.first_name || ''} ${user?.last_name || ''}`.trim();

  const { register: regP, handleSubmit: handleP, formState:{ errors:errP } } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      first_name: user?.first_name || '',
      last_name:  user?.last_name  || '',
      phone:      user?.phone      || '',
      state:      user?.state      || '',
      lga:        user?.lga        || '',
      bio:        user?.bio        || '',
    },
  });

  const { register: regW, handleSubmit: handleW, reset: resetW, formState:{ errors:errW } } = useForm({
    resolver: yupResolver(pwSchema),
  });

  const onProfileSave = async data => {
    setProfileLoad(true); setProfileErr('');
    try {
      const updated = await authService.updateProfile(data);
      updateUser(updated);
      toast.success('Profile updated successfully!');
    } catch (e) { setProfileErr(e?.response?.data?.message || 'Update failed'); }
    finally   { setProfileLoad(false); }
  };

  const onPwSave = async data => {
    setPwLoad(true); setPwErr('');
    try {
      await authService.changePassword(data.current_password, data.new_password);
      toast.success('Password changed successfully!');
      resetW();
    } catch (e) { setPwErr(e?.response?.data?.message || 'Password change failed'); }
    finally   { setPwLoad(false); }
  };

  const onAvatarChange = async e => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarLoad(true);
    try {
      const res = await authService.uploadAvatar(file);
      updateUser({ avatar: res.avatar });
      toast.success('Profile photo updated!');
    } catch { toast.error('Failed to upload photo'); }
    finally { setAvatarLoad(false); }
  };

  const Tab = ({ name, icon, label }) => (
    <button onClick={() => setTab(name)} style={{
      display:'flex', alignItems:'center', gap:8, padding:'10px 18px',
      borderRadius:10, fontSize:13, fontWeight:600, cursor:'pointer',
      border:'none', transition:'all 150ms', textAlign:'left', width:'100%',
      background: tab===name ? '#FFF4EE' : 'transparent',
      color:      tab===name ? '#E85D04' : '#475569',
    }}>
      <span style={{ fontSize:18 }}>{icon}</span>
      {label}
    </button>
  );

  return (
    <>
      <Helmet><title>My Profile — Impact Bridge</title></Helmet>

      <div style={{ display:'grid', gridTemplateColumns:'240px 1fr', gap:32, alignItems:'start' }}
        className="profile-grid">

        {/* Left sidebar */}
        <div>
          {/* Avatar card */}
          <div style={{ background:'#fff', border:'1px solid #E2E8F0', borderRadius:20, padding:24, textAlign:'center', marginBottom:16 }}>
            <div style={{ position:'relative', display:'inline-block', marginBottom:16 }}>
              <Avatar src={user?.avatar} name={fullName} size={80} />
              <label style={{
                position:'absolute', bottom:-4, right:-4,
                width:30, height:30, borderRadius:'50%',
                background:'#E85D04', color:'#fff',
                display:'flex', alignItems:'center', justifyContent:'center',
                cursor:'pointer', border:'2px solid #fff', fontSize:15,
              }}>
                {avatarLoad ? '…' : <MdCameraAlt size={15} />}
                <input type="file" accept="image/*" onChange={onAvatarChange} style={{ display:'none' }} />
              </label>
            </div>
            <p style={{ fontWeight:700, fontSize:15, color:'#0F172A', marginBottom:4 }}>{fullName || 'Your Name'}</p>
            <p style={{ fontSize:12, color:'#94A3B8' }}>{user?.email}</p>
            <span style={{
              display:'inline-block', marginTop:10, fontSize:10, fontWeight:700,
              color:'#E85D04', background:'#FFF4EE', padding:'3px 10px',
              borderRadius:6, textTransform:'uppercase', letterSpacing:'.06em',
            }}>
              {user?.role?.replace(/_/g,' ')}
            </span>
          </div>

          {/* Navigation */}
          <div style={{ background:'#fff', border:'1px solid #E2E8F0', borderRadius:16, padding:'8px 0', overflow:'hidden' }}>
            <div style={{ padding:'0 8px', display:'flex', flexDirection:'column', gap:2 }}>
              <Tab name="profile"  icon="👤" label="Profile Info"    />
              <Tab name="password" icon="🔐" label="Change Password" />
            </div>
          </div>
        </div>

        {/* Right content */}
        <div style={{ background:'#fff', border:'1px solid #E2E8F0', borderRadius:20, padding:32 }}>

          {tab === 'profile' && (
            <>
              <div style={{ marginBottom:28 }}>
                <h2 style={{ fontSize:20, fontWeight:800, color:'#0F172A', marginBottom:6 }}>Profile Information</h2>
                <p style={{ fontSize:14, color:'#64748B' }}>Update your personal details and location.</p>
              </div>

              {profileErr && <div style={{ marginBottom:20 }}><Alert type="danger" message={profileErr} onClose={() => setProfileErr('')} /></div>}

              <form onSubmit={handleP(onProfileSave)} style={{ display:'flex', flexDirection:'column', gap:18 }}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                  <Input label="First Name" required placeholder="Amara" error={errP.first_name?.message} {...regP('first_name')} />
                  <Input label="Last Name"  required placeholder="Okafor" error={errP.last_name?.message} {...regP('last_name')} />
                </div>

                <Input label="Email Address" type="email" value={user?.email || ''} disabled
                  containerStyle={{ opacity:.65 }} hint="Email cannot be changed" />

                <Input label="Phone Number" required placeholder="08012345678"
                  error={errP.phone?.message} {...regP('phone')} />

                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                  <div>
                    <label style={{ fontSize:13, fontWeight:600, color:'#334155', display:'block', marginBottom:6 }}>
                      State <span style={{ color:'#EF4444' }}>*</span>
                    </label>
                    <select {...regP('state')} style={{ width:'100%', padding:'10px 36px 10px 14px', border:`1.5px solid ${errP.state ? '#EF4444' : '#E2E8F0'}`, borderRadius:10, fontSize:14, fontFamily:'inherit', outline:'none', cursor:'pointer', appearance:'none', background:`#fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2394A3B8' d='M6 8L1 3h10z'/%3E%3C/svg%3E") right 12px center no-repeat` }}>
                      <option value="">Select state</option>
                      {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {errP.state && <p style={{ fontSize:12, color:'#EF4444', marginTop:4 }}>{errP.state.message}</p>}
                  </div>
                  <Input label="LGA" required placeholder="Your LGA" error={errP.lga?.message} {...regP('lga')} />
                </div>

                <div>
                  <label style={{ fontSize:13, fontWeight:600, color:'#334155', display:'block', marginBottom:6 }}>Bio</label>
                  <textarea {...regP('bio')} rows={3} maxLength={300}
                    placeholder="Tell donors and partners about yourself or your organisation…"
                    style={{ width:'100%', padding:'10px 14px', border:'1.5px solid #E2E8F0', borderRadius:10, fontSize:14, fontFamily:'inherit', resize:'vertical', outline:'none', transition:'border 150ms' }}
                    onFocus={e => e.target.style.borderColor='#E85D04'}
                    onBlur={e  => e.target.style.borderColor='#E2E8F0'}
                  />
                  {errP.bio && <p style={{ fontSize:12, color:'#EF4444', marginTop:4 }}>{errP.bio.message}</p>}
                </div>

                <div style={{ display:'flex', justifyContent:'flex-end', paddingTop:8 }}>
                  <Button type="submit" loading={profileLoad} size="lg" icon={<MdSave size={17} />}>
                    Save Changes
                  </Button>
                </div>
              </form>
            </>
          )}

          {tab === 'password' && (
            <>
              <div style={{ marginBottom:28 }}>
                <h2 style={{ fontSize:20, fontWeight:800, color:'#0F172A', marginBottom:6 }}>Change Password</h2>
                <p style={{ fontSize:14, color:'#64748B' }}>Choose a strong password to keep your account secure.</p>
              </div>

              {pwErr && <div style={{ marginBottom:20 }}><Alert type="danger" message={pwErr} onClose={() => setPwErr('')} /></div>}

              <form onSubmit={handleW(onPwSave)} style={{ display:'flex', flexDirection:'column', gap:18, maxWidth:440 }}>
                <Input label="Current Password" type="password" required
                  error={errW.current_password?.message} {...regW('current_password')} />
                <Input label="New Password" type="password" required
                  hint="Min 8 chars with uppercase, lowercase, number and special character"
                  error={errW.new_password?.message} {...regW('new_password')} />
                <Input label="Confirm New Password" type="password" required
                  error={errW.confirm?.message} {...regW('confirm')} />
                <div style={{ display:'flex', justifyContent:'flex-end', paddingTop:8 }}>
                  <Button type="submit" loading={pwLoad} size="lg" icon={<MdLock size={17} />}>
                    Update Password
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>

      <style>{`
        @media(max-width:768px){
          .profile-grid { grid-template-columns:1fr !important; }
        }
      `}</style>
    </>
  );
}