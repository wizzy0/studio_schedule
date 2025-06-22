-- Make User Admin
-- Run this after setup-database.sql

-- 1. Check existing users
SELECT 'Existing users in auth.users:' as info;
SELECT id, email, created_at 
FROM auth.users 
ORDER BY created_at DESC;

-- 2. Check existing profiles
SELECT 'Existing profiles:' as info;
SELECT id, email, name, role, created_at 
FROM profiles 
ORDER BY created_at DESC;

-- 3. Make user admin (replace email with your email)
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'anommahesa02@gmail.com';

-- 4. Verify the change
SELECT 'Admin users:' as info;
SELECT id, email, name, role, created_at 
FROM profiles 
WHERE role = 'admin';

-- 5. Show all profiles
SELECT 'All profiles:' as info;
SELECT id, email, name, role, created_at 
FROM profiles 
ORDER BY created_at DESC; 