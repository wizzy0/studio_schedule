-- Fix Missing Profiles for Existing Users
-- Run this after setup-database.sql

-- 1. Check existing users in auth.users
SELECT 'Users in auth.users:' as info;
SELECT id, email, created_at 
FROM auth.users 
ORDER BY created_at DESC;

-- 2. Check existing profiles
SELECT 'Profiles count:' as info, COUNT(*) as count FROM profiles;

-- 3. Insert missing profiles for existing users
INSERT INTO profiles (id, email, name, role)
SELECT 
    au.id,
    au.email,
    COALESCE(au.raw_user_meta_data->>'name', 'User'),
    'user'
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
WHERE p.id IS NULL;

-- 4. Verify the fix
SELECT 'Profiles after fix:' as info;
SELECT id, email, name, role, created_at 
FROM profiles 
ORDER BY created_at DESC;

-- 5. Make specific user admin (replace email)
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'anommahesa02@gmail.com';

-- 6. Final verification
SELECT 'All profiles with roles:' as info;
SELECT id, email, name, role, created_at 
FROM profiles 
ORDER BY created_at DESC; 