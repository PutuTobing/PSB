# Database Login Application - Project Overview

## 📋 Project Summary
**Database Login Application** adalah sistem manajemen pelanggan untuk layanan internet dengan fitur lengkap untuk mengelola pemasangan, pengguna, dan data master.

### 🎯 Core Features
- **Authentication System**: Login/logout dengan JWT tokens
- **User Management**: CRUD operations untuk pengguna dan roles
- **Installation Management**: Daftar pemasangan dengan status tracking
- **Master Data**: Management untuk Agent dan Village/Desa
- **Responsive Design**: Mobile-first design dengan breakpoints optimal

## 🏗️ Architecture Overview

### Frontend (React 19.2.0 + Vite)
```
frontend/src/
├── pages/
│   ├── DaftarPemasangan.jsx    # Main installation management
│   ├── DaftarPemasangan.css    # Responsive styling
│   ├── ManajemenAkun.jsx       # User & master data management  
│   ├── ManajemenAkun.css       # Elegant action buttons styling
│   └── Login.jsx               # Authentication
├── components/                 # Reusable components
└── main.jsx                   # App entry point
```

### Backend (Node.js + Express)
```
backend/
├── server.js                  # Main server with all API endpoints
├── package.json              # Dependencies
└── node_modules/              # Dependencies
```

### Database (MySQL)
```sql
Database: auth_db
Tables:
- users         # User accounts and profiles
- pemasangan    # Installation records
- villages      # Village/Desa master data
- agents        # Agent master data
```

## 🔧 Tech Stack

### Frontend Dependencies
- **React**: 19.2.0 (Latest with new features)
- **Vite**: 7.1.9 (Development server)
- **Bootstrap Icons**: 1.11.3 (UI icons)
- **Font Awesome**: 6.4.0 (Legacy icons)

### Backend Dependencies
- **Express**: 4.x (Web framework)
- **MySQL2**: Latest (Database driver)
- **CORS**: Enabled for frontend communication
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT authentication

### Styling Framework
- **Custom CSS**: Responsive design system
- **CSS Grid & Flexbox**: Layout management
- **CSS Custom Properties**: Theme variables

## 🚀 Development Servers

### Frontend Server
```bash
cd frontend
npm run dev
# Runs on: http://localhost:5173 or http://localhost:5174
```

### Backend Server
```bash
cd backend
npm start
# Runs on: http://localhost:3000
```

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('User', 'Administrator') DEFAULT 'User',
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Pemasangan Table
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
    FOREIGN KEY (desa_id) REFERENCES villages(id),
    FOREIGN KEY (agent_id) REFERENCES agents(id)
);
```

### Villages Table
```sql
CREATE TABLE villages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    kecamatan VARCHAR(255),
    kabupaten VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Agents Table
