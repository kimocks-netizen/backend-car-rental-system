const express = require('express');
const paymentController = require('../controllers/paymentController');
const { authenticate } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

const router = express.Router();

// All payment routes require authentication
router.use(authenticate);

// Payment routes
router.post('/deposit', paymentController.payDeposit);
router.post('/rental', paymentController.payRental);
router.post('/refund', requireRole(['admin', 'staff']), paymentController.processRefund);
router.patch('/:id/status', requireRole(['admin', 'staff']), paymentController.updatePaymentStatus);
router.get('/:bookingId', paymentController.getPaymentHistory);

module.exports = router;