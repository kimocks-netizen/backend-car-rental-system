-- Fix RLS policies for cars table
-- This should be run in Supabase SQL editor

-- Disable RLS temporarily to allow service role access
ALTER TABLE cars DISABLE ROW LEVEL SECURITY;

-- Or if you want to keep RLS enabled, create proper policies:
-- ALTER TABLE cars ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Enable read access for all users" ON cars;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON cars;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON cars;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON cars;

-- Create new policies that allow service role access
CREATE POLICY "Enable read access for all users" ON cars FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users" ON cars FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users" ON cars FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Enable delete for authenticated users" ON cars FOR DELETE TO authenticated USING (true);

-- Allow service role to bypass RLS (this is usually enabled by default)
-- ALTER TABLE cars FORCE ROW LEVEL SECURITY;