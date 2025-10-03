# 🚀 BTD System - Panduan Cepat

## Cara Menjalankan Aplikasi

### 1. Pastikan Server Berjalan
```bash
cd /home/btd/Database-Login/backend
npm start
```

### 2. Buka Browser
Kunjungi: `http://localhost:3000`

### 3. Login atau Register
- **Register**: Buat akun baru dengan email dan password
- **Login**: Masuk dengan akun yang sudah ada

### 4. Navigasi Aplikasi
Setelah login, Anda akan masuk ke **Dashboard** dengan menu:

- **🏠 Dashboard** - Halaman utama dengan informasi akun
- **📋 Daftar Pemasangan** - Data pemasangan infrastruktur
- **👥 Manajemen Akun** - Pengaturan profil dan keamanan

### 5. Fitur Utama

#### Header (Bagian Atas)
- **Jam Real-time**: Tanggal dan waktu yang update otomatis
- **Nama Pengguna**: Menampilkan nama dari email yang login
- **Tombol Logout**: Untuk keluar dari sistem

#### Sidebar (Menu Samping)
- **Navigasi Menu**: Klik menu untuk pindah halaman
- **Info Pengguna**: Avatar dan email di bagian bawah sidebar
- **Mobile Responsive**: Sidebar bisa dibuka/tutup di mobile

#### Dashboard
- **Banner Selamat Datang**: Pesan sambutan personal
- **Statistik Kartu**: Status login, akun, dan aktivitas terakhir
- **Aktivitas Terkini**: Log aktivitas pengguna

#### Daftar Pemasangan
- **Tabel Data**: Data pelanggan dan pemasangan
- **Tombol Aksi**: Edit dan hapus data
- **Status Badge**: Status pemasangan (Selesai, Dalam Proses, Menunggu)

#### Manajemen Akun
- **Profil Pengguna**: Info akun dan status online
- **Ubah Email**: Form untuk update email
- **Ubah Password**: Form untuk ganti password dengan validasi
- **Keamanan**: Info login terakhir dan opsi hapus akun

### 6. Keamanan
- Semua halaman dilindungi autentikasi
- Redirect otomatis ke login jika belum masuk
- Token disimpan di localStorage
- Logout menghapus semua data session

### 7. Responsive Design
- **Desktop**: Sidebar selalu terlihat
- **Mobile**: Tombol hamburger untuk buka/tutup sidebar
- **Tablet**: Layout menyesuaikan ukuran layar

## 🔧 Troubleshooting

**Problem**: Server tidak bisa start
**Solution**: 
```bash
# Cek apakah port 3000 sudah digunakan
netstat -tulnp | grep :3000

# Kill process jika perlu
sudo kill -9 $(lsof -t -i:3000)
```

**Problem**: Tidak bisa login
**Solution**: 
- Pastikan database berjalan
- Cek console browser untuk error
- Verifikasi email dan password

**Problem**: Halaman tidak load
**Solution**:
- Refresh browser
- Cek network tab di developer tools
- Pastikan server backend running

## 📱 Penggunaan Mobile

1. Buka aplikasi di browser mobile
2. Gunakan tombol ☰ di kiri atas untuk buka menu
3. Klik menu yang diinginkan
4. Menu akan tertutup otomatis setelah navigasi

---

**Selamat menggunakan BTD System! 🎉**
