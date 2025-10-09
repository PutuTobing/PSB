# Dokumentasi Fitur Manajemen Akun

## Overview
Fitur Manajemen Akun adalah sistem komprehensif untuk mengelola akun pengguna, profil, dan master data dalam aplikasi Database Login BTD. Fitur ini mendukung role-based access control dengan dua jenis pengguna: **User** dan **Administrator**.

## Fitur Utama

### 1. **Konfigurasi Profil** (Semua User)
- **Informasi Profil**: Menampilkan informasi lengkap user yang sedang login
  - Avatar dengan inisial nama
  - Nama lengkap
  - Email
  - Role (User/Administrator)
  - Nomor telepon
  - Alamat
- **Edit Profil**: Mengubah informasi pribadi
  - Nama lengkap
  - Email
  - Nomor telepon
  - Alamat
- **Ubah Password**: Sistem keamanan password dengan validasi
  - Password lama (verifikasi)
  - Password baru (minimal 6 karakter)
  - Konfirmasi password baru

### 2. **Manajemen Pengguna** (Administrator Only)
- **Daftar Pengguna**: Tabel lengkap semua pengguna
  - Nama
  - Email
  - Role (dengan badge warna)
  - Nomor telepon
  - Alamat
  - Aksi (Edit/Hapus)
- **Tambah Pengguna Baru**:
  - Nama lengkap
  - Email (unique)
  - Password (minimal 6 karakter)
  - Role (User/Administrator)
  - Nomor telepon (opsional)
  - Alamat (opsional)
- **Edit Pengguna**: Update informasi pengguna existing
- **Hapus Pengguna**: Dengan konfirmasi (tidak bisa hapus diri sendiri)

### 3. **Master Data** (Administrator Only)
#### 3.1 Data Agent
- **Daftar Agent**: Tabel master data agent
  - Nama agent
  - Nomor telepon
  - Email
  - Alamat
  - Aksi (Edit/Hapus)
- **Tambah Agent**: Form untuk menambah agent baru
- **Edit Agent**: Update informasi agent
- **Hapus Agent**: Dengan konfirmasi

#### 3.2 Data Desa
- **Daftar Desa**: Tabel master data desa
  - Nama desa
  - Kecamatan
  - Kabupaten
  - Aksi (Edit/Hapus)
- **Tambah Desa**: Form untuk menambah desa baru
- **Edit Desa**: Update informasi desa
- **Hapus Desa**: Dengan konfirmasi

### 4. **Log Aktivitas** (Administrator Only)
- **Riwayat Aktivitas**: Tabel log aktivitas sistem
  - Waktu aktivitas
  - Nama user
  - Jenis aktivitas
  - Detail aktivitas
  - IP Address
- **Auto-logging**: Sistem otomatis mencatat aktivitas user

## Teknologi & Implementation

### Frontend
- **React**: Functional components dengan hooks
- **CSS**: Responsive design dengan modern UI/UX
- **State Management**: useState, useEffect, useMemo
- **Routing**: React Router DOM
- **Authentication**: JWT token-based
- **Responsive**: Mobile-friendly design

### Backend API Endpoints
```
Authentication:
- GET /auth/profile - Get current user profile
- PUT /auth/profile - Update user profile
- POST /auth/change-password - Change password

User Management (Admin):
- GET /users - Get all users
- POST /users - Create new user
- PUT /users/:id - Update user
- DELETE /users/:id - Delete user

Master Data:
- GET /agents - Get all agents
- POST /agents - Create new agent
- PUT /agents/:id - Update agent
- DELETE /agents/:id - Delete agent

- GET /villages - Get all villages
- POST /villages - Create new village
- PUT /villages/:id - Update village
- DELETE /villages/:id - Delete village

Activity Logs (Admin):
- GET /activity-logs - Get activity logs
```

