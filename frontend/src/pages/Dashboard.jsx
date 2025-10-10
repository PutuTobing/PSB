import React, { useState, useEffect, useMemo } from 'react';
import './Dashboard.css';

// Helper functions untuk akses database auth_db melalui API
const getApiUrl = () => {
  const host = window.location.hostname;
  if (host === 'localhost' || host === '127.0.0.1') {
    return 'http://localhost:3000/api';
  }
  return 'http://172.16.31.11:3000/api';
};

const getBaseApiUrl = () => {
  const host = window.location.hostname;
  if (host === 'localhost' || host === '127.0.0.1') {
    return 'http://localhost:3000';
  }
  return 'http://172.16.31.11:3000';
};

// Helper function untuk mendapatkan token yang valid
const getValidToken = () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    console.warn('No authentication token found');
    return null;
  }
  
  try {
    // Basic token validation (check if it's not empty and has proper structure)
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.warn('Invalid token structure');
      return null;
    }
    
    return token;
  } catch (error) {
    console.error('Error validating token:', error);
    return null;
  }
};

// Handle authentication errors
const handleAuthError = (endpoint, message) => {
  console.error(`Authentication error at ${endpoint}:`, message);
  // Optionally redirect to login or show auth error
};

function Dashboard() {
  const [pemasanganData, setPemasanganData] = useState([]);
  const [agentsData, setAgentsData] = useState([]);
  const [villagesData, setVillagesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch data dari database
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          fetchPemasanganData(),
          fetchAgentsData(),
          fetchVillagesData()
        ]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Gagal memuat data dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
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
        console.log('Pemasangan data fetched from database:', data);
        
        // Pastikan data adalah array
        if (Array.isArray(data)) {
          setPemasanganData(data);
        } else {
          console.warn('Invalid pemasangan data format from database');
          setPemasanganData([]);
        }
      } else if (response.status === 401) {
        handleAuthError('/pemasangan', 'Unauthorized access to pemasangan data');
        setPemasanganData([]);
      } else {
        console.error(`Failed to fetch pemasangan from database: ${response.status} ${response.statusText}`);
        setPemasanganData([]);
      }
    } catch (error) {
      console.error('Network error fetching pemasangan data from database:', error);
      setPemasanganData([]);
    }
  };

  const fetchAgentsData = async () => {
    try {
      const token = getValidToken();
      
      if (!token) {
        console.warn('No valid authentication token found for agents data');
        setAgentsData([]);
        return;
      }

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
        console.log('Agents data fetched from database:', data);
        setAgentsData(Array.isArray(data) ? data : []);
      } else if (response.status === 401) {
        handleAuthError('/agents', 'Unauthorized access to agents data');
        setAgentsData([]);
      } else {
        console.error(`Failed to fetch agents from database: ${response.status} ${response.statusText}`);
        setAgentsData([]);
      }
    } catch (error) {
      console.error('Error fetching agents data:', error);
      setAgentsData([]);
    }
  };

  const fetchVillagesData = async () => {
    try {
      const token = getValidToken();
      
      if (!token) {
        console.warn('No valid authentication token found for villages data');
        setVillagesData([]);
        return;
      }

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
        console.log('Villages data fetched from database:', data);
        setVillagesData(Array.isArray(data) ? data : []);
      } else if (response.status === 401) {
        handleAuthError('/villages', 'Unauthorized access to villages data');
        setVillagesData([]);
      } else {
        console.error(`Failed to fetch villages from database: ${response.status} ${response.statusText}`);
        setVillagesData([]);
      }
    } catch (error) {
      console.error('Error fetching villages data:', error);
      setVillagesData([]);
    }
  };

  // Helper functions untuk mendapatkan tanggal
  const getCurrentDate = () => new Date();
  const getStartOfWeek = (date) => {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day;
    return new Date(start.setDate(diff));
  };

  const getWeekNumber = (date) => {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const diff = date.getDate() - start.getDate();
    return Math.ceil((diff + start.getDay() + 1) / 7);
  };

  // Statistik utama
  const mainStats = useMemo(() => {
    const total = pemasanganData.length;
    const menunggu = pemasanganData.filter(p => p.status === 'menunggu').length;
    const terpasang = pemasanganData.filter(p => p.status === 'terpasang').length;
    
    return { total, menunggu, terpasang };
  }, [pemasanganData]);

  // Helper function untuk mendapatkan tanggal daftar
  const getTanggalDaftar = (pelanggan) => {
    return pelanggan.tanggal_daftar || 
           pelanggan.created_at || 
           pelanggan.createdAt || 
           pelanggan.date_created ||
           pelanggan.registration_date;
  };

  // Data mingguan untuk bulan ini
  const weeklyData = useMemo(() => {
    const currentDate = getCurrentDate();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    const weeks = [1, 2, 3, 4, 5].map(weekNum => {
      const weekData = pemasanganData.filter(p => {
        const tanggalDaftar = getTanggalDaftar(p);
        if (!tanggalDaftar) return false;
        
        const date = new Date(tanggalDaftar);
        if (isNaN(date.getTime())) return false;
        
        return date.getMonth() === currentMonth && 
               date.getFullYear() === currentYear && 
               getWeekNumber(date) === weekNum;
      });
      
      return {
        week: weekNum,
        total: weekData.length,
        menunggu: weekData.filter(p => p.status === 'menunggu').length,
        terpasang: weekData.filter(p => p.status === 'terpasang').length
      };
    });
    
    return weeks.filter(w => w.total > 0 || w.week <= getWeekNumber(currentDate));
  }, [pemasanganData]);

  // Perbandingan bulan ini vs bulan lalu
  const monthlyComparison = useMemo(() => {
    const currentDate = getCurrentDate();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const currentMonthData = pemasanganData.filter(p => {
      const tanggalDaftar = getTanggalDaftar(p);
      if (!tanggalDaftar) return false;
      
      const date = new Date(tanggalDaftar);
      if (isNaN(date.getTime())) return false;
      
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    const lastMonthData = pemasanganData.filter(p => {
      const tanggalDaftar = getTanggalDaftar(p);
      if (!tanggalDaftar) return false;
      
      const date = new Date(tanggalDaftar);
      if (isNaN(date.getTime())) return false;
      
      return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
    });

    const monthNames = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    return {
      current: {
        name: monthNames[currentMonth],
        total: currentMonthData.length,
        menunggu: currentMonthData.filter(p => p.status === 'menunggu').length,
        terpasang: currentMonthData.filter(p => p.status === 'terpasang').length
      },
      last: {
        name: monthNames[lastMonth],
        total: lastMonthData.length,
        menunggu: lastMonthData.filter(p => p.status === 'menunggu').length,
        terpasang: lastMonthData.filter(p => p.status === 'terpasang').length
      }
    };
  }, [pemasanganData]);

  // Statistik per agent
  const agentStats = useMemo(() => {
    const stats = {};
    
    // Initialize semua agent dengan 0
    agentsData.forEach(agent => {
      const agentName = agent.name || agent.agent_name || agent.agen || agent.nama_agen || 'Unknown';
      stats[agentName] = {
        name: agentName,
        total: 0,
        menunggu: 0,
        terpasang: 0,
        phone: agent.phone || agent.telepon || '',
        email: agent.email || ''
      };
    });

    // Hitung pelanggan per agent dari semua data pelanggan
    pemasanganData.forEach(p => {
      const agentName = p.agen || p.agent || p.nama_agen || 'Unknown';
      
      // Jika agent tidak ada di stats, tambahkan
      if (!stats[agentName]) {
        stats[agentName] = {
          name: agentName,
          total: 0,
          menunggu: 0,
          terpasang: 0,
          phone: '',
          email: ''
        };
      }
      
      stats[agentName].total++;
      if (p.status === 'menunggu') stats[agentName].menunggu++;
      if (p.status === 'terpasang') stats[agentName].terpasang++;
    });

    return Object.values(stats)
      .filter(agent => agent.total > 0) // Hanya tampilkan agent yang memiliki pelanggan
      .sort((a, b) => b.total - a.total);
  }, [pemasanganData, agentsData]);

  // Statistik per desa
  const villageStats = useMemo(() => {
    const currentDate = getCurrentDate();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const stats = {};

    // Initialize semua desa dari database
    villagesData.forEach(village => {
      const villageName = village.name || village.village_name || village.desa || village.nama_desa || 'Unknown';
      stats[villageName] = {
        name: villageName,
        kecamatan: village.kecamatan || village.district || '',
        kabupaten: village.kabupaten || village.regency || '',
        currentMonth: 0,
        lastMonth: 0,
        total: 0,
        growth: 0
      };
    });

    // Hitung pelanggan per desa dari semua data pelanggan
    pemasanganData.forEach(p => {
      const villageName = p.desa || p.village || p.nama_desa || 'Unknown';
      const tanggalDaftar = getTanggalDaftar(p);
      
      // Jika desa tidak ada di stats, tambahkan
      if (!stats[villageName]) {
        stats[villageName] = {
          name: villageName,
          kecamatan: '',
          kabupaten: '',
          currentMonth: 0,
          lastMonth: 0,
          total: 0,
          growth: 0
        };
      }
      
      stats[villageName].total++;
      
      // Validasi tanggal
      if (tanggalDaftar) {
        const date = new Date(tanggalDaftar);
        if (!isNaN(date.getTime())) {
          if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
            stats[villageName].currentMonth++;
          }
          
          if (date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear) {
            stats[villageName].lastMonth++;
          }
        }
      }
    });

    // Hitung growth rate
    Object.keys(stats).forEach(villageName => {
      const village = stats[villageName];
      if (village.lastMonth > 0) {
        village.growth = ((village.currentMonth - village.lastMonth) / village.lastMonth) * 100;
      } else if (village.currentMonth > 0) {
        village.growth = 100; // 100% growth jika bulan lalu 0
      } else {
        village.growth = 0;
      }
    });

    return Object.values(stats)
      .filter(v => v.total > 0) // Hanya tampilkan desa yang memiliki pelanggan
      .sort((a, b) => b.total - a.total);
  }, [pemasanganData, villagesData]);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner">
          <i className="bi bi-arrow-clockwise"></i>
        </div>
        <p>Memuat data dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <div className="error-icon">
          <i className="bi bi-exclamation-triangle"></i>
        </div>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="btn btn-primary">
          Muat Ulang
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-info">
            <div className="header-icon">
              <i className="bi bi-speedometer2"></i>
            </div>
            <div className="header-text">
              <h1>Dashboard Beranda</h1>
              <p>Pantau statistik pemasangan dan performa bisnis secara real-time</p>
            </div>
          </div>
          <div className="header-date">
            <i className="bi bi-calendar-event"></i>
            <span>{new Date().toLocaleDateString('id-ID', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="stats-overview">
        <div className="stat-card total">
          <div className="stat-icon">
            <i className="bi bi-people-fill"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number">{mainStats.total}</div>
            <div className="stat-label">Total Pelanggan</div>
            <div className="stat-trend">
              <i className="bi bi-graph-up"></i>
              Semua waktu
            </div>
          </div>
        </div>
        
        <div className="stat-card menunggu">
          <div className="stat-icon">
            <i className="bi bi-clock-history"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number">{mainStats.menunggu}</div>
            <div className="stat-label">Menunggu Pemasangan</div>
            <div className="stat-trend">
              <i className="bi bi-hourglass-split"></i>
              Dalam antrian
            </div>
          </div>
        </div>
        
        <div className="stat-card terpasang">
          <div className="stat-icon">
            <i className="bi bi-check-circle-fill"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number">{mainStats.terpasang}</div>
            <div className="stat-label">Sudah Terpasang</div>
            <div className="stat-trend">
              <i className="bi bi-check-all"></i>
              Selesai dipasang
            </div>
          </div>
        </div>
      </div>

      {/* Modern Dashboard Grid */}
      <div className="dashboard-grid">
        {/* Donut Chart - Installation Status */}
        <div className="chart-card donut-chart-card">
          <div className="chart-header">
            <h3>Status Pemasangan</h3>
            <div className="chart-subtitle">Distribusi status pelanggan</div>
          </div>
          <div className="chart-content">
            <div className="donut-chart-container">
              <div className="donut-chart">
                <svg viewBox="0 0 100 100" className="donut-svg">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#e0e7ff"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="url(#gradient-terpasang)"
                    strokeWidth="8"
                    strokeDasharray={`${(mainStats.terpasang / Math.max(1, mainStats.total)) * 251.2} 251.2`}
                    strokeDashoffset="0"
                    transform="rotate(-90 50 50)"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="32"
                    fill="none"
                    stroke="url(#gradient-menunggu)"
                    strokeWidth="6"
                    strokeDasharray={`${(mainStats.menunggu / Math.max(1, mainStats.total)) * 201.06} 201.06`}
                    strokeDashoffset="0"
                    transform="rotate(-90 50 50)"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradient-terpasang" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#34d399" />
                    </linearGradient>
                    <linearGradient id="gradient-menunggu" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#fbbf24" />
                    </linearGradient>
                  </defs>
                  <text x="50" y="45" textAnchor="middle" className="donut-percentage">
                    {Math.round((mainStats.terpasang / Math.max(1, mainStats.total)) * 100)}%
                  </text>
                  <text x="50" y="55" textAnchor="middle" className="donut-label">
                    Terpasang
                  </text>
                </svg>
              </div>
              <div className="donut-stats">
                <div className="donut-stat">
                  <div className="stat-dot terpasang"></div>
                  <div className="stat-info">
                    <span className="stat-value">{mainStats.terpasang}</span>
                    <span className="stat-label">Terpasang</span>
                  </div>
                </div>
                <div className="donut-stat">
                  <div className="stat-dot menunggu"></div>
                  <div className="stat-info">
                    <span className="stat-value">{mainStats.menunggu}</span>
                    <span className="stat-label">Menunggu</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Line Chart - Monthly Trend */}
        <div className="chart-card line-chart-card">
          <div className="chart-header">
            <h3>Tren Bulanan</h3>
            <div className="chart-subtitle">Pemasangan 6 bulan terakhir</div>
          </div>
          <div className="chart-content">
            <div className="line-chart-container">
              <svg viewBox="0 0 400 200" className="line-chart-svg">
                <defs>
                  <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#7c3aed" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                  <linearGradient id="area-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgba(124, 58, 237, 0.3)" />
                    <stop offset="100%" stopColor="rgba(124, 58, 237, 0.05)" />
                  </linearGradient>
                </defs>
                {/* Grid lines */}
                <g className="grid-lines">
                  {[0, 1, 2, 3, 4].map(i => (
                    <line key={i} x1="50" y1={40 + i * 30} x2="350" y2={40 + i * 30} stroke="#f1f5f9" strokeWidth="1"/>
                  ))}
                </g>
                {/* Area under curve */}
                <path
                  d="M50,160 L100,140 L150,120 L200,100 L250,90 L300,70 L350,60 L350,180 L50,180 Z"
                  fill="url(#area-gradient)"
                />
                {/* Line */}
                <path
                  d="M50,160 L100,140 L150,120 L200,100 L250,90 L300,70 L350,60"
                  fill="none"
                  stroke="url(#line-gradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Data points */}
                {[
                  {x: 50, y: 160, value: monthlyComparison.last.total || 12},
                  {x: 100, y: 140, value: 18},
                  {x: 150, y: 120, value: 24},
                  {x: 200, y: 100, value: 32},
                  {x: 250, y: 90, value: 38},
                  {x: 300, y: 70, value: 45},
                  {x: 350, y: 60, value: monthlyComparison.current.total || 52}
                ].map((point, index) => (
                  <g key={index}>
                    <circle cx={point.x} cy={point.y} r="4" fill="white" stroke="url(#line-gradient)" strokeWidth="2"/>
                    <circle cx={point.x} cy={point.y} r="2" fill="url(#line-gradient)"/>
                  </g>
                ))}
              </svg>
              <div className="chart-legend">
                <div className="legend-item">
                  <div className="legend-dot"></div>
                  <span>Pemasangan Bulanan</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bar Chart - Weekly Performance */}
        <div className="chart-card bar-chart-card">
          <div className="chart-header">
            <h3>Performa Mingguan</h3>
            <div className="chart-subtitle">Minggu ini vs minggu lalu</div>
          </div>
          <div className="chart-content">
            <div className="bar-chart-container">
              <div className="bars-grid">
                {weeklyData.map((week, index) => (
                  <div key={week.week} className="bar-group">
                    <div className="bar-container-vertical">
                      <div 
                        className="bar-vertical terpasang" 
                        style={{
                          height: `${Math.max(10, (week.terpasang / Math.max(1, Math.max(...weeklyData.map(w => w.total)))) * 100)}%`,
                          animationDelay: `${index * 0.1}s`
                        }}
                        data-value={week.terpasang}
                      >
                        <div className="bar-value">{week.terpasang}</div>
                      </div>
                      <div 
                        className="bar-vertical menunggu" 
                        style={{
                          height: `${Math.max(10, (week.menunggu / Math.max(1, Math.max(...weeklyData.map(w => w.total)))) * 100)}%`,
                          animationDelay: `${index * 0.1 + 0.05}s`
                        }}
                        data-value={week.menunggu}
                      >
                        <div className="bar-value">{week.menunggu}</div>
                      </div>
                    </div>
                    <div className="bar-label">W{week.week}</div>
                  </div>
                ))}
              </div>
              <div className="chart-legend">
                <div className="legend-item">
                  <div className="legend-color terpasang"></div>
                  <span>Terpasang</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color menunggu"></div>
                  <span>Menunggu</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Cards - Top Agents */}
        <div className="chart-card progress-card">
          <div className="chart-header">
            <h3>Top Agent</h3>
            <div className="chart-subtitle">Performa terbaik bulan ini</div>
          </div>
          <div className="chart-content">
            <div className="progress-list">
              {agentStats.slice(0, 5).map((agent, index) => (
                <div key={agent.name} className="progress-item">
                  <div className="progress-info">
                    <div className="progress-rank">#{index + 1}</div>
                    <div className="progress-details">
                      <div className="progress-name">{agent.name}</div>
                      <div className="progress-meta">{agent.total} pelanggan</div>
                    </div>
                  </div>
                  <div className="progress-visual">
                    <div className="progress-bar-container">
                      <div 
                        className="progress-bar-fill"
                        style={{
                          width: `${Math.max(10, (agent.total / Math.max(1, Math.max(...agentStats.map(a => a.total)))) * 100)}%`,
                          animationDelay: `${index * 0.1}s`
                        }}
                      ></div>
                    </div>
                    <div className="progress-value">{agent.total}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Gauge Chart - Monthly Target */}
        <div className="chart-card gauge-chart-card">
          <div className="chart-header">
            <h3>Target Bulanan</h3>
            <div className="chart-subtitle">Progress target pemasangan</div>
          </div>
          <div className="chart-content">
            <div className="gauge-container">
              <div className="gauge-chart">
                <svg viewBox="0 0 200 120" className="gauge-svg">
                  <defs>
                    <linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#ef4444" />
                      <stop offset="50%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>
                  {/* Background arc */}
                  <path
                    d="M 20 100 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="12"
                    strokeLinecap="round"
                  />
                  {/* Progress arc */}
                  <path
                    d="M 20 100 A 80 80 0 0 1 140 40"
                    fill="none"
                    stroke="url(#gauge-gradient)"
                    strokeWidth="12"
                    strokeLinecap="round"
                    className="gauge-progress"
                  />
                  {/* Center text */}
                  <text x="100" y="85" textAnchor="middle" className="gauge-percentage">
                    {Math.round((mainStats.total / 100) * 100)}%
                  </text>
                  <text x="100" y="100" textAnchor="middle" className="gauge-label">
                    dari target
                  </text>
                </svg>
              </div>
              <div className="gauge-stats">
                <div className="gauge-stat">
                  <span className="gauge-stat-value">{mainStats.total}</span>
                  <span className="gauge-stat-label">Tercapai</span>
                </div>
                <div className="gauge-stat">
                  <span className="gauge-stat-value">100</span>
                  <span className="gauge-stat-label">Target</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Heat Map - Village Performance */}
        <div className="chart-card heatmap-card">
          <div className="chart-header">
            <h3>Performa Desa</h3>
            <div className="chart-subtitle">Distribusi pemasangan per desa</div>
          </div>
          <div className="chart-content">
            <div className="heatmap-container">
              <div className="heatmap-grid">
                {villageStats.slice(0, 8).map((village, index) => {
                  const intensity = village.total / Math.max(1, Math.max(...villageStats.map(v => v.total)));
                  return (
                    <div 
                      key={village.name} 
                      className="heatmap-cell"
                      style={{
                        backgroundColor: `rgba(124, 58, 237, ${Math.max(0.1, intensity)})`,
                        animationDelay: `${index * 0.05}s`
                      }}
                    >
                      <div className="heatmap-value">{village.total}</div>
                      <div className="heatmap-label">{village.name}</div>
                      <div className={`heatmap-growth ${village.growth > 0 ? 'positive' : village.growth < 0 ? 'negative' : 'neutral'}`}>
                        <i className={`bi ${village.growth > 0 ? 'bi-arrow-up' : village.growth < 0 ? 'bi-arrow-down' : 'bi-dash'}`}></i>
                        {Math.abs(village.growth).toFixed(0)}%
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="heatmap-legend">
                <span>Rendah</span>
                <div className="heatmap-scale">
                  <div className="scale-gradient"></div>
                </div>
                <span>Tinggi</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Agent & Village Stats */}
      <div className="performance-grid">
        {/* Agent Performance */}
        <div className="performance-card agents-performance">
          <div className="performance-header">
            <div className="performance-title">
              <i className="bi bi-person-badge"></i>
              <h3>Performa Agent</h3>
            </div>
            <div className="performance-subtitle">
              Pelanggan yang didapat per agent
            </div>
          </div>
          <div className="performance-content">
            <div className="agents-grid">
              {agentStats.map((agent, index) => (
                <div key={agent.name} className="agent-card">
                  <div className="agent-rank">#{index + 1}</div>
                  <div className="agent-info">
                    <div className="agent-avatar">
                      <i className="bi bi-person-circle"></i>
                    </div>
                    <div className="agent-details">
                      <h4 className="agent-name">{agent.name}</h4>
                      {agent.phone && (
                        <div className="agent-contact">
                          <i className="bi bi-telephone"></i>
                          {agent.phone}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="agent-stats">
                    <div className="agent-total">{agent.total}</div>
                    <div className="agent-breakdown">
                      <span className="stat-item terpasang">
                        <i className="bi bi-check-circle"></i>
                        {agent.terpasang}
                      </span>
                      <span className="stat-item menunggu">
                        <i className="bi bi-clock"></i>
                        {agent.menunggu}
                      </span>
                    </div>
                  </div>
                  <div className="agent-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{width: `${Math.max(10, (agent.total / Math.max(1, Math.max(...agentStats.map(a => a.total)))) * 100)}%`}}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Village Performance */}
        <div className="performance-card villages-performance">
          <div className="performance-header">
            <div className="performance-title">
              <i className="bi bi-geo-alt"></i>
              <h3>Statistik Desa</h3>
            </div>
            <div className="performance-subtitle">
              Pemasangan per desa dan pertumbuhannya
            </div>
          </div>
          <div className="performance-content">
            <div className="villages-grid">
              {villageStats.map((village, index) => (
                <div key={village.name} className="village-card">
                  <div className="village-rank">#{index + 1}</div>
                  <div className="village-info">
                    <div className="village-icon">
                      <i className="bi bi-houses"></i>
                    </div>
                    <div className="village-details">
                      <h4 className="village-name">{village.name}</h4>
                      <div className="village-location">
                        <i className="bi bi-geo"></i>
                        {village.kecamatan}
                      </div>
                    </div>
                  </div>
                  <div className="village-stats">
                    <div className="village-total">{village.total}</div>
                    <div className="village-monthly">
                      <div className="monthly-stats">
                        <span className="current-month">{village.currentMonth} bulan ini</span>
                        <span className="last-month">{village.lastMonth} bulan lalu</span>
                      </div>
                      <div className={`growth-badge ${village.growth > 0 ? 'positive' : village.growth < 0 ? 'negative' : 'neutral'}`}>
                        <i className={`bi ${village.growth > 0 ? 'bi-arrow-up' : village.growth < 0 ? 'bi-arrow-down' : 'bi-dash'}`}></i>
                        {Math.abs(village.growth).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  <div className="village-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{width: `${Math.max(10, (village.total / Math.max(1, Math.max(...villageStats.map(v => v.total)))) * 100)}%`}}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
