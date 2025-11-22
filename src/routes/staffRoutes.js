const express = require('express');
const staffController = require('../controllers/staffController');
const { authenticate } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

const router = express.Router();

// All staff routes require staff or admin role
router.use(authenticate, requireRole(['staff', 'admin']));

// Staff dashboard and operations
router.get('/dashboard', staffController.getDashboard);
router.put('/bookings/:id/collect', staffController.markCarCollected);
router.put('/bookings/:id/return', staffController.processCarReturn);
router.post('/refunds', staffController.createRefundRequest);
router.get('/refunds', staffController.getRefundRequests);

module.exports = router;