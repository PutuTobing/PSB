# BTD Database Login Application

> **Modern Customer Management System for Internet Service Provider**

A comprehensive full-stack application with React frontend and Node.js backend for managing customer installations, users, and master data.

## 🚀 Quick Features

✅ **User Management** - Full CRUD with role-based access control  
✅ **Installation Tracking** - Complete customer installation lifecycle  
✅ **Master Data** - Agents and Villages management  
✅ **JWT Authentication** - Secure token-based authentication  
✅ **Mobile Optimized** - Responsive design for all devices  
✅ **Modern UI/UX** - Elegant gradients, animations, and Bootstrap Icons  

## 📚 Documentation

**→ [MASTER_DOCUMENTATION.md](./MASTER_DOCUMENTATION.md)** - Complete guide for developers and AI assistants

This master doc includes:
- 📋 Project overview & architecture
- ⚡ Quick start guide
- 💻 Development patterns
- 🌐 Complete API reference
- 🗄️ Database schema
- ⚛️ Frontend components
- 🎨 Styling system & design patterns
- 🔧 Troubleshooting guide
- ✅ Best practices

## �️ Tech Stack

**Frontend**: React 19.2.0 + Vite 7.1.9 + Bootstrap Icons  
**Backend**: Node.js + Express + MySQL2 + JWT  
**Database**: MySQL 8.0 (auth_db)  
**Styling**: Custom CSS with mobile-first approach  

## ⚡ Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/PutuTobing/Database-Login.git
cd Database-Login

# Backend
cd backend && npm install

# Frontend (new terminal)
cd frontend && npm install
```

### 2. Setup Database
```bash
# Start MySQL (XAMPP/LAMP)
sudo /opt/lampp/lampp start

# Import schema
mysql -u root -p < database/customers-schema.sql
```

### 3. Configure Environment
```bash
# backend/.env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=auth_db
JWT_SECRET=your-secret-key
```

### 4. Start Development
```bash
# Backend (Terminal 1)
cd backend && npm start
# → http://localhost:3000

# Frontend (Terminal 2)
cd frontend && npm run dev
# → http://localhost:5173
```

## 📱 Usage

1. **Register**: Create new account at `/register`
2. **Login**: Access system at `/login`
3. **Dashboard**: View stats and quick actions
4. **Daftar Pemasangan**: Manage customer installations
5. **Manajemen Akun**: User and master data management (Admin only)

## 🔐 Default Credentials

```
Admin Account:
Email: admin@btd.com
Password: password
```

## 📊 Project Structure

```
Database-Login/
├── backend/
│   ├── server.js              # Express API server
│   └── package.json           # Dependencies
├── frontend/
│   ├── src/
│   │   ├── pages/             # Page components
│   │   ├── components/        # Reusable components
│   │   ├── App.jsx           # React router
│   │   └── main.jsx          # Entry point
│   └── vite.config.js        # Vite config
├── database/
│   └── *.sql                  # Database schemas
├── MASTER_DOCUMENTATION.md    # Complete documentation
└── README.md                  # This file
```

## 🎨 Key Features

### Mobile Optimization
- ✅ Icon-only action buttons (44x44px)
- ✅ Responsive table cards for mobile
- ✅ Modal viewport positioning
- ✅ Touch-friendly interactions

### UI/UX Enhancements
- ✅ Gradient action buttons with animations
- ✅ Bootstrap Icons integration
- ✅ Smooth transitions and hover effects
- ✅ Loading states and error handling

### Security
- ✅ JWT token authentication
- ✅ Password hashing (bcrypt)
- ✅ Protected API routes
- ✅ Role-based access control

## 🔧 Development

### Adding New Features
1. Check `MASTER_DOCUMENTATION.md` for patterns
2. Follow mobile-first CSS approach
3. Use Bootstrap Icons for consistency
4. Test on multiple screen sizes

### Code Style
- **React**: Functional components with hooks
- **CSS**: BEM methodology, scoped styles
- **JavaScript**: ES6+, async/await
- **Git**: Conventional commits

## 🐛 Troubleshooting

Common issues and solutions:

**401 Errors**: Login again, token may have expired  
**Port in Use**: `sudo kill -9 $(lsof -t -i:3000)`  
**Icons Missing**: Check Bootstrap Icons CDN in `index.html`  
**Modal Position**: Already fixed in v2.0.0  

**→ Full troubleshooting guide in MASTER_DOCUMENTATION.md**

## 📝 API Endpoints

```
Authentication:
POST   /api/auth/login          # User login
POST   /api/auth/register       # New user
GET    /api/auth/profile        # Current user

Users (Admin only):
GET    /api/users               # List users
POST   /api/users               # Create user
PUT    /api/users/:id           # Update user
DELETE /api/users/:id           # Delete user

Installations:
GET    /api/pemasangan          # List installations
POST   /api/pemasangan          # Create
PUT    /api/pemasangan/:id      # Update
DELETE /api/pemasangan/:id      # Delete

