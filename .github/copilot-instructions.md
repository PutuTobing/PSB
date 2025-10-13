# BTD Database-Login System - AI Coding Agent Instructions

## 🎯 Project Overview
Full-stack internet installation management system with customer, agent, and installation tracking.
- **Backend**: Node.js/Express API (`/backend/server.js`) + JWT auth + MySQL
- **Frontend**: React 19 + Vite (`/frontend/src/`) + React Router + custom CSS
- **Database**: MySQL 8.0 (`auth_db`) via Docker with phpMyAdmin on port 8081
- **Domain**: Internet installation workflow ("pemasangan") with role-based access control

## 📚 Essential Documentation
Read these files first before making changes:
- **AI_DOCUMENTATION.md**: Complete project overview and architecture
- **BACKEND_API_REFERENCE.md**: All API endpoints with examples
- **FRONTEND_ARCHITECTURE.md**: Component patterns and mobile optimization
- **DATABASE_GUIDE.md**: Schema structure and phpMyAdmin usage
- **DEPLOYMENT_GUIDE.md**: Development setup and production deployment

## 🚀 Critical Development Workflow
```bash
# 1. Database (MUST start first)
docker compose up -d
# Verify: http://localhost:8081 (phpMyAdmin)

# 2. Backend (binds to 0.0.0.0:3000 for network access)
cd backend && npm install && npm run dev
# Runs on: http://localhost:3000 and http://172.16.31.11:3000

# 3. Frontend (Vite dev server)
cd frontend && npm install && npm run dev
# Runs on: http://localhost:5173
```

## 🗄️ Database Schema Critical Points
- **Core Tables**: `users` (auth + roles), `pemasangan` (installations), `agents`, `villages`, `activity_logs`
- **Schema Files**: `/database/manajemen-akun-setup.sql` uses conditional column checks - run it for updates
- **Role System**: `users.role` ENUM('User', 'Administrator') controls access to admin features
- **Installation States**: `pemasangan.status` ENUM('menunggu', 'terpasang') - drives entire workflow
- **Commission Field**: `komisi_dibayar` TINYINT(1) tracks agent payment status
- **Default Admin**: `admin@btd.com` / password hash for initial login

## 🔧 Backend API Patterns
### Authentication
- **JWT Format**: `Authorization: Bearer <token>` in all protected endpoints
- **Middleware**: `verifyToken` extracts user from token → `req.user = decoded`
- **Admin Routes**: First verify token, THEN check `results[0].role !== 'Administrator'`
- **Password**: bcryptjs with 10 salt rounds - always hash before storing

### Database Interaction
- **Connection**: Hardcoded credentials `btd/Balionelove_121/auth_db` (NOT environment-based)
- **Query Safety**: ALWAYS use parameterized queries: `db.query(sql, [params])`
- **Error Format**: Return `{ message: "error text" }` consistently
- **Network Binding**: Server binds to `0.0.0.0:3000` for LAN access (`172.16.31.11:3000`)

### Key Endpoints
- `POST /api/login` - Returns token + user object
- `GET /api/pemasangan` - Lists installations (with filters)
- `POST /api/pemasangan` - Creates new installation
- `PUT /api/pemasangan/:id/konfirmasi` - Updates status to 'terpasang' with technician details
- `GET /api/users` - Admin only, lists all users
- See `BACKEND_API_REFERENCE.md` for complete list

## 💻 Frontend Architecture Patterns
### Routing & Auth
- **Auth State**: `isLoggedIn` in `App.jsx` controls all route access
- **Protection**: Use `<Navigate to="/login" />` to redirect unauthenticated users
- **Storage**: Token + user data in localStorage (`token`, `user`)
- **Logout**: Clear localStorage items and reset auth state

### Component Structure
- **Layout**: `<Layout>` wrapper with `<Sidebar>` + `<Header>` for authenticated pages
- **Error Handling**: `<ErrorBoundary>` wraps `<DaftarPemasangan>` (largest component)
- **File Pattern**: Component.jsx + Component.css in same directory
- **Naming**: PascalCase for components, kebab-case for CSS classes

### API Communication
- **URL Selection**: `getApiUrl()` returns localhost OR `172.16.31.11:3000` based on hostname
- **Token Validation**: `getValidToken()` checks token exists and is properly formatted
- **Error Handling**: Check for 401 responses to trigger re-authentication

