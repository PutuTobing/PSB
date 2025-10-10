import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import DaftarPemasangan from './pages/DaftarPemasangan';
import ManajemenAkun from './pages/ManajemenAkun';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <Routes>
        {!isLoggedIn ? (
          <>
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/register" element={<Register setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        ) : (
          <>
            <Route path="/beranda" element={
              <div className="d-flex">
                <Sidebar />
                <div className="flex-fill" style={{ background: '#f5f7fa' }}>
                  <Header onLogout={handleLogout} />
                  <div className="p-4">
                    <Dashboard />
                  </div>
                </div>
              </div>
            } />
            <Route path="/daftar-pemasangan" element={
              <div className="d-flex">
                <Sidebar />
                <div className="flex-fill" style={{ background: '#f5f7fa' }}>
                  <Header onLogout={handleLogout} />
                  <div className="p-4">
                    <ErrorBoundary>
                      <DaftarPemasangan />
                    </ErrorBoundary>
                  </div>
                </div>
              </div>
            } />
            <Route path="/manajemen-akun" element={
              <div className="d-flex">
                <Sidebar />
                <div className="flex-fill" style={{ background: '#f5f7fa' }}>
                  <Header onLogout={handleLogout} />
                  <div className="p-4">
                    <ManajemenAkun />
                  </div>
                </div>
              </div>
            } />
            <Route path="/" element={<Navigate to="/beranda" replace />} />
            <Route path="*" element={<Navigate to="/beranda" replace />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
