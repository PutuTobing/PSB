# Panduan Instalasi di IP Address Berbeda

## 📋 Overview
Aplikasi Database-Login ini menggunakan **auto-detection** untuk IP address, sehingga bisa diinstall di IP manapun tanpa perlu konfigurasi hardcode.

## 🎯 Instalasi di IP Baru (contoh: 172.16.31.50)

### 1️⃣ Clone Repository
```bash
git clone https://github.com/PutuTobing/PSB.git
cd PSB
```

### 2️⃣ Install Docker & Docker Compose
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install docker-compose -y

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker
```

### 3️⃣ Setup Database dengan Docker
```bash
# Start MySQL & phpMyAdmin
docker-compose up -d

# Tunggu 30 detik agar MySQL siap
sleep 30

# Verify containers running
docker ps
```

Akses phpMyAdmin di: `http://172.16.31.50:8081`
- Username: `root`
- Password: `rootpassword`

### 4️⃣ Import Database Schema
```bash
# Copy SQL files ke MySQL container
docker cp database/customers-schema.sql PSB-db-1:/tmp/
docker cp database/pemasangan-schema.sql PSB-db-1:/tmp/
docker cp database/manajemen-akun-setup.sql PSB-db-1:/tmp/

# Execute SQL import
docker exec -i PSB-db-1 mysql -uroot -prootpassword auth_db < database/customers-schema.sql
docker exec -i PSB-db-1 mysql -uroot -prootpassword auth_db < database/pemasangan-schema.sql
docker exec -i PSB-db-1 mysql -uroot -prootpassword auth_db < database/manajemen-akun-setup.sql
```

Atau import manual via phpMyAdmin.

### 5️⃣ Install Node.js Dependencies

#### Backend:
```bash
cd backend
npm install
```

#### Frontend:
```bash
cd ../frontend
npm install
```

### 6️⃣ Konfigurasi Environment Variables

#### Backend (.env jika diperlukan):
Backend menggunakan hardcoded connection ke `localhost:3306`, jadi tidak perlu ubah.

#### Frontend (sudah auto-detect):
File `.env.development` dan `.env.production` sudah dikonfigurasi untuk auto-detect IP dari browser:

```bash
# File: frontend/.env.development
VITE_API_BASE_URL=
VITE_API_PORT=3000
```

**Kosong = Auto-detect!** ✅

### 7️⃣ Update Backend Server Configuration (Optional)

Jika ingin backend listen di specific IP, edit `backend/server.js`:

```javascript
// Current: Listen on all interfaces (0.0.0.0)
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0'; // Accessible dari semua IP

app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
```

Biarkan default (`0.0.0.0`) agar accessible dari semua IP.

### 8️⃣ Start Application

#### Terminal 1 - Backend:
```bash
cd backend
node server.js
```

Output:
```
Server running on http://0.0.0.0:3000
MySQL Connected: auth_db
```

#### Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

Output:
```
VITE v7.1.9  ready in 543 ms

➜  Local:   http://localhost:5173/
➜  Network: http://172.16.31.50:5173/
```

### 9️⃣ Access Application

**Development Mode:**
- Frontend: `http://172.16.31.50:5173`
- Backend API: `http://172.16.31.50:3000`
- phpMyAdmin: `http://172.16.31.50:8081`

**Production Build:**
```bash
cd frontend
npm run build
npm run preview
```
Access: `http://172.16.31.50:4173`

## 🔧 Konfigurasi Manual IP (Jika Diperlukan)

### Opsi 1: Set Specific IP di Frontend
Edit `frontend/.env.production`:
```bash
VITE_API_BASE_URL=http://172.16.31.50:3000
VITE_API_PORT=3000
```

### Opsi 2: Set di Backend
Edit `backend/server.js` untuk CORS:
```javascript
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://172.16.31.50:5173',
    'http://172.16.31.50:4173',
    'http://172.16.31.11:5173',
    // Add more IPs as needed
  ],
  credentials: true
};
app.use(cors(corsOptions));
```

## 🌐 Firewall Configuration

Buka port yang diperlukan:

