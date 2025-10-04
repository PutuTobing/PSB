import React, { useState, useEffect } from 'react';
import './DaftarPemasangan.css';


// API Helper - AUTO DETECT NETWORK
const getApiUrl = () => {
  const host = window.location.hostname;
  return (host === "localhost" || host === "127.0.0.1") ? "http://localhost:3000/api" : "http://172.16.31.11:3000/api";
};
function DaftarPemasangan() {
  const [pemasanganData, setPemasanganData] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedPelanggan, setSelectedPelanggan] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [newPelanggan, setNewPelanggan] = useState({
    nama: '',
    telepon: '',
    alamat: ''
  });
  const [konfirmasiData, setKonfirmasiData] = useState({
    tanggal_pasang: '',
    jam_pasang: '',
    teknisi: '',
    catatan: ''
  });

  // Load data from API
  useEffect(() => {
    fetchPemasanganData();
  }, []);

  const fetchPemasanganData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://172.16.31.11:3000/api/pemasangan');
      
      if (response.ok) {
        const data = await response.json();
        setPemasanganData(data);
      } else {
        console.error('Failed to fetch pemasangan data');
      }
    } catch (error) {
      console.error('Error fetching pemasangan data:', error);
      // Use sample data as fallback
      const sampleData = [
        {
          id: 1,
          nama: 'Ahmad Wijaya',
          telepon: '081234567890',
          alamat: 'Jl. Merdeka No. 123, Jakarta',
          tanggal_daftar: '2025-01-15',
          tanggal_pasang: null,
          status: 'menunggu',
          teknisi: null,
          catatan: null
        },
        {
          id: 2,
          nama: 'Sari Indah',
          telepon: '082345678901',
          alamat: 'Jl. Sudirman No. 45, Bandung',
          tanggal_daftar: '2025-01-10',
          tanggal_pasang: '2025-01-20',
          status: 'terpasang',
          teknisi: 'Budi Santoso',
          catatan: 'Pemasangan berhasil, signal bagus'
        },
        {
          id: 3,
          nama: 'Rahmat Hidayat',
          telepon: '083456789012',
          alamat: 'Jl. Gatot Subroto No. 78, Surabaya',
          tanggal_daftar: '2025-01-12',
          tanggal_pasang: null,
          status: 'menunggu',
          teknisi: null,
          catatan: null
        }
      ];
      setPemasanganData(sampleData);
    }
  };

  const stats = {
    total: pemasanganData.length,
    menunggu: pemasanganData.filter(p => p.status === 'menunggu').length,
    terpasang: pemasanganData.filter(p => p.status === 'terpasang').length
  };

  const filteredData = pemasanganData.filter(pelanggan => {
    const matchesFilter = filterStatus === 'all' || pelanggan.status === filterStatus;
    const matchesSearch = pelanggan.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pelanggan.telepon.includes(searchTerm) ||
                         pelanggan.alamat.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleAddPelanggan = async () => {
    if (newPelanggan.nama && newPelanggan.telepon && newPelanggan.alamat) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://172.16.31.11:3000/api/pemasangan', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newPelanggan)
        });
        
        if (response.ok) {
          await fetchPemasanganData(); // Refresh data
          setNewPelanggan({ nama: '', telepon: '', alamat: '' });
          setShowAddModal(false);
        } else {
          const error = await response.json();
          alert(error.message || 'Gagal menambahkan pelanggan');
        }
      } catch (error) {
        console.error('Error adding pelanggan:', error);
        alert('Terjadi kesalahan saat menambahkan pelanggan');
      }
    }
  };

  const handleDeletePelanggan = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pelanggan ini?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://172.16.31.11:3000/api/pemasangan/${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          await fetchPemasanganData(); // Refresh data
        } else {
          const error = await response.json();
          alert(error.message || 'Gagal menghapus pelanggan');
        }
      } catch (error) {
        console.error('Error deleting pelanggan:', error);
        alert('Terjadi kesalahan saat menghapus pelanggan');
      }
    }
  };

  const handleKonfirmasiPemasangan = async () => {
    if (!konfirmasiData.tanggal_pasang || !konfirmasiData.teknisi) {
      alert('Tanggal pasang dan teknisi harus diisi');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://172.16.31.11:3000/api/pemasangan/${selectedPelanggan.id}/konfirmasi`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(konfirmasiData)
      });
      
      if (response.ok) {
        await fetchPemasanganData(); // Refresh data
        setShowConfirmModal(false);
        setKonfirmasiData({ tanggal_pasang: '', jam_pasang: '', teknisi: '', catatan: '' });
      } else {
        const error = await response.json();
        alert(error.message || 'Gagal mengkonfirmasi pemasangan');
      }
    } catch (error) {
      console.error('Error confirming pemasangan:', error);
      alert('Terjadi kesalahan saat mengkonfirmasi pemasangan');
    }
  };

  const openWhatsApp = (telepon) => {
    const cleanPhone = telepon.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/62${cleanPhone.startsWith('0') ? cleanPhone.slice(1) : cleanPhone}`;
    window.open(whatsappUrl, '_blank');
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID');
  };

  return (
    <div className="daftar-pemasangan">
      {/* Header Section */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-info">
            <div className="header-icon">
              <i className="bi bi-tools"></i>
            </div>
            <div className="header-text">
              <h1>Daftar Pemasangan</h1>
              <p>Kelola dan pantau pemasangan internet pelanggan</p>
            </div>
          </div>
          <div className="header-actions">
            <button 
              className="btn btn-primary"
              onClick={() => setShowAddModal(true)}
            >
              <i className="bi bi-plus-circle"></i>
              Tambah Pelanggan
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon">
            <i className="bi bi-people-fill"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.total}</div>
            <div className="stat-label">Total Pelanggan</div>
          </div>
        </div>
        <div className="stat-card menunggu">
          <div className="stat-icon">
            <i className="bi bi-clock-history"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.menunggu}</div>
            <div className="stat-label">Menunggu Pemasangan</div>
          </div>
        </div>
        <div className="stat-card terpasang">
          <div className="stat-icon">
            <i className="bi bi-check-circle-fill"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.terpasang}</div>
            <div className="stat-label">Sudah Terpasang</div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="table-controls">
        <div className="search-box">
          <i className="bi bi-search"></i>
          <input
            type="text"
            placeholder="Cari nama, telepon, atau alamat..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            Semua
          </button>
          <button 
            className={`filter-btn ${filterStatus === 'menunggu' ? 'active' : ''}`}
            onClick={() => setFilterStatus('menunggu')}
          >
            Menunggu
          </button>
          <button 
            className={`filter-btn ${filterStatus === 'terpasang' ? 'active' : ''}`}
            onClick={() => setFilterStatus('terpasang')}
          >
            Terpasang
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="table-container">
        <div className="table-responsive">
          <table className="pemasangan-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Pelanggan</th>
                <th>Telepon</th>
                <th>Alamat</th>
                <th>Tanggal Daftar</th>
                <th>Tanggal Pasang</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((pelanggan, index) => (
                <tr key={pelanggan.id}>
                  <td>{index + 1}</td>
                  <td>
                    <div className="customer-info">
                      <div className="customer-avatar">
                        <i className="bi bi-person-circle"></i>
                      </div>
                      <div className="customer-details">
                        <div className="customer-name">{pelanggan.nama}</div>
                        {pelanggan.teknisi && (
                          <div className="teknisi-info">Teknisi: {pelanggan.teknisi}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="phone-actions">
                      <span className="phone-number">{pelanggan.telepon}</span>
                      <button 
                        className="whatsapp-btn"
                        onClick={() => openWhatsApp(pelanggan.telepon)}
                        title="Hubungi via WhatsApp"
                      >
                        <i className="bi bi-whatsapp"></i>
                      </button>
                    </div>
                  </td>
                  <td>
                    <div className="address-cell">
                      {pelanggan.alamat}
                    </div>
                  </td>
                  <td>{formatDate(pelanggan.tanggal_daftar)}</td>
                  <td>{formatDate(pelanggan.tanggal_pasang)}</td>
                  <td>
                    <span className={`status-badge ${pelanggan.status}`}>
                      {pelanggan.status === 'menunggu' ? (
                        <>
                          <i className="bi bi-clock"></i>
                          Menunggu
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle"></i>
                          Terpasang
                        </>
                      )}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      {pelanggan.status === 'menunggu' && (
                        <button
                          className="action-btn confirm"
                          onClick={() => {
                            setSelectedPelanggan(pelanggan);
                            setShowConfirmModal(true);
                          }}
                          title="Konfirmasi Pemasangan"
                        >
                          <i className="bi bi-check-lg"></i>
                        </button>
                      )}
                      <button
                        className="action-btn delete"
                        onClick={() => handleDeletePelanggan(pelanggan.id)}
                        title="Hapus Pelanggan"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3><i className="bi bi-person-plus"></i> Tambah Pelanggan Baru</h3>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Nama Pelanggan</label>
                <input
                  type="text"
                  value={newPelanggan.nama}
                  onChange={(e) => setNewPelanggan({...newPelanggan, nama: e.target.value})}
                  placeholder="Masukkan nama lengkap"
                />
              </div>
              <div className="form-group">
                <label>Nomor Telepon</label>
                <input
                  type="tel"
                  value={newPelanggan.telepon}
                  onChange={(e) => setNewPelanggan({...newPelanggan, telepon: e.target.value})}
                  placeholder="08xxxxxxxxxx"
                />
              </div>
              <div className="form-group">
                <label>Alamat Lengkap</label>
                <textarea
                  value={newPelanggan.alamat}
                  onChange={(e) => setNewPelanggan({...newPelanggan, alamat: e.target.value})}
                  placeholder="Masukkan alamat lengkap"
                  rows="3"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                Batal
              </button>
              <button className="btn btn-primary" onClick={handleAddPelanggan}>
                <i className="bi bi-plus-circle"></i>
                Tambah Pelanggan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && selectedPelanggan && (
        <div className="modal-overlay" onClick={() => setShowConfirmModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3><i className="bi bi-check-circle"></i> Konfirmasi Pemasangan</h3>
              <button className="modal-close" onClick={() => setShowConfirmModal(false)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="customer-summary">
                <h4>Pelanggan: {selectedPelanggan.nama}</h4>
                <p>Telepon: {selectedPelanggan.telepon}</p>
                <p>Alamat: {selectedPelanggan.alamat}</p>
              </div>
              <div className="form-group">
                <label>Tanggal Pemasangan</label>
                <input
                  type="date"
                  value={konfirmasiData.tanggal_pasang}
                  onChange={(e) => setKonfirmasiData({...konfirmasiData, tanggal_pasang: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Jam Pemasangan</label>
                <input
                  type="time"
                  value={konfirmasiData.jam_pasang}
                  onChange={(e) => setKonfirmasiData({...konfirmasiData, jam_pasang: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Nama Teknisi</label>
                <input
                  type="text"
                  value={konfirmasiData.teknisi}
                  onChange={(e) => setKonfirmasiData({...konfirmasiData, teknisi: e.target.value})}
                  placeholder="Nama teknisi yang memasang"
                />
              </div>
              <div className="form-group">
                <label>Catatan Pemasangan</label>
                <textarea
                  value={konfirmasiData.catatan}
                  onChange={(e) => setKonfirmasiData({...konfirmasiData, catatan: e.target.value})}
                  placeholder="Catatan tambahan (opsional)"
                  rows="3"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowConfirmModal(false)}>
                Batal
              </button>
              <button className="btn btn-success" onClick={handleKonfirmasiPemasangan}>
                <i className="bi bi-check-lg"></i>
                Konfirmasi Pemasangan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DaftarPemasangan;
