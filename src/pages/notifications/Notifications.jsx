import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNotifications } from '../../context/NotificationContext';
import { Spinner } from '../../components/common/Loader';
import Button from '../../components/common/Button';
import Empty  from '../../components/common/Empty';
import { ago } from '../../utils/helpers';

const NOTIF_ICONS = {
  payment:         '💰',
  verification:    '✅',
  rejection:       '❌',
  info:            '📋',
  progress:        '📊',
  broadcast:       '📢',
  fraud:           '🚨',
};

export default function Notifications() {
  const { items, unread, loading, markRead, markAll } = useNotifications();

  return (
    <>
      <Helmet><title>Notifications — Impact Bridge</title></Helmet>

      <div style={{ maxWidth:680, margin:'0 auto' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:28 }}>
          <div>
            <h1 style={{ fontSize:26, fontWeight:800, color:'#0F172A', letterSpacing:'-.5px', marginBottom:6 }}>
              Notifications
            </h1>
            <p style={{ fontSize:14, color:'#64748B' }}>
              {unread > 0 ? `${unread} unread notification${unread > 1 ? 's' : ''}` : 'All caught up!'}
            </p>
          </div>
          {unread > 0 && (
            <Button variant="ghost" size="sm" onClick={markAll}>
              Mark all as read
            </Button>
          )}
        </div>

        {loading && items.length === 0 ? (
          <div style={{ display:'flex', justifyContent:'center', padding:'60px 0' }}>
            <Spinner size={32} />
          </div>
        ) : items.length > 0 ? (
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {items.map(notif => (
              <div
                key={notif._id}
                onClick={() => !notif.is_read && markRead(notif._id)}
                style={{
                  display:'flex', alignItems:'flex-start', gap:16,
                  background: notif.is_read ? '#fff' : '#FFF4EE',
                  border:`1px solid ${notif.is_read ? '#E2E8F0' : 'rgba(232,93,4,.15)'}`,
                  borderRadius:14, padding:'16px 20px',
                  cursor: notif.is_read ? 'default' : 'pointer',
                  transition:'all 150ms',
                }}
                onMouseEnter={e => { if (!notif.is_read) e.currentTarget.style.boxShadow='0 4px 16px rgba(232,93,4,.1)'; }}
                onMouseLeave={e => e.currentTarget.style.boxShadow='none'}
              >
                {/* Icon */}
                <div style={{
                  width:44, height:44, borderRadius:12, flexShrink:0,
                  background: notif.is_read ? '#F1F5F9' : 'rgba(232,93,4,.1)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:22,
                }}>
                  {NOTIF_ICONS[notif.type] || '🔔'}
                </div>

                {/* Content */}
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontWeight: notif.is_read ? 500 : 700, fontSize:14, color:'#0F172A', marginBottom:4, lineHeight:1.4 }}>
                    {notif.title}
                  </p>
                  <p style={{ fontSize:13, color:'#64748B', lineHeight:1.6 }}>{notif.body}</p>
                  <p style={{ fontSize:11, color:'#94A3B8', marginTop:6, fontWeight:500 }}>{ago(notif.created_at)}</p>
                </div>

                {/* Unread dot */}
                {!notif.is_read && (
                  <div style={{ width:9, height:9, borderRadius:'50%', background:'#E85D04', flexShrink:0, marginTop:4 }} />
                )}
              </div>
            ))}
          </div>
        ) : (
          <Empty
            icon="🔔"
            title="No notifications yet"
            message="You'll receive updates about your requests, donations, and verification status here."
          />
        )}
      </div>
    </>
  );
}