-- Script untuk menambahkan tabel dan kolom yang diperlukan untuk fitur Manajemen Akun

-- 1. Menambahkan kolom pada tabel users yang sudah ada
-- Cek dan tambahkan kolom name jika belum ada
SET @sql = IF((SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE table_name = 'users' AND column_name = 'name' AND table_schema = 'auth_db') = 0,
    'ALTER TABLE users ADD COLUMN name VARCHAR(100) DEFAULT NULL',
    'SELECT "Column name already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Cek dan tambahkan kolom phone jika belum ada
SET @sql = IF((SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE table_name = 'users' AND column_name = 'phone' AND table_schema = 'auth_db') = 0,
    'ALTER TABLE users ADD COLUMN phone VARCHAR(20) DEFAULT NULL',
    'SELECT "Column phone already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Cek dan tambahkan kolom address jika belum ada
SET @sql = IF((SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE table_name = 'users' AND column_name = 'address' AND table_schema = 'auth_db') = 0,
    'ALTER TABLE users ADD COLUMN address TEXT DEFAULT NULL',
    'SELECT "Column address already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Cek dan tambahkan kolom role jika belum ada
SET @sql = IF((SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE table_name = 'users' AND column_name = 'role' AND table_schema = 'auth_db') = 0,
    'ALTER TABLE users ADD COLUMN role ENUM(''User'', ''Administrator'') DEFAULT ''User''',
    'SELECT "Column role already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Cek dan tambahkan kolom created_at jika belum ada
SET @sql = IF((SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE table_name = 'users' AND column_name = 'created_at' AND table_schema = 'auth_db') = 0,
    'ALTER TABLE users ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
    'SELECT "Column created_at already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 2. Membuat tabel agents untuk master data agent
CREATE TABLE IF NOT EXISTS agents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100) DEFAULT NULL,
    address TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. Membuat tabel villages untuk master data desa
CREATE TABLE IF NOT EXISTS villages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    kecamatan VARCHAR(100) NOT NULL,
    kabupaten VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 4. Membuat tabel activity_logs untuk log aktivitas sistem
CREATE TABLE IF NOT EXISTS activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    activity VARCHAR(255) NOT NULL,
    details TEXT DEFAULT NULL,
    ip_address VARCHAR(45) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. Insert data sample untuk testing
-- Membuat user admin default jika belum ada
INSERT IGNORE INTO users (email, password, name, role) 
VALUES ('admin@btd.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrator', 'Administrator');

-- Insert beberapa agent sample
INSERT IGNORE INTO agents (name, phone, email, address) VALUES
('Agent 1', '08123456789', 'agent1@btd.com', 'Jl. Agent 1 No. 123'),
('Agent 2', '08123456790', 'agent2@btd.com', 'Jl. Agent 2 No. 456'),
('Agent 3', '08123456791', 'agent3@btd.com', 'Jl. Agent 3 No. 789');

-- Insert beberapa desa sample
INSERT IGNORE INTO villages (name, kecamatan, kabupaten) VALUES
('Desa Sukamaju', 'Kecamatan Barat', 'Kabupaten Utama'),
('Desa Makmur', 'Kecamatan Timur', 'Kabupaten Utama'),
('Desa Tentram', 'Kecamatan Selatan', 'Kabupaten Utama'),
('Desa Sejahtera', 'Kecamatan Utara', 'Kabupaten Utama');

-- Insert beberapa log aktivitas sample
INSERT IGNORE INTO activity_logs (user_id, activity, details, ip_address) VALUES
(1, 'Login', 'User berhasil login ke sistem', '127.0.0.1'),
(1, 'Create User', 'Menambahkan user baru: test@example.com', '127.0.0.1'),
(1, 'Update Profile', 'Memperbarui informasi profil', '127.0.0.1');

-- 6. Membuat index untuk optimasi performa (dengan pengecekan)
-- Index untuk users.email
SET @sql = IF((SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS 
    WHERE table_name = 'users' AND index_name = 'idx_users_email' AND table_schema = 'auth_db') = 0,
    'CREATE INDEX idx_users_email ON users(email)',
    'SELECT "Index idx_users_email already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Index untuk users.role
SET @sql = IF((SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS 
    WHERE table_name = 'users' AND index_name = 'idx_users_role' AND table_schema = 'auth_db') = 0,
    'CREATE INDEX idx_users_role ON users(role)',
    'SELECT "Index idx_users_role already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Index untuk agents.name
SET @sql = IF((SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS 
    WHERE table_name = 'agents' AND index_name = 'idx_agents_name' AND table_schema = 'auth_db') = 0,
    'CREATE INDEX idx_agents_name ON agents(name)',
    'SELECT "Index idx_agents_name already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Index untuk villages.name
SET @sql = IF((SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS 
    WHERE table_name = 'villages' AND index_name = 'idx_villages_name' AND table_schema = 'auth_db') = 0,
    'CREATE INDEX idx_villages_name ON villages(name)',
    'SELECT "Index idx_villages_name already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Index untuk activity_logs.user_id
SET @sql = IF((SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS 
    WHERE table_name = 'activity_logs' AND index_name = 'idx_activity_logs_user_id' AND table_schema = 'auth_db') = 0,
    'CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id)',
    'SELECT "Index idx_activity_logs_user_id already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Index untuk activity_logs.created_at
SET @sql = IF((SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS 
    WHERE table_name = 'activity_logs' AND index_name = 'idx_activity_logs_created_at' AND table_schema = 'auth_db') = 0,
    'CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at)',
    'SELECT "Index idx_activity_logs_created_at already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 7. Update existing users to have default role if NULL
UPDATE users SET role = 'User' WHERE role IS NULL;

COMMIT;