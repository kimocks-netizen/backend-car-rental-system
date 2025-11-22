const { ApiResponse } = require('../utils/apiResponse');

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Phone validation regex (international format)
const phoneRegex = /^\+?[1-9]\d{1,14}$/;

// Validate registration data
exports.validateRegistration = (req, res, next) => {
  const { email, password, full_name, phone } = req.body;
  const errors = [];

  // Email validation
  if (!email) {
    errors.push('Email is required');
  } else if (!emailRegex.test(email)) {
    errors.push('Invalid email format');
  }

  // Password validation
  if (!password) {
    errors.push('Password is required');
  } else if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  // Full name validation
  if (!full_name) {
    errors.push('Full name is required');
  } else if (full_name.trim().length < 2) {
    errors.push('Full name must be at least 2 characters long');
  }

  // Phone validation
  if (!phone) {
    errors.push('Phone number is required');
  } else if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
    errors.push('Invalid phone number format');
  }

  if (errors.length > 0) {
    return ApiResponse.error(res, 'Validation failed', 400, errors);
  }

  next();
};

// Validate login data
exports.validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email) {
    errors.push('Email is required');
  } else if (!emailRegex.test(email)) {
    errors.push('Invalid email format');
  }

  if (!password) {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    return ApiResponse.error(res, 'Validation failed', 400, errors);
  }

  next();
};

// Validate car data
exports.validateCar = (req, res, next) => {
  const { make, model, year, daily_rate, category } = req.body;
  const errors = [];

  if (!make || make.trim().length < 2) {
    errors.push('Car make is required and must be at least 2 characters');
  }

  if (!model || model.trim().length < 1) {
    errors.push('Car model is required');
  }

  if (!year || year < 1900 || year > new Date().getFullYear() + 1) {
    errors.push('Invalid year');
  }

  if (!daily_rate || daily_rate <= 0) {
    errors.push('Daily rate must be greater than 0');
  }

  if (!category) {
    errors.push('Category is required');
  }

  if (errors.length > 0) {
    return ApiResponse.error(res, 'Validation failed', 400, errors);
  }

  next();
};

// Validate booking data
exports.validateBooking = (req, res, next) => {
  const { car_id, start_date, end_date } = req.body;
  const errors = [];

  if (!car_id) {
    errors.push('Car ID is required');
  }

  if (!start_date) {
    errors.push('Start date is required');
  }

  if (!end_date) {
    errors.push('End date is required');
  }

  if (start_date && end_date) {
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (startDate < today) {
      errors.push('Start date cannot be in the past');
    }

    if (endDate <= startDate) {
      errors.push('End date must be after start date');
    }
  }

  if (errors.length > 0) {
    return ApiResponse.error(res, 'Validation failed', 400, errors);
  }

  next();
};