const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Root route - FIRST PRIORITY - always redirect to login
app.get('/', (req, res) => {
    console.log('Root access - redirecting to login');
    res.redirect('/login.html');
});

// Login route - serve login page
app.get('/login.html', (req, res) => {
    console.log('Serving login page');
    res.sendFile(path.join(__dirname, '../frontend/login.html'));
});

// Dashboard route - serve dashboard page
app.get('/pages/dashboard.html', (req, res) => {
    console.log('Serving dashboard page');
    res.sendFile(path.join(__dirname, '../frontend/pages/dashboard.html'));
});

// Alternative dashboard route for convenience
app.get('/dashboard', (req, res) => {
    console.log('Dashboard access - redirecting to /pages/dashboard.html');
    res.redirect('/pages/dashboard.html');
});

// Handle index.html redirect for backward compatibility
app.get('/index.html', (req, res) => {
    console.log('index.html access - redirecting to /pages/dashboard.html');
    res.redirect('/pages/dashboard.html');
});

// Static files middleware (AFTER route handlers)
app.use('/css', express.static(path.join(__dirname, '../frontend/css')));
app.use('/js', express.static(path.join(__dirname, '../frontend/js')));
app.use('/components', express.static(path.join(__dirname, '../frontend/components')));
app.use('/pages', express.static(path.join(__dirname, '../frontend/pages')));
app.use('/assets', express.static(path.join(__dirname, '../frontend/assets')));
app.use('/image', express.static(path.join(__dirname, '../frontend/image')));

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'btd',
    password: 'Balionelove_121',
    database: 'auth_db'
});

// Connect to database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// API Routes

// Register route
app.post('/api/register', async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    
    try {
        // Check if user already exists
        const checkUserSql = 'SELECT * FROM users WHERE email = ?';
        db.execute(checkUserSql, [email], async (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ message: 'Server error' });
            }
            
            if (results.length > 0) {
                return res.status(400).json({ message: 'User already exists' });
            }
            
            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);
            
            // Insert new user
            const insertUserSql = 'INSERT INTO users (email, password) VALUES (?, ?)';
            db.execute(insertUserSql, [email, hashedPassword], (err, results) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ message: 'Server error' });
                }
                
                res.status(201).json({ message: 'User registered successfully' });
            });
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login route
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    
    // Find user
    const findUserSql = 'SELECT * FROM users WHERE email = ?';
    db.execute(findUserSql, [email], async (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Server error' });
        }
        
        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        const user = results[0];
        
        try {
            // Check password
            const isValidPassword = await bcrypt.compare(password, user.password);
            
            if (!isValidPassword) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            
            // Generate JWT token
            const token = jwt.sign(
                { id: user.id, email: user.email },
                JWT_SECRET,
                { expiresIn: '1h' }
            );
            
            res.json({
                message: 'Login successful',
                token,
                user: {
                    id: user.id,
                    email: user.email
                }
            });
            
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Server error' });
        }
    });
});

// Logout route
app.post('/api/logout', (req, res) => {
    res.json({ message: 'Logout successful' });
});

// Protected route example
app.get('/api/dashboard', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        res.json({
            message: 'Welcome to dashboard',
            user: decoded
        });
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
});

// Catch-all route for unknown paths
app.get('*', (req, res) => {
    console.log(`Unknown route accessed: ${req.path} - redirecting to login`);
    res.redirect('/login.html');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Start server - BIND TO ALL INTERFACES
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Local access: http://localhost:${PORT}`);
    console.log(`🌐 Network access: http://172.16.31.11:${PORT}`);
    console.log(`✅ Server bound to all interfaces (0.0.0.0)`);
});
