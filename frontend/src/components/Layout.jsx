import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import './Layout.css';

function Layout({ children, onLogout, pageClassName = '' }) {
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);

  // Listen for sidebar state changes
  useEffect(() => {
    const handleSidebarToggle = (event) => {
      setIsSidebarMinimized(event.detail.isMinimized);
    };

    window.addEventListener('sidebarToggle', handleSidebarToggle);
    
    return () => {
      window.removeEventListener('sidebarToggle', handleSidebarToggle);
    };
  }, []);

  return (
    <div className={`app-layout ${pageClassName}`}>
      <Sidebar />
      <div className={`main-content ${isSidebarMinimized ? 'sidebar-minimized' : ''}`}>
        <Header onLogout={onLogout} />
        <main className="content-wrapper">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;