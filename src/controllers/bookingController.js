const bookingService = require('../services/bookingService');
const balanceService = require('../services/balanceService');

const bookingController = {
  async getAllBookings(req, res) {
    try {
      const { page = 1, limit = 10, status } = req.query;
      
      // If customer, return only their bookings
      if (req.user.role === 'customer') {
        const bookings = await bookingService.getBookingsByUserId(req.user.id);
        return res.json({ success: true, data: bookings });
      }
      
      // If staff/admin, return all bookings
      const bookings = await bookingService.getAllBookings({ page, limit, status });
      res.json({ success: true, data: bookings });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async getMyBookings(req, res) {
    try {
      const bookings = await bookingService.getBookingsByUserId(req.user.id);
      res.json({ success: true, data: bookings });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async getBookingById(req, res) {
    try {
      const booking = await bookingService.getBookingById(req.params.id);
      if (!booking) {
        return res.status(404).json({ success: false, message: 'Booking not found' });
      }
      
      // Check if user owns the booking or is staff/admin
      if (booking.user_id !== req.user.id && !['admin', 'staff'].includes(req.user.role)) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }
      
      res.json({ success: true, data: booking });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async createBooking(req, res) {
    try {
      const bookingData = { ...req.body, customer_id: req.user.id };
      const booking = await bookingService.createBooking(bookingData);
      res.status(201).json({ success: true, data: booking });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async updateBookingStatus(req, res) {
    try {
      const { status } = req.body;
      const booking = await bookingService.updateBookingStatus(req.params.id, status);
      if (!booking) {
        return res.status(404).json({ success: false, message: 'Booking not found' });
      }
      res.json({ success: true, data: booking });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async cancelBooking(req, res) {
    try {
      const booking = await bookingService.getBookingById(req.params.id);
      if (!booking) {
        return res.status(404).json({ success: false, message: 'Booking not found' });
      }
      
      // Check if user owns the booking
      if (booking.user_id !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }
      
      // Process refund if requested
      let refundInfo = null;
      if (req.body.apply_cancellation_fee) {
        refundInfo = await balanceService.processRefund(
          booking.user_id,
          booking.id,
          booking.total_amount
        );
      }
      
      const cancelledBooking = await bookingService.updateBookingStatus(req.params.id, 'cancelled');
      
      res.json({ 
        success: true, 
        data: cancelledBooking,
        refund: refundInfo
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async returnCar(req, res) {
    try {
      const booking = await bookingService.returnCar(req.params.id);
      if (!booking) {
        return res.status(404).json({ success: false, message: 'Booking not found' });
      }
      res.json({ success: true, data: booking, message: 'Car returned successfully' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
};

module.exports = bookingController;