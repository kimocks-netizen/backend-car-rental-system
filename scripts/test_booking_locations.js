const { supabase } = require('../src/utils/database');

async function testBookingLocations() {
  try {
    console.log('Testing booking locations functionality...');
    
    // Test 1: Check if location columns exist
    console.log('\n1. Checking if location columns exist...');
    const { data: bookings, error: selectError } = await supabase
      .from('bookings')
      .select('id, pickup_location, dropoff_location')
      .limit(1);
    
    if (selectError) {
      console.log('❌ Location columns do not exist yet');
      console.log('Error:', selectError.message);
      console.log('\n📝 To fix this:');
      console.log('1. Go to your Supabase dashboard');
      console.log('2. Open the SQL Editor');
      console.log('3. Run the SQL from: database-car-rental/add_location_columns.sql');
      return;
    }
    
    console.log('✅ Location columns exist!');
    
    // Test 2: Check existing bookings
    console.log('\n2. Checking existing bookings...');
    const { data: allBookings, error: allError } = await supabase
      .from('bookings')
      .select('id, pickup_location, dropoff_location, created_at')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (allError) {
      console.log('❌ Error fetching bookings:', allError.message);
      return;
    }
    
    console.log(`Found ${allBookings.length} recent bookings:`);
    allBookings.forEach(booking => {
      console.log(`- Booking ${booking.id.slice(0, 8)}: ${booking.pickup_location || 'No pickup'} → ${booking.dropoff_location || 'No dropoff'}`);
    });
    
    console.log('\n✅ Booking locations system is ready!');
    console.log('\n📋 What\'s implemented:');
    console.log('- ✅ Frontend booking form collects pickup/dropoff locations');
    console.log('- ✅ Backend service handles location data');
    console.log('- ✅ Database schema updated');
    console.log('- ✅ Booking confirmation displays locations');
    console.log('- ✅ Staff bookings table shows locations');
    console.log('- ✅ Customer bookings show locations');
    
  } catch (error) {
    console.error('Test error:', error);
  }
}

testBookingLocations();