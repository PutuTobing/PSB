import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

function Register({ setIsLoggedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validasi password
    if (password.length < 6) {
      setError('Password harus minimal 6 karakter');
      return;
    }

    if (password !== confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (res.ok) {
        setSuccess('Registrasi berhasil! Mengalihkan ke login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(data.message || 'Registrasi gagal. Silakan coba lagi.');
      }
    } catch (err) {
      setError('Terjadi kesalahan. Pastikan server berjalan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-background">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
      </div>
      
      <div className="register-card">
        <div className="register-header">
          <div className="logo-container">
            <div className="logo-circle">
              <i className="bi bi-person-plus"></i>
            </div>
          </div>
          <h2>Daftar Akun Baru</h2>
          <p>Buat akun untuk mulai menggunakan aplikasi</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
              <button type="button" className="btn-close" onClick={() => setError('')}></button>
            </div>
          )}

          {success && (
            <div className="alert alert-success" role="alert">
              <i className="bi bi-check-circle-fill me-2"></i>
              {success}
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
              placeholder="Minimal 6 karakter"
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <i className="bi bi-lock-fill"></i> Konfirmasi Password
            </label>
            <input 
              type="password" 
              className="form-control form-input" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              placeholder="Masukkan password yang sama"
              required 
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-register-submit" 
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Mendaftar...
              </>
            ) : (
              <>
                <i className="bi bi-person-check-fill me-2"></i>
                Daftar
              </>
            )}
          </button>
        </form>

        <div className="register-footer">
          <p>Sudah punya akun?</p>
          <button 
            className="btn btn-login-link" 
            onClick={() => navigate('/login')}
          >
            <i className="bi bi-box-arrow-in-right me-2"></i>
            Login Sekarang
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;
