const { supabase } = require('../utils/database');

const bookingService = {
  async getAllBookings({ page = 1, limit = 10, status }) {
    const offset = (page - 1) * limit;
    
    let query = supabase
      .from('bookings')
      .select('*', { count: 'exact' });
    
    if (status) {
      query = query.eq('status', status);
    }
    
    const { data: bookings, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) {
      throw new Error(error.message);
    }

    return {
      bookings: bookings || [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    };
  },

  async getBookingsByUserId(userId) {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw new Error(error.message);
    }
    
    return data || [];
  },

  async getBookingById(id) {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        car:cars(id, brand, model, year, type)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      return null;
    }
    
    return data;
  },

  async createBooking(bookingData) {
    const { car_id, customer_id, start_date, end_date, total_amount } = bookingData;
    const user_id = customer_id;
    
    // Check car availability
    const { data: car } = await supabase
      .from('cars')
      .select('availability_status')
      .eq('id', car_id)
      .single();
    
    if (!car || car.availability_status !== 'available') {
      throw new Error('Car is not available for booking');
    }
    
    // Check for conflicting bookings
    const { data: conflicts } = await supabase
      .from('bookings')
      .select('id')
      .eq('car_id', car_id)
      .not('status', 'in', '(cancelled,completed)')
      .lte('start_date', end_date)
      .gte('end_date', start_date);
    
    if (conflicts && conflicts.length > 0) {
      throw new Error('Car is already booked for the selected dates');
    }
    
    // Create booking
    const { data, error } = await supabase
      .from('bookings')
      .insert({
        car_id,
        user_id,
        pickup_date: start_date,
        return_date: end_date,
        total_days: Math.ceil((new Date(end_date) - new Date(start_date)) / (1000 * 60 * 60 * 24)),
        rental_amount: total_amount,
        deposit_amount: total_amount * 0.3,
        total_amount,
        status: 'pending'
      })
      .select('*')
      .single();
    
    if (error) {
      throw new Error(error.message);
    }
    
    return data;
  },

  async updateBookingStatus(id, status) {
    const { data, error } = await supabase
      .from('bookings')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select('*')
      .single();
    
    if (error) {
      console.error('Error updating booking status:', error);
      throw new Error(`Failed to update booking status: ${error.message}`);
    }
    
    if (!data) {
      throw new Error('Booking not found or access denied');
    }
    
    return data;
  },

  async returnCar(id) {
    // Get booking details
    const booking = await this.getBookingById(id);
    if (!booking) {
      throw new Error('Booking not found');
    }
    
    if (booking.status !== 'active') {
      throw new Error('Car can only be returned from active bookings');
    }
    
    // Update booking status to returned
    const { data: updatedBooking, error: bookingError } = await supabase
      .from('bookings')
      .update({
        status: 'returned',
        actual_return_date: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select('*')
      .single();
    
    if (bookingError) {
      throw new Error(bookingError.message);
    }
    
    // Update car availability
    const { error: carError } = await supabase
      .from('cars')
      .update({ availability_status: 'available' })
      .eq('id', booking.car_id);
    
    if (carError) {
      throw new Error('Failed to update car availability');
    }
    
    return updatedBooking;
  },

  async completeInspection(id, inspectionData) {
    const { damage_level, return_notes, additional_notes, fuel_level, condition, status } = inspectionData;
    
    const { data, error } = await supabase
      .from('bookings')
      .update({
        damage_level,
        return_notes,
        pickup_notes: additional_notes, // Using pickup_notes for additional inspection notes
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select('*')
      .single();
    
    if (error) {
      throw new Error(error.message);
    }
    
    return data;
  }
};

module.exports = bookingService;