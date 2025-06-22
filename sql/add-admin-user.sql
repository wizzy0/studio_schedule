-- Script untuk Menambah User Admin Baru
-- Jalankan script ini di Supabase SQL Editor

-- 1. Cek user yang sudah ada
SELECT 'Users yang sudah ada:' as info;
SELECT id, email, name, role, created_at 
FROM profiles 
ORDER BY created_at DESC;

-- 2. Cara 1: Update user existing menjadi admin
-- Ganti 'email_user@example.com' dengan email user yang ingin dijadikan admin
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'email_user@example.com';

-- 3. Cara 2: Insert admin baru secara manual (jika user belum ada di auth.users)
-- Ganti dengan data yang sesuai
INSERT INTO profiles (id, email, name, role)
VALUES (
    gen_random_uuid(), -- atau UUID yang spesifik
    'admin@studio.com',
    'Studio Admin',
    'admin'
);

-- 4. Cara 3: Buat admin dari user yang sudah sign up
-- Cari user berdasarkan email
SELECT 'Mencari user berdasarkan email:' as info;
SELECT id, email, name, role 
FROM profiles 
WHERE email = 'email_user@example.com';

-- Update role menjadi admin
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'email_user@example.com';

-- 5. Verifikasi admin yang ada
SELECT 'Semua admin saat ini:' as info;
SELECT id, email, name, role, created_at 
FROM profiles 
WHERE role = 'admin'
ORDER BY created_at DESC;

-- 6. Cek total admin
SELECT 'Total admin:' as info, COUNT(*) as admin_count 
FROM profiles 
WHERE role = 'admin'; 