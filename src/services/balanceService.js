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
    
    // Try to update existing record first
    const { data: existingRecord } = await supabase
      .from('customer_balances')
      .select('user_id')
      .eq('user_id', userId)
      .single();
    
    let balanceError;
    if (existingRecord) {
      // Update existing record
      const { error } = await supabase
        .from('customer_balances')
        .update({
          balance: Math.max(0, newBalance),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);
      balanceError = error;
    } else {
      // Create new record
      const { error } = await supabase
        .from('customer_balances')
        .insert({
          user_id: userId,
          balance: Math.max(0, newBalance),
          updated_at: new Date().toISOString()
        });
      balanceError = error;
    }
    
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

  async processFullRefund(userId, bookingId, totalAmount) {
    const newBalance = await this.createOrUpdateBalance(
      userId, 
      totalAmount, 
      'refund', 
      bookingId, 
      `Full refund for booking cancelled by staff`
    );
    
    return {
      cancellationFee: 0,
      refundAmount: totalAmount,
      newBalance
    };
  },

  async chargeDamage(userId, bookingId, damageAmount, damageDescription) {
    const newBalance = await this.createOrUpdateBalance(
      userId, 
      damageAmount, 
      'charge', 
      bookingId, 
      `Damage assessment charge: ${damageDescription}`
    );
    
    return {
      chargeAmount: damageAmount,
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