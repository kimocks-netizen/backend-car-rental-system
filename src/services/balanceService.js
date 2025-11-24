const { supabase } = require('../utils/database');

const balanceService = {
  async getCustomerBalance(userId) {
    const { data, error } = await supabase
      .from('customer_balances')
      .select('balance')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') { // Not found error
      throw new Error(error.message);
    }
    
    return data?.balance || 0;
  },

  async createOrUpdateBalance(userId, amount, transactionType, bookingId = null, description = '') {
    // Get current balance
    const currentBalance = await this.getCustomerBalance(userId);
    const newBalance = transactionType === 'refund' ? currentBalance + amount : currentBalance - amount;
    
    // Update or create balance record
    const { error: balanceError } = await supabase
      .from('customer_balances')
      .upsert({
        user_id: userId,
        balance: Math.max(0, newBalance), // Prevent negative balance
        updated_at: new Date().toISOString()
      });
    
    if (balanceError) {
      throw new Error(balanceError.message);
    }
    
    // Record transaction
    const { error: transactionError } = await supabase
      .from('balance_transactions')
      .insert({
        user_id: userId,
        booking_id: bookingId,
        transaction_type: transactionType,
        amount: amount,
        description: description
      });
    
    if (transactionError) {
      throw new Error(transactionError.message);
    }
    
    return Math.max(0, newBalance);
  },

  async processRefund(userId, bookingId, totalAmount) {
    const cancellationFee = totalAmount * 0.2;
    const refundAmount = totalAmount - cancellationFee;
    
    const newBalance = await this.createOrUpdateBalance(
      userId, 
      refundAmount, 
      'refund', 
      bookingId, 
      `Refund for cancelled booking (20% cancellation fee applied)`
    );
    
    return {
      cancellationFee,
      refundAmount,
      newBalance
    };
  },

  async getTransactionHistory(userId) {
    const { data, error } = await supabase
      .from('balance_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw new Error(error.message);
    }
    
    return data || [];
  }
};

module.exports = balanceService;