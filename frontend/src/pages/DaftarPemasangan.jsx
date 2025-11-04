import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import './DaftarPemasangan.css';

// ✅ Clean logging utility dengan environment control
const isDev = import.meta.env.DEV;
const enableDebugLogs = import.meta.env.VITE_ENABLE_DEBUG_LOGS !== 'false';
const enableApiLogs = import.meta.env.VITE_ENABLE_API_LOGS !== 'false';

const log = {
  info: (...args) => (isDev && enableDebugLogs) && console.log('ℹ️', ...args),
  success: (...args) => (isDev && enableApiLogs) && console.log('✅', ...args),
  warn: (...args) => console.warn('⚠️', ...args),
  error: (...args) => console.error('❌', ...args),
  group: (title) => (isDev && enableDebugLogs) && console.group(`🔍 ${title}`),
  groupEnd: () => (isDev && enableDebugLogs) && console.groupEnd(),
  // API logging terpisah
  api: (...args) => (isDev && enableApiLogs) && console.log('🌐', ...args)
};

// Helper function untuk akses database auth_db melalui API
// Database: auth_db
// Tables: pemasangan, villages, agents
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

const getBaseApiUrl = () => {
  const apiPort = import.meta.env.VITE_API_PORT || '3000';
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  
  if (baseUrl) {
    return baseUrl;
  }
  
  // Auto-detect dari browser location
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  return `${protocol}//${hostname}:${apiPort}`;
};

// Helper function untuk validasi dan format token
const getValidToken = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.warn('No authentication token found');
    return null;
  }
  
  // Cek apakah token terlihat valid (tidak kosong, tidak hanya whitespace)
  if (typeof token !== 'string' || token.trim().length === 0) {
    console.warn('Invalid token format found');
    return null;
  }
  
  return token.trim();
};

// Helper function untuk handle authentication errors
const handleAuthError = (endpoint, error) => {
  log.error(`Authentication failed for ${endpoint}:`, error);
  
  // Check if user needs to re-login
  const token = localStorage.getItem('token');
  if (!token) {
    console.warn('No token found - user may need to login');
  } else {
    console.warn('Token exists but was rejected - may be expired or invalid');
    // Optionally clear invalid token
    // localStorage.removeItem('token');
  }
  
  // You could add notification or redirect to login here if needed
  // For now, we'll just log and continue with fallback data
};

