-- Update car type constraint to include coupe
ALTER TABLE cars DROP CONSTRAINT cars_type_check;
ALTER TABLE cars ADD CONSTRAINT cars_type_check CHECK (type IN ('sedan', 'suv', 'hatchback', 'coupe', 'luxury', 'van'));