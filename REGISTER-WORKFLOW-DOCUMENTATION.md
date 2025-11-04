# 📝 Alur Kerja Register.jsx ke phpMyAdmin (Database)

## 🎯 Overview

Dokumen ini menjelaskan **alur kerja lengkap** dari user mengisi form registrasi hingga data tersimpan di database MySQL yang bisa dilihat di phpMyAdmin.

---

## 🔄 Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         REGISTRATION WORKFLOW                            │
└─────────────────────────────────────────────────────────────────────────┘

1. USER INTERFACE (Frontend - React)
   ┌──────────────────────────────────────┐
   │   Register.jsx Component             │
   │   - Email input field                │
   │   - Password input field             │
   │   - Confirm Password field           │
   │   - Submit button                    │
   └──────────────────────────────────────┘
                    │
                    │ User fills form & clicks "Daftar"
                    ▼
   ┌──────────────────────────────────────┐
   │   Frontend Validation                │
   │   ✓ Email format check               │
   │   ✓ Password length >= 6             │
   │   ✓ Password === Confirm Password    │
   └──────────────────────────────────────┘
                    │
                    │ Validation passed
                    ▼
   ┌──────────────────────────────────────┐
   │   HTTP POST Request                  │
   │   URL: /api/register                 │
   │   Method: POST                       │
   │   Headers: Content-Type: JSON        │
   │   Body: {email, password}            │
   └──────────────────────────────────────┘
                    │
                    │ Fetch API call
                    ▼

2. BACKEND SERVER (Node.js + Express)
   ┌──────────────────────────────────────┐
   │   server.js - Route Handler          │
   │   POST /api/register                 │
   └──────────────────────────────────────┘
                    │
                    ▼
   ┌──────────────────────────────────────┐
   │   Backend Validation                 │
   │   ✓ Email & password provided?       │
   │   ✓ Not empty?                       │
   └──────────────────────────────────────┘
                    │
                    │ Valid
                    ▼
   ┌──────────────────────────────────────┐
   │   Database Query #1                  │
   │   SELECT * FROM users                │
   │   WHERE email = ?                    │
   └──────────────────────────────────────┘
                    │
                    ▼
   ┌──────────────────────────────────────┐
   │   Check User Exists                  │
   │   If exists → Return 400 error       │
   │   If not → Continue                  │
   └──────────────────────────────────────┘
                    │
                    │ User not exists
                    ▼
   ┌──────────────────────────────────────┐
   │   Password Hashing (bcrypt)          │
   │   - Salt rounds: 10                  │
   │   - Original: "password123"          │
   │   - Hashed: "$2a$10$abc...xyz"       │
   └──────────────────────────────────────┘
                    │
                    ▼
   ┌──────────────────────────────────────┐
   │   Database Query #2                  │
   │   INSERT INTO users                  │
   │   (email, password)                  │
   │   VALUES (?, ?)                      │
   └──────────────────────────────────────┘
                    │
                    ▼

3. DATABASE (MySQL - auth_db)
   ┌──────────────────────────────────────┐
   │   MySQL Server                       │
   │   Database: auth_db                  │
   │   Table: users                       │
   └──────────────────────────────────────┘
                    │
                    ▼
   ┌──────────────────────────────────────┐
   │   Data Insertion                     │
   │   - id: AUTO_INCREMENT               │
   │   - email: "user@example.com"        │
   │   - password: "$2a$10$hashed..."     │
   │   - name: NULL (default)             │
   │   - phone: NULL (default)            │
   │   - address: NULL (default)          │
   │   - role: "User" (default)           │
   │   - created_at: CURRENT_TIMESTAMP    │
   └──────────────────────────────────────┘
                    │
                    │ INSERT successful
                    ▼
   ┌──────────────────────────────────────┐
   │   Database Response                  │
   │   Status: Success                    │
   │   Affected Rows: 1                   │
   │   Insert ID: 5 (example)             │
   └──────────────────────────────────────┘
                    │
                    ▼

4. BACKEND RESPONSE
   ┌──────────────────────────────────────┐
   │   HTTP Response                      │
   │   Status: 201 Created                │
   │   Body: {                            │
   │     message: "User registered..."    │
   │   }                                  │
   └──────────────────────────────────────┘
                    │
                    │ Response sent to frontend
                    ▼

5. FRONTEND RESPONSE HANDLING
   ┌──────────────────────────────────────┐
   │   Register.jsx - Success Handler     │
   │   - Show success message             │
   │   - Wait 2 seconds                   │
   │   - Navigate to /login               │
   └──────────────────────────────────────┘
                    │
                    ▼
   ┌──────────────────────────────────────┐
   │   User Redirected to Login Page      │
   │   Can now login with new account     │
   └──────────────────────────────────────┘

