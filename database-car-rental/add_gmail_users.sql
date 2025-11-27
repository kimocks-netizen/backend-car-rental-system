-- Add profiles for Gmail test users
-- Run this in Supabase SQL Editor after creating the auth users

INSERT INTO profiles (id, email, full_name, phone, user_role, user_status, created_at, updated_at)
SELECT 
  au.id,
  au.email,
  CASE 
    WHEN au.email = 'admin@gmail.com' THEN 'System Administrator'
    WHEN au.email = 'staff@gmail.com' THEN 'Staff Member'
    WHEN au.email = 'customer@gmail.com' THEN 'Test Customer'
    ELSE 'User'
  END as full_name,
  CASE 
    WHEN au.email = 'admin@gmail.com' THEN '+1234567890'
    WHEN au.email = 'staff@gmail.com' THEN '+1234567891'
    WHEN au.email = 'customer@gmail.com' THEN '+1234567892'
    ELSE '+1234567899'
  END as phone,
  CASE 
    WHEN au.email = 'admin@gmail.com' THEN 'admin'
    WHEN au.email = 'staff@gmail.com' THEN 'staff'
    ELSE 'customer'
  END as user_role,
  'active' as user_status,
  NOW() as created_at,
  NOW() as updated_at
FROM auth.users au
WHERE au.email IN ('admin@gmail.com', 'staff@gmail.com', 'customer@gmail.com')
AND NOT EXISTS (SELECT 1 FROM profiles p WHERE p.id = au.id);