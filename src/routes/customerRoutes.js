const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { authenticate } = require('../middleware/authMiddleware');

// Get customer balance
router.get('/balance', authenticate, customerController.getBalance);

// Get transaction history
router.get('/transactions', authenticate, customerController.getTransactionHistory);

module.exports = router;