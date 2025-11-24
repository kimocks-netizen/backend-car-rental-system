CREATE TABLE refunds (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id) NOT NULL,
  manager_id UUID REFERENCES profiles(id) NOT NULL,
  reason TEXT NOT NULL,
  original_deposit DECIMAL(10,2) NOT NULL,
  amount_refunded DECIMAL(10,2) NOT NULL,
  refund_status TEXT DEFAULT 'pending' CHECK (refund_status IN ('pending', 'approved', 'processed', 'rejected')),
  approved_by_admin BOOLEAN DEFAULT FALSE,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);