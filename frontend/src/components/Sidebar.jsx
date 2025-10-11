import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Sidebar.css';

function Sidebar() {
  const location = useLocation();
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems = [
    { path: '/beranda', icon: 'bi-speedometer2', label: 'Beranda' },
    { path: '/daftar-pemasangan', icon: 'bi-clipboard-data', label: 'Daftar Pemasangan' },
    { path: '/manajemen-akun', icon: 'bi-person-gear', label: 'Manajemen Akun' }
  ];

  const toggleSidebar = () => {
    const newMinimizedState = !isMinimized;
    setIsMinimized(newMinimizedState);
    
    // Dispatch custom event to notify Layout component
    window.dispatchEvent(new CustomEvent('sidebarToggle', {
      detail: { isMinimized: newMinimizedState }
    }));
  };

  const toggleMobileSidebar = () => {
    const newState = !isMobileOpen;
    setIsMobileOpen(newState);
    
    if (newState) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
    }
  };

  const handleMenuClick = () => {
    if (window.innerWidth <= 768) {
      setIsMobileOpen(false);
      // Remove body scroll lock
      document.body.classList.remove('sidebar-open');
    }
  };

  // Handle escape key to close mobile sidebar
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && isMobileOpen) {
        setIsMobileOpen(false);
        document.body.classList.remove('sidebar-open');
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isMobileOpen]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isMobileOpen) {
        setIsMobileOpen(false);
        document.body.classList.remove('sidebar-open');
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobileOpen]);

  // Handle body scroll lock for mobile
  useEffect(() => {
    if (isMobileOpen) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('sidebar-open');
    };
  }, [isMobileOpen]);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button className="mobile-toggle-btn" onClick={toggleMobileSidebar}>
        <i className={`bi ${isMobileOpen ? 'bi-x-lg' : 'bi-list'}`}></i>
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className={`mobile-overlay ${isMobileOpen ? 'show' : ''}`} 
          onClick={toggleMobileSidebar}
          onTouchStart={toggleMobileSidebar}
        ></div>
      )}

        <div className={`sidebar ${isMinimized ? 'minimized' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}>
          <div className="sidebar-header">
            <div className="logo-wrapper">
          <img src="/image/logo btd.png" alt="" className="sidebar-logo" />
          {!isMinimized && <h3 className="sidebar-title">BTD System</h3>}
            </div>
          </div>

          <nav className="sidebar-menu">
            {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={handleMenuClick}
            title={isMinimized ? item.label : ''}
          >
            <i className={`bi ${item.icon} menu-icon`}></i>
            {!isMinimized && <span className="menu-label">{item.label}</span>}
            {location.pathname === item.path && !isMinimized && <div className="active-indicator"></div>}
          </Link>
            ))}
          </nav>

          <div className="sidebar-footer">
            <div className="user-info">
          <div className="user-avatar">
            <i className="bi bi-person-circle"></i>
          </div>
          {!isMinimized && (
            <div className="user-details">
              <p className="user-email">{localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).email : 'User'}</p>
              <span className="user-status">
            <span className="status-dot"></span> Online
              </span>
            </div>
          )}
            </div>
            
            {/* Toggle Button at Bottom */}
          <button className="toggle-btn" onClick={toggleSidebar} title={isMinimized ? 'Expand' : 'Minimize'}>
            <i className={`bi ${isMinimized ? 'bi-chevron-right' : 'bi-chevron-left'}`}></i>
            {!isMinimized && <span className="toggle-text">Minimize</span>}
          </button>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
