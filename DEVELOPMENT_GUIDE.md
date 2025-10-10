# Development Guide - Database Login Application

## 🚀 Quick Start for New Developers

### Prerequisites
- **Node.js**: 18+ 
- **MySQL**: 8.0+
- **Git**: Latest version
- **VS Code**: Recommended IDE

### Initial Setup
```bash
# Clone repository
git clone https://github.com/PutuTobing/PSB.git
cd Database-Login

# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Start development servers
npm run dev:backend  # Backend on :3000
npm run dev:frontend # Frontend on :5173
```

## 📁 Project Structure Deep Dive

```
Database-Login/
├── backend/
│   ├── server.js              # 🟢 Main Express server
│   ├── package.json           # Backend dependencies
│   └── node_modules/          # Dependencies
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── DaftarPemasangan.jsx  # 🔵 Installation management
│   │   │   ├── DaftarPemasangan.css  # 🎨 Responsive styling
│   │   │   ├── ManajemenAkun.jsx     # 🔵 User & master data
│   │   │   ├── ManajemenAkun.css     # 🎨 Elegant UI styling
│   │   │   └── Login.jsx             # 🔐 Authentication
│   │   ├── components/         # Reusable components
│   │   └── main.jsx           # React entry point
│   ├── package.json           # Frontend dependencies
│   └── vite.config.js         # Vite configuration
├── database/
│   └── customers-schema.sql   # Database schema
├── docker-compose.yml         # Container setup
├── PROJECT_OVERVIEW.md        # 📚 This documentation
└── README.md                  # Basic project info
```

## 🔧 Key Development Patterns

### 1. React Component Pattern
```javascript
// Standard functional component with hooks
const ComponentName = () => {
    const [state, setState] = useState(initialValue);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Data fetching logic
        fetchData();
    }, []);

    const handleAction = async () => {
        try {
            setLoading(true);
            // API call
            const response = await fetch('/api/endpoint');
            const data = await response.json();
            setState(data);
        } catch (error) {
            console.error('Error:', error);
            // Show user-friendly error
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="component-wrapper">
            {/* JSX content */}
        </div>
    );
};
```

### 2. API Integration Pattern
```javascript
// Consistent API calling with authentication
const apiCall = async (endpoint, method = 'GET', data = null) => {
    const token = localStorage.getItem('token');
    
    const config = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    };
    
    if (data) {
        config.body = JSON.stringify(data);
    }
    
    const response = await fetch(`http://localhost:3000/api${endpoint}`, config);
    
    if (!response.ok) {
        if (response.status === 401) {
            // Handle authentication error
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        throw new Error(`API Error: ${response.status}`);
    }
    
    return response.json();
};
```

### 3. CSS Styling Pattern
```css
/* Component-scoped styling with BEM methodology */
.component-name {
    /* Container styles */
}

.component-name__element {
    /* Element styles */
}

.component-name__element--modifier {
    /* Modified element styles */
}

/* Responsive design with mobile-first approach */
.component-name {
    /* Mobile styles (base) */
}

@media screen and (min-width: 768px) {
    .component-name {
        /* Tablet styles */
    }
}

@media screen and (min-width: 1200px) {
    .component-name {
        /* Desktop styles */
    }
}
```

## 🎨 Current UI System

### Action Button Components
```css
/* Elegant gradient buttons with hover effects */
.action-btn {
    min-width: 36px;
    min-height: 36px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
}

/* Button variants */
.action-btn.edit {
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.25);
}

.action-btn.reset-password {
    background: linear-gradient(135deg, #f59e0b, #d97706);
    box-shadow: 0 2px 8px rgba(245, 158, 11, 0.25);
}

.action-btn.delete {
    background: linear-gradient(135deg, #ef4444, #dc2626);
    box-shadow: 0 2px 8px rgba(239, 68, 68, 0.25);
}

/* Hover effects */
.action-btn:hover {
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

/* Shimmer effect */
.action-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
    transition: left 0.8s ease-out;
}

.action-btn:hover::before {
    left: 100%;
}
```

### Icon System
```javascript
// Bootstrap Icons (preferred for consistency)
<i className="bi bi-pencil-square"></i>  // Edit icon
<i className="bi bi-key"></i>            // Reset password icon  
<i className="bi bi-trash3"></i>         // Delete icon

// Font Awesome (legacy, being phased out)
<i className="fas fa-edit"></i>          // Legacy edit icon
<i className="fas fa-trash"></i>         // Legacy delete icon
```

## 🔐 Authentication Flow

### Login Process
```javascript
const handleLogin = async (email, password) => {
    try {
        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            // Redirect to dashboard
            window.location.href = '/dashboard';
        } else {
            // Show error message
            setError('Invalid credentials');
        }
    } catch (error) {
        setError('Network error');
    }
};
```

### Protected Route Check
```javascript
useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login';
        return;
    }
    
    // Verify token validity
    fetch('http://localhost:3000/api/auth/profile', {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    })
    .then(response => {
        if (!response.ok) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return response.json();
    })
    .then(user => {
        setCurrentUser(user);
    });
}, []);
```

## 📊 Database Operations

### CRUD Operations Pattern
```javascript
// Create
const createRecord = async (data) => {
    return await apiCall('/endpoint', 'POST', data);
};

