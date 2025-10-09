const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Root route - API info
app.get('/', (req, res) => {
    res.json({ message: 'Database Login API Server', version: '1.0.0' });
});

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

// Token verification middleware
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

// Pemasangan API Routes

// Get all pemasangan data
app.get('/api/pemasangan', (req, res) => {
    const query = `
        SELECT id, nama, telepon, alamat, desa, agen, tanggal_daftar, tanggal_pasang, 
               status, teknisi, catatan, jam_pasang, komisi_dibayar
        FROM pemasangan 
        ORDER BY tanggal_daftar DESC
    `;
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        res.json(results);
    });
});

// Add new pelanggan
app.post('/api/pemasangan', (req, res) => {
    const { nama, telepon, alamat, desa, agen, tanggal_daftar } = req.body;
    
    if (!nama || !telepon || !alamat || !agen || !desa) {
        return res.status(400).json({ message: 'Nama, telepon, alamat, desa, dan agen harus diisi' });
    }
    
    // Gunakan tanggal_daftar dari frontend atau CURDATE() sebagai fallback
    const tanggalDaftar = tanggal_daftar || 'CURDATE()';
    
    const query = `
        INSERT INTO pemasangan (nama, telepon, alamat, desa, agen, tanggal_daftar, status, komisi_dibayar)
        VALUES (?, ?, ?, ?, ?, ${tanggal_daftar ? '?' : 'CURDATE()'}, 'menunggu', 0)
    `;
    
    const params = tanggal_daftar 
        ? [nama, telepon, alamat, desa, agen, tanggal_daftar]
        : [nama, telepon, alamat, desa, agen];
    
    db.query(query, params, (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        
        res.status(201).json({ 
            message: 'Pelanggan berhasil ditambahkan',
            id: result.insertId 
        });
    });
});

// Update pelanggan data (edit)
app.put('/api/pemasangan/:id', (req, res) => {
    const { id } = req.params;
    const { nama, telepon, alamat, desa, agen, tanggal_daftar } = req.body;
    
    if (!nama || !telepon || !alamat || !desa || !agen || !tanggal_daftar) {
        return res.status(400).json({ message: 'Semua field harus diisi' });
    }
    
    const query = `
        UPDATE pemasangan 
        SET nama = ?, telepon = ?, alamat = ?, desa = ?, agen = ?, tanggal_daftar = ?
        WHERE id = ?
    `;
    
    db.query(query, [nama, telepon, alamat, desa, agen, tanggal_daftar, id], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Pelanggan tidak ditemukan' });
        }
        
        res.json({ message: 'Data pelanggan berhasil diperbarui' });
    });
});

// Update pemasangan status (konfirmasi)
app.put('/api/pemasangan/:id/konfirmasi', (req, res) => {
    const { id } = req.params;
    const { tanggal_pasang, jam_pasang, teknisi, catatan } = req.body;
    
    if (!tanggal_pasang || !teknisi) {
        return res.status(400).json({ message: 'Tanggal pasang dan teknisi harus diisi' });
    }
    
    const query = `
        UPDATE pemasangan 
        SET tanggal_pasang = ?, jam_pasang = ?, teknisi = ?, catatan = ?, status = 'terpasang'
        WHERE id = ?
    `;
    
    db.query(query, [tanggal_pasang, jam_pasang, teknisi, catatan, id], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Pelanggan tidak ditemukan' });
        }
        
        res.json({ message: 'Pemasangan berhasil dikonfirmasi' });
    });
});

// Update komisi status
app.put('/api/pemasangan/:id/komisi', (req, res) => {
    const { id } = req.params;
    const { komisi_dibayar } = req.body;
    
    if (komisi_dibayar === undefined || komisi_dibayar === null) {
        return res.status(400).json({ message: 'Status komisi harus diisi' });
    }
    
    const query = `
        UPDATE pemasangan 
        SET komisi_dibayar = ?
        WHERE id = ?
    `;
    
    db.query(query, [komisi_dibayar ? 1 : 0, id], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Pemasangan tidak ditemukan' });
        }
        
        res.json({ message: 'Status komisi berhasil diupdate' });
    });
});

// Delete pelanggan
app.delete('/api/pemasangan/:id', (req, res) => {
    const { id } = req.params;
    
    const query = 'DELETE FROM pemasangan WHERE id = ?';
    
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Pelanggan tidak ditemukan' });
        }
        
        res.json({ message: 'Pelanggan berhasil dihapus' });
    });
});

// Get pemasangan statistics
app.get('/api/pemasangan/stats', verifyToken, (req, res) => {
    const query = `
        SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN status = 'menunggu' THEN 1 ELSE 0 END) as menunggu,
            SUM(CASE WHEN status = 'terpasang' THEN 1 ELSE 0 END) as terpasang
        FROM pemasangan
    `;
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        res.json(results[0]);
    });
});

// Get unique desa list
app.get('/api/desa', (req, res) => {
    const query = `
        SELECT DISTINCT desa 
        FROM pemasangan 
        WHERE desa IS NOT NULL AND desa != ''
        ORDER BY desa ASC
    `;
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        
        const desaList = results.map(row => row.desa);
        res.json(desaList);
    });
});

// Catch-all route for unknown paths
app.get('*', (req, res) => {
    res.status(404).json({ message: 'API endpoint not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Start server - BIND TO ALL INTERFACES
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 API Server running on port ${PORT}`);
    console.log(`📍 Local access: http://localhost:${PORT}`);
    console.log(`🌐 Network access: http://172.16.31.11:${PORT}`);
    console.log(`✅ Server bound to all interfaces (0.0.0.0)`);
});