6. VIEW IN PHPMYADMIN
   ┌──────────────────────────────────────┐
   │   phpMyAdmin Interface               │
   │   http://localhost/phpmyadmin        │
   │   - Select database: auth_db         │
   │   - Select table: users              │
   │   - View new user data               │
   └──────────────────────────────────────┘
```

---

## 📋 Detailed Step-by-Step Process

### **STEP 1: User Mengisi Form (Frontend)**

**File**: `frontend/src/pages/Register.jsx`

```javascript
// User interaction
<input 
  type="email" 
  value={email} 
  onChange={(e) => setEmail(e.target.value)} 
  placeholder="Masukkan email Anda"
/>

<input 
  type="password" 
  value={password} 
  onChange={(e) => setPassword(e.target.value)} 
  placeholder="Minimal 6 karakter"
/>

<button type="submit" onClick={handleSubmit}>
  Daftar
</button>
```

**Input Example**:
- Email: `john@example.com`
- Password: `password123`
- Confirm Password: `password123`

---

### **STEP 2: Frontend Validation**

**File**: `frontend/src/pages/Register.jsx`

```javascript
const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    
    // Validation 1: Password length
    if (password.length < 6) {
        setError('Password harus minimal 6 karakter');
        return; // Stop execution
    }

    // Validation 2: Password match
    if (password !== confirmPassword) {
        setError('Password dan konfirmasi password tidak cocok');
        return; // Stop execution
    }

    // If validation passed, continue to API call
    // ...
}
```

**Validation Rules**:
- ✅ Password minimum 6 characters
- ✅ Password and Confirm Password must match
- ✅ Email format validated by HTML5 `type="email"`

---

### **STEP 3: API Call ke Backend**

**File**: `frontend/src/pages/Register.jsx`

```javascript
// HTTP POST request
const res = await fetch('/api/register', {
    method: 'POST',
    headers: { 
        'Content-Type': 'application/json' 
    },
    body: JSON.stringify({ 
        email: 'john@example.com',
        password: 'password123' 
    })
});
```

**Request Details**:
```
Method: POST
URL: http://172.16.31.11:3000/api/register (auto-detected)
Headers:
  Content-Type: application/json
Body:
  {
    "email": "john@example.com",
    "password": "password123"
  }
```

---

### **STEP 4: Backend Menerima Request**

**File**: `backend/server.js`

```javascript
app.post('/api/register', async (req, res) => {
    const { email, password } = req.body;
    
    // Backend validation
    if (!email || !password) {
        return res.status(400).json({ 
            message: 'Email and password are required' 
        });
    }
    
    // Continue processing...
});
```

**Backend Receives**:
```javascript
{
  email: "john@example.com",
  password: "password123"
}
```

---

### **STEP 5: Cek User Sudah Ada atau Belum**

**File**: `backend/server.js`

```javascript
// Query database to check if user exists
const checkUserSql = 'SELECT * FROM users WHERE email = ?';

db.execute(checkUserSql, [email], async (err, results) => {
    if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
    
    if (results.length > 0) {
        // User already exists!
        return res.status(400).json({ 
            message: 'User already exists' 
        });
    }
    
    // User not exists, continue to registration
    // ...
});
```

**SQL Query Executed**:
```sql
SELECT * FROM users WHERE email = 'john@example.com';
```

**Possible Results**:
- **Empty result** (length = 0): User belum ada, lanjut registrasi
- **Has result** (length > 0): User sudah ada, return error

---

### **STEP 6: Hash Password dengan bcrypt**

**File**: `backend/server.js`

```javascript
// Import bcrypt
const bcrypt = require('bcryptjs');

// Hash password with salt rounds = 10
const hashedPassword = await bcrypt.hash(password, 10);

console.log('Original password:', password);
console.log('Hashed password:', hashedPassword);
```

**Password Hashing**:
```
Original: "password123"
Hashed:   "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy"

Format: $2a$10$[salt][hash]
- $2a: bcrypt algorithm version
- $10: cost factor (2^10 iterations = 1024)
- Next 22 chars: salt
- Remaining: actual hash
```

**Why Hash?**
- 🔒 **Security**: Password tidak disimpan plain text
- 🔐 **One-way**: Tidak bisa di-decrypt kembali
- 🛡️ **Salt**: Setiap hash berbeda meskipun password sama
- ⏱️ **Slow**: Designed to be slow untuk prevent brute force

---

### **STEP 7: Insert User ke Database**

**File**: `backend/server.js`

```javascript
// Insert new user into database
const insertUserSql = 'INSERT INTO users (email, password) VALUES (?, ?)';

