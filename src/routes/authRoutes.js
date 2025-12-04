const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');
const { validateRegistration } = require('../middleware/validationMiddleware');

//Public routes
router.post('/register', validateRegistration, authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// Protected routes
router.get('/me', authenticate, authController.getProfile);
router.put('/profile', authenticate, authController.updateProfile);
router.put('/change-password', authenticate, authController.changePassword);
router.delete('/delete-account', authenticate, authController.deleteAccount);

module.exports = router;