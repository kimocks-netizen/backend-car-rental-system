-- Add inventory fields to cars table
ALTER TABLE cars 
ADD COLUMN total_quantity INTEGER DEFAULT 1,
ADD COLUMN available_quantity INTEGER DEFAULT 1;

-- Update existing cars to have default quantities
UPDATE cars 
SET total_quantity = 1, available_quantity = 1 
WHERE total_quantity IS NULL OR available_quantity IS NULL;