db.execute(insertUserSql, [email, hashedPassword], (err, results) => {
    if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
    
    // Success!
    res.status(201).json({ 
        message: 'User registered successfully' 
    });
});
```

**SQL Query Executed**:
```sql
INSERT INTO users (email, password) 
VALUES (
    'john@example.com', 
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'
);
```

**Database Connection**:
```javascript
// From backend/server.js
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'btd',
    password: process.env.DB_PASSWORD || 'Balionelove_121',
    database: process.env.DB_NAME || 'auth_db'
});
```

---

### **STEP 8: Data Tersimpan di MySQL**

**Database**: `auth_db`
**Table**: `users`

**Table Structure**:
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) DEFAULT NULL,
    phone VARCHAR(20) DEFAULT NULL,
    address TEXT DEFAULT NULL,
    role ENUM('User', 'Administrator') DEFAULT 'User',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**New Row Inserted**:
```
+----+--------------------+----------------------------------------------------------+------+-------+---------+------+---------------------+---------------------+
| id | email              | password                                                 | name | phone | address | role | created_at          | updated_at          |
+----+--------------------+----------------------------------------------------------+------+-------+---------+------+---------------------+---------------------+
| 5  | john@example.com   | $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy | NULL | NULL  | NULL    | User | 2025-11-03 10:30:45 | 2025-11-03 10:30:45 |
+----+--------------------+----------------------------------------------------------+------+-------+---------+------+---------------------+---------------------+
```

**Field Values**:
- `id`: Auto-generated (AUTO_INCREMENT)
- `email`: "john@example.com" (user input)
- `password`: "$2a$10$..." (bcrypt hashed)
- `name`: NULL (default, bisa diisi nanti di profile)
- `phone`: NULL (default)
- `address`: NULL (default)
- `role`: "User" (default, bisa diubah admin jadi "Administrator")
- `created_at`: Current timestamp (auto)
- `updated_at`: Current timestamp (auto)

---

### **STEP 9: Backend Response ke Frontend**

**File**: `backend/server.js`

```javascript
// Success response
res.status(201).json({ 
    message: 'User registered successfully' 
});
```

**HTTP Response**:
```
Status: 201 Created
Content-Type: application/json
Body:
{
  "message": "User registered successfully"
}
```

---

### **STEP 10: Frontend Menangani Response**

**File**: `frontend/src/pages/Register.jsx`

```javascript
const data = await res.json();

if (res.ok) {
    // Show success message
    setSuccess('Registrasi berhasil! Mengalihkan ke login...');
    
    // Wait 2 seconds
    setTimeout(() => {
        // Navigate to login page
        navigate('/login');
    }, 2000);
} else {
    // Show error message
    setError(data.message || 'Registrasi gagal. Silakan coba lagi.');
}
```

**User Experience**:
1. ✅ Success alert muncul (hijau)
2. ⏱️ Wait 2 detik
3. 🔄 Auto-redirect ke halaman Login
4. 🎉 User bisa login dengan akun baru

---

## 🔍 View Data di phpMyAdmin

### **Akses phpMyAdmin**

1. **Open Browser**
   ```
   http://localhost/phpmyadmin
   atau
   http://172.16.31.11/phpmyadmin
   ```

2. **Login phpMyAdmin**
   - Username: `root` (atau sesuai config)
   - Password: (kosong atau sesuai config)

3. **Select Database**
   - Klik `auth_db` di sidebar kiri

4. **Select Table**
   - Klik `users` di list tabel

5. **View Data**
   - Tab "Browse" untuk lihat semua data
   - Tab "Structure" untuk lihat struktur tabel
   - Tab "SQL" untuk run custom query

### **SQL Query untuk View Users**

```sql
-- Lihat semua users
SELECT * FROM users;

-- Lihat users terbaru (sorted by created_at)
SELECT * FROM users ORDER BY created_at DESC;

-- Lihat user tertentu by email
SELECT * FROM users WHERE email = 'john@example.com';

-- Count total users
SELECT COUNT(*) as total_users FROM users;

-- Group by role
SELECT role, COUNT(*) as count FROM users GROUP BY role;
```

---

## 🔐 Security Features

### **1. Password Hashing**
```javascript
// Backend: bcrypt.hash(password, 10)
"password123" → "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy"
```
- ✅ One-way encryption
- ✅ Salt rounds = 10 (2^10 = 1024 iterations)
- ✅ Unique salt per hash

### **2. SQL Injection Prevention**
```javascript
// ❌ UNSAFE: Direct string concatenation
const sql = `INSERT INTO users VALUES ('${email}', '${password}')`;

