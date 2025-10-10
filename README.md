# Database Login Application

A comprehensive customer management system for internet service installations with React frontend and Node.js backend.

## 🚀 Features

- **User Authentication & Management** - JWT-based secure login system
- **Installation Management** - Complete CRUD for customer installations
- **Master Data Management** - Agents and Villages management
- **Role-Based Access Control** - Administrator and User roles
- **Responsive Design** - Mobile-first approach with elegant UI
- **Database Integration** - Complete MySQL integration with auth_db
- **Real-time Updates** - Dynamic data fetching and updates
- **Elegant Action Buttons** - Modern UI with gradients and animations

## 📚 Complete Documentation

| Document | Purpose | Audience |
|----------|---------|----------|
| [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) | Complete project architecture and features | All team members |
| [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md) | Development patterns and troubleshooting | Developers |
| [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) | Complete API reference | Developers & integrators |
| [CHAT_CONTEXT.md](./CHAT_CONTEXT.md) | AI assistant context and quick reference | AI assistants & new chats |

## 📁 Project Structure

```
Database-Login/
├── backend/
│   ├── server.js           # Express server with all API endpoints
│   └── package.json        # Backend dependencies
├── frontend/
│   ├── src/pages/
│   │   ├── DaftarPemasangan.jsx    # Installation management
│   │   ├── ManajemenAkun.jsx       # User & master data management
│   │   └── Login.jsx               # Authentication
│   └── package.json        # Frontend dependencies (React + Vite)
├── database/
│   └── customers-schema.sql # Database schema
├── docker-compose.yml      # MySQL & phpMyAdmin setup
├── PROJECT_OVERVIEW.md     # Complete project documentation
├── DEVELOPMENT_GUIDE.md    # Development patterns and guidelines
├── API_DOCUMENTATION.md    # Complete API reference
├── CHAT_CONTEXT.md        # AI assistant context file
└── README.md              # This file
```

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
