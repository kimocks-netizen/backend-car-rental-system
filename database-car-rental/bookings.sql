CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  car_id UUID REFERENCES cars(id) NOT NULL,
  manager_id UUID REFERENCES profiles(id), -- Staff who processed
  pickup_date DATE NOT NULL,
  return_date DATE NOT NULL,
  pickup_location TEXT,
  dropoff_location TEXT,
  total_days INTEGER NOT NULL,
  rental_amount DECIMAL(10,2) NOT NULL,
  deposit_amount DECIMAL(10,2) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'active', 'returned', 'completed', 'cancelled')),
  pickup_notes TEXT,
  return_notes TEXT,
  damage_level TEXT CHECK (damage_level IN ('none', 'minor', 'major')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);