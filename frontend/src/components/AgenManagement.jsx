import React, { useState, useEffect } from 'react';
import './AgenManagement.css';

// Helper function untuk mendukung akses dari network
// Menggunakan deteksi dinamis berdasarkan hostname dan port
const getApiUrl = () => {
  const apiPort = import.meta.env.VITE_API_PORT || '3000';
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  
  if (baseUrl) {
    return `${baseUrl}/api`;
  }
  
  // Auto-detect dari browser location
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  return `${protocol}//${hostname}:${apiPort}/api`;
};

function AgenManagement() {
  const [daftarAgen, setDaftarAgen] = useState([]);
  const [newAgenName, setNewAgenName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load daftar agen dari API
  useEffect(() => {
    fetchDaftarAgen();
  }, []);

  const fetchDaftarAgen = async () => {
    try {
      setLoading(true);
      // TODO: Implementasi API endpoint untuk get agen
      // const response = await fetch(`${getApiUrl()}/agen`);
      
      // Sementara menggunakan data dummy
      const dummyAgen = ['YOGA', 'ANDI', 'SARI', 'BUDI', 'LINA'];
      setDaftarAgen(dummyAgen);
      
    } catch (error) {
      console.error('Error fetching agen data:', error);
      setError('Gagal memuat data agen');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAgen = async (e) => {
    e.preventDefault();
    
    if (!newAgenName.trim()) {
      alert('Nama agen tidak boleh kosong');
      return;
    }

    if (daftarAgen.includes(newAgenName.toUpperCase())) {
      alert('Nama agen sudah ada');
      return;
    }

    try {
      setLoading(true);
      // TODO: Implementasi API endpoint untuk add agen
      // const response = await fetch(`${getApiUrl()}/agen`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ nama: newAgenName.toUpperCase() })
      // });
      
      // Sementara update state langsung
      setDaftarAgen([...daftarAgen, newAgenName.toUpperCase()]);
      setNewAgenName('');
      
    } catch (error) {
      console.error('Error adding agen:', error);
      setError('Gagal menambahkan agen');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAgen = async (agenName) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus agen "${agenName}"?`)) {
      return;
    }

    try {
      setLoading(true);
      // TODO: Implementasi API endpoint untuk delete agen
      // const response = await fetch(`${getApiUrl()}/agen/${agenName}`, {
      //   method: 'DELETE'
      // });
      
      // Sementara update state langsung
      setDaftarAgen(daftarAgen.filter(agen => agen !== agenName));
      
    } catch (error) {
      console.error('Error deleting agen:', error);
      setError('Gagal menghapus agen');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="agen-management">
      <div className="agen-header">
        <h3>
          <i className="bi bi-people-fill"></i>
          Manajemen Agen
        </h3>
        <p className="agen-description">
          Kelola daftar agen yang dapat dipilih saat menambahkan pelanggan baru
        </p>
      </div>

      {/* Add New Agen Form */}
      <form onSubmit={handleAddAgen} className="add-agen-form">
        <div className="form-row">
          <input
            type="text"
            value={newAgenName}
            onChange={(e) => setNewAgenName(e.target.value)}
            placeholder="Masukkan nama agen baru..."
            className="agen-input"
            disabled={loading}
          />
          <button 
            type="submit" 
            className="btn-add-agen"
            disabled={loading || !newAgenName.trim()}
          >
            <i className="bi bi-plus-circle"></i>
            Tambah Agen
          </button>
        </div>
      </form>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <i className="bi bi-exclamation-triangle"></i>
          {error}
        </div>
      )}

      {/* Agen List */}
      <div className="agen-content">
        <div className="agen-stats">
          <span className="stats-label">Total Agen:</span>
          <span className="stats-number">{daftarAgen.length}</span>
        </div>
        
        <div className="agen-list">
          {loading ? (
            <div className="loading-message">
              <i className="bi bi-arrow-clockwise spin"></i>
              Memuat data agen...
            </div>
          ) : daftarAgen.length === 0 ? (
            <div className="empty-message">
              <i className="bi bi-inbox"></i>
              Belum ada agen yang terdaftar
            </div>
          ) : (
            daftarAgen.map((agen, index) => (
              <div key={index} className="agen-item">
                <i className="bi bi-person-badge"></i>
                <span className="agen-name">{agen}</span>
                <button
                  onClick={() => handleDeleteAgen(agen)}
                  className="delete-btn"
                  title={`Hapus agen ${agen}`}
                  disabled={loading}
                >
                  <i className="bi bi-x"></i>
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Info Note */}
      <div className="info-note">
        <i className="bi bi-info-circle"></i>
        <span>
          Agen yang sudah memiliki pelanggan tidak dapat dihapus. 
          Pastikan untuk mengelola agen dengan hati-hati.
        </span>
      </div>
    </div>
  );
}

export default AgenManagement;