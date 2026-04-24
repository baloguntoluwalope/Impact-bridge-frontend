import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar  from './Navbar';
import Sidebar from './Sidebar';

export default function DashboardLayout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f4f6f9' }}>
      <Navbar />
      <div style={{ display: 'flex', flex: 1, alignItems: 'flex-start' }}>
        <Sidebar />
        <main style={{ flex: 1, minWidth: 0, overflowX: 'hidden' }}>
          <div className="dash-content" style={{ padding: '28px 32px', maxWidth: 1200, margin: '0 auto' }}>
            <Outlet />
          </div>
        </main>
      </div>
      <style>{`@media(max-width:768px){.dash-content{padding:20px 16px!important}}`}</style>
    </div>
  );
}