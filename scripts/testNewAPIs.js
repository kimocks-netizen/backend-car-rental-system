const axios = require('axios');

const BASE_URL = process.env.API_BASE_URL;

async function testNewAPIs() {
  console.log('🔧 Testing New Car Return & Payment APIs...\n');

  try {
    // 1. Register and login
    console.log('1. Registering new user...');
    const registerData = {
      email: `test${Date.now()}@example.com`,
      password: 'password123',
      full_name: 'Test User'
    };
    
    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, registerData);
    const token = registerResponse.data.data.token;
    const headers = { Authorization: `Bearer ${token}` };
    console.log('✅ User registered and logged in\n');

    // 2. Get available cars
    console.log('2. Getting available cars...');
    const carsResponse = await axios.get(`${BASE_URL}/cars`);
    const carId = carsResponse.data.data.cars[0]?.id;
    console.log(`✅ Found car ID: ${carId}\n`);

    // 3. Create booking
    console.log('3. Creating booking...');
    const bookingData = {
      car_id: carId,
      start_date: '2024-12-20',
      end_date: '2024-12-25',
      total_amount: 500
    };
    
    const bookingResponse = await axios.post(`${BASE_URL}/bookings`, bookingData, { headers });
    const bookingId = bookingResponse.data.data.id;
    console.log(`✅ Booking created: ${bookingId}\n`);

    // 4. Pay deposit
    console.log('4. Paying deposit...');
    const depositData = {
      booking_id: bookingId,
      amount: 150,
      payment_method: 'credit_card'
    };
    
    const depositResponse = await axios.post(`${BASE_URL}/payments/deposit`, depositData, { headers });
    const paymentId = depositResponse.data.data.id;
    console.log(`✅ Deposit paid: ${paymentId}\n`);

    // 5. Update booking to active
    console.log('5. Activating booking...');
    await axios.patch(`${BASE_URL}/bookings/${bookingId}/status`, 
      { status: 'active' }, { headers });
    console.log('✅ Booking activated\n');

    // 6. 🆕 TEST NEW API: Return car
    console.log('6. 🆕 Testing NEW API: Return car...');
    const returnResponse = await axios.patch(`${BASE_URL}/bookings/${bookingId}/return`, {}, { headers });
    console.log('✅ NEW API WORKS: Car returned successfully!');
    console.log(`   Status: ${returnResponse.data.data.status}\n`);

    // 7. 🆕 TEST NEW API: Update payment status
    console.log('7. 🆕 Testing NEW API: Update payment status...');
    const paymentUpdateResponse = await axios.patch(`${BASE_URL}/payments/${paymentId}/status`, 
      { status: 'refunded' }, { headers });
    console.log('✅ NEW API WORKS: Payment status updated!');
    console.log(`   New status: ${paymentUpdateResponse.data.data.status}\n`);

    // 8. Get payment history
    console.log('8. Getting payment history...');
    const paymentsResponse = await axios.get(`${BASE_URL}/payments/${bookingId}`, { headers });
    console.log(`✅ Payment history retrieved: ${paymentsResponse.data.data.length} payments\n`);

    console.log('🎉 ALL NEW APIs WORKING PERFECTLY!');
    console.log('\n📋 Successfully Tested:');
    console.log('✅ PATCH /api/bookings/:id/return - Return car');
    console.log('✅ PATCH /api/payments/:id/status - Update payment status');
    console.log('✅ Complete car rental flow with return functionality');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data?.message || error.message);
    if (error.response?.data) {
      console.error('Response data:', error.response.data);
    }
  }
}

testNewAPIs();