import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import authService from '../services/authService';
import { getToken, getUser, setUser as storeUser, clearAuth } from '../utils/helpers';

const AuthContext = createContext(null);

// Every role maps to exactly one dashboard path
const ROLE_DASHBOARD = {
  super_admin:          '/admin/dashboard',
  ngo_partner:          '/ngo/dashboard',
  government_official:  '/government/dashboard',
  donor:                '/donor/dashboard',
  corporate:            '/corporate/dashboard',
  individual:           '/my-requests',
  student:              '/my-requests',
  school_admin:         '/my-requests',
  community_leader:     '/my-requests',
};

const REQUESTER_ROLES = new Set(['individual', 'student', 'school_admin', 'community_leader']);
const DONOR_ROLES     = new Set(['donor', 'corporate']);

export function AuthProvider({ children }) {
  const [user,  setUser]  = useState(() => getUser());
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();

  // Boot — validate stored token
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!getToken()) { setReady(true); return; }
      try {
        const profile = await authService.getProfile();
        if (!cancelled) { setUser(profile); storeUser(profile); }
      } catch {
        clearAuth();
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const getDashboard = useCallback((role) => ROLE_DASHBOARD[role] || '/donor/dashboard', []);

  const login = useCallback(async (email, password) => {
    const u = await authService.login({ email, password });
    setUser(u);
    const dest = ROLE_DASHBOARD[u.role] || '/donor/dashboard';
    toast.success(`Welcome back, ${u.first_name}! 👋`);
    navigate(dest, { replace: true });
    return u;
  }, [navigate]);

  const register = useCallback(async (data) => {
    const res = await authService.register(data);
    toast.success('Account created! Please verify your email.');
    navigate(`/verify-email?email=${encodeURIComponent(data.email)}`);
    return res;
  }, [navigate]);

  const logout = useCallback(async () => {
    try { await authService.logout(); } catch {}
    clearAuth();
    setUser(null);
    toast.success('Signed out.');
    navigate('/login', { replace: true });
  }, [navigate]);

  const updateUser = useCallback(patch => {
    setUser(prev => {
      const next = { ...prev, ...patch };
      storeUser(next);
      return next;
    });
  }, []);

  const isAuth      = Boolean(user && getToken());
  const isAdmin     = user?.role === 'super_admin';
  const isRequester = REQUESTER_ROLES.has(user?.role);
  const isDonor     = DONOR_ROLES.has(user?.role);
  const hasRole     = (...roles) => roles.includes(user?.role);

  return (
    <AuthContext.Provider value={{
      user, ready, isAuth, isAdmin, isRequester, isDonor,
      getDashboard, hasRole,
      login, register, logout, updateUser,
      REQUESTER_ROLES: [...REQUESTER_ROLES],
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};