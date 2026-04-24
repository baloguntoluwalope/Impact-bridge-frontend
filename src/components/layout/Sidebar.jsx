import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  MdDashboard, MdAssignment, MdVerified, MdPayment,
  MdPeople, MdBarChart, MdFolder, MdPublic,
  MdSettings, MdBusiness, MdSchool, MdAdd,
  MdNotificationsNone, MdAccountBalanceWallet,
  MdGavel, MdAnalytics,
} from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';

// ─── Menu definitions per role ────────────────────────────────────
const MENUS = {
  super_admin: [
    {
      title: 'Overview',
      links: [
        { to: '/admin/dashboard',        label: 'Dashboard',         Icon: MdDashboard },
      ],
    },
    {
      title: 'Verification',
      links: [
        { to: '/admin/verify/requests',  label: 'Verify Requests',   Icon: MdVerified },
        { to: '/admin/verify/projects',  label: 'Verify Projects',   Icon: MdFolder },
      ],
    },
    {
      title: 'Management',
      links: [
        { to: '/admin/users',            label: 'Users',             Icon: MdPeople },
        { to: '/admin/payments',         label: 'Payments',          Icon: MdPayment },
        { to: '/admin/ngos',             label: 'NGOs',              Icon: MdBusiness },
      ],
    },
    {
      title: 'Reports',
      links: [
        { to: '/admin/analytics',        label: 'Analytics',         Icon: MdAnalytics },
        { to: '/admin/sdg',              label: 'SDG Content',       Icon: MdSchool },
        { to: '/admin/audit-logs',       label: 'Audit Logs',        Icon: MdGavel },
      ],
    },
    {
      title: 'Account',
      links: [
        { to: '/notifications',          label: 'Notifications',     Icon: MdNotificationsNone },
        { to: '/profile',                label: 'Profile',           Icon: MdSettings },
      ],
    },
  ],

  ngo_partner: [
    {
      title: 'Overview',
      links: [
        { to: '/ngo/dashboard',          label: 'Dashboard',         Icon: MdDashboard },
        { to: '/admin/verify/requests',  label: 'Verify Requests',   Icon: MdVerified },
      ],
    },
    {
      title: 'Account',
      links: [
        { to: '/notifications',          label: 'Notifications',     Icon: MdNotificationsNone },
        { to: '/profile',                label: 'Profile',           Icon: MdSettings },
      ],
    },
  ],

  government_official: [
    {
      title: 'Analytics',
      links: [
        { to: '/government/dashboard',   label: 'SDG Dashboard',     Icon: MdPublic },
      ],
    },
    {
      title: 'Account',
      links: [
        { to: '/notifications',          label: 'Notifications',     Icon: MdNotificationsNone },
        { to: '/profile',                label: 'Profile',           Icon: MdSettings },
      ],
    },
  ],

  donor: [
    {
      title: 'My Account',
      links: [
        { to: '/donor/dashboard',        label: 'Dashboard',         Icon: MdDashboard },
        { to: '/donor/donations',        label: 'My Donations',      Icon: MdPayment },
        { to: '/donor/impact',           label: 'My Impact',         Icon: MdBarChart },
      ],
    },
    {
      title: 'Explore',
      links: [
        { to: '/requests',               label: 'Browse Cases',      Icon: MdPublic },
        { to: '/projects',               label: 'Projects',          Icon: MdFolder },
        { to: '/notifications',          label: 'Notifications',     Icon: MdNotificationsNone },
        { to: '/profile',                label: 'Profile',           Icon: MdSettings },
      ],
    },
  ],

  corporate: [
    {
      title: 'CSR Dashboard',
      links: [
        { to: '/corporate/dashboard',    label: 'Dashboard',         Icon: MdDashboard },
        { to: '/donor/donations',        label: 'Donations',         Icon: MdPayment },
        { to: '/donor/impact',           label: 'Impact Report',     Icon: MdBarChart },
      ],
    },
    {
      title: 'Explore',
      links: [
        { to: '/requests',               label: 'Browse Cases',      Icon: MdPublic },
        { to: '/notifications',          label: 'Notifications',     Icon: MdNotificationsNone },
        { to: '/profile',                label: 'Profile',           Icon: MdSettings },
      ],
    },
  ],

  requester: [
    {
      title: 'My Requests',
      links: [
        { to: '/my-requests',            label: 'Dashboard',         Icon: MdDashboard },
        { to: '/submit-request',         label: 'Submit Request',    Icon: MdAdd },
      ],
    },
    {
      title: 'Account',
      links: [
        { to: '/notifications',          label: 'Notifications',     Icon: MdNotificationsNone },
        { to: '/profile',                label: 'Profile',           Icon: MdSettings },
      ],
    },
  ],
};

