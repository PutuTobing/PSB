# Troubleshooting Guide - Error 401 Unauthorized

## Masalah
Error `GET http://localhost:3000/users 401 (Unauthorized)` menunjukkan bahwa request ke endpoint `/users` tidak berhasil karena kurang kredensial autentikasi yang valid.

## Langkah Troubleshooting

### 1. Login ke Aplikasi
1. Buka browser ke `http://localhost:5174`
2. Login dengan kredensial admin:
   - **Email**: `admin@btd.com`
   - **Password**: `password`

### 2. Periksa Console Browser
Setelah login dan masuk ke halaman Manajemen Akun:
1. Buka Developer Tools (F12)
2. Pilih tab Console
3. Lihat log debug yang ditambahkan:
   - "Loading users..."
   - "Token for users request: Token found"
   - "Making request to /users endpoint..."
   - "Users response status: [status code]"

### 3. Periksa Network Tab
1. Buka tab Network di Developer Tools
2. Filter untuk request ke `/users`
3. Periksa:
   - Request Headers → Authorization: Bearer [token]
   - Response Status Code
   - Response Headers

### 4. Verificasi Token di localStorage
```javascript
// Jalankan di Console browser
console.log('Token:', localStorage.getItem('token'));
console.log('User:', localStorage.getItem('user'));
```

### 5. Test Backend API Manual
```bash
# Test login untuk mendapatkan token
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@btd.com","password":"password"}'

# Test endpoint users dengan token
curl -X GET http://localhost:3000/users \
  -H "Authorization: Bearer [TOKEN_DARI_LOGIN]"
```

## Kemungkinan Penyebab & Solusi

### 1. Token Tidak Ada di localStorage
**Gejala**: Console menunjukkan "No token found"
**Solusi**: 
- Login ulang ke aplikasi
- Pastikan proses login berhasil dan menyimpan token

### 2. Token Expired
**Gejala**: Token ada tapi response 401
**Solusi**:
- Token JWT expire dalam 1 jam
- Login ulang untuk mendapatkan token baru
- Aplikasi otomatis redirect ke login saat token expired

### 3. Token Invalid/Corrupted
**Gejala**: Token ada tapi tidak valid
**Solusi**:
- Clear localStorage: `localStorage.clear()`
- Login ulang

### 4. User Bukan Administrator
**Gejala**: Response 403 Forbidden
**Solusi**:
- Pastikan login dengan akun admin
- Default admin: `admin@btd.com` / `password`

### 5. Backend Server Tidak Berjalan
**Gejala**: Connection refused atau timeout
**Solusi**:
```bash
# Cek status server
curl http://localhost:3000/

# Restart server jika perlu
cd /home/btd/Database-Login/backend
node server.js
```

## Implementasi Perbaikan yang Sudah Dilakukan

### 1. Enhanced Error Handling
```javascript
// Pengecekan token exists
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
```

### 2. Comprehensive Auth Error Handler
```javascript
const handleAuthError = (response) => {
    if (response.status === 401) {
        // Token expired/invalid - redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setTimeout(() => {
            window.location.href = '/login';
        }, 2000);
        return true;
    } else if (response.status === 403) {
        // Access denied - insufficient permissions
        showNotification('Akses ditolak. Anda tidak memiliki izin untuk melakukan aksi ini.', 'error');
        return true;
    }
    return false;
};
```

### 3. Role-based Data Loading
```javascript
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
```

### 4. Debug Logging
Ditambahkan console.log untuk debugging:
- Token existence check
- Request/response status
- Error details

## Testing Steps

1. **Clear Browser Data**:
   - Clear localStorage
   - Clear cookies
   - Hard refresh (Ctrl+F5)

2. **Fresh Login Test**:
   - Login dengan admin credentials
   - Monitor console untuk debug logs
   - Verify token is saved in localStorage

3. **API Access Test**:
   - Navigate to Manajemen Akun
   - Check if all tabs load correctly
   - Monitor network requests

4. **Role Permission Test**:
   - Test with User role (should only see Konfigurasi tab)
   - Test with Administrator role (should see all tabs)

## Expected Behavior

### For Administrator Users:
- ✅ Can access all tabs (Konfigurasi, Manajemen Pengguna, Master Data, Log Aktivitas)
- ✅ Can perform CRUD operations on users, agents, villages
- ✅ Can view activity logs

### For Regular Users:
- ✅ Can only access Konfigurasi tab
- ✅ Can edit own profile and change password
- ❌ Cannot access admin-only features

## Status Monitoring

Backend endpoints yang harus berfungsi:
- ✅ `POST /api/login` - Authentication
- ✅ `GET /auth/profile` - User profile
- ✅ `GET /users` - Users list (Admin only)
- ✅ `GET /agents` - Agents list
- ✅ `GET /villages` - Villages list
- ✅ `GET /activity-logs` - Activity logs (Admin only)

Jika masih mengalami masalah, periksa:
1. Backend server log: `tail -f /home/btd/Database-Login/backend/server.log`
2. Database connection
3. JWT_SECRET consistency