### Database Schema
```sql
-- Extended users table
users:
- id (Primary Key)
- email (Unique)
- password (Hashed)
- name
- phone
- address
- role (ENUM: 'User', 'Administrator')
- created_at

-- New tables
agents:
- id (Primary Key)
- name
- phone
- email
- address
- created_at, updated_at

villages:
- id (Primary Key)  
- name
- kecamatan
- kabupaten
- created_at, updated_at

activity_logs:
- id (Primary Key)
- user_id (Foreign Key)
- activity
- details
- ip_address
- created_at
```

## Keamanan & Validasi

### Authentication & Authorization
- **JWT Token**: Semua API endpoint terproteksi
- **Role-based Access**: Administrator vs User permissions
- **Token Expiration**: 1 jam untuk keamanan
- **Self-protection**: User tidak dapat menghapus akun sendiri

### Input Validation
- **Email**: Format email valid dan unique
- **Password**: Minimal 6 karakter
- **Required Fields**: Validasi field wajib
- **SQL Injection**: Prepared statements
- **XSS Protection**: Input sanitization

### UI/UX Security
- **Confirmation Dialogs**: Untuk aksi delete
- **Loading States**: Mencegah multiple submissions
- **Error Handling**: User-friendly error messages
- **Auto-logout**: Token expiration handling

## Styling & Responsive Design

### Design System
- **Color Scheme**: Modern gradient dengan purple/blue
- **Typography**: Clean, readable fonts
- **Spacing**: Consistent padding dan margins
- **Animations**: Smooth transitions dan hover effects
- **Icons**: FontAwesome untuk consistency

### Responsive Features
- **Mobile Navigation**: Collapsible tabs
- **Flexible Tables**: Horizontal scroll pada layar kecil
- **Modal Responsive**: Adaptif untuk mobile
- **Touch-friendly**: Button sizing untuk mobile

## File Structure
```
/frontend/src/pages/
├── ManajemenAkun.jsx - Main component
└── ManajemenAkun.css - Styles

/backend/
├── server.js - API endpoints

/database/
└── manajemen-akun-setup.sql - Database schema
```

## Usage Instructions

### Untuk User Biasa:
1. Login ke sistem
2. Navigasi ke menu "Manajemen Akun"
3. Lihat dan edit profil di tab "Konfigurasi"
4. Ubah password jika diperlukan

### Untuk Administrator:
1. Login dengan akun Administrator
2. Access lengkap ke semua tab:
   - **Konfigurasi**: Manage profil sendiri
   - **Manajemen Pengguna**: CRUD users
   - **Master Data**: CRUD agents dan desa
   - **Log Aktivitas**: Monitor sistem

## Default Credentials
```
Email: admin@btd.com
Password: password
Role: Administrator
```

## Error Handling
- **Network Errors**: Toast notification dengan retry
- **Validation Errors**: Inline form validation
- **Permission Errors**: Proper access denied messages
- **404 Errors**: User-friendly not found pages

## Performance Optimizations
- **Memoization**: useMemo untuk filtering
- **Lazy Loading**: Components loaded on demand
- **Debounced Search**: Optimized search functionality
- **Pagination**: Ready untuk large datasets
- **Caching**: Token dan user data caching

## Future Enhancements
- **Email Notifications**: Password change alerts
- **Two-Factor Authentication**: Enhanced security
- **Bulk Operations**: Multiple user management
- **Export/Import**: Data management tools
- **Advanced Logging**: More detailed activity tracking
- **Profile Pictures**: Avatar upload functionality

## Maintenance Notes
- **Database Backup**: Regular backup recommended
- **Token Rotation**: Consider refresh token implementation
- **Performance Monitoring**: Monitor API response times
- **Security Audits**: Regular security reviews
- **User Training**: Document user workflows

---

**Fitur Manajemen Akun telah berhasil diimplementasikan dengan lengkap sesuai spesifikasi yang diminta, mendukung role-based access control, dan siap untuk production use.**