const bookingService = require('../services/bookingService');
const balanceService = require('../services/balanceService');
const emailService = require('../utils/emailService');

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
      
      // Send booking confirmation email
      try {
        console.log('📧 Preparing to send booking confirmation email');
        console.log('📧 Booking data for email:', { useAlternativeEmail: bookingData.useAlternativeEmail, alternativeEmail: bookingData.alternativeEmail });
        console.log('📧 User email:', req.user.email);
        
        const emailAddress = bookingData.useAlternativeEmail && bookingData.alternativeEmail 
          ? bookingData.alternativeEmail 
          : req.user.email;
        
        console.log('📧 Selected email address:', emailAddress);
        
        // Get car details for email
        const carData = await bookingService.getCarById(booking.car_id);
        console.log('📧 Car data for email:', carData);
        
        console.log('📧 Sending booking confirmation email to:', emailAddress);
        await emailService.sendBookingConfirmationEmail(emailAddress, booking, carData);
        console.log('✅ Booking confirmation email sent successfully');
      } catch (emailError) {
        console.error('❌ Failed to send booking confirmation email:', emailError);
        // Don't fail the booking if email fails
      }
      
      res.status(201).json({ success: true, data: booking });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async updateBookingStatus(req, res) {
    try {
      const { status } = req.body;
      
      // Get booking details before update
      const existingBooking = await bookingService.getBookingById(req.params.id);
      if (!existingBooking) {
        return res.status(404).json({ success: false, message: 'Booking not found' });
      }
      
      // If staff/admin is cancelling a booking, process full refund
      if (status === 'cancelled' && ['admin', 'staff'].includes(req.user.role)) {
        // Process full refund (100%) for staff cancellations
        await balanceService.processFullRefund(
          existingBooking.user_id,
          existingBooking.id,
          existingBooking.total_amount
        );
      }
      
      const booking = await bookingService.updateBookingStatus(req.params.id, status);
      
      // Send email notifications for status changes
      try {
        const userEmail = await bookingService.getUserEmail(booking.user_id);
        const carData = await bookingService.getCarById(booking.car_id);
        
        if (status === 'confirmed') {
          await emailService.sendBookingApprovedEmail(userEmail, booking, carData);
        } else if (status === 'active') {
          await emailService.sendBookingActiveEmail(userEmail, booking, carData);
        } else if (status === 'cancelled') {
          await emailService.sendBookingCancelledEmail(userEmail, booking, carData);
        }
      } catch (emailError) {
        console.error('Failed to send status update email:', emailError);
        // Don't fail the status update if email fails
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
  },

  async completeReturnInspection(req, res) {
    try {
      const { damage_level, return_notes, additional_notes, fuel_level, condition, damage_charge } = req.body;
      
      const booking = await bookingService.getBookingById(req.params.id);
      if (!booking) {
        return res.status(404).json({ success: false, message: 'Booking not found' });
      }
      
      // Update booking with inspection data
      const updatedBooking = await bookingService.completeInspection(req.params.id, {
        damage_level: damage_level || null,
        return_notes: return_notes || null,
        additional_notes,
        fuel_level,
        condition,
        status: 'completed'
      });
      
      // If there's damage charge, deduct from customer balance
      if (damage_charge > 0) {
        await balanceService.chargeDamage(
          booking.user_id,
          booking.id,
          damage_charge,
          return_notes || 'Damage assessment charge'
        );
      }
      
      res.json({ 
        success: true, 
        data: updatedBooking,
        damage_charge: damage_charge || 0,
        message: 'Return inspection completed successfully'
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
};

module.exports = bookingController;