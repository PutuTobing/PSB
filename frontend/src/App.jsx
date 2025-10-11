import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Layout from './components/Layout';
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
              <Layout onLogout={handleLogout} pageClassName="page-beranda">
                <Dashboard />
              </Layout>
            } />
            <Route path="/daftar-pemasangan" element={
              <Layout onLogout={handleLogout} pageClassName="page-daftar-pemasangan">
                <ErrorBoundary>
                  <DaftarPemasangan />
                </ErrorBoundary>
              </Layout>
            } />
            <Route path="/manajemen-akun" element={
              <Layout onLogout={handleLogout} pageClassName="page-manajemen-akun">
                <ManajemenAkun />
              </Layout>
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
