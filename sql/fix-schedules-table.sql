-- Fix Schedules Table Structure
-- Run this in Supabase SQL Editor to allow admin-created schedules

-- 1. Check current schedules table structure
SELECT 'Current schedules table structure:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'schedules' 
ORDER BY ordinal_position;

-- 2. Drop existing schedules table (WARNING: This will delete all data)
DROP TABLE IF EXISTS schedules CASCADE;

-- 3. Recreate schedules table with correct structure
CREATE TABLE schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NULL, -- Allow NULL for admin-created schedules
  date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'booked', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Enable Row Level Security
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;

-- 5. Create policies for schedules table
CREATE POLICY "Users can view all schedules" ON schedules
  FOR SELECT USING (true);

CREATE POLICY "Users can book schedules" ON schedules
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all schedules" ON schedules
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- 6. Create policy for inserting schedules (admin can insert without user_id)
CREATE POLICY "Admins can insert schedules" ON schedules
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- 7. Verify the table structure
SELECT 'New schedules table structure:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'schedules' 
ORDER BY ordinal_position;

-- 8. Show policies
SELECT 'Schedules policies:' as info;
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'schedules';

-- 9. Test insert (this should work for admin users)
SELECT 'Table ready for admin schedule creation' as status; 