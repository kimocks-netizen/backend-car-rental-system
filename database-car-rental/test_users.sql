-- Test users for car rental system
-- IMPORTANT: Create these users in Supabase Auth Dashboard first, then run this script

-- Step 1: Go to Supabase Dashboard > Authentication > Users
-- Step 2: Create users with these emails and passwords:
--   admin@carrental.com (password: 123456)- 10e78cbf-c04a-4391-bb26-7c39fbe6a43c
--   staff@carrental.com (password: 123456) - 6c09574c-0236-4b44-9d3c-ccbf881d8653
--   customer@carrental.com (password: 123456) - 82f0f376-8ce7-47c6-ac9c-c58565cb7500
-- Step 3: Copy the user IDs from the dashboard and replace the UUIDs below

-- Insert test user profiles (replace UUIDs with actual auth.users IDs)
-- You can get the user IDs by running: SELECT id, email FROM auth.users;

-- Example insert (replace with actual user IDs):
-- INSERT INTO profiles (id, email, full_name, phone, user_role, user_status, created_at, updated_at) VALUES
-- ('actual-uuid-from-auth-users', 'admin@carrental.com', 'System Administrator', '+1234567890', 'admin', 'active', NOW(), NOW()),
-- ('actual-uuid-from-auth-users', 'staff@carrental.com', 'Staff Member', '+1234567891', 'staff', 'active', NOW(), NOW()),
-- ('actual-uuid-from-auth-users', 'customer@carrental.com', 'Test Customer', '+1234567892', 'customer', 'active', NOW(), NOW());

-- Alternative: Use this query to automatically create profiles for existing auth users
INSERT INTO profiles (id, email, full_name, phone, user_role, user_status, created_at, updated_at)
SELECT 
  au.id,
  au.email,
  CASE 
    WHEN au.email = 'admin@carrental.com' THEN 'System Administrator'
    WHEN au.email = 'staff@carrental.com' THEN 'Staff Member'
    WHEN au.email = 'customer@carrental.com' THEN 'Test Customer'
    ELSE 'User'
  END as full_name,
  CASE 
    WHEN au.email = 'admin@carrental.com' THEN '+1234567890'
    WHEN au.email = 'staff@carrental.com' THEN '+1234567891'
    WHEN au.email = 'customer@carrental.com' THEN '+1234567892'
    ELSE '+1234567899'
  END as phone,
  CASE 
    WHEN au.email = 'admin@carrental.com' THEN 'admin'
    WHEN au.email = 'staff@carrental.com' THEN 'staff'
    ELSE 'customer'
  END as user_role,
  'active' as user_status,
  NOW() as created_at,
  NOW() as updated_at
FROM auth.users au
WHERE au.email IN ('admin@carrental.com', 'staff@carrental.com', 'customer@carrental.com')
AND NOT EXISTS (SELECT 1 FROM profiles p WHERE p.id = au.id);