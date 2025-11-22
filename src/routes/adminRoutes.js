const express = require('express');
const adminController = require('../controllers/adminController');
const { authenticate } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

const router = express.Router();

// All admin routes require admin role
router.use(authenticate, requireRole(['admin']));

// Admin dashboard and management
router.get('/dashboard', adminController.getDashboard);
router.get('/users', adminController.getAllUsers);
router.put('/users/:id/role', adminController.updateUserRole);
router.put('/users/:id/status', adminController.updateUserStatus);
router.get('/reports', adminController.generateReports);
router.put('/refunds/:id', adminController.handleRefundRequest);

module.exports = router;