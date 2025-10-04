-- Create pemasangan table
CREATE TABLE IF NOT EXISTS pemasangan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    telepon VARCHAR(20) NOT NULL,
    alamat TEXT NOT NULL,
    tanggal_daftar DATE NOT NULL,
    tanggal_pasang DATE NULL,
    jam_pasang TIME NULL,
    status ENUM('menunggu', 'terpasang') DEFAULT 'menunggu',
    teknisi VARCHAR(255) NULL,
    catatan TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO pemasangan (nama, telepon, alamat, tanggal_daftar, tanggal_pasang, status, teknisi, catatan) VALUES
('Ahmad Wijaya', '081234567890', 'Jl. Merdeka No. 123, Jakarta', '2025-01-15', NULL, 'menunggu', NULL, NULL),
('Sari Indah', '082345678901', 'Jl. Sudirman No. 45, Bandung', '2025-01-10', '2025-01-20', 'terpasang', 'Budi Santoso', 'Pemasangan berhasil, signal bagus'),
('Rahmat Hidayat', '083456789012', 'Jl. Gatot Subroto No. 78, Surabaya', '2025-01-12', NULL, 'menunggu', NULL, NULL),
('Maya Sari', '084567890123', 'Jl. Thamrin No. 90, Jakarta', '2025-01-08', '2025-01-18', 'terpasang', 'Andi Pratama', 'Instalasi lancar, pelanggan puas'),
('Dedi Kurniawan', '085678901234', 'Jl. Diponegoro No. 56, Yogyakarta', '2025-01-14', NULL, 'menunggu', NULL, NULL);
