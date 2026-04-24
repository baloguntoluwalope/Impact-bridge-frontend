import api from './api';
import { setTokens, setUser, clearAuth } from '../utils/helpers';

export default {
  register:       d    => api.post('/auth/register', d).then(r => r.data),
  verifyEmail:    (e,o)=> api.post('/auth/verify-email', { email:e, otp:o, type:'email_verification' }).then(r => r.data),
  resendOTP:      e    => api.post('/auth/resend-otp', { email:e, type:'email_verification' }).then(r => r.data),
  forgotPassword: e    => api.post('/auth/forgot-password', { email:e }).then(r => r.data),
  resetPassword:  (t,p)=> api.post('/auth/reset-password', { token:t, password:p }).then(r => r.data),

  login: async ({ email, password }) => {
    const { data } = await api.post('/auth/login', { email, password });
    const { accessToken, refreshToken, user } = data.data;
    setTokens(accessToken, refreshToken);
    setUser(user);
    return user;
  },

  logout: async () => { try { await api.post('/auth/logout'); } catch {} clearAuth(); },

  getProfile:    ()  => api.get('/users/profile').then(r => r.data.data),
  updateProfile: d   => api.patch('/users/profile', d).then(r => r.data.data),
  uploadAvatar: file => {
    const fd = new FormData(); fd.append('avatar', file);
    return api.post('/users/avatar', fd, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data.data);
  },
  changePassword: (cur, next) => api.patch('/users/change-password', { current_password:cur, new_password:next }).then(r => r.data),
};