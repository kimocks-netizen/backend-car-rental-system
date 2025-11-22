const { supabase } = require('../src/utils/database');
require('dotenv').config();

const seedBookings = async () => {
  try {
    console.log('Starting booking data seeding...');

    // Get existing customer
    const { data: customer } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_role', 'customer')
      .single();

    if (!customer) {
      console.log('No customer found. Please create a customer first.');
      return;
    }

    // Get available cars
    const { data: cars } = await supabase
      .from('cars')
      .select('id, brand, model, daily_rate')
      .eq('availability_status', 'available')
      .limit(3);

    if (!cars || cars.length === 0) {
      console.log('No cars available for booking.');
      return;
    }

    console.log(`Found customer: ${customer.id}`);
    console.log(`Found ${cars.length} available cars`);

    // Create sample bookings
    const bookings = [
      {
        car_id: cars[0].id,
        user_id: customer.id,
        pickup_date: '2024-02-15',
        return_date: '2024-02-18',
        total_days: 3,
        rental_amount: cars[0].daily_rate * 3,
        deposit_amount: cars[0].daily_rate * 3 * 0.3,
        total_amount: cars[0].daily_rate * 3,
        status: 'confirmed'
      },
      {
        car_id: cars[1].id,
        user_id: customer.id,
        pickup_date: '2024-03-01',
        return_date: '2024-03-05',
        total_days: 4,
        rental_amount: cars[1].daily_rate * 4,
        deposit_amount: cars[1].daily_rate * 4 * 0.3,
        total_amount: cars[1].daily_rate * 4,
        status: 'pending'
      }
    ];

    const { data: insertedBookings, error: bookingError } = await supabase
      .from('bookings')
      .insert(bookings)
      .select();

    if (bookingError) {
      console.log('Booking error:', bookingError.message);
      return;
    }

    console.log(`Created ${insertedBookings.length} bookings`);

    // Create sample payments for confirmed booking
    if (insertedBookings.length > 0) {
      const payments = [
        {
          booking_id: insertedBookings[0].id,
          amount: insertedBookings[0].total_amount * 0.3, // 30% deposit
          payment_type: 'deposit',
          payment_method: 'credit_card',
          transaction_id: `dep_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          status: 'completed'
        },
        {
          booking_id: insertedBookings[0].id,
          amount: insertedBookings[0].total_amount * 0.7, // Remaining 70%
          payment_type: 'rental',
          payment_method: 'credit_card',
          transaction_id: `rent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          status: 'completed'
        }
      ];

      const { data: insertedPayments, error: paymentError } = await supabase
        .from('payments')
        .insert(payments)
        .select();

      if (paymentError) {
        console.log('Payment error:', paymentError.message);
      } else {
        console.log(`Created ${insertedPayments.length} payments`);
      }
    }

    console.log('Booking data seeding completed successfully!');
    console.log('\nSample data created:');
    console.log('- 2 bookings (1 confirmed, 1 pending)');
    console.log('- 2 payments for the confirmed booking');
    console.log('\nYou can now test:');
    console.log('- GET /api/bookings (as customer)');
    console.log('- GET /api/payments/:bookingId');

  } catch (error) {
    console.error('Error seeding booking data:', error);
  }
};

seedBookings();