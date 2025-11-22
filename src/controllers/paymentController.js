const paymentService = require('../services/paymentService');
const emailService = require('../services/emailService');

const paymentController = {
  async payDeposit(req, res) {
    try {
      const { booking_id, amount, payment_method } = req.body;
      
      const payment = await paymentService.createPayment({
        booking_id,
        amount,
        payment_type: 'deposit',
        payment_method,
        transaction_id: `dep_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      });
      
      res.status(201).json({ success: true, data: payment });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async payRental(req, res) {
    try {
      const { booking_id, amount, payment_method } = req.body;
      
      const payment = await paymentService.createPayment({
        booking_id,
        amount,
        payment_type: 'rental',
        payment_method,
        transaction_id: `rent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      });
      
      res.status(201).json({ success: true, data: payment });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async processRefund(req, res) {
    try {
      const { payment_id, amount } = req.body;
      
      const refund = await paymentService.processRefund(payment_id, amount);
      
      res.json({ success: true, data: refund });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async getPaymentHistory(req, res) {
    try {
      const payments = await paymentService.getPaymentsByBookingId(req.params.bookingId);
      res.json({ success: true, data: payments });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async updatePaymentStatus(req, res) {
    try {
      const { status } = req.body;
      const payment = await paymentService.updatePaymentStatus(req.params.id, status);
      if (!payment) {
        return res.status(404).json({ success: false, message: 'Payment not found' });
      }
      res.json({ success: true, data: payment });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
};

module.exports = paymentController;