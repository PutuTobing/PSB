#!/bin/bash

# Script untuk memperbarui struktur database
echo "🔄 Memperbarui struktur database..."

# Menjalankan script SQL untuk update schema
mysql -u btd -p'Balionelove_121' < /home/btd/Database-Login/database/update-schema.sql

if [ $? -eq 0 ]; then
    echo "✅ Database berhasil diperbarui!"
    echo "   - Kolom 'desa' telah ditambahkan"
    echo "   - Semua data existing menggunakan 'Desa Braja Gemilang'"
else
    echo "❌ Error saat memperbarui database"
    exit 1
fi