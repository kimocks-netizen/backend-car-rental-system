const express = require('express');
const bookingController = require('../controllers/bookingController');
const { authenticate } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

const router = express.Router();

// All booking routes require authentication
router.use(authenticate);

// Customer routes
router.get('/my-bookings', bookingController.getMyBookings);
router.post('/', bookingController.createBooking);
router.get('/:id', bookingController.getBookingById);
router.patch('/:id/cancel', bookingController.cancelBooking);

// All users can get bookings (customers get their own, staff/admin get all)
router.get('/', bookingController.getAllBookings);

// Staff/Admin routes
router.patch('/:id/status', requireRole(['admin', 'staff']), bookingController.updateBookingStatus);
router.patch('/:id/return', requireRole(['admin', 'staff']), bookingController.returnCar);
router.patch('/:id/complete-return', requireRole(['admin', 'staff']), bookingController.completeReturnInspection);

module.exports = router;