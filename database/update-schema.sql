-- Update database schema untuk menambahkan kolom desa
USE auth_db;

-- Tambahkan kolom desa ke tabel pemasangan jika belum ada
ALTER TABLE pemasangan ADD COLUMN IF NOT EXISTS desa VARCHAR(100) DEFAULT 'Desa Braja Gemilang';

-- Update semua data yang sudah ada untuk menggunakan Desa Braja Gemilang sebagai default
UPDATE pemasangan SET desa = 'Desa Braja Gemilang' WHERE desa IS NULL OR desa = '';

-- Tampilkan struktur tabel yang sudah diperbarui
DESCRIBE pemasangan;

-- Tampilkan contoh data
SELECT id, nama, desa, tanggal_daftar FROM pemasangan LIMIT 5;