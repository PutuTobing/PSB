# BTD Database-Login System - AI Coding Agent Instructions

## Architecture Overview
This is a full-stack customer management system for internet installation services with:
- **Backend**: Node.js/Express API server (`/backend/server.js`) with JWT auth and MySQL
- **Frontend**: React 19 + Vite SPA (`/frontend/src/`) with Bootstrap 5 styling  
- **Database**: MySQL 8.0 via Docker with phpMyAdmin on port 8081
- **Core Domain**: Internet installation management ("pemasangan") with customer, agent, and village entities

## Critical Development Setup
```bash
# Database (required first)
docker compose up -d
# Verify: http://localhost:8081 (phpMyAdmin)

# Backend (port 3000, binds to 0.0.0.0 for network access)
cd backend && npm install && npm run dev

# Frontend (Vite dev server)  
cd frontend && npm install && npm run dev
```

## Database Schema Patterns
- **Core Tables**: `users`, `pemasangan`, `agents`, `villages`, `activity_logs`
- **Schema Evolution**: Use `/database/*.sql` files, especially `manajemen-akun-setup.sql` for schema updates
- **Role System**: Users have `role` ENUM('User', 'Administrator') - admins can manage other users
- **Status Tracking**: `pemasangan.status` ENUM('menunggu', 'terpasang') drives workflow

## Backend API Conventions
- **Auth Pattern**: JWT tokens in `Authorization: Bearer <token>` header
- **Protected Routes**: Use `verifyToken` middleware for authenticated endpoints
- **Admin Routes**: Additional role check (`results[0].role !== 'Administrator'`)
- **Error Handling**: Consistent `{ message: "error text" }` JSON responses
- **Network Binding**: Server binds to `0.0.0.0:3000` for both local and network access (`172.16.31.11:3000`)

## Frontend Architecture Patterns
- **Auth State**: `isLoggedIn` state in `App.jsx` controls route access with `<Navigate>` redirects
- **API Base URL**: Dynamic selection via `getApiUrl()` helper (localhost vs network IP)
- **Layout Structure**: Sidebar + Header + main content wrapper for authenticated pages
- **State Management**: useState hooks, no global state library
- **Styling**: Bootstrap 5 classes with custom CSS files per component

## Key Business Logic
- **Pemasangan Workflow**: Customer registration → confirmation (with technician/date) → completion
- **Commission Tracking**: `komisi_dibayar` boolean field for agent payment status  
- **Village Management**: Hierarchical data (village → kecamatan → kabupaten)
- **Activity Logging**: Admin-only access to user activity via `activity_logs` table

## Development Patterns
- **File Naming**: React components use PascalCase.jsx, CSS files match component name
- **Database Queries**: Always use parameterized queries (`db.query(sql, [params])`)
- **Date Handling**: Backend expects `YYYY-MM-DD` format, frontend uses HTML date inputs
- **Error Boundaries**: `<ErrorBoundary>` wraps complex components like DaftarPemasangan
- **Indonesian Localization**: UI text and database content in Indonesian

## Testing & Debugging
- **phpMyAdmin**: http://localhost:8081 (root/rootpassword or auth_user/auth_password)
- **API Testing**: Server exposes `/` endpoint for basic connectivity check
- **Database Reset**: Use `database-setup.sql` and schema files in `/database/` directory
- **Network Access**: Backend configured for multi-interface access (local + 172.16.31.11)

## Integration Points
- **Docker Compose**: MySQL + phpMyAdmin services must be running before backend
- **JWT Secret**: Environment variable `JWT_SECRET` (defaults to 'your-secret-key')
- **Database Credentials**: Hardcoded in `server.js` (btd/Balionelove_121/auth_db)
- **CORS**: Enabled for cross-origin requests from frontend dev server