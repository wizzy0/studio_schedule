-- Fix Trigger for New User Registration
-- Run this to ensure new users get profiles created automatically

-- 1. Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 2. Create improved function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert profile for new user
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    'user'
  );
  
  -- Log the creation
  RAISE NOTICE 'Created profile for user: %', NEW.email;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log any errors
    RAISE NOTICE 'Error creating profile for user %: %', NEW.email, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Test the trigger by checking if it exists
SELECT 'Trigger created successfully' as status;
SELECT trigger_name, event_manipulation, action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- 5. Show function details
SELECT 'Function created successfully' as status;
SELECT routine_name, routine_type, data_type
FROM information_schema.routines 
WHERE routine_name = 'handle_new_user'; 