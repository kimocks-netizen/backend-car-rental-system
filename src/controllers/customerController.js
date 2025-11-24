const balanceService = require('../services/balanceService');

const customerController = {
  async getBalance(req, res) {
    try {
      const userId = req.user.id;
      const balance = await balanceService.getCustomerBalance(userId);
      
      res.json({
        success: true,
        balance: balance
      });
    } catch (error) {
      console.error('Get balance error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  async getTransactionHistory(req, res) {
    try {
      const userId = req.user.id;
      const transactions = await balanceService.getTransactionHistory(userId);
      
      res.json({
        success: true,
        data: transactions
      });
    } catch (error) {
      console.error('Get transaction history error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
};

module.exports = customerController;