CREATE TABLE cars (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  type TEXT CHECK (type IN ('sedan', 'suv', 'hatchback', 'luxury', 'van')),
  year INTEGER NOT NULL,
  daily_rate DECIMAL(10,2) NOT NULL,
  fuel_type TEXT CHECK (fuel_type IN ('petrol', 'diesel', 'electric', 'hybrid')),
  transmission TEXT CHECK (transmission IN ('manual', 'automatic')),
  capacity INTEGER NOT NULL,
  mileage INTEGER,
  availability_status TEXT DEFAULT 'available' CHECK (availability_status IN ('available', 'unavailable', 'maintenance')),
  image_url TEXT,
  description TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);