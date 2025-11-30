const { supabase, uploadCarImage, getPublicUrl } = require('../utils/database');

const carService = {
  async getAllCars({ page = 1, limit = 10, type, fuel_type, availability_status, transmission, min_rate, max_rate, search, sortField = 'created_at', sortDirection = 'desc' }) {
    const offset = (page - 1) * limit;
    
    let query = supabase.from('cars').select('*', { count: 'exact' });
    
    if (search) {
      query = query.or(`brand.ilike.%${search}%,model.ilike.%${search}%`);
    }
    
    if (type) {
      query = query.eq('type', type);
    }
    
    if (fuel_type) {
      query = query.eq('fuel_type', fuel_type);
    }
    
    if (availability_status) {
      query = query.eq('availability_status', availability_status);
    }
    
    if (transmission) {
      query = query.eq('transmission', transmission);
    }
    
    if (min_rate) {
      query = query.gte('daily_rate', min_rate);
    }
    
    if (max_rate) {
      query = query.lte('daily_rate', max_rate);
    }
    
    const ascending = sortDirection === 'asc';
    const { data: cars, error, count } = await query
      .order(sortField, { ascending })
      .range(offset, offset + limit - 1);
    
    if (error) {
      throw new Error(error.message);
    }

    // Get active bookings for these cars to calculate real-time availability
    const carIds = cars.map(car => car.id);
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('car_id')
      .in('car_id', carIds)
      .in('status', ['pending', 'confirmed', 'active']);
    
    if (bookingsError) {
      console.error('Error fetching bookings for availability calculation:', bookingsError);
    }
    
    // Calculate real-time availability for each car
    const carsWithAvailability = cars.map(car => {
      const carBookings = bookings ? bookings.filter(booking => booking.car_id === car.id) : [];
      const totalQuantity = car.total_quantity || 1;
      const bookedCount = carBookings.length;
      const availableQuantity = Math.max(0, totalQuantity - bookedCount);
      
      return {
        ...car,
        available_quantity: availableQuantity,
        total_quantity: totalQuantity
      };
    });

    return {
      cars: carsWithAvailability || [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    };
  },

  async getCarById(id) {
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      return null;
    }
    
    return data;
  },

  async createCar(carData) {
    const {
      brand, model, type, year, daily_rate, fuel_type,
      transmission, capacity, mileage, description, created_by, image_url,
      total_quantity, available_quantity
    } = carData;

    console.log('Creating car with image_url:', image_url);
    
    const { data, error } = await supabase
      .from('cars')
      .insert({
        brand, model, type, year, daily_rate, fuel_type,
        transmission, capacity, mileage, 
        image_url: image_url || null,
        description, created_by,
        total_quantity: total_quantity || 1,
        available_quantity: available_quantity || 1
      })
      .select('*')
      .single();

    if (error) {
      console.error('Database insert error:', error);
      throw new Error(error.message);
    }

    return data;
  },

  async updateCar(id, carData) {
    const {
      brand, model, type, year, daily_rate, fuel_type,
      transmission, capacity, mileage, image_url, description
    } = carData;

    const { data, error } = await supabase
      .from('cars')
      .update({
        brand, model, type, year, daily_rate, fuel_type,
        transmission, capacity, mileage, image_url, description,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      return null;
    }

    return data;
  },

  async deleteCar(id) {
    const { error } = await supabase
      .from('cars')
      .delete()
      .eq('id', id);
    
    return !error;
  },

  async updateCarStatus(id, availability_status) {
    const { data, error } = await supabase
      .from('cars')
      .update({
        availability_status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select('*')
      .single();
    
    if (error) {
      return null;
    }
    
    return data;
  },

  async searchCars({ q, type, fuel_type, min_rate, max_rate }) {
    let query = supabase
      .from('cars')
      .select('*')
      .eq('availability_status', 'available');

    if (q) {
      query = query.or(`brand.ilike.%${q}%,model.ilike.%${q}%`);
    }

    if (type) {
      query = query.eq('type', type);
    }

    if (fuel_type) {
      query = query.eq('fuel_type', fuel_type);
    }

    if (min_rate) {
      query = query.gte('daily_rate', min_rate);
    }

    if (max_rate) {
      query = query.lte('daily_rate', max_rate);
    }

    const { data, error } = await query.order('daily_rate', { ascending: true });
    
    if (error) {
      throw new Error(error.message);
    }
    
    return data || [];
  },

  async checkAvailability(carId, startDate, endDate) {
    // Check if car exists and is available
    const { data: car } = await supabase
      .from('cars')
      .select('availability_status')
      .eq('id', carId)
      .single();
    
    if (!car || car.availability_status !== 'available') {
      return false;
    }
    
    // Check for conflicting bookings
    const { data: conflicts } = await supabase
      .from('bookings')
      .select('id')
      .eq('car_id', carId)
      .not('status', 'in', '(cancelled,completed)')
      .lte('start_date', endDate)
      .gte('end_date', startDate);
    
    return !conflicts || conflicts.length === 0;
  },

  async getAvailableCars({ page = 1, limit = 10, type, fuel_type, transmission, min_rate, max_rate, q } = {}) {
    const offset = (page - 1) * limit;
    
    // Build query with filters
    let query = supabase.from('cars').select('*', { count: 'exact' });
    
    if (q) {
      query = query.or(`brand.ilike.%${q}%,model.ilike.%${q}%`);
    }
    
    if (type) {
      query = query.eq('type', type);
    }
    
    if (fuel_type) {
      query = query.eq('fuel_type', fuel_type);
    }
    
    if (transmission) {
      query = query.eq('transmission', transmission);
    }
    
    if (min_rate) {
      query = query.gte('daily_rate', min_rate);
    }
    
    if (max_rate) {
      query = query.lte('daily_rate', max_rate);
    }
    
    const { data: cars, error: carsError, count } = await query
      .order('daily_rate', { ascending: true })
      .range(offset, offset + limit - 1);
    
    if (carsError) {
      throw new Error(carsError.message);
    }
    
    // Get active bookings for these cars
    const carIds = cars.map(car => car.id);
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('car_id')
      .in('car_id', carIds)
      .in('status', ['pending', 'confirmed', 'active']);
    
    if (bookingsError) {
      throw new Error(bookingsError.message);
    }
    
    // Calculate real-time availability for each car
    const carsWithAvailability = cars.map(car => {
      const carBookings = bookings ? bookings.filter(booking => booking.car_id === car.id) : [];
      const totalQuantity = car.total_quantity || 1;
      const bookedCount = carBookings.length;
      const availableQuantity = Math.max(0, totalQuantity - bookedCount);
      
      return {
        ...car,
        available_quantity: availableQuantity,
        total_quantity: totalQuantity
      };
    });
    
    return {
      cars: carsWithAvailability,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    };
  }
};

module.exports = carService;