```bash
# UFW (Ubuntu)
sudo ufw allow 3000/tcp   # Backend API
sudo ufw allow 5173/tcp   # Vite Dev Server
sudo ufw allow 4173/tcp   # Vite Preview
sudo ufw allow 3306/tcp   # MySQL (optional, untuk remote access)
sudo ufw allow 8081/tcp   # phpMyAdmin
sudo ufw reload

# Atau disable firewall untuk testing
sudo ufw disable
```

## 🧪 Testing Instalasi

### Test Backend API:
```bash
curl http://172.16.31.50:3000/api/health
# Expected: {"status":"OK","database":"Connected"}
```

### Test Frontend Access:
```bash
curl -I http://172.16.31.50:5173
# Expected: HTTP/1.1 200 OK
```

### Test Database Connection:
```bash
docker exec -it PSB-db-1 mysql -uroot -prootpassword -e "SHOW DATABASES;"
# Should show: auth_db
```

## 🚀 Production Deployment

### Menggunakan PM2 untuk Backend:
```bash
# Install PM2
npm install -g pm2

# Start backend with PM2
cd backend
pm2 start server.js --name "btd-backend"

# Auto-start on boot
pm2 startup
pm2 save
```

### Menggunakan Nginx untuk Frontend:
```bash
# Install Nginx
sudo apt install nginx -y

# Build frontend
cd frontend
npm run build

# Copy build files
sudo cp -r dist/* /var/www/html/

# Configure Nginx
sudo nano /etc/nginx/sites-available/default
```

Nginx config:
```nginx
server {
    listen 80;
    server_name 172.16.31.50;

    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Restart Nginx:
```bash
sudo systemctl restart nginx
sudo systemctl enable nginx
```

## 📝 Checklist Instalasi

- [ ] Clone repository
- [ ] Install Docker & Docker Compose
- [ ] Start MySQL container (`docker-compose up -d`)
- [ ] Import database schema
- [ ] Install backend dependencies (`npm install`)
- [ ] Install frontend dependencies (`npm install`)
- [ ] Configure firewall ports (3000, 5173, 3306, 8081)
- [ ] Start backend server (`node server.js`)
- [ ] Start frontend server (`npm run dev`)
- [ ] Test access di browser: `http://172.16.31.50:5173`
- [ ] Create admin user via Register page
- [ ] Login dan verify semua menu berfungsi

## 🔐 Default Credentials

### Database:
- Host: `localhost` (atau IP server)
- Port: `3306`
- User: `root`
- Password: `rootpassword`
- Database: `auth_db`

### phpMyAdmin:
- URL: `http://[IP]:8081`
- User: `root`
- Password: `rootpassword`

### Application:
- Buat user pertama via Register page
- Default role: Agen
- Admin harus di-set manual di database

## ⚠️ Troubleshooting

### 1. Backend tidak bisa connect ke MySQL
```bash
# Check MySQL container status
docker ps | grep mysql

# Check MySQL logs
docker logs PSB-db-1

# Restart container
docker-compose restart db
```

### 2. Frontend tidak bisa access Backend
```bash
# Check backend logs
cd backend
node server.js

# Check CORS errors di browser console
# Add IP ke CORS origin di server.js
```

### 3. Port sudah digunakan
```bash
# Check port usage
sudo netstat -tulpn | grep 3000
sudo netstat -tulpn | grep 5173

# Kill process using port
sudo kill -9 [PID]
```

### 4. Auto-detection tidak bekerja
Set manual di `.env.production`:
```bash
VITE_API_BASE_URL=http://172.16.31.50:3000
```

Then rebuild:
```bash
npm run build
```

## 📞 Support

Jika mengalami masalah instalasi:
1. Check logs: `docker logs PSB-db-1`
2. Check backend console output
3. Check browser console untuk errors
4. Verify firewall tidak block ports

## 🎉 Selesai!

Aplikasi sekarang berjalan di:
- **Frontend**: `http://172.16.31.50:5173`
- **Backend API**: `http://172.16.31.50:3000`
- **phpMyAdmin**: `http://172.16.31.50:8081`
- **Database**: `172.16.31.50:3306`

Enjoy! 🚀
