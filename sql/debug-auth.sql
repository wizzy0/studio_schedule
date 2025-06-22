-- Debug Authentication Issues
-- Run this to check the current state of your database

-- 1. Check if tables exist
SELECT 'Table Check:' as info;
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_name IN ('profiles', 'schedules', 'auth.users')
ORDER BY table_name;

-- 2. Check auth.users table
SELECT 'Auth Users:' as info;
SELECT id, email, created_at, 
       CASE WHEN email_confirmed_at IS NOT NULL THEN 'Confirmed' ELSE 'Not Confirmed' END as status
FROM auth.users 
ORDER BY created_at DESC;

-- 3. Check profiles table structure
SELECT 'Profiles Table Structure:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

-- 4. Check profiles data
SELECT 'Profiles Data:' as info;
SELECT id, email, name, role, created_at 
FROM profiles 
ORDER BY created_at DESC;

-- 5. Check for missing profiles
SELECT 'Missing Profiles:' as info;
SELECT au.id, au.email, au.created_at
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
WHERE p.id IS NULL;

-- 6. Check RLS policies
SELECT 'RLS Policies:' as info;
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'profiles';

-- 7. Check triggers
SELECT 'Triggers:' as info;
SELECT trigger_name, event_manipulation, action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- 8. Check functions
SELECT 'Functions:' as info;
SELECT routine_name, routine_type, data_type
FROM information_schema.routines 
WHERE routine_name = 'handle_new_user'; 