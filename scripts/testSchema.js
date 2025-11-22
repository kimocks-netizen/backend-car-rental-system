const { supabase } = require('../src/utils/database');
require('dotenv').config();

const testSchema = async () => {
  try {
    // Test inserting a simple booking to see what columns are expected
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .limit(1);

    console.log('Existing bookings:', data);
    console.log('Error (if any):', error);

    // Try to get table schema info
    const { data: cars } = await supabase
      .from('cars')
      .select('id')
      .limit(1);

    console.log('Sample car ID:', cars?.[0]?.id);

  } catch (error) {
    console.error('Error:', error);
  }
};

testSchema();