const express = require('express');
const carController = require('../controllers/carController');
const { authenticate } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const { uploadCarImages } = require('../middleware/uploadMiddleware');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

// Public routes
router.get('/', carController.getAllCars);
router.get('/search', carController.searchCars);
router.get('/availability', carController.checkAvailability);
router.get('/:id', carController.getCarById);

// Protected routes - Admin/Staff only (temporarily disabled auth for testing)
router.post('/', carController.createCar);
// router.post('/', authenticate, requireRole(['admin', 'staff']), carController.createCar);
router.put('/:id', authenticate, requireRole(['admin', 'staff']), carController.updateCar);
router.delete('/:id', authenticate, requireRole(['admin']), carController.deleteCar);
router.patch('/:id/status', authenticate, requireRole(['admin', 'staff']), carController.updateCarStatus);

// Image upload route
router.post('/upload-image', authenticate, requireRole(['admin', 'staff']), upload.single('image'), carController.uploadCarImage);

module.exports = router;