import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import DaftarPemasangan from './pages/DaftarPemasangan';
import ManajemenAkun from './pages/ManajemenAkun';

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
            <Route path="/" element={
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
                    <DaftarPemasangan />
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
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
