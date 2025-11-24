CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  cust_address TEXT,
  license_number TEXT,
  user_role TEXT DEFAULT 'customer' CHECK (user_role IN ('customer', 'staff', 'admin')),
  user_status TEXT DEFAULT 'active' CHECK (user_status IN ('active', 'suspended')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);