// ✅ SAFE: Prepared statements with placeholders
const sql = 'INSERT INTO users (email, password) VALUES (?, ?)';
db.execute(sql, [email, password]);
```

### **3. Duplicate User Check**
```javascript
// Check before insert
SELECT * FROM users WHERE email = ?
// If exists → Return error
// If not → Continue insert
```

### **4. Input Validation**
- **Frontend**: Email format, password length, password match
- **Backend**: Empty check, data type validation

---

## 🛠️ Error Handling

### **Frontend Errors**
```javascript
try {
    const res = await fetch('/api/register', {...});
    // Handle success
} catch (err) {
    setError('Terjadi kesalahan. Pastikan server berjalan.');
}
```

### **Backend Errors**

#### 1. **Missing Fields (400)**
```javascript
if (!email || !password) {
    return res.status(400).json({ 
        message: 'Email and password are required' 
    });
}
```

#### 2. **User Already Exists (400)**
```javascript
if (results.length > 0) {
    return res.status(400).json({ 
        message: 'User already exists' 
    });
}
```

#### 3. **Database Error (500)**
```javascript
if (err) {
    console.error('Database error:', err);
    return res.status(500).json({ 
        message: 'Server error' 
    });
}
```

---

## 📊 Database Schema

### **users Table**

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) DEFAULT NULL,
    phone VARCHAR(20) DEFAULT NULL,
    address TEXT DEFAULT NULL,
    role ENUM('User', 'Administrator') DEFAULT 'User',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email),
    INDEX idx_users_role (role)
);
```

**Indexes**:
- `PRIMARY KEY` on `id`: Fast lookup by ID
- `UNIQUE` on `email`: Prevent duplicate emails
- `INDEX` on `email`: Fast search by email
- `INDEX` on `role`: Fast filtering by role

---

## 🎯 Data Flow Summary

```
User Input (Frontend)
    ↓
Frontend Validation
    ↓
HTTP POST Request
    ↓
Backend Route Handler
    ↓
Backend Validation
    ↓
Check User Exists (SELECT query)
    ↓
Password Hashing (bcrypt)
    ↓
Insert User (INSERT query)
    ↓
MySQL Database (auth_db.users)
    ↓
Success Response
    ↓
Frontend Success Handler
    ↓
Redirect to Login
    ↓
View in phpMyAdmin
```

---

## 🧪 Testing Flow

### **Manual Test**

1. **Start Backend**
   ```bash
   cd backend
   npm start
   # Server running on http://localhost:3000
   ```

2. **Start Frontend**
   ```bash
   cd frontend
   npm run dev
   # Frontend running on http://localhost:5173
   ```

3. **Open Browser**
   ```
   http://localhost:5173/register
   ```

4. **Fill Form**
   - Email: `test@example.com`
   - Password: `test123`
   - Confirm: `test123`

5. **Submit**
   - Click "Daftar" button

6. **Check Success**
   - Success message appears
   - Auto-redirect to /login

7. **Verify in phpMyAdmin**
   ```
   http://localhost/phpmyadmin
   → auth_db
   → users table
   → Browse
   → Find new user "test@example.com"
   ```

### **API Test with curl**

```bash
# Test register endpoint
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{"email":"curl@example.com","password":"curl123"}'

# Expected response:
# {"message":"User registered successfully"}
```

### **Database Verification**

```bash
# Login to MySQL
mysql -u btd -p auth_db

# Query users
SELECT * FROM users WHERE email = 'curl@example.com';

# Expected output:
# +----+--------------------+----------------------------------------------------------+...
# | 6  | curl@example.com   | $2a$10$... | NULL | NULL | NULL | User | 2025-11-03 ... |
# +----+--------------------+----------------------------------------------------------+...
```

---

## 📝 Notes

### **Default Values**
- `name`, `phone`, `address`: NULL (bisa diisi nanti via Edit Profile)
- `role`: "User" (bisa diubah admin jadi "Administrator")
- `created_at`, `updated_at`: Auto-generated timestamps

### **Password Management**
- **Never** store plain text passwords
- **Always** use bcrypt or similar hashing
- **Never** log passwords in console/logs
- **Never** return passwords in API responses

### **Best Practices**
- ✅ Use HTTPS in production
- ✅ Validate input on frontend AND backend
- ✅ Use prepared statements (prevent SQL injection)
- ✅ Hash passwords with strong algorithm (bcrypt)
- ✅ Check for duplicate users before insert
- ✅ Return appropriate HTTP status codes
- ✅ Handle errors gracefully
- ✅ Use environment variables for sensitive data

---

## 🔗 Related Files

- **Frontend**: `frontend/src/pages/Register.jsx`, `Register.css`
- **Backend**: `backend/server.js`, `backend/.env`
- **Database**: `database/manajemen-akun-setup.sql`
- **Config**: `backend/package.json`, `frontend/package.json`

---

**Created**: November 3, 2025  
**Author**: GitHub Copilot  
**Version**: 1.0.0
