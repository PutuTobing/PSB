import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login({ setIsLoggedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setIsLoggedIn(true);
        navigate('/');
      } else {
        setError(data.message || 'Login gagal. Periksa email dan password Anda.');
      }
    } catch (err) {
      setError('Terjadi kesalahan. Pastikan server berjalan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
      </div>
      
      <div className="login-card">
        <div className="login-header">
          <div className="logo-container">
            <div className="logo-circle">
              <i className="bi bi-person-lock"></i>
            </div>
          </div>
          <h2>Selamat Datang</h2>
          <p>Silakan login untuk melanjutkan</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
              <button type="button" className="btn-close" onClick={() => setError('')}></button>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">
              <i className="bi bi-envelope-fill"></i> Email
            </label>
            <input 
              type="email" 
              className="form-control form-input" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="Masukkan email Anda"
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <i className="bi bi-lock-fill"></i> Password
            </label>
            <input 
              type="password" 
              className="form-control form-input" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Masukkan password Anda"
              required 
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-login" 
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Logging in...
              </>
            ) : (
              <>
                <i className="bi bi-box-arrow-in-right me-2"></i>
                Login
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>Belum punya akun?</p>
          <button 
            className="btn btn-register" 
            onClick={() => navigate('/register')}
          >
            <i className="bi bi-person-plus-fill me-2"></i>
            Daftar Sekarang
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
