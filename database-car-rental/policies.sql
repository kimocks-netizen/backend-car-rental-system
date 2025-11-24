-- Enable RLS on all tables
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE refunds ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Staff and admin can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admin can update any profile" ON profiles;

DROP POLICY IF EXISTS "Anyone can view available cars" ON cars;
DROP POLICY IF EXISTS "Public can view available cars" ON cars;
DROP POLICY IF EXISTS "Staff and admin can view all cars" ON cars;
DROP POLICY IF EXISTS "Staff and admin can manage cars" ON cars;

DROP POLICY IF EXISTS "Users can view their own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can create bookings" ON bookings;
DROP POLICY IF EXISTS "Users can cancel their own bookings" ON bookings;
DROP POLICY IF EXISTS "Staff and admin can view all bookings" ON bookings;
DROP POLICY IF EXISTS "Staff and admin can update bookings" ON bookings;
DROP POLICY IF EXISTS "Users can manage bookings" ON bookings;

DROP POLICY IF EXISTS "Users can view their own payments" ON payments;
DROP POLICY IF EXISTS "Staff and admin can view all payments" ON payments;
DROP POLICY IF EXISTS "System can create payments" ON payments;
DROP POLICY IF EXISTS "Staff and admin can update payments" ON payments;
DROP POLICY IF EXISTS "All users can manage payments" ON payments;

DROP POLICY IF EXISTS "Users can view their own refunds" ON refunds;
DROP POLICY IF EXISTS "Users can create refund requests" ON refunds;
DROP POLICY IF EXISTS "Staff and admin can manage refunds" ON refunds;
DROP POLICY IF EXISTS "All users can manage refunds" ON refunds;

-- Profiles table policies
CREATE POLICY "Users can view their own profile" ON profiles 
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles 
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Staff and admin can view all profiles" ON profiles 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND user_role IN ('staff', 'admin')
    )
  );

CREATE POLICY "Admin can update any profile" ON profiles 
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND user_role = 'admin'
    )
  );

-- Cars table policies
CREATE POLICY "Public can view available cars" ON cars 
  FOR SELECT USING (true);

CREATE POLICY "Staff and admin can manage cars" ON cars 
  FOR ALL USING (true);

-- Bookings table policies
CREATE POLICY "Users can manage bookings" ON bookings 
  FOR ALL USING (true);

-- Payments table policies
CREATE POLICY "All users can manage payments" ON payments 
  FOR ALL USING (true);

-- Refunds table policies
CREATE POLICY "All users can manage refunds" ON refunds 
  FOR ALL USING (true);