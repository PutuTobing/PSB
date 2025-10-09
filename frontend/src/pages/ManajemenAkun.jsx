import React, { useState, useEffect } from 'react';
import './ManajemenAkun.css';

const ManajemenAkun = () => {
    // State untuk tab aktif
    const [activeTab, setActiveTab] = useState('konfigurasi');
    const [activeSubTab, setActiveSubTab] = useState('users');
    
    // State untuk data
    const [currentUser, setCurrentUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [agents, setAgents] = useState([]);
    const [villages, setVillages] = useState([]);
    const [activityLogs, setActivityLogs] = useState([]);
    
    // State untuk modal
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showUserModal, setShowUserModal] = useState(false);
    const [showEditProfileModal, setShowEditProfileModal] = useState(false);
    const [showAgentModal, setShowAgentModal] = useState(false);
    const [showVillageModal, setShowVillageModal] = useState(false);
    const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDeleteAgentModal, setShowDeleteAgentModal] = useState(false);
    const [showDeleteVillageModal, setShowDeleteVillageModal] = useState(false);
    
    // State untuk form
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [profileForm, setProfileForm] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });
    const [userForm, setUserForm] = useState({
        name: '',
        email: '',
        password: '',
        role: 'User',
        phone: '',
        address: ''
    });
    const [agentForm, setAgentForm] = useState({
        name: '',
        phone: '',
        email: '',
        address: ''
    });
    const [villageForm, setVillageForm] = useState({
        name: '',
        kecamatan: '',
        kabupaten: ''
    });
    const [resetPasswordForm, setResetPasswordForm] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    
    // State untuk edit mode
    const [editingUser, setEditingUser] = useState(null);
    const [editingAgent, setEditingAgent] = useState(null);
    const [editingVillage, setEditingVillage] = useState(null);
    const [resettingUser, setResettingUser] = useState(null);
    const [deletingUser, setDeletingUser] = useState(null);
    const [deletingAgent, setDeletingAgent] = useState(null);
    const [deletingVillage, setDeletingVillage] = useState(null);
    
    // State untuk loading dan notification
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState(null);

    // Fungsi untuk load data saat komponen dimount
    useEffect(() => {
        const initializeData = async () => {
            await loadCurrentUser();
            // Load admin data only after we know the user role
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            if (user.role === 'Administrator') {
                loadUsers();
                loadAgents();
                loadVillages();
                loadActivityLogs();
            }
        };
        
        initializeData();
    }, []);

    // Load admin data when currentUser changes
    useEffect(() => {
        if (currentUser && currentUser.role === 'Administrator') {
            loadUsers();
            loadAgents();
            loadVillages();
            loadActivityLogs();
        }
    }, [currentUser]);

    // Fungsi untuk load current user profile
    const loadCurrentUser = async () => {
        try {
            const token = localStorage.getItem('token');
            
            // Check if token exists
            if (!token) {
                showNotification('Silakan login terlebih dahulu', 'error');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
                return;
            }

            const response = await fetch('http://localhost:3000/auth/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const userData = await response.json();
                setCurrentUser(userData);
                setProfileForm({
                    name: userData.name || '',
                    email: userData.email || '',
                    phone: userData.phone || '',
                    address: userData.address || ''
                });
            } else if (response.status === 401) {
                showNotification('Sesi telah berakhir. Silakan login ulang.', 'error');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            } else {
                showNotification('Gagal memuat profil pengguna', 'error');
            }
        } catch (error) {
            showNotification('Terjadi kesalahan saat memuat profil', 'error');
        }
    };

    // Fungsi untuk load users (hanya untuk admin)
    const loadUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            
            // Check if token exists
            if (!token) {
                showNotification('Silakan login terlebih dahulu', 'error');
                return;
            }

            const response = await fetch('http://localhost:3000/users', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const usersData = await response.json();
                setUsers(usersData);
            } else if (response.status === 401) {
                showNotification('Sesi telah berakhir. Silakan login ulang.', 'error');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            } else if (response.status === 403) {
                showNotification('Akses ditolak. Hanya administrator yang dapat mengakses fitur ini.', 'error');
            } else {
                showNotification('Gagal memuat data pengguna', 'error');
            }
        } catch (error) {
            showNotification('Terjadi kesalahan saat memuat data pengguna', 'error');
        }
    };

    // Fungsi untuk load agents
    const loadAgents = async () => {
        try {
            const token = localStorage.getItem('token');
            
            // Check if token exists
            if (!token) {
                showNotification('Silakan login terlebih dahulu', 'error');
                return;
            }

            const response = await fetch('http://localhost:3000/agents', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const agentsData = await response.json();
                setAgents(agentsData);
            } else if (response.status === 401) {
                showNotification('Sesi telah berakhir. Silakan login ulang.', 'error');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            } else {
                showNotification('Gagal memuat data agent', 'error');
            }
        } catch (error) {
            showNotification('Terjadi kesalahan saat memuat data agent', 'error');
        }
    };

    // Fungsi untuk load villages
    const loadVillages = async () => {
        try {
            const token = localStorage.getItem('token');
            
            // Check if token exists
            if (!token) {
                showNotification('Silakan login terlebih dahulu', 'error');
                return;
            }

            const response = await fetch('http://localhost:3000/villages', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const villagesData = await response.json();
                setVillages(villagesData);
            } else if (response.status === 401) {
                showNotification('Sesi telah berakhir. Silakan login ulang.', 'error');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            } else {
                showNotification('Gagal memuat data desa', 'error');
            }
        } catch (error) {
            showNotification('Terjadi kesalahan saat memuat data desa', 'error');
        }
    };

    // Fungsi untuk load activity logs
    const loadActivityLogs = async () => {
        try {
            const token = localStorage.getItem('token');
            
            // Check if token exists
            if (!token) {
                showNotification('Silakan login terlebih dahulu', 'error');
                return;
            }

            const response = await fetch('http://localhost:3000/activity-logs', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const logsData = await response.json();
                setActivityLogs(logsData);
            } else if (response.status === 401) {
                showNotification('Sesi telah berakhir. Silakan login ulang.', 'error');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            } else if (response.status === 403) {
                showNotification('Akses ditolak. Hanya administrator yang dapat mengakses log aktivitas.', 'error');
            } else {
                showNotification('Gagal memuat log aktivitas', 'error');
            }
        } catch (error) {
            showNotification('Terjadi kesalahan saat memuat log aktivitas', 'error');
        }
    };

    // Fungsi untuk show notification
    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 5000);
    };

    // Helper function untuk handle auth errors
    const handleAuthError = (response) => {
        if (response.status === 401) {
            showNotification('Sesi telah berakhir. Silakan login ulang.', 'error');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
            return true;
        } else if (response.status === 403) {
            showNotification('Akses ditolak. Anda tidak memiliki izin untuk melakukan aksi ini.', 'error');
            return true;
        }
        return false;
    };

    // Helper function untuk check token
    const checkTokenExists = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            showNotification('Silakan login terlebih dahulu', 'error');
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
            return false;
        }
        return true;
    };

    // Fungsi untuk handle change password
    const handleChangePassword = async (e) => {
        e.preventDefault();
        
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            showNotification('Password baru dan konfirmasi password tidak cocok', 'error');
            return;
        }

        if (passwordForm.newPassword.length < 6) {
            showNotification('Password baru minimal 6 karakter', 'error');
            return;
        }

        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/auth/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword: passwordForm.currentPassword,
                    newPassword: passwordForm.newPassword
                })
            });

            if (response.ok) {
                showNotification('Password berhasil diubah');
                setShowPasswordModal(false);
                setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                const error = await response.json();
                showNotification(error.message || 'Gagal mengubah password', 'error');
            }
        } catch (error) {
            showNotification('Terjadi kesalahan saat mengubah password', 'error');
        }
        setIsLoading(false);
    };

    // Fungsi untuk handle edit profile
    const handleEditProfile = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/auth/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(profileForm)
            });

            if (response.ok) {
                const updatedUser = await response.json();
                setCurrentUser(updatedUser);
                showNotification('Profile berhasil diperbarui');
                setShowEditProfileModal(false);
            } else {
                const error = await response.json();
                showNotification(error.message || 'Gagal memperbarui profile', 'error');
            }
        } catch (error) {
            showNotification('Terjadi kesalahan saat memperbarui profile', 'error');
        }
        setIsLoading(false);
    };

    // Fungsi untuk handle user operations
    const handleSaveUser = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const token = localStorage.getItem('token');
            const url = editingUser 
                ? `http://localhost:3000/users/${editingUser.id}`
                : 'http://localhost:3000/users';
            
            const method = editingUser ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(userForm)
            });

            if (response.ok) {
                showNotification(editingUser ? 'User berhasil diperbarui' : 'User berhasil ditambahkan');
                setShowUserModal(false);
                setEditingUser(null);
                setUserForm({ name: '', email: '', password: '', role: 'User', phone: '', address: '' });
                loadUsers();
            } else {
                const error = await response.json();
                showNotification(error.message || 'Gagal menyimpan user', 'error');
            }
        } catch (error) {
            showNotification('Terjadi kesalahan saat menyimpan user', 'error');
        }
        setIsLoading(false);
    };

    const handleDeleteUser = (user) => {
        setDeletingUser(user);
        setShowDeleteModal(true);
    };

    const confirmDeleteUser = async () => {
        if (!deletingUser) return;

        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/users/${deletingUser.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setShowDeleteModal(false);
                setDeletingUser(null);
                loadUsers();
                showNotification(`User ${deletingUser.name} berhasil dihapus`);
            } else {
                const error = await response.json();
                showNotification(error.message || 'Gagal menghapus user', 'error');
            }
        } catch (error) {
            showNotification('Terjadi kesalahan saat menghapus user', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        
        if (resetPasswordForm.newPassword !== resetPasswordForm.confirmPassword) {
            showNotification('Konfirmasi password tidak cocok', 'error');
            return;
        }

        if (resetPasswordForm.newPassword.length < 6) {
            showNotification('Password minimal 6 karakter', 'error');
            return;
        }

        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/users/${resettingUser.id}/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    newPassword: resetPasswordForm.newPassword,
                    confirmPassword: resetPasswordForm.confirmPassword
                })
            });

            if (response.ok) {
                setShowResetPasswordModal(false);
                setResetPasswordForm({ newPassword: '', confirmPassword: '' });
                setResettingUser(null);
                showNotification(`Password untuk ${resettingUser.name} berhasil diubah`);
            } else {
                const error = await response.json();
                showNotification(error.message || 'Gagal mengubah password', 'error');
            }
        } catch (error) {
            showNotification('Terjadi kesalahan saat mengubah password', 'error');
        }
        setIsLoading(false);
    };

    const openResetPassword = (user) => {
        setResettingUser(user);
        setResetPasswordForm({ newPassword: '', confirmPassword: '' });
        setShowResetPasswordModal(true);
    };    // Fungsi untuk handle agent operations
    const handleSaveAgent = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const token = localStorage.getItem('token');
            const url = editingAgent 
                ? `http://localhost:3000/agents/${editingAgent.id}`
                : 'http://localhost:3000/agents';
            
            const method = editingAgent ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(agentForm)
            });

            if (response.ok) {
                showNotification(editingAgent ? 'Agent berhasil diperbarui' : 'Agent berhasil ditambahkan');
                setShowAgentModal(false);
                setEditingAgent(null);
                setAgentForm({ name: '', phone: '', email: '', address: '' });
                loadAgents();
            } else {
                const error = await response.json();
                showNotification(error.message || 'Gagal menyimpan agent', 'error');
            }
        } catch (error) {
            showNotification('Terjadi kesalahan saat menyimpan agent', 'error');
        }
        setIsLoading(false);
    };

    const handleDeleteAgent = (agent) => {
        setDeletingAgent(agent);
        setShowDeleteAgentModal(true);
    };

    const confirmDeleteAgent = async () => {
        if (!deletingAgent) return;

        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/agents/${deletingAgent.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setShowDeleteAgentModal(false);
                setDeletingAgent(null);
                showNotification(`Agent ${deletingAgent.name} berhasil dihapus`);
                loadAgents();
            } else {
                const error = await response.json();
                showNotification(error.message || 'Gagal menghapus agent', 'error');
            }
        } catch (error) {
            showNotification('Terjadi kesalahan saat menghapus agent', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // Fungsi untuk handle village operations
    const handleSaveVillage = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const token = localStorage.getItem('token');
            const url = editingVillage 
                ? `http://localhost:3000/villages/${editingVillage.id}`
                : 'http://localhost:3000/villages';
            
            const method = editingVillage ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(villageForm)
            });

            if (response.ok) {
                showNotification(editingVillage ? 'Desa berhasil diperbarui' : 'Desa berhasil ditambahkan');
                setShowVillageModal(false);
                setEditingVillage(null);
                setVillageForm({ name: '', kecamatan: '', kabupaten: '' });
                loadVillages();
            } else {
                const error = await response.json();
                showNotification(error.message || 'Gagal menyimpan desa', 'error');
            }
        } catch (error) {
            showNotification('Terjadi kesalahan saat menyimpan desa', 'error');
        }
        setIsLoading(false);
    };

    const handleDeleteVillage = (village) => {
        setDeletingVillage(village);
        setShowDeleteVillageModal(true);
    };

    const confirmDeleteVillage = async () => {
        if (!deletingVillage) return;

        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/villages/${deletingVillage.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setShowDeleteVillageModal(false);
                setDeletingVillage(null);
                showNotification(`Desa ${deletingVillage.name} berhasil dihapus`);
                loadVillages();
            } else {
                const error = await response.json();
                showNotification(error.message || 'Gagal menghapus desa', 'error');
            }
        } catch (error) {
            showNotification('Terjadi kesalahan saat menghapus desa', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // Fungsi untuk edit user
    const openEditUser = (user) => {
        setEditingUser(user);
        setUserForm({
            name: user.name || '',
            email: user.email || '',
            password: '',
            role: user.role || 'User',
            phone: user.phone || '',
            address: user.address || ''
        });
        setShowUserModal(true);
    };

    // Fungsi untuk edit agent
    const openEditAgent = (agent) => {
        setEditingAgent(agent);
        setAgentForm({
            name: agent.name || '',
            phone: agent.phone || '',
            email: agent.email || '',
            address: agent.address || ''
        });
        setShowAgentModal(true);
    };

    // Fungsi untuk edit village
    const openEditVillage = (village) => {
        setEditingVillage(village);
        setVillageForm({
            name: village.name || '',
            kecamatan: village.kecamatan || '',
            kabupaten: village.kabupaten || ''
        });
        setShowVillageModal(true);
    };

    // Fungsi untuk format tanggal
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Tab yang tersedia berdasarkan role
    const getAvailableTabs = () => {
        const commonTabs = [
            { id: 'konfigurasi', label: 'Konfigurasi', icon: 'fas fa-cog' }
        ];

        if (currentUser?.role === 'Administrator') {
            return [
                ...commonTabs,
                { id: 'pengguna', label: 'Manajemen Pengguna', icon: 'fas fa-users' },
                { id: 'master', label: 'Master Data', icon: 'fas fa-database' },
                { id: 'logs', label: 'Log Aktivitas', icon: 'fas fa-history' }
            ];
        }

        return commonTabs;
    };

    return (
        <div className="manajemen-akun">
            {/* Page Header */}
            <div className="page-header">
                <div className="header-content">
                    <div className="header-info">
                        <div className="header-icon">
                            <i className="fas fa-user-cog"></i>
                        </div>
                        <div className="header-text">
                            <h1>Manajemen Akun</h1>
                            <p>Kelola profil, pengaturan akun, dan hak akses sistem</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="tabs-navigation">
                {getAvailableTabs().map(tab => (
                    <button
                        key={tab.id}
                        className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        <i className={tab.icon}></i>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="tab-content">
                {/* Konfigurasi Tab */}
                {activeTab === 'konfigurasi' && (
                    <div className="konfigurasi-content">
                        <div className="config-section">
                            <h3>
                                <i className="fas fa-user-circle"></i>
                                Informasi Profil
                            </h3>
                            
                            {currentUser && (
                                <div className="profile-card">
                                    <div className="profile-info">
                                        <div className="profile-avatar">
                                            {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                                        </div>
                                        <div className="profile-details">
                                            <h4>{currentUser.name || 'User'}</h4>
                                            <div className="profile-email">
                                                <i className="fas fa-envelope"></i>
                                                {currentUser.email}
                                            </div>
                                            <div className="profile-role">
                                                <i className="fas fa-shield-alt"></i>
                                                {currentUser.role}
                                            </div>
                                            {currentUser.phone && (
                                                <div className="profile-address">
                                                    <i className="fas fa-phone"></i>
                                                    {currentUser.phone}
                                                </div>
                                            )}
                                            {currentUser.address && (
                                                <div className="profile-address">
                                                    <i className="fas fa-map-marker-alt"></i>
                                                    {currentUser.address}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="profile-actions">
                                        <button 
                                            className="btn btn-primary"
                                            onClick={() => setShowEditProfileModal(true)}
                                        >
                                            <i className="fas fa-edit"></i>
                                            Edit Profil
                                        </button>
                                        <button 
                                            className="btn btn-secondary"
                                            onClick={() => setShowPasswordModal(true)}
                                        >
                                            <i className="fas fa-key"></i>
                                            Ubah Password
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Manajemen Pengguna Tab (Admin Only) */}
                {activeTab === 'pengguna' && currentUser?.role === 'Administrator' && (
                    <div>
                        <div className="users-table-container">
                            <div className="section-header">
                                <h3>
                                    <i className="fas fa-users"></i>
                                    Daftar Pengguna
                                </h3>
                                <button 
                                    className="btn btn-primary"
                                    onClick={() => {
                                        setEditingUser(null);
                                        setUserForm({ name: '', email: '', password: '', role: 'User', phone: '', address: '' });
                                        setShowUserModal(true);
                                    }}
                                >
                                    <i className="fas fa-plus"></i>
                                    Tambah Pengguna
                                </button>
                            </div>
                            
                            <table className="users-table">
                                <thead>
                                    <tr>
                                        <th>Nama</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Telepon</th>
                                        <th>Alamat</th>
                                        <th>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user.id}>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>
                                                <span className={`badge ${user.role === 'Administrator' ? 'badge-admin' : 'badge-user'}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td>{user.phone || '-'}</td>
                                            <td>{user.address || '-'}</td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button 
                                                        className="action-btn edit"
                                                        onClick={() => openEditUser(user)}
                                                        title="Edit"
                                                    >
                                                        <i className="fas fa-edit"></i>
                                                    </button>
                                                    <button 
                                                        className="action-btn reset-password"
                                                        onClick={() => openResetPassword(user)}
                                                        title="Reset Password"
                                                    >
                                                        <i className="fas fa-key"></i>
                                                    </button>
                                                    <button 
                                                        className="action-btn delete"
                                                        onClick={() => handleDeleteUser(user)}
                                                        title="Hapus"
                                                        disabled={user.id === currentUser?.id}
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Mobile Cards Layout */}
                            <div className="mobile-cards-container">
                                {users && users.filter(user => user && user.id).map(user => (
                                    <div key={user.id} className="user-card">
                                        <div className="card-header-mobile">
                                            <div className="card-avatar-mobile">
                                                {user && user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                            </div>
                                            <div className="card-user-info">
                                                <div className="card-user-name">{user && user.name ? user.name : 'Nama tidak tersedia'}</div>
                                                <div className="card-user-email">{user && user.email ? user.email : 'Email tidak tersedia'}</div>
                                            </div>
                                        </div>
                                        
                                        <div className="card-body-mobile">
                                            <div className="card-field-mobile">
                                                <div className="card-field-label-mobile">Role</div>
                                                <div className="card-field-value-mobile">
                                                    <span className={`card-role-badge ${user && user.role === 'Administrator' ? 'admin' : 'user'}`}>
                                                        {user && user.role ? user.role : 'User'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="card-field-mobile">
                                                <div className="card-field-label-mobile">Telepon</div>
                                                <div className="card-field-value-mobile">{user && user.phone ? user.phone : '-'}</div>
                                            </div>
                                            <div className="card-field-mobile full-width">
                                                <div className="card-field-label-mobile">Alamat</div>
                                                <div className="card-field-value-mobile">{user && user.address ? user.address : '-'}</div>
                                            </div>
                                        </div>
                                        
                                        <div className="card-footer-mobile">
                                            <button 
                                                className="card-action-btn-mobile edit"
                                                onClick={() => user && openEditUser(user)}
                                                disabled={!user}
                                            >
                                                <i className="fas fa-edit"></i>
                                                Edit
                                            </button>
                                            <button 
                                                className="card-action-btn-mobile reset-password"
                                                onClick={() => user && openResetPassword(user)}
                                                disabled={!user}
                                            >
                                                <i className="fas fa-key"></i>
                                                Reset
                                            </button>
                                            <button 
                                                className="card-action-btn-mobile delete"
                                                onClick={() => user && user.id && handleDeleteUser(user)}
                                                disabled={!user || !user.id || (user.id === currentUser?.id)}
                                            >
                                                <i className="fas fa-trash"></i>
                                                Hapus
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Master Data Tab (Admin Only) */}
                {activeTab === 'master' && currentUser?.role === 'Administrator' && (
                    <div className="master-content">
                        <div className="master-layout">
                            {/* Tabel Agent - Sebelah Kiri */}
                            <div className="master-section">
                                <div className="section-header">
                                    <h3>
                                        <i className="fas fa-user-tie"></i>
                                        Data Agent
                                    </h3>
                                    <button 
                                        className="btn btn-primary"
                                        onClick={() => {
                                            setAgentForm({ name: '', phone: '', email: '', address: '' });
                                            setEditingAgent(null);
                                            setShowAgentModal(true);
                                        }}
                                    >
                                        <i className="fas fa-plus"></i>
                                        Tambah Agent
                                    </button>
                                </div>
                                
                                <div className="table-wrapper">
                                    <table className="master-table">
                                        <thead>
                                            <tr>
                                                <th>Nama</th>
                                                <th>Telepon</th>
                                                <th>Email</th>
                                                <th>Alamat</th>
                                                <th>Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {agents && agents.length > 0 ? agents.map(agent => (
                                                <tr key={agent.id}>
                                                    <td>{agent.name || '-'}</td>
                                                    <td>{agent.phone || '-'}</td>
                                                    <td>{agent.email || '-'}</td>
                                                    <td>{agent.address || '-'}</td>
                                                    <td>
                                                        <div className="action-buttons">
                                                            <button 
                                                                className="action-btn edit"
                                                                onClick={() => openEditAgent(agent)}
                                                                title="Edit"
                                                            >
                                                                <i className="fas fa-edit"></i>
                                                            </button>
                                                            <button 
                                                                className="action-btn delete"
                                                                onClick={() => handleDeleteAgent(agent)}
                                                                title="Hapus"
                                                            >
                                                                <i className="fas fa-trash"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan="5" style={{textAlign: 'center', color: '#666', padding: '20px'}}>
                                                        Belum ada data agent
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile Cards untuk Agent */}
                                <div className="mobile-cards-container">
                                    {agents && agents.length > 0 ? agents.map(agent => (
                                        <div key={agent.id} className="master-card">
                                            <div className="master-card-header">
                                                <div className="master-card-title">{agent.name || 'Nama tidak tersedia'}</div>
                                                <div className="master-card-id">ID: {agent.id || '-'}</div>
                                            </div>
                                            
                                            <div className="card-body-mobile">
                                                <div className="card-field-mobile">
                                                    <div className="card-field-label-mobile">Telepon</div>
                                                    <div className="card-field-value-mobile">{agent.phone || '-'}</div>
                                                </div>
                                                <div className="card-field-mobile">
                                                    <div className="card-field-label-mobile">Email</div>
                                                    <div className="card-field-value-mobile">{agent.email || '-'}</div>
                                                </div>
                                                <div className="card-field-mobile full-width">
                                                    <div className="card-field-label-mobile">Alamat</div>
                                                    <div className="card-field-value-mobile">{agent.address || '-'}</div>
                                                </div>
                                            </div>
                                            
                                            <div className="master-card-footer">
                                                <button 
                                                    className="card-action-btn-mobile edit"
                                                    onClick={() => openEditAgent(agent)}
                                                >
                                                    <i className="fas fa-edit"></i>
                                                    Edit
                                                </button>
                                                <button 
                                                    className="card-action-btn-mobile delete"
                                                    onClick={() => handleDeleteAgent(agent)}
                                                >
                                                    <i className="fas fa-trash"></i>
                                                    Hapus
                                                </button>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="empty-state">
                                            <i className="fas fa-user-tie" style={{fontSize: '48px', color: '#ccc', marginBottom: '16px'}}></i>
                                            <p>Belum ada data agent</p>
                                            <button 
                                                className="btn btn-primary"
                                                onClick={() => {
                                                    setAgentForm({ name: '', phone: '', email: '', address: '' });
                                                    setEditingAgent(null);
                                                    setShowAgentModal(true);
                                                }}
                                            >
                                                <i className="fas fa-plus"></i>
                                                Tambah Agent Pertama
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Tabel Desa - Sebelah Kanan */}
                            <div className="master-section">
                                <div className="section-header">
                                    <h3>
                                        <i className="fas fa-map-marked-alt"></i>
                                        Data Desa
                                    </h3>
                                    <button 
                                        className="btn btn-primary"
                                        onClick={() => {
                                            setVillageForm({ name: '', kecamatan: '', kabupaten: '' });
                                            setEditingVillage(null);
                                            setShowVillageModal(true);
                                        }}
                                    >
                                        <i className="fas fa-plus"></i>
                                        Tambah Desa
                                    </button>
                                </div>
                                
                                <div className="table-wrapper">
                                    <table className="master-table">
                                        <thead>
                                            <tr>
                                                <th>Nama Desa</th>
                                                <th>Kecamatan</th>
                                                <th>Kabupaten</th>
                                                <th>Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {villages && villages.length > 0 ? villages.map(village => (
                                                <tr key={village.id}>
                                                    <td>{village.name || '-'}</td>
                                                    <td>{village.kecamatan || '-'}</td>
                                                    <td>{village.kabupaten || '-'}</td>
                                                    <td>
                                                        <div className="action-buttons">
                                                            <button 
                                                                className="action-btn edit"
                                                                onClick={() => openEditVillage(village)}
                                                                title="Edit"
                                                            >
                                                                <i className="fas fa-edit"></i>
                                                            </button>
                                                            <button 
                                                                className="action-btn delete"
                                                                onClick={() => handleDeleteVillage(village)}
                                                                title="Hapus"
                                                            >
                                                                <i className="fas fa-trash"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan="4" style={{textAlign: 'center', color: '#666', padding: '20px'}}>
                                                        Belum ada data desa
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile Cards untuk Desa */}
                                <div className="mobile-cards-container">
                                    {villages && villages.length > 0 ? villages.map(village => (
                                        <div key={village.id} className="master-card">
                                            <div className="master-card-header">
                                                <div className="master-card-title">{village.name || 'Nama desa tidak tersedia'}</div>
                                                <div className="master-card-id">ID: {village.id || '-'}</div>
                                            </div>
                                            
                                            <div className="card-body-mobile">
                                                <div className="card-field-mobile">
                                                    <div className="card-field-label-mobile">Kecamatan</div>
                                                    <div className="card-field-value-mobile">{village.kecamatan || '-'}</div>
                                                </div>
                                                <div className="card-field-mobile">
                                                    <div className="card-field-label-mobile">Kabupaten</div>
                                                    <div className="card-field-value-mobile">{village.kabupaten || '-'}</div>
                                                </div>
                                            </div>
                                            
                                            <div className="master-card-footer">
                                                <button 
                                                    className="card-action-btn-mobile edit"
                                                    onClick={() => openEditVillage(village)}
                                                >
                                                    <i className="fas fa-edit"></i>
                                                    Edit
                                                </button>
                                                <button 
                                                    className="card-action-btn-mobile delete"
                                                    onClick={() => handleDeleteVillage(village)}
                                                >
                                                    <i className="fas fa-trash"></i>
                                                    Hapus
                                                </button>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="empty-state">
                                            <i className="fas fa-map-marked-alt" style={{fontSize: '48px', color: '#ccc', marginBottom: '16px'}}></i>
                                            <p>Belum ada data desa</p>
                                            <button 
                                                className="btn btn-primary"
                                                onClick={() => {
                                                    setVillageForm({ name: '', kecamatan: '', kabupaten: '' });
                                                    setEditingVillage(null);
                                                    setShowVillageModal(true);
                                                }}
                                            >
                                                <i className="fas fa-plus"></i>
                                                Tambah Desa Pertama
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>


                    </div>
                )}

                {/* Log Aktivitas Tab (Admin Only) */}
                {activeTab === 'logs' && currentUser?.role === 'Administrator' && (
                    <div className="logs-content">
                        <div className="logs-table-container">
                            <div className="logs-section">
                                <h3>
                                    <i className="fas fa-history"></i>
                                    Log Aktivitas Sistem
                                </h3>
                            </div>
                            
                            <table className="logs-table">
                                <thead>
                                    <tr>
                                        <th>Waktu</th>
                                        <th>User</th>
                                        <th>Aktivitas</th>
                                        <th>Detail</th>
                                        <th>IP Address</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activityLogs.map(log => (
                                        <tr key={log.id}>
                                            <td>{formatDate(log.created_at)}</td>
                                            <td>{log.user_name}</td>
                                            <td>{log.activity}</td>
                                            <td>{log.details}</td>
                                            <td>{log.ip_address}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Mobile Cards for Logs */}
                            <div className="mobile-cards-container">
                                {activityLogs && activityLogs.filter(log => log && log.id).map(log => (
                                    <div key={log.id} className="log-card">
                                        <div className="log-card-timestamp">
                                            {log && log.created_at ? formatDate(log.created_at) : 'Tanggal tidak tersedia'}
                                        </div>
                                        <div className="log-card-action">
                                            {log && log.activity ? log.activity : 'Aktivitas tidak tersedia'}
                                        </div>
                                        
                                        <div className="card-body-mobile">
                                            <div className="card-field-mobile">
                                                <div className="card-field-label-mobile">User</div>
                                                <div className="card-field-value-mobile">{log && log.user_name ? log.user_name : 'User tidak tersedia'}</div>
                                            </div>
                                            <div className="card-field-mobile">
                                                <div className="card-field-label-mobile">IP Address</div>
                                                <div className="card-field-value-mobile">{log && log.ip_address ? log.ip_address : '-'}</div>
                                            </div>
                                            <div className="card-field-mobile full-width">
                                                <div className="card-field-label-mobile">Detail</div>
                                                <div className="card-field-value-mobile">{log && log.details ? log.details : 'Detail tidak tersedia'}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal Ubah Password */}
            {showPasswordModal && (
                <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>
                                <i className="fas fa-key"></i>
                                Ubah Password
                            </h3>
                            <button 
                                className="modal-close"
                                onClick={() => setShowPasswordModal(false)}
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <form onSubmit={handleChangePassword}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Password Lama *</label>
                                    <input
                                        type="password"
                                        value={passwordForm.currentPassword}
                                        onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                                        required
                                        placeholder="Masukkan password lama"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Password Baru *</label>
                                    <input
                                        type="password"
                                        value={passwordForm.newPassword}
                                        onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                                        required
                                        placeholder="Masukkan password baru"
                                        minLength="6"
                                    />
                                    <div className="text-warning">Minimal 6 karakter</div>
                                </div>
                                <div className="form-group">
                                    <label>Konfirmasi Password Baru *</label>
                                    <input
                                        type="password"
                                        value={passwordForm.confirmPassword}
                                        onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                                        required
                                        placeholder="Konfirmasi password baru"
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button 
                                    type="button" 
                                    className="btn btn-secondary"
                                    onClick={() => setShowPasswordModal(false)}
                                >
                                    Batal
                                </button>
                                <button 
                                    type="submit" 
                                    className="btn btn-primary"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Menyimpan...' : 'Ubah Password'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Edit Profile */}
            {showEditProfileModal && (
                <div className="modal-overlay" onClick={() => setShowEditProfileModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>
                                <i className="fas fa-edit"></i>
                                Edit Profil
                            </h3>
                            <button 
                                className="modal-close"
                                onClick={() => setShowEditProfileModal(false)}
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <form onSubmit={handleEditProfile}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Nama Lengkap *</label>
                                    <input
                                        type="text"
                                        value={profileForm.name}
                                        onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                                        required
                                        placeholder="Masukkan nama lengkap"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email *</label>
                                    <input
                                        type="email"
                                        value={profileForm.email}
                                        onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                                        required
                                        placeholder="Masukkan email"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Nomor Telepon</label>
                                    <input
                                        type="tel"
                                        value={profileForm.phone}
                                        onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                                        placeholder="Masukkan nomor telepon"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Alamat</label>
                                    <textarea
                                        value={profileForm.address}
                                        onChange={(e) => setProfileForm({...profileForm, address: e.target.value})}
                                        placeholder="Masukkan alamat lengkap"
                                        rows="3"
                                    ></textarea>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button 
                                    type="button" 
                                    className="btn btn-secondary"
                                    onClick={() => setShowEditProfileModal(false)}
                                >
                                    Batal
                                </button>
                                <button 
                                    type="submit" 
                                    className="btn btn-primary"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal User */}
            {showUserModal && (
                <div className="modal-overlay" onClick={() => setShowUserModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>
                                <i className="fas fa-user"></i>
                                {editingUser ? 'Edit Pengguna' : 'Tambah Pengguna'}
                            </h3>
                            <button 
                                className="modal-close"
                                onClick={() => setShowUserModal(false)}
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <form onSubmit={handleSaveUser}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Nama Lengkap *</label>
                                    <input
                                        type="text"
                                        value={userForm.name}
                                        onChange={(e) => setUserForm({...userForm, name: e.target.value})}
                                        required
                                        placeholder="Masukkan nama lengkap"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email *</label>
                                    <input
                                        type="email"
                                        value={userForm.email}
                                        onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                                        required
                                        placeholder="Masukkan email"
                                    />
                                </div>
                                {!editingUser && (
                                    <div className="form-group">
                                        <label>Password *</label>
                                        <input
                                            type="password"
                                            value={userForm.password}
                                            onChange={(e) => setUserForm({...userForm, password: e.target.value})}
                                            required
                                            placeholder="Masukkan password"
                                            minLength="6"
                                        />
                                        <div className="text-warning">Minimal 6 karakter</div>
                                    </div>
                                )}
                                <div className="form-group">
                                    <label>Role *</label>
                                    <select
                                        value={userForm.role}
                                        onChange={(e) => setUserForm({...userForm, role: e.target.value})}
                                        required
                                    >
                                        <option value="User">User</option>
                                        <option value="Administrator">Administrator</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Nomor Telepon</label>
                                    <input
                                        type="tel"
                                        value={userForm.phone}
                                        onChange={(e) => setUserForm({...userForm, phone: e.target.value})}
                                        placeholder="Masukkan nomor telepon"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Alamat</label>
                                    <textarea
                                        value={userForm.address}
                                        onChange={(e) => setUserForm({...userForm, address: e.target.value})}
                                        placeholder="Masukkan alamat lengkap"
                                        rows="3"
                                    ></textarea>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button 
                                    type="button" 
                                    className="btn btn-secondary"
                                    onClick={() => setShowUserModal(false)}
                                >
                                    Batal
                                </button>
                                <button 
                                    type="submit" 
                                    className="btn btn-primary"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Menyimpan...' : editingUser ? 'Update' : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Agent */}
            {showAgentModal && (
                <div className="modal-overlay" onClick={() => setShowAgentModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>
                                <i className="fas fa-user-tie"></i>
                                {editingAgent ? 'Edit Agent' : 'Tambah Agent'}
                            </h3>
                            <button 
                                className="modal-close"
                                onClick={() => setShowAgentModal(false)}
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <form onSubmit={handleSaveAgent}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Nama Agent *</label>
                                    <input
                                        type="text"
                                        value={agentForm.name}
                                        onChange={(e) => setAgentForm({...agentForm, name: e.target.value})}
                                        required
                                        placeholder="Masukkan nama agent"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Nomor Telepon *</label>
                                    <input
                                        type="tel"
                                        value={agentForm.phone}
                                        onChange={(e) => setAgentForm({...agentForm, phone: e.target.value})}
                                        required
                                        placeholder="Masukkan nomor telepon"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        value={agentForm.email}
                                        onChange={(e) => setAgentForm({...agentForm, email: e.target.value})}
                                        placeholder="Masukkan email"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Alamat</label>
                                    <textarea
                                        value={agentForm.address}
                                        onChange={(e) => setAgentForm({...agentForm, address: e.target.value})}
                                        placeholder="Masukkan alamat lengkap"
                                        rows="3"
                                    ></textarea>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button 
                                    type="button" 
                                    className="btn btn-secondary"
                                    onClick={() => setShowAgentModal(false)}
                                >
                                    Batal
                                </button>
                                <button 
                                    type="submit" 
                                    className="btn btn-primary"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Menyimpan...' : editingAgent ? 'Update' : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Village */}
            {showVillageModal && (
                <div className="modal-overlay" onClick={() => setShowVillageModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>
                                <i className="fas fa-map-marked-alt"></i>
                                {editingVillage ? 'Edit Desa' : 'Tambah Desa'}
                            </h3>
                            <button 
                                className="modal-close"
                                onClick={() => setShowVillageModal(false)}
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <form onSubmit={handleSaveVillage}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Nama Desa *</label>
                                    <input
                                        type="text"
                                        value={villageForm.name}
                                        onChange={(e) => setVillageForm({...villageForm, name: e.target.value})}
                                        required
                                        placeholder="Masukkan nama desa"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Kecamatan *</label>
                                    <input
                                        type="text"
                                        value={villageForm.kecamatan}
                                        onChange={(e) => setVillageForm({...villageForm, kecamatan: e.target.value})}
                                        required
                                        placeholder="Masukkan nama kecamatan"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Kabupaten *</label>
                                    <input
                                        type="text"
                                        value={villageForm.kabupaten}
                                        onChange={(e) => setVillageForm({...villageForm, kabupaten: e.target.value})}
                                        required
                                        placeholder="Masukkan nama kabupaten"
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button 
                                    type="button" 
                                    className="btn btn-secondary"
                                    onClick={() => setShowVillageModal(false)}
                                >
                                    Batal
                                </button>
                                <button 
                                    type="submit" 
                                    className="btn btn-primary"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Menyimpan...' : editingVillage ? 'Update' : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Reset Password */}
            {showResetPasswordModal && resettingUser && (
                <div className="modal-overlay" onClick={() => setShowResetPasswordModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>
                                <i className="fas fa-key"></i>
                                Reset Password Pengguna
                            </h3>
                            <button 
                                className="modal-close"
                                onClick={() => setShowResetPasswordModal(false)}
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <form onSubmit={handleResetPassword}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Pengguna</label>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '12px',
                                        background: '#f8fafc',
                                        borderRadius: '8px',
                                        border: '2px solid #e2e8f0'
                                    }}>
                                        <div style={{
                                            width: '40px',
                                            height: '40px',
                                            background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontSize: '18px',
                                            fontWeight: '600'
                                        }}>
                                            {resettingUser.name ? resettingUser.name.charAt(0).toUpperCase() : 'U'}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: '600', color: '#1e293b' }}>
                                                {resettingUser.name || 'Nama tidak tersedia'}
                                            </div>
                                            <div style={{ fontSize: '14px', color: '#64748b' }}>
                                                {resettingUser.email || 'Email tidak tersedia'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Password Baru *</label>
                                    <input
                                        type="password"
                                        value={resetPasswordForm.newPassword}
                                        onChange={(e) => setResetPasswordForm({...resetPasswordForm, newPassword: e.target.value})}
                                        required
                                        placeholder="Masukkan password baru"
                                        minLength="6"
                                    />
                                    <div className="text-warning">Minimal 6 karakter</div>
                                </div>
                                <div className="form-group">
                                    <label>Konfirmasi Password Baru *</label>
                                    <input
                                        type="password"
                                        value={resetPasswordForm.confirmPassword}
                                        onChange={(e) => setResetPasswordForm({...resetPasswordForm, confirmPassword: e.target.value})}
                                        required
                                        placeholder="Konfirmasi password baru"
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button 
                                    type="button" 
                                    className="btn btn-secondary"
                                    onClick={() => setShowResetPasswordModal(false)}
                                >
                                    Batal
                                </button>
                                <button 
                                    type="submit" 
                                    className="btn btn-danger"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Mengubah...' : 'Reset Password'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Delete User */}
            {showDeleteModal && deletingUser && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{maxWidth: '400px'}}>
                        <div className="modal-header">
                            <h3 style={{color: '#e74c3c'}}>
                                <i className="fas fa-exclamation-triangle" style={{marginRight: '10px'}}></i>
                                Konfirmasi Hapus
                            </h3>
                            <button 
                                className="modal-close"
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setDeletingUser(null);
                                }}
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="modal-body" style={{textAlign: 'center', padding: '30px 20px'}}>
                            <div style={{marginBottom: '20px'}}>
                                <i className="fas fa-user-times" style={{fontSize: '60px', color: '#e74c3c', marginBottom: '20px'}}></i>
                            </div>
                            <h4 style={{marginBottom: '15px', color: '#2c3e50'}}>
                                Apakah Anda yakin ingin menghapus akun?
                            </h4>
                            <p style={{marginBottom: '10px', fontSize: '16px'}}>
                                <strong>{deletingUser?.name || 'Unknown User'}</strong>
                            </p>
                            <p style={{marginBottom: '20px', color: '#7f8c8d', fontSize: '14px'}}>
                                {deletingUser?.email || 'No email'}
                            </p>
                            <div style={{
                                background: '#fff5f5', 
                                border: '1px solid #fed7d7', 
                                borderRadius: '8px', 
                                padding: '15px',
                                marginBottom: '20px'
                            }}>
                                <p style={{color: '#e53e3e', fontSize: '13px', margin: '0'}}>
                                    ⚠️ Aksi ini tidak dapat dibatalkan!
                                </p>
                            </div>
                        </div>
                        <div className="modal-footer" style={{justifyContent: 'center', gap: '15px'}}>
                            <button 
                                type="button" 
                                className="btn"
                                style={{
                                    background: '#f8f9fa',
                                    border: '1px solid #dee2e6',
                                    color: '#6c757d',
                                    padding: '10px 20px',
                                    borderRadius: '6px',
                                    cursor: 'pointer'
                                }}
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setDeletingUser(null);
                                }}
                            >
                                Batal
                            </button>
                            <button 
                                type="button" 
                                style={{
                                    background: '#dc3545',
                                    border: 'none',
                                    color: 'white',
                                    padding: '10px 20px',
                                    borderRadius: '6px',
                                    cursor: 'pointer'
                                }}
                                onClick={confirmDeleteUser}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Menghapus...' : 'Hapus'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Delete Agent */}
            {showDeleteAgentModal && deletingAgent && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{maxWidth: '400px'}}>
                        <div className="modal-header">
                            <h3 style={{color: '#e74c3c'}}>
                                <i className="fas fa-exclamation-triangle" style={{marginRight: '10px'}}></i>
                                Konfirmasi Hapus Agent
                            </h3>
                            <button 
                                className="modal-close"
                                onClick={() => {
                                    setShowDeleteAgentModal(false);
                                    setDeletingAgent(null);
                                }}
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="modal-body" style={{textAlign: 'center', padding: '30px 20px'}}>
                            <div style={{marginBottom: '20px'}}>
                                <i className="fas fa-user-tie" style={{fontSize: '60px', color: '#e74c3c', marginBottom: '20px'}}></i>
                            </div>
                            <h4 style={{marginBottom: '15px', color: '#2c3e50'}}>
                                Apakah Anda yakin ingin menghapus agent ini?
                            </h4>
                            <p style={{marginBottom: '10px', fontSize: '16px'}}>
                                <strong>{deletingAgent?.name || 'Unknown Agent'}</strong>
                            </p>
                            <p style={{marginBottom: '15px', color: '#7f8c8d', fontSize: '14px'}}>
                                {deletingAgent?.phone || 'No phone'}
                            </p>
                            <p style={{marginBottom: '20px', color: '#7f8c8d', fontSize: '14px'}}>
                                {deletingAgent?.email || 'No email'}
                            </p>
                            <div style={{
                                background: '#fff5f5', 
                                border: '1px solid #fed7d7', 
                                borderRadius: '8px', 
                                padding: '15px',
                                marginBottom: '20px'
                            }}>
                                <p style={{color: '#e53e3e', fontSize: '13px', margin: '0'}}>
                                    ⚠️ Data agent akan dihapus permanen!
                                </p>
                            </div>
                        </div>
                        <div className="modal-footer" style={{justifyContent: 'center', gap: '15px'}}>
                            <button 
                                type="button" 
                                className="btn"
                                style={{
                                    background: '#f8f9fa',
                                    border: '1px solid #dee2e6',
                                    color: '#6c757d',
                                    padding: '10px 20px',
                                    borderRadius: '6px',
                                    cursor: 'pointer'
                                }}
                                onClick={() => {
                                    setShowDeleteAgentModal(false);
                                    setDeletingAgent(null);
                                }}
                            >
                                Batal
                            </button>
                            <button 
                                type="button" 
                                style={{
                                    background: '#dc3545',
                                    border: 'none',
                                    color: 'white',
                                    padding: '10px 20px',
                                    borderRadius: '6px',
                                    cursor: 'pointer'
                                }}
                                onClick={confirmDeleteAgent}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Menghapus...' : 'Hapus'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Delete Village */}
            {showDeleteVillageModal && deletingVillage && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{maxWidth: '400px'}}>
                        <div className="modal-header">
                            <h3 style={{color: '#e74c3c'}}>
                                <i className="fas fa-exclamation-triangle" style={{marginRight: '10px'}}></i>
                                Konfirmasi Hapus Desa
                            </h3>
                            <button 
                                className="modal-close"
                                onClick={() => {
                                    setShowDeleteVillageModal(false);
                                    setDeletingVillage(null);
                                }}
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="modal-body" style={{textAlign: 'center', padding: '30px 20px'}}>
                            <div style={{marginBottom: '20px'}}>
                                <i className="fas fa-map-marked-alt" style={{fontSize: '60px', color: '#e74c3c', marginBottom: '20px'}}></i>
                            </div>
                            <h4 style={{marginBottom: '15px', color: '#2c3e50'}}>
                                Apakah Anda yakin ingin menghapus desa ini?
                            </h4>
                            <p style={{marginBottom: '10px', fontSize: '16px'}}>
                                <strong>{deletingVillage?.name || 'Unknown Village'}</strong>
                            </p>
                            <p style={{marginBottom: '8px', color: '#7f8c8d', fontSize: '14px'}}>
                                Kecamatan: {deletingVillage?.kecamatan || '-'}
                            </p>
                            <p style={{marginBottom: '20px', color: '#7f8c8d', fontSize: '14px'}}>
                                Kabupaten: {deletingVillage?.kabupaten || '-'}
                            </p>
                            <div style={{
                                background: '#fff5f5', 
                                border: '1px solid #fed7d7', 
                                borderRadius: '8px', 
                                padding: '15px',
                                marginBottom: '20px'
                            }}>
                                <p style={{color: '#e53e3e', fontSize: '13px', margin: '0'}}>
                                    ⚠️ Data desa akan dihapus permanen!
                                </p>
                            </div>
                        </div>
                        <div className="modal-footer" style={{justifyContent: 'center', gap: '15px'}}>
                            <button 
                                type="button" 
                                className="btn"
                                style={{
                                    background: '#f8f9fa',
                                    border: '1px solid #dee2e6',
                                    color: '#6c757d',
                                    padding: '10px 20px',
                                    borderRadius: '6px',
                                    cursor: 'pointer'
                                }}
                                onClick={() => {
                                    setShowDeleteVillageModal(false);
                                    setDeletingVillage(null);
                                }}
                            >
                                Batal
                            </button>
                            <button 
                                type="button" 
                                style={{
                                    background: '#dc3545',
                                    border: 'none',
                                    color: 'white',
                                    padding: '10px 20px',
                                    borderRadius: '6px',
                                    cursor: 'pointer'
                                }}
                                onClick={confirmDeleteVillage}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Menghapus...' : 'Hapus'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Notification */}
            {notification && (
                <div className={`notification ${notification.type}`}>
                    <div className="notification-content">
                        <div className="notification-icon">
                            <i className={notification.type === 'success' ? 'fas fa-check' : 'fas fa-exclamation-triangle'}></i>
                        </div>
                        <div className="notification-text">
                            <div className="notification-title">
                                {notification.type === 'success' ? 'Berhasil!' : 'Error!'}
                            </div>
                            <div className="notification-message">
                                {notification.message}
                            </div>
                        </div>
                        <button 
                            className="notification-close"
                            onClick={() => setNotification(null)}
                        >
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManajemenAkun;
