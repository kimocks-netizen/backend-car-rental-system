const { validateUserRegistration, validateCarData, validateBookingData, validatePaymentData } = require('../utils/validation');

const validateRegistration = (req, res, next) => {
  const errors = validateUserRegistration(req.body);
  
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }
  
  next();
};

const validateCar = (req, res, next) => {
  const errors = validateCarData(req.body);
  
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }
  
  next();
};

const validateBooking = (req, res, next) => {
  const errors = validateBookingData(req.body);
  
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }
  
  next();
};

const validatePayment = (req, res, next) => {
  const errors = validatePaymentData(req.body);
  
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }
  
  next();
};

module.exports = {
  validateRegistration,
  validateCar,
  validateBooking,
  validatePayment
};