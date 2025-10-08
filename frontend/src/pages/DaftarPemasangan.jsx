import React, { useState, useEffect } from 'react';
import './DaftarPemasangan.css';


// Helper function untuk mendukung akses dari network
const getApiUrl = () => {
  const host = window.location.hostname;
  if (host === 'localhost' || host === '127.0.0.1') {
    return 'http://localhost:3000/api';
  }
  return 'http://172.16.31.11:3000/api';
};
function DaftarPemasangan() {
  // Get current date and time in format for HTML inputs - Declare early
  const getCurrentDate = () => {
    const now = new Date();
    return now.toISOString().split('T')[0]; // YYYY-MM-DD format
  };

  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`; // HH:MM format
  };

  const [pemasanganData, setPemasanganData] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedPelanggan, setSelectedPelanggan] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDesa, setFilterDesa] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Date filters - default to current month & year
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1); // 1-12, 0 for all months
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [newPelanggan, setNewPelanggan] = useState({
    nama: '',
    telepon: '',
    alamat: '',
    desa: 'Desa Braja Gemilang', // Default ke Desa Braja Gemilang
    agen: '', // Default agen kosong - akan dikelola di manajemen akun
    tanggal_daftar: getCurrentDate() // Default ke hari ini
  });
  const [konfirmasiData, setKonfirmasiData] = useState({
    tanggal_pasang: '',
    jam_pasang: '',
    teknisi: '',
    catatan: ''
  });
  
  // State untuk komisi agen
  const [showKomisiModal, setShowKomisiModal] = useState(false);
  const [selectedAgen, setSelectedAgen] = useState(null);
  
  // State untuk custom notification
  const [notification, setNotification] = useState({
    show: false,
    type: '', // 'success', 'error', 'info'
    title: '',
    message: '',
    icon: ''
  });
  
  // State untuk konfirmasi komisi dialog
  const [showKomisiConfirm, setShowKomisiConfirm] = useState(false);
  const [selectedKomisiData, setSelectedKomisiData] = useState(null);
  
  // Daftar agen yang tersedia - nanti akan dikelola di manajemen akun
  // TODO: Implementasi CRUD agen di halaman manajemen akun
  const daftarAgen = ['YOGA', 'ANDI', 'SARI', 'BUDI', 'LINA'];
  
  // State untuk daftar desa yang diambil dari database
  const [daftarDesa, setDaftarDesa] = useState(['Desa Braja Gemilang', 'Desa Braja Fajar']);

  // Load data from API
  useEffect(() => {
    fetchPemasanganData();
    fetchDesaData();
  }, []);

  const fetchPemasanganData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${getApiUrl()}/pemasangan`);
      
      if (response.ok) {
        const data = await response.json();
        setPemasanganData(data);
      } else {
        console.error('Failed to fetch pemasangan data');
      }
    } catch (error) {
      console.error('Error fetching pemasangan data:', error);
    }
  };

  const fetchDesaData = async () => {
    try {
      const response = await fetch(`${getApiUrl()}/desa`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          setDaftarDesa(data);
        }
      } else {
        console.error('Failed to fetch desa data');
      }
    } catch (error) {
      console.error('Error fetching desa data:', error);
      // Gunakan default jika gagal
    }
  };

  // Generate year options (current year and 2 years before)
  const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    return [currentYear - 2, currentYear - 1, currentYear];
  };

  // Month names in Indonesian
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  // Validate phone number format
  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,9}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
  };

  // Helper function untuk mendapatkan tanggal daftar dari berbagai field
  const getTanggalDaftar = (pelanggan) => {
    // Coba beberapa kemungkinan nama field
    return pelanggan.tanggal_daftar || 
           pelanggan.created_at || 
           pelanggan.createdAt || 
           pelanggan.date_created ||
           pelanggan.registration_date;
  };

  // Calculate stats based on filtered data (month/year and desa)
  const getFilteredDataForStats = () => {
    return pemasanganData.filter(pelanggan => {
      // Filter by desa
      const matchesDesa = filterDesa === 'all' || pelanggan.desa === filterDesa;
      
      // Filter by month and year based on tanggal_daftar
      let matchesDate = true;
      
      const tanggalDaftar = getTanggalDaftar(pelanggan);
      
      if (tanggalDaftar) {
        const daftarDate = new Date(tanggalDaftar);
        
        // Validasi apakah tanggal valid
        if (!isNaN(daftarDate.getTime())) {
          const daftarMonth = daftarDate.getMonth() + 1; // 1-12
          const daftarYear = daftarDate.getFullYear();
          
          // If selectedMonth is 0, show all months for the selected year
          if (selectedMonth === 0) {
            matchesDate = daftarYear === selectedYear;
          } else {
            matchesDate = daftarMonth === selectedMonth && daftarYear === selectedYear;
          }
        } else {
          // Jika tanggal tidak valid, tampilkan semua (fallback)
          matchesDate = true;
        }
      } else {
        // Jika tidak ada tanggal sama sekali, tampilkan semua (fallback)
        matchesDate = true;
      }
      
      return matchesDate && matchesDesa;
    });
  };

  const filteredDataForStats = getFilteredDataForStats();
  const stats = {
    total: filteredDataForStats.length,
    menunggu: filteredDataForStats.filter(p => p.status === 'menunggu').length,
    terpasang: filteredDataForStats.filter(p => p.status === 'terpasang').length
  };

  const filteredData = pemasanganData.filter(pelanggan => {
    const matchesFilter = filterStatus === 'all' || pelanggan.status === filterStatus;
    const matchesDesa = filterDesa === 'all' || pelanggan.desa === filterDesa;
    const matchesSearch = pelanggan.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pelanggan.telepon.includes(searchTerm) ||
                         pelanggan.alamat.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (pelanggan.desa && pelanggan.desa.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filter by month and year based on tanggal_daftar
    let matchesDate = true;
    
    const tanggalDaftar = getTanggalDaftar(pelanggan);
    
    if (tanggalDaftar) {
      const daftarDate = new Date(tanggalDaftar);
      
      // Validasi apakah tanggal valid
      if (!isNaN(daftarDate.getTime())) {
        const daftarMonth = daftarDate.getMonth() + 1; // 1-12
        const daftarYear = daftarDate.getFullYear();
        
        // If selectedMonth is 0, show all months for the selected year
        if (selectedMonth === 0) {
          matchesDate = daftarYear === selectedYear;
        } else {
          matchesDate = daftarMonth === selectedMonth && daftarYear === selectedYear;
        }
      } else {
        // Jika tanggal tidak valid, tampilkan semua (fallback)
        matchesDate = true;
      }
    } else {
      // Jika tidak ada tanggal sama sekali, tampilkan semua (fallback)
      matchesDate = true;
    }
    
    return matchesFilter && matchesDesa && matchesSearch && matchesDate;
  });

  const handleAddPelanggan = async () => {
    // Validation
    if (!newPelanggan.nama.trim()) {
      alert('Nama pelanggan harus diisi');
      return;
    }
    if (!newPelanggan.telepon.trim()) {
      alert('Nomor telepon harus diisi');
      return;
    }
    if (!validatePhoneNumber(newPelanggan.telepon)) {
      alert('Format nomor telepon tidak valid. Contoh: 08123456789');
      return;
    }
    if (!newPelanggan.alamat.trim()) {
      alert('Alamat harus diisi');
      return;
    }
    if (!newPelanggan.agen.trim()) {
      alert('Agen harus dipilih');
      return;
    }
    if (!newPelanggan.desa.trim()) {
      alert('Desa harus dipilih');
      return;
    }
    if (!newPelanggan.tanggal_daftar) {
      alert('Tanggal daftar harus diisi');
      return;
    }
    
    setLoading(true);
    setError('');
    
    if (newPelanggan.nama && newPelanggan.telepon && newPelanggan.alamat) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${getApiUrl()}/pemasangan`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newPelanggan)
        });
        
        if (response.ok) {
          await fetchPemasanganData(); // Refresh data
          setNewPelanggan({ nama: '', telepon: '', alamat: '', desa: 'Desa Braja Gemilang', agen: '', tanggal_daftar: getCurrentDate() });
          setShowAddModal(false);
          showNotification(
            'success',
            'Pelanggan Berhasil Ditambahkan!',
            `${newPelanggan.nama} telah terdaftar sebagai pelanggan baru.`,
            'bi-person-plus'
          );
        } else {
          const error = await response.json();
          setError(error.message || 'Gagal menambahkan pelanggan');
          showNotification(
            'error',
            'Gagal Menambahkan Pelanggan!',
            error.message || 'Terjadi kesalahan saat menambahkan pelanggan.',
            'bi-exclamation-triangle'
          );
        }
      } catch (error) {
        console.error('Error adding pelanggan:', error);
        setError('Terjadi kesalahan saat menambahkan pelanggan');
        showNotification(
          'error',
          'Koneksi Bermasalah!',
          'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.',
          'bi-wifi-off'
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeletePelanggan = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pelanggan ini?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${getApiUrl()}/pemasangan/${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          await fetchPemasanganData(); // Refresh data
          showNotification(
            'success',
            'Pelanggan Berhasil Dihapus!',
            'Data pelanggan telah dihapus dari sistem.',
            'bi-trash'
          );
        } else {
          const error = await response.json();
          showNotification(
            'error',
            'Gagal Menghapus Pelanggan!',
            error.message || 'Terjadi kesalahan saat menghapus pelanggan.',
            'bi-exclamation-triangle'
          );
        }
      } catch (error) {
        console.error('Error deleting pelanggan:', error);
        showNotification(
          'error',
          'Koneksi Bermasalah!',
          'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.',
          'bi-wifi-off'
        );
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
      const response = await fetch(`${getApiUrl()}/pemasangan/${selectedPelanggan.id}/konfirmasi`, {
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
        showNotification(
          'success',
          'Pemasangan Berhasil Dikonfirmasi!',
          `Pemasangan untuk ${selectedPelanggan.nama} telah dikonfirmasi dan status diubah menjadi "Terpasang".`,
          'bi-check-circle'
        );
      } else {
        const error = await response.json();
        showNotification(
          'error',
          'Konfirmasi Gagal!',
          error.message || 'Terjadi kesalahan saat mengkonfirmasi pemasangan.',
          'bi-exclamation-triangle'
        );
      }
    } catch (error) {
      console.error('Error confirming pemasangan:', error);
      showNotification(
        'error',
        'Koneksi Bermasalah!',
        'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.',
        'bi-wifi-off'
      );
    }
  };
  
  // Fungsi untuk menampilkan dialog konfirmasi komisi
  const handleKomisiClick = (pelanggan) => {
    setSelectedKomisiData(pelanggan);
    setShowKomisiConfirm(true);
  };

  // Fungsi untuk update status komisi setelah konfirmasi
  const handleUpdateKomisi = async (status) => {
    if (!selectedKomisiData) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${getApiUrl()}/pemasangan/${selectedKomisiData.id}/komisi`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ komisi_dibayar: status })
      });
      
      if (response.ok) {
        await fetchPemasanganData(); // Refresh data
        setShowKomisiConfirm(false);
        setSelectedKomisiData(null);
        showNotification(
          'success',
          'Komisi Berhasil Diupdate!',
          `Komisi untuk ${selectedKomisiData.nama} telah diubah menjadi "${status ? 'Sudah Dibayar' : 'Belum Dibayar'}".`,
          status ? 'bi-currency-dollar' : 'bi-exclamation-triangle'
        );
      } else {
        const error = await response.json();
        showNotification(
          'error',
          'Update Gagal!',
          error.message || 'Terjadi kesalahan saat mengupdate status komisi.',
          'bi-x-circle'
        );
      }
    } catch (error) {
      console.error('Error updating komisi:', error);
      showNotification(
        'error',
        'Koneksi Bermasalah!',
        'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.',
        'bi-wifi-off'
      );
    }
  };

  const openWhatsApp = (telepon) => {
    const cleanPhone = telepon.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/62${cleanPhone.startsWith('0') ? cleanPhone.slice(1) : cleanPhone}`;
    window.open(whatsappUrl, '_blank');
  };

  // Custom notification function
  const showNotification = (type, title, message, icon) => {
    setNotification({
      show: true,
      type,
      title,
      message,
      icon
    });
    
    // Auto hide after 3 seconds
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    return date.toLocaleDateString('id-ID');
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
              <div className="period-badge">
                <i className="bi bi-calendar-check"></i>
                {selectedMonth === 0 ? `Semua Bulan ${selectedYear}` : `${monthNames[selectedMonth - 1]} ${selectedYear}`}
              </div>
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
        
        {/* Date Filters */}
        <div className="date-filters">
          <div className="filter-group">
            <i className="bi bi-calendar-month"></i>
            <select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="date-select"
            >
              <option value={0}>Semua Bulan</option>
              {monthNames.map((month, index) => (
                <option key={index + 1} value={index + 1}>
                  {month}
                </option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <i className="bi bi-calendar-event"></i>
            <select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="date-select"
            >
              {getYearOptions().map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <i className="bi bi-geo-alt"></i>
            <select 
              value={filterDesa} 
              onChange={(e) => setFilterDesa(e.target.value)}
              className="date-select"
            >
              <option value="all">Semua Desa</option>
              {daftarDesa.map(desa => (
                <option key={desa} value={desa}>
                  {desa}
                </option>
              ))}
            </select>
          </div>
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
                <th>Desa</th>
                <th>Agen</th>
                <th>Tanggal Daftar</th>
                <th>Tanggal Pasang</th>
                <th>Status Pemasangan</th>
                <th>Komisi Agen</th>
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
                  <td>
                    <div className="desa-cell">
                      <i className="bi bi-geo-alt"></i>
                      <span className="desa-name">{pelanggan.desa || 'Desa Braja Gemilang'}</span>
                    </div>
                  </td>
                  <td>
                    <div className="agen-cell">
                      <i className="bi bi-person-badge"></i>
                      <span className="agen-name">{pelanggan.agen || 'YOGA'}</span>
                    </div>
                  </td>
                  <td>{formatDate(getTanggalDaftar(pelanggan))}</td>
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
                    {pelanggan.status === 'terpasang' ? (
                      <div className="komisi-status">
                        <span className={`komisi-badge ${pelanggan.komisi_dibayar ? 'dibayar' : 'belum'}`}>
                          {pelanggan.komisi_dibayar ? (
                            <>
                              <i className="bi bi-currency-dollar"></i>
                              Sudah
                            </>
                          ) : (
                            <>
                              <i className="bi bi-exclamation-circle"></i>
                              Belum
                            </>
                          )}
                        </span>
                        <button
                          className={`komisi-btn ${pelanggan.komisi_dibayar ? 'mark-unpaid' : 'mark-paid'}`}
                          onClick={() => handleKomisiClick(pelanggan)}
                          title="Update Status Komisi"
                        >
                          <i className={`bi ${pelanggan.komisi_dibayar ? 'bi-x-circle' : 'bi-check-circle'}`}></i>
                        </button>
                      </div>
                    ) : (
                      <span className="komisi-badge pending">
                        <i className="bi bi-dash-circle"></i>
                        Menunggu Pemasangan
                      </span>
                    )}
                  </td>
                  <td>
                    <div className="action-buttons">
                      {pelanggan.status === 'menunggu' && (
                        <button
                          className="action-btn confirm"
                          onClick={() => {
                            setSelectedPelanggan(pelanggan);
                            // Auto-fill dengan tanggal dan jam saat ini
                            setKonfirmasiData({
                              tanggal_pasang: getCurrentDate(),
                              jam_pasang: getCurrentTime(),
                              teknisi: '',
                              catatan: ''
                            });
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

      {/* Mobile Card Layout */}
      <div className="mobile-card-container">
        {filteredData.map((pelanggan, index) => (
          <div key={pelanggan.id} className="customer-card">
            <div className="card-number">{index + 1}</div>
            
            <div className="card-header">
              <div className="card-avatar">
                <i className="bi bi-person-circle"></i>
              </div>
              <div className="card-header-info">
                <h4 className="card-customer-name">{pelanggan.nama}</h4>
                <p className="card-customer-phone">
                  <i className="bi bi-telephone"></i>
                  {pelanggan.telepon}
                </p>
              </div>
            </div>
            
            <div className="card-body">
              <div className="card-field full-width">
                <div className="card-field-label">Alamat</div>
                <div className="card-field-value card-address">{pelanggan.alamat}</div>
              </div>
              
              <div className="card-field">
                <div className="card-field-label">Desa</div>
                <div className="card-field-value">
                  <span className="card-desa-badge">
                    <i className="bi bi-geo-alt"></i>
                    {pelanggan.desa || 'Desa Braja Gemilang'}
                  </span>
                </div>
              </div>
              
              <div className="card-field">
                <div className="card-field-label">Agen</div>
                <div className="card-field-value">
                  <span className="card-agen-badge">
                    <i className="bi bi-person-badge"></i>
                    {pelanggan.agen}
                  </span>
                </div>
              </div>
              
              <div className="card-field">
                <div className="card-field-label">Status</div>
                <div className="card-field-value">
                  <span className={`card-status-badge ${pelanggan.status_pemasangan}`}>
                    <i className={`bi ${pelanggan.status_pemasangan === 'terpasang' ? 'bi-check-circle' : 'bi-clock'}`}></i>
                    {pelanggan.status_pemasangan === 'menunggu' ? 'Menunggu' : 'Terpasang'}
                  </span>
                </div>
              </div>
              
              <div className="card-field">
                <div className="card-field-label">Tanggal Daftar</div>
                <div className="card-field-value">{formatDate(getTanggalDaftar(pelanggan))}</div>
              </div>
              
              <div className="card-field">
                <div className="card-field-label">Tanggal Pasang</div>
                <div className="card-field-value">{formatDate(pelanggan.tanggal_pasang)}</div>
              </div>
            </div>
            
            <div className="card-footer">
              <button 
                className="card-action-btn whatsapp"
                onClick={() => openWhatsApp(pelanggan.telepon)}
              >
                <i className="bi bi-whatsapp"></i>
                WhatsApp
              </button>
              
              <button 
                className="card-action-btn komisi"
                onClick={() => handleKomisiClick(pelanggan)}
              >
                <i className="bi bi-cash-coin"></i>
                Komisi
              </button>
              
              <button 
                className="card-action-btn edit"
                onClick={() => {
                  // TODO: Implement edit functionality
                  alert('Fitur edit akan segera tersedia');
                }}
              >
                <i className="bi bi-pencil"></i>
                Edit
              </button>
              
              <button 
                className="card-action-btn delete"
                onClick={() => handleDeletePelanggan(pelanggan.id)}
              >
                <i className="bi bi-trash"></i>
                Hapus
              </button>
            </div>
            
            {pelanggan.komisi_dibayar && (
              <div className="card-komisi-info">
                <span className="card-komisi-badge">
                  <i className="bi bi-check-circle"></i>
                  Komisi Dibayar
                </span>
              </div>
            )}
          </div>
        ))}
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
              <div className="form-group">
                <label>Nama Desa</label>
                <select
                  value={newPelanggan.desa}
                  onChange={(e) => setNewPelanggan({...newPelanggan, desa: e.target.value})}
                  className="desa-select"
                >
                  <option value="">-- Pilih Desa --</option>
                  {daftarDesa.map(desa => (
                    <option key={desa} value={desa}>
                      {desa}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Nama Agen</label>
                <select
                  value={newPelanggan.agen}
                  onChange={(e) => setNewPelanggan({...newPelanggan, agen: e.target.value})}
                  className="agen-select"
                >
                  <option value="">-- Pilih Agen --</option>
                  {daftarAgen.map(agen => (
                    <option key={agen} value={agen}>
                      {agen}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Tanggal Daftar</label>
                <input
                  type="date"
                  value={newPelanggan.tanggal_daftar}
                  onChange={(e) => setNewPelanggan({...newPelanggan, tanggal_daftar: e.target.value})}
                />
                <small className="form-help">
                  <i className="bi bi-info-circle"></i>
                  Otomatis terisi tanggal hari ini. Ubah jika pendaftaran di hari lain.
                </small>
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
                <small className="form-help">
                  <i className="bi bi-info-circle"></i>
                  Otomatis terisi tanggal hari ini. Ubah jika pemasangan di hari lain.
                </small>
              </div>
              <div className="form-group">
                <label>Jam Pemasangan</label>
                <input
                  type="time"
                  value={konfirmasiData.jam_pasang}
                  onChange={(e) => setKonfirmasiData({...konfirmasiData, jam_pasang: e.target.value})}
                />
                <small className="form-help">
                  <i className="bi bi-clock"></i>
                  Otomatis terisi jam sekarang. Sesuaikan dengan jadwal pemasangan.
                </small>
              </div>
              <div className="form-group">
                <label>Nama Teknisi <span className="required-field">*</span></label>
                <input
                  type="text"
                  value={konfirmasiData.teknisi}
                  onChange={(e) => setKonfirmasiData({...konfirmasiData, teknisi: e.target.value})}
                  placeholder="Nama teknisi yang memasang"
                  autoFocus
                />
                <small className="form-help">
                  <i className="bi bi-person-gear"></i>
                  Wajib diisi - nama teknisi yang melakukan pemasangan
                </small>
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

      {/* Komisi Confirmation Dialog */}
      {showKomisiConfirm && selectedKomisiData && (
        <div className="modal-overlay" onClick={() => setShowKomisiConfirm(false)}>
          <div className="komisi-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="komisi-dialog-header">
              <div className="komisi-dialog-icon">
                <i className="bi bi-currency-dollar"></i>
              </div>
              <h3>Komisi Agen</h3>
              <button 
                className="modal-close" 
                onClick={() => setShowKomisiConfirm(false)}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="komisi-dialog-body">
              <div className="customer-info-card">
                <div className="customer-avatar-large">
                  <i className="bi bi-person-circle"></i>
                </div>
                <div className="customer-details-card">
                  <h4>{selectedKomisiData.nama}</h4>
                  <p><i className="bi bi-person-badge"></i> Agen: {selectedKomisiData.agen}</p>
                  <p><i className="bi bi-calendar-check"></i> Terpasang: {formatDate(selectedKomisiData.tanggal_pasang)}</p>
                </div>
              </div>
              <div className="komisi-question">
                <h4>Komisi agen sudah diberikan?</h4>
                <p>Pilih status pembayaran komisi untuk agen <strong>{selectedKomisiData.agen}</strong></p>
              </div>
            </div>
            <div className="komisi-dialog-actions">
              <button 
                className="btn-komisi sudah"
                onClick={() => handleUpdateKomisi(true)}
              >
                <i className="bi bi-check-circle"></i>
                Sudah Dibayar
              </button>
              <button 
                className="btn-komisi belum"
                onClick={() => handleUpdateKomisi(false)}
              >
                <i className="bi bi-clock"></i>
                Belum Dibayar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Notification */}
      {notification.show && (
        <div className={`custom-notification ${notification.type} show`}>
          <div className="notification-content">
            <div className="notification-icon">
              <i className={`bi ${notification.icon}`}></i>
            </div>
            <div className="notification-text">
              <div className="notification-title">{notification.title}</div>
              <div className="notification-message">{notification.message}</div>
            </div>
            <button 
              className="notification-close"
              onClick={() => setNotification(prev => ({ ...prev, show: false }))}
            >
              <i className="bi bi-x"></i>
            </button>
          </div>
          <div className="notification-progress"></div>
        </div>
      )}
    </div>
  );
}

export default DaftarPemasangan;