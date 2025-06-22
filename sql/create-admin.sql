-- Script untuk membuat user admin
-- Jalankan script ini setelah fix-profiles-table.sql

-- 1. Cek user yang sudah ada di auth.users
SELECT id, email, created_at 
FROM auth.users 
ORDER BY created_at DESC;

-- 2. Cek profiles yang sudah ada
SELECT id, email, name, role, created_at 
FROM profiles 
ORDER BY created_at DESC;

-- 3. Update role menjadi admin (ganti email sesuai user yang ingin dijadikan admin)
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'anommahesa02@gmail.com';

-- 4. Verifikasi perubahan
SELECT id, email, name, role, created_at 
FROM profiles 
WHERE email = 'anommahesa02@gmail.com';

-- 5. Tampilkan semua admin
SELECT id, email, name, role, created_at 
FROM profiles 
WHERE role = 'admin'; 