// Modal Portal Component - Render modal outside .daftar-pemasangan container
const ModalPortal = ({ children }) => {
  return ReactDOM.createPortal(
    children,
    document.body
  );
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
    desa: '', // Akan diambil dari database auth_db.villages
    agen: '', // Akan diambil dari database auth_db.agents
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
  
  // State untuk edit pelanggan
  const [showEditModal, setShowEditModal] = useState(false);
  const [editPelanggan, setEditPelanggan] = useState({
    id: '',
    nama: '',
    telepon: '',
    alamat: '',
    desa: '',
    agen: '',
    tanggal_daftar: ''
  });
  
  // State untuk delete confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDeletePelanggan, setSelectedDeletePelanggan] = useState(null);
  
  // State untuk detail pelanggan modal
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDetailPelanggan, setSelectedDetailPelanggan] = useState(null);
  
  // State untuk daftar agen yang diambil dari database
  const [daftarAgen, setDaftarAgen] = useState([]);
  const [loadingAgen, setLoadingAgen] = useState(true);
  
  // State untuk daftar desa yang diambil dari database
  const [daftarDesa, setDaftarDesa] = useState([]);
  const [loadingDesa, setLoadingDesa] = useState(true);
  
  // State untuk authentication status
  const [authStatus, setAuthStatus] = useState({
    hasToken: false,
    isValid: null,
    lastChecked: null
  });

  // Debug function untuk memeriksa status authentication (hanya di development)
  const debugAuthStatus = () => {
    const token = localStorage.getItem('token');
    
    // Update auth status
    setAuthStatus({
      hasToken: !!token,
      isValid: null, // Will be determined by API calls
      lastChecked: new Date().toISOString()
    });
    
    // Hanya tampilkan debug info di development mode
    log.group('Authentication Status');
    log.info('Token exists:', !!token);
    if (token) {
      log.info('Token length:', token.length);
    } else {
      log.warn('No token found in localStorage');
    }
    log.groupEnd();
  };

  // Set default values setelah data dari database dimuat
  useEffect(() => {
    if (daftarDesa.length > 0 && newPelanggan.desa === '') {
      setNewPelanggan(prev => ({...prev, desa: daftarDesa[0]}));
    }
    if (daftarAgen.length > 0 && newPelanggan.agen === '') {
      setNewPelanggan(prev => ({...prev, agen: daftarAgen[0]}));
    }
  }, [daftarDesa, daftarAgen]);

  // Load data from database auth_db
  useEffect(() => {
    // Debug authentication status
    debugAuthStatus();
    
    // Fetch data dari database auth_db
    log.api('Loading data from database auth_db (pemasangan, villages, agents)');
    
    fetchPemasanganData();
    fetchDesaData();
    fetchAgentData();
  }, []);

  const fetchPemasanganData = async () => {
    try {
      const token = getValidToken();
      
      // Headers untuk request ke database
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
      
      // Tambahkan authorization header jika token tersedia
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      // Fetch dari database auth_db table pemasangan
      const response = await fetch(`${getApiUrl()}/pemasangan`, {
        method: 'GET',
        headers: headers
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Pastikan data adalah array
        if (Array.isArray(data)) {
          setPemasanganData(data);
          
          // Log success
          log.success('Pemasangan data loaded:', data.length, 'records');
          
          // Update auth status sebagai valid jika berhasil
          if (token) {
            setAuthStatus(prev => ({ ...prev, isValid: true }));
          }
        } else {
          log.warn('Invalid pemasangan data format from database');
          setPemasanganData([]);
        }
      } else if (response.status === 401) {
        handleAuthError('/pemasangan', 'Unauthorized access to pemasangan data');
        setAuthStatus(prev => ({ ...prev, isValid: false }));
        log.warn('Authentication failed for pemasangan data - please check login status');
        setPemasanganData([]);
      } else {
        log.error(`Failed to fetch pemasangan data: ${response.status} ${response.statusText}`);
        setPemasanganData([]);
      }
    } catch (error) {
      log.error('Network error fetching pemasangan data:', error);
      setPemasanganData([]);
    }
  };

  const fetchDesaData = async () => {
    setLoadingDesa(true);
    
    try {
      const token = getValidToken();
      
      // Jika tidak ada token valid, retry tanpa token atau tampilkan error
      if (!token) {
        console.warn('No valid authentication token found for villages data');
        // Set state bahwa tidak ada token
        setAuthStatus(prev => ({ ...prev, hasToken: false }));
        setDaftarDesa([]); // Kosongkan daftar desa
        return;
      }
      
      // Fetch dari database auth_db table villages
      const response = await fetch(`${getBaseApiUrl()}/api/villages`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Log villages data
        log.api('Villages data loaded:', data.length, 'villages');
        
        // Pastikan data adalah array
        if (Array.isArray(data) && data.length > 0) {
          // Ambil nama desa dari database - sesuaikan dengan struktur table villages
          const desaNames = [...new Set(data.map(village => 
            village.name || village.village_name || village.desa || village.nama_desa
          ))].filter(Boolean);
          
          if (desaNames.length > 0) {
            setDaftarDesa(desaNames);
            // Set default desa pertama dari database
            if (newPelanggan.desa === '') {
              setNewPelanggan(prev => ({...prev, desa: desaNames[0]}));
            }
            
            // Log success
            log.success('Villages loaded successfully:', desaNames.length, 'unique villages');
          } else {
            log.warn('No valid village names found in database response');
            setDaftarDesa([]);
          }
        } else {
          console.warn('Invalid or empty villages data from database');
          setDaftarDesa([]);
        }
      } else if (response.status === 401) {
        handleAuthError('/villages', 'Unauthorized access to villages data');
        setAuthStatus(prev => ({ ...prev, isValid: false }));
        setDaftarDesa([]);
      } else {
        log.error(`Failed to fetch villages: ${response.status} ${response.statusText}`);
        setDaftarDesa([]);
      }
    } catch (error) {
      log.error('Network error fetching villages:', error);
      setDaftarDesa([]);
    } finally {
      setLoadingDesa(false);
    }
  };

  const fetchAgentData = async () => {
    setLoadingAgen(true);
    
    try {
      const token = getValidToken();
      
      // Jika tidak ada token valid, retry tanpa token atau tampilkan error
      if (!token) {
        console.warn('No valid authentication token found for agents data');
        // Set state bahwa tidak ada token
        setAuthStatus(prev => ({ ...prev, hasToken: false }));
        setDaftarAgen([]); // Kosongkan daftar agent
        return;
      }
      
      // Fetch dari database auth_db table agents
      const response = await fetch(`${getBaseApiUrl()}/api/agents`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Log agents data
        log.api('Agents data loaded:', data.length, 'agents');
        
        // Pastikan data adalah array
        if (Array.isArray(data) && data.length > 0) {
          // Ambil nama agent dari database - sesuaikan dengan struktur table agents
          const agentNames = [...new Set(data.map(agent => 
            agent.name || agent.agent_name || agent.agen || agent.nama_agen
          ))].filter(Boolean);
          
          if (agentNames.length > 0) {
            setDaftarAgen(agentNames);
            
            // Log success
            log.success('Agents loaded successfully:', agentNames.length, 'unique agents');
          } else {
            log.warn('No valid agent names found in database response');
            setDaftarAgen([]);
          }
        } else {
          console.warn('Invalid or empty agents data from database');
          setDaftarAgen([]);
        }
      } else if (response.status === 401) {
        handleAuthError('/agents', 'Unauthorized access to agents data');
        setAuthStatus(prev => ({ ...prev, isValid: false }));
        setDaftarAgen([]);
      } else {
        log.error(`Failed to fetch agents: ${response.status} ${response.statusText}`);
        setDaftarAgen([]);
      }
    } catch (error) {
      log.error('Network error fetching agents:', error);
      setDaftarAgen([]);
    } finally {
      setLoadingAgen(false);
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

  // Optimize filtering with useMemo to prevent unnecessary re-computations
  const filteredDataForStats = useMemo(() => getFilteredDataForStats(), [pemasanganData, selectedMonth, selectedYear, filterDesa]);
  
  const stats = useMemo(() => ({
    total: filteredDataForStats.length,
    menunggu: filteredDataForStats.filter(p => p.status === 'menunggu').length,
    terpasang: filteredDataForStats.filter(p => p.status === 'terpasang').length
  }), [filteredDataForStats]);

  const filteredData = useMemo(() => {
    return pemasanganData.filter(pelanggan => {
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
  }, [pemasanganData, filterStatus, filterDesa, searchTerm, selectedMonth, selectedYear]);

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
          setNewPelanggan({ nama: '', telepon: '', alamat: '', desa: '', agen: '', tanggal_daftar: getCurrentDate() });
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

  const handleDeletePelanggan = (pelanggan) => {
    setSelectedDeletePelanggan(pelanggan);
    setShowDeleteModal(true);
  };

  const handleDetailPelanggan = (pelanggan) => {
    setSelectedDetailPelanggan(pelanggan);
    setShowDetailModal(true);
  };

  const confirmDeletePelanggan = async () => {
    if (!selectedDeletePelanggan) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${getApiUrl()}/pemasangan/${selectedDeletePelanggan.id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        await fetchPemasanganData(); // Refresh data
        setShowDeleteModal(false);
        setSelectedDeletePelanggan(null);
        showNotification(
          'success',
          'Pelanggan Berhasil Dihapus!',
          `Data pelanggan ${selectedDeletePelanggan.nama} telah dihapus dari sistem.`,
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
  };

  const handleEditPelanggan = async () => {
    // Validation
    if (!editPelanggan.nama.trim()) {
      alert('Nama pelanggan harus diisi');
      return;
    }
    if (!editPelanggan.telepon.trim()) {
      alert('Nomor telepon harus diisi');
      return;
    }
    if (!validatePhoneNumber(editPelanggan.telepon)) {
      alert('Format nomor telepon tidak valid. Contoh: 08123456789');
      return;
    }
    if (!editPelanggan.alamat.trim()) {
      alert('Alamat harus diisi');
      return;
    }
    if (!editPelanggan.agen.trim()) {
      alert('Agen harus dipilih');
      return;
    }
    if (!editPelanggan.desa.trim()) {
      alert('Desa harus dipilih');
      return;
    }
    if (!editPelanggan.tanggal_daftar) {
      alert('Tanggal daftar harus diisi');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${getApiUrl()}/pemasangan/${editPelanggan.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nama: editPelanggan.nama,
          telepon: editPelanggan.telepon,
          alamat: editPelanggan.alamat,
          desa: editPelanggan.desa,
          agen: editPelanggan.agen,
          tanggal_daftar: editPelanggan.tanggal_daftar
        })
      });
      
      if (response.ok) {
        await fetchPemasanganData(); // Refresh data
        setShowEditModal(false);
        setEditPelanggan({
          id: '',
          nama: '',
          telepon: '',
          alamat: '',
          desa: '',
          agen: '',
          tanggal_daftar: ''
        });
        showNotification(
          'success',
          'Data Berhasil Diperbarui!',
          `Data pelanggan ${editPelanggan.nama} telah berhasil diperbarui.`,
          'bi-check-circle'
        );
      } else {
        const error = await response.json();
        showNotification(
          'error',
          'Gagal Memperbarui Data!',
          error.message || 'Terjadi kesalahan saat memperbarui data pelanggan.',
          'bi-exclamation-triangle'
        );
      }
    } catch (error) {
      console.error('Error updating pelanggan:', error);
      showNotification(
        'error',
        'Koneksi Bermasalah!',
        'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.',
        'bi-wifi-off'
      );
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
    
    // Auto hide after 3 seconds with cleanup
    const timeoutId = setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 3000);
    
    // Cleanup function to prevent memory leaks
    return () => clearTimeout(timeoutId);
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
            {/* Tombol Tambah Pelanggan dipindahkan ke table-controls */}
          </div>
        </div>
      </div>

      {/* Authentication Status Warning */}
      {!authStatus.hasToken && (
        <div className="auth-warning">
          <div className="auth-warning-content">
            <i className="bi bi-exclamation-triangle"></i>
            <div className="auth-warning-text">
              <strong>Database Connection Notice:</strong> No authentication token found. Cannot load villages and agents data from database (auth_db). Please login to access complete data.
            </div>
          </div>
        </div>
      )}
      
      {/* Data Loading Status */}
      {(loadingDesa || loadingAgen) && (
        <div className="loading-notice">
          <div className="loading-content">
            <i className="bi bi-database-check"></i>
            <div className="loading-text">
              Loading data from database auth_db...
              {loadingDesa && <span>• Loading villages table</span>}
              {loadingAgen && <span>• Loading agents table</span>}
            </div>
          </div>
        </div>
      )}

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

      {/* Enhanced Filters and Search */}
      <div className="table-controls">
        <div className="controls-main">
          <div className="controls-left">
            {/* Enhanced Search */}
            <div className="search-wrapper">
              <input
                type="text"
                className="search-input"
                placeholder="Cari nama, telepon, atau alamat pelanggan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Enhanced Filters */}
            <div className="filters-group">
              <div className="filter-item">
                <select 
                  value={selectedMonth} 
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  className="filter-select"
                >
                  <option value={0}>Semua Bulan</option>
                  {monthNames.map((month, index) => (
                    <option key={index + 1} value={index + 1}>
                      {month}
                    </option>
                  ))}
                </select>
                <label className="filter-label">Bulan</label>
              </div>
              
              <div className="filter-item">
                <select 
                  value={selectedYear} 
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="filter-select"
                >
                  {getYearOptions().map(year => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                <label className="filter-label">Tahun</label>
              </div>
              
              <div className="filter-item">
                <select 
                  value={filterDesa} 
                  onChange={(e) => setFilterDesa(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">Semua Desa</option>
                  {daftarDesa.map((desa, index) => (
                    <option key={`filter-desa-${index}`} value={desa}>
                      {desa}
                    </option>
                  ))}
                </select>
                <label className="filter-label">Desa</label>
              </div>
            </div>
          </div>
          
          <div className="controls-right">
            {/* Enhanced Status Buttons */}
            <div className="status-buttons">
              <button 
                className={`status-filter-btn ${filterStatus === 'all' ? 'active semua' : ''}`}
                onClick={() => setFilterStatus('all')}
              >
                <span className="status-icon">📊</span>
                Semua
              </button>
              <button 
                className={`status-filter-btn ${filterStatus === 'menunggu' ? 'active menunggu' : ''}`}
                onClick={() => setFilterStatus('menunggu')}
              >
                <span className="status-icon">⏳</span>
                Menunggu
              </button>
              <button 
                className={`status-filter-btn ${filterStatus === 'terpasang' ? 'active terpasang' : ''}`}
                onClick={() => setFilterStatus('terpasang')}
              >
                <span className="status-icon">✅</span>
                Terpasang
              </button>
            </div>
            
            {/* Tombol Tambah Pelanggan */}
            <div className="add-customer-section">
              <button 
                className="btn btn-primary add-customer-btn"
                onClick={() => setShowAddModal(true)}
              >
                <i className="bi bi-plus-circle"></i>
                Tambah Pelanggan
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table - Desktop/Tablet */}
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
                    <div className="address-cell-full">
                      {pelanggan.alamat}
                    </div>
                  </td>
                  <td>
                    <div className="desa-cell">
                      <i className="bi bi-geo-alt"></i>
                      <span className="desa-name">{pelanggan.desa}</span>
                    </div>
                  </td>
                  <td>
                    <div className="agen-cell">
                      <i className="bi bi-person-badge"></i>
                      <span className="agen-name">{pelanggan.agen}</span>
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
                      <div className="komisi-status-horizontal">
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
                          className={`komisi-btn-compact ${pelanggan.komisi_dibayar ? 'mark-unpaid' : 'mark-paid'}`}
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
                    <div className="action-buttons-compact">
                      <div className="action-row-1">
                        {pelanggan.status === 'menunggu' && (
                          <button
                            className="action-btn-sm confirm"
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
                          className="action-btn-sm detail"
                          onClick={() => handleDetailPelanggan(pelanggan)}
                          title="Detail Pelanggan"
                        >
                          <i className="bi bi-info-circle"></i>
                        </button>
                      </div>
                      <div className="action-row-2">
                        <button
                          className="action-btn-sm edit"
                          onClick={() => {
                            setEditPelanggan({
                              id: pelanggan.id,
                              nama: pelanggan.nama,
                              telepon: pelanggan.telepon,
                              alamat: pelanggan.alamat,
                              desa: pelanggan.desa,
                              agen: pelanggan.agen,
                              tanggal_daftar: getTanggalDaftar(pelanggan) ? getTanggalDaftar(pelanggan).split('T')[0] : getCurrentDate()
                            });
                            setShowEditModal(true);
                          }}
                          title="Edit Pelanggan"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="action-btn-sm delete"
                          onClick={() => handleDeletePelanggan(pelanggan)}
                          title="Hapus Pelanggan"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card Layout - Responsive */}
      <div className="mobile-card-container">
        {filteredData.map((pelanggan, index) => (
          <div key={pelanggan.id} className="mobile-card">
            <div className="mobile-card-header">
              <div>
                <div className="mobile-card-title">{pelanggan.nama}</div>
                <div className="mobile-card-id">#{pelanggan.id}</div>
              </div>
              <span className={`mobile-card-status ${pelanggan.status === 'menunggu' ? 'pending' : 'confirmed'}`}>
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
            </div>
            
            <div className="mobile-card-details">
              <div className="mobile-card-detail">
                <div className="mobile-card-label">
                  <i className="bi bi-telephone"></i>
                  Telepon
                </div>
                <div className="mobile-card-value">{pelanggan.telepon}</div>
              </div>
              <div className="mobile-card-detail">
                <div className="mobile-card-label">
                  <i className="bi bi-geo"></i>
                  Desa
                </div>
                <div className="mobile-card-value">{pelanggan.desa}</div>
              </div>
              <div className="mobile-card-detail">
                <div className="mobile-card-label">
                  <i className="bi bi-person-badge"></i>
                  Agen
                </div>
                <div className="mobile-card-value">{pelanggan.agen}</div>
              </div>
              <div className="mobile-card-detail">
                <div className="mobile-card-label">
                  <i className="bi bi-calendar-plus"></i>
                  Tgl Daftar
                </div>
                <div className="mobile-card-value">{formatDate(getTanggalDaftar(pelanggan))}</div>
              </div>
              <div className="mobile-card-detail">
                <div className="mobile-card-label">
                  <i className="bi bi-calendar-check"></i>
                  Tgl Pasang
                </div>
                <div className="mobile-card-value">
                  {pelanggan.tanggal_pasang ? formatDate(pelanggan.tanggal_pasang) : 'Belum Terpasang'}
                </div>
              </div>
              <div className="mobile-card-detail">
                <div className="mobile-card-label">
                  <i className="bi bi-currency-dollar"></i>
                  Komisi Agen
                </div>
                <div className="mobile-card-value">
                  {pelanggan.status === 'terpasang' ? (
                    <span className={`mobile-komisi-badge ${pelanggan.komisi_dibayar ? 'dibayar' : 'belum'}`}>
                      {pelanggan.komisi_dibayar ? (
                        <>
                          <i className="bi bi-check-circle"></i>
                          Sudah Diberikan
                        </>
                      ) : (
                        <>
                          <i className="bi bi-exclamation-circle"></i>
                          Belum Diberikan
                        </>
                      )}
                    </span>
                  ) : (
                    <span className="mobile-komisi-badge pending">
                      <i className="bi bi-dash-circle"></i>
                      Menunggu
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mobile-card-detail mobile-card-alamat">
              <div className="mobile-card-label">
                <i className="bi bi-geo-alt"></i>
                Alamat Lengkap
              </div>
              <div className="mobile-card-value">{pelanggan.alamat}</div>
            </div>
            
            <div className="mobile-card-actions">
              <div className="mobile-actions-row-1">
                {pelanggan.status === 'menunggu' && (
                  <button
                    className="btn mobile-confirm"
                    onClick={() => {
                      setSelectedPelanggan(pelanggan);
                      setKonfirmasiData({
                        tanggal_pasang: getCurrentDate(),
                        jam_pasang: getCurrentTime(),
                        teknisi: '',
                        catatan: ''
                      });
                      setShowConfirmModal(true);
                    }}
                  >
                    <i className="bi bi-check-lg"></i> Konfirmasi
                  </button>
                )}
                <button
                  className="btn mobile-whatsapp"
                  onClick={() => openWhatsApp(pelanggan.telepon)}
                >
                  <i className="bi bi-whatsapp"></i> WhatsApp
                </button>
                {pelanggan.status === 'terpasang' && (
                  <button
                    className="btn mobile-komisi"
                    onClick={() => handleKomisiClick(pelanggan)}
                  >
                    <i className="bi bi-currency-dollar"></i>
                    {pelanggan.komisi_dibayar ? 'Belum' : 'Sudah'}
                  </button>
                )}
              </div>
              <div className="mobile-actions-row-2">
                <button
                  className="btn mobile-detail"
                  onClick={() => handleDetailPelanggan(pelanggan)}
                >
                  <i className="bi bi-info-circle"></i> Detail
                </button>
                <button
                  className="btn mobile-edit"
                  onClick={() => {
                    setEditPelanggan({
                      id: pelanggan.id,
                      nama: pelanggan.nama,
                      telepon: pelanggan.telepon,
                      alamat: pelanggan.alamat,
                      desa: pelanggan.desa,
                      agen: pelanggan.agen,
                      tanggal_daftar: getTanggalDaftar(pelanggan) ? getTanggalDaftar(pelanggan).split('T')[0] : getCurrentDate()
                    });
                    setShowEditModal(true);
                  }}
                >
                  <i className="bi bi-pencil"></i> Edit
                </button>
                <button
                  className="btn mobile-delete"
                  onClick={() => handleDeletePelanggan(pelanggan)}
                >
                  <i className="bi bi-trash"></i> Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <ModalPortal>
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
                  <label><i className="bi bi-person"></i>Nama Pelanggan</label>
                  <input
                    type="text"
                    value={newPelanggan.nama}
                    onChange={(e) => setNewPelanggan({...newPelanggan, nama: e.target.value})}
                    placeholder="Masukkan nama lengkap"
                  />
                </div>
                <div className="form-group">
                  <label><i className="bi bi-telephone"></i>Nomor Telepon</label>
                  <input
                    type="tel"
                    value={newPelanggan.telepon}
                    onChange={(e) => setNewPelanggan({...newPelanggan, telepon: e.target.value})}
                    placeholder="08xxxxxxxxxx"
                  />
                </div>
                <div className="form-group">
                  <label><i className="bi bi-geo-alt"></i>Alamat Lengkap</label>
                  <textarea
                    value={newPelanggan.alamat}
                    onChange={(e) => setNewPelanggan({...newPelanggan, alamat: e.target.value})}
                    placeholder="Masukkan alamat lengkap"
                    rows="3"
                  />
                </div>
                <div className="form-group">
                  <label><i className="bi bi-geo"></i>Nama Desa</label>
                  <select
                    value={newPelanggan.desa}
                    onChange={(e) => setNewPelanggan({...newPelanggan, desa: e.target.value})}
                    className="desa-select"
                    disabled={loadingDesa}
                  >
                    <option value="">
                      {loadingDesa ? "Memuat data desa..." : "-- Pilih Desa --"}
                    </option>
                    {daftarDesa.map((desa, index) => (
                      <option key={`add-desa-${index}`} value={desa}>
                        {desa}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label><i className="bi bi-person-badge"></i>Nama Agen</label>
                  <select
                    value={newPelanggan.agen}
                    onChange={(e) => setNewPelanggan({...newPelanggan, agen: e.target.value})}
                    className="agen-select"
                    disabled={loadingAgen}
                  >
                    <option value="">
                      {loadingAgen ? "Memuat data agen..." : "-- Pilih Agen --"}
                    </option>
                    {daftarAgen.map((agen, index) => (
                      <option key={`add-agen-${index}`} value={agen}>
                        {agen}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label><i className="bi bi-calendar-plus"></i>Tanggal Daftar</label>
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
        </ModalPortal>
      )}

      {/* Edit Customer Modal */}
      {showEditModal && (
        <ModalPortal>
          <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
            <div className="modal-content modal-content-compact" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3><i className="bi bi-pencil"></i> Edit Pelanggan</h3>
                <button className="modal-close" onClick={() => setShowEditModal(false)}>
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label><i className="bi bi-person"></i>Nama Pelanggan</label>
                  <input
                    type="text"
                    value={editPelanggan.nama}
                    onChange={(e) => setEditPelanggan({...editPelanggan, nama: e.target.value})}
                    placeholder="Masukkan nama lengkap"
                  />
                </div>
                <div className="form-group">
                  <label><i className="bi bi-telephone"></i>Nomor Telepon</label>
                  <input
                    type="tel"
                    value={editPelanggan.telepon}
                    onChange={(e) => setEditPelanggan({...editPelanggan, telepon: e.target.value})}
                    placeholder="08xxxxxxxxxx"
                  />
                </div>
                <div className="form-group">
                  <label><i className="bi bi-geo-alt"></i>Alamat Lengkap</label>
                  <textarea
                    value={editPelanggan.alamat}
                    onChange={(e) => setEditPelanggan({...editPelanggan, alamat: e.target.value})}
                    placeholder="Masukkan alamat lengkap"
                    rows="3"
                  />
                </div>
                <div className="form-group">
                  <label><i className="bi bi-geo"></i>Nama Desa</label>
                  <select
                    value={editPelanggan.desa}
                    onChange={(e) => setEditPelanggan({...editPelanggan, desa: e.target.value})}
                    className="desa-select"
                    disabled={loadingDesa}
                  >
                    <option value="">
                      {loadingDesa ? "Memuat data desa..." : "-- Pilih Desa --"}
                    </option>
                    {daftarDesa.map((desa, index) => (
                      <option key={`edit-desa-${index}`} value={desa}>
                        {desa}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label><i className="bi bi-person-badge"></i>Nama Agen</label>
                  <select
                    value={editPelanggan.agen}
                    onChange={(e) => setEditPelanggan({...editPelanggan, agen: e.target.value})}
                    className="agen-select"
                    disabled={loadingAgen}
                  >
                    <option value="">
                      {loadingAgen ? "Memuat data agen..." : "-- Pilih Agen --"}
                    </option>
                    {daftarAgen.map((agen, index) => (
                      <option key={`edit-agen-${index}`} value={agen}>
                        {agen}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label><i className="bi bi-calendar-plus"></i>Tanggal Daftar</label>
                  <input
                    type="date"
                    value={editPelanggan.tanggal_daftar}
                    onChange={(e) => setEditPelanggan({...editPelanggan, tanggal_daftar: e.target.value})}
                  />
                  <small className="form-help">
                    <i className="bi bi-info-circle"></i>
                    Ubah tanggal sesuai dengan tanggal pendaftaran yang sebenarnya.
                  </small>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                  Batal
                </button>
                <button className="btn btn-primary" onClick={handleEditPelanggan}>
                  <i className="bi bi-check-circle"></i>
                  Simpan Perubahan
                </button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && selectedPelanggan && (
        <ModalPortal>
          <div className="modal-overlay" onClick={() => setShowConfirmModal(false)}>
            <div className="modal-content modal-content-compact" onClick={(e) => e.stopPropagation()}>
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
                  <label><i className="bi bi-calendar-check"></i>Tanggal Pemasangan</label>
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
                  <label><i className="bi bi-clock"></i>Jam Pemasangan</label>
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
                  <label><i className="bi bi-person-gear"></i>Nama Teknisi <span className="required-field">*</span></label>
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
                  <label><i className="bi bi-journal-text"></i>Catatan Pemasangan</label>
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
        </ModalPortal>
      )}

      {/* Komisi Confirmation Dialog */}
      {showKomisiConfirm && selectedKomisiData && (
        <ModalPortal>
          <div className="modal-overlay" onClick={() => setShowKomisiConfirm(false)}>
            <div className="modal-content modal-komisi" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header modal-header-komisi">
                <div className="modal-icon-komisi">
                  <i className="bi bi-currency-dollar"></i>
                </div>
                <h3><i className="bi bi-currency-dollar"></i> Komisi Agen</h3>
                <button 
                  className="modal-close" 
                  onClick={() => setShowKomisiConfirm(false)}
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
              <div className="modal-body">
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
              <div className="modal-footer modal-footer-komisi">
                <button 
                  className="btn-komisi btn-success"
                  onClick={() => handleUpdateKomisi(true)}
                >
                  <i className="bi bi-check-circle"></i>
                  Sudah Dibayar
                </button>
                <button 
                  className="btn-komisi btn-warning"
                  onClick={() => handleUpdateKomisi(false)}
                >
                  <i className="bi bi-clock"></i>
                  Belum Dibayar
                </button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedDeletePelanggan && (
        <ModalPortal>
          <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
            <div className="modal-content modal-delete" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header modal-header-delete">
                <h3><i className="bi bi-exclamation-triangle"></i> Hapus Pelanggan</h3>
                <button 
                  className="modal-close" 
                  onClick={() => setShowDeleteModal(false)}
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
              <div className="modal-body">
                <div className="delete-customer-info">
                  <div className="delete-customer-avatar">
                    <i className="bi bi-person-circle"></i>
                  </div>
                  <div className="delete-customer-details">
                    <h4>{selectedDeletePelanggan.nama}</h4>
                    <p><i className="bi bi-telephone"></i> {selectedDeletePelanggan.telepon}</p>
                    <p><i className="bi bi-geo-alt"></i> {selectedDeletePelanggan.alamat}</p>
                  </div>
                </div>
                <div className="delete-warning">
                  <div className="warning-icon">
                    <i className="bi bi-shield-exclamation"></i>
                  </div>
                  <div className="warning-text">
                    <h4>Peringatan!</h4>
                    <p>Tindakan ini tidak dapat dibatalkan. Semua data pelanggan akan dihapus secara permanen dari sistem.</p>
                  </div>
                </div>
              </div>
              <div className="modal-footer modal-footer-delete">
                <button 
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteModal(false)}
                >
                  <i className="bi bi-x-circle"></i>
                  Batal
                </button>
                <button 
                  className="btn btn-danger"
                  onClick={confirmDeletePelanggan}
                >
                  <i className="bi bi-trash"></i>
                  Ya, Hapus Pelanggan
                </button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* Detail Pelanggan Modal */}
      {showDetailModal && selectedDetailPelanggan && (
        <ModalPortal>
          <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
            <div className="modal-content modal-detail modal-content-compact" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header modal-header-detail">
                <h3><i className="bi bi-info-circle"></i> Detail Pelanggan</h3>
                <button 
                  className="modal-close" 
                  onClick={() => setShowDetailModal(false)}
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
              <div className="modal-body">
                <div className="detail-customer-header">
                  <div className="detail-customer-avatar">
                    <i className="bi bi-person-circle"></i>
                  </div>
                  <div className="detail-customer-title">
                    <h2>{selectedDetailPelanggan.nama}</h2>
                    <span className={`detail-status-badge ${selectedDetailPelanggan.status}`}>
                      {selectedDetailPelanggan.status === 'menunggu' ? (
                        <>
                          <i className="bi bi-clock"></i>
                          Menunggu Pemasangan
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle"></i>
                          Sudah Terpasang
                        </>
                      )}
                    </span>
                  </div>
                </div>
                
                <div className="detail-info-grid">
                  <div className="detail-info-card">
                    <div className="detail-info-label">
                      <i className="bi bi-telephone"></i>
                      Nomor Telepon
                    </div>
                    <div className="detail-info-value">{selectedDetailPelanggan.telepon}</div>
                  </div>
                  
                  <div className="detail-info-card">
                    <div className="detail-info-label">
                      <i className="bi bi-geo-alt"></i>
                      Alamat Lengkap
                    </div>
                    <div className="detail-info-value">{selectedDetailPelanggan.alamat}</div>
                  </div>
                  
                  <div className="detail-info-card">
                    <div className="detail-info-label">
                      <i className="bi bi-geo"></i>
                      Desa
                    </div>
                    <div className="detail-info-value">{selectedDetailPelanggan.desa}</div>
                  </div>
                  
                  <div className="detail-info-card">
                    <div className="detail-info-label">
                      <i className="bi bi-person-badge"></i>
                      Agen
                    </div>
                    <div className="detail-info-value">{selectedDetailPelanggan.agen}</div>
                  </div>
                  
                  <div className="detail-info-card">
                    <div className="detail-info-label">
                      <i className="bi bi-calendar-plus"></i>
                      Tanggal Daftar
                    </div>
                    <div className="detail-info-value">{formatDate(getTanggalDaftar(selectedDetailPelanggan))}</div>
                  </div>
                  
                  <div className="detail-info-card">
                    <div className="detail-info-label">
                      <i className="bi bi-calendar-check"></i>
                      Tanggal Terpasang
                    </div>
                    <div className="detail-info-value">
                      {selectedDetailPelanggan.tanggal_pasang 
                        ? formatDate(selectedDetailPelanggan.tanggal_pasang)
                        : 'Belum Terpasang'
                      }
                    </div>
                  </div>
                  
                  <div className="detail-info-card">
                    <div className="detail-info-label">
                      <i className="bi bi-wrench"></i>
                      Teknisi
                    </div>
                    <div className="detail-info-value">
                      {selectedDetailPelanggan.teknisi || 'Belum Ditentukan'}
                    </div>
                  </div>
                  
                  <div className="detail-info-card">
                    <div className="detail-info-label">
                      <i className="bi bi-currency-dollar"></i>
                      Status Komisi Agen
                    </div>
                    <div className="detail-info-value">
                      {selectedDetailPelanggan.status === 'menunggu' ? (
                        <span className="detail-komisi-badge pending">
                          <i className="bi bi-dash-circle"></i>
                          Menunggu Pemasangan
                        </span>
                      ) : selectedDetailPelanggan.komisi_dibayar ? (
                        <span className="detail-komisi-badge dibayar">
                          <i className="bi bi-check-circle"></i>
                          Sudah Dibayar
                        </span>
                      ) : (
                        <span className="detail-komisi-badge belum">
                          <i className="bi bi-exclamation-circle"></i>
                          Belum Dibayar
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="detail-catatan-section">
                  <div className="detail-catatan-header">
                    <i className="bi bi-journal-text"></i>
                    Catatan
                  </div>
                  <div className="detail-catatan-content">
                    {selectedDetailPelanggan.catatan || 'Tidak ada catatan'}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  className="btn btn-secondary"
                  onClick={() => setShowDetailModal(false)}
                >
                  <i className="bi bi-x-circle"></i>
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </ModalPortal>
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