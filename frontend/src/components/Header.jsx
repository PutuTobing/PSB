import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

function Header({ onLogout }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userEmail = user.email || 'user@example.com';
  const userName = userEmail.split('@')[0];

  // Fungsi untuk mendapatkan nama halaman berdasarkan path
  const getPageTitle = () => {
    const path = location.pathname;
    switch (path) {
      case '/dashboard':
        return 'Dashboard';
      case '/daftar-pemasangan':
        return 'Daftar Pemasangan';
      case '/manajemen-akun':
        return 'Manajemen Akun';
      default:
        return 'Dashboard';
    }
  };

  // Fungsi untuk mendapatkan icon berdasarkan path
  const getPageIcon = () => {
    const path = location.pathname;
    switch (path) {
      case '/dashboard':
        return 'bi-speedometer2';
      case '/daftar-pemasangan':
        return 'bi-list-check';
      case '/manajemen-akun':
        return 'bi-person-gear';
      default:
        return 'bi-speedometer2';
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('id-ID', options);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <div className="page-info">
          <i className={`bi ${getPageIcon()}`}></i>
          <h1 className="page-title">{getPageTitle()}</h1>
        </div>
        <div className="date-time-container">
          <div className="date-display">
            <i className="bi bi-calendar-event"></i>
            <span>{formatDate(currentTime)}</span>
          </div>
          <div className="time-display">
            <i className="bi bi-clock"></i>
            <span className="time-text">{formatTime(currentTime)}</span>
          </div>
        </div>
      </div>

      <div className="header-right">
        <div className="user-section">
          <div className="user-welcome">
            <span className="welcome-text">Selamat datang,</span>
            <span className="user-name">{userName}</span>
          </div>
          
          <div className="user-dropdown" onClick={() => setShowUserMenu(!showUserMenu)}>
            <div className="user-avatar-header">
              <i className="bi bi-person-circle"></i>
            </div>
            <i className={`bi bi-chevron-down dropdown-icon ${showUserMenu ? 'rotate' : ''}`}></i>
            
            {showUserMenu && (
              <div className="dropdown-menu">
                <div className="dropdown-item time-info-item">
                  <i className="bi bi-clock-fill"></i>
                  <div>
                    <div className="dropdown-time">{formatTime(currentTime)}</div>
                    <div className="dropdown-date">{formatDate(currentTime)}</div>
                  </div>
                </div>
                <div className="dropdown-divider"></div>
                <div className="dropdown-item user-info-item">
                  <i className="bi bi-person"></i>
                  <div>
                    <div className="dropdown-name">{userName}</div>
                    <div className="dropdown-email">{userEmail}</div>
                  </div>
                </div>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item" onClick={() => navigate('/manajemen-akun')}>
                  <i className="bi bi-gear"></i>
                  <span>Pengaturan</span>
                </button>
                <button className="dropdown-item logout-item" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right"></i>
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <button className="btn-logout" onClick={handleLogout}>
          <i className="bi bi-box-arrow-right"></i>
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}

export default Header;
