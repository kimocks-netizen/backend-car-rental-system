CREATE TABLE payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id) NOT NULL,
  payment_type TEXT CHECK (payment_type IN ('rental', 'deposit', 'refund')),
  amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT DEFAULT 'card',
  transaction_id TEXT UNIQUE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);