// Read
const fetchRecords = async () => {
    return await apiCall('/endpoint', 'GET');
};

// Update  
const updateRecord = async (id, data) => {
    return await apiCall(`/endpoint/${id}`, 'PUT', data);
};

// Delete
const deleteRecord = async (id) => {
    return await apiCall(`/endpoint/${id}`, 'DELETE');
};
```

### Data State Management
```javascript
const [data, setData] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

const loadData = async () => {
    try {
        setLoading(true);
        setError(null);
        const result = await fetchRecords();
        setData(result);
    } catch (err) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
};
```

## 🎯 Common Development Tasks

### Adding New Feature
1. **Plan the feature**: Define requirements and UI mockup
2. **Database changes**: Update schema if needed
3. **Backend API**: Add new endpoints in `server.js`
4. **Frontend component**: Create/update React components  
5. **Styling**: Add responsive CSS
6. **Testing**: Test functionality across devices
7. **Documentation**: Update this guide

### Debugging Steps
1. **Check console**: Browser dev tools for frontend errors
2. **Network tab**: Check API requests/responses
3. **Server logs**: Backend console for server errors
4. **Database**: Verify data integrity
5. **Authentication**: Check token validity

### Performance Optimization
1. **Lazy loading**: Code splitting for large components
2. **Memoization**: Use React.memo for expensive components
3. **Debouncing**: For search inputs and API calls
4. **Image optimization**: Proper sizing and formats
5. **Bundle analysis**: Check bundle size with Vite

## 🔍 Troubleshooting Guide

### Common Issues

#### 1. Icons Not Displaying
**Symptoms**: White boxes instead of icons
**Cause**: Font loading issues or CSS conflicts
**Solution**:
```css
/* Add to CSS file */
@import url('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css');
@import url('https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.11.3/font/bootstrap-icons.min.css');

/* Ensure proper icon styling */
.bi {
    font-family: "bootstrap-icons" !important;
    display: inline-block !important;
}
```

#### 2. Authentication Issues
**Symptoms**: 401 errors, automatic logouts
**Cause**: Token expiration or invalid tokens
**Solution**:
```javascript
// Add token refresh logic
const refreshToken = async () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
        const response = await fetch('/api/auth/refresh', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token);
            return true;
        }
    } catch (error) {
        console.error('Token refresh failed:', error);
    }
    
    return false;
};
```

#### 3. Responsive Design Issues
**Symptoms**: Layout breaking on mobile/tablet
**Cause**: Fixed widths, insufficient breakpoints
**Solution**:
```css
/* Use flexible units */
.container {
    width: 100%;
    max-width: 1200px;
    padding: 0 16px;
}

/* Proper breakpoints */
@media screen and (min-width: 768px) {
    .container {
        padding: 0 24px;
    }
}

@media screen and (min-width: 1200px) {
    .container {
        padding: 0 32px;
    }
}
```

#### 4. Database Connection Issues
**Symptoms**: Server startup failures, query errors
**Cause**: Wrong credentials or database not running
**Solution**:
```javascript
// Check database configuration in server.js
const dbConfig = {
    host: 'localhost',
    user: 'your_username',
    password: 'your_password',
    database: 'auth_db'
};

// Add connection error handling
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        process.exit(1);
    }
    console.log('✅ Database connected successfully');
});
```

## 📝 Code Review Checklist

### Before Committing
- [ ] **Functionality**: Feature works as expected
- [ ] **Responsive**: Tested on mobile, tablet, desktop
- [ ] **Authentication**: Proper token handling
- [ ] **Error Handling**: Graceful error messages
- [ ] **Performance**: No unnecessary re-renders
- [ ] **Accessibility**: Proper ARIA labels
- [ ] **Code Style**: Consistent formatting
- [ ] **Documentation**: Updated if needed

### Git Commit Format
```bash
# Use conventional commits with emojis
git commit -m "✨ feat: Add new user management feature

🎨 UI improvements:
- Enhanced action buttons with gradients
- Added hover animations
- Improved mobile responsiveness

🔧 Technical changes:
- Migrated to Bootstrap Icons
- Added error boundary
- Optimized API calls"
```

## 🔮 Future Considerations

### Planned Improvements
1. **TypeScript Migration**: Gradual adoption for better type safety
2. **Testing Framework**: Jest + React Testing Library
3. **State Management**: Context API or Redux for complex state
4. **Performance**: React.memo, useMemo, useCallback optimization
5. **PWA Features**: Service workers, offline functionality
6. **Internationalization**: Multi-language support

### Architecture Evolution
- **Microservices**: Split backend into smaller services
- **GraphQL**: Replace REST APIs for better data fetching
- **Real-time**: WebSocket integration for live updates
- **Caching**: Redis for session and data caching
- **Monitoring**: Error tracking and performance monitoring

---

**Happy Coding! 🚀**

*This guide is living documentation - please update it as the project evolves.*