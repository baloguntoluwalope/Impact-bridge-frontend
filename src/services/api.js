import axios from 'axios';
import { getToken, getRefresh, setTokens, clearAuth } from '../utils/helpers';

// 1. Unified safety check for environment variables
const env = typeof process !== 'undefined' ? process.env : import.meta.env || {};
const BASE = env.REACT_APP_API_URL || env.VITE_API_URL || 'http://localhost:5000/api/v1';

console.log('[API] Base URL:', BASE);

const api = axios.create({
  baseURL: BASE,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// 2. Attach token to every request
api.interceptors.request.use(cfg => {
  const t = getToken();
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
}, err => Promise.reject(err));

// 3. Handle 401 Unauthorized + Token Refresh Logic
let refreshing = false;
let queue      = [];

const drain = (err, token) => {
  queue.forEach(p => err ? p.reject(err) : p.resolve(token));
  queue = [];
};

api.interceptors.response.use(
  res => res,
  async err => {
    const status = err.response?.status;
    const orig   = err.config;

    // Log errors for debugging
    console.error('[API] Error:', err.config?.method?.toUpperCase(), err.config?.url, status, err.response?.data?.message || err.message);

    // If not a 401 or already retried, just fail
    if (status !== 401 || orig._retry) return Promise.reject(err);

    // If we're already refreshing, queue this request
    if (refreshing) {
      return new Promise((resolve, reject) => queue.push({ resolve, reject }))
        .then(token => { 
          orig.headers.Authorization = `Bearer ${token}`; 
          return api(orig); 
        });
    }

    orig._retry = true;
    refreshing  = true;
    const ref   = getRefresh();

    // If no refresh token exists, boot to login
    if (!ref) {
      clearAuth();
      if (window.location.pathname !== '/login') window.location.replace('/login');
      return Promise.reject(err);
    }

    try {
      // Use standard axios here to avoid the interceptor loop
      const { data } = await axios.post(`${BASE}/auth/refresh`, { refresh_token: ref });
      const { accessToken, refreshToken } = data.data;
      
      setTokens(accessToken, refreshToken);
      
      // Update the default for future requests
      api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
      
      drain(null, accessToken);
      
      // Retry the original failed request
      orig.headers.Authorization = `Bearer ${accessToken}`;
      return api(orig);
    } catch (e) {
      drain(e);
      clearAuth();
      if (window.location.pathname !== '/login') window.location.replace('/login');
      return Promise.reject(e);
    } finally {
      refreshing = false;
    }
  }
);

export default api;



// import axios from 'axios';
// import { getToken, getRefresh, setTokens, clearAuth } from '../utils/helpers';

// const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

// console.log('[API] Base URL:', BASE);

// const api = axios.create({
//   baseURL: BASE,
//   timeout: 30000,
//   headers: { 'Content-Type': 'application/json' },
// });

// // Attach token
// api.interceptors.request.use(cfg => {
//   const t = getToken();
//   if (t) cfg.headers.Authorization = `Bearer ${t}`;
//   return cfg;
// }, err => Promise.reject(err));

// // Handle 401 + token refresh
// let refreshing = false;
// let queue      = [];

// const drain = (err, token) => {
//   queue.forEach(p => err ? p.reject(err) : p.resolve(token));
//   queue = [];
// };

// api.interceptors.response.use(
//   res => res,
//   async err => {
//     const status = err.response?.status;
//     const orig   = err.config;

//     // Log all errors for debugging
//     console.error('[API] Error:', err.config?.method?.toUpperCase(), err.config?.url, status, err.response?.data?.message || err.message);

//     if (status !== 401 || orig._retry) return Promise.reject(err);

//     if (refreshing) {
//       return new Promise((resolve, reject) => queue.push({ resolve, reject }))
//         .then(token => { orig.headers.Authorization = `Bearer ${token}`; return api(orig); });
//     }

//     orig._retry = true;
//     refreshing  = true;
//     const ref   = getRefresh();

//     if (!ref) {
//       clearAuth();
//       window.location.replace('/login');
//       return Promise.reject(err);
//     }

//     try {
//       const { data } = await axios.post(`${BASE}/auth/refresh`, { refresh_token: ref });
//       const { accessToken, refreshToken } = data.data;
//       setTokens(accessToken, refreshToken);
//       api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
//       drain(null, accessToken);
//       orig.headers.Authorization = `Bearer ${accessToken}`;
//       return api(orig);
//     } catch (e) {
//       drain(e);
//       clearAuth();
//       window.location.replace('/login');
//       return Promise.reject(e);
//     } finally {
//       refreshing = false;
//     }
//   }
// );

// export default api;