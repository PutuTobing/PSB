-- Database setup script for Database-Login project
-- This script will create the necessary database and tables

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS auth_db;

-- Use the database
USE auth_db;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create demo user (password is 'demo123' hashed with bcrypt)
-- INSERT INTO users (email, password) VALUES ('demo@test.com', '$2a$10$hash_here');

-- Show table structure
DESCRIBE users;

-- Show all users
SELECT id, email, created_at FROM users;