const REQUESTER_ROLES = ['individual', 'student', 'school_admin', 'community_leader'];

function getMenuKey(role) {
  if (REQUESTER_ROLES.includes(role)) return 'requester';
  if (MENUS[role]) return role;
  return 'donor';
}

// ─── Single nav link ─────────────────────────────────────────────
function SideLink({ to, label, Icon }) {
  return (
    <NavLink
      to={to}
      end={to === '/admin/dashboard' || to === '/donor/dashboard' || to === '/my-requests' || to === '/ngo/dashboard' || to === '/government/dashboard' || to === '/corporate/dashboard'}
      style={({ isActive }) => ({
        display:        'flex',
        alignItems:     'center',
        gap:            10,
        padding:        '8px 10px',
        borderRadius:   9,
        fontSize:       13,
        fontWeight:     isActive ? 700 : 500,
        color:          isActive ? '#e85d04' : 'rgba(255,255,255,.55)',
        background:     isActive ? 'rgba(232,93,4,.15)' : 'transparent',
        border:         `1px solid ${isActive ? 'rgba(232,93,4,.2)' : 'transparent'}`,
        transition:     'all 130ms ease',
        textDecoration: 'none',
        whiteSpace:     'nowrap',
        overflow:       'hidden',
      })}
      onMouseEnter={e => {
        if (e.currentTarget.style.background.includes('rgba(232,93,4')) return;
        e.currentTarget.style.background = 'rgba(255,255,255,.07)';
        e.currentTarget.style.color      = 'rgba(255,255,255,.9)';
      }}
      onMouseLeave={e => {
        if (e.currentTarget.style.background.includes('rgba(232,93,4')) return;
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.color      = 'rgba(255,255,255,.55)';
      }}
    >
      <Icon size={17} style={{ flexShrink: 0 }} />
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>
    </NavLink>
  );
}

// ─── Sidebar ─────────────────────────────────────────────────────
export default function Sidebar() {
  const { user } = useAuth();
  const role     = user?.role || 'donor';
  const menuKey  = getMenuKey(role);
  const groups   = MENUS[menuKey] || MENUS.donor;

  const initials = user
    ? `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase()
    : 'U';

  return (
    <aside
      className="ib-sidebar"
      style={{
        width:         240,
        minHeight:     'calc(100vh - 64px)',
        position:      'sticky',
        top:           64,
        alignSelf:     'flex-start',
        background:    '#0f172a',
        borderRight:   '1px solid rgba(255,255,255,.06)',
        display:       'flex',
        flexDirection: 'column',
        flexShrink:    0,
        overflowY:     'auto',
        overflowX:     'hidden',
      }}
    >
      {/* User card */}
      <div style={{
        padding:      '20px 14px 16px',
        borderBottom: '1px solid rgba(255,255,255,.06)',
        flexShrink:   0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Avatar */}
          <div style={{
            width:          36,
            height:         36,
            borderRadius:   10,
            flexShrink:     0,
            background:     user?.avatar ? 'transparent' : 'linear-gradient(135deg,#e85d04,#ff7a2f)',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            fontSize:       13,
            fontWeight:     800,
            color:          '#fff',
            overflow:       'hidden',
          }}>
            {user?.avatar
              ? <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : initials}
          </div>

          {/* Name + role */}
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.first_name} {user?.last_name}
            </p>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,.35)', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 600, marginTop: 1 }}>
              {role.replace(/_/g, ' ')}
            </p>
          </div>
        </div>
      </div>

      {/* Nav groups */}
      <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 22 }}>
        {groups.map((group) => (
          <div key={group.title}>
            <p style={{
              fontSize:      9,
              fontWeight:    700,
              color:         'rgba(255,255,255,.2)',
              textTransform: 'uppercase',
              letterSpacing: '.12em',
              padding:       '0 8px',
              marginBottom:  6,
            }}>
              {group.title}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {group.links.map(link => (
                <SideLink key={link.to} {...link} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Quick browse footer */}
      <div style={{ padding: '12px 10px', borderTop: '1px solid rgba(255,255,255,.06)', flexShrink: 0 }}>
        <Link to="/requests" style={{
          display:        'flex',
          alignItems:     'center',
          gap:            8,
          padding:        '8px 10px',
          borderRadius:   9,
          fontSize:       12,
          fontWeight:     600,
          color:          '#e85d04',
          background:     'rgba(232,93,4,.1)',
          border:         '1px solid rgba(232,93,4,.2)',
          transition:     'background 130ms',
          textDecoration: 'none',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(232,93,4,.18)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(232,93,4,.1)'}>
          <MdPublic size={15} />
          Browse Live Cases
        </Link>
      </div>

      <style>{`
        @media (max-width: 1024px) { .ib-sidebar { display: none !important; } }
      `}</style>
    </aside>
  );
}