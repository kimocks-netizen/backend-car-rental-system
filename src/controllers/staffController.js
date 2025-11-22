const { supabase } = require('../utils/database');
const bookingService = require('../services/bookingService');

const staffController = {
  async getDashboard(req, res) {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Get today's collections and returns
      const { count: collectionsCount } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('start_date', today)
        .eq('status', 'confirmed');
      
      const { count: returnsCount } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('end_date', today)
        .eq('status', 'active');
      
      // Get pending bookings
      const { count: pendingCount } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');
      
      // Get cars in maintenance
      const { count: maintenanceCount } = await supabase
        .from('cars')
        .select('*', { count: 'exact', head: true })
        .eq('availability_status', 'maintenance');
      
      res.json({
        success: true,
        data: {
          todayCollections: collectionsCount || 0,
          todayReturns: returnsCount || 0,
          pendingBookings: pendingCount || 0,
          carsInMaintenance: maintenanceCount || 0
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async markCarCollected(req, res) {
    try {
      const booking = await bookingService.updateBookingStatus(req.params.id, 'active');
      if (!booking) {
        return res.status(404).json({ success: false, message: 'Booking not found' });
      }
      res.json({ success: true, data: booking });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async processCarReturn(req, res) {
    try {
      const { condition_notes, additional_charges } = req.body;
      
      // Update booking status
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .update({
          status: 'completed',
          condition_notes,
          additional_charges: additional_charges || 0,
          updated_at: new Date().toISOString()
        })
        .eq('id', req.params.id)
        .select('*')
        .single();
      
      if (bookingError || !booking) {
        throw new Error('Booking not found');
      }
      
      // Update car availability
      await supabase
        .from('cars')
        .update({ availability_status: 'available' })
        .eq('id', booking.car_id);
      
      res.json({ success: true, data: booking });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async createRefundRequest(req, res) {
    try {
      const { booking_id, amount, reason } = req.body;
      
      const { data: refundRequest, error } = await supabase
        .from('refund_requests')
        .insert({
          booking_id,
          amount,
          reason,
          requested_by: req.user.id,
          status: 'pending'
        })
        .select('*')
        .single();
      
      if (error) {
        throw new Error('Failed to create refund request');
      }
      
      res.status(201).json({ success: true, data: refundRequest });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async getRefundRequests(req, res) {
    try {
      const { data: refundRequests, error } = await supabase
        .from('refund_requests')
        .select(`
          *,
          bookings!inner(id, car_id, customer_id,
            cars!inner(brand, model),
            profiles!inner(full_name)
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw new Error('Failed to fetch refund requests');
      }
      
      res.json({ success: true, data: refundRequests });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

module.exports = staffController;