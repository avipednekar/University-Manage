import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar isOpen={sidebarOpen} />
      <div style={{ flex: 1, marginLeft: sidebarOpen ? '250px' : '70px', transition: 'margin-left 0.3s' }}>
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div style={{ padding: '24px' }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;