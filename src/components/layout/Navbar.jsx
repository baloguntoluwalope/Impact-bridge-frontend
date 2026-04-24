import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  MdMenu, MdClose, MdDashboard, MdLogout,
  MdPerson, MdNotifications, MdExpandMore,
} from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

const LINKS = [
  { to: '/requests', label: 'Browse Cases' },
  { to: '/projects', label: 'Projects' },
  { to: '/sdg',      label: 'SDG Goals' },
  { to: '/about',    label: 'About' },
  { to: '/contact',  label: 'Contact' },
];

const DASH_MAP = {
  super_admin:          '/admin/dashboard',
  ngo_partner:          '/ngo/dashboard',
  government_official:  '/government/dashboard',
};

export default function Navbar() {
  const { user, isAuth, logout } = useAuth();
  const { unread }               = useNotifications();
  const [scrolled,  setScrolled] = useState(false);
  const [mobile,    setMobile]   = useState(false);
  const [menu,      setMenu]     = useState(false);
  const ref = useRef();

  const dashLink = DASH_MAP[user?.role] || '/donor/dashboard';
  const name = user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : '';
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 4);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    const fn = e => { if (ref.current && !ref.current.contains(e.target)) setMenu(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  return (
    <>
      <header style={{
        position:      'sticky', top: 0, zIndex: 100,
        height:        'var(--nav-h)',
        background:    'rgba(255,255,255,.97)',
        backdropFilter:'blur(12px)',
        borderBottom:  `1px solid ${scrolled ? 'var(--slate-200)' : 'transparent'}`,
        boxShadow:     scrolled ? 'var(--shadow-sm)' : 'none',
        transition:    'all 200ms ease',
      }}>
        <div className="container" style={{ height: '100%', display: 'flex', alignItems: 'center', gap: 8 }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 9, marginRight: 16, flexShrink: 0 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg,#e85d04,#ff7a2f)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
              🌍
            </div>
            <span style={{ fontSize: 17, fontWeight: 800, color: '#0d0f14', letterSpacing: '-.4px' }}>
              Impact<span style={{ color: '#e85d04' }}>Bridge</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }} className="d-nav">
            {LINKS.map(l => (
              <NavLink key={l.to} to={l.to}
                style={({ isActive }) => ({
                  fontSize: 13, fontWeight: 600, padding: '6px 12px', borderRadius: 8,
                  color:      isActive ? '#e85d04' : '#475569',
                  background: isActive ? '#fff4ee' : 'transparent',
                  transition: 'all 140ms ease',
                })}
                onMouseEnter={e => { e.currentTarget.style.color = '#e85d04'; e.currentTarget.style.background = '#fff4ee'; }}
                onMouseLeave={e => {
                  if (!e.currentTarget.getAttribute('aria-current')) {
                    e.currentTarget.style.color      = '#475569';
                    e.currentTarget.style.background = 'transparent';
                  }
                }}>
                {l.label}
              </NavLink>
            ))}
          </nav>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto' }}>
            {isAuth ? (
              <>
                {/* Bell */}
                <Link to="/notifications" aria-label="Notifications" style={{
                  position: 'relative', width: 38, height: 38,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: 10, color: '#64748b', transition: 'all 140ms',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#e85d04'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b'; }}>
                  <MdNotifications size={20} />
                  {unread > 0 && (
                    <span style={{
                      position: 'absolute', top: 7, right: 7,
                      minWidth: 15, height: 15, padding: '0 3px',
                      background: '#ef4444', color: '#fff',
                      fontSize: 9, fontWeight: 800, borderRadius: 9999,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: '2px solid #fff',
                    }}>
                      {unread > 9 ? '9+' : unread}
                    </span>
                  )}
                </Link>

                {/* User dropdown */}
                <div ref={ref} style={{ position: 'relative' }}>
                  <button onClick={() => setMenu(p => !p)} style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '5px 10px 5px 5px', borderRadius: 10,
                    border: '1.5px solid var(--slate-200)',
                    background: menu ? '#f8fafc' : '#fff',
                    cursor: 'pointer', transition: 'all 140ms',
                  }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 8,
                      background: 'linear-gradient(135deg,#e85d04,#ff7a2f)',
                      color: '#fff', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: 11, fontWeight: 800,
                    }}>
                      {user?.avatar
                        ? <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} />
                        : initials}
                    </div>
                    <span className="d-nav" style={{ fontSize: 13, fontWeight: 600, color: '#334155' }}>
                      {user?.first_name}
                    </span>
                    <MdExpandMore size={15} style={{ color: '#94a3b8', transform: menu ? 'rotate(180deg)' : 'none', transition: 'transform 200ms', flexShrink: 0 }} />
                  </button>

                  {menu && (
                    <div style={{
                      position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                      minWidth: 210, background: '#fff',
                      border: '1px solid var(--slate-200)', borderRadius: 14,
                      boxShadow: 'var(--shadow-xl)', overflow: 'hidden', zIndex: 200,
                      animation: 'slideDown 150ms ease',
                    }}>
                      <div style={{ padding: '14px 16px', borderBottom: '1px solid #f1f5f9' }}>
                        <p style={{ fontWeight: 700, fontSize: 13, color: '#0d0f14' }}>{name}</p>
                        <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{user?.email}</p>
                        <span style={{
                          display: 'inline-block', marginTop: 7, fontSize: 10, fontWeight: 700,
                          color: '#e85d04', background: '#fff4ee',
                          padding: '2px 8px', borderRadius: 5,
                          textTransform: 'uppercase', letterSpacing: '.05em',
                        }}>
                          {user?.role?.replace(/_/g, ' ')}
                        </span>
                      </div>

                      {[
                        { to: dashLink,  icon: <MdDashboard size={14} />, label: 'Dashboard' },
                        { to: '/profile', icon: <MdPerson    size={14} />, label: 'My Profile' },
                      ].map(item => (
                        <Link key={item.to} to={item.to} onClick={() => setMenu(false)}
                          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', fontSize: 13, fontWeight: 600, color: '#334155', transition: 'all 120ms' }}
                          onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#e85d04'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#334155'; }}>
                          <span style={{ color: '#94a3b8' }}>{item.icon}</span>
                          {item.label}
                        </Link>
                      ))}

                      <div style={{ height: 1, background: '#f1f5f9', margin: '0 16px' }} />

                      <button onClick={() => { setMenu(false); logout(); }}
                        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', width: '100%', fontSize: 13, fontWeight: 600, color: '#ef4444', transition: 'background 120ms', cursor: 'pointer' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <MdLogout size={14} /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', gap: 8 }} className="d-nav">
                <Link to="/login" style={{
                  fontSize: 13, fontWeight: 600, color: '#475569',
                  padding: '7px 16px', borderRadius: 9, border: '1.5px solid var(--slate-200)',
                  transition: 'all 140ms',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#e85d04'; e.currentTarget.style.color = '#e85d04'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--slate-200)'; e.currentTarget.style.color = '#475569'; }}>
                  Sign In
                </Link>
                <Link to="/register" style={{
                  fontSize: 13, fontWeight: 700, color: '#fff',
                  padding: '7px 18px', borderRadius: 9, background: '#e85d04',
                  transition: 'all 140ms',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#c94d03'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#e85d04'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                  Get Started Free
                </Link>
              </div>
            )}

            <button className="m-btn" onClick={() => setMobile(p => !p)} style={{
              display: 'none', width: 38, height: 38,
              alignItems: 'center', justifyContent: 'center',
              borderRadius: 9, border: '1.5px solid var(--slate-200)',
              color: '#334155', transition: 'all 140ms',
            }}>
              {mobile ? <MdClose size={20} /> : <MdMenu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobile && (
        <div style={{
          position: 'fixed', top: 'var(--nav-h)', left: 0, right: 0, bottom: 0,
          background: '#fff', zIndex: 99,
          overflowY: 'auto', animation: 'slideDown 200ms ease',
          borderTop: '1px solid var(--slate-100)',
        }}>
          <div className="container" style={{ padding: '16px 0', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {LINKS.map(l => (
              <NavLink key={l.to} to={l.to} onClick={() => setMobile(false)}
                style={({ isActive }) => ({
                  display: 'block', padding: '12px 16px', fontSize: 15, fontWeight: 600,
                  color:      isActive ? '#e85d04' : '#334155',
                  background: isActive ? '#fff4ee' : 'transparent',
                  borderRadius: 10,
                })}>
                {l.label}
              </NavLink>
            ))}
            <div style={{ height: 1, background: '#f1f5f9', margin: '8px 0' }} />
            {isAuth ? (
              <>
                <Link to={dashLink} onClick={() => setMobile(false)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', fontSize: 15, fontWeight: 600, color: '#334155', borderRadius: 10 }}>
                  <MdDashboard size={18} /> Dashboard
                </Link>
                <button onClick={() => { setMobile(false); logout(); }}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', fontSize: 15, fontWeight: 600, color: '#ef4444', borderRadius: 10, width: '100%', textAlign: 'left' }}>
                  <MdLogout size={18} /> Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobile(false)}
                  style={{ display: 'block', padding: '12px 16px', textAlign: 'center', fontSize: 15, fontWeight: 600, color: '#334155', border: '1.5px solid var(--slate-200)', borderRadius: 10, margin: '0 16px' }}>
                  Sign In
                </Link>
                <Link to="/register" onClick={() => setMobile(false)}
                  style={{ display: 'block', padding: '12px 16px', textAlign: 'center', fontSize: 15, fontWeight: 700, color: '#fff', background: '#e85d04', borderRadius: 10, margin: '6px 16px 16px' }}>
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media(max-width:768px){
          .d-nav { display:none !important; }
          .m-btn { display:flex !important; }
        }
      `}</style>
    </>
  );
}