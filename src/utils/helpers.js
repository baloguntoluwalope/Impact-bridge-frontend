import { format, formatDistanceToNow, isValid } from 'date-fns';

export const currency = (amount = 0) => {
  if (amount === null || amount === undefined) return '₦0';
  return new Intl.NumberFormat('en-NG', {
    style: 'currency', currency: 'NGN',
    minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(Number(amount));
};

export const fmt = (n = 0) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
};

export const fmtDate = (date, pattern = 'MMM dd, yyyy') => {
  if (!date) return '';
  const d = new Date(date);
  return isValid(d) ? format(d, pattern) : '';
};

export const ago = (date) => {
  if (!date) return '';
  try { return formatDistanceToNow(new Date(date), { addSuffix: true }); }
  catch { return ''; }
};

export const pct = (raised = 0, needed = 0) =>
  !needed ? 0 : Math.min(Math.round((raised / needed) * 100), 100);

export const clip = (s = '', len = 120) =>
  s && s.length > len ? `${s.slice(0, len)}…` : s;

export const label = (slug = '') =>
  slug.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

export const initials = (name = '') => {
  if (!name) return 'U';
  return name.trim().split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

export const cx = (...c) => c.filter(Boolean).join(' ');

// Auth storage
export const getToken    = ()      => localStorage.getItem('ib_tok');
export const getRefresh  = ()      => localStorage.getItem('ib_ref');
export const getUser     = ()      => { try { return JSON.parse(localStorage.getItem('ib_usr') || 'null'); } catch { return null; } };
export const setTokens   = (a, r)  => { localStorage.setItem('ib_tok', a); if (r) localStorage.setItem('ib_ref', r); };
export const setUser     = u       => localStorage.setItem('ib_usr', JSON.stringify(u));
export const clearAuth   = ()      => ['ib_tok','ib_ref','ib_usr'].forEach(k => localStorage.removeItem(k));

export const waLink = (phone, msg) => `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;