```sql
CREATE TABLE agents (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🎨 UI/UX Design System

### Color Scheme
```css
:root {
    /* Primary Colors */
    --primary-blue: #3b82f6;
    --primary-orange: #f59e0b;
    --primary-red: #ef4444;
    
    /* Gradients */
    --gradient-blue: linear-gradient(135deg, #3b82f6, #1d4ed8);
    --gradient-orange: linear-gradient(135deg, #f59e0b, #d97706);
    --gradient-red: linear-gradient(135deg, #ef4444, #dc2626);
    
    /* Neutral Colors */
    --gray-50: #f8fafc;
    --gray-100: #f1f5f9;
    --gray-900: #0f172a;
}
```

### Responsive Breakpoints
```css
/* Mobile First Approach */
@media screen and (min-width: 768px)  { /* Tablet */ }
@media screen and (min-width: 992px)  { /* Laptop */ }
@media screen and (min-width: 1200px) { /* Desktop */ }
@media screen and (min-width: 1400px) { /* Large Desktop */ }
```

### Action Button System
```css
.action-btn {
    /* Base styling with elegant gradients */
    min-width: 36px;
    border-radius: 8px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.action-btn.edit     { background: var(--gradient-blue); }
.action-btn.reset-password { background: var(--gradient-orange); }
.action-btn.delete   { background: var(--gradient-red); }
```

## 🔐 Authentication System

### JWT Token Flow
1. **Login**: POST `/api/auth/login` → Returns JWT token
2. **Protected Routes**: Header `Authorization: Bearer <token>`
3. **Token Validation**: Middleware checks token validity
4. **User Context**: Current user data from token payload

### API Endpoints
```javascript
// Authentication
POST   /api/auth/login
GET    /api/auth/profile

// Users Management  
GET    /api/users
POST   /api/users
PUT    /api/users/:id
DELETE /api/users/:id
POST   /api/users/:id/reset-password

// Master Data
GET    /api/agents
POST   /api/agents
PUT    /api/agents/:id
DELETE /api/agents/:id

GET    /api/villages
POST   /api/villages
PUT    /api/villages/:id
DELETE /api/villages/:id

// Pemasangan
GET    /api/pemasangan
POST   /api/pemasangan
PUT    /api/pemasangan/:id
DELETE /api/pemasangan/:id
```

## 📱 Component Architecture

### Page Components
- **DaftarPemasangan**: Main table with customer installations
- **ManajemenAkun**: User management and master data
- **Login**: Authentication form

### Key Features per Component

#### DaftarPemasangan.jsx
- Database-driven data fetching
- Responsive table with mobile cards
- Real-time search and filtering
- Modal forms for CRUD operations
- Status management (Pending/Confirmed/Installed)

#### ManajemenAkun.jsx
- Multi-tab interface (Profile, Users, Master Data, Logs)
- Role-based access control
- Elegant action buttons with hover effects
- Bootstrap Icons integration
- Comprehensive form validation

## 🎯 Recent Major Updates

### v2.0.0 - Elegant UI Overhaul (Latest)
- ✅ Enhanced action buttons with gradients and animations
- ✅ Bootstrap Icons integration for consistency
- ✅ Premium visual effects (shimmer, glass overlay)
- ✅ Cross-browser compatibility improvements
- ✅ Responsive design optimization

### v1.5.0 - Database Integration
- ✅ Complete migration from hardcoded data
- ✅ Real-time data fetching from auth_db
- ✅ Enhanced error handling and loading states
- ✅ Authentication improvements

## 🔧 Development Guidelines

### Code Style
- **React**: Functional components with hooks
- **CSS**: BEM methodology for class naming
- **JavaScript**: ES6+ features, async/await
- **Error Handling**: Try-catch blocks with user feedback

### File Naming Convention
- **Components**: PascalCase (e.g., `ManajemenAkun.jsx`)
- **Stylesheets**: kebab-case (e.g., `manajemen-akun.css`)
- **Variables**: camelCase (e.g., `currentUser`)
- **CSS Classes**: kebab-case (e.g., `action-btn`)

### Git Workflow
- **Branch**: `master` (main development)
- **Commits**: Conventional commits with emojis
- **Remote**: Multiple remotes (origin, psb)

## 🐛 Common Issues & Solutions

### Icon Display Issues
**Problem**: Icons showing as white boxes
**Solution**: Bootstrap Icons with multiple CDN fallbacks
```css
@import url('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css');
@import url('https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.11.3/font/bootstrap-icons.min.css');
```

### Authentication Errors
**Problem**: 401 Unauthorized responses
**Solution**: Check JWT token validity and API endpoint consistency
```javascript
const token = localStorage.getItem('token');
if (!token) {
    // Redirect to login
    window.location.href = '/login';
}
```

### Responsive Design Issues
**Problem**: Layout breaking on different screen sizes
**Solution**: Mobile-first approach with proper breakpoints
```css
/* Mobile first, then enhance for larger screens */
.component { /* mobile styles */ }
@media (min-width: 768px) { /* tablet styles */ }
@media (min-width: 1200px) { /* desktop styles */ }
```

## 📦 Deployment

### Development
```bash
# Start backend
cd backend && npm start

# Start frontend  
cd frontend && npm run dev
```

### Production Build
```bash
cd frontend && npm run build
# Generates dist/ folder for deployment
```

## 🎯 Future Roadmap
- [ ] Real-time notifications
- [ ] Advanced reporting dashboard
- [ ] Mobile app development
- [ ] API documentation with Swagger
- [ ] Unit testing implementation
- [ ] Performance optimization

---

**Last Updated**: October 10, 2025
**Version**: 2.0.0
**Maintainer**: Development Team