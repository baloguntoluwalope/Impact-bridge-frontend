import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import notifService from '../services/notificationService';
import { useAuth } from './AuthContext';

const NC = createContext(null);

export function NotificationProvider({ children }) {
  const { isAuth } = useAuth();
  const [items,   setItems]   = useState([]);
  const [unread,  setUnread]  = useState(0);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef(null);

  const fetch = useCallback(async () => {
    if (!isAuth) { setItems([]); setUnread(0); return; }
    setLoading(true);
    try {
      const d = await notifService.getAll({ limit: 30 });
      // Handle both response shapes
      const list  = d?.notifications || d?.data || [];
      const count = d?.unread_count  ?? list.filter(n => !n.is_read).length;
      setItems(list);
      setUnread(count);
    } catch (err) {
      console.warn('Notifications fetch error:', err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuth]);

  useEffect(() => {
    fetch();
    timerRef.current = setInterval(fetch, 30000);
    return () => clearInterval(timerRef.current);
  }, [fetch]);

  const markRead = useCallback(async (id) => {
    try {
      await notifService.markRead(id);
      setItems(p => p.map(n => n._id === id ? { ...n, is_read: true } : n));
      setUnread(p => Math.max(0, p - 1));
    } catch {}
  }, []);

  const markAll = useCallback(async () => {
    try {
      await notifService.markAll();
      setItems(p => p.map(n => ({ ...n, is_read: true })));
      setUnread(0);
    } catch {}
  }, []);

  return (
    <NC.Provider value={{ items, unread, loading, markRead, markAll, refetch: fetch }}>
      {children}
    </NC.Provider>
  );
}

export const useNotifications = () => {
  const ctx = useContext(NC);
  if (!ctx) throw new Error('useNotifications must be inside NotificationProvider');
  return ctx;
};