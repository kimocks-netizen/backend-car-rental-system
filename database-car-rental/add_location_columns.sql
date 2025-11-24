-- Add pickup_location and dropoff_location columns to bookings table
-- Run this SQL in your Supabase SQL Editor or database client

ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS pickup_location TEXT,
ADD COLUMN IF NOT EXISTS dropoff_location TEXT;

-- Update existing bookings with default locations (optional)
UPDATE bookings 
SET pickup_location = COALESCE(pickup_location, 'London City Center'),
    dropoff_location = COALESCE(dropoff_location, 'London City Center')
WHERE pickup_location IS NULL OR dropoff_location IS NULL;

-- Verify the columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'bookings' 
AND column_name IN ('pickup_location', 'dropoff_location');