Master Data:
GET/POST/PUT/DELETE /api/agents
GET/POST/PUT/DELETE /api/villages
```

**→ Complete API reference in MASTER_DOCUMENTATION.md**

## 🎯 Version History

**v2.0.0** (Current - Oct 2025)
- Mobile optimization with icon-only buttons
- Modal viewport positioning fix
- Enhanced UI/UX with gradients
- Bootstrap Icons integration
- CSS isolation system

**v1.5.0** (Oct 2025)
- Database integration (auth_db)
- Real-time data fetching

**v1.0.0** (Oct 2025)
- Initial release

## 👤 Author

**PutuTobing**  
GitHub: [@PutuTobing](https://github.com/PutuTobing)

## 📄 License

MIT License - See [LICENSE](LICENSE) file

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

**📚 For complete documentation, development patterns, and troubleshooting:**  
**→ Read [MASTER_DOCUMENTATION.md](./MASTER_DOCUMENTATION.md)**

**Happy Coding! 🚀**

## 🛠️ Tech Stack

- **Frontend**: React 19.2.0 + Vite 7.1.9
- **Backend**: Node.js + Express + MySQL2
- **Database**: MySQL (auth_db)
- **Styling**: Custom CSS + Bootstrap Icons
- **Authentication**: JWT tokens

## Prerequisites

- **Node.js** (v18 or higher)
- **MySQL** (8.0+)
- **Git**
- **Docker** (optional for database setup)

## ⚡ Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/PutuTobing/Database-Login.git
cd Database-Login
```

### 2. Setup Database (Docker)
```bash
# Start MySQL and phpMyAdmin
docker compose up -d

# Verify containers are running
docker compose ps
```

### 3. Setup Backend
```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your database credentials
# Example:
# DB_USER= seperti biasa lah
# DB_PASSWORD= seperti biasa lah
# JWT_SECRET=your-secret-key
```

### 4. Initialize Database
```bash
# Create database and tables (optional - can be done via phpMyAdmin)
docker exec -it seperti biasa lah-db-1 mysql -u root -prootpassword < ../database-setup.sql
```

### 5. Start Backend Server
```bash
# From backend directory
npm start

# Server will run on http://localhost:3000
```

### 6. Access Application
- **Application**: http://localhost:3000/login.html
- **phpMyAdmin**: http://localhost:8081

## 🗄️ Database Configuration

### Default Database Credentials
- **Host**: localhost:3306
- **Database**: auth_db
- **Root User**: root / rootpassword
- **App User**: auth_user / auth_password

### Custom User (Example)
- **Username**: seperti biasa lah
- **Password**: seperti biasa lah

### phpMyAdmin Access
- **URL**: http://localhost:8081
- **Login**: Use any of the database users above

## 📱 Usage

### Registration
1. Go to http://localhost:3000/login.html
2. Click "Register here"
3. Enter email and password
4. Click "Register"

### Login
1. Enter your email and password
2. Click "Login"
3. You'll be redirected to the dashboard

### Dashboard
- View welcome message with your email
- See account statistics
- Use logout button to end session

## 🔧 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register` | Register new user |
| POST | `/api/login` | User login |
| POST | `/api/logout` | User logout |
| GET | `/api/dashboard` | Get dashboard data (protected) |

### API Examples

**Register User:**
```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

**Login User:**
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

## 🔐 Security Features

- **Password Hashing**: Bcrypt with salt rounds
- **JWT Tokens**: Secure authentication tokens
- **Input Validation**: Email and password validation
- **SQL Injection Protection**: Prepared statements
- **CORS Enabled**: Cross-origin resource sharing
- **Environment Variables**: Sensitive data protection

## 🐳 Docker Services

The `docker-compose.yml` includes:

- **MySQL 8.0**: Database server
- **phpMyAdmin**: Web-based MySQL administration

### Docker Commands
```bash
# Start services
docker compose up -d

# Stop services
docker compose down

# View logs
docker compose logs

# Access MySQL directly
docker exec -it btd-db-1 mysql -u root -prootpassword
```

## 🛠️ Development

### Backend Development
```bash
cd backend

# Install nodemon for development
npm install -g nodemon

# Run in development mode
npm run dev
```

### Frontend Development
The frontend uses vanilla JavaScript and can be modified directly. The backend serves static files from the `frontend` directory.

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔧 Environment Variables

Create `backend/.env` file:

```env
PORT=3000
DB_HOST=localhost
DB_USER=seperti biasa lah
DB_PASSWORD=seperti biasa lah
DB_NAME=auth_db
JWT_SECRET=your-super-secret-key
```

## 🎯 Testing

### Create Demo User
```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{"email": "demo@test.com", "password": "demo123"}'
```

### Test Login
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email": "demo@test.com", "password": "demo123"}'
```

## 🐛 Troubleshooting

### Common Issues

1. **Port 3000 already in use**
   ```bash
   # Kill process using port 3000
   sudo kill -9 $(lsof -t -i:3000)
   ```

2. **Database connection failed**
   - Check if Docker containers are running: `docker compose ps`
   - Verify database credentials in `.env` file
   - Check Docker logs: `docker compose logs db`

3. **phpMyAdmin can't connect**
   - Wait a few seconds after starting Docker
   - Refresh browser page
   - Check container status: `docker compose ps`

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**PutuTobing**
- GitHub: [@PutuTobing](https://github.com/PutuTobing)

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Changelog

### Version 2.0.0 (Current)
- ✅ Modern sidebar navigation system
- ✅ Dashboard with real-time clock and user info
- ✅ Daftar Pemasangan page with data table
- ✅ Manajemen Akun page with profile settings
- ✅ Responsive design for mobile and desktop
- ✅ Indonesian localization
- ✅ Enhanced UI with gradients and animations
- ✅ Authentication integration across all pages
- ✅ Logout functionality on all pages

### Version 1.0.0
- Initial release
- Basic authentication system
- MySQL integration
- Docker support
- phpMyAdmin integration

---

**Happy Coding! 🚀**
