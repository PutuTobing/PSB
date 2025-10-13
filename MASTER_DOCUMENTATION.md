# 🚀 BTD Database Login - Master Documentation
**Complete Guide for AI Assistants & Developers**

> **Version**: 2.0.0 | **Last Updated**: October 13, 2025  
> **Repository**: https://github.com/PutuTobing/PSB.git

---

## 📋 Table of Contents
1. [Project Overview](#-project-overview)
2. [Quick Start](#-quick-start)
3. [Architecture](#-architecture)
4. [Development Guide](#-development-guide)
5. [API Reference](#-api-reference)
6. [Database Schema](#-database-schema)
7. [Frontend Components](#-frontend-components)
8. [Styling System](#-styling-system)
9. [Troubleshooting](#-troubleshooting)
10. [Best Practices](#-best-practices)

---

## 🎯 Project Overview

### What is BTD Database Login?
Sistem manajemen pelanggan untuk layanan internet dengan fitur lengkap:
- **User Management**: CRUD pengguna dengan role-based access (Admin/User)
- **Installation Management**: Tracking pemasangan pelanggan dengan status
- **Master Data**: Management agent dan desa/village
- **Authentication**: JWT-based secure authentication system
- **Responsive Design**: Mobile-first dengan elegant UI/UX

### Tech Stack
```javascript
Frontend:
- React 19.2.0          // Latest React with new hooks
- Vite 7.1.9            // Fast build tool
- Bootstrap Icons 1.11.3 // Modern icon library
- Custom CSS            // Component-scoped styling

Backend:
- Node.js + Express     // REST API server
- MySQL2                // Database driver with promises
- bcryptjs              // Password hashing
- jsonwebtoken          // JWT authentication
- cors                  // Cross-origin support

Database:
- MySQL 8.0+            // Relational database
- auth_db               // Main database name
```

### Core Features
✅ **Authentication**: JWT token-based secure login/logout  
✅ **User Management**: Create, read, update, delete users  
✅ **Role System**: Administrator and User roles  
✅ **Installation Tracking**: Full CRUD for customer installations  
✅ **Master Data**: Agents and Villages management  
✅ **Responsive**: Mobile-first design (768px, 480px breakpoints)  
✅ **Elegant UI**: Gradient buttons, animations, smooth transitions  

---

## ⚡ Quick Start

### Prerequisites
```bash
# Required software
- Node.js >= 18.0.0
- MySQL >= 8.0
- Git
- npm atau yarn

# Optional (recommended)
- VS Code
- Docker Desktop
```

### Installation Steps
```bash
# 1. Clone repository
git clone https://github.com/PutuTobing/PSB.git
cd Database-Login

# 2. Install backend dependencies
cd backend
npm install

# 3. Setup environment variables
cat > .env << EOF
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=auth_db
JWT_SECRET=your-secret-key-here
EOF

# 4. Import database schema
mysql -u root -p < ../database/customers-schema.sql

# 5. Start backend server
npm start
# ✅ Backend running on http://localhost:3000

# 6. Install frontend dependencies (new terminal)
cd ../frontend
npm install

# 7. Start frontend dev server
npm run dev
# ✅ Frontend running on http://localhost:5173
```

### Quick Test
```bash
# Test backend API
curl http://localhost:3000/api/health
# Expected: {"status":"ok","timestamp":"..."}

# Test frontend
open http://localhost:5173
# Expected: Login page displayed
```

---

## 🏗️ Architecture

### Project Structure
```
Database-Login/
├── backend/
│   ├── server.js                 # 🟢 Main Express API server
│   ├── package.json              # Backend dependencies
│   └── server.log                # Application logs
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── DaftarPemasangan.jsx    # 📋 Installation management
│   │   │   ├── DaftarPemasangan.css    # 🎨 Responsive table styling
│   │   │   ├── ManajemenAkun.jsx       # 👥 User & master data
│   │   │   ├── ManajemenAkun.css       # 🎨 Elegant action buttons
│   │   │   ├── Login.jsx              # 🔐 Authentication
│   │   │   └── Dashboard.jsx          # 🏠 Main dashboard
│   │   ├── components/
│   │   │   ├── Header.jsx             # 📱 Top navigation
│   │   │   ├── Sidebar.jsx            # 🧭 Side menu
│   │   │   ├── Layout.jsx             # 📐 Page wrapper
│   │   │   └── ErrorBoundary.jsx      # 🛡️ Error handling
│   │   ├── App.jsx                    # ⚛️ React router setup
│   │   ├── main.jsx                   # 🚀 React entry point
│   │   └── global.css                 # 🌍 Global styles
│   ├── vite.config.js               # ⚙️ Vite configuration
│   └── package.json                 # Frontend dependencies
├── database/
│   ├── customers-schema.sql         # 📊 Database schema
│   ├── manajemen-akun-setup.sql    # 👤 User management
│   └── pemasangan-schema.sql       # 📦 Installation data
├── docker-compose.yml               # 🐳 MySQL container
├── MASTER_DOCUMENTATION.md          # 📚 This file (YOU ARE HERE)
└── README.md                        # 📖 Project introduction
```

### Data Flow
```
┌──────────────┐      HTTP/HTTPS      ┌──────────────┐
│              │ ──────────────────> │              │
│   Frontend   │                     │   Backend    │
│  React+Vite  │ <────────────────── │   Express    │
│  :5173       │      JSON + JWT     │   :3000      │
└──────────────┘                     └──────────────┘
                                            │
                                            │ SQL Queries
                                            ▼
                                     ┌──────────────┐
                                     │              │
                                     │    MySQL     │
                                     │   auth_db    │
                                     │   :3306      │
                                     └──────────────┘
```

### Authentication Flow
```
1. User Login (POST /api/auth/login)
   ├─> Backend validates credentials
   ├─> Generate JWT token
   └─> Return token + user info

2. Store Token (Frontend)
   └─> localStorage.setItem('token', token)

3. Protected API Calls
   ├─> Add header: Authorization: Bearer <token>
   ├─> Backend validates token (JWT middleware)
   └─> Return data or 401 Unauthorized

4. User Logout
   └─> localStorage.removeItem('token')
```

---

## 💻 Development Guide

### Development Workflow

#### Starting Development
```bash
# Terminal 1 - Backend
cd backend
npm run dev  # Uses nodemon for hot-reload
# ✅ Backend: http://localhost:3000

# Terminal 2 - Frontend  
cd frontend
npm run dev
# ✅ Frontend: http://localhost:5173

# Terminal 3 - Database (if using Docker)
docker compose up -d
# ✅ MySQL: localhost:3306
# ✅ phpMyAdmin: http://localhost:8081
```

#### Code Patterns

**1. React Component Pattern**
```javascript
// Standard functional component with hooks
const ComponentName = () => {
    // State management
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Data fetching on mount
    useEffect(() => {
        fetchData();
    }, []);

    // API call with error handling
    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const token = localStorage.getItem('token');
            const response = await fetch('/api/endpoint', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const result = await response.json();
            setData(result);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Render with loading/error states
    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="component-wrapper">
            {/* Component content */}
        </div>
    );
};

export default ComponentName;
```

**2. API Integration Pattern**
```javascript
// Reusable API utility function
const apiCall = async (endpoint, method = 'GET', data = null) => {
    const token = localStorage.getItem('token');
    
    const config = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    };

    if (data && method !== 'GET') {
        config.body = JSON.stringify(data);
    }

    const response = await fetch(`/api${endpoint}`, config);
    
    if (!response.ok) {
        if (response.status === 401) {
            // Redirect to login on auth failure
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
};

// Usage examples
await apiCall('/users', 'GET');                    // Get all users
await apiCall('/users', 'POST', {name, email});   // Create user
await apiCall('/users/123', 'PUT', {name});       // Update user
await apiCall('/users/123', 'DELETE');            // Delete user
```

**3. CSS Responsive Pattern**
```css
/* Mobile-first approach */
.component {
    /* Mobile styles (default) */
    padding: 8px;
    font-size: 14px;
}

/* Tablet */
@media (min-width: 768px) {
    .component {
        padding: 16px;
        font-size: 16px;
    }
}

/* Desktop */
@media (min-width: 1200px) {
    .component {
        padding: 24px;
        font-size: 18px;
    }
}
```

### CSS Isolation System

**Problem**: CSS changes in one page affecting others  
**Solution**: Page-specific class scoping

```javascript
// Layout.jsx - Each page has unique className
<div className={`main-content ${pageClassName}`}>
    {children}
</div>

// App.jsx - Route with pageClassName
<Route path="/daftar-pemasangan" element={
    <Layout pageClassName="page-daftar-pemasangan">
        <DaftarPemasangan />
    </Layout>
} />

// DaftarPemasangan.css - Scoped styles
.page-daftar-pemasangan .table-container {
    /* Only affects DaftarPemasangan page */
    padding: 0;
}
```

### Console Logging System

**Problem**: Console spam with repetitive debug logs  
**Solution**: Environment-based categorized logging

```javascript
// Development only logs
const isDev = process.env.NODE_ENV === 'development';

const log = {
    info: (...args) => isDev && console.log('ℹ️', ...args),
    success: (...args) => isDev && console.log('✅', ...args),
    warn: (...args) => console.warn('⚠️', ...args),      // Always shown
    error: (...args) => console.error('❌', ...args),    // Always shown
    api: (...args) => isDev && console.log('🌐', ...args)
};

// Usage
log.info('Component mounted');          // Development only
log.success('Data loaded');             // Development only
log.warn('Deprecated function');        // Always
log.error('Failed to fetch');           // Always
log.api('GET /api/users - 200 OK');     // Development only
```

---

## 🌐 API Reference

### Base URL
```
Development: http://localhost:3000/api
Production:  https://your-domain.com/api
```

### Authentication Endpoints

#### POST /api/auth/login
**Purpose**: Authenticate user and get JWT token

**Request Body**:
```json
{
    "email": "admin@btd.com",
    "password": "password123"
}
```

**Response (200 OK)**:
```json
{
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
        "id": 1,
        "name": "Admin User",
        "email": "admin@btd.com",
        "role": "Administrator"
    }
}
```

**Error Responses**:
```json
// 401 - Invalid credentials
{
    "success": false,
    "message": "Invalid email or password"
}

// 400 - Missing fields
{
    "success": false,
    "message": "Email and password are required"
}
```

#### POST /api/auth/register
**Purpose**: Register new user account

**Request Body**:
```json
{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123",
    "phone": "081234567890",
    "address": "Jakarta, Indonesia"
}
```

**Response (201 Created)**:
```json
{
    "success": true,
    "message": "User registered successfully",
    "userId": 5
}
```

#### GET /api/auth/profile
**Purpose**: Get current user profile (requires authentication)

**Headers**:
```
Authorization: Bearer <jwt_token>
```

**Response (200 OK)**:
```json
{
    "success": true,
    "user": {
        "id": 1,
        "name": "Admin User",
        "email": "admin@btd.com",
        "role": "Administrator",
        "phone": "081234567890",
        "address": "Jakarta"
    }
}
```

### User Management Endpoints

#### GET /api/users
**Purpose**: Get all users (Admin only)

**Headers**:
```
Authorization: Bearer <jwt_token>
```

**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search by name or email
- `role` (optional): Filter by role (Administrator/User)

**Response (200 OK)**:
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "name": "Admin User",
            "email": "admin@btd.com",
            "role": "Administrator",
            "created_at": "2025-10-01T10:00:00.000Z"
        }
    ],
    "pagination": {
        "total": 25,
        "page": 1,
        "pages": 3,
        "limit": 10
    }
}
```

#### POST /api/users
**Purpose**: Create new user (Admin only)

**Request Body**:
```json
{
    "name": "New User",
    "email": "newuser@example.com",
    "password": "password123",
    "role": "User",
    "phone": "081234567890",
    "address": "Surabaya, Indonesia"
}
```

#### PUT /api/users/:id
**Purpose**: Update user information (Admin only)

**Request Body**:
```json
{
    "name": "Updated Name",
    "phone": "081987654321",
    "address": "New Address"
}
```

#### DELETE /api/users/:id
**Purpose**: Delete user (Admin only)

**Response (200 OK)**:
```json
{
    "success": true,
    "message": "User deleted successfully"
}
```

#### POST /api/users/:id/reset-password
**Purpose**: Reset user password (Admin only)

**Request Body**:
```json
{
    "newPassword": "newSecurePassword123"
}
```

### Agent Management Endpoints

#### GET /api/agents
**Purpose**: Get all agents

**Response (200 OK)**:
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "name": "Agent Surabaya",
            "phone": "081234567890",
            "email": "agent@example.com",
            "address": "Surabaya"
        }
    ]
}
```

#### POST /api/agents
**Purpose**: Create new agent

**Request Body**:
```json
{
    "name": "Agent Name",
    "phone": "081234567890",
    "email": "agent@example.com",
    "address": "Agent Address"
}
```

#### PUT /api/agents/:id
**Purpose**: Update agent information

#### DELETE /api/agents/:id
**Purpose**: Delete agent

### Village Management Endpoints

#### GET /api/villages
**Purpose**: Get all villages/desa

**Response (200 OK)**:
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "name": "Desa Sukamaju",
            "kecamatan": "Kecamatan Utara",
            "kabupaten": "Kabupaten Selatan"
        }
    ]
}
```

#### POST /api/villages
**Purpose**: Create new village

**Request Body**:
```json
{
    "name": "Desa Baru",
    "kecamatan": "Kecamatan",
    "kabupaten": "Kabupaten"
}
```

### Installation Management Endpoints

#### GET /api/pemasangan
**Purpose**: Get installation records

**Query Parameters**:
- `status`: Filter by status (Pending/Confirmed/Installed)
- `desa_id`: Filter by village
- `agent_id`: Filter by agent
- `month`: Filter by month (1-12)
- `year`: Filter by year (YYYY)

**Response (200 OK)**:
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "nama_pelanggan": "Customer Name",
            "alamat": "Customer Address",
            "desa": "Desa Sukamaju",
            "agent": "Agent Surabaya",
            "paket": "Paket Premium",
            "harga": 500000,
            "komisi": 50000,
            "status": "Confirmed",
            "tanggal_pemasangan": "2025-10-15"
        }
    ]
}
```

#### POST /api/pemasangan
**Purpose**: Create new installation record

**Request Body**:
```json
{
    "nama_pelanggan": "Customer Name",
    "alamat": "Customer Address",
    "desa_id": 1,
    "agent_id": 1,
    "paket": "Paket Premium",
    "harga": 500000,
    "komisi": 50000,
    "status": "Pending",
    "tanggal_pemasangan": "2025-10-20"
}
```

#### PUT /api/pemasangan/:id
**Purpose**: Update installation record

#### DELETE /api/pemasangan/:id
**Purpose**: Delete installation record

---

## 🗄️ Database Schema

### Database: auth_db

#### Table: users
```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('Administrator', 'User') DEFAULT 'User',
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
);
```

#### Table: pemasangan (Installations)
```sql
CREATE TABLE pemasangan (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nama_pelanggan VARCHAR(255) NOT NULL,
    alamat TEXT,
    desa_id INT,
    agent_id INT,
    paket VARCHAR(100),
    harga DECIMAL(10,2),
    komisi DECIMAL(10,2),
    status ENUM('Pending', 'Confirmed', 'Installed') DEFAULT 'Pending',
    tanggal_pemasangan DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (desa_id) REFERENCES villages(id) ON DELETE SET NULL,
    FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE SET NULL,
    INDEX idx_status (status),
    INDEX idx_tanggal (tanggal_pemasangan)
);
```

#### Table: villages (Desa)
```sql
CREATE TABLE villages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    kecamatan VARCHAR(255),
    kabupaten VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_name (name)
);
```

#### Table: agents
```sql
CREATE TABLE agents (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_name (name)
);
```

### Database Relationships
```
users (1) ────────── (∞) pemasangan [created_by]
agents (1) ────────── (∞) pemasangan [agent_id]
villages (1) ────────── (∞) pemasangan [desa_id]
```

---

## ⚛️ Frontend Components

### Page Components

#### 1. DaftarPemasangan.jsx
**Purpose**: Installation management with full CRUD

**Features**:
- ✅ Responsive table (desktop) / cards (mobile)
- ✅ Search and filter (month, year, desa, status)
- ✅ Status buttons (Semua, Pending, Confirmed, Installed)
- ✅ Modal forms (Add, Edit, Delete confirmation)
- ✅ Export functionality
- ✅ Stats cards (Total, Pending, Confirmed, Installed)

**State Management**:
```javascript
const [pemasangan, setPemasangan] = useState([]);
const [filteredData, setFilteredData] = useState([]);
const [searchTerm, setSearchTerm] = useState('');
const [filterMonth, setFilterMonth] = useState('');
const [filterYear, setFilterYear] = useState('');
const [filterDesa, setFilterDesa] = useState('');
const [statusFilter, setStatusFilter] = useState('Semua');
```

**Key Functions**:
- `fetchPemasangan()`: Load data from API
- `handleSearch()`: Filter by customer name
- `handleFilterChange()`: Month/year/desa filtering
- `handleStatusFilter()`: Status-based filtering
- `handleAdd()`, `handleEdit()`, `handleDelete()`: CRUD operations

#### 2. ManajemenAkun.jsx
**Purpose**: User and master data management

**Features**:
- ✅ Tabbed interface (Profile, Users, Master Data, Logs)
- ✅ User CRUD with role management
- ✅ Agent management
- ✅ Village management
- ✅ Elegant action buttons (Edit, Reset Password, Delete)
- ✅ Bootstrap Icons integration
- ✅ Search and pagination

**Tabs**:
1. **Profile**: View/edit current user
2. **Users**: User management (Admin only)
3. **Master Data**: Agents and Villages management
4. **Activity Logs**: User activity tracking

#### 3. Login.jsx
**Purpose**: User authentication

**Features**:
- ✅ Email and password validation
- ✅ Remember me functionality
- ✅ Error handling with user feedback
- ✅ Redirect after successful login
- ✅ Link to registration page

#### 4. Dashboard.jsx
**Purpose**: Main dashboard after login

**Features**:
- ✅ Welcome banner with user info
- ✅ Stats cards (users, installations, agents, villages)
- ✅ Recent activity feed
- ✅ Quick action buttons
- ✅ Real-time data updates

### Reusable Components

#### Header.jsx
**Purpose**: Top navigation bar

**Features**:
- Company logo
- Real-time clock
- User dropdown (Profile, Settings, Logout)
- Mobile hamburger menu

#### Sidebar.jsx
**Purpose**: Side navigation menu

**Features**:
- Navigation links
- Active state highlighting
- Mobile toggle
- User info at bottom

#### Layout.jsx
**Purpose**: Page wrapper with header and sidebar

**Props**:
- `pageClassName`: Unique class for CSS isolation
- `children`: Page content

#### ErrorBoundary.jsx
**Purpose**: Catch and display React errors gracefully

---

## 🎨 Styling System

### Color Scheme
```css
:root {
    /* Primary Colors */
    --primary-blue: #3b82f6;
    --primary-blue-dark: #1d4ed8;
    --primary-orange: #f59e0b;
    --primary-orange-dark: #d97706;
    --primary-red: #ef4444;
    --primary-red-dark: #dc2626;
    --primary-green: #10b981;
    --primary-green-dark: #059669;
    
    /* Gradients */
    --gradient-blue: linear-gradient(135deg, #3b82f6, #1d4ed8);
    --gradient-orange: linear-gradient(135deg, #f59e0b, #d97706);
    --gradient-red: linear-gradient(135deg, #ef4444, #dc2626);
    --gradient-green: linear-gradient(135deg, #10b981, #059669);
    --gradient-purple: linear-gradient(135deg, #667eea, #764ba2);
    
    /* Neutral Colors */
    --gray-50: #f8fafc;
    --gray-100: #f1f5f9;
    --gray-200: #e2e8f0;
    --gray-300: #cbd5e1;
    --gray-400: #94a3b8;
    --gray-500: #64748b;
    --gray-600: #475569;
    --gray-700: #334155;
    --gray-800: #1e293b;
    --gray-900: #0f172a;
}
```

### Action Button System
```css
/* Elegant action buttons with gradients */
.action-btn {
    min-width: 36px;
    height: 36px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 0 12px;
    font-weight: 600;
    font-size: 13px;
    color: white;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
}

/* Button variants */
.action-btn.edit {
    background: var(--gradient-blue);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.action-btn.reset-password {
    background: var(--gradient-orange);
    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}

.action-btn.delete {
    background: var(--gradient-red);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

/* Hover effects */
.action-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

/* Active state */
.action-btn:active {
    transform: translateY(0);
}

/* Shimmer effect */
.action-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
        transparent 0%, 
        rgba(255,255,255,0.3) 50%, 
        transparent 100%);
    transition: left 0.5s;
}

.action-btn:hover::before {
    left: 100%;
}
```

### Responsive Breakpoints
```css
/* Mobile First Approach */

/* Mobile (default) */
.component {
    padding: 8px;
    font-size: 14px;
}

/* Tablet - 768px */
@media (min-width: 768px) {
    .component {
        padding: 16px;
        font-size: 16px;
    }
}

/* Laptop - 992px */
@media (min-width: 992px) {
    .component {
        padding: 20px;
        font-size: 17px;
    }
}

/* Desktop - 1200px */
@media (min-width: 1200px) {
    .component {
        padding: 24px;
        font-size: 18px;
    }
}

/* Large Desktop - 1400px */
@media (min-width: 1400px) {
    .component {
        padding: 32px;
        font-size: 20px;
    }
}
```

### Mobile Optimization

#### Mobile Table Cards
```css
/* Hide table on mobile, show cards */
@media (max-width: 768px) {
    .table-responsive table {
        display: none;
    }
    
    .mobile-cards {
        display: block;
    }
    
    .mobile-card {
        background: white;
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 16px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    .mobile-card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
    }
    
    .mobile-card-actions {
        display: flex;
        gap: 6px;
        margin-top: 12px;
    }
    
    .mobile-actions-row-1,
    .mobile-actions-row-2 {
        display: flex;
        gap: 6px;
    }
    
    /* Icon-only buttons - 44x44px */
    .mobile-actions-row-1 .btn,
    .mobile-actions-row-2 .btn {
        width: 44px;
        height: 44px;
        padding: 0;
        border-radius: 10px;
        font-size: 18px;
    }
    
    /* Hide text labels on mobile */
    .mobile-actions-row-1 .btn span:not(.btn-icon),
    .mobile-actions-row-2 .btn span:not(.btn-icon) {
        display: none !important;
    }
}
```

### Icon System (Bootstrap Icons)
```javascript
// Icon mapping for consistent usage
const ICONS = {
    // Actions
    edit: 'bi-pencil-square',
    delete: 'bi-trash3',
    save: 'bi-check-circle',
    cancel: 'bi-x-circle',
    add: 'bi-plus-circle',
    
    // Status
    success: 'bi-check-circle-fill',
    error: 'bi-x-circle-fill',
    warning: 'bi-exclamation-triangle-fill',
    info: 'bi-info-circle-fill',
    
    // Navigation
    home: 'bi-house-door',
    dashboard: 'bi-speedometer2',
    users: 'bi-people',
    settings: 'bi-gear',
    
    // Features
    search: 'bi-search',
    filter: 'bi-funnel',
    sort: 'bi-arrow-down-up',
    export: 'bi-download',
    
    // Data
    calendar: 'bi-calendar3',
    clock: 'bi-clock',
    location: 'bi-geo-alt',
    phone: 'bi-telephone',
    email: 'bi-envelope',
    
    // Actions (specific)
    resetPassword: 'bi-key',
    whatsapp: 'bi-whatsapp',
    detail: 'bi-info-circle',
    confirm: 'bi-check-lg'
};

// Usage in JSX
<i className={`bi ${ICONS.edit}`}></i>
<i className="bi bi-pencil-square"></i>
```

---

## 🔧 Troubleshooting

### Common Issues & Solutions

#### 1. Error 401 Unauthorized
**Symptoms**:
- API requests return 401
- Console: "GET http://localhost:3000/api/users 401"

**Diagnosis**:
```javascript
// Check token in browser console
console.log('Token:', localStorage.getItem('token'));
console.log('Token exists:', !!localStorage.getItem('token'));
```

**Solutions**:
1. **Login again**: Token may have expired
2. **Check token format**: Should start with `eyJ...`
3. **Verify API endpoint**: Backend should validate token
4. **Check headers**: Authorization header must be present

```javascript
// Correct API call format
const token = localStorage.getItem('token');
const response = await fetch('/api/users', {
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
});
```

#### 2. Database Connection Error
**Symptoms**:
- Backend crashes on start
- Error: "ECONNREFUSED 127.0.0.1:3306"

**Solutions**:
```bash
# Check if MySQL is running
sudo systemctl status mysql
# or for XAMPP
sudo /opt/lampp/lampp status

# Start MySQL if stopped
sudo systemctl start mysql
# or for XAMPP
sudo /opt/lampp/lampp start mysql

# Test database connection
mysql -u root -p -e "SHOW DATABASES;"
```

#### 3. CORS Issues
**Symptoms**:
- Console: "Access to fetch blocked by CORS policy"
- API calls failing from frontend

**Solutions**:
```javascript
// backend/server.js - Add CORS middleware
const cors = require('cors');

// Allow all origins (development)
app.use(cors());

// Or specific origin (production)
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
```

#### 4. Port Already in Use
**Symptoms**:
- Error: "EADDRINUSE: address already in use :::3000"

**Solutions**:
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or kill all node processes
pkill -9 node

# Use different port
PORT=3001 npm start
```

#### 5. Icons Not Displaying
**Symptoms**:
- Icons showing as white boxes or missing

**Solutions**:
```html
<!-- Add Bootstrap Icons CDN in index.html -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css">

<!-- Or multiple CDN fallbacks -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.11.3/font/bootstrap-icons.min.css">
```

#### 6. Modal Not Appearing at Viewport
**Symptoms**:
- Modal appears at top of page
- Need to scroll up to see modal

**Solutions**:
```css
/* Fixed in DaftarPemasangan.css */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    overflow-y: auto;
}

/* Mobile fix */
@media (max-width: 768px) {
    .modal-overlay {
        align-items: flex-start;
        padding-top: max(20px, env(safe-area-inset-top));
    }
    
    .modal-content {
        margin-top: 20px;
        margin-bottom: 20px;
    }
}
```

#### 7. Mobile Buttons Too Large
**Symptoms**:
- Action buttons showing full text labels
- Buttons taking too much space

**Solutions**:
```css
/* Icon-only buttons for mobile */
@media (max-width: 768px) {
    .mobile-actions-row-1 .btn,
    .mobile-actions-row-2 .btn {
        width: 44px;
        height: 44px;
        padding: 0;
    }
    
    /* Hide text, show icons only */
    .mobile-actions-row-1 .btn span:not(.btn-icon),
    .mobile-actions-row-2 .btn span:not(.btn-icon) {
        display: none !important;
    }
    
    /* Enlarge icons */
    .mobile-actions-row-1 .btn i,
    .mobile-actions-row-2 .btn i {
        font-size: 20px;
    }
}
```

### Debugging Commands
```bash
# Check backend logs
tail -f backend/server.log

# Check if ports are open
netstat -tulnp | grep -E '3000|5173|3306'

# Test API endpoint directly
curl http://localhost:3000/api/health

# Check database tables
mysql -u root -p auth_db -e "SHOW TABLES;"

# Check user records
mysql -u root -p auth_db -e "SELECT id, name, email, role FROM users;"

# Monitor file changes (useful for development)
watch -n 1 'ls -lh backend/server.js frontend/src/'

# Check git status and recent changes
git status
git log --oneline --graph --decorate --all -10
```

---

## ✅ Best Practices

### Code Style

#### JavaScript/React
```javascript
// Use functional components with hooks
const Component = () => { };

// Destructure props
const Component = ({ data, onAction }) => { };

// Use meaningful variable names
const [userData, setUserData] = useState([]);
const [isLoading, setIsLoading] = useState(false);

// Handle errors gracefully
try {
    await fetchData();
} catch (error) {
    console.error('Error:', error);
    showErrorMessage('Failed to load data');
}

// Clean up effects
useEffect(() => {
    const subscription = subscribeToData();
    return () => subscription.unsubscribe();
}, []);
```

#### CSS
```css
/* Use BEM methodology */
.block { }
.block__element { }
.block--modifier { }

/* Mobile-first responsive */
.component { /* mobile styles */ }
@media (min-width: 768px) { /* tablet+ */ }

/* Use CSS custom properties */
:root {
    --primary-color: #3b82f6;
}
.component {
    color: var(--primary-color);
}

/* Scope styles to pages */
.page-specific .component { }
```

### Security

#### Authentication
```javascript
// Always validate tokens
const token = localStorage.getItem('token');
if (!token || isTokenExpired(token)) {
    redirectToLogin();
}

// Never store sensitive data in localStorage
// ❌ Don't:
localStorage.setItem('password', password);

// ✅ Do:
localStorage.setItem('token', jwtToken); // Token only
```

#### API Calls
```javascript
// Always use HTTPS in production
const API_URL = process.env.NODE_ENV === 'production'
    ? 'https://api.yourdomain.com'
    : 'http://localhost:3000';

// Sanitize user inputs
const sanitizedInput = DOMPurify.sanitize(userInput);

// Use prepared statements (backend)
const query = 'SELECT * FROM users WHERE email = ?';
db.query(query, [email]);
```

### Performance

#### Frontend
```javascript
// Use React.memo for expensive components
const ExpensiveComponent = React.memo(({ data }) => {
    // Component logic
});

// Debounce search inputs
const debouncedSearch = useCallback(
    debounce((term) => performSearch(term), 300),
    []
);

// Lazy load routes
const Dashboard = lazy(() => import('./pages/Dashboard'));

// Optimize images
<img 
    src={image} 
    loading="lazy"
    srcSet={`${imageSm} 480w, ${imageMd} 768w`}
/>
```

#### Backend
```javascript
// Use database indexes
CREATE INDEX idx_email ON users(email);
CREATE INDEX idx_status ON pemasangan(status);

// Paginate large datasets
const limit = 10;
const offset = (page - 1) * limit;
const query = 'SELECT * FROM users LIMIT ? OFFSET ?';

// Cache frequent queries
const cache = new Map();
if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
}
```

### Testing

#### Manual Testing Checklist
```markdown
Frontend:
- [ ] All pages load without errors
- [ ] Forms validate inputs correctly
- [ ] API calls succeed and handle errors
- [ ] Responsive on mobile (375px, 768px, 1200px)
- [ ] Icons display correctly
- [ ] Modals appear at correct position
- [ ] Logout clears authentication

Backend:
- [ ] All endpoints return expected data
- [ ] Authentication works correctly
- [ ] Database queries execute properly
- [ ] Error handling returns proper status codes
- [ ] CORS allows frontend requests

Database:
- [ ] All tables have proper indexes
- [ ] Foreign keys maintain referential integrity
- [ ] Test data exists for development
- [ ] Backup system is in place
```

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit frequently
git add .
git commit -m "feat: Add new feature"

# Keep branch updated
git checkout master
git pull
git checkout feature/new-feature
git merge master

# Push and create PR
git push origin feature/new-feature

# After merge, delete branch
git branch -d feature/new-feature
```

### Documentation
```markdown
# Always document:
- New API endpoints (request/response format)
- Component props and usage
- Complex business logic
- Environment variables
- Database schema changes
- Breaking changes

# Use clear comments:
// ✅ Good: Explains why
// Calculate commission based on installation price
// 10% for agents, 5% for coordinators
const commission = price * (role === 'agent' ? 0.1 : 0.05);

// ❌ Bad: States the obvious
// Multiply price by 0.1
const commission = price * 0.1;
```

---

## 🎓 Learning Resources

### React & Vite
- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev/guide/)
- [React Hooks](https://react.dev/reference/react)

### Node.js & Express
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [MySQL2 Documentation](https://github.com/sidorares/node-mysql2)

### CSS & Design
- [CSS Tricks](https://css-tricks.com)
- [Bootstrap Icons](https://icons.getbootstrap.com)
- [Responsive Design Patterns](https://web.dev/patterns/layout/)

---

## 📞 Support & Contact

### Getting Help
1. **Documentation**: Read this file and linked docs
2. **GitHub Issues**: Open issue with detailed description
3. **Community**: Join discussions in repository

### Reporting Bugs
```markdown
## Bug Report Template
**Description**: Brief description of the bug

**Steps to Reproduce**:
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**: What should happen

**Actual Behavior**: What actually happens

**Screenshots**: If applicable

**Environment**:
- OS: [e.g., Ubuntu 22.04]
- Browser: [e.g., Chrome 119]
- Node.js: [e.g., 18.17.0]
- MySQL: [e.g., 8.0.34]
```

---

## 📝 Changelog

### Version 2.0.0 (2025-10-13) - Current
**Major UI/UX Overhaul**
- ✅ Mobile-optimized table cards with icon-only action buttons
- ✅ Modal viewport positioning fix for mobile
- ✅ Enhanced filter labels visibility (gradient badge design)
- ✅ Bootstrap Icons integration across all components
- ✅ Elegant action buttons with gradients and animations
- ✅ CSS isolation system for page-specific styles
- ✅ Console logging system (development only)
- ✅ Responsive horizontal stats cards layout
- ✅ Icon-only mobile buttons (44x44px)
- ✅ Complete mobile optimization (768px, 480px breakpoints)

### Version 1.5.0 (2025-10-10)
**Database Integration**
- ✅ Complete migration from hardcoded data to database
- ✅ Real-time data fetching from auth_db
- ✅ Enhanced error handling and loading states
- ✅ Authentication improvements

### Version 1.0.0 (2025-10-01)
**Initial Release**
- ✅ Basic authentication system
- ✅ User management CRUD
- ✅ Installation tracking
- ✅ Agent and village management
- ✅ Responsive design foundation

---

## 🎯 Future Roadmap

### Planned Features
- [ ] Real-time notifications with WebSockets
- [ ] Advanced reporting dashboard with charts
- [ ] Export to PDF/Excel functionality
- [ ] Multi-language support (English, Indonesian)
- [ ] Dark mode theme
- [ ] Mobile app (React Native)
- [ ] Two-factor authentication (2FA)
- [ ] Audit log system
- [ ] Automated testing suite
- [ ] Performance monitoring dashboard

### Technical Improvements
- [ ] TypeScript migration
- [ ] State management with Zustand/Redux
- [ ] API rate limiting
- [ ] Database query optimization
- [ ] Docker containerization
- [ ] CI/CD pipeline
- [ ] Automated backups
- [ ] Security audit

---

**🎉 Congratulations! You now have comprehensive knowledge of the BTD Database Login Application.**

**For AI Assistants**: This documentation provides complete context for assisting with development, debugging, and feature implementation. Always refer to this file for consistent patterns and best practices.

**Last Updated**: October 13, 2025  
**Version**: 2.0.0  
**Maintainer**: PutuTobing (@github/PutuTobing)  
**License**: MIT
