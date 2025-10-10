# Chat Context Setup - Database Login Application

## 🤖 For AI Assistants & New Chat Sessions

### Project Summary
**Database Login Application** adalah sistem manajemen pelanggan untuk layanan internet dengan fokus pada:
- **User Management**: CRUD pengguna dengan role-based access
- **Installation Management**: Tracking pemasangan pelanggan
- **Master Data**: Management agent dan village/desa
- **Authentication**: JWT-based security system

### 🔧 Current Tech Stack
- **Frontend**: React 19.2.0 + Vite 7.1.9
- **Backend**: Node.js + Express + MySQL2
- **Database**: MySQL (auth_db)
- **Styling**: Custom CSS + Bootstrap Icons
- **Authentication**: JWT tokens

### 📁 Key Files to Understand

#### Critical Frontend Files
```javascript
// Main Pages
/frontend/src/pages/DaftarPemasangan.jsx     // Installation management table
/frontend/src/pages/DaftarPemasangan.css     // Responsive table styling  
/frontend/src/pages/ManajemenAkun.jsx        // User & master data management
/frontend/src/pages/ManajemenAkun.css        // Elegant action buttons UI
/frontend/src/pages/Login.jsx                // Authentication page
```

#### Critical Backend Files
```javascript
/backend/server.js                           // All API endpoints
/backend/package.json                        // Dependencies
```

#### Database Schema
```sql
Tables in auth_db:
- users (id, name, email, password, role, phone, address)
- pemasangan (id, nama_pelanggan, alamat, desa_id, agent_id, paket, harga, komisi, status)
- villages (id, name, kecamatan, kabupaten)  
- agents (id, name, phone, email, address)
```

### 🎨 Current UI System

#### Action Button Pattern (Recently Enhanced)
```css
.action-btn {
    /* Elegant gradient buttons with animations */
    background: linear-gradient(135deg, color1, color2);
    border-radius: 8px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.action-btn.edit { background: linear-gradient(135deg, #3b82f6, #1d4ed8); }
.action-btn.reset-password { background: linear-gradient(135deg, #f59e0b, #d97706); }
.action-btn.delete { background: linear-gradient(135deg, #ef4444, #dc2626); }
```

#### Icon System (Recently Migrated)
```javascript
// Current (Bootstrap Icons - preferred)
<i className="bi bi-pencil-square"></i>     // Edit
<i className="bi bi-key"></i>               // Reset password  
<i className="bi bi-trash3"></i>            // Delete

// Legacy (Font Awesome - being phased out)
<i className="fas fa-edit"></i>             // Old edit icon
<i className="fas fa-trash"></i>            // Old delete icon
```

### 🔐 Authentication Flow
```javascript
// Login stores JWT token
localStorage.setItem('token', response.token);

// All API calls include token
headers: { 'Authorization': `Bearer ${token}` }

// Protected routes check token validity
useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) window.location.href = '/login';
}, []);
```

### 📊 API Endpoints Pattern
```javascript
// All endpoints use /api prefix
POST   /api/auth/login              // Authentication
GET    /api/auth/profile            // Current user info

GET    /api/users                   // List all users
POST   /api/users                   // Create user
PUT    /api/users/:id               // Update user
DELETE /api/users/:id               // Delete user
POST   /api/users/:id/reset-password // Reset password

GET    /api/agents                  // List agents
POST   /api/agents                  // Create agent
PUT    /api/agents/:id              // Update agent  
DELETE /api/agents/:id              // Delete agent

GET    /api/villages                // List villages
POST   /api/villages                // Create village
PUT    /api/villages/:id            // Update village
DELETE /api/villages/:id            // Delete village

GET    /api/pemasangan              // List installations
POST   /api/pemasangan              // Create installation
PUT    /api/pemasangan/:id          // Update installation
DELETE /api/pemasangan/:id          // Delete installation
```

### 🎯 Recent Major Changes (v2.0.0)

#### ✅ Completed Features
1. **Elegant Action Buttons**: Gradient backgrounds, hover animations, shimmer effects
2. **Bootstrap Icons Migration**: Consistent icons across all components
3. **Database Integration**: Removed all hardcoded data, pure database-driven
4. **Responsive Design**: Mobile-first approach with proper breakpoints
5. **Authentication Improvements**: Enhanced token handling and error states

