const { supabase } = require('../utils/database');

const paymentService = {
  async createPayment(paymentData) {
    const { booking_id, amount, payment_type, payment_method, transaction_id } = paymentData;
    
    const { data, error } = await supabase
      .from('payments')
      .insert({
        booking_id,
        amount,
        payment_type,
        payment_method,
        transaction_id,
        status: 'completed'
      })
      .select('*')
      .single();
    
    if (error) {
      throw new Error(error.message);
    }
    
    return data;
  },

  async getPaymentsByBookingId(bookingId) {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('booking_id', bookingId)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw new Error(error.message);
    }
    
    return data || [];
  },

  async processRefund(paymentId, refundAmount) {
    // Get original payment
    const { data: originalPayment } = await supabase
      .from('payments')
      .select('booking_id')
      .eq('id', paymentId)
      .single();
    
    if (!originalPayment) {
      throw new Error('Original payment not found');
    }
    
    // Create refund record
    const { data, error } = await supabase
      .from('payments')
      .insert({
        booking_id: originalPayment.booking_id,
        amount: -Math.abs(refundAmount),
        payment_type: 'refund',
        status: 'completed',
        reference_payment_id: paymentId
      })
      .select('*')
      .single();
    
    if (error) {
      throw new Error(error.message);
    }
    
    return data;
  },

  async getTotalPayments(bookingId) {
    const { data } = await supabase
      .from('payments')
      .select('amount')
      .eq('booking_id', bookingId)
      .eq('status', 'completed');
    
    return data?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
  },

  async updatePaymentStatus(id, status) {
    const { data, error } = await supabase
      .from('payments')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select('*')
      .single();
    
    if (error) {
      return null;
    }
    
    return data;
  }
};

module.exports = paymentService;