-- Update bookings table for new damage assessment system
-- Change damage_level from TEXT to INTEGER (1-10 scale)
ALTER TABLE bookings 
DROP CONSTRAINT IF EXISTS bookings_damage_level_check;

ALTER TABLE bookings 
ALTER COLUMN damage_level TYPE INTEGER USING NULL;

ALTER TABLE bookings 
ADD CONSTRAINT damage_level_range CHECK (damage_level >= 1 AND damage_level <= 10 OR damage_level IS NULL);

-- Add comment for clarity
COMMENT ON COLUMN bookings.damage_level IS 'Damage level from 1-10 where each level represents 10% charge of total booking amount';
COMMENT ON COLUMN bookings.return_notes IS 'Comma-separated damage types: Scratches,Dents,Interior Damage,Mechanical Issues,Missing Items';