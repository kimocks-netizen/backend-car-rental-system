-- Add pickup and dropoff location fields to bookings table
ALTER TABLE bookings 
ADD COLUMN pickup_location TEXT,
ADD COLUMN dropoff_location TEXT;

-- Update existing bookings with default locations (optional)
UPDATE bookings 
SET pickup_location = 'London City Center',
    dropoff_location = 'London City Center'
WHERE pickup_location IS NULL;