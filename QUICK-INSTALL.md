# 🚀 Quick Installation Guide - Any IP Address

## ⚡ Super Quick Install (Recommended)

### Opsi 1: Auto Installer Script
```bash
# Clone repository
git clone https://github.com/PutuTobing/PSB.git
cd PSB

# Run auto installer (detects IP automatically)
./install.sh

# Or specify IP manually
./install.sh 172.16.31.50
```

Script akan otomatis:
- ✅ Check & install dependencies (Docker, Node.js)
- ✅ Start MySQL & phpMyAdmin containers
- ✅ Import database schemas
- ✅ Install npm dependencies
- ✅ Configure firewall

### Opsi 2: Manual Install (5 menit)
```bash
# 1. Start Database
docker-compose up -d

# 2. Wait 30 seconds
sleep 30

# 3. Import Database (pilih salah satu)
# Via Docker:
docker exec -i PSB-db-1 mysql -uroot -prootpassword auth_db < database/customers-schema.sql
docker exec -i PSB-db-1 mysql -uroot -prootpassword auth_db < database/pemasangan-schema.sql
docker exec -i PSB-db-1 mysql -uroot -prootpassword auth_db < database/manajemen-akun-setup.sql

# Via phpMyAdmin: http://[YOUR_IP]:8081 (import manual)

# 4. Install Dependencies
cd backend && npm install
cd ../frontend && npm install

# 5. Start Application
# Terminal 1:
cd backend && node server.js

# Terminal 2:
cd frontend && npm run dev
```

## 🌐 Akses Aplikasi

Setelah instalasi, akses via browser:

**Development Mode:**
```
Frontend:   http://[YOUR_IP]:5173
Backend:    http://[YOUR_IP]:3000
phpMyAdmin: http://[YOUR_IP]:8081
```

**Contoh untuk IP 172.16.31.50:**
```
Frontend:   http://172.16.31.50:5173
Backend:    http://172.16.31.50:3000
phpMyAdmin: http://172.16.31.50:8081
```

## ✅ Keuntungan Auto-Detection

Aplikasi ini menggunakan **auto-detection** untuk IP address, jadi:

✨ **TIDAK PERLU** ubah konfigurasi IP di code
✨ **TIDAK PERLU** hardcode IP address
✨ **BISA** install di IP manapun tanpa edit file

Cara kerjanya:
1. Frontend otomatis detect IP dari `window.location.hostname`
2. Backend listen di `0.0.0.0` (semua interface)
3. Auto-connect ke backend di IP yang sama dengan frontend

## 🔧 Port yang Digunakan

| Service | Port | Purpose |
|---------|------|---------|
| Frontend Dev | 5173 | Vite Development Server |
| Frontend Preview | 4173 | Vite Production Preview |
| Backend API | 3000 | Node.js Express Server |
| MySQL | 3306 | Database Server |
| phpMyAdmin | 8081 | Database Management |

## 🔐 Default Credentials

**Database:**
- Host: `localhost` atau IP server
- Port: `3306`
- User: `root`
- Password: `rootpassword`
- Database: `auth_db`

**phpMyAdmin:**
- URL: `http://[IP]:8081`
- Username: `root`
- Password: `rootpassword`

**First User:**
- Buat via Register page: `http://[IP]:5173`
- Default role: Agen
- Set admin manual di phpMyAdmin jika perlu

## 🎯 Contoh Instalasi di IP Berbeda

### Scenario 1: Install di 172.16.31.50
```bash
git clone https://github.com/PutuTobing/PSB.git
cd PSB
./install.sh 172.16.31.50

# Access:
# http://172.16.31.50:5173
```

### Scenario 2: Install di 192.168.1.100
```bash
git clone https://github.com/PutuTobing/PSB.git
cd PSB
./install.sh 192.168.1.100

# Access:
# http://192.168.1.100:5173
```

### Scenario 3: Install di localhost
```bash
git clone https://github.com/PutuTobing/PSB.git
cd PSB
./install.sh

# Auto-detect localhost
# Access:
# http://localhost:5173
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Check what's using the port
sudo netstat -tulpn | grep 3000

# Kill the process
sudo kill -9 [PID]
```

### MySQL Container Not Starting
```bash
# Check logs
docker logs PSB-db-1

# Restart container
docker-compose restart db
```

### Frontend Can't Connect to Backend
1. Check backend is running: `curl http://localhost:3000/api/health`
2. Check firewall: `sudo ufw status`
3. Check browser console for CORS errors

### Auto-Detection Not Working
Set manual di `frontend/.env.production`:
```bash
VITE_API_BASE_URL=http://172.16.31.50:3000
```

Then rebuild:
```bash
cd frontend
npm run build
```

## 📚 Dokumentasi Lengkap

Untuk panduan detail, lihat:
- [INSTALLATION-GUIDE.md](./INSTALLATION-GUIDE.md) - Instalasi lengkap
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Production deployment
- [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md) - Development workflow

## 🎉 Selesai!

Setelah instalasi, aplikasi siap digunakan di IP manapun!

**Next Steps:**
1. ✅ Register user pertama
2. ✅ Login ke aplikasi
3. ✅ Explore semua fitur (Dashboard, Pemasangan, Manajemen Akun)
4. ✅ Customize sesuai kebutuhan

**Support:**
- GitHub: https://github.com/PutuTobing/PSB
- Issues: https://github.com/PutuTobing/PSB/issues

Happy coding! 🚀
