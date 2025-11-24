const { supabase } = require('../src/utils/database');

async function migrateBookingLocations() {
  try {
    console.log('Adding pickup_location and dropoff_location columns to bookings table...');
    
    // Try to add columns (will fail silently if they already exist)
    try {
      const { error: error1 } = await supabase.rpc('exec_sql', {
        sql: 'ALTER TABLE bookings ADD COLUMN pickup_location TEXT;'
      });
      if (error1 && !error1.message.includes('already exists')) {
        console.error('Error adding pickup_location:', error1);
      } else {
        console.log('Added pickup_location column (or already exists)');
      }
    } catch (e) {
      console.log('pickup_location column may already exist');
    }
    
    try {
      const { error: error2 } = await supabase.rpc('exec_sql', {
        sql: 'ALTER TABLE bookings ADD COLUMN dropoff_location TEXT;'
      });
      if (error2 && !error2.message.includes('already exists')) {
        console.error('Error adding dropoff_location:', error2);
      } else {
        console.log('Added dropoff_location column (or already exists)');
      }
    } catch (e) {
      console.log('dropoff_location column may already exist');
    }
    
    // Test if we can query the new columns
    const { data: testData, error: testError } = await supabase
      .from('bookings')
      .select('id, pickup_location, dropoff_location')
      .limit(1);
    
    if (testError) {
      console.error('Columns may not exist yet:', testError);
    } else {
      console.log('Columns are accessible, migration successful!');
      console.log('Sample data:', testData);
    }
    
  } catch (error) {
    console.error('Migration error:', error);
  }
}

migrateBookingLocations();