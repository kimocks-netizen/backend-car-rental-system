const { supabase } = require('../src/utils/database');
require('dotenv').config();

const seedData = async () => {
  try {
    console.log('Starting data seeding...');

    // Get existing admin user
    console.log('Getting admin user...');
    const { data: adminProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_role', 'admin')
      .single();
    
    const adminId = adminProfile?.id || '00000000-0000-0000-0000-000000000001';

    // Create sample cars
    console.log('Creating sample cars...');
    const cars = [
      {
        brand: 'Toyota',
        model: 'Camry',
        type: 'sedan',
        year: 2023,
        daily_rate: 45.00,
        fuel_type: 'petrol',
        transmission: 'automatic',
        capacity: 5,
        mileage: 15000,
        availability_status: 'available',
        image_url: '/photos/car1.jpg',
        description: 'Comfortable and reliable sedan perfect for business trips',
        created_by: adminId
      },
      {
        brand: 'Honda',
        model: 'CR-V',
        type: 'suv',
        year: 2022,
        daily_rate: 65.00,
        fuel_type: 'petrol',
        transmission: 'automatic',
        capacity: 7,
        mileage: 22000,
        availability_status: 'available',
        image_url: '/photos/car6.jpg',
        description: 'Spacious SUV ideal for family trips and adventures',
        created_by: adminId
      },
      {
        brand: 'BMW',
        model: '3 Series',
        type: 'luxury',
        year: 2023,
        daily_rate: 95.00,
        fuel_type: 'petrol',
        transmission: 'automatic',
        capacity: 5,
        mileage: 8000,
        availability_status: 'available',
        image_url: '/photos/car2.jpg',
        description: 'Premium luxury sedan with advanced features',
        created_by: adminId
      }
    ];

    const { data: insertedCars, error: carsError } = await supabase
      .from('cars')
      .insert(cars)
      .select();

    if (carsError) {
      console.log('Cars error:', carsError.message);
    } else {
      console.log(`Created ${insertedCars.length} cars`);
    }

    console.log('Data seeding completed successfully!');
    console.log('You can now test the /api/cars endpoint to see the sample cars.');

  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

seedData();