### Logging System
- **Custom Logger**: `log.info()`, `log.error()`, `log.api()` with environment controls
- **Dev Only**: Logs disabled in production via `import.meta.env.DEV`
- **Environment Vars**: `VITE_ENABLE_DEBUG_LOGS` and `VITE_ENABLE_API_LOGS`

## 🏢 Business Domain Logic
### Pemasangan (Installation) Workflow
1. **Registration**: Create pemasangan with status='menunggu' + customer details
2. **Confirmation**: Admin/staff fills technician, date, time → status='terpasang'
3. **Commission**: Toggle `komisi_dibayar` when agent is paid

### Master Data
- **Agents**: Sales representatives with contact info (name, phone, email, address)
- **Villages**: Hierarchical geography (desa → kecamatan → kabupaten)
- **Users**: Authentication + role-based permissions (User vs Administrator)

### Role-Based Features
- **Administrator**: Can manage users, view activity logs, manage agents/villages
- **User**: Can only view and manage pemasangan data

## 🔑 Development Conventions
### Code Style
- **Components**: PascalCase.jsx (e.g., `DaftarPemasangan.jsx`)
- **CSS Files**: Match component name (e.g., `DaftarPemasangan.css`)
- **State**: Pure React hooks - no Redux/MobX
- **Language**: Indonesian for UI text, English for code/comments

### Security Practices
- **SQL Injection**: NEVER use string concatenation - always parameterized queries
- **XSS Prevention**: React auto-escapes, but validate user input
- **Token Expiry**: JWT expires in 1 hour by default
- **Password**: Minimum 6 characters, bcrypt hashed

### Date Handling
- **Backend**: Expects `YYYY-MM-DD` format
- **Frontend**: HTML5 `<input type="date">` automatically formats
- **Display**: Use `new Date().toLocaleDateString()` for Indonesian format

## 🔗 Critical Integration Points
### Docker Setup
- **Must Start First**: MySQL container required before backend
- **Ports**: MySQL (3306), phpMyAdmin (8081)
- **Credentials**: root/rootpassword OR auth_user/auth_password

### Network Access
- **Localhost**: `http://localhost:3000` for local development
- **Network**: `http://172.16.31.11:3000` for accessing from other devices
- **Frontend**: Vite dev server on port 5173 with CORS enabled

### Schema Initialization
- **First Time**: Run `/database/database-setup.sql` to create base structure
- **Updates**: Run `/database/manajemen-akun-setup.sql` to add users, agents, villages
- **Default User**: admin@btd.com with bcrypt hashed password

## 🐛 Common Debugging Steps
1. **401 Errors**: Check token in localStorage, verify JWT_SECRET matches
2. **Database Connection**: Ensure Docker MySQL is running (`docker compose ps`)
3. **CORS Issues**: Verify backend CORS config includes frontend dev server URL
4. **Network Access**: Check `0.0.0.0` binding in server.js if can't access from LAN

## ⚠️ KNOWN ISSUES & TECHNICAL DEBT
**Critical - Must Address:**
- **DaftarPemasangan.css**: 6,239 lines (BLOATED!) - needs splitting into modules
- **DaftarPemasangan.jsx**: 1,964 lines with 30+ useState hooks - needs refactoring into smaller components
- **Infinite animations**: Sidebar floating button animation runs continuously (battery drain)
- **CSS transform overuse**: Universal selector with GPU acceleration causes memory overhead

**Read `PERFORMANCE_ANALYSIS.md` for detailed analysis and refactoring plan.**

## 🎯 Code Quality Guidelines
**When editing DaftarPemasangan:**
- DO NOT add more state variables - use custom hooks instead
- DO NOT add more CSS - split into separate files first
- AVOID universal selectors (`*`) with transforms or animations
- PREFER component composition over monolithic components

**When working with animations:**
- Use `prefers-reduced-motion` media query for accessibility
- Avoid `animation: infinite` unless absolutely necessary
- Use `will-change` sparingly and remove after animation completes

## 📦 Testing & Validation
- **phpMyAdmin**: http://localhost:8081 to manually verify database changes
- **API Test**: `GET http://localhost:3000/` returns server info (no auth needed)
- **Browser DevTools**: Check Network tab for API calls and Console for log output
- **Performance**: Use React DevTools Profiler to check re-render counts

---
**For detailed examples and code samples, always refer to the comprehensive docs listed at the top.**