#### 🔄 Ongoing Patterns
- **React Hooks**: useState, useEffect for state management
- **Async/Await**: For all API calls with proper error handling
- **Mobile-First CSS**: Responsive design with media queries
- **BEM Methodology**: CSS class naming convention

### 🐛 Common Issues & Solutions

#### Icon Display Problems
**Issue**: Icons showing as white boxes
**Solution**: 
```css
@import url('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css');
```

#### Authentication Errors  
**Issue**: 401 Unauthorized responses
**Solution**: Check token validity, refresh on expiration

#### Responsive Layout Issues
**Issue**: Layout breaking on different screens
**Solution**: Use mobile-first CSS with proper breakpoints

### 🚀 Development Workflow

#### Starting Development
```bash
# Backend (Terminal 1)
cd backend && npm start    # Runs on :3000

# Frontend (Terminal 2)  
cd frontend && npm run dev # Runs on :5173
```

#### Code Patterns to Follow
```javascript
// 1. Component Structure
const ComponentName = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        fetchData();
    }, []);
    
    const handleAction = async () => {
        try {
            setLoading(true);
            // API call logic
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };
    
    return <div>{/* JSX */}</div>;
};

// 2. API Calls with Authentication
const token = localStorage.getItem('token');
const response = await fetch('/api/endpoint', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
});

// 3. CSS Responsive Pattern
.component {
    /* Mobile styles (base) */
}

@media screen and (min-width: 768px) {
    .component {
        /* Tablet styles */
    }
}

@media screen and (min-width: 1200px) {
    .component {
        /* Desktop styles */
    }
}
```

### 🔍 Debugging Checklist

When encountering issues:
1. **Check Browser Console**: Frontend errors and warnings
2. **Network Tab**: API request/response status and data
3. **Backend Console**: Server logs and error messages  
4. **Database**: Verify data integrity and relationships
5. **Authentication**: Token validity and user permissions

### 📈 Performance Considerations
- **React.memo**: For expensive components
- **Debouncing**: For search inputs
- **Lazy Loading**: For large datasets
- **Responsive Images**: Proper sizing
- **Bundle Size**: Monitor with Vite build analysis

### 🎯 When Adding New Features

#### Planning Checklist
- [ ] **Database Schema**: New tables/columns needed?
- [ ] **Backend API**: New endpoints required?
- [ ] **Frontend Component**: New page/component structure?
- [ ] **Styling**: Responsive CSS for all breakpoints?
- [ ] **Authentication**: Role-based access control?
- [ ] **Error Handling**: Graceful error states?
- [ ] **Testing**: Manual testing across devices?

#### Development Steps
1. **Backend First**: Add API endpoints in `server.js`
2. **Frontend Component**: Create React component with hooks
3. **Styling**: Add responsive CSS following existing patterns
4. **Integration**: Connect component to API endpoints
5. **Testing**: Test functionality and responsiveness
6. **Documentation**: Update this context file

### 🔮 Architecture Notes

#### Current State
- **Monolithic Backend**: Single `server.js` file with all endpoints
- **Component-Based Frontend**: React functional components
- **Direct Database Access**: MySQL queries in backend
- **Local Authentication**: JWT stored in localStorage

#### Future Considerations
- **TypeScript**: For better type safety
- **State Management**: Context API or Redux for complex state
- **Testing**: Jest + React Testing Library
- **Microservices**: Split backend into smaller services
- **Real-time**: WebSocket for live updates

---

## 💡 Quick Commands for New Chat Sessions

```bash
# Project status
cd /home/btd/Database-Login
git status
git log --oneline -5

# Start servers
cd backend && npm start &
cd frontend && npm run dev

# Database check
mysql -u root -p auth_db
SHOW TABLES;
DESCRIBE users;

# File structure
tree -I node_modules -L 3
```

### 📋 Key Context for AI Assistants

**Remember**: 
- This is a **production application** with real users
- **Always test changes** on all screen sizes
- **Maintain authentication security** in all endpoints
- **Follow existing patterns** for consistency
- **Update documentation** when making changes
- **Use Bootstrap Icons** for new icon implementations
- **Follow mobile-first** responsive design approach

**Current Version**: 2.0.0 (October 2025)
**Last Major Update**: Elegant UI overhaul with enhanced action buttons
**Repository**: https://github.com/PutuTobing/PSB.git

---

*This context file ensures continuity across chat sessions and provides essential background for AI assistants working on this codebase.*