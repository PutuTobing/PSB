# 🚀 BTD Database Login Application

> **Modern Customer Management System for Internet Service Provider**

[![React](https://img.shields.io/badge/React-19.2.0-blue.svg)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-7.1.9-purple.svg)](https://vitejs.dev)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org)
[![MySQL](https://img.shields.io/badge/MySQL-8.0%2B-orange.svg)](https://www.mysql.com)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A comprehensive full-stack application with React frontend and Node.js backend for managing customer installations, users, and master data.

## ✨ Key Features

✅ **User Management** - Full CRUD with role-based access control (Admin/User)  
✅ **Installation Tracking** - Complete customer installation lifecycle management  
✅ **Master Data** - Agents and Villages/Desa management system  
✅ **JWT Authentication** - Secure token-based authentication with password hashing  
✅ **Mobile Optimized** - Responsive design with icon-only buttons (768px, 480px breakpoints)  
✅ **Modern UI/UX** - Elegant gradients, smooth animations, Bootstrap Icons integration  
✅ **Real-time Updates** - Dynamic data fetching with loading states  
✅ **Search & Filter** - Advanced filtering by month, year, status, and location  

## 📸 Screenshots

### Desktop View
- Dashboard with real-time statistics
- Installation management with advanced filters
- User management with elegant action buttons

### Mobile View
- Responsive card layout
- Icon-only action buttons (44x44px)
- Touch-friendly interface

## 📚 Documentation

### 🚀 Quick Start
**→ [QUICK-INSTALL.md](./QUICK-INSTALL.md)** - Install in 5 minutes on ANY IP address

### 📖 Complete Guides
- **[INSTALLATION-GUIDE.md](./INSTALLATION-GUIDE.md)** - Detailed installation for any IP (172.16.31.50, etc.)
- **[MASTER_DOCUMENTATION.md](./MASTER_DOCUMENTATION.md)** - Complete guide for developers
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Production deployment guide
- **[DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md)** - Development workflow

### 🎯 Key Features
- ✨ **Auto IP Detection** - No hardcoded IPs, works anywhere!
- 🔧 **Auto Installer** - One command setup: `./install.sh`
- � **Multi-IP Support** - Install on 172.16.31.50, 192.168.1.100, or any IP
- 🐳 **Docker Ready** - MySQL & phpMyAdmin included

## 🛠️ Tech Stack

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Frontend** | React | 19.2.0 | UI components & state management |
| | Vite | 7.1.9 | Fast build tool & dev server |
| | Bootstrap Icons | 1.11.3 | Modern icon library |
| | Custom CSS | - | Responsive styling with mobile-first |
| **Backend** | Node.js | 18+ | JavaScript runtime |
| | Express | 4.x | Web framework & REST API |
| | MySQL2 | Latest | Database driver with promises |
| | JWT | Latest | Token-based authentication |
| | bcryptjs | Latest | Password hashing |
| **Database** | MySQL | 8.0+ | Relational database |
| | phpMyAdmin | Latest | Database management UI |

## 📋 Prerequisites

Before installation, ensure you have:

- **Node.js** >= 18.0.0 ([Download](https://nodejs.org/))
- **MySQL** >= 8.0 ([Download](https://dev.mysql.com/downloads/))
- **Git** ([Download](https://git-scm.com/downloads))
- **npm** or **yarn** (comes with Node.js)
- **XAMPP/LAMPP** (optional, for easy MySQL setup)

## 🚀 Installation Guide

### Step 1: Clone Repository

```bash
# Clone dari GitHub
git clone https://github.com/PutuTobing/PSB.git
cd PSB

# Atau jika sudah clone, update ke versi terbaru
git pull origin master
```

### Step 2: Setup Database

#### Option A: Using XAMPP/LAMPP (Recommended for Beginners)

```bash
# Start XAMPP
sudo /opt/lampp/lampp start

# Or on Windows
# Open XAMPP Control Panel and start MySQL

# Access phpMyAdmin
# Browser: http://localhost/phpmyadmin
```

#### Option B: Using MySQL Server Directly

```bash
# Start MySQL service
sudo systemctl start mysql

# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE auth_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Create user (optional)
CREATE USER 'auth_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON auth_db.* TO 'auth_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### Import Database Schema

```bash
# From project root directory
mysql -u root -p auth_db < database/customers-schema.sql

# Or use phpMyAdmin:
# 1. Open phpMyAdmin (http://localhost/phpmyadmin)
# 2. Select 'auth_db' database
# 3. Click 'Import' tab
# 4. Choose file: database/customers-schema.sql
# 5. Click 'Go'
```

### Step 3: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cat > .env << EOF
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=auth_db
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
EOF

# Note: Change DB_PASSWORD if you set MySQL root password
# Note: Generate secure JWT_SECRET for production

# Start backend server
npm start

# ✅ Backend should be running on http://localhost:3000
```

### Step 4: Frontend Setup

```bash
# Open new terminal window/tab
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# ✅ Frontend should be running on http://localhost:5173
```

### Step 5: Access Application

Open your browser and navigate to:

```
Frontend: http://localhost:5173
Backend API: http://localhost:3000
phpMyAdmin: http://localhost/phpmyadmin (if using XAMPP)
```

### Step 6: Default Login Credentials

```
Email: admin@btd.com
Password: password
```

**⚠️ Important**: Change default password after first login!

## 🔧 Configuration

### Environment Variables

Create `backend/.env` file with these variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=auth_db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_EXPIRES_IN=7d

# CORS Configuration (optional)
CORS_ORIGIN=http://localhost:5173
```

### Database Configuration

Edit `backend/server.js` if needed:

```javascript
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'auth_db'
});
```

## 🎯 Quick Start Commands

```bash
# Backend Development
cd backend
npm start              # Start server
npm run dev            # Start with nodemon (auto-restart)

# Frontend Development
cd frontend
npm run dev            # Start Vite dev server
npm run build          # Build for production
npm run preview        # Preview production build

# Database Management
mysql -u root -p       # Access MySQL CLI
# Or use phpMyAdmin:   http://localhost/phpmyadmin

# Git Operations
git status             # Check changes
git pull               # Update from GitHub
git add .              # Stage changes
git commit -m "msg"    # Commit changes
git push origin master # Push to GitHub
```

## 📱 Usage Guide

### 1. Registration (New Users)
1. Go to `http://localhost:5173/register`
2. Fill in: Name, Email, Password
3. Click "Register"
4. Redirected to login page

### 2. Login
1. Go to `http://localhost:5173/login`
2. Enter email and password
3. Click "Login"
4. Redirected to Dashboard

### 3. Dashboard
- View welcome message with your name
- See installation statistics (Total, Pending, Confirmed, Installed)
- Access navigation menu

### 4. Daftar Pemasangan (Installation Management)
- **View**: Responsive table (desktop) or cards (mobile)
- **Search**: By customer name
- **Filter**: By month, year, village/desa, status
- **Add**: Click "Tambah Pelanggan" button
- **Edit**: Click edit icon on each row
- **Delete**: Click delete icon with confirmation
- **Export**: Download data as CSV/Excel

### 5. Manajemen Akun (Account Management - Admin Only)
- **Profile Tab**: View/edit current user profile
- **Users Tab**: Manage all users (CRUD operations)
- **Master Data Tab**: Manage Agents and Villages
- **Activity Logs Tab**: View system activity

### 6. Logout
Click user menu → Logout (clears token and redirects to login)

## 📊 Project Structure

```
PSB/
├── backend/
│   ├── server.js              # Express API server
│   ├── package.json           # Backend dependencies
│   ├── .env                   # Environment variables (create this)
│   └── server.log             # Application logs
├── frontend/
│   ├── src/
│   │   ├── pages/             # Page components
│   │   │   ├── DaftarPemasangan.jsx    # Installation management
│   │   │   ├── ManajemenAkun.jsx       # User & master data
│   │   │   ├── Dashboard.jsx           # Main dashboard
│   │   │   └── Login.jsx              # Authentication
│   │   ├── components/        # Reusable components
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── Layout.jsx
│   │   ├── App.jsx           # React router setup
│   │   └── main.jsx          # Entry point
│   ├── vite.config.js        # Vite configuration
│   └── package.json          # Frontend dependencies
├── database/
│   ├── customers-schema.sql         # Database schema
│   ├── manajemen-akun-setup.sql    # User management tables
│   └── pemasangan-schema.sql       # Installation tables
├── MASTER_DOCUMENTATION.md    # Complete documentation (READ THIS!)
└── README.md                  # This file
```

## 🗄️ Database Schema

### Tables Overview

```sql
auth_db
├── users           # User accounts and authentication
├── pemasangan      # Customer installation records
├── agents          # Agent/sales representatives
└── villages        # Village/Desa master data
```

### Key Relationships

```
users (1) ─────────── (∞) pemasangan [created_by]
agents (1) ────────── (∞) pemasangan [agent_id]
villages (1) ────────── (∞) pemasangan [desa_id]
```

### Sample Queries

```sql
-- Get all installations with agent and village names
SELECT 
    p.*,
    a.name as agent_name,
    v.name as village_name
FROM pemasangan p
LEFT JOIN agents a ON p.agent_id = a.id
LEFT JOIN villages v ON p.desa_id = v.id
ORDER BY p.created_at DESC;

-- Get installation statistics by status
SELECT 
    status,
    COUNT(*) as total,
    SUM(harga) as total_revenue,
    SUM(komisi) as total_commission
FROM pemasangan
GROUP BY status;
```

## 🌐 API Endpoints

### Authentication
```
POST   /api/auth/login          # User login
POST   /api/auth/register       # New user registration
GET    /api/auth/profile        # Get current user profile
```

### Users Management (Admin Only)
```
GET    /api/users               # List all users
POST   /api/users               # Create new user
PUT    /api/users/:id           # Update user
DELETE /api/users/:id           # Delete user
POST   /api/users/:id/reset-password  # Reset password
```

### Installations
```
GET    /api/pemasangan          # List installations
POST   /api/pemasangan          # Create installation
PUT    /api/pemasangan/:id      # Update installation
DELETE /api/pemasangan/:id      # Delete installation
```

### Master Data
```
GET/POST/PUT/DELETE /api/agents     # Agent management
GET/POST/PUT/DELETE /api/villages   # Village management
```

**→ Complete API documentation in [MASTER_DOCUMENTATION.md](./MASTER_DOCUMENTATION.md)**

## 🎨 UI/UX Features

### Mobile Optimization
- ✅ Icon-only action buttons (44x44px) for touch screens
- ✅ Responsive table → card layout on mobile
- ✅ Modal viewport positioning (no scroll needed)
- ✅ Touch-friendly tap targets (minimum 44px)
- ✅ Optimized for 768px and 480px breakpoints

### Design System
- ✅ Gradient action buttons with hover effects
- ✅ Bootstrap Icons for consistency
- ✅ Smooth transitions and animations
- ✅ Loading states and error handling
- ✅ Dark/light theme ready
- ✅ Mobile-first CSS approach

## 🔐 Security Features

- ✅ **JWT Authentication**: Token-based secure auth
- ✅ **Password Hashing**: bcrypt with salt rounds
- ✅ **Input Validation**: Email, password validation
- ✅ **SQL Injection Protection**: Prepared statements
- ✅ **CORS Enabled**: Cross-origin resource sharing
- ✅ **Environment Variables**: Sensitive data protection
- ✅ **Role-Based Access**: Admin/User permissions

## 🐛 Troubleshooting

### Common Issues

**Port 3000 already in use**
```bash
sudo kill -9 $(lsof -t -i:3000)
# Or use different port: PORT=3001 npm start
```

**Database connection failed**
```bash
# Check if MySQL is running
sudo systemctl status mysql
# Or for XAMPP
sudo /opt/lampp/lampp status

# Start MySQL
sudo systemctl start mysql
# Or
sudo /opt/lampp/lampp start
```

**Icons not showing**
```html
<!-- Add to index.html if missing -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css">
```

**401 Unauthorized errors**
```javascript
// Clear token and login again
localStorage.removeItem('token');
// Then navigate to /login
```

**Modal appears at top of page**
```
✅ Already fixed in v2.0.0
Update from GitHub: git pull origin master
```

**→ Full troubleshooting guide in [MASTER_DOCUMENTATION.md](./MASTER_DOCUMENTATION.md)**

## 📝 Version History

### v2.0.0 (Current - October 13, 2025)
**Major UI/UX Overhaul & Documentation Consolidation**
- ✅ Mobile optimization with icon-only buttons (44x44px)
- ✅ Modal viewport positioning fix
- ✅ Enhanced filter labels with gradient badges
- ✅ Bootstrap Icons integration
- ✅ Elegant action buttons with gradients
- ✅ CSS isolation system
- ✅ Console logging system
- ✅ Consolidated all docs into MASTER_DOCUMENTATION.md
- ✅ Removed 16 duplicate/outdated documentation files

### v1.5.0 (October 10, 2025)
**Database Integration**
- ✅ Complete migration from hardcoded data to MySQL
- ✅ Real-time data fetching from auth_db
- ✅ Enhanced error handling

### v1.0.0 (October 1, 2025)
**Initial Release**
- ✅ Basic authentication system
- ✅ User management CRUD
- ✅ Installation tracking
- ✅ Responsive design

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'feat: Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

### Code Style Guidelines
- Use functional React components with hooks
- Follow mobile-first CSS approach
- Use Bootstrap Icons for new icons
- Write clear commit messages
- Test on mobile and desktop

## 👤 Author

**PutuTobing**  
- GitHub: [@PutuTobing](https://github.com/PutuTobing)
- Repository: [PSB](https://github.com/PutuTobing/PSB)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React team for amazing framework
- Vite for blazing fast build tool
- Bootstrap team for icon library
- MySQL team for reliable database
- Open source community

## 📞 Support

### Need Help?
1. 📚 Read [MASTER_DOCUMENTATION.md](./MASTER_DOCUMENTATION.md) for complete guide
2. 🐛 Check [Troubleshooting section](#-troubleshooting) above
3. 💬 Open an issue on GitHub for bugs or questions
4. 📧 Contact maintainer for other inquiries

### Reporting Bugs
Please include:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Environment (OS, Node.js version, MySQL version)

---

**📚 For complete documentation, API reference, and development patterns:**  
**→ Read [MASTER_DOCUMENTATION.md](./MASTER_DOCUMENTATION.md)**

**⭐ If this project helps you, please give it a star on GitHub!**

**Happy Coding! 🚀**
