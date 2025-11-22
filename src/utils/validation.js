const { isValidEmail, isValidPhone } = require('./helpers');
const { USER_ROLES, CAR_TYPES, FUEL_TYPES, TRANSMISSION_TYPES } = require('./constants');

const validateUserRegistration = (userData) => {
  const errors = [];
  
  if (!userData.email || !isValidEmail(userData.email)) {
    errors.push('Valid email is required');
  }
  
  if (!userData.password || userData.password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }
  
  if (!userData.full_name || userData.full_name.trim().length < 2) {
    errors.push('Full name must be at least 2 characters long');
  }
  
  if (userData.phone && !isValidPhone(userData.phone)) {
    errors.push('Invalid phone number format');
  }
  
  return errors;
};

const validateCarData = (carData) => {
  const errors = [];
  
  if (!carData.brand || carData.brand.trim().length < 2) {
    errors.push('Brand is required and must be at least 2 characters');
  }
  
  if (!carData.model || carData.model.trim().length < 1) {
    errors.push('Model is required');
  }
  
  if (!carData.type || !Object.values(CAR_TYPES).includes(carData.type)) {
    errors.push('Valid car type is required');
  }
  
  if (!carData.year || carData.year < 1990 || carData.year > new Date().getFullYear() + 1) {
    errors.push('Valid year is required');
  }
  
  if (!carData.daily_rate || carData.daily_rate <= 0) {
    errors.push('Daily rate must be greater than 0');
  }
  
  if (!carData.fuel_type || !Object.values(FUEL_TYPES).includes(carData.fuel_type)) {
    errors.push('Valid fuel type is required');
  }
  
  if (!carData.transmission || !Object.values(TRANSMISSION_TYPES).includes(carData.transmission)) {
    errors.push('Valid transmission type is required');
  }
  
  if (!carData.capacity || carData.capacity < 1 || carData.capacity > 50) {
    errors.push('Capacity must be between 1 and 50');
  }
  
  return errors;
};

const validateBookingData = (bookingData) => {
  const errors = [];
  
  if (!bookingData.car_id) {
    errors.push('Car ID is required');
  }
  
  if (!bookingData.start_date) {
    errors.push('Start date is required');
  }
  
  if (!bookingData.end_date) {
    errors.push('End date is required');
  }
  
  if (bookingData.start_date && bookingData.end_date) {
    const startDate = new Date(bookingData.start_date);
    const endDate = new Date(bookingData.end_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (startDate < today) {
      errors.push('Start date cannot be in the past');
    }
    
    if (endDate <= startDate) {
      errors.push('End date must be after start date');
    }
  }
  
  if (!bookingData.total_amount || bookingData.total_amount <= 0) {
    errors.push('Total amount must be greater than 0');
  }
  
  return errors;
};

const validatePaymentData = (paymentData) => {
  const errors = [];
  
  if (!paymentData.booking_id) {
    errors.push('Booking ID is required');
  }
  
  if (!paymentData.amount || paymentData.amount <= 0) {
    errors.push('Amount must be greater than 0');
  }
  
  if (!paymentData.payment_method) {
    errors.push('Payment method is required');
  }
  
  return errors;
};

module.exports = {
  validateUserRegistration,
  validateCarData,
  validateBookingData,